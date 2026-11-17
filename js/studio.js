(() => {
  "use strict";
  const toggle = document.querySelector(".oc-mobile-toggle");
  const mobile = document.getElementById("mobileMenu");
  const groups = [...document.querySelectorAll(".oc-nav-group")];
  function closeMobile(returnFocus = false) {
    if (!toggle || !mobile) return;
    mobile.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    if (returnFocus) toggle.focus();
  }
  toggle?.addEventListener("click", () => {
    const open = mobile.hidden;
    mobile.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
  });
  mobile
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => closeMobile()));
  groups.forEach((group) =>
    group.addEventListener("toggle", () => {
      if (group.open)
        groups
          .filter((other) => other !== group)
          .forEach((other) => {
            other.open = false;
          });
    }),
  );
  document.addEventListener("click", (event) => {
    groups
      .filter((group) => !group.contains(event.target))
      .forEach((group) => {
        group.open = false;
      });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (mobile && !mobile.hidden) closeMobile(true);
    groups
      .filter((group) => group.open)
      .forEach((group) => {
        group.open = false;
        group.querySelector("summary").focus();
      });
  });
  matchMedia("(min-width:851px)").addEventListener("change", (event) => {
    if (event.matches) closeMobile();
  });
})();
