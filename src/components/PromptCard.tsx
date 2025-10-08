import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PromptCardProps {
  title: string;
  description: string;
  basePrompt: string;
}

export const PromptCard = ({ title, description, basePrompt }: PromptCardProps) => {
  const [userContext, setUserContext] = useState("");
  const [remixedPrompt, setRemixedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleRemix = async () => {
    if (!userContext.trim()) {
      toast({
        title: "Context needed",
        description: "Please share some context about your neighborhood or goals.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("remix-prompt", {
        body: { prompt: basePrompt, userContext },
      });

      if (error) throw error;

      setRemixedPrompt(data.remixedPrompt);
      toast({
        title: "Prompt remixed!",
        description: "Your customized prompt is ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remix prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(remixedPrompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Remix this prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Remix: {title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tell us about your neighborhood, goals, or the vibe you're going for:
                </label>
                <Textarea
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  rows={4}
                  placeholder="E.g., We're a group of 20 neighbors who want to share tools and skills. We value simplicity and privacy..."
                />
              </div>
              <Button onClick={handleRemix} disabled={isLoading} className="w-full">
                {isLoading ? "Remixing..." : "Generate Custom Prompt"}
              </Button>
              
              {remixedPrompt && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your customized prompt:</label>
                  <div className="p-4 bg-muted rounded text-sm whitespace-pre-wrap">
                    {remixedPrompt}
                  </div>
                  <Button onClick={copyToClipboard} variant="outline" className="w-full">
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
