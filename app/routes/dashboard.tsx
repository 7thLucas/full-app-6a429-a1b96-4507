import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/speakflow/components/app-layout";
import { Dashboard } from "~/speakflow/components/dashboard";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-1 px-6 pt-4">
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Your learning hub — daily goals, streak, scores, and AI insights at a glance. 👍
        </p>
      </div>
      <Dashboard />
    </AppLayout>
  );
}
