import { cn } from "@/lib/utils";

interface EyesonTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function EyesonTitle({ title, subtitle, className }: EyesonTitleProps) {
  return (
    <div className={cn("mb-6 space-y-2", className)}>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground text-base">{subtitle}</p>
      )}
    </div>
  );
}
