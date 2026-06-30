import { Link, useLocation, Form } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/practice", label: "Practice", icon: "🎙️" },

  { to: "/progress", label: "Progress", icon: "📈" },
];

export function AppLayout({ children }: AppLayoutProps) {
  const { config } = useConfigurables();
  const { user } = useAuth();
  const location = useLocation();
  const appName = config?.appName ?? "SpeakFlow";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-navbarBackground text-primary-foreground shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="font-bold text-lg text-primary-foreground">
            {appName}
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-primary-foreground/80 hidden sm:block">
                {user.username}
              </span>
            )}
            <Form method="post" action="/auth/logout">
              <button
                type="submit"
                className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Sign out
              </button>
            </Form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation (mobile) */}
      <nav className="sticky bottom-0 z-40 bg-card border-t border-border sm:hidden">
        <div className="flex items-center justify-around h-16">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + "/");
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Nav */}
      <aside className="hidden sm:flex fixed left-0 top-0 h-full w-56 bg-sidebarBackground border-r border-sidebarBorder flex-col pt-14 z-30">
        <div className="p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + "/");
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebarPrimary text-sidebarPrimaryForeground"
                    : "text-sidebarForeground hover:bg-sidebarAccent hover:text-sidebarAccentForeground"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
