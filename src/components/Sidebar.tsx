import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Story Board", path: "#stories" },
  { name: "Prompt Pond", path: "#prompts" },
  { name: "Tools for Crafting", path: "#tools" },
  { name: "Contact", path: "#contact" },
];

export const Sidebar = () => {
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border p-8 overflow-y-auto">
      <div className="mb-12">
        <Link to="/" className="block">
          <h1 className="text-xl font-black mb-1">Relational Tech</h1>
          <p className="text-sm font-bold">Studio</p>
        </Link>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
            className={cn(
              "block py-2 px-3 text-sm transition-colors rounded",
              item.path === location.pathname || (item.path.startsWith("#") && location.hash === item.path)
                ? "bg-muted font-medium"
                : "hover:bg-muted/50"
            )}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </aside>
  );
};
