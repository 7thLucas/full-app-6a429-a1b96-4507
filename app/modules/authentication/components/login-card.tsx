import { Form, Link, useActionData, useNavigation } from "react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

interface ActionData {
  error?: string;
}

export function LoginCard() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg border border-border">
        {/* Left panel — image + tagline */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-primary p-10 gap-6">
          <img
            src="https://client-api-stag.quantumbyte.ai/uploads/gz098zml/4507/assets/53b9c1bc-caf7-481d-aafb-e6db64bf9cb3_1782807514877_jcvnrl.png"
            alt="SpeakFlow illustration"
            className="w-full max-w-xs rounded-xl object-cover"
          />
          <p className="text-center text-lg font-semibold text-primary-foreground">
            App to help you fluent in English in one package.
          </p>
        </div>

        {/* Right panel — form */}
        <div className="w-full md:w-1/2 bg-card">
          <Card className="h-full rounded-none border-0 shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-card-foreground">Sign in</CardTitle>
              <CardDescription>Enter your email and password to access your account</CardDescription>
            </CardHeader>

            <Form method="post">
              <CardContent className="space-y-4">
                {actionData?.error && (
                  <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {actionData.error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in…" : "Sign in"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link to="/auth/register" className="font-medium underline underline-offset-4">
                    Create one
                  </Link>
                </p>
              </CardFooter>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
