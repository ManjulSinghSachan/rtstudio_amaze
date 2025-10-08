import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { StoryCard } from "@/components/StoryCard";
import { PromptCard } from "@/components/PromptCard";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

const TOOLS = [
  { name: "Lovable", description: "AI-powered app builder for creating web tools", url: "https://lovable.dev" },
  { name: "Replit", description: "Collaborative coding platform", url: "https://replit.com" },
  { name: "Supabase", description: "Backend and database for your apps", url: "https://supabase.com" },
  { name: "GitHub", description: "Version control and collaboration", url: "https://github.com" },
  { name: "Twilio", description: "SMS and communication APIs", url: "https://twilio.com" },
  { name: "Resend", description: "Email for developers", url: "https://resend.com" },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<any[]>([]);
  const [newStory, setNewStory] = useState("");
  const [attribution, setAttribution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user has access
    const access = localStorage.getItem("studio_access");
    if (access !== "granted") {
      navigate("/auth");
      return;
    }

    // Load stories
    const loadStories = async () => {
      const { data } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) setStories(data);
    };

    loadStories();
  }, [navigate]);

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("stories")
        .insert({
          story_text: newStory,
          attribution,
        });

      if (error) throw error;

      toast({
        title: "Story added!",
        description: "Your spark has been shared with the community.",
      });

      setNewStory("");
      setAttribution("");
      setIsDialogOpen(false);

      // Reload stories
      const { data } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) setStories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-80">
        <header className="sticky top-0 bg-background border-b border-border px-12 py-6 flex items-center justify-end z-10">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg px-6">
            Join Us
          </Button>
        </header>

        <div className="px-12 py-16 max-w-4xl space-y-12">
          {/* Home Section */}
          <section className="space-y-8">
            <h1 className="text-5xl font-fraunces font-medium leading-tight">
              We can build what we need
            </h1>
            <div className="space-y-6 text-base">
              <p>
                Many of us wish our neighborhoods were more connected. We want to live in 
                neighborhoods where we learn from the creativity, care, and skills of our neighbors 
                — and share our gifts too.
              </p>
              <p>
                We've been told a perfect app or platform would help us, but that hasn't panned 
                out. The hard truth is that no one is coming to save us.
              </p>
              <p className="font-medium">
                The good news: we can build what we need!
              </p>
            </div>
          </section>

          {/* Story Board */}
          <section id="stories" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black mb-2">Story Board</h2>
                <p className="text-muted-foreground">
                  See what's possible. Neighborhood sparks shared by members of the studio.
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Add your idea</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share your story</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleStorySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="story">Your story (1-3 sentences)</Label>
                      <Textarea
                        id="story"
                        value={newStory}
                        onChange={(e) => setNewStory(e.target.value)}
                        rows={4}
                        placeholder="Share what's happening—or could happen—with relational tech..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attribution">Attribution</Label>
                      <Input
                        id="attribution"
                        value={attribution}
                        onChange={(e) => setAttribution(e.target.value)}
                        placeholder="Your first name or 'Anonymous'"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Sharing..." : "Share Story"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stories.length === 0 ? (
                <p className="text-muted-foreground col-span-2">No stories yet. Be the first to share!</p>
              ) : (
                stories.map((story) => (
                  <StoryCard
                    key={story.id}
                    id={story.id}
                    story={story.story_text}
                    attribution={story.attribution}
                  />
                ))
              )}
            </div>
          </section>

          {/* Prompt Pond */}
          <section id="prompts" className="space-y-6">
            <div>
              <h2 className="text-3xl font-black mb-2">Prompt Pond</h2>
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
          </section>

          {/* Tools for Crafting */}
          <section id="tools" className="space-y-6">
            <div>
              <h2 className="text-3xl font-black mb-2">Tools for Crafting</h2>
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
          </section>

          {/* Footer */}
          <footer id="contact" className="border-t border-border pt-12 pb-24 text-center">
            <p className="text-sm text-muted-foreground">
              The Relational Tech Studio is part of the Relational Tech Project.<br />
              Together, we can build what we need.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
