import { useMemo, useState, type FormEvent } from "react";
import {
  addConsult,
  checkBirth,
  checkPin,
  checkSsn,
  clearAdminKeys,
  CONSULT_TYPE_LABEL,
  deleteConsult,
  downloadCsv,
  formatDateLabel,
  formatTime,
  hasPin,
  loadConsults,
  setBirth,
  setPin,
  setSsn,
  todayKey,
  updateConsult,
  type ConsultRecord,
} from "@/lib/consult-store";

type Gate = "setup" | "pin" | "list" | "reset" | "full";
type Filter = "today" | "all";

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function typeLabel(type: string) {
  return CONSULT_TYPE_LABEL[type] || type;
}

export function saveConsultFromForm(input: {
  name: string;
  phone: string;
  type: string;
  message: string;
}) {
  return addConsult(input);
}

export function GoldBarButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="ml-1 inline-flex size-8 shrink-0 items-center justify-center rounded-sm opacity-80 hover:opacity-100"
        aria-label="상담 내역"
        onClick={() => setOpen(true)}
      >
        <img src="/gold-bars.png" alt="" className="h-[22px] w-[22px] object-contain" />
      </button>
      {open ? <AdminPanel onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function AdminPanel({ onClose }: { onClose: () => void }) {
  const [gate, setGate] = useState<Gate>(hasPin() ? "pin" : "setup");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("today");
  const [list, setList] = useState<ConsultRecord[]>(() => loadConsults());

  const shown = useMemo(() => {
    const today = todayKey();
    const rows = filter === "today" ? list.filter((r) => r.date === today) : list;
    return [...rows].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [list, filter]);

  function refresh() {
    setList(loadConsults());
  }

  function setup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const pin = digits(String(fd.get("pin") ?? ""));
    const birth = digits(String(fd.get("birth") ?? ""));
    const ssn = digits(String(fd.get("ssn") ?? ""));
    if (pin.length !== 4) return setError("PIN 4자리를 입력하세요.");
    if (birth.length !== 8) return setError("생년월일 8자리를 입력하세요.");
    if (ssn.length !== 13) return setError("주민번호 13자리를 입력하세요.");
    setPin(pin);
    setBirth(birth);
    setSsn(ssn);
    setError("");
    setGate("list");
    refresh();
  }

  function unlock(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const pin = digits(String(new FormData(e.currentTarget).get("pin") ?? ""));
    if (!checkPin(pin)) return setError("PIN이 다릅니다.");
    setError("");
    setGate("list");
    refresh();
  }

  function resetPin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const birth = digits(String(fd.get("birth") ?? ""));
    const pin = digits(String(fd.get("pin") ?? ""));
    if (!checkBirth(birth)) return setError("생년월일이 다릅니다.");
    if (pin.length !== 4) return setError("새 PIN 4자리를 입력하세요.");
    setPin(pin);
    setError("");
    setGate("list");
    refresh();
  }

  function fullReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ssn = digits(String(new FormData(e.currentTarget).get("ssn") ?? ""));
    if (!checkSsn(ssn)) return setError("주민번호가 다릅니다.");
    clearAdminKeys();
    setError("");
    setGate("setup");
  }

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-night/55" aria-label="닫기" onClick={onClose} />
      <div className="absolute inset-x-4 top-[7%] z-10 mx-auto max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-xl bg-ivory p-5 shadow-xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-ink">
              {gate === "list" ? "상담 내역" : gate === "setup" ? "관리자 설정" : "관리자"}
            </h2>
            <p className="mt-1 text-sm text-muted">이 휴대폰·이 브라우저에만 저장됩니다.</p>
          </div>
          <button type="button" className="grid size-11 place-items-center text-2xl leading-none" onClick={onClose}>
            ×
          </button>
        </div>

        {error ? <p className="mb-3 rounded-md bg-paper px-3 py-2 text-sm text-danger">{error}</p> : null}

        {gate === "setup" ? (
          <form onSubmit={setup} className="grid gap-3">
            <label className="text-xs text-muted">
              PIN 4자리
              <input name="pin" inputMode="numeric" maxLength={4} autoComplete="off" className="admin-input" />
            </label>
            <label className="text-xs text-muted">
              생년월일 8자리
              <input name="birth" inputMode="numeric" maxLength={8} placeholder="19900101" autoComplete="off" className="admin-input" />
            </label>
            <label className="text-xs text-muted">
              주민번호 13자리
              <input name="ssn" inputMode="numeric" maxLength={13} placeholder="숫자만" autoComplete="off" className="admin-input" />
            </label>
            <button type="submit" className="admin-submit">
              설정하고 열기
            </button>
          </form>
        ) : null}

        {gate === "pin" ? (
          <form onSubmit={unlock} className="grid gap-3">
            <label className="text-xs text-muted">
              PIN
              <input name="pin" inputMode="numeric" maxLength={4} autoComplete="off" autoFocus className="admin-input" />
            </label>
            <button type="submit" className="admin-submit">
              확인
            </button>
            <div className="flex gap-3 text-xs text-muted">
              <button type="button" className="underline" onClick={() => { setError(""); setGate("reset"); }}>
                PIN 재설정
              </button>
              <button type="button" className="underline" onClick={() => { setError(""); setGate("full"); }}>
                완전 리셋
              </button>
            </div>
          </form>
        ) : null}

        {gate === "reset" ? (
          <form onSubmit={resetPin} className="grid gap-3">
            <label className="text-xs text-muted">
              생년월일 8자리
              <input name="birth" inputMode="numeric" maxLength={8} autoComplete="off" className="admin-input" />
            </label>
            <label className="text-xs text-muted">
              새 PIN 4자리
              <input name="pin" inputMode="numeric" maxLength={4} autoComplete="off" className="admin-input" />
            </label>
            <button type="submit" className="admin-submit">
              PIN 바꾸기
            </button>
            <button type="button" className="text-xs text-muted underline" onClick={() => { setError(""); setGate("pin"); }}>
              돌아가기
            </button>
          </form>
        ) : null}

        {gate === "full" ? (
          <form onSubmit={fullReset} className="grid gap-3">
            <label className="text-xs text-muted">
              주민번호 13자리
              <input name="ssn" inputMode="numeric" maxLength={13} autoComplete="off" className="admin-input" />
            </label>
            <button type="submit" className="admin-submit">
              새 PIN 설정으로
            </button>
            <button type="button" className="text-xs text-muted underline" onClick={() => { setError(""); setGate("pin"); }}>
              돌아가기
            </button>
          </form>
        ) : null}

        {gate === "list" ? (
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button type="button" className={`admin-chip ${filter === "today" ? "on" : ""}`} onClick={() => setFilter("today")}>
                오늘 {list.filter((r) => r.date === todayKey()).length}
              </button>
              <button type="button" className={`admin-chip ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>
                누적 {list.length}
              </button>
              <button type="button" className="ml-auto text-xs text-gold-deep underline" onClick={() => downloadCsv(shown.length ? shown : list)}>
                CSV
              </button>
            </div>
            {shown.length === 0 ? (
              <p className="rounded-md bg-paper px-3 py-6 text-center text-sm text-muted">상담이 없습니다.</p>
            ) : (
              <ul className="grid gap-3">
                {shown.map((row) => (
                  <li key={row.id} className="rounded-md border border-line bg-cream p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-ink">
                        {row.name} · {row.phone}
                      </p>
                      <p className="text-[11px] text-muted">
                        {formatDateLabel(row.date)} {formatTime(row.createdAt)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-gold-deep">{typeLabel(row.type)}</p>
                    {row.message ? <p className="mt-1 text-sm text-ink-soft">{row.message}</p> : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className={`admin-ox ${row.done ? "on" : ""}`}
                        onClick={() => {
                          setList(updateConsult(row.id, { done: !row.done }));
                        }}
                      >
                        {row.done ? "O" : "X"}
                      </button>
                      <input
                        defaultValue={row.review}
                        placeholder="상담 후기"
                        className="admin-input !mt-0 !h-9 flex-1"
                        onBlur={(e) => setList(updateConsult(row.id, { review: e.target.value }))}
                      />
                      <button
                        type="button"
                        className="text-xs text-muted underline"
                        onClick={() => {
                          if (confirm("이 상담을 지울까요?")) setList(deleteConsult(row.id));
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
