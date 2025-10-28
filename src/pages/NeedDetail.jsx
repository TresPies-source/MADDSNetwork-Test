import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Package, AlertCircle, User, Heart, Send, Calendar, Info, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { getMainCategory } from "../components/shared/MADDSCategories";
import { format } from "date-fns";

export default function NeedDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const needId = urlParams.get('id');

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

  const { data: need, isLoading } = useQuery({
    queryKey: ['need', needId],
    queryFn: async () => {
      const needs = await base44.entities.Need.list();
      return needs.find(n => n.id === needId);
    },
    enabled: !!needId,
  });

  const { data: responses = [] } = useQuery({
    queryKey: ['needResponses', needId],
    queryFn: async () => {
      const allResponses = await base44.entities.NeedResponse.list();
      return allResponses.filter(r => r.need_id === needId);
    },
    enabled: !!needId,
  });

  const createResponseMutation = useMutation({
    mutationFn: (data) => base44.entities.NeedResponse.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needResponses', needId] });
      setShowResponseDialog(false);
      setResponseMessage("");
    },
  });

  const updateResponseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.NeedResponse.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needResponses', needId] });
      setShowAcceptDialog(false);
      setSelectedResponse(null);
    },
  });

  const updateNeedMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Need.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['need', needId] });
      queryClient.invalidateQueries({ queryKey: ['needs'] });
    },
  });

  const handleRespond = () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    setShowResponseDialog(true);
  };

  const submitResponse = () => {
    if (!user || !need) return;

    createResponseMutation.mutate({
      need_id: need.id,
      need_title: need.title,
      responder_id: user.id,
      responder_name: user.full_name,
      requester_id: need.requested_by,
      message: responseMessage,
      status: "offered",
      contact_info: user.email
    });
  };

  const handleAcceptOffer = (response) => {
    setSelectedResponse(response);
    setShowAcceptDialog(true);
  };

  const confirmAccept = () => {
    if (!selectedResponse) return;

    // Update response status
    updateResponseMutation.mutate({
      id: selectedResponse.id,
      data: { status: "accepted" }
    });

    // Update need status
    updateNeedMutation.mutate({
      id: need.id,
      data: { status: "in_progress" }
    });
  };

  const handleDeclineOffer = (response) => {
    updateResponseMutation.mutate({
      id: response.id,
      data: { status: "declined" }
    });
  };

  const markFulfilled = () => {
    updateNeedMutation.mutate({
      id: need.id,
      data: { status: "fulfilled" }
    });
  };

  const markNoLongerNeeded = () => {
    updateNeedMutation.mutate({
      id: need.id,
      data: { status: "no_longer_needed" }
    });
  };

  if (isLoading || !need) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: 'var(--color-text-light)' }}>Loading need...</p>
        </div>
      </div>
    );
  }

  const mainCategory = getMainCategory(need.madds_code);
  const isOwner = user && user.id === need.requested_by;
  const acceptedResponse = responses.find(r => r.status === 'accepted');

  const urgencyColors = {
    emergency: { bg: 'bg-red-500', text: 'Emergency' },
    urgent: { bg: 'bg-orange-500', text: 'Urgent' },
    soon: { bg: 'bg-yellow-500', text: 'Soon' },
    flexible: { bg: 'bg-gray-500', text: 'Flexible' }
  };

  const urgencyStyle = urgencyColors[need.urgency] || urgencyColors.flexible;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("BrowseNeeds"))}
            className="rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Need Details
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Left Column - Image */}
          <div>
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="aspect-square bg-gray-100">
                {need.photo_url ? (
                  <img
                    src={need.photo_url}
                    alt={need.title}
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
            <div className="mt-4 space-y-2">
              <Badge
                className={`text-sm px-4 py-2 ${
                  need.status === 'open'
                    ? 'bg-green-500 hover:bg-green-600'
                    : need.status === 'in_progress'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-500'
                }`}
              >
                {need.status === 'open' ? '✓ Open - Looking for Help' : 
                 need.status === 'in_progress' ? '⏳ In Progress' :
                 need.status === 'fulfilled' ? '✅ Fulfilled' : 
                 '❌ No Longer Needed'}
              </Badge>
              
              <Badge className={`text-sm px-4 py-2 text-white ml-2 ${urgencyStyle.bg}`}>
                {need.urgency === 'emergency' && '🚨'}
                {need.urgency === 'urgent' && '⚡'}
                {need.urgency === 'soon' && '📅'}
                {need.urgency === 'flexible' && '🕐'}
                {' '}{urgencyStyle.text}
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
                  {need.madds_code}
                </Badge>
                {need.two_word_code && (
                  <Badge variant="outline" className="text-sm px-4 py-2">
                    {need.two_word_code}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium" style={{ color: mainCategory?.color }}>
                {mainCategory?.title}
              </p>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
              {need.title}
            </h2>

            {/* Description */}
            {need.description && (
              <Card className="border-0 bg-gradient-to-br from-[#E07A5F]/5 to-[#F2CC8F]/5">
                <CardContent className="p-5">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {need.description}
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
                    <p className="font-medium">{need.location_zip}</p>
                  </div>
                </div>

                {need.quantity > 1 && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Package className="w-5 h-5 text-[#E07A5F]" />
                    <div>
                      <p className="text-sm text-gray-500">Quantity Needed</p>
                      <p className="font-medium">{need.quantity}</p>
                    </div>
                  </div>
                )}

                {need.condition_acceptable && need.condition_acceptable.length > 0 && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <Info className="w-5 h-5 text-[#E07A5F] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Acceptable Conditions</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {need.condition_acceptable.map(condition => (
                          <Badge key={condition} variant="outline" className="text-xs">
                            {condition.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {need.can_pickup && (
                    <Badge variant="outline" className="text-xs">
                      ✓ Can Pickup
                    </Badge>
                  )}
                  {need.needs_delivery && (
                    <Badge variant="outline" className="text-xs">
                      🚚 Needs Delivery
                    </Badge>
                  )}
                </div>

                {need.coordination_notes && (
                  <div className="flex items-start gap-3 text-gray-700 pt-3 border-t">
                    <Info className="w-5 h-5 text-[#E07A5F] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Coordination Details</p>
                      <p className="text-sm leading-relaxed">{need.coordination_notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requested By */}
            <Card className="border-0 bg-gradient-to-br from-[#81B29A]/5 to-[#81B29A]/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Requested by</p>
                    <p className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                      {need.requested_by_name || "Community Member"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Posted {format(new Date(need.created_date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {!isOwner && need.status === 'open' && (
              <Button
                onClick={handleRespond}
                className="w-full py-6 text-lg rounded-2xl bg-[#E07A5F] hover:bg-[#D16A4F] shadow-lg hover:shadow-xl transition-all"
              >
                <Heart className="w-5 h-5 mr-2" />
                I Can Help!
              </Button>
            )}

            {isOwner && need.status === 'open' && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-sm text-blue-800">
                    This is your need. You'll receive offers from community members below.
                  </p>
                </div>
                <Button
                  onClick={markNoLongerNeeded}
                  variant="outline"
                  className="w-full py-6 rounded-xl"
                >
                  Mark as No Longer Needed
                </Button>
              </div>
            )}

            {isOwner && need.status === 'in_progress' && acceptedResponse && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-sm text-green-900 font-semibold mb-2">
                    ✓ You accepted help from {acceptedResponse.responder_name}
                  </p>
                  <p className="text-sm text-green-800">
                    Contact: {acceptedResponse.contact_info}
                  </p>
                </div>
                <Button
                  onClick={markFulfilled}
                  className="w-full py-6 rounded-xl bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Mark as Fulfilled
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Offers/Responses Section */}
        {isOwner && responses.length > 0 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Offers to Help ({responses.length})
              </h3>
              <div className="space-y-4">
                {responses.map(response => (
                  <Card key={response.id} className="border-0 shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {response.responder_name?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold">{response.responder_name}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(response.created_date), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                            <Badge
                              className={`ml-auto ${
                                response.status === 'accepted'
                                  ? 'bg-green-500'
                                  : response.status === 'declined'
                                  ? 'bg-gray-500'
                                  : 'bg-blue-500'
                              }`}
                            >
                              {response.status}
                            </Badge>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-700 italic">"{response.message}"</p>
                          </div>

                          {response.status === 'accepted' && (
                            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                              <p className="text-sm font-medium text-green-900 mb-1">Contact Info:</p>
                              <p className="text-sm text-green-800">{response.contact_info}</p>
                            </div>
                          )}
                        </div>

                        {response.status === 'offered' && need.status === 'open' && (
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => handleAcceptOffer(response)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleDeclineOffer(response)}
                              size="sm"
                              variant="outline"
                              className="whitespace-nowrap"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Response Dialog */}
        <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Offer to Help: {need.title}</DialogTitle>
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
                    Send Offer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Accept Dialog */}
        <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Accept This Offer?</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-4">
                You're about to accept help from <strong>{selectedResponse?.responder_name}</strong>.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                  Their contact info will be revealed to you, and they'll be notified that you accepted their offer.
                </p>
              </div>
            </div>
            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAcceptDialog(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAccept}
                disabled={updateResponseMutation.isPending}
                className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
              >
                {updateResponseMutation.isPending ? "Accepting..." : "Accept Offer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}