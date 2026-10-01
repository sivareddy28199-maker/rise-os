import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/rk/PublicLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — RK Study" },
      { name: "description", content: "We collect only what we need to run RK Study: your name, email and your practice and test activity. Your data is private to your account and is never sold." },
      { property: "og:title", content: "Privacy Policy — RK Study" },
      { property: "og:description", content: "We collect only what we need to run RK Study: your name, email and your practice and test activity. Your data is private to your account and is never sold." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy">
      <p>We collect only what we need to run RK Study: your name, email and your practice and test activity. Your data is private to your account and is never sold.</p>
      <p className="text-muted-foreground">You can hide your profile from the leaderboard at any time from your Profile settings.</p>
    </InfoPage>
  );
}
