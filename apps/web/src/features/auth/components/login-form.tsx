import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export function LoginForm() {
	const { login, isLoading } = useAuth();
	const [loginValue, setLoginValue] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await login({ login: loginValue, password });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="login">Login</Label>
				<Input
					id="login"
					type="text"
					value={loginValue}
					onChange={(e) => setLoginValue(e.target.value)}
					required
					disabled={isLoading}
					placeholder="eyesonasset"
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="password">Senha</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={isLoading}
					placeholder="••••••••"
				/>
			</div>
			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "Entrando..." : "Entrar"}
			</Button>
		</form>
	);
}
