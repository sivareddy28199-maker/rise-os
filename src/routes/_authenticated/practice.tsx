import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/rk/ui";

export const Route = createFileRoute("/_authenticated/practice")({
  head: () => ({ meta: [{ title: "Practice — RK Study" }, { name: "description", content: "Topic-wise practice for all four subjects." }, { property: "og:title", content: "Practice — RK Study" }, { property: "og:description", content: "Topic-wise practice for all four subjects." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Practice" subtitle="Topic-wise practice for all four subjects." />
      <EmptyState title="This section is being built" text="It will be available in the next update." />
    </div>
  );
}
