import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { PromptCard } from "@/components/PromptCard";

const PROMPTS = [
  {
    title: "Neighborhood Signup Flow",
    description: "A simple way for neighbors to join your community tool",
    basePrompt: "Create a neighborhood signup flow that collects names, addresses, and interests while feeling warm and welcoming.",
  },
  {
    title: "Story-Sharing Wall",
    description: "Let neighbors share what's happening in the community",
    basePrompt: "Build a story-sharing wall where neighbors can post updates, thanks, and requests with a simple card-based interface.",
  },
  {
    title: "Tool-Sharing System",
    description: "Help neighbors lend and borrow tools easily",
    basePrompt: "Create a tool library system where neighbors can list items to share, request to borrow, and coordinate pickups.",
  },
  {
    title: "Curiosity Exchange",
    description: "Connect neighbors who want to learn and teach",
    basePrompt: "Build a skills exchange where people can offer to teach (cooking, gardening) and list what they want to learn.",
  },
  {
    title: "Care Calendar",
    description: "Coordinate meal trains and mutual aid",
    basePrompt: "Create a calendar tool for organizing meal deliveries, rides, or other support for neighbors in need.",
  },
  {
    title: "Quiet Board",
    description: "Share concerns without speaking up publicly",
    basePrompt: "Build an anonymous suggestion board where neighbors can post concerns or ideas without social pressure.",
  },
];

const PromptPond = () => {
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
          <h2 className="text-4xl font-black font-fraunces mb-2">Prompt Pond</h2>
          <p className="text-muted-foreground mb-4">
            Start building. Remix a prompt and make it your own.
          </p>
          <p className="text-sm italic text-muted-foreground">
            These are ponds to dip your ideas into—remix freely and make them your own.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMPTS.map((prompt) => (
            <PromptCard key={prompt.title} {...prompt} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PromptPond;
