
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Send, 
  Check, 
  X, 
  MessageCircle, 
  Package, 
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Bell,
  HelpCircle // Added HelpCircle icon import
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function MyActivity() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null); // Not used in current logic, but keeping for potential future use
  const [responseDialog, setResponseDialog] = useState({ open: false, type: '', request: null });
  const [responseMessage, setResponseMessage] = useState("");
  const [gratitudeDialog, setGratitudeDialog] = useState({ open: false, request: null });
  const [gratitudeMessage, setGratitudeMessage] = useState("");

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

  const { data: allRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: () => base44.entities.Request.list("-created_date"),
    enabled: !!user,
  });

  const { data: myResources = [] } = useQuery({
    queryKey: ['myResources'],
    queryFn: async () => {
      const resources = await base44.entities.Resource.list();
      return resources.filter(r => r.offered_by === user?.id);
    },
    enabled: !!user,
  });

  const { data: myNeeds = [] } = useQuery({
    queryKey: ['myNeeds'],
    queryFn: async () => {
      const needs = await base44.entities.Need.list("-created_date");
      return needs.filter(n => n.requested_by === user?.id);
    },
    enabled: !!user,
  });

  const { data: myOffers = [] } = useQuery({
    queryKey: ['myOffers'],
    queryFn: async () => {
      const responses = await base44.entities.NeedResponse.list("-created_date");
      return responses.filter(r => r.responder_id === user?.id);
    },
    enabled: !!user,
  });

  const { data: receivedOffers = [] } = useQuery({
    queryKey: ['receivedOffers'],
    queryFn: async () => {
      const responses = await base44.entities.NeedResponse.list("-created_date");
      return responses.filter(r => r.requester_id === user?.id);
    },
    enabled: !!user,
  });

  const { data: myWatches = [] } = useQuery({
    queryKey: ['myWatches', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const watches = await base44.entities.Watch.list();
      return watches.filter(w => w.user_id === user.id);
    },
    enabled: !!user,
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Request.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setResponseDialog({ open: false, type: '', request: null });
      setResponseMessage("");
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Resource.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['myResources'] });
    },
  });

  const updateNeedMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Need.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myNeeds'] });
      queryClient.invalidateQueries({ queryKey: ['needs'] }); // Invalidate all needs for general list
    },
  });

  const updateNeedResponseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.NeedResponse.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivedOffers'] });
      queryClient.invalidateQueries({ queryKey: ['myOffers'] });
      queryClient.invalidateQueries({ queryKey: ['myNeeds'] }); // A change to a response might affect the need's status display
      queryClient.invalidateQueries({ queryKey: ['needs'] }); // A change to a response might affect the need's status display
    },
  });

  const createGratitudeMutation = useMutation({
    mutationFn: (data) => base44.entities.Gratitude.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gratitude'] });
      setGratitudeDialog({ open: false, request: null });
      setGratitudeMessage("");
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <p className="mb-4">Please sign in to view your activity</p>
          <Button onClick={() => base44.auth.redirectToLogin()}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const sentRequests = allRequests.filter(r => r.requested_by === user.id);
  const receivedRequests = allRequests.filter(r => r.offered_by === user.id);
  const pendingOffers = receivedOffers.filter(o => o.status === 'offered');

  const handleAccept = (request) => {
    setResponseDialog({ open: true, type: 'accept', request });
  };

  const handleDecline = (request) => {
    setResponseDialog({ open: true, type: 'decline', request });
  };

  const submitResponse = () => {
    const { type, request } = responseDialog;
    
    updateRequestMutation.mutate({
      id: request.id,
      data: {
        status: type === 'accept' ? 'accepted' : 'declined',
        response_message: responseMessage
      }
    });

    // If accepting, reserve the resource
    if (type === 'accept') {
      updateResourceMutation.mutate({
        id: request.resource_id,
        data: { status: 'reserved' }
      });
    }
  };

  const markCompleted = (request) => {
    updateRequestMutation.mutate({
      id: request.id,
      data: { status: 'completed' }
    });

    // Update resource status
    updateResourceMutation.mutate({
      id: request.resource_id,
      data: { status: 'fulfilled' }
    });

    // Prompt for gratitude
    setGratitudeDialog({ open: true, request });
  };

  const submitGratitude = () => {
    const request = gratitudeDialog.request;
    
    createGratitudeMutation.mutate({
      from_user: user.id,
      from_user_name: user.full_name,
      to_user: request.offered_by,
      to_user_name: "Community Member", // We'd need to fetch this from resource owner or request data
      resource_id: request.resource_id,
      message: gratitudeMessage,
      is_public: true
    });
  };

  const acceptOffer = (offer) => {
    updateNeedResponseMutation.mutate({
      id: offer.id,
      data: { status: 'accepted' }
    });

    // Update the corresponding need's status to 'in_progress'
    updateNeedMutation.mutate({
      id: offer.need_id,
      data: { status: 'in_progress' }
    });
  };

  const declineOffer = (offer) => {
    updateNeedResponseMutation.mutate({
      id: offer.id,
      data: { status: 'declined' }
    });
  };

  const markNeedFulfilled = (need) => {
    updateNeedMutation.mutate({
      id: need.id,
      data: { status: 'fulfilled' }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'declined': return 'bg-gray-500';
      case 'offered': return 'bg-purple-500'; // For NeedResponse
      case 'open': return 'bg-green-500'; // For Need
      case 'in_progress': return 'bg-blue-500'; // For Need
      case 'fulfilled': return 'bg-gray-500'; // For Need
      case 'available': return 'bg-green-500'; // For Resource
      case 'reserved': return 'bg-blue-500'; // For Resource
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle2 className="w-4 h-4" />;
      case 'completed': return <Heart className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      case 'offered': return <HelpCircle className="w-4 h-4" />; // For NeedResponse
      case 'open': return <Bell className="w-4 h-4" />; // For Need
      case 'in_progress': return <Clock className="w-4 h-4" />; // For Need
      case 'fulfilled': return <CheckCircle2 className="w-4 h-4" />; // For Need
      case 'available': return <Package className="w-4 h-4" />; // For Resource
      case 'reserved': return <Clock className="w-4 h-4" />; // For Resource
      default: return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            My Activity
          </h1>
          <p style={{ color: 'var(--color-text-light)' }}>
            Track your resources, needs, requests, and offers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Items Given</p>
                  <p className="text-3xl font-bold text-[#E07A5F]">{user.items_given || 0}</p>
                </div>
                <Package className="w-8 h-8 text-[#E07A5F]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Items Received</p>
                  <p className="text-3xl font-bold text-[#81B29A]">{user.items_received || 0}</p>
                </div>
                <Heart className="w-8 h-8 text-[#81B29A]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Offers</p>
                  <p className="text-3xl font-bold text-purple-500">{pendingOffers.length}</p>
                </div>
                <Bell className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Watching</p>
                  <p className="text-3xl font-bold text-blue-500">{myWatches.length}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Watched Categories */}
        {myWatches.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Watched Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {myWatches.map(watch => (
                  <Badge key={watch.id} variant="outline" className="px-4 py-2">
                    {watch.madds_code} | {watch.madds_class}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                You'll be notified when new resources are posted in these categories
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="requests-sent">Requests Sent</TabsTrigger>
            <TabsTrigger value="requests-received">
              Received
              {receivedRequests.filter(r => r.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-red-500">{receivedRequests.filter(r => r.status === 'pending').length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="needs">My Needs</TabsTrigger>
            <TabsTrigger value="offers-made">Offers Made</TabsTrigger>
            <TabsTrigger value="offers-received">
              Offers
              {pendingOffers.length > 0 && (
                <Badge className="ml-2 bg-red-500">{pendingOffers.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Resources I've Shared */}
          <TabsContent value="resources" className="space-y-4">
            {myResources.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No resources shared yet</p>
                  <Link to={createPageUrl("AddResource")}>
                    <Button className="bg-[#E07A5F] hover:bg-[#D16A4F]">
                      Share a Resource
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              myResources.map(resource => (
                <Card key={resource.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link to={createPageUrl(`ResourceDetail?id=${resource.id}`)}>
                          <h3 className="text-xl font-bold hover:text-[#E07A5F] transition-colors">
                            {resource.title}
                          </h3>
                        </Link>
                        <Badge className={`${getStatusColor(resource.status)} text-white mt-2 flex items-center gap-1`}>
                          {getStatusIcon(resource.status)}
                          {resource.status === 'available' ? 'Available' : resource.status === 'reserved' ? 'Reserved' : 'Fulfilled'}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={createPageUrl(`ResourceDetail?id=${resource.id}`)}>
                          <Button size="sm" variant="outline" className="w-full whitespace-nowrap">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Requests I've Sent */}
          <TabsContent value="requests-sent" className="space-y-4">
            {sentRequests.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Send className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    No requests yet
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                    Browse resources and request items you need
                  </p>
                  <Link to={createPageUrl("Home")}>
                    <Button className="bg-[#E07A5F] hover:bg-[#D16A4F]">
                      Browse Resources
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              sentRequests.map(request => (
                <Card key={request.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(request.status)} text-white flex items-center gap-1`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(request.created_date), "MMM d, yyyy")}
                          </span>
                        </div>

                        <Link to={createPageUrl(`ResourceDetail?id=${request.resource_id}`)}>
                          <h3 className="text-xl font-bold hover:text-[#E07A5F] transition-colors">
                            {request.resource_title}
                          </h3>
                        </Link>

                        {request.message && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-600 italic">
                              Your message: "{request.message}"
                            </p>
                          </div>
                        )}

                        {request.response_message && (
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <p className="text-sm font-medium text-blue-900 mb-1">Response from giver:</p>
                            <p className="text-sm text-blue-800">"{request.response_message}"</p>
                          </div>
                        )}

                        {request.contact_info && request.status === 'accepted' && (
                          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <p className="text-sm font-medium text-green-900 mb-1">
                              Contact info to coordinate:
                            </p>
                            <p className="text-sm text-green-800">{request.contact_info}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {request.status === 'accepted' && (
                          <Button
                            onClick={() => markCompleted(request)}
                            className="bg-green-500 hover:bg-green-600 whitespace-nowrap"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Mark Received
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Requests I've Received */}
          <TabsContent value="requests-received" className="space-y-4">
            {receivedRequests.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    No requests yet
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                    When people request your resources, they'll appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              receivedRequests.map(request => (
                <Card key={request.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(request.status)} text-white flex items-center gap-1`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(request.created_date), "MMM d, yyyy")}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Request for:</p>
                          <Link to={createPageUrl(`ResourceDetail?id=${request.resource_id}`)}>
                            <h3 className="text-xl font-bold hover:text-[#E07A5F] transition-colors">
                              {request.resource_title}
                            </h3>
                          </Link>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <p className="text-sm font-medium text-purple-900 mb-1">
                            From: {request.requested_by_name || "Community Member"}
                          </p>
                          {/* We don't want to show requester's contact info unless given by them */}
                          {/* {request.contact_info && (
                            <p className="text-sm text-purple-800">
                              Contact: {request.contact_info}
                            </p>
                          )} */}
                        </div>

                        {request.message && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm font-medium text-gray-900 mb-1">Their message:</p>
                            <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                          </div>
                        )}
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleAccept(request)}
                            className="bg-green-500 hover:bg-green-600 whitespace-nowrap"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleDecline(request)}
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* My Needs */}
          <TabsContent value="needs" className="space-y-4">
            {myNeeds.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No needs posted yet</p>
                  <Link to={createPageUrl("RequestResource")}>
                    <Button className="bg-[#E07A5F] hover:bg-[#D16A4F]">
                      Post What You Need
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              myNeeds.map(need => (
                <Card key={need.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(need.status)} text-white flex items-center gap-1`}>
                            {getStatusIcon(need.status)}
                            {need.status === 'open' ? 'Open for Offers' : need.status === 'in_progress' ? 'Offer Accepted' : 'Fulfilled'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(need.created_date), "MMM d, yyyy")}
                          </span>
                        </div>

                        <Link to={createPageUrl(`NeedDetail?id=${need.id}`)}>
                          <h3 className="text-xl font-bold hover:text-[#E07A5F] transition-colors">
                            {need.title}
                          </h3>
                        </Link>

                        {need.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{need.description}</p>
                        )}

                        <div className="flex gap-2">
                          <Badge variant="outline">{need.urgency}</Badge>
                          {receivedOffers.filter(o => o.need_id === need.id && o.status === 'offered').length > 0 && (
                            <Badge className="bg-purple-500 flex items-center gap-1">
                              <Bell className="w-3 h-3" />
                              {receivedOffers.filter(o => o.need_id === need.id && o.status === 'offered').length} New Offer(s)
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {need.status === 'in_progress' && (
                          <Button
                            onClick={() => markNeedFulfilled(need)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 whitespace-nowrap"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Fulfilled
                          </Button>
                        )}
                        <Link to={createPageUrl(`NeedDetail?id=${need.id}`)}>
                          <Button size="sm" variant="outline" className="w-full whitespace-nowrap">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Offers I've Made */}
          <TabsContent value="offers-made" className="space-y-4">
            {myOffers.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No offers made yet</p>
                  <Link to={createPageUrl("BrowseNeeds")}>
                    <Button className="bg-[#E07A5F] hover:bg-[#D16A4F]">
                      Browse Community Needs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              myOffers.map(offer => (
                <Card key={offer.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(offer.status)} text-white flex items-center gap-1`}>
                            {getStatusIcon(offer.status)}
                            {offer.status === 'offered' ? 'Offer Sent' : offer.status === 'accepted' ? 'Accepted' : 'Declined'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(offer.created_date), "MMM d, yyyy")}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Offer to help with:</p>
                          <Link to={createPageUrl(`NeedDetail?id=${offer.need_id}`)}>
                            <h3 className="text-xl font-bold hover:text-[#E07A5F] transition-colors">
                              {offer.need_title}
                            </h3>
                          </Link>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-600 italic">
                            Your offer: "{offer.message}"
                          </p>
                        </div>

                        {offer.status === 'accepted' && (
                          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <p className="text-sm font-medium text-green-900">
                              ✓ Your offer was accepted! Coordinate with them to help.
                            </p>
                            {offer.contact_info && (
                              <p className="text-sm text-green-800 mt-1">
                                Contact: {offer.contact_info}
                              </p>
                            )}
                          </div>
                        )}
                         {offer.status === 'declined' && (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm font-medium text-gray-900">
                              Your offer was declined.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Offers I've Received */}
          <TabsContent value="offers-received" className="space-y-4">
            {receivedOffers.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No offers received yet</p>
                  <p className="text-sm text-gray-600">
                    When people offer to help with your needs, they'll appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              receivedOffers.map(offer => (
                <Card key={offer.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(offer.status)} text-white flex items-center gap-1`}>
                            {getStatusIcon(offer.status)}
                            {offer.status === 'offered' ? 'New Offer' : offer.status === 'accepted' ? 'Accepted' : 'Declined'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(offer.created_date), "MMM d, yyyy")}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Offer to help with:</p>
                          <Link to={createPageUrl(`NeedDetail?id=${offer.need_id}`)}>
                            <h3 className="text-xl font-bold hover:text-[#E07A5F] transition-colors">
                              {offer.need_title}
                            </h3>
                          </Link>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <p className="text-sm font-medium text-purple-900 mb-1">
                            From: {offer.responder_name || "Community Member"}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-900 mb-1">Their message:</p>
                          <p className="text-sm text-gray-700 italic">"{offer.message}"</p>
                        </div>

                        {offer.status === 'accepted' && offer.contact_info && (
                          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <p className="text-sm font-medium text-green-900 mb-1">Contact them:</p>
                            <p className="text-sm text-green-800">{offer.contact_info}</p>
                          </div>
                        )}
                      </div>

                      {offer.status === 'offered' && (
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => acceptOffer(offer)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 whitespace-nowrap"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => declineOffer(offer)}
                            size="sm"
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Response Dialog */}
        <Dialog open={responseDialog.open} onOpenChange={(open) => setResponseDialog({ ...responseDialog, open })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {responseDialog.type === 'accept' ? 'Accept Request' : 'Decline Request'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                {responseDialog.type === 'accept' 
                  ? 'Add a message with pickup details or coordination info (this will be shared with the requester):'
                  : 'Optionally add a kind message (this will be shared with the requester):'}
              </p>
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder={
                  responseDialog.type === 'accept'
                    ? "e.g., Great! I'm available weekdays after 5pm. My address is 123 Main St. You can text me at 555-123-4567."
                    : "e.g., I'm sorry, this item has already been claimed or is no longer available. Thank you for your interest!"
                }
                className="min-h-[100px] rounded-xl"
              />
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setResponseDialog({ open: false, type: '', request: null })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitResponse}
                disabled={updateRequestMutation.isPending}
                className={`flex-1 ${
                  responseDialog.type === 'accept' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {responseDialog.type === 'accept' ? 'Accept Request' : 'Decline Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Gratitude Dialog */}
        <Dialog open={gratitudeDialog.open} onOpenChange={(open) => setGratitudeDialog({ ...gratitudeDialog, open })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#E07A5F]" />
                Say Thank You
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                You just received a resource! Share your gratitude with the community to acknowledge the giver. This will appear on the Gratitude Wall.
              </p>
              <Textarea
                value={gratitudeMessage}
                onChange={(e) => setGratitudeMessage(e.target.value)}
                placeholder="e.g., This helped my family so much because... Thank you for..."
                className="min-h-[120px] rounded-xl"
              />
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setGratitudeDialog({ open: false, request: null })}
                className="flex-1"
              >
                Skip for Now
              </Button>
              <Button
                onClick={submitGratitude}
                disabled={!gratitudeMessage || createGratitudeMutation.isPending}
                className="flex-1 bg-[#E07A5F] hover:bg-[#D16A4F]"
              >
                <Heart className="w-4 h-4 mr-2" />
                Post Gratitude
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
