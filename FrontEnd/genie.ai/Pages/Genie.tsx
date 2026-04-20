import { useState } from "react";
import Aside from "../Components/Aside";
import ConversationPanel from '../Components/Conversation'

type NavItem = "dashboard" | "conversations" | "booking" | "analytics" | "settings";

export default function GenieHome() {
  const [activeSection, setActiveSection] = useState<NavItem>("conversations");

  return (
    <>
      <div className="flex">
        <Aside activeSection={activeSection} onNavigate={setActiveSection} />
        <main>

               <ConversationPanel
      // ── Messages from your DB ──
      messages={[
        { id: "1", role: "guest", content: "Can we upgrade to the suite?", timestamp: "12:41 PM" },
        { id: "2", role: "assistant", content: "Sure! The Ocean Suite is available for $145/night." },
        { id: "3", role: "staff", content: "I've gone ahead and processed the upgrade for you." },
      ]}

      // ── Guest data from your DB ──
      guest={{
        name: "Elena Rodriguez",
        loyaltyTier: "Gold Elite",
        stays: 12,
        totalSpend: "$4.2k",
        online: true,
        roomNumber: "402",
        checkoutDate: "14 Oct",
        reservationDates: "11 Oct – 14 Oct",
        roomFrom: "Deluxe King",
        roomTo: "Panorama",
        preferences: ["Allergies: Peanuts", "High Floor", "Late Checkout"],
      }}

      // ── AI suggestions (optional) ──
      aiSuggestions={[
        { label: "Confirm Upgrade & Request" },
        { label: "Offer Anniversary Special" },
        { label: "Decline Room Change" },
      ]}

      // ── Callbacks ──
      onSuggestionClick={(s) => console.log("Suggestion clicked:", s.label)}
      onGenerateOffer={() => console.log("Generate offer")}
      onViewHistory={() => console.log("View history")}
      onViewFullProfile={() => console.log("View full profile")}
    />

        </main>
      </div>
    </>
  );
}
