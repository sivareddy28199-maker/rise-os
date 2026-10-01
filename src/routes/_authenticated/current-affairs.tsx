import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/rk/ui";

export const Route = createFileRoute("/_authenticated/current-affairs")({
  head: () => ({ meta: [{ title: "Articles & Current Affairs — RK Study" }, { name: "description", content: "Daily current affairs and SSC articles." }, { property: "og:title", content: "Articles & Current Affairs — RK Study" }, { property: "og:description", content: "Daily current affairs and SSC articles." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Articles & Current Affairs" subtitle="Daily current affairs and SSC articles." />
      <EmptyState title="This section is being built" text="It will be available in the next update." />
    </div>
  );
}
