import { CELEBRITY_LOOKS } from "../data/mockData";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-blue-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

function getScoreBg(score: number) {
  if (score >= 90) return "bg-green-50 border-green-200";
  if (score >= 75) return "bg-blue-50 border-blue-200";
  if (score >= 60) return "bg-yellow-50 border-yellow-200";
  if (score >= 40) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

export function LookScoring() {
  const sortedLooks = [...CELEBRITY_LOOKS].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl mb-2">Look Analysis</h1>
        <p className="text-muted-foreground">
          AI-scored evaluation of each Met Gala look against the "Fashion as Art" theme
        </p>
      </div>

      <div className="grid gap-6">
        {sortedLooks.map((look) => (
          <Card key={look.id} className="overflow-hidden">
            <div className="grid md:grid-cols-[300px,1fr] gap-6">
              {/* Image */}
              <div className="relative aspect-[2/3] bg-muted overflow-hidden">
                <img
                  src={look.imageUrl}
                  alt={`${look.celebrity} at Met Gala 2026`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl">
                      {look.celebrity}
                      {look.group && (
                        <span className="text-muted-foreground text-base ml-2">
                          ({look.group})
                        </span>
                      )}
                    </h2>
                    <p className="text-muted-foreground">{look.designer}</p>
                  </div>

                  <div className={`text-right ${getScoreBg(look.score)} px-4 py-2 rounded-lg border`}>
                    <div className={`text-3xl ${getScoreColor(look.score)}`}>
                      {look.score}
                    </div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>

                {/* Verdict */}
                <div>
                  <Badge variant={look.score >= 85 ? "default" : look.score >= 60 ? "secondary" : "destructive"}>
                    {look.verdict}
                  </Badge>
                </div>

                {/* Analysis */}
                <p className="text-sm leading-relaxed">{look.analysis}</p>

                {/* Dimension Scores */}
                <div className="space-y-3 pt-2">
                  <div className="text-sm text-muted-foreground">Dimension Breakdown</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Silhouette</span>
                        <span className="text-muted-foreground">{look.dimensions.silhouette}/10</span>
                      </div>
                      <Progress value={look.dimensions.silhouette * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Material</span>
                        <span className="text-muted-foreground">{look.dimensions.material}/10</span>
                      </div>
                      <Progress value={look.dimensions.material * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Artistic Movement</span>
                        <span className="text-muted-foreground">{look.dimensions.artisticMovement}/10</span>
                      </div>
                      <Progress value={look.dimensions.artisticMovement * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Conceptual Depth</span>
                        <span className="text-muted-foreground">{look.dimensions.conceptualDepth}/10</span>
                      </div>
                      <Progress value={look.dimensions.conceptualDepth * 10} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {look.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-muted rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
