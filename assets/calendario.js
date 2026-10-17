(function () {
  var lists = document.querySelectorAll("[data-upcoming-list]");
  if (!lists.length) return;

  var LIVE = "https://raw.githubusercontent.com/FrancoDuran23/jujuy_dev/luma-calendar/proximos.json";
  // Next to this script, so it works from any page depth (and from file://, where only LIVE answers).
  var SELF = document.currentScript && document.currentScript.src;
  var LOCAL = SELF ? new URL("eventos/proximos.json", SELF).href : "/assets/eventos/proximos.json";
  var WEEKDAYS = { Sun: "dom", Mon: "lun", Tue: "mar", Wed: "mié", Thu: "jue", Fri: "vie", Sat: "sáb" };
  var MONTHS = { Jan: "ene", Feb: "feb", Mar: "mar", Apr: "abr", May: "may", Jun: "jun", Jul: "jul", Aug: "ago", Sep: "sep", Oct: "oct", Nov: "nov", Dec: "dic" };
  var WEEKDAYS_LONG = { Sun: "Domingo", Mon: "Lunes", Tue: "Martes", Wed: "Miércoles", Thu: "Jueves", Fri: "Viernes", Sat: "Sábado" };
  var MONTHS_LONG = { Jan: "Enero", Feb: "Febrero", Mar: "Marzo", Apr: "Abril", May: "Mayo", Jun: "Junio", Jul: "Julio", Aug: "Agosto", Sep: "Septiembre", Oct: "Octubre", Nov: "Noviembre", Dec: "Diciembre" };

  function load(url) {
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 5000) : 0;
    return fetch(url, { cache: "no-cache", signal: ctrl ? ctrl.signal : undefined }).then(function (res) {
      clearTimeout(timer);
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    }, function (err) {
      clearTimeout(timer);
      throw err;
    });
  }

  function parts(date, timeZone) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date).reduce(function (acc, part) {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});
  }

  function clock(part) {
    var hour = String(Number(part.hour));
    return part.minute === "00" ? hour : hour + ":" + part.minute;
  }

  function whenLabel(event) {
    var zone = event.timezone || "America/Argentina/Jujuy";
    var start = parts(new Date(event.start), zone);
    var end = parts(new Date(event.end), zone);
    var day = WEEKDAYS[start.weekday] + " " + start.day + " " + MONTHS[start.month];
    if (start.day === end.day && start.month === end.month) {
      return day + ", " + clock(start) + " a " + clock(end) + " h";
    }
    var endDay = WEEKDAYS[end.weekday] + " " + end.day + " " + MONTHS[end.month];
    return day + ", " + clock(start) + " h a " + endDay + ", " + clock(end) + " h";
  }

  function lumaUrl(url) {
    try {
      var parsed = new URL(url);
      return parsed.protocol === "https:" && (parsed.hostname === "luma.com" || parsed.hostname === "lu.ma");
    } catch (err) {
      return false;
    }
  }

  function coverUrl(url) {
    try {
      var parsed = new URL(url);
      return parsed.protocol === "https:" && parsed.hostname === "images.lumacdn.com";
    } catch (err) {
      return false;
    }
  }

  function stillOn(event) {
    var end = new Date(event.end || event.start);
    return !isNaN(end.getTime()) && end.getTime() >= Date.now();
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderCard(event) {
    var zone = event.timezone || "America/Argentina/Jujuy";
    var start;
    try {
      start = parts(new Date(event.start), zone);
    } catch (err) {
      return null;
    }
    if (!MONTHS[start.month] || !WEEKDAYS[start.weekday]) return null;
    var card = el("a", "upcoming-card");
    card.href = event.url;
    card.target = "_blank";
    card.rel = "noopener";

    var shot = el("span", "shot");
    if (coverUrl(event.cover)) {
      var img = el("img");
      img.src = event.cover;
      img.alt = "";
      img.loading = "lazy";
      shot.appendChild(img);
    }
    var date = el("span", "date");
    date.appendChild(el("b", "", start.day));
    date.appendChild(document.createTextNode(MONTHS[start.month].toUpperCase()));
    shot.appendChild(date);

    var body = el("span", "body");
    body.appendChild(el("span", "when", whenLabel(event)));
    body.appendChild(el("span", "title", event.name));
    if (event.place) {
      var marker = event.where === "online" ? "💻 " : "📍 ";
      body.appendChild(el("span", "place", marker + event.place));
    } else if (event.where === "online") {
      body.appendChild(el("span", "place", "💻 En línea"));
    }
    if (event.waitlist) body.appendChild(el("span", "badge", "Lista de espera"));

    card.appendChild(shot);
    card.appendChild(body);
    return card;
  }

  // The home uses the design-system event card (.jd-event); lists opt in with data-jd.
  function renderJdCard(event) {
    var zone = event.timezone || "America/Argentina/Jujuy";
    var start;
    try {
      start = parts(new Date(event.start), zone);
    } catch (err) {
      return null;
    }
    if (!MONTHS_LONG[start.month] || !WEEKDAYS_LONG[start.weekday]) return null;
    var card = el("a", "jd-event");
    card.href = event.url;
    card.target = "_blank";
    card.rel = "noopener";

    var date = el("div", "jd-event__date");
    date.appendChild(el("div", "jd-orb"));
    date.appendChild(el("span", "jd-event__day", ("0" + start.day).slice(-2)));
    var month = el("span", "jd-event__month", MONTHS_LONG[start.month]);
    month.appendChild(el("br"));
    month.appendChild(document.createTextNode(WEEKDAYS_LONG[start.weekday]));
    date.appendChild(month);

    var body = el("div", "jd-event__body");
    var tags = el("div", "jd-tags");
    tags.appendChild(el("span", "jd-tag jd-tag--solid", event.where === "online" ? "Evento virtual" : "Presencial"));
    if (event.waitlist) tags.appendChild(el("span", "jd-tag", "Lista de espera"));
    body.appendChild(tags);
    body.appendChild(el("h3", "jd-event__title", event.name));
    var time = ("0" + Number(start.hour)).slice(-2) + ":" + start.minute + " hs";
    var place = event.place || (event.where === "online" ? "Online" : "");
    body.appendChild(el("p", "jd-event__meta", place ? time + " · " + place : time));
    body.appendChild(el("span", "jd-cue jd-event__cue", "Inscribite en Luma →"));

    card.appendChild(date);
    card.appendChild(body);
    if (coverUrl(event.cover)) {
      card.className += " jd-event--shot";
      var shot = el("figure", "jd-event__shot");
      var img = el("img");
      img.src = event.cover;
      img.alt = "";
      img.loading = "lazy";
      shot.appendChild(img);
      card.appendChild(shot);
    }
    return card;
  }

  function showEmpty(list) {
    var note = list.parentNode.querySelector(".upcoming-empty");
    if (note) note.hidden = false;
  }

  function render(list, events) {
    list.textContent = "";
    // The local copy may have rendered "nothing coming up" before the live calendar answered.
    var note = list.parentNode.querySelector(".upcoming-empty");
    if (note) note.hidden = true;
    if (!events.length) {
      showEmpty(list);
      return;
    }
    events.forEach(function (event) {
      if (!event || !event.name || !lumaUrl(event.url) || !event.start) return;
      var card = list.hasAttribute("data-jd") ? renderJdCard(event) : renderCard(event);
      if (card) list.appendChild(card);
    });
    if (!list.childElementCount) showEmpty(list);
  }

  var liveSettled = false;
  var localFailed = false;

  function renderAll(data) {
    var events = ((data && data.events) || []).filter(stillOn).sort(function (a, b) {
      return String(a.start).localeCompare(String(b.start));
    });
    lists.forEach(function (list) { render(list, events); });
  }

  load(LOCAL).then(function (data) {
    if (!liveSettled) renderAll(data);
  }).catch(function () {
    localFailed = true;
    if (liveSettled) lists.forEach(showEmpty);
  });

  load(LIVE).then(function (data) {
    liveSettled = true;
    renderAll(data);
  }).catch(function () {
    liveSettled = true;
    if (localFailed) lists.forEach(showEmpty);
  });
})();
