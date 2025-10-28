import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Filter, BookOpen, Heart, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ResourceCard from "../components/shared/ResourceCard";
import CategoryCard from "../components/shared/CategoryCard";
import { MADDS_MAIN_CATEGORIES, getMainCategory } from "../components/shared/MADDSCategories";
import { format } from "date-fns";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [zipFilter, setZipFilter] = useState("");
  const [viewMode, setViewMode] = useState("available"); // available or needed

  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => base44.entities.Resource.list("-created_date"),
    initialData: [],
  });

  const { data: needs, isLoading: needsLoading } = useQuery({
    queryKey: ['needs'],
    queryFn: () => base44.entities.Need.list("-created_date"),
    initialData: [],
  });

  const { data: gratitude } = useQuery({
    queryKey: ['gratitude'],
    queryFn: () => base44.entities.Gratitude.list("-created_date", 3),
    initialData: [],
  });

  const filteredResources = resources
    .filter(r => r.status === 'available')
    .filter(r => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        r.title?.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        r.madds_code?.includes(query) ||
        r.two_word_code?.toLowerCase().includes(query)
      );
    })
    .filter(r => {
      if (!selectedCategory) return true;
      return r.madds_code?.startsWith(selectedCategory);
    })
    .filter(r => {
      if (!zipFilter) return true;
      return r.location_zip?.includes(zipFilter);
    });

  const filteredNeeds = needs
    .filter(n => n.status === 'open')
    .filter(n => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        n.title?.toLowerCase().includes(query) ||
        n.description?.toLowerCase().includes(query) ||
        n.madds_code?.includes(query)
      );
    })
    .filter(n => {
      if (!selectedCategory) return true;
      return n.madds_code?.startsWith(selectedCategory);
    })
    .filter(n => {
      if (!zipFilter) return true;
      return n.location_zip?.includes(zipFilter);
    });

  const emergencyResources = resources.filter(r => 
    r.madds_code?.startsWith('0') && r.status === 'available'
  ).slice(0, 4);

  const emergencyNeeds = needs.filter(n => 
    n.urgency === 'emergency' && n.status === 'open'
  ).slice(0, 4);

  const availableCount = resources.filter(r => r.status === 'available').length;
  const needsCount = needs.filter(n => n.status === 'open').length;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#E07A5F] via-[#F2CC8F] to-[#81B29A] bg-clip-text text-transparent">
            Welcome to MADDS Network
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            A trust-first mutual aid network where we share resources, build relationships, 
            and support each other with dignity.
          </p>
          
          {/* MADDS Explanation */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-[#E07A5F]" />
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                What is MADDS?
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-light)' }}>
              <span className="font-semibold text-[#E07A5F]">Mutual Aid Dewey Decimal System</span> — 
              A relationship-centered classification that organizes resources by human need, not commercial value. 
              From emergency survival (000) to life transitions (900), MADDS honors dignity, cultural diversity, 
              and community resilience.
            </p>
            <Link to={createPageUrl("LearnMADDS")}>
              <Button variant="outline" className="w-full rounded-xl border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F]/10">
                <BookOpen className="w-4 h-4 mr-2" />
                Learn the MADDS System
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link to={createPageUrl("RequestResource")}>
              <Button className="bg-[#E07A5F] hover:bg-[#D16A4F] text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                Request What You Need
              </Button>
            </Link>
            <Link to={createPageUrl("BrowseNeeds")}>
              <Button variant="outline" className="px-8 py-6 text-lg rounded-2xl border-2 border-[#81B29A] text-[#81B29A] hover:bg-[#81B29A]/10">
                See Community Needs
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-[#E07A5F]">{availableCount}</p>
            <p className="text-sm text-gray-600">Resources Available</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-[#81B29A]">{needsCount}</p>
            <p className="text-sm text-gray-600">Community Needs</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-blue-500">{emergencyNeeds.length}</p>
            <p className="text-sm text-gray-600">Emergency Needs</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-purple-500">{gratitude.length}</p>
            <p className="text-sm text-gray-600">Recent Gratitude</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search resources, categories, or MADDS codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 rounded-2xl border-2 focus:border-[#E07A5F]"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 md:w-48">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Zip code"
                  value={zipFilter}
                  onChange={(e) => setZipFilter(e.target.value)}
                  className="pl-12 py-6 rounded-2xl border-2"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            <Badge
              className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                selectedCategory === '' 
                  ? 'bg-[#E07A5F] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </Badge>
            {MADDS_MAIN_CATEGORIES.slice(0, 5).map(cat => (
              <Badge
                key={cat.code}
                className="cursor-pointer px-4 py-2 rounded-full transition-all"
                style={{
                  backgroundColor: selectedCategory === cat.code ? cat.color : '#f3f4f6',
                  color: selectedCategory === cat.code ? 'white' : '#4b5563'
                }}
                onClick={() => setSelectedCategory(cat.code)}
              >
                {cat.icon} {cat.title}
              </Badge>
            ))}
          </div>
        </div>

        {/* Emergency Section */}
        {(emergencyResources.length > 0 || emergencyNeeds.length > 0) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🚨</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                    Emergency — Help Needed Now
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                    Critical resources and urgent needs
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="needs" className="w-full">
              <TabsList>
                <TabsTrigger value="needs">
                  Emergency Needs ({emergencyNeeds.length})
                </TabsTrigger>
                <TabsTrigger value="resources">
                  Emergency Resources ({emergencyResources.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="needs" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {emergencyNeeds.map(need => (
                    <NeedCard key={need.id} need={need} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {emergencyResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Browse by Category */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Browse by Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {MADDS_MAIN_CATEGORIES.map(category => {
              const resourceCount = resources.filter(r => 
                r.madds_code?.startsWith(category.code) && r.status === 'available'
              ).length;
              const needCount = needs.filter(n => 
                n.madds_code?.startsWith(category.code) && n.status === 'open'
              ).length;
              return (
                <CategoryCard 
                  key={category.code} 
                  category={category} 
                  resourceCount={resourceCount + needCount} 
                />
              );
            })}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="available">
              Available to Give ({availableCount})
            </TabsTrigger>
            <TabsTrigger value="needed">
              Community Needs ({needsCount})
            </TabsTrigger>
          </TabsList>

          {/* Available Resources */}
          <TabsContent value="available" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {searchQuery || selectedCategory || zipFilter ? 'Search Results' : 'Recently Available'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                {filteredResources.length} resources
              </p>
            </div>

            {resourcesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredResources.slice(0, 20).map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl">
                <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text-light)' }}>
                  No resources found
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                  Try adjusting your search or filters
                </p>
                <Link to={createPageUrl("BulkShare")}>
                  <Button className="bg-[#E07A5F] hover:bg-[#D16A4F]">
                    Be the First to Share
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Community Needs */}
          <TabsContent value="needed" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {searchQuery || selectedCategory || zipFilter ? 'Search Results' : 'Recent Community Needs'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                {filteredNeeds.length} needs
              </p>
            </div>

            {needsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredNeeds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredNeeds.slice(0, 20).map(need => (
                  <NeedCard key={need.id} need={need} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl">
                <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text-light)' }}>
                  No needs found
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                  Try adjusting your search or filters
                </p>
                <Link to={createPageUrl("RequestResource")}>
                  <Button className="bg-[#E07A5F] hover:bg-[#D16A4F]">
                    Post What You Need
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Recent Gratitude */}
        {gratitude.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                Community Gratitude
              </h2>
              <Link to={createPageUrl("GratitudeWall")}>
                <Button variant="ghost" className="text-[#E07A5F]">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gratitude.filter(g => g.is_public).map(g => (
                <div key={g.id} className="bg-white rounded-2xl p-6 space-y-3 hover:shadow-lg transition-shadow">
                  <p className="text-gray-700 italic">"{g.message}"</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-[#E07A5F]">{g.from_user_name}</span>
                    <span>→</span>
                    <span className="font-medium text-[#81B29A]">{g.to_user_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Need Card Component (simplified for home page)
function NeedCard({ need }) {
  const mainCategory = getMainCategory(need.madds_code);
  
  const urgencyColors = {
    emergency: 'bg-red-500',
    urgent: 'bg-orange-500',
    soon: 'bg-yellow-500',
    flexible: 'bg-gray-500'
  };

  return (
    <Link to={createPageUrl(`NeedDetail?id=${need.id}`)}>
      <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all h-full border-2 border-transparent hover:border-[#E07A5F]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              className="font-mono text-xs"
              style={{ backgroundColor: mainCategory?.color, color: 'white' }}
            >
              {need.madds_code}
            </Badge>
            <Badge className={`text-xs text-white ${urgencyColors[need.urgency]}`}>
              {need.urgency === 'emergency' && '🚨'}
              {need.urgency === 'urgent' && '⚡'}
              {need.urgency}
            </Badge>
          </div>

          {need.photo_url && (
            <div className="aspect-video rounded-xl overflow-hidden">
              <img src={need.photo_url} alt={need.title} className="w-full h-full object-cover" />
            </div>
          )}

          <h3 className="font-bold text-base line-clamp-2">{need.title}</h3>

          {need.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{need.description}</p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
            <MapPin className="w-3 h-3" />
            <span>{need.location_zip}</span>
            <span className="ml-auto">
              {format(new Date(need.created_date), "MMM d")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}