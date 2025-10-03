// jar/scripts.js

/* Sidebar functions (currently unused width comment says 250px, code used 150px).
   Keeping as-is but removing marginTop side effect which targeted #main (not present). */
function openNav() {
  var el = document.getElementById("mySidebar");
  if (el) el.style.width = "250px";
}
function closeNav() {
  var el = document.getElementById("mySidebar");
  if (el) el.style.width = "0";
}

/* Typewriter effect */
var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.isDeleting = false;
  this.tick();
};
TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};
// Close navigation when Escape is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    var toggle = document.getElementById("nav-toggle");
    if (toggle && toggle.checked) {
      toggle.checked = false;
    }
  }
});

window.addEventListener("load", function () {
  var elements = document.getElementsByClassName("typewrite");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-type");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      try {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      } catch (e) {
        // Fallback: allow comma-separated values
        new TxtType(
          elements[i],
          toRotate.replace(/[\[\]"]+/g, "").split(","),
          period,
        );
      }
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
  document.body.appendChild(css);
});

/* Indicator nav (kept as originally, made robust) */
var index = 1;
$(function () {
  $("nav.indicators ul li").on("click", indicator);
  setCurrentPoject();
});
function indicator() {
  $("nav.indicators ul li").off("click", indicator);
  index = $(this).index();
  setCurrentPoject();
}
function setCurrentPoject() {
  var $items = $("nav.indicators ul li");
  if ($items.length === 0) return;

  if (index > $items.length - 1) {
    index = 1;
  }
  if (index < 1) {
    index = $items.length - 1;
  }

  var currentItem = $items.get(index);

  if (!$(currentItem).hasClass("current")) {
    var parentleft = $(currentItem).parent().offset().left + 10;
    var position = $(currentItem).offset().left - parentleft;
    var diff =
      position - ($("nav.indicators ul li.current").offset().left - parentleft);
    var direction = diff < 0 ? "left" : "right";
    slideshow(direction, position, diff);
  }
}
$(".indicators ul li").on("click", function () {
  if ($(this).hasClass("current")) return false;

  var parentleft = $(this).parent().offset().left + 10;
  var position = $(this).offset().left - parentleft;
  var diff =
    position - ($("nav.indicators ul li.current").offset().left - parentleft);
  var direction = diff < 0 ? "left" : "right";
  slideshow(direction, position, diff);
});
function slideshow(direction, position, diff) {
  var $current = $("nav.indicators ul li.current");
  if ($current.length === 0) return;

  if (direction === "left") {
    $current.css({ left: position + "px", width: Math.abs(diff) + 20 + "px" });
    setTimeout(function () {
      $current.css({ width: "20px" });
      bindNavigation();
    }, 500);
  } else {
    $current.css({ width: Math.abs(diff) + 20 + "px" });
    setTimeout(function () {
      $current.css({ left: position + "px", width: "20px" });
      bindNavigation();
    }, 400);
  }
}
function bindNavigation() {
  $("nav.indicators ul li").on("click", indicator);
}

function verticalScroll(destination, duration, easing, callback) {
  var easings = {
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    linear: function (t) {
      return t;
    },
  };

  var start = window.pageYOffset;
  var startTime = "now" in window.performance ? performance.now() : Date.now();
  var dur = typeof duration === "number" ? duration : 500;

  var documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
  );
  var windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  var destinationOffset =
    typeof destination === "number"
      ? destination
      : (destination && destination.offsetTop) || 0;
  var destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight
      ? documentHeight - windowHeight
      : destinationOffset,
  );

  if (!("requestAnimationFrame" in window)) {
    window.scrollTo(0, destinationOffsetToScroll);
    if (typeof callback === "function") callback();
    return;
  }

  var easeFn = easings[easing] || easings.easeInOutQuad;

  function step() {
    var now = "now" in window.performance ? performance.now() : Date.now();
    var time = Math.min(1, (now - startTime) / dur);
    var eased = easeFn(time);
    var currentY = Math.round(
      eased * (destinationOffsetToScroll - start) + start,
    );
    window.scrollTo(0, currentY);

    if (Math.abs(currentY - destinationOffsetToScroll) <= 1 || time >= 1) {
      window.scrollTo(0, destinationOffsetToScroll);
      if (typeof callback === "function") callback();
      return;
    }
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* Full Page Scroll enhancement (fixed)
   - No auto-scroll on load
   - Smooth section-to-section on wheel/keys after interaction
   - Only intercept when a neighbor section exists
   - Guards against double handling
*/
(function () {
  var nodesName = ["HEADER", "SECTION", "FOOTER"];
  var hasInteracted = false;
  var handling = false; // prevents re-entrancy during a transition

  function isSection(el) {
    return el && nodesName.includes(el.nodeName);
  }

  function getActiveSection() {
    return (
      document.querySelector(".section.active") ||
      document.querySelector(".section") ||
      null
    );
  }

  function setActiveSection(nextSection) {
    var current = document.querySelector(".section.active");
    if (current) current.classList.remove("active");
    if (nextSection) nextSection.classList.add("active");
  }

  function scrollToSection(target, duration, easing) {
    if (!hasInteracted || handling || !target) return;
    handling = true;
    verticalScroll(target, duration, easing, function () {
      handling = false;
    });
  }

  function onWheel(e) {
    var current = getActiveSection();
    if (!current) return;

    var next = current.nextElementSibling;
    var prev = current.previousElementSibling;

    // If no neighbor sections, let native scroll
    if (e.deltaY < 0 && isSection(prev)) {
      e.preventDefault();
      hasInteracted = true;
      setActiveSection(prev);
      scrollToSection(prev, 500, "easeInOutCubic");
    } else if (e.deltaY > 0 && isSection(next)) {
      e.preventDefault();
      hasInteracted = true;
      setActiveSection(next);
      scrollToSection(next, 500, "easeInOutQuad");
    }
    // Otherwise do nothing; native scroll continues.
  }

  function onKey(e) {
    var current = getActiveSection();
    if (!current) return;

    var next = current.nextElementSibling;
    var prev = current.previousElementSibling;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (isSection(next)) {
        e.preventDefault();
        hasInteracted = true;
        setActiveSection(next);
        scrollToSection(next, 500, "easeInOutQuad");
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (isSection(prev)) {
        e.preventDefault();
        hasInteracted = true;
        setActiveSection(prev);
        scrollToSection(prev, 500, "easeInOutCubic");
      }
    }
  }

  // Prevent initial hash auto-jump causing a scroll before interaction
  // We neutralize hash on load and restore it after first interaction.
  var initialHash = window.location.hash;
  window.addEventListener("load", function () {
    var initial = getActiveSection();
    if (initial && !initial.classList.contains("active")) {
      initial.classList.add("active");
    }

    if (initialHash) {
      // Temporarily remove hash to avoid auto scroll
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
      // Restore hash after first interaction
      var restore = function () {
        if (!initialHash) return;
        history.replaceState(null, "", initialHash);
        initialHash = "";
        document.removeEventListener("wheel", restorePassive);
        document.removeEventListener("keydown", restore);
      };
      var restorePassive = function () {
        restore();
      };
      document.addEventListener("wheel", restorePassive, { passive: true });
      document.addEventListener("keydown", restore);
    }
  });

  document.addEventListener("wheel", onWheel, { passive: false });
  document.addEventListener("keydown", onKey);
})();

function verticalScroll(destination, duration, easing, callback) {
  var easings = {
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    linear: function (t) {
      return t;
    },
  };

  var start = window.pageYOffset;
  var startTime = "now" in window.performance ? performance.now() : Date.now();
  var dur = typeof duration === "number" ? duration : 500;

  var documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
  );
  var windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  var destinationOffset =
    typeof destination === "number"
      ? destination
      : (destination && destination.offsetTop) || 0;
  var destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight
      ? documentHeight - windowHeight
      : destinationOffset,
  );

  if (!("requestAnimationFrame" in window)) {
    window.scrollTo(0, destinationOffsetToScroll);
    if (typeof callback === "function") callback();
    return;
  }

  var easeFn = easings[easing] || easings.easeInOutQuad;

  function step() {
    var now = "now" in window.performance ? performance.now() : Date.now();
    var time = Math.min(1, (now - startTime) / dur);
    var eased = easeFn(time);
    var currentY = Math.round(
      eased * (destinationOffsetToScroll - start) + start,
    );
    window.scrollTo(0, currentY);

    if (Math.abs(currentY - destinationOffsetToScroll) <= 1 || time >= 1) {
      window.scrollTo(0, destinationOffsetToScroll);
      if (typeof callback === "function") callback();
      return;
    }
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Weather widget (no-key): Open-Meteo for Auckland, New Zealand (fixed location)
(function () {
  var widget = document.getElementById("weather-widget");
  if (!widget) return;

  var $temp = document.getElementById("weather-temp");
  var $desc = document.getElementById("weather-desc");
  var $city = document.getElementById("weather-city");
  var $iconImg = document.getElementById("weather-icon");

  // Auckland CBD approximate coordinates
  var AUCKLAND = { lat: -36.8485, lon: 174.7633, label: "Auckland, NZ" };

  // Map Open-Meteo weathercode to description and a simple emoji icon
  var WEATHER_MAP = {
    0: { d: "Clear sky", i: "☀️" },
    1: { d: "Mainly clear", i: "🌤️" },
    2: { d: "Partly cloudy", i: "⛅" },
    3: { d: "Overcast", i: "☁️" },
    45: { d: "Fog", i: "🌫️" },
    48: { d: "Depositing rime fog", i: "🌫" },
    51: { d: "Light drizzle", i: "🌦️" },
    53: { d: "Moderate drizzle", i: "🌦️" },
    55: { d: "Dense drizzle", i: "🌧" },
    56: { d: "Light freezing drizzle", i: "🌦️" },
    57: { d: "Dense freezing drizzle", i: "🌧️" },
    61: { d: "Slight rain", i: "🌧️" },
    63: { d: "Moderate rain", i: "🌧️" },
    65: { d: "Heavy rain", i: "🌧" },
    66: { d: "Light freezing rain", i: "🌧" },
    67: { d: "Heavy freezing rain", i: "🌧️" },
    71: { d: "Slight snow", i: "❄️" },
    73: { d: "Moderate snow", i: "❄️" },
    75: { d: "Heavy snow", i: "❄️" },
    77: { d: "Snow grains", i: "❄️" },
    80: { d: "Slight rain showers", i: "🌦" },
    81: { d: "Moderate rain showers", i: "🌦️" },
    82: { d: "Violent rain showers", i: "⛈️" },
    85: { d: "Slight snow showers", i: "❄️" },
    86: { d: "Heavy snow showers", i: "❄️" },
    95: { d: "Thunderstorm", i: "⛈️" },
    96: { d: "Thunderstorm with slight hail", i: "⛈️" },
    99: { d: "Thunderstorm with heavy hail", i: "⛈️" },
  };

  function renderError(message) {
    if ($desc) $desc.textContent = message || "Error";
    if ($temp) $temp.textContent = "--°C";
    if ($city) $city.textContent = AUCKLAND.label ? "• " + AUCKLAND.label : "";
    // Use emoji fallback; ensure <img> hidden
    if ($iconImg) {
      $iconImg.removeAttribute("src");
      $iconImg.alt = "";
      $iconImg.style.display = "none";
    }
    ensureEmoji("—");
  }

  function ensureEmoji(txt) {
    var existing = widget.querySelector(".weather-emoji");
    if (!existing) {
      var span = document.createElement("span");
      span.className = "weather-emoji";
      span.style.fontSize = "20px";
      span.style.lineHeight = "1";
      span.textContent = txt || "";
      var row = widget.querySelector(".weather-row");
      if (row) row.insertBefore(span, row.firstChild);
    } else {
      existing.textContent = txt || "";
    }
  }

  function setIconText(txt, alt) {
    if ($iconImg) {
      $iconImg.style.display = "none"; // hide <img> (no external icons)
      $iconImg.removeAttribute("src");
      $iconImg.alt = alt || "";
    }
    ensureEmoji(txt || "");
  }

  function updateWidget(data) {
    try {
      var cw = data && data.current_weather ? data.current_weather : null;
      if (!cw) throw new Error("No current_weather");
      var tempC = Math.round(cw.temperature);
      var code = cw.weathercode;
      var map = WEATHER_MAP[code] || { d: "Weather", i: "🌤️" };

      if ($temp) $temp.textContent = (isFinite(tempC) ? tempC : "--") + "°C";
      if ($desc) $desc.textContent = map.d;
      if ($city)
        $city.textContent = AUCKLAND.label ? "• " + AUCKLAND.label : "";
      setIconText(map.i, map.d);
    } catch (e) {
      console.error(e);
      renderError("Weather data error.");
    }
  }

  function fetchAuckland() {
    var url =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      encodeURIComponent(AUCKLAND.lat) +
      "&longitude=" +
      encodeURIComponent(AUCKLAND.lon) +
      "&current_weather=true";

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Open-Meteo error: " + res.status);
        return res.json();
      })
      .then(function (data) {
        updateWidget(data);
      })
      .catch(function (err) {
        console.error(err);
        renderError("Unable to load weather.");
      });
  }

  fetchAuckland();
})();

