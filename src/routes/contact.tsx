import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/rk/PublicLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — RK Study" },
      { name: "description", content: "Have a question, found an error in a question, or want to suggest a feature? Email us at support@rkstudy.in." },
      { property: "og:title", content: "Contact — RK Study" },
      { property: "og:description", content: "Have a question, found an error in a question, or want to suggest a feature? Email us at support@rkstudy.in." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <InfoPage title="Contact">
      <p>Have a question, found an error in a question, or want to suggest a feature? Email us at support@rkstudy.in.</p>
      <p className="text-muted-foreground">You can also use the Report button on any question inside the app.</p>
    </InfoPage>
  );
}
