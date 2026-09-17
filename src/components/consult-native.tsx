import { useLayoutEffect } from "react";
import { SHOP } from "@/lib/shop";
import type { ConsultDraft } from "@/components/consult-context";
import { addConsult } from "@/lib/consult-store";

declare global {
  interface Window {
    openConsultNow?: (draft?: ConsultDraft) => void;
    __consultQueue?: ConsultDraft[];
  }
}

function typeFromKind(kind: string | null) {
  if (kind === "factory") return "custom";
  if (kind === "sell" || kind === "buy" || kind === "custom" || kind === "visit") return kind;
  return "visit";
}

function box() {
  return document.getElementById("consult-now");
}

function paint(root: HTMLElement, opts: ConsultDraft = {}) {
  const type = opts.type || "visit";
  const factory = type === "custom";
  root.dataset.type = type;
  const title = root.querySelector("#consult-title");
  const desc = root.querySelector("#consult-desc");
  const est = root.querySelector("#consult-est") as HTMLElement | null;
  const msg = root.querySelector("#consult-msg") as HTMLTextAreaElement | null;
  const fields = root.querySelector("#consult-form-fields") as HTMLElement | null;
  const ok = root.querySelector("#consult-ok") as HTMLElement | null;
  if (title) title.textContent = factory ? "공장 상담" : "일반 상담";
  if (desc) {
    desc.textContent = factory
      ? "공장직영 맞춤 제작입니다. 재료비+공임 기준으로 견적합니다."
      : "예상가는 참고입니다. 최종 금액은 매장 감정 후 확정됩니다.";
  }
  if (est) {
    if (opts.estimate) {
      est.hidden = false;
      est.textContent = opts.estimate;
    } else {
      est.hidden = true;
      est.textContent = "";
    }
  }
  if (msg && opts.message != null) msg.value = opts.message;
  if (fields) fields.hidden = false;
  if (ok) ok.hidden = true;
  root.querySelectorAll("#consult-types [data-type]").forEach((b) => {
    b.classList.toggle("on", b.getAttribute("data-type") === type);
  });
}

function show(root: HTMLElement) {
  root.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function hide(root: HTMLElement) {
  root.classList.remove("is-open");
  document.body.style.overflow = "";
}

function openConsult(opts?: ConsultDraft) {
  const root = box();
  if (!root) {
    window.__consultQueue = window.__consultQueue || [];
    window.__consultQueue.push(opts || {});
    return;
  }
  paint(root, opts || {});
  show(root);
}

export function NativeConsult() {
  useLayoutEffect(() => {
    const root = box();
    if (!root) return;
    window.openConsultNow = openConsult;
    const queued = window.__consultQueue || [];
    window.__consultQueue = [];
    queued.forEach((item) => openConsult(item));

    const targetEl = (e: Event) => {
      const raw = e.target as Node | null;
      return raw instanceof Element ? raw : raw?.parentElement;
    };

    const onOpen = (e: Event) => {
      const node = targetEl(e);
      if (!node) return;
      const t = node.closest("[data-open-consult]");
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      const kind = t.getAttribute("data-open-consult");
      const type = typeFromKind(kind);
      const estimate = t.getAttribute("data-estimate") || "";
      const preset =
        kind === "factory"
          ? "공장 직영 맞춤 제작 상담 원합니다. 공장가로 견적 부탁합니다."
          : kind === "sell"
            ? "금 매입 상담 원합니다."
            : kind === "buy"
              ? "오늘 시세로 구매 견적 원합니다."
              : "";
      openConsult({
        type,
        estimate,
        message: t.getAttribute("data-message") || preset,
      });
    };

    const onClick = (e: MouseEvent) => {
      const node = targetEl(e);
      if (!node) return;
      if (node.closest("#consult-close, #consult-close-2")) {
        hide(root);
        return;
      }
      if (node === root) {
        hide(root);
        return;
      }
      const typeBtn = node.closest("#consult-types [data-type]");
      if (typeBtn) {
        root.dataset.type = typeBtn.getAttribute("data-type") || "visit";
        root.querySelectorAll("#consult-types [data-type]").forEach((b) => {
          b.classList.toggle("on", b.getAttribute("data-type") === root.dataset.type);
        });
      }
    };

    const onSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (!form || form.id !== "consult-form") return;
      e.preventDefault();
      const fd = new FormData(form);
      addConsult({
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        type: root.dataset.type || "visit",
        message: [String(fd.get("message") ?? ""), root.querySelector("#consult-est")?.textContent]
          .filter(Boolean)
          .join(" · "),
      });
      const fields = document.getElementById("consult-form-fields");
      const ok = document.getElementById("consult-ok");
      if (fields) fields.hidden = true;
      if (ok) ok.hidden = false;
    };

    document.addEventListener("pointerdown", onOpen, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("pointerdown", onOpen, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div id="consult-now" className="consult-overlay" role="dialog" aria-modal="true">
      <div className="consult-sheet">
        <form id="consult-form">
          <div className="consult-h">
            <div>
              <h2 id="consult-title">일반 상담</h2>
              <p id="consult-desc">예상가는 참고입니다. 최종 금액은 매장 감정 후 확정됩니다.</p>
            </div>
            <button id="consult-close" type="button" aria-label="닫기">
              ×
            </button>
          </div>
          <div id="consult-form-fields">
            <div id="consult-types" className="consult-types">
              <button type="button" data-type="sell">
                금 매입
              </button>
              <button type="button" data-type="buy">
                구매 견적
              </button>
              <button type="button" data-type="custom">
                맞춤 제작
              </button>
              <button type="button" data-type="visit">
                방문 예약
              </button>
            </div>
            <p id="consult-est" hidden />
            <label>
              이름
              <input name="name" required placeholder="김지수" />
            </label>
            <label>
              연락처
              <input name="phone" required inputMode="tel" placeholder="010-0000-0000" />
            </label>
            <label>
              방문 희망일
              <input name="visitDate" type="date" />
            </label>
            <label>
              메모 · 사진 설명
              <textarea id="consult-msg" name="message" placeholder="중량, 순도, 원하는 사이즈를 적어주세요." />
            </label>
            <button className="consult-submit" type="submit">
              상담 요청 보내기
            </button>
          </div>
          <div id="consult-ok" hidden>
            <p className="consult-ok-msg">요청이 접수되었습니다. 지금 전화하거나 문자로 이어가시면 더 빠릅니다.</p>
            <div className="consult-ok-row">
              <a href={SHOP.phoneHref}>전화</a>
              <a href={SHOP.smsHref}>문자</a>
            </div>
            <button id="consult-close-2" type="button">
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function openConsultNow(draft?: ConsultDraft) {
  if (typeof window === "undefined") return;
  openConsult(draft);
}
