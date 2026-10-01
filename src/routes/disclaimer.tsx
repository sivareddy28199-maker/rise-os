import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/rk/PublicLayout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — RK Study" },
      { name: "description", content: "RK Study is an independent preparation platform. It is not affiliated with the Staff Selection Commission (SSC) or any government body." },
      { property: "og:title", content: "Disclaimer — RK Study" },
      { property: "og:description", content: "RK Study is an independent preparation platform. It is not affiliated with the Staff Selection Commission (SSC) or any government body." },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <InfoPage title="Disclaimer">
      <p>RK Study is an independent preparation platform. It is not affiliated with the Staff Selection Commission (SSC) or any government body.</p>
      <p className="text-muted-foreground">We work hard to keep questions and current affairs accurate, but always check official notifications for exam dates, syllabus and rules.</p>
    </InfoPage>
  );
}
