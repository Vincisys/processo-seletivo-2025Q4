import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef, type Ref } from "react";
import type { VariantProps } from "class-variance-authority";

export interface EyesonButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "destructive"
    | "ghost"
    | "link";
}

export const EyesonButton = forwardRef<HTMLButtonElement, EyesonButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variantClasses = {
      primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-sm",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
      outline:
        "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-orange-500 underline-offset-4 hover:underline",
    };

    // Mapeia as variantes customizadas para as variantes do shadcn onde possível para manter os estilos base
    const shadcnVariant = ["outline", "ghost", "link", "secondary"].includes(
      variant
    )
      ? (variant as Exclude<
          VariantProps<typeof buttonVariants>["variant"],
          "primary" | "destructive"
        >)
      : "primary";

    return (
      <Button
        ref={ref as Ref<HTMLButtonElement>}
        variant={
          shadcnVariant as Exclude<
            VariantProps<typeof buttonVariants>["variant"],
            "primary"
          >
        }
        className={cn(
          // Sobrescreve apenas quando estilos específicos de variantes customizadas são necessários
          // Para primary/destructive usamos nossas cores personalizadas em vez das definições padrão do shadcn
          (variant === "primary" || variant === "destructive") &&
            variantClasses[variant],
          // Para link queremos uma cor laranja específica
          variant === "link" && variantClasses.link,
          className
        )}
        {...props}
      />
    );
  }
);

EyesonButton.displayName = "EyesonButton";
