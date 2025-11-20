import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "../hooks/use-login-mutation";
import { useState } from "react";
import { Loader2, Lock, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate: login, isPending } = useLoginMutation();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ login: loginValue, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Bem-vindo</h1>
        <p className="text-muted-foreground text-sm">
          Entre com suas credenciais para acessar
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="login">Usuário</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="login"
              type="text"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              required
              disabled={isPending}
              placeholder="ex: admin"
              className="pl-9"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="ml-auto text-sm text-orange-600 underline-offset-4 hover:underline"
              onClick={(e) => e.preventDefault()} // Placeholder behavior
            >
              Esqueceu a senha?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isPending}
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-orange-500 text-white hover:bg-orange-600"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
