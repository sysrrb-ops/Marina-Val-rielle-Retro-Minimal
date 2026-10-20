
/* =========================================
   MARINA VALÉRIELLE — INTERACTIVE WIDGETS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  // 1. Toast notification
  const toast = $("#toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // 2. Mobile navigation
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  $$("#navLinks a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      if (menuToggle) menuToggle.textContent = "☰";
    });
  });

  // 3. Language toggle: Thai <-> English
  let currentLanguage = "th";
  const languageSwitch = $("#languageSwitch");

  function changeLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;

    $$("[data-th][data-en]").forEach((element) => {
      const content = element.dataset[language];
      if (content !== undefined) element.innerHTML = content;
    });

    if (languageSwitch) {
      languageSwitch.textContent =
        language === "th" ? "TH / EN" : "EN / TH";
      languageSwitch.setAttribute(
        "aria-label",
        language === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"
      );
    }

    showToast(
      language === "th"
        ? "เปลี่ยนเป็นภาษาไทยแล้ว"
        : "Language changed to English"
    );
  }

  languageSwitch?.addEventListener("click", () => {
    changeLanguage(currentLanguage === "th" ? "en" : "th");
  });

  // 4. Live digital clock
  const liveClock = $("#liveClock");

  function updateClock() {
    if (!liveClock) return;

    liveClock.textContent = new Intl.DateTimeFormat(
      currentLanguage === "th" ? "th-TH" : "en-GB",
      {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
    ).format(new Date());
  }

  updateClock();
  setInterval(updateClock, 1000);

  // 5. Fleet horizontal carousel
  const fleetTrack = $("#fleetTrack");

  function scrollFleet(direction) {
    if (!fleetTrack) return;

    const card = $(".fleet-card", fleetTrack);
    const gap = 18;
    const distance = card
      ? card.getBoundingClientRect().width + gap
      : 320;

    fleetTrack.scrollBy({
      left: direction * distance,
      behavior: "smooth"
    });
  }

  $("#fleetPrev")?.addEventListener("click", () => scrollFleet(-1));
  $("#fleetNext")?.addEventListener("click", () => scrollFleet(1));

  // 6. Experience category filters
  const filterButtons = $$(".filter-btn");
  const experienceCards = $$(".experience-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      experienceCards.forEach((card) => {
        const visible =
          filter === "all" || card.dataset.category === filter;

        card.classList.toggle("is-hidden", !visible);
      });
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  // 7. Guest counter: minimum 1, maximum 24
  let guests = 2;
  const guestCount = $("#guestCount");

  function updateGuestCount() {
    if (guestCount) guestCount.textContent = String(guests);
  }

  $$(".counter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.step);
      const next = guests + step;

      if (next < 1 || next > 24) {
        showToast("จำนวนผู้เดินทางเลือกได้ 1–24 คน");
        return;
      }

      guests = next;
      updateGuestCount();
    });
  });

  // 8. Date picker: disallow dates in the past
  const travelDate = $("#travelDate");

  if (travelDate) {
    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    travelDate.min = localToday;
    travelDate.value = localToday;
  }

  // 9. Booking planner demo
  const bookingForm = $("#bookingForm");
  const bookingResult = $("#bookingResult");
  const bookingSummary = $("#bookingSummary");
  const copyBooking = $("#copyBooking");
  let latestBooking = "";

  bookingForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) return;

    const formData = new FormData(bookingForm);
    const dateValue = String(formData.get("travelDate"));
    const date = new Date(`${dateValue}T12:00:00`);

    const dateText = new Intl.DateTimeFormat(
      currentLanguage === "th" ? "th-TH" : "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(date);

    const destination = String(formData.get("destination"));
    const duration = String(formData.get("duration"));
    const style = String(formData.get("travelStyle"));

    latestBooking = [
      "MARINA VALÉRIELLE — TRAVEL PLAN",
      `Destination: ${destination}`,
      `Date: ${dateText}`,
      `Duration: ${duration}`,
      `Guests: ${guests}`,
      `Travel mood: ${style}`,
      "",
      "Fictional demo only — not a confirmed booking."
    ].join("\n");

    if (bookingSummary) {
      bookingSummary.replaceChildren();

      const rows = [
        ["จุดหมาย / Destination", destination],
        ["วันที่ / Date", dateText],
        ["ระยะเวลา / Duration", duration],
        ["ผู้เดินทาง / Guests", `${guests} คน`],
        ["สไตล์ / Travel mood", style]
      ];

      rows.forEach(([label, value]) => {
        const row = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${label}: `;
        row.append(strong, document.createTextNode(value));
        bookingSummary.appendChild(row);
      });
    }

    if (bookingResult) {
      bookingResult.hidden = false;
      bookingResult.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    showToast("สร้างแผนการเดินทางตัวอย่างแล้ว");
  });

  // 10. Copy booking itinerary
  copyBooking?.addEventListener("click", async () => {
    if (!latestBooking) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(latestBooking);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = latestBooking;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");
        textarea.remove();

        if (!copied) throw new Error("Copy unavailable");
      }

      showToast("คัดลอกแผนการเดินทางแล้ว");
    } catch (error) {
      showToast("คัดลอกไม่สำเร็จ กรุณาคัดลอกข้อความด้วยตนเอง");
    }
  });

  // 11. Newsletter demo
  const newsletterForm = $("#newsletterForm");
  const newsletterEmail = $("#newsletterEmail");
  const newsletterMessage = $("#newsletterMessage");

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!newsletterForm.reportValidity()) return;

    if (newsletterMessage) {
      newsletterMessage.textContent =
        "ขอบคุณที่สนใจ! ฟอร์มนี้เป็นเดโมและยังไม่ได้บันทึกอีเมล";
    }

    newsletterEmail.value = "";
    showToast("ทดลองสมัครรับข่าวสารเรียบร้อย");
  });

  // 12. Back to top
  const backToTop = $("#backToTop");

  function updateBackToTop() {
    backToTop?.classList.toggle("visible", window.scrollY > 450);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateBackToTop();

  // 13. Active navigation link while scrolling
  const sections = $$("main section[id]");
  const navigationLinks = $$("#navLinks a[href^='#']");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;

            if (isCurrent) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // 14. Image loading fallback
  $$("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.backgroundColor = "#d9e7da";
      img.style.minHeight = "180px";
      img.alt = img.alt || "Image unavailable";
    }, { once: true });
  });

  console.log("Marina Valérielle — Retro Minimal initialized.");
});
