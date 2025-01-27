import ButtonProfile from "./button-profile";
import ButtonSearch from "./button-search";
import ButtonSidebar from "./button-sidebar";
import { DarkModeToogle } from "./dark-mode-toggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[100] flex items-center justify-between border-b bg-card px-2 py-4 shadow dark:border-gray-300">
      <div className="flex items-center gap-2">
        <ButtonSidebar />
        <p className="font-bold">Tick Apps</p>
      </div>
      <div className="flex">
        <ButtonSearch />
        <DarkModeToogle />
        <ButtonProfile />
      </div>
    </nav>
  );
}
