import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/rk/ui";

export const Route = createFileRoute("/_authenticated/tests")({
  head: () => ({ meta: [{ title: "Tests — RK Study" }, { name: "description", content: "Daily quiz and SSC CGL Tier-I mock tests." }, { property: "og:title", content: "Tests — RK Study" }, { property: "og:description", content: "Daily quiz and SSC CGL Tier-I mock tests." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Tests" subtitle="Daily quiz and SSC CGL Tier-I mock tests." />
      <EmptyState title="This section is being built" text="It will be available in the next update." />
    </div>
  );
}
