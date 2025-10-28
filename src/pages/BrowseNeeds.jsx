import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, MapPin, Filter, AlertCircle, Heart, Send, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MADDS_MAIN_CATEGORIES, getMainCategory } from "../components/shared/MADDSCategories";
import { format } from "date-fns";

export default function BrowseNeeds() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [zipFilter, setZipFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const { data: needs = [], isLoading } = useQuery({
    queryKey: ['needs'],
    queryFn: () => base44.entities.Need.list("-created_date"),
  });

  const createResponseMutation = useMutation({
    mutationFn: (data) => base44.entities.NeedResponse.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      setShowResponseDialog(false);
      setSelectedNeed(null);
      setResponseMessage("");
    },
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
    })
    .filter(n => {
      if (!urgencyFilter) return true;
      return n.urgency === urgencyFilter;
    });

  const emergencyNeeds = needs.filter(n => 
    n.urgency === 'emergency' && n.status === 'open'
  );

  const handleRespond = (need) => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    setSelectedNeed(need);
    setShowResponseDialog(true);
  };

  const submitResponse = () => {
    if (!user || !selectedNeed) return;

    createResponseMutation.mutate({
      need_id: selectedNeed.id,
      need_title: selectedNeed.title,
      responder_id: user.id,
      responder_name: user.full_name,
      requester_id: selectedNeed.requested_by,
      message: responseMessage,
      status: "offered",
      contact_info: user.email
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#E07A5F] via-[#F2CC8F] to-[#81B29A] bg-clip-text text-transparent">
            Community Needs
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            See what your neighbors need. If you can help, reach out!
          </p>
          
          <Link to={createPageUrl("RequestResource")}>
            <Button className="bg-[#E07A5F] hover:bg-[#D16A4F] text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-5 h-5 mr-2" />
              Post What You Need
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search needs..."
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

          {/* Filters */}
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

          {/* Urgency Filter */}
          <div className="flex gap-2 flex-wrap">
            <Badge
              className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                urgencyFilter === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setUrgencyFilter('')}
            >
              All Urgency
            </Badge>
            <Badge
              className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                urgencyFilter === 'emergency' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
              onClick={() => setUrgencyFilter('emergency')}
            >
              🚨 Emergency
            </Badge>
            <Badge
              className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                urgencyFilter === 'urgent' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
              onClick={() => setUrgencyFilter('urgent')}
            >
              ⚡ Urgent
            </Badge>
          </div>
        </div>

        {/* Emergency Needs */}
        {emergencyNeeds.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Emergency Needs
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                  Critical needs that require immediate help
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyNeeds.map(need => (
                <NeedCard key={need.id} need={need} onRespond={handleRespond} />
              ))}
            </div>
          </div>
        )}

        {/* All Needs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {searchQuery || selectedCategory || zipFilter || urgencyFilter ? 'Filtered Needs' : 'All Needs'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              {filteredNeeds.length} needs
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredNeeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNeeds.map(need => (
                <NeedCard key={need.id} need={need} onRespond={handleRespond} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl">
              <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text-light)' }}>
                No needs found
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>

        {/* Response Dialog */}
        <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Offer to Help: {selectedNeed?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                Let them know you can help! Share what you have to offer and how you can connect.
              </p>
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="e.g., I have this! It's in good condition. I'm available to meet this weekend..."
                className="min-h-[120px] rounded-xl"
              />
              <p className="text-xs text-gray-500">
                They'll see your name and email to coordinate directly with you.
              </p>
            </div>
            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowResponseDialog(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={submitResponse}
                disabled={createResponseMutation.isPending || !responseMessage}
                className="flex-1 rounded-xl bg-[#E07A5F] hover:bg-[#D16A4F]"
              >
                {createResponseMutation.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Offer Help
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

function NeedCard({ need, onRespond }) {
  const mainCategory = getMainCategory(need.madds_code);
  
  const urgencyColors = {
    emergency: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', badge: 'bg-red-500' },
    urgent: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700', badge: 'bg-orange-500' },
    soon: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700', badge: 'bg-yellow-500' },
    flexible: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', badge: 'bg-gray-500' }
  };

  const urgencyStyle = urgencyColors[need.urgency] || urgencyColors.flexible;

  return (
    <Card className={`border-2 shadow-lg hover:shadow-xl transition-all ${urgencyStyle.border} ${urgencyStyle.bg}`}>
      <CardContent className="p-6 space-y-4">
        {/* Category & Urgency */}
        <div className="flex items-center justify-between">
          <Badge
            className="font-mono text-xs"
            style={{ backgroundColor: mainCategory?.color, color: 'white' }}
          >
            {need.madds_code}
          </Badge>
          <Badge className={`text-xs text-white ${urgencyStyle.badge}`}>
            {need.urgency === 'emergency' && '🚨'}
            {need.urgency === 'urgent' && '⚡'}
            {need.urgency === 'soon' && '📅'}
            {need.urgency === 'flexible' && '🕐'}
            {' '}{need.urgency}
          </Badge>
        </div>

        {/* Photo */}
        {need.photo_url && (
          <div className="aspect-video rounded-xl overflow-hidden">
            <img src={need.photo_url} alt={need.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-lg">{need.title}</h3>

        {/* Description */}
        {need.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{need.description}</p>
        )}

        {/* Details */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{need.location_zip}</span>
          </div>
          {need.quantity > 1 && (
            <p>Quantity needed: {need.quantity}</p>
          )}
          {need.needs_delivery && (
            <Badge variant="outline" className="text-xs">
              Needs Delivery
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Posted {format(new Date(need.created_date), "MMM d")}
          </p>
          <Button
            onClick={() => onRespond(need)}
            size="sm"
            className="rounded-xl bg-[#E07A5F] hover:bg-[#D16A4F]"
          >
            <Heart className="w-4 h-4 mr-1" />
            I Can Help
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}