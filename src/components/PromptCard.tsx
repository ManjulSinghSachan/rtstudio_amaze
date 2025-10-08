import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Wand2, Eye } from "lucide-react";

interface PromptCardProps {
  id: string;
  title: string;
  category: string;
  examplePrompt: string;
}

export const PromptCard = ({ title, category, examplePrompt }: PromptCardProps) => {
  const [userContext, setUserContext] = useState("");
  const [remixedPrompt, setRemixedPrompt] = useState("");
  const [isRemixing, setIsRemixing] = useState(false);
  const [isRemixDialogOpen, setIsRemixDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRemix = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRemixing(true);

    try {
      const { data, error } = await supabase.functions.invoke("remix-prompt", {
        body: { examplePrompt, userContext },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setRemixedPrompt(data.remixedPrompt);
      toast({
        title: "Prompt remixed!",
        description: "Your customized prompt is ready.",
      });
    } catch (error) {
      console.error("Remix error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remix prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRemixing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  return (
    <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow bg-gradient-to-br from-background to-muted/20">
      <CardContent className="p-6">
        <div className="mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {category}
          </span>
        </div>
        <h3 className="text-xl font-bold font-fraunces mb-4">{title}</h3>
        
        <div className="flex gap-2">
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View Example
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{examplePrompt}</p>
                </div>
                <Button
                  onClick={() => copyToClipboard(examplePrompt)}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isRemixDialogOpen} onOpenChange={setIsRemixDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="flex-1">
                <Wand2 className="w-4 h-4 mr-2" />
                Remix
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Remix: {title}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRemix} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="context">Your Context & Ideas</Label>
                  <Textarea
                    id="context"
                    value={userContext}
                    onChange={(e) => setUserContext(e.target.value)}
                    rows={6}
                    placeholder="Describe your specific use case, goals, or what you'd like to change about this prompt..."
                    required
                  />
                </div>
                <Button type="submit" disabled={isRemixing} className="w-full">
                  {isRemixing ? "Remixing..." : "Generate Custom Prompt"}
                </Button>

                {remixedPrompt && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label>Your Customized Prompt</Label>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{remixedPrompt}</p>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(remixedPrompt)}
                      variant="outline"
                      type="button"
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Customized Prompt
                    </Button>
                  </div>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
