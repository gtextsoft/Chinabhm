/**
 * BHMC landing — countdown, seats line, video fallback visibility, year.
 * Set your registration deadline below (ISO string, local timezone interpreted by Date).
 */

(function () {
  const DEADLINE_ISO = "2026-05-15T23:59:59"; // Edit: registration close (adjust to your real date)

  const seatsEl = document.querySelector("[data-seats]");
  const SEAT_MIN = 12;
  const SEAT_MAX = 48;

  function parseDeadline() {
    const d = new Date(DEADLINE_ISO);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tickCountdown() {
    const root = document.querySelector("[data-countdown]");
    if (!root) return;

    const end = parseDeadline();
    const units = {
      days: root.querySelector('[data-unit="days"]'),
      hours: root.querySelector('[data-unit="hours"]'),
      minutes: root.querySelector('[data-unit="minutes"]'),
      seconds: root.querySelector('[data-unit="seconds"]'),
    };

    function update() {
      if (!end) {
        if (units.days) units.days.textContent = "--";
        return;
      }

      const now = Date.now();
      let diff = end.getTime() - now;

      if (diff <= 0) {
        Object.values(units).forEach((el) => {
          if (el) el.textContent = "00";
        });
        const label = root.querySelector(".countdown__label");
        if (label) label.textContent = "Registration closed";
        return;
      }

      const s = Math.floor(diff / 1000);
      const days = Math.floor(s / 86400);
      const hours = Math.floor((s % 86400) / 3600);
      const minutes = Math.floor((s % 3600) / 60);
      const seconds = s % 60;

      if (units.days) units.days.textContent = pad(Math.min(days, 999));
      if (units.hours) units.hours.textContent = pad(hours);
      if (units.minutes) units.minutes.textContent = pad(minutes);
      if (units.seconds) units.seconds.textContent = pad(seconds);
    }

    update();
    setInterval(update, 1000);
  }

  /** Stable “limited seats” line — derived from week number so it changes slowly, not random each refresh */
  function setSeatsLine() {
    if (!seatsEl) return;
    const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const n = SEAT_MIN + (week % (SEAT_MAX - SEAT_MIN + 1));
    seatsEl.textContent = `Only ${n} seats left at this tier`;
  }

  function videoFallback() {
    const video = document.querySelector(".video-frame__video");
    const frame = document.querySelector(".video-frame");
    const fallback = document.querySelector("[data-video-fallback]");
    if (!video || !frame) return;

    const src = video.querySelector("source");
    const hasSrc = src && src.getAttribute("src") && src.getAttribute("src").trim() !== "";

    if (hasSrc) {
      frame.classList.add("has-video");
      if (fallback) fallback.setAttribute("hidden", "");
    } else {
      frame.classList.remove("has-video");
      if (fallback) fallback.removeAttribute("hidden");
    }
  }

  function year() {
    const y = document.querySelector("[data-year]");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  tickCountdown();
  setSeatsLine();
  videoFallback();
  year();
})();
