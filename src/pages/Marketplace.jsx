import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Plus, DollarSign, Repeat, Gift, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MADDS_MAIN_CATEGORIES, getMainCategory } from "../components/shared/MADDSCategories";
import { format } from "date-fns";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [zipFilter, setZipFilter] = useState("");
  const [exchangeTypeFilter, setExchangeTypeFilter] = useState("");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: () => base44.entities.Listing.list("-created_date"),
  });

  const filteredListings = listings
    .filter(l => l.status === 'active')
    .filter(l => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        l.title?.toLowerCase().includes(query) ||
        l.description?.toLowerCase().includes(query) ||
        l.madds_code?.includes(query)
      );
    })
    .filter(l => {
      if (!selectedCategory) return true;
      return l.madds_code?.startsWith(selectedCategory);
    })
    .filter(l => {
      if (!zipFilter) return true;
      return l.location_zip?.includes(zipFilter);
    })
    .filter(l => {
      if (!exchangeTypeFilter) return true;
      return l.exchange_type === exchangeTypeFilter;
    });

  const getExchangeIcon = (type) => {
    switch(type) {
      case 'sell': return <DollarSign className="w-4 h-4" />;
      case 'trade': return <Repeat className="w-4 h-4" />;
      case 'barter': return <Repeat className="w-4 h-4" />;
      case 'gift': return <Gift className="w-4 h-4" />;
      case 'time_bank': return <Clock className="w-4 h-4" />;
      case 'pay_what_you_can': return <Sparkles className="w-4 h-4" />;
      default: return null;
    }
  };

  const exchangeTypes = [
    { value: '', label: 'All Types', color: 'bg-gray-500' },
    { value: 'sell', label: 'For Sale', color: 'bg-green-600' },
    { value: 'pay_what_you_can', label: 'Pay What You Can', color: 'bg-blue-600' },
    { value: 'trade', label: 'Trade', color: 'bg-purple-600' },
    { value: 'barter', label: 'Barter', color: 'bg-orange-600' },
    { value: 'gift', label: 'Free/Gift', color: 'bg-pink-600' },
    { value: 'time_bank', label: 'Time Bank', color: 'bg-indigo-600' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#E07A5F] via-[#F2CC8F] to-[#81B29A] bg-clip-text text-transparent">
            Solidarity Marketplace
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            Buy, sell, trade, barter, or gift — community-centered exchange with MADDS classification
          </p>

          {/* What Makes Us Different */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              Not Your Typical Marketplace
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-[#E07A5F]">✓ No Platform Fees</p>
                <p className="text-gray-600">Community-owned, no extraction</p>
              </div>
              <div>
                <p className="font-semibold text-[#81B29A]">✓ Flexible Exchange</p>
                <p className="text-gray-600">Money, trade, barter, or gift</p>
              </div>
              <div>
                <p className="font-semibold text-blue-600">✓ MADDS Organized</p>
                <p className="text-gray-600">By human need, not profit</p>
              </div>
            </div>
          </div>

          <Link to={createPageUrl("CreateListing")}>
            <Button className="bg-[#E07A5F] hover:bg-[#D16A4F] text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-5 h-5 mr-2" />
              Create Listing
            </Button>
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-green-600">{listings.filter(l => l.exchange_type === 'sell').length}</p>
            <p className="text-sm text-gray-600">For Sale</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-purple-600">{listings.filter(l => l.exchange_type === 'trade').length}</p>
            <p className="text-sm text-gray-600">For Trade</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-pink-600">{listings.filter(l => l.exchange_type === 'gift').length}</p>
            <p className="text-sm text-gray-600">Free/Gift</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <p className="text-3xl font-bold text-blue-600">{listings.filter(l => l.exchange_type === 'pay_what_you_can').length}</p>
            <p className="text-sm text-gray-600">Pay What You Can</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 rounded-2xl border-2 focus:border-[#E07A5F]"
              />
            </div>
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

          {/* Exchange Type Filter */}
          <div className="flex gap-2 flex-wrap">
            {exchangeTypes.map(type => (
              <Badge
                key={type.value}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all text-white ${
                  exchangeTypeFilter === type.value ? type.color : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setExchangeTypeFilter(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>

          {/* Category Filter */}
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

        {/* Listings Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {searchQuery || selectedCategory || zipFilter || exchangeTypeFilter ? 'Search Results' : 'All Listings'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              {filteredListings.length} listings
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} getExchangeIcon={getExchangeIcon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl">
              <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text-light)' }}>
                No listings found
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                Try adjusting your filters or be the first to list!
              </p>
              <Link to={createPageUrl("CreateListing")}>
                <Button className="bg-[#E07A5F] hover:bg-[#D16A4F]">
                  Create First Listing
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* How It Works */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">How Solidarity Exchange Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#E07A5F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">1</span>
                </div>
                <h3 className="font-bold mb-2">Choose Your Terms</h3>
                <p className="text-sm text-gray-600">
                  Sell, trade, barter, gift, or "pay what you can" — you decide
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#81B29A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">2</span>
                </div>
                <h3 className="font-bold mb-2">Connect Directly</h3>
                <p className="text-sm text-gray-600">
                  No platform fees, no middlemen — coordinate directly with each other
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">3</span>
                </div>
                <h3 className="font-bold mb-2">Complete Exchange</h3>
                <p className="text-sm text-gray-600">
                  Meet up, exchange, and support your local economy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function ListingCard({ listing, getExchangeIcon }) {
  const mainCategory = getMainCategory(listing.madds_code);
  
  const exchangeColors = {
    sell: 'bg-green-600',
    pay_what_you_can: 'bg-blue-600',
    trade: 'bg-purple-600',
    barter: 'bg-orange-600',
    gift: 'bg-pink-600',
    time_bank: 'bg-indigo-600'
  };

  const exchangeLabels = {
    sell: 'For Sale',
    pay_what_you_can: 'Pay What You Can',
    trade: 'Trade',
    barter: 'Barter',
    gift: 'Free',
    time_bank: 'Time Bank'
  };

  return (
    <Link to={createPageUrl(`ListingDetail?id=${listing.id}`)}>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full">
        <div className="aspect-square overflow-hidden bg-gray-50 relative rounded-t-2xl">
          {listing.photos && listing.photos.length > 0 ? (
            <img 
              src={listing.photos[0]} 
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-7xl"
              style={{ backgroundColor: mainCategory?.color + '10' }}
            >
              {mainCategory?.icon || "📦"}
            </div>
          )}
        </div>

        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              className="font-mono text-xs"
              style={{ backgroundColor: mainCategory?.color, color: 'white' }}
            >
              {listing.madds_code}
            </Badge>
            <Badge className={`text-xs text-white flex items-center gap-1 ${exchangeColors[listing.exchange_type]}`}>
              {getExchangeIcon(listing.exchange_type)}
              {exchangeLabels[listing.exchange_type]}
            </Badge>
          </div>

          <h3 className="font-bold text-lg line-clamp-2">{listing.title}</h3>

          {listing.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
          )}

          {/* Price/Exchange Info */}
          <div className="pt-3 border-t">
            {listing.exchange_type === 'sell' && listing.price && (
              <p className="text-2xl font-bold text-green-600">${listing.price}</p>
            )}
            {listing.exchange_type === 'pay_what_you_can' && (
              <div>
                <p className="text-sm text-gray-600">Suggested: ${listing.suggested_price || 0}</p>
                <p className="text-xs text-gray-500">Minimum: ${listing.min_price || 0}</p>
              </div>
            )}
            {listing.exchange_type === 'trade' && listing.trade_for && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Trade for:</span> {listing.trade_for}
              </p>
            )}
            {listing.exchange_type === 'gift' && (
              <p className="text-lg font-bold text-pink-600">Free!</p>
            )}
            {listing.exchange_type === 'time_bank' && listing.time_hours && (
              <p className="text-lg font-bold text-indigo-600">{listing.time_hours} hours</p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{listing.location_zip}</span>
            </div>
            <span>{format(new Date(listing.created_date), "MMM d")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}