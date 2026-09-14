import { createContext, useContext } from "react";

export type ConsultDraft = {
  type?: string;
  message?: string;
  estimate?: string;
  productSlug?: string;
};

type Ctx = {
  openConsult: (draft?: ConsultDraft) => void;
};

const ConsultContext = createContext<Ctx | null>(null);

export const ConsultProvider = ConsultContext.Provider;

export function useConsult() {
  const ctx = useContext(ConsultContext);
  if (!ctx) throw new Error("ConsultProvider missing");
  return ctx;
}
