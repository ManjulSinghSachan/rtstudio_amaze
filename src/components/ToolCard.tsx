import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ExternalLink } from "lucide-react";

interface ToolCardProps {
  name: string;
  description: string;
  url: string;
}

export const ToolCard = ({ name, description, url }: ToolCardProps) => {
  const [wantsPlayGroup, setWantsPlayGroup] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          {name}
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-accent" />
          </a>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`playgroup-${name}`}
            checked={wantsPlayGroup}
            onCheckedChange={(checked) => setWantsPlayGroup(checked as boolean)}
          />
          <label
            htmlFor={`playgroup-${name}`}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I'd like to join a play group for this tool
          </label>
        </div>
      </CardContent>
    </Card>
  );
};
