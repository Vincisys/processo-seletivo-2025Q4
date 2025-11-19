import { Card } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-muted-foreground">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}

