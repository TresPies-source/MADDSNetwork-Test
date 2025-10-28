import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ category, resourceCount = 0 }) {
  return (
    <Link to={createPageUrl(`BrowseResources?category=${category.code}`)}>
      <Card 
        className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer border-0 h-full"
        style={{ backgroundColor: 'white' }}
      >
        <div 
          className="h-28 flex items-center justify-center text-5xl relative overflow-hidden"
          style={{ backgroundColor: category.color + '10' }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ backgroundColor: category.color }}
          />
          <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
            {category.icon}
          </span>
        </div>

        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span 
              className="font-mono text-xs font-bold px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: category.color + '20',
                color: category.color 
              }}
            >
              {category.code}00
            </span>
            {resourceCount > 0 && (
              <span className="text-xs font-medium text-gray-500">
                {resourceCount}
              </span>
            )}
          </div>

          <h3 
            className="font-bold text-base leading-tight group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1"
            style={{ color: 'var(--color-text)' }}
          >
            {category.title}
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            {category.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}