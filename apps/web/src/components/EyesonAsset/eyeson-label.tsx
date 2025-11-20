import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

export interface EyesonLabelProps
  extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

const EyesonLabel = forwardRef<HTMLLabelElement, EyesonLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        className={cn(
          "block text-sm font-semibold text-gray-900 mb-2",
          className
        )}
        {...props}
      />
    );
  }
);

EyesonLabel.displayName = "EyesonLabel";

export { EyesonLabel };
