export type ConsultRecord = {
  id: string;
  createdAt: string;
  date: string;
  name: string;
  phone: string;
  type: string;
  message: string;
  done: boolean;
  review: string;
};

const LIST_KEY = "cheonho-consults-v1";
const PIN_KEY = "cheonho-admin-pin";
const BIRTH_KEY = "cheonho-admin-birth";
const SSN_KEY = "cheonho-admin-ssn";

export function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadConsults(): ConsultRecord[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ConsultRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveConsults(list: ConsultRecord[]) {
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function addConsult(input: { name: string; phone: string; type: string; message: string }) {
  const name = input.name.trim();
  const phone = input.phone.trim();
  if (!name || !phone) return null;
  const now = new Date();
  const rec: ConsultRecord = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now.toISOString(),
    date: todayKey(),
    name,
    phone,
    type: input.type,
    message: input.message.trim(),
    done: false,
    review: "",
  };
  const list = loadConsults();
  list.push(rec);
  saveConsults(list);
  return rec;
}

export function updateConsult(id: string, patch: Partial<Pick<ConsultRecord, "done" | "review">>) {
  const list = loadConsults().map((item) => (item.id === id ? { ...item, ...patch } : item));
  saveConsults(list);
  return list;
}

export function deleteConsult(id: string) {
  const list = loadConsults().filter((item) => item.id !== id);
  saveConsults(list);
  return list;
}

export function hasPin() {
  return Boolean(localStorage.getItem(PIN_KEY));
}
export function setPin(pin: string) {
  localStorage.setItem(PIN_KEY, pin);
}
export function checkPin(pin: string) {
  return localStorage.getItem(PIN_KEY) === pin;
}
export function hasBirth() {
  return Boolean(localStorage.getItem(BIRTH_KEY));
}
export function setBirth(birth: string) {
  localStorage.setItem(BIRTH_KEY, birth);
}
export function checkBirth(birth: string) {
  return localStorage.getItem(BIRTH_KEY) === birth;
}
export function hasSsn() {
  return Boolean(localStorage.getItem(SSN_KEY));
}
export function setSsn(ssn: string) {
  localStorage.setItem(SSN_KEY, ssn);
}
export function checkSsn(ssn: string) {
  return localStorage.getItem(SSN_KEY) === ssn;
}

export function clearAdminKeys() {
  localStorage.removeItem(PIN_KEY);
  localStorage.removeItem(BIRTH_KEY);
  localStorage.removeItem(SSN_KEY);
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateLabel(date: string) {
  const [y, m, day] = date.split("-");
  return `${y}.${m}.${day}`;
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function downloadCsv(list: ConsultRecord[]) {
  const header = ["날짜", "시간", "성함", "연락처", "상담유형", "상담내용", "처리", "상담후기"];
  const rows = list.map((r) =>
    [r.date, formatTime(r.createdAt), r.name, r.phone, r.type, r.message, r.done ? "O" : "X", r.review]
      .map(csvCell)
      .join(","),
  );
  const blob = new Blob(["\uFEFF" + [header.join(","), ...rows].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `상담내역_${todayKey()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export const CONSULT_TYPE_LABEL: Record<string, string> = {
  sell: "금 매입",
  buy: "구매 견적",
  custom: "맞춤 제작",
  visit: "방문 예약",
};
