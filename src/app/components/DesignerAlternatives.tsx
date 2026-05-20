import { DESIGNER_ALTERNATIVES } from "../data/mockData";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, TrendingUp } from "lucide-react";

export function DesignerAlternatives() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl mb-2">Designer Archive Pull</h1>
        <p className="text-muted-foreground">
          For looks that missed the brief, we surface archive pieces from the same designer that would have nailed the theme
        </p>
      </div>

      <div className="space-y-8">
        {DESIGNER_ALTERNATIVES.map((item) => (
          <div key={item.celebrity} className="space-y-4">
            {/* Current Look Header */}
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl">{item.celebrity}</h2>
                <p className="text-sm text-muted-foreground">
                  Wore {item.currentDesigner} — scored {item.currentScore}/100
                </p>
              </div>
              <Badge variant="destructive">Missed Brief</Badge>
            </div>

            {/* Alternatives */}
            <div className="grid md:grid-cols-2 gap-6">
              {item.alternatives.map((alt, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="relative aspect-[2/3] bg-muted">
                    <img
                      src={alt.imageUrl}
                      alt={`${alt.designer} ${alt.collection}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +{alt.projectedScore - item.currentScore} points
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg">{alt.designer}</h3>
                        <p className="text-sm text-muted-foreground">{alt.collection}</p>
                        <p className="text-xs text-muted-foreground">Look #{alt.lookNumber} • {alt.year}</p>
                      </div>
                      <div className="text-right bg-green-50 border border-green-200 px-3 py-1 rounded-lg">
                        <div className="text-2xl text-green-600">{alt.projectedScore}</div>
                        <div className="text-xs text-muted-foreground">projected</div>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed">{alt.reasoning}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground italic">
                <ArrowRight className="w-4 h-4 inline mr-2" />
                This makes the tool actually useful to real stylists — it's not abstract advice, it's "here is the dress, here is the season it was shown"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