// Embedded Portfolio carousel: seamless infinite loop with transition lock + queued actions
(function () {
  var root = document.getElementById("portfolio");
  if (!root) return;

  var track = root.querySelector(".carousel-track");
  var viewport = root.querySelector(".carousel-viewport");
  var indicators = root.querySelector(".carousel-indicators");
  var realSlides = Array.from(root.querySelectorAll(".carousel-slide"));
  if (!track || !viewport || realSlides.length === 0) return;

  var duration = 500; // ms, matches CSS transition on .carousel-track
  var index = 0; // logical index (0..n-1)
  var position = 1; // visual position in allSlides, starts at 1 due to leading clone
  var isDragging = false;
  var startX = 0;
  var currentTranslate = 0;
  var prevTranslate = 0;
  var animationID = 0;

  // NEW: lock + queue to handle ultra-fast inputs
  var isAnimating = false;
  var pendingAction = null; // "next" or "prev"
  var lastInputTime = 0;
  var MIN_INPUT_INTERVAL = 100; // ms throttle

  // Build infinite structure: clone first and last slides
  var firstClone = realSlides[0].cloneNode(true);
  var lastClone = realSlides[realSlides.length - 1].cloneNode(true);
  firstClone.classList.add("clone");
  lastClone.classList.add("clone");
  track.insertBefore(lastClone, realSlides[0]); // prepend
  track.appendChild(firstClone); // append

  var allSlides = Array.from(track.querySelectorAll(".carousel-slide"));

  // Indicators for real slides only
  indicators.innerHTML = "";
  realSlides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.setAttribute("aria-selected", i === index ? "true" : "false");
    dot.addEventListener("click", function (evt) {
      evt.preventDefault();
      goTo(i);
    });
    indicators.appendChild(dot);
  });

  function updateIndicators(i) {
    var dots = Array.from(indicators.querySelectorAll(".dot"));
    dots.forEach(function (d, idx) {
      d.setAttribute("aria-selected", idx === i ? "true" : "false");
    });
  }

  function translateToPosition(p, withTransition) {
    var offset = -p * viewport.clientWidth;
    track.style.transition = withTransition
      ? "transform " + duration + "ms ease-in-out"
      : "none";
    track.style.transform = "translate3d(" + offset + "px, 0, 0)";
  }

  // Snap from clones to real slides (seamless loop)
  function snapIfAtClone() {
    var total = allSlides.length; // real + 2 clones
    if (position === 0) {
      position = realSlides.length; // jump to last real
      translateToPosition(position, false);
    } else if (position === total - 1) {
      position = 1; // jump to first real
      translateToPosition(position, false);
    }
  }

  // Transition end: release lock and execute queued action if any
  track.addEventListener("transitionend", function () {
    snapIfAtClone();
    isAnimating = false;
    if (pendingAction) {
      var act = pendingAction;
      pendingAction = null;
      if (act === "next")
        next(true); // true = bypass throttle, honor lock
      else if (act === "prev") prev(true);
    }
  });

  function shouldThrottle() {
    var now = Date.now();
    if (now - lastInputTime < MIN_INPUT_INTERVAL) return true;
    lastInputTime = now;
    return false;
  }

  function goTo(i, bypassThrottle) {
    if (isAnimating) {
      pendingAction = null; // direct 'goTo' overrides any queued next/prev
    }
    if (!bypassThrottle && shouldThrottle()) return;

    index = ((i % realSlides.length) + realSlides.length) % realSlides.length;
    position = index + 1; // account for leading clone
    isAnimating = true;
    translateToPosition(position, true);
    updateIndicators(index);
  }

  function next(bypassThrottle) {
    if (isAnimating) {
      pendingAction = "next";
      return;
    }
    if (!bypassThrottle && shouldThrottle()) return;

    position += 1;
    isAnimating = true;
    translateToPosition(position, true);
    index = (index + 1) % realSlides.length;
    updateIndicators(index);
  }

  function prev(bypassThrottle) {
    if (isAnimating) {
      pendingAction = "prev";
      return;
    }
    if (!bypassThrottle && shouldThrottle()) return;

    position -= 1;
    isAnimating = true;
    translateToPosition(position, true);
    index = (index - 1 + realSlides.length) % realSlides.length;
    updateIndicators(index);
  }

  // Keep width-calc correct on resize (no animation)
  var ro = new ResizeObserver(function () {
    translateToPosition(position, false);
  });
  ro.observe(viewport);

  // Keyboard: Arrow keys + WASD + Home/End + Esc (no auto-focus on load)
  viewport.setAttribute("tabindex", "0");

  var KEY_MAP = {
    next: new Set(["ArrowRight", "d", "D", "w", "W"]),
    prev: new Set(["ArrowLeft", "a", "A", "s", "S"]),
    first: new Set(["Home"]),
    last: new Set(["End"]),
    close: new Set(["Escape", "Esc"]),
  };

  function handleNavKeys(e) {
    var key = e.key;
    if (KEY_MAP.next.has(key)) {
      e.preventDefault();
      e.stopPropagation();
      next();
      return true;
    }
    if (KEY_MAP.prev.has(key)) {
      e.preventDefault();
      e.stopPropagation();
      prev();
      return true;
    }
    if (KEY_MAP.first.has(key)) {
      e.preventDefault();
      e.stopPropagation();
      goTo(0);
      return true;
    }
    if (KEY_MAP.last.has(key)) {
      e.preventDefault();
      e.stopPropagation();
      goTo(realSlides.length - 1);
      return true;
    }
    if (KEY_MAP.close.has(key)) {
      e.preventDefault();
      e.stopPropagation();
      var toggle = document.getElementById("nav-toggle");
      if (toggle && toggle.checked) toggle.checked = false;
      return true;
    }
    return false;
  }

  viewport.addEventListener("keydown", handleNavKeys);
  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented) return;
    var rect = viewport.getBoundingClientRect();
    var visible =
      rect.width > 0 &&
      rect.height > 0 &&
      rect.top < window.innerHeight &&
      rect.bottom > 0;
    if (!visible) return;

    var ae = document.activeElement;
    var tag = ae && ae.tagName;
    var isEditable =
      ae &&
      (ae.isContentEditable ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT");
    if (isEditable) return;

    handleNavKeys(e);
  });

  // Touch/drag support with lock awareness
  function getPositionX(evt) {
    return evt.type.includes("mouse")
      ? evt.pageX
      : evt.touches && evt.touches[0]
        ? evt.touches[0].clientX
        : 0;
  }

  function setSliderPosition() {
    track.style.transition = "none";
    track.style.transform = "translate3d(" + currentTranslate + "px, 0, 0)";
  }

  function animationLoop() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animationLoop);
  }

  function touchStart(e) {
    if (isAnimating) return; // ignore drags mid-animation; queued actions will handle chains
    isDragging = true;
    startX = getPositionX(e);
    prevTranslate = -position * viewport.clientWidth;
    currentTranslate = prevTranslate;
    track.classList.add("grabbing");
    animationID = requestAnimationFrame(animationLoop);
  }

  function touchMove(e) {
    if (!isDragging) return;
    var x = getPositionX(e);
    var delta = x - startX;
    currentTranslate = prevTranslate + delta;
  }

  function touchEnd() {
    cancelAnimationFrame(animationID);
    isDragging = false;

    var movedBy = currentTranslate - prevTranslate;
    var threshold = viewport.clientWidth * 0.2;

    if (movedBy < -threshold) {
      next();
    } else if (movedBy > threshold) {
      prev();
    } else {
      isAnimating = true; // snap-back should lock until transitionend
      translateToPosition(position, true);
    }

    track.classList.remove("grabbing");
  }

  viewport.addEventListener("touchstart", touchStart, { passive: true });
  viewport.addEventListener("touchmove", touchMove, { passive: true });
  viewport.addEventListener("touchend", touchEnd);
  viewport.addEventListener("mousedown", touchStart);
  viewport.addEventListener("mousemove", touchMove);
  viewport.addEventListener("mouseup", touchEnd);
  viewport.addEventListener("mouseleave", function () {
    if (isDragging) touchEnd();
  });

  // Initial placement after first paint without animation
  window.requestAnimationFrame(function () {
    translateToPosition(position, false);
    updateIndicators(index);
  });
})();
