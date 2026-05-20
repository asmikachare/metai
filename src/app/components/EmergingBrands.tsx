import { EMERGING_BRANDS } from "../data/mockData";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Sparkles } from "lucide-react";

export function EmergingBrands() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl mb-2">Emerging Brand Catalog</h1>
        <p className="text-muted-foreground">
          Curated database of boundary-pushing brands from NYFW, Paris, Milan, and London organized by aesthetic category
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {EMERGING_BRANDS.map((brand) => (
          <Card key={brand.name} className="overflow-hidden">
            {/* Standout Look Image */}
            <div className="relative aspect-[16/10] bg-muted">
              <img
                src={brand.standoutLooks[0].imageUrl}
                alt={`${brand.name} - ${brand.standoutLooks[0].collection}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Theme Score: {brand.standoutLooks[0].themeScore}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Brand Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl">{brand.name}</h2>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {brand.origin}
                  </div>
                </div>
                <Badge variant="secondary">{brand.aesthetic}</Badge>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed">{brand.description}</p>

              {/* Tags */}
              <div>
                <div className="text-xs text-muted-foreground mb-2">Aesthetic Tags</div>
                <div className="flex flex-wrap gap-2">
                  {brand.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Collection Info */}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Featured: {brand.standoutLooks[0].collection}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This catalog is updated each fashion week season with new brands and collections. Brands are organized by theme tags (futurism, surrealism, cultural heritage, sustainability, wearable tech, etc.) to help stylists find the perfect match for any Met Gala theme.
        </p>
      </Card>
    </div>
  );
}
