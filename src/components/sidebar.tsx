import Image from "next/image";
import { NavLinks } from "./nav-links";
import { StatusPanel } from "./status-panel";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Image className="mascot" src="/favicon.png" width={60} height={60} alt="분홍색 토끼 Bugi" priority />
        <div className="wordmark">Bugi&nbsp;Hub</div>
      </div>
      <p className="tagline">개인 프로젝트와 서비스를 직접 운영하는 홈서버 허브.</p>
      <NavLinks />
      <hr className="hairline" />
      <StatusPanel />
      <hr className="hairline" />
      <nav className="sidebar-links" aria-label="외부 링크">
        <a href="https://github.com/YEONJI-P" target="_blank" rel="noreferrer">github.com/YEONJI-P <span aria-hidden="true">↗</span></a>
        <a href="https://sensor.bugihub.site" target="_blank" rel="noreferrer">Sensor Monitor <span aria-hidden="true">↗</span></a>
      </nav>
      <ThemeToggle />
    </aside>
  );
}
