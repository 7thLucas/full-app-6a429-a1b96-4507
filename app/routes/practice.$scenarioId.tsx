import { redirect, useNavigate, useParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/speakflow/components/app-layout";
import { VoiceTutor } from "~/speakflow/components/voice-tutor";
import { useConfigurables } from "~/modules/configurables";
import type { TPracticeScenario } from "~/modules/configurables/src/constants/configurables.default";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

export default function PracticeSessionPage() {
  const { scenarioId } = useParams();
  const { config } = useConfigurables();
  const navigate = useNavigate();
  const scenarios = (config?.practiceScenarios ?? []) as TPracticeScenario[];
  const scenario = scenarios.find((s) => s.id === scenarioId);

  if (!scenario) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Scenario not found.</p>
          <button onClick={() => navigate("/practice")} className="mt-4 text-primary hover:underline">
            Back to Scenarios
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <button
          onClick={() => navigate("/practice")}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          ← Back to Scenarios
        </button>
        <VoiceTutor
          scenario={scenario}
          onComplete={() => navigate("/dashboard")}
        />
      </div>
    </AppLayout>
  );
}
