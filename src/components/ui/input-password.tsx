"use client";

/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <a
            className="outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </a>
        </div>
      </div>
    );
  },
);
InputPassword.displayName = "InputPassword";

export { InputPassword };
