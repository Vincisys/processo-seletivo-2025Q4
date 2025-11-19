import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "@/features/auth/middleware/auth-middleware";

export const Route = createFileRoute("/")({
  beforeLoad: (context) => {
    authMiddleware(context);
  },
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
        </section>
      </div>
    </div>
  );
}
