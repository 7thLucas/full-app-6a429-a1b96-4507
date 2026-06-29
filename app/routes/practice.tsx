import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useNavigate } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/speakflow/components/app-layout";
import { ScenarioCard } from "~/speakflow/components/scenario-card";
import { useConfigurables } from "~/modules/configurables";
import type { TPracticeScenario } from "~/modules/configurables/src/constants/configurables.default";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

export default function PracticePage() {
  const { config } = useConfigurables();
  const navigate = useNavigate();
  const scenarios = (config?.practiceScenarios ?? []) as TPracticeScenario[];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Practice Scenarios</h1>
          <p className="text-muted-foreground mt-1">Pick a scenario and start speaking. Your AI coach will guide you.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {scenarios.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              onClick={() => navigate(`/practice/${s.id}`)}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
