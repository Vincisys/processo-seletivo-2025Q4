import { Card } from "@/components/ui/card";

export function OwnerPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-bold">Responsáveis</h1>
          <p className="text-muted-foreground">
            Gerencie os responsáveis do sistema
          </p>
        </div>
      </Card>
    </div>
  );
}
