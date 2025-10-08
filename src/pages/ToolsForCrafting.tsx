import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { ToolCard } from "@/components/ToolCard";

const TOOLS = [
  { name: "Lovable", description: "AI-powered app builder for creating web tools", url: "https://lovable.dev" },
  { name: "Replit", description: "Collaborative coding platform", url: "https://replit.com" },
  { name: "Supabase", description: "Backend and database for your apps", url: "https://supabase.com" },
  { name: "GitHub", description: "Version control and collaboration", url: "https://github.com" },
  { name: "Twilio", description: "SMS and communication APIs", url: "https://twilio.com" },
  { name: "Resend", description: "Email for developers", url: "https://resend.com" },
];

const ToolsForCrafting = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("studio_access");
    if (access !== "granted") {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-black font-fraunces mb-2">Tools for Crafting</h2>
          <p className="text-muted-foreground mb-4">
            Use the tools. Share your tricks. Join a play group.
          </p>
          <p className="text-sm italic text-muted-foreground">
            Every tool is better when shared. Add your tips, and join play groups when a handful of builders are ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ToolsForCrafting;
