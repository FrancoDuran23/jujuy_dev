#!/usr/bin/env python3
"""Fetch the public JujuyDev Luma calendar and write the fields the site renders.

The browser cannot call api.lu.ma (CORS only allows https://luma.com), and main
is protected, so a scheduled workflow publishes this JSON on the luma-calendar
branch. The page reads that file and falls back to assets/eventos/proximos.json.

The file has two lists: "events" (still to come, soonest first) and "past" (the
latest that already happened, newest first). Luma's past listing only includes
events owned by the calendar, so events featured from other calendars (e.g. one
hosted by Celo) are carried over from the file already published on the
luma-calendar branch once they end.

Usage: update-luma-calendar.py [destino.json] [--previous publicado.json]
(without --previous it reads the published file from PUBLISHED).
"""

import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

CALENDAR_ID = "cal-6uikyEp5iGq89tc"
API = "https://api.lu.ma/calendar/get-items"
TZ_FALLBACK = "America/Argentina/Jujuy"
PUBLISHED = "https://raw.githubusercontent.com/FrancoDuran23/jujuy_dev/luma-calendar/proximos.json"
PAST_LIMIT = 6
ONLINE_TYPES = ("online", "meet", "zoom")


def get_json(url):
    # Luma answers 429 when it is hit too often; retry a few times before failing.
    for attempt in range(4):
        req = urllib.request.Request(url, headers={"User-Agent": "jujuy.dev", "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as res:
                return json.load(res)
        except urllib.error.HTTPError as err:
            if err.code not in (429, 500, 502, 503, 504) or attempt == 3:
                raise
            time.sleep(15 * (attempt + 1))
    raise RuntimeError("unreachable")


def fetch_entries(period, max_pages):
    """period is "future" or "past". Luma lists past events newest first."""
    entries = []
    cursor = None
    for _ in range(max_pages):
        params = {"calendar_api_id": CALENDAR_ID, "period": period, "pagination_limit": "50" if period == "future" else "20"}
        if cursor:
            params["pagination_cursor"] = cursor
        data = get_json(API + "?" + urllib.parse.urlencode(params))
        if not isinstance(data, dict) or not isinstance(data.get("entries"), list):
            raise ValueError("Respuesta inesperada de Luma para period=" + period)
        entries.extend(data["entries"])
        cursor = data.get("next_cursor") if data.get("has_more") else None
        if not cursor:
            break
    return entries


def place_of(event):
    if event.get("location_type") not in ("offline", "hybrid"):
        return ""
    geo = event.get("geo_address_info") or {}
    localized = geo.get("localized") or {}
    loc = localized.get("es") or localized.get("es-419") or {}
    address = (loc.get("address") or geo.get("address") or "").strip()
    city = (loc.get("city") or geo.get("city") or "").strip()
    if address and city and city.casefold() not in address.casefold():
        return address + " · " + city
    return address or city


def where_of(event):
    kind = event.get("location_type")
    if kind in ("offline", "hybrid"):
        return kind
    if kind in ONLINE_TYPES:
        return "online"
    return ""


def ended(row):
    end = datetime.fromisoformat(row["end"].replace("Z", "+00:00"))
    return end < datetime.now(timezone.utc)


def row_of(entry):
    event = entry.get("event") or {}
    name = (event.get("name") or "").strip()
    slug = (event.get("url") or "").strip()
    start = event.get("start_at")
    end = event.get("end_at") or start
    if not name or not slug or not start or not end:
        return None
    if slug.startswith("https://luma.com/") or slug.startswith("https://lu.ma/"):
        url = slug
    elif "://" in slug:
        return None
    else:
        url = "https://luma.com/" + slug.lstrip("/")
    try:
        datetime.fromisoformat(start.replace("Z", "+00:00"))
        datetime.fromisoformat(end.replace("Z", "+00:00"))
    except ValueError:
        return None
    cover = event.get("cover_url") or ""
    if not cover.startswith("https://images.lumacdn.com/"):
        cover = ""
    where = where_of(event)
    row = {
        "name": name,
        "start": start,
        "end": end,
        "timezone": event.get("timezone") or TZ_FALLBACK,
        "url": url,
        "place": place_of(event),
        "where": where,
        "cover": cover,
    }
    if entry.get("registration_availability") == "waitlist" or (entry.get("ticket_info") or {}).get("is_sold_out"):
        row["waitlist"] = True
    return row


def clean_saved(row):
    """Re-check a row from a previously published file before reusing it."""
    if not isinstance(row, dict):
        return None
    url = row.get("url") or ""
    cover = row.get("cover") or ""
    if not (url.startswith("https://luma.com/") or url.startswith("https://lu.ma/")):
        return None
    if not row.get("name") or not row.get("start") or not row.get("end"):
        return None
    try:
        datetime.fromisoformat(str(row["start"]).replace("Z", "+00:00"))
        datetime.fromisoformat(str(row["end"]).replace("Z", "+00:00"))
    except ValueError:
        return None
    keep = {key: row.get(key) or "" for key in ("name", "start", "end", "timezone", "url", "place", "where", "cover")}
    keep["timezone"] = keep["timezone"] or TZ_FALLBACK
    if not cover.startswith("https://images.lumacdn.com/"):
        keep["cover"] = ""
    return keep


def load_previous(path):
    """Rows from the previously published file; an unreadable file just means none."""
    try:
        if path:
            with open(path, encoding="utf-8") as handle:
                data = json.load(handle)
        else:
            req = urllib.request.Request(PUBLISHED, headers={"User-Agent": "jujuy.dev"})
            with urllib.request.urlopen(req, timeout=30) as res:
                data = json.load(res)
    except (OSError, ValueError):
        return []
    rows = []
    for key in ("events", "past"):
        for row in (data.get(key) or []) if isinstance(data, dict) else []:
            row = clean_saved(row)
            if row:
                rows.append(row)
    return rows


def build(previous_path=None):
    upcoming = []
    for entry in fetch_entries("future", 10):
        row = row_of(entry)
        if row and not ended(row):
            upcoming.append(row)
    upcoming.sort(key=lambda row: row["start"])

    past = {}
    for entry in fetch_entries("past", 1):
        row = row_of(entry)
        if row and ended(row):
            row.pop("waitlist", None)
            past[row["url"]] = row
    # Events featured from other calendars vanish from Luma's past list; keep the ones we already published.
    for row in load_previous(previous_path):
        if ended(row) and row["url"] not in past:
            past[row["url"]] = row
    recent = sorted(past.values(), key=lambda row: row["start"], reverse=True)[:PAST_LIMIT]
    return {"events": upcoming, "past": recent}


def main():
    args = sys.argv[1:]
    previous = None
    if "--previous" in args:
        i = args.index("--previous")
        previous = args[i + 1] if i + 1 < len(args) else None
        del args[i:i + 2]
    dest = args[0] if args else "assets/eventos/proximos.json"
    try:
        payload = build(previous)
    except (urllib.error.URLError, ValueError, OSError) as err:
        sys.stderr.write("Error al consultar Luma: " + str(err) + "\n")
        return 1
    if not payload["events"]:
        print("Luma no tiene encuentros próximos publicados; escribo la lista vacía.")
    text = json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    with open(dest, "w", encoding="utf-8") as handle:
        handle.write(text)
    print("próximos: " + str(len(payload["events"])) + " · últimos: " + str(len(payload["past"])))
    for row in payload["past"]:
        print("  " + row["start"][:10] + "  " + row["name"] + "  " + row["url"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
