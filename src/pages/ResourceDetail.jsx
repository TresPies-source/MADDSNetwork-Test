import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Package, Truck, User, Heart, Send, Calendar, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { getMainCategory } from "../components/shared/MADDSCategories";
import { format } from "date-fns";

export default function ResourceDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const resourceId = urlParams.get('id');

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

  const { data: resource, isLoading } = useQuery({
    queryKey: ['resource', resourceId],
    queryFn: async () => {
      const resources = await base44.entities.Resource.list();
      return resources.find(r => r.id === resourceId);
    },
    enabled: !!resourceId,
  });

  const createRequestMutation = useMutation({
    mutationFn: (data) => base44.entities.Request.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setShowRequestDialog(false);
      setRequestMessage("");
      alert("Request sent! The owner will be notified.");
    },
  });

  const handleRequest = () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    setShowRequestDialog(true);
  };

  const submitRequest = () => {
    if (!user || !resource) return;

    createRequestMutation.mutate({
      resource_id: resource.id,
      resource_title: resource.title,
      requested_by: user.id,
      requested_by_name: user.full_name,
      offered_by: resource.offered_by,
      message: requestMessage,
      status: "pending",
      contact_info: user.email
    });
  };

  if (isLoading || !resource) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: 'var(--color-text-light)' }}>Loading resource...</p>
        </div>
      </div>
    );
  }

  const mainCategory = getMainCategory(resource.madds_code);
  const isOwner = user && user.id === resource.offered_by;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Home"))}
            className="rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Resource Details
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Left Column - Image */}
          <div>
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="aspect-square bg-gray-100">
                {resource.photo_url ? (
                  <img
                    src={resource.photo_url}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-8xl"
                    style={{ backgroundColor: mainCategory?.color + '10' }}
                  >
                    {mainCategory?.icon || "📦"}
                  </div>
                )}
              </div>
            </Card>

            {/* Status Badge */}
            <div className="mt-4">
              <Badge
                className={`text-sm px-4 py-2 ${
                  resource.status === 'available'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-500'
                }`}
              >
                {resource.status === 'available' ? '✓ Available Now' : resource.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            
            {/* MADDS Code & Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className="font-mono text-sm font-bold px-4 py-2"
                  style={{
                    backgroundColor: mainCategory?.color,
                    color: 'white'
                  }}
                >
                  {resource.madds_code}
                </Badge>
                {resource.two_word_code && (
                  <Badge variant="outline" className="text-sm px-4 py-2">
                    {resource.two_word_code}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium" style={{ color: mainCategory?.color }}>
                {mainCategory?.title}
              </p>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
              {resource.title}
            </h2>

            {/* Description */}
            {resource.description && (
              <Card className="border-0 bg-gradient-to-br from-[#E07A5F]/5 to-[#F2CC8F]/5">
                <CardContent className="p-5">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Details Grid */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5 space-y-4">
                
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-[#E07A5F]" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{resource.location_zip}</p>
                  </div>
                </div>

                {resource.quantity > 1 && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Package className="w-5 h-5 text-[#E07A5F]" />
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{resource.quantity} available</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-700">
                  <Info className="w-5 h-5 text-[#E07A5F]" />
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium capitalize">{resource.condition?.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {resource.pickup_available && (
                    <Badge variant="outline" className="text-xs">
                      ✓ Pickup Available
                    </Badge>
                  )}
                  {resource.delivery_available && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Delivery Available
                    </Badge>
                  )}
                </div>

                {resource.availability_window && (
                  <div className="flex items-start gap-3 text-gray-700 pt-3 border-t">
                    <Calendar className="w-5 h-5 text-[#E07A5F] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="font-medium">{resource.availability_window}</p>
                    </div>
                  </div>
                )}

                {resource.pickup_instructions && (
                  <div className="flex items-start gap-3 text-gray-700 pt-3 border-t">
                    <Info className="w-5 h-5 text-[#E07A5F] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Coordination Details</p>
                      <p className="text-sm leading-relaxed">{resource.pickup_instructions}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Offered By */}
            <Card className="border-0 bg-gradient-to-br from-[#81B29A]/5 to-[#81B29A]/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Offered by</p>
                    <p className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                      Community Member
                    </p>
                    <p className="text-xs text-gray-500">
                      Posted {format(new Date(resource.created_date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {!isOwner && resource.status === 'available' && (
              <Button
                onClick={handleRequest}
                className="w-full py-6 text-lg rounded-2xl bg-[#E07A5F] hover:bg-[#D16A4F] shadow-lg hover:shadow-xl transition-all"
              >
                <Heart className="w-5 h-5 mr-2" />
                I Need This
              </Button>
            )}

            {isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm text-blue-800">
                  This is your resource. You'll be notified when someone requests it.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Request Dialog */}
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request: {resource.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                Share your story (optional). This helps build trust and connection in our community.
              </p>
              <Textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="e.g., This would help my family because... I'll use it for..."
                className="min-h-[120px] rounded-xl"
              />
              <p className="text-xs text-gray-500">
                The owner will see your name and email to coordinate pickup/delivery.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRequestDialog(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={submitRequest}
                disabled={createRequestMutation.isPending}
                className="flex-1 rounded-xl bg-[#E07A5F] hover:bg-[#D16A4F]"
              >
                {createRequestMutation.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}