import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/rk/PublicLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — RK Study" },
      { name: "description", content: "By using RK Study you agree to use it for personal exam preparation. Please don't copy or redistribute the questions or content." },
      { property: "og:title", content: "Terms — RK Study" },
      { property: "og:description", content: "By using RK Study you agree to use it for personal exam preparation. Please don't copy or redistribute the questions or content." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <InfoPage title="Terms">
      <p>By using RK Study you agree to use it for personal exam preparation. Please don't copy or redistribute the questions or content.</p>
      <p className="text-muted-foreground">We may update features and content over time to improve the service.</p>
    </InfoPage>
  );
}
