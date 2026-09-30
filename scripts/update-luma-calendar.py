#!/usr/bin/env python3
"""Fetch the public JujuyDev Luma calendar and write the fields the site renders.

The browser cannot call api.lu.ma (CORS only allows https://luma.com), and main
is protected, so a scheduled workflow publishes this JSON on the luma-calendar
branch. The page reads that file and falls back to assets/eventos/proximos.json.
"""

import json
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone

CALENDAR_ID = "cal-6uikyEp5iGq89tc"
API = "https://api.lu.ma/calendar/get-items"
TZ_FALLBACK = "America/Argentina/Jujuy"


def fetch_entries():
    entries = []
    cursor = None
    for _ in range(10):
        params = {
            "calendar_api_id": CALENDAR_ID,
            "period": "future",
            "pagination_limit": "50",
        }
        if cursor:
            params["pagination_cursor"] = cursor
        url = API + "?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={"User-Agent": "jujuy.dev"})
        with urllib.request.urlopen(req, timeout=30) as res:
            data = json.load(res)
        entries.extend(data.get("entries") or [])
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
    end_dt = datetime.fromisoformat(end.replace("Z", "+00:00"))
    if end_dt < datetime.now(timezone.utc):
        return None
    cover = event.get("cover_url") or ""
    if not cover.startswith("https://images.lumacdn.com/"):
        cover = ""
    where = event.get("location_type") if event.get("location_type") in ("offline", "online", "hybrid") else ""
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


def build():
    rows = []
    for entry in fetch_entries():
        row = row_of(entry)
        if row:
            rows.append(row)
    rows.sort(key=lambda row: row["start"])
    return {"events": rows}


def main():
    dest = sys.argv[1] if len(sys.argv) > 1 else "assets/eventos/proximos.json"
    payload = build()
    if not payload["events"]:
        sys.stderr.write("Luma no devolvió encuentros próximos; no reescribo el archivo.\n")
        return 1
    text = json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    with open(dest, "w", encoding="utf-8") as handle:
        handle.write(text)
    print("eventos: " + str(len(payload["events"])))
    return 0


if __name__ == "__main__":
    sys.exit(main())
