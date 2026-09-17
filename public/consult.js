(() => {
  const LIST_KEY = "cheonho-consults-v1";
  const PIN_KEY = "cheonho-admin-pin";
  const BIRTH_KEY = "cheonho-admin-birth";
  const SSN_KEY = "cheonho-admin-ssn";
  const TYPE_LABEL = { sell: "금 매입", buy: "구매 견적", custom: "맞춤 제작", visit: "방문 예약" };

  function $(id) {
    return document.getElementById(id);
  }
  function digits(v) {
    return String(v || "").replace(/\D/g, "");
  }


  function esc(v) {
    return String(v || "")
      .replace(/&/g, "\u0026amp;")
      .replace(/\"/g, "\u0026quot;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;");
  }
  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function loadConsults() {
    try {
      const parsed = JSON.parse(localStorage.getItem(LIST_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  function saveConsults(list) {
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
  }
  function addConsult(input) {
    const name = String(input.name || "").trim();
    const phone = String(input.phone || "").trim();
    if (!name || !phone) return null;
    const now = new Date();
    const rec = {
      id: now.getTime() + "-" + Math.random().toString(36).slice(2, 7),
      createdAt: now.toISOString(),
      date: todayKey(),
      name,
      phone,
      type: input.type || "visit",
      message: String(input.message || "").trim(),
      done: false,
      review: "",
    };
    const list = loadConsults();
    list.push(rec);
    saveConsults(list);
    return rec;
  }
  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }
  function formatDateLabel(date) {
    const p = String(date).split("-");
    return p[0] + "." + p[1] + "." + p[2];
  }

  (function migrateOld() {
    if (localStorage.getItem(LIST_KEY)) return;
    try {
      const old = JSON.parse(localStorage.getItem("hwanggeum-inquiries") || "[]");
      if (!Array.isArray(old) || !old.length) return;
      saveConsults(
        old.map((row, i) => ({
          id: "old-" + i + "-" + (row.at || ""),
          createdAt: row.at || new Date().toISOString(),
          date: String(row.at || "").slice(0, 10) || todayKey(),
          name: row.name || "",
          phone: row.phone || "",
          type: row.type || "visit",
          message: row.message || row.estimate || "",
          done: false,
          review: "",
        })),
      );
    } catch (e) {}
  })();

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
  window.addConsult = addConsult;

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
    addConsult({
      name: fd.get("name"),
      phone: fd.get("phone"),
      type: (d && d.dataset.type) || "visit",
      message: [fd.get("message"), $("consult-est") && $("consult-est").textContent].filter(Boolean).join(" · "),
    });
    const form = $("consult-form-fields");
    const ok = $("consult-ok");
    if (form) form.hidden = true;
    if (ok) ok.hidden = false;
  });

  let adminFilter = "today";
  function ensureAdmin() {
    if ($("admin-now")) return $("admin-now");
    const d = document.createElement("div");
    d.id = "admin-now";
    d.className = "consult-overlay";
    d.innerHTML = `
      <div class="consult-sheet">
      <div class="consult-h">
        <div>
          <h2 id="admin-title">관리자</h2>
          <p>이 휴대폰·이 브라우저에만 저장됩니다.</p>
        </div>
        <button id="admin-close" type="button" aria-label="닫기">×</button>
      </div>
      <p id="admin-error" hidden></p>
      <form id="admin-setup" class="admin-form">
        <label>PIN 4자리<input name="pin" inputmode="numeric" maxlength="4" autocomplete="off" /></label>
        <label>생년월일 8자리<input name="birth" inputmode="numeric" maxlength="8" placeholder="19900101" autocomplete="off" /></label>
        <label>주민번호 13자리<input name="ssn" inputmode="numeric" maxlength="13" placeholder="숫자만" autocomplete="off" /></label>
        <button class="consult-submit" type="submit">설정하고 열기</button>
      </form>
      <form id="admin-pin" class="admin-form" hidden>
        <label>PIN<input name="pin" inputmode="numeric" maxlength="4" autocomplete="off" /></label>
        <button class="consult-submit" type="submit">확인</button>
        <p class="admin-links"><button type="button" id="admin-to-reset">PIN 재설정</button> · <button type="button" id="admin-to-full">완전 리셋</button></p>
      </form>
      <form id="admin-reset" class="admin-form" hidden>
        <label>생년월일 8자리<input name="birth" inputmode="numeric" maxlength="8" autocomplete="off" /></label>
        <label>새 PIN 4자리<input name="pin" inputmode="numeric" maxlength="4" autocomplete="off" /></label>
        <button class="consult-submit" type="submit">PIN 바꾸기</button>
      </form>
      <form id="admin-full" class="admin-form" hidden>
        <label>주민번호 13자리<input name="ssn" inputmode="numeric" maxlength="13" autocomplete="off" /></label>
        <button class="consult-submit" type="submit">새 PIN 설정으로</button>
      </form>
      <div id="admin-list" hidden>
        <div class="admin-toolbar">
          <button type="button" class="admin-chip on" data-filter="today" id="admin-today">오늘</button>
          <button type="button" class="admin-chip" data-filter="all" id="admin-all">누적</button>
          <button type="button" id="admin-csv">CSV</button>
        </div>
        <div id="admin-rows"></div>
      </div>
      </div>`;
    document.body.appendChild(d);
    return d;
  }
  function showError(msg) {
    const el = $("admin-error");
    if (!el) return;
    el.hidden = !msg;
    el.textContent = msg || "";
  }
  function showGate(name) {
    ["admin-setup", "admin-pin", "admin-reset", "admin-full", "admin-list"].forEach((id) => {
      const el = $(id);
      if (el) el.hidden = id !== name;
    });
    const title = $("admin-title");
    if (title) title.textContent = name === "admin-list" ? "상담 내역" : name === "admin-setup" ? "관리자 설정" : "관리자";
    showError("");
  }
  function csvCell(v) {
    return '"' + String(v || "").replace(/"/g, '""') + '"';
  }
  function renderAdminList() {
    const all = loadConsults().slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const today = todayKey();
    const rows = adminFilter === "today" ? all.filter((r) => r.date === today) : all;
    const todayBtn = $("admin-today");
    const allBtn = $("admin-all");
    if (todayBtn) {
      todayBtn.classList.toggle("on", adminFilter === "today");
      todayBtn.textContent = "오늘 " + all.filter((r) => r.date === today).length;
    }
    if (allBtn) {
      allBtn.classList.toggle("on", adminFilter === "all");
      allBtn.textContent = "누적 " + all.length;
    }
    const box = $("admin-rows");
    if (!box) return;
    if (!rows.length) {
      box.innerHTML = '<p class="muted" style="text-align:center;padding:1.2rem 0">상담이 없습니다.</p>';
      return;
    }
    box.innerHTML = rows
      .map(
        (r) => `<article class="admin-card" data-id="${r.id}">
        <div class="admin-card-h"><strong>${r.name} · ${r.phone}</strong><span>${formatDateLabel(r.date)} ${formatTime(r.createdAt)}</span></div>
        <p class="admin-type">${TYPE_LABEL[r.type] || r.type}</p>
        ${r.message ? `<p>${r.message}</p>` : ""}
        <div class="admin-card-a">
          <button type="button" class="admin-ox${r.done ? " on" : ""}" data-ox="${r.id}">${r.done ? "O" : "X"}</button>
          <input data-review="${r.id}" value="${esc(r.review)}" placeholder="상담 후기" />
          <button type="button" data-del="${r.id}">삭제</button>
        </div>
      </article>`,
      )
      .join("");
  }
  function openAdminNow() {
    const d = ensureAdmin();
    showGate(localStorage.getItem(PIN_KEY) ? "admin-pin" : "admin-setup");
    d.classList.add("is-open");
  }
  function closeAdminNow() {
    const d = $("admin-now");
    if (d) d.classList.remove("is-open");
  }
  window.openAdminNow = openAdminNow;

  document.addEventListener("click", (e) => {
    const node = e.target && e.target.closest ? e.target : (e.target && e.target.parentElement);
    const bar = node && node.closest && node.closest("[data-open-admin], #goldBar");
    if (bar) {
      e.preventDefault();
      openAdminNow();
      return;
    }
    if (node && node.closest && node.closest("#admin-close")) {
      closeAdminNow();
      return;
    }
    if (e.target && e.target.id === "admin-now") {
      closeAdminNow();
      return;
    }
    if (e.target && e.target.id === "admin-to-reset") showGate("admin-reset");
    if (e.target && e.target.id === "admin-to-full") showGate("admin-full");
    if (e.target && e.target.id === "admin-csv") {
      const list = loadConsults();
      const header = ["날짜", "시간", "성함", "연락처", "상담유형", "상담내용", "처리", "상담후기"];
      const rows = list.map((r) =>
        [r.date, formatTime(r.createdAt), r.name, r.phone, r.type, r.message, r.done ? "O" : "X", r.review]
          .map(csvCell)
          .join(","),
      );
      const blob = new Blob(["\uFEFF" + [header.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "상담내역_" + todayKey() + ".csv";
      a.click();
      URL.revokeObjectURL(url);
    }
    if (e.target && e.target.dataset && e.target.dataset.filter) {
      adminFilter = e.target.dataset.filter;
      renderAdminList();
    }
    if (e.target && e.target.dataset && e.target.dataset.ox) {
      const id = e.target.dataset.ox;
      saveConsults(loadConsults().map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
      renderAdminList();
    }
    if (e.target && e.target.dataset && e.target.dataset.del) {
      if (!confirm("이 상담을 지울까요?")) return;
      saveConsults(loadConsults().filter((r) => r.id !== e.target.dataset.del));
      renderAdminList();
    }
  });
  document.addEventListener("change", (e) => {
    if (!e.target || !e.target.dataset || !e.target.dataset.review) return;
    const id = e.target.dataset.review;
    saveConsults(loadConsults().map((r) => (r.id === id ? { ...r, review: e.target.value } : r)));
  });
  document.addEventListener("submit", (e) => {
    const id = e.target && e.target.id;
    if (!id || !String(id).startsWith("admin-")) return;
    e.preventDefault();
    const fd = new FormData(e.target);
    if (id === "admin-setup") {
      const pin = digits(fd.get("pin"));
      const birth = digits(fd.get("birth"));
      const ssn = digits(fd.get("ssn"));
      if (pin.length !== 4) return showError("PIN 4자리를 입력하세요.");
      if (birth.length !== 8) return showError("생년월일 8자리를 입력하세요.");
      if (ssn.length !== 13) return showError("주민번호 13자리를 입력하세요.");
      localStorage.setItem(PIN_KEY, pin);
      localStorage.setItem(BIRTH_KEY, birth);
      localStorage.setItem(SSN_KEY, ssn);
      showGate("admin-list");
      renderAdminList();
    }
    if (id === "admin-pin") {
      if (localStorage.getItem(PIN_KEY) !== digits(fd.get("pin"))) return showError("PIN이 다릅니다.");
      showGate("admin-list");
      renderAdminList();
    }
    if (id === "admin-reset") {
      if (localStorage.getItem(BIRTH_KEY) !== digits(fd.get("birth"))) return showError("생년월일이 다릅니다.");
      const pin = digits(fd.get("pin"));
      if (pin.length !== 4) return showError("새 PIN 4자리를 입력하세요.");
      localStorage.setItem(PIN_KEY, pin);
      showGate("admin-list");
      renderAdminList();
    }
    if (id === "admin-full") {
      if (localStorage.getItem(SSN_KEY) !== digits(fd.get("ssn"))) return showError("주민번호가 다릅니다.");
      localStorage.removeItem(PIN_KEY);
      localStorage.removeItem(BIRTH_KEY);
      localStorage.removeItem(SSN_KEY);
      showGate("admin-setup");
    }
  });
})();
