import { CURRENT_THEME } from "../data/mockData";
import { Card } from "./ui/card";
import { Palette, Shapes, Sparkles, MessageSquare } from "lucide-react";

const iconMap = {
  Silhouette: Shapes,
  Material: Sparkles,
  "Artistic Movement": Palette,
  "Conceptual Depth": MessageSquare
};

export function ThemeAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl mb-2">{CURRENT_THEME.title}</h1>
        <p className="text-muted-foreground">Met Gala {CURRENT_THEME.year}</p>
      </div>

      <Card className="p-6">
        <p className="text-lg leading-relaxed">{CURRENT_THEME.description}</p>
      </Card>

      <div>
        <h2 className="text-2xl mb-4">Theme Dimensions</h2>
        <p className="text-muted-foreground mb-6">
          Every look is scored across these four critical dimensions to determine theme alignment.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {CURRENT_THEME.dimensions.map((dimension) => {
            const Icon = iconMap[dimension.name as keyof typeof iconMap];
            return (
              <Card key={dimension.name} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2">{dimension.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {dimension.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dimension.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 rounded-full bg-muted text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
