import { HISTORICAL_THEMES } from "../data/mockData";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Award, Building } from "lucide-react";

export function HistoricalArchive() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl mb-2">Historical Archive</h1>
        <p className="text-muted-foreground">
          10+ years of Met Gala themes with interpretations, top looks, and brand alignments
        </p>
      </div>

      <Card className="p-6 bg-primary/5">
        <p className="text-sm leading-relaxed">
          Stylists can use this archive to understand how themes repeat, how fashion houses evolve their aesthetic, and which brands consistently show up for the brief. This is your research tool for identifying patterns and making informed styling decisions.
        </p>
      </Card>

      <div className="space-y-6">
        {HISTORICAL_THEMES.map((theme) => (
          <Card key={theme.year} className="p-6">
            <div className="space-y-4">
              {/* Year & Title */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-2xl">{theme.year}</h2>
                  </div>
                  <h3 className="text-xl mb-2">"{theme.title}"</h3>
                </div>
                <Badge variant="outline">{theme.year === 2026 ? "Current" : "Archive"}</Badge>
              </div>

              {/* Interpretation */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Theme Interpretation</div>
                <p className="text-sm leading-relaxed">{theme.interpretation}</p>
              </div>

              {/* Grid for Top Looks and Best Brands */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                {/* Top Looks */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Top-Rated Looks</span>
                  </div>
                  <ul className="space-y-2">
                    {theme.topLooks.map((look, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>{look}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best Brands */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Best-Fit Brands</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {theme.bestBrands.map((brand) => (
                      <Badge key={brand} variant="secondary">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <strong>Coming Soon:</strong> Each historical theme will include a curated mood board of looks that would have worked—surfaced retroactively using our AI analysis engine. This helps stylists understand aesthetic patterns across years and identify designers who consistently understand the assignment.
        </p>
      </Card>
    </div>
  );
}
