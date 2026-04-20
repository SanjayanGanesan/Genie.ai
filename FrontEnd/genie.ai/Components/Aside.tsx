

type NavItem = "dashboard" | "conversations" | "booking" | "analytics" | "settings";

const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width={16} height={16}>
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "conversations",
    label: "Conversations",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width={16} height={16}>
        <path d="M3 4h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7l-4 2V5a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    id: "booking",
    label: "Booking AI",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width={16} height={16}>
        <rect x="2" y="5" width="16" height="13" rx="1.5" />
        <path d="M6 3v4M14 3v4M2 9h16" />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width={16} height={16}>
        <rect x="2" y="2" width="16" height="16" rx="1.5" />
        <path d="M6 14V10M10 14V7M14 14V11" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width={16} height={16}>
        <circle cx="10" cy="10" r="2.5" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

interface AsideProps {
  activeSection: NavItem;
  onNavigate: (section: NavItem) => void;
}

export default function Aside({ activeSection, onNavigate }: AsideProps) {
  return (
    <aside className="w-[20%] min-h-screen bg-gray-50 border-r border-gray-200 flex flex-col py-5">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 pb-6">
        <div className="w-9 h-9 bg-[#2a2060] rounded-lg flex items-center justify-center shrink-0">
          <svg viewBox="0 0 20 20" fill="white" width={18} height={18}>
            <rect x="2" y="2" width="7" height="7" rx="1" />
            <rect x="11" y="2" width="7" height="7" rx="1" />
            <rect x="2" y="11" width="7" height="7" rx="1" />
            <rect x="11" y="11" width="7" height="7" rx="1" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 leading-tight">
            The Grand<br />Oasis
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
            Premium Tier
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2.5">
        {navItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-colors ${
              activeSection === id
                ? "bg-white text-gray-900 font-medium shadow-sm"
                : "text-gray-500 hover:bg-white hover:text-gray-900"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

      {/* Invite Staff CTA */}
      <div className="mx-2.5 mt-4 bg-[#3b2fa0] rounded-xl p-3.5">
        <p className="text-[#d4cef8] text-xs leading-relaxed mb-2.5">
          Scale your team efficiency with more seats.
        </p>
        <button className="w-full border border-white text-white text-xs font-medium rounded-lg py-1.5 hover:bg-white/10 transition-colors">
          Invite Staff
        </button>
      </div>
    </aside>
  );
}