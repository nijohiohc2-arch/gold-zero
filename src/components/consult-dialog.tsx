import { useEffect, useState, type FormEvent } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { INQUIRY_TYPES, SHOP } from "@/lib/shop";
import { useShopStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: string;
  defaultMessage?: string;
  productSlug?: string;
  estimate?: string;
};

export function ConsultDialog({
  open,
  onOpenChange,
  defaultType = "buy",
  defaultMessage = "",
  productSlug,
  estimate,
}: Props) {
  const addInquiry = useShopStore((s) => s.addInquiry);
  const kakaoUrl = useShopStore((s) => s.kakaoUrl);
  const [sent, setSent] = useState(false);
  const [type, setType] = useState(defaultType);
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    if (!open) return;
    setSent(false);
    setType(defaultType);
    setMessage(defaultMessage);
  }, [open, defaultType, defaultMessage]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    addInquiry({
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      type,
      message: String(form.get("message") ?? ""),
      visitDate: String(form.get("visitDate") ?? ""),
      productSlug,
      estimate,
    });
    setSent(true);
  }

  const factory = defaultType === "custom";

  return (
    <div
      className={cn("fixed inset-0 z-50", open ? "block" : "hidden")}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <button
        type="button"
        className="absolute inset-0 bg-night/55"
        aria-label="닫기"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute inset-x-4 top-[8%] z-10 mx-auto max-h-[84vh] max-w-lg overflow-y-auto rounded-xl bg-ivory p-5 shadow-xl sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-ink">{factory ? "공장 상담" : "일반 상담"}</h2>
            <p className="mt-1 text-sm text-muted">
              {factory
                ? "공장직영 맞춤 제작입니다. 재료비+공임 기준으로 견적합니다."
                : "예상가는 참고입니다. 최종 금액은 매장 감정 후 확정됩니다."}
            </p>
          </div>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-md text-ink hover:bg-paper"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        {sent ? (
          <div className="space-y-4">
            <p className="rounded-md bg-paper px-4 py-3 text-sm leading-relaxed text-ink-soft">
              요청이 접수되었습니다. 지금 전화하거나 문자로 이어가시면 더 빠릅니다.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="ink">
                <a href={SHOP.phoneHref}>
                  <Phone className="size-4" />
                  전화
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={kakaoUrl || SHOP.smsHref}>
                  <MessageCircle className="size-4" />
                  {kakaoUrl ? "카카오" : "문자"}
                </a>
              </Button>
            </div>
            <Button variant="ghost" className="w-full" type="button" onClick={() => onOpenChange(false)}>
              닫기
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <div className="flex flex-wrap gap-2">
              {INQUIRY_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={cn(
                    "h-10 rounded-full border px-3 text-sm",
                    type === t.id ? "border-ink bg-ink text-ivory" : "border-line bg-cream text-ink-soft",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {estimate ? (
              <p className="rounded-md border border-line bg-cream px-3 py-2 text-sm tabular-nums text-ink-soft">
                {estimate}
              </p>
            ) : null}
            <label className="block text-xs text-muted">
              이름
              <Input name="name" required className="mt-1" placeholder="김지수" />
            </label>
            <label className="block text-xs text-muted">
              연락처
              <Input name="phone" required inputMode="tel" className="mt-1" placeholder="010-0000-0000" />
            </label>
            <label className="block text-xs text-muted">
              방문 희망일
              <Input name="visitDate" type="date" className="mt-1" />
            </label>
            <label className="block text-xs text-muted">
              메모 · 사진 설명
              <Textarea
                name="message"
                className="mt-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="중량, 순도, 원하는 사이즈를 적어주세요."
              />
            </label>
            <Button type="submit" className="w-full" size="lg">
              상담 요청 보내기
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
