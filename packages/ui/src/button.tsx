import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from ".";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-base text-text ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-2 border-border bg-main shadow-light hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:border-darkBorder dark:shadow-dark dark:hover:shadow-none",
        noShadow: "border-2 border-border bg-main dark:border-darkBorder",
        link: "text-text underline-offset-4 hover:underline dark:text-darkText",
        neutral:
          "border-2 border-border bg-white shadow-light hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:border-darkBorder dark:bg-darkBg dark:text-darkText dark:shadow-dark dark:hover:shadow-none",
        reverse:
          "border-2 border-border bg-main hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-light dark:border-darkBorder dark:hover:shadow-dark",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
