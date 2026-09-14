(() => {
  function $(id) {
    return document.getElementById(id);
  }
  function paintTypes(type) {
    const box = $("consult-types");
    if (!box) return;
    box.querySelectorAll("[data-type]").forEach((b) => {
      b.classList.toggle("on", b.getAttribute("data-type") === type);
    });
  }
  function openConsultNow(opts) {
    const d = $("consult-now");
    if (!d) return;
    opts = opts || {};
    const type = opts.type || "visit";
    const factory = type === "custom";
    d.dataset.type = type;
    const title = $("consult-title");
    const desc = $("consult-desc");
    const est = $("consult-est");
    const msg = $("consult-msg");
    const form = $("consult-form-fields");
    const ok = $("consult-ok");
    if (title) title.textContent = factory ? "공장 상담" : "일반 상담";
    if (desc)
      desc.textContent = factory
        ? "공장직영 맞춤 제작입니다. 재료비+공임 기준으로 견적합니다."
        : "예상가는 참고입니다. 최종 금액은 매장 감정 후 확정됩니다.";
    if (est) {
      if (opts.estimate) {
        est.hidden = false;
        est.textContent = opts.estimate;
      } else {
        est.hidden = true;
        est.textContent = "";
      }
    }
    if (msg) msg.value = opts.message || "";
    if (form) form.hidden = false;
    if (ok) ok.hidden = true;
    paintTypes(type);
    if (!d.open) d.showModal();
  }
  window.openConsultNow = openConsultNow;
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target && e.target.closest && e.target.closest("[data-open-consult]");
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      const kind = t.getAttribute("data-open-consult");
      if (kind === "factory") {
        openConsultNow({
          type: "custom",
          message: "공장 직영 맞춤 제작 상담 원합니다. 공장가로 견적 부탁합니다.",
        });
      } else if (kind === "sell") {
        openConsultNow({ type: "sell", message: "금 매입 상담 원합니다." });
      } else {
        openConsultNow({ type: "visit" });
      }
    },
    true,
  );
  document.addEventListener("click", (e) => {
    const typeBtn = e.target.closest && e.target.closest("#consult-types [data-type]");
    if (typeBtn) {
      const d = $("consult-now");
      if (d) d.dataset.type = typeBtn.getAttribute("data-type") || "visit";
      paintTypes(d && d.dataset.type);
      return;
    }
    if (e.target && (e.target.id === "consult-close" || e.target.id === "consult-close-2")) {
      const d = $("consult-now");
      if (d && d.open) d.close();
    }
  });
  document.addEventListener("submit", (e) => {
    if (!e.target || e.target.id !== "consult-form") return;
    e.preventDefault();
    const d = $("consult-now");
    const fd = new FormData(e.target);
    const row = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      type: (d && d.dataset.type) || "visit",
      message: fd.get("message"),
      visitDate: fd.get("visitDate"),
      estimate: ($("consult-est") && $("consult-est").textContent) || "",
      at: new Date().toISOString(),
    };
    try {
      const prev = JSON.parse(localStorage.getItem("hwanggeum-inquiries") || "[]");
      localStorage.setItem("hwanggeum-inquiries", JSON.stringify([row, ...prev].slice(0, 80)));
    } catch (err) {}
    const form = $("consult-form-fields");
    const ok = $("consult-ok");
    if (form) form.hidden = true;
    if (ok) ok.hidden = false;
  });
})();
