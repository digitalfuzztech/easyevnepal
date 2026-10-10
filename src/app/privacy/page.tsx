import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Privacy policy</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/85">
        <p>We collect only what an inquiry needs: name, contact details, vehicle of interest, and your message. Source page and consent status are stored for service quality.</p>
        <p>We do not sell personal data. We contact you only about your inquiry unless you separately opt in to updates.</p>
        <p>Lead records are currently stored in a local JSON file on the server in this build (data/leads.json, git-ignored). Before production, connect a managed database and document retention there.</p>
        <p>Contact us via the inquiry page to request correction or deletion of your inquiry.</p>
      </div>
    </div>
  );
}
