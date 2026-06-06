import { useNavigate, useLocation, Link } from "react-router";
import { useRef, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

type NavProps = {
  back?: { to: string; label?: string };
};

export function Nav({ back }: NavProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const linksRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

  const links = [
    { label: "Home", to: "/explore" },
    { label: "The archive", to: "/archive" },
    { label: "2026 scoreboard", to: "/explore#scoreboard" },
  ];

  useEffect(() => {
    const container = linksRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>("[data-active='true']");
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicator({ left: elRect.left - containerRect.left, width: elRect.width, visible: true });
    } else {
      setIndicator(s => ({ ...s, visible: false }));
    }
  }, [pathname]);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 48px",
      borderBottom: "0.5px solid #1a1a1a",
      background: "rgba(8,8,8,0.92)", backdropFilter: "blur(14px)",
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {back && (
          <Link
            to={back.to}
            style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#777", textDecoration: "none", letterSpacing: "0.04em" }}
          >
            <ArrowLeft size={15} /> {back.label ?? "Back"}
          </Link>
        )}
        <Link
          to="/explore"
          style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 300, letterSpacing: "0.06em", color: "#fff", textDecoration: "none" }}
        >
          MetAI
        </Link>
      </div>

      {/* Right links */}
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <div ref={linksRef} style={{ display: "flex", alignItems: "center", gap: "32px", position: "relative" }}>
          {/* Sliding underline */}
          <span style={{
            position: "absolute", bottom: "-3px", height: "1px", background: "#fff",
            left: indicator.left, width: indicator.width,
            opacity: indicator.visible ? 1 : 0,
            transition: "left 0.5s cubic-bezier(0.34,1.56,0.64,1), width 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
            pointerEvents: "none",
          }} />

          {links.map(({ label, to }) => {
            const isActive = !to.includes("#") && pathname === to;
            return (
              <Link
                key={to}
                to={to}
                data-active={isActive ? "true" : undefined}
                style={{
                  fontSize: "13px",
                  color: isActive ? "#fff" : "#777",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  paddingBottom: "3px",
                  transition: "color 0.2s ease",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/analyze")}
          style={{
            fontSize: "13px",
            color: pathname === "/analyze" ? "#999" : "#080808",
            background: pathname === "/analyze" ? "transparent" : "#fff",
            padding: "10px 24px", borderRadius: "100px",
            border: pathname === "/analyze" ? "0.5px solid #333" : "none",
            cursor: "pointer", letterSpacing: "0.04em",
            transition: "all 0.2s ease",
          }}
        >
          Analyze a look →
        </button>
      </div>
    </nav>
  );
}
