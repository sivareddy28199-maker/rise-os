import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/rk/PublicLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RK Study — RK Study" },
      { name: "description", content: "RK Study is a focused SSC CGL preparation platform. We help aspirants learn concepts, practise topic-wise questions, take Tier-I style mock tests and follow daily current affairs, all in one place." },
      { property: "og:title", content: "About RK Study — RK Study" },
      { property: "og:description", content: "RK Study is a focused SSC CGL preparation platform. We help aspirants learn concepts, practise topic-wise questions, take Tier-I style mock tests and follow daily current affairs, all in one place." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InfoPage title="About RK Study">
      <p>RK Study is a focused SSC CGL preparation platform. We help aspirants learn concepts, practise topic-wise questions, take Tier-I style mock tests and follow daily current affairs, all in one place.</p>
      <p className="text-muted-foreground">Our principle is simple: accuracy over quantity, clarity over complexity, and practice over passive reading.</p>
    </InfoPage>
  );
}
