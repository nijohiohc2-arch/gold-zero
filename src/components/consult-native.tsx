import { SHOP } from "@/lib/shop";
import type { ConsultDraft } from "@/components/consult-context";

export function NativeConsult() {
  return (
    <dialog id="consult-now" className="consult-dialog">
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
    </dialog>
  );
}

export function openConsultNow(draft?: ConsultDraft) {
  if (typeof window === "undefined") return;
  const fn = (window as Window & { openConsultNow?: (d?: ConsultDraft) => void }).openConsultNow;
  fn?.(draft);
}
