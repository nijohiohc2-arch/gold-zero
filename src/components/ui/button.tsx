import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
  {
    variants: {
      variant: {
        gold: "bg-gold text-ivory hover:bg-gold-deep",
        ink: "bg-ink text-ivory hover:bg-ink-soft",
        night: "bg-night text-ivory hover:bg-night-2",
        outline: "border border-line bg-transparent text-ink hover:bg-paper",
        ghost: "text-ink hover:bg-paper",
        cream: "bg-cream text-ink border border-line hover:bg-paper",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-4",
        lg: "h-12 px-5 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
