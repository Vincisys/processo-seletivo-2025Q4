import { LoginForm } from "@/features/auth/components/login-form";
import { Box } from "lucide-react";

export function LoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
            <Box className="size-5" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            eyesonasset
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-orange-50 lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center p-12">
          <div className="text-white max-w-lg text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Controle Total dos Seus Ativos
            </h2>
            <p className="text-lg text-orange-50">
              Gerencie, monitore e otimize seus recursos com a plataforma
              EyesOnAsset. Simplicidade e eficiência em um só lugar.
            </p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
