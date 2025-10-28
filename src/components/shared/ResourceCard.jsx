import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Truck, User, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { getMainCategory } from "./MADDSCategories";

export default function ResourceCard({ resource }) {
  const mainCategory = getMainCategory(resource.madds_code);
  
  return (
    <Link to={createPageUrl(`ResourceDetail?id=${resource.id}`)}>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer border-0 bg-white h-full">
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          {resource.photo_url ? (
            <img 
              src={resource.photo_url} 
              alt={resource.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-7xl"
              style={{ backgroundColor: mainCategory?.color + '10' || '#f9fafb' }}
            >
              {mainCategory?.icon || "📦"}
            </div>
          )}
          
          {resource.status !== 'available' && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Badge className="bg-white text-gray-900 px-4 py-2 text-sm font-bold">
                {resource.status.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Badge 
              className="font-mono text-xs font-bold border-0 px-3 py-1"
              style={{ 
                backgroundColor: mainCategory?.color || '#6b7280',
                color: 'white'
              }}
            >
              {resource.madds_code}
            </Badge>
            {resource.delivery_available && (
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Truck className="w-3 h-3" />
                <span>Delivery</span>
              </div>
            )}
          </div>

          {resource.two_word_code && (
            <Badge variant="outline" className="text-xs font-medium">
              {resource.two_word_code}
            </Badge>
          )}

          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-[#E07A5F] transition-colors min-h-[3.5rem]">
            {resource.title}
          </h3>

          {resource.description && (
            <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
              {resource.description}
            </p>
          )}

          <div className="pt-3 border-t space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>{resource.location_zip}</span>
            </div>
            
            {resource.quantity > 1 && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Package className="w-3.5 h-3.5" />
                <span>Quantity: {resource.quantity}</span>
              </div>
            )}

            {resource.condition && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="capitalize">{resource.condition.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}