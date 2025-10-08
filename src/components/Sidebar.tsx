import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Moon, Sun, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "#about" },
  { name: "Remix", path: "#remix" },
  { name: "Contact", path: "#contact" },
];

export const Sidebar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

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
    <aside className="fixed left-0 top-0 h-screen w-80 bg-sidebar border-r border-sidebar-border px-12 py-8 flex flex-col">
      <div className="mb-12">
        <Link to="/" className="no-underline">
          <h1 className="text-xl font-sans font-normal text-foreground">Relational Tech Project</h1>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
            className={
              item.path === "/" && location.pathname === "/"
                ? "block py-2 text-sm bg-secondary px-3 rounded text-foreground no-underline"
                : "block py-2 text-sm text-foreground no-underline hover:bg-secondary/50 px-3 rounded"
            }
          >
            {item.name}
          </a>
        ))}
        
        <a
          href="https://donate.example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 py-2 text-sm text-foreground no-underline hover:bg-secondary/50 px-3 rounded mt-6 border border-border"
        >
          Donate
          <ExternalLink className="w-3 h-3" />
        </a>
      </nav>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-fit gap-2 text-sm"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        {theme === "dark" ? "Light" : "Dark"}
      </Button>
    </aside>
  );
};
