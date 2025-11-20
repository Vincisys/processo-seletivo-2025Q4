import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

export interface EyesonInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

const EyesonInput = forwardRef<HTMLInputElement, EyesonInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          "pl-10 w-full h-11 bg-white", // Styles common to all inputs in sheets
          className
        )}
        {...props}
      />
    );
  }
);

EyesonInput.displayName = "EyesonInput";

export { EyesonInput };
