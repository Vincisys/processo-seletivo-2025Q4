import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from "@/features/auth/services/auth.service";

export default function Header() {
  const { logout } = useAuth();
  const isAuthenticated = authService.isAuthenticated();
  const links = [{ to: "/", label: "Home" }] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} to={to}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
