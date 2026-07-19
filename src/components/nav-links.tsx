"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/personal-hub", label: "Personal Hub", icon: "◇" },
  { href: "/sensor-monitor", label: "Sensor Monitor", icon: "⌁" },
  { href: "/work-log", label: "Work Log", icon: "≡" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="page-nav" aria-label="페이지 탐색">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link className={active ? "active" : undefined} href={link.href} aria-current={active ? "page" : undefined} key={link.href}>
            <span aria-hidden="true">{link.icon}</span>{link.label}
          </Link>
        );
      })}
    </nav>
  );
}
