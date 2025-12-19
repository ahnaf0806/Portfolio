import "./core.js";
import "./khs.js";
import "./modals.js";
import "./gallery.js";

// efek sticky shadow (desktop)
(() => {
  const el = document.querySelector(".profile-sticky");
  if (!el || window.innerWidth < 992) return;

  const topOffset = el.offsetTop;

  window.addEventListener("scroll", () => {
    if (window.scrollY > topOffset - 24) {
      el.classList.add("is-sticky");
    } else {
      el.classList.remove("is-sticky");
    }
  });
})();
