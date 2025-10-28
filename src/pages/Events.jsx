import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Clock,
  Wrench,
  Book,
  Heart,
  Briefcase,
  CheckCircle2
} from "lucide-react";
import { format, parseISO, isFuture, isPast } from "date-fns";

const EVENT_TYPES = {
  distribution: { icon: Heart, label: "Distribution", color: "#E07A5F" },
  skill_share: { icon: Book, label: "Skill Share", color: "#F2CC8F" },
  repair_cafe: { icon: Wrench, label: "Repair Cafe", color: "#81B29A" },
  meeting: { icon: Users, label: "Meeting", color: "#9333ea" },
  other: { icon: Calendar, label: "Other", color: "#6b7280" }
};

export default function Events() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "other",
    location: "",
    location_zip: "",
    start_time: "",
    end_time: ""
  });

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData(prev => ({ ...prev, location_zip: currentUser.zip_code || "" }));
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list("-start_time"),
  });

  const { data: myRSVPs = [] } = useQuery({
    queryKey: ['myRSVPs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const rsvps = await base44.entities.EventRSVP.list();
      return rsvps.filter(r => r.user_id === user.id);
    },
    enabled: !!user,
  });

  const createEventMutation = useMutation({
    mutationFn: (data) => base44.entities.Event.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setShowCreateDialog(false);
      setFormData({
        title: "",
        description: "",
        event_type: "other",
        location: "",
        location_zip: user?.zip_code || "",
        start_time: "",
        end_time: ""
      });
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: async ({ eventId, action }) => {
      if (action === 'rsvp') {
        await base44.entities.EventRSVP.create({
          event_id: eventId,
          user_id: user.id,
          user_name: user.full_name
        });
        // Increment RSVP count
        const event = events.find(e => e.id === eventId);
        await base44.entities.Event.update(eventId, {
          rsvp_count: (event.rsvp_count || 0) + 1
        });
      } else {
        // Find and delete RSVP
        const myRSVP = myRSVPs.find(r => r.event_id === eventId);
        if (myRSVP) {
          await base44.entities.EventRSVP.delete(myRSVP.id);
          // Decrement RSVP count
          const event = events.find(e => e.id === eventId);
          await base44.entities.Event.update(eventId, {
            rsvp_count: Math.max(0, (event.rsvp_count || 0) - 1)
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['myRSVPs'] });
    },
  });

  const handleCreateEvent = () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    setShowCreateDialog(true);
  };

  const submitEvent = () => {
    createEventMutation.mutate({
      ...formData,
      created_by: user.id,
      organizer_name: user.full_name,
      rsvp_count: 0
    });
  };

  const hasRSVPd = (eventId) => {
    return myRSVPs.some(r => r.event_id === eventId);
  };

  const upcomingEvents = events.filter(e => isFuture(parseISO(e.start_time)));
  const pastEvents = events.filter(e => isPast(parseISO(e.start_time)));
  const myEvents = events.filter(e => e.created_by === user?.id);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text)' }}>
            Community Events
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            Connect in person through distributions, skill shares, repair cafes, and community gatherings.
          </p>
          <Button
            onClick={handleCreateEvent}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-purple-50">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-3xl font-bold text-purple-600">{upcomingEvents.length}</p>
              <p className="text-sm text-gray-600">Upcoming Events</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-50">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-3xl font-bold text-blue-600">{myRSVPs.length}</p>
              <p className="text-sm text-gray-600">My RSVPs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-100 to-green-50">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-3xl font-bold text-green-600">{myEvents.length}</p>
              <p className="text-sm text-gray-600">My Events</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    No upcoming events
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                    Be the first to organize a community gathering!
                  </p>
                  <Button onClick={handleCreateEvent} className="bg-purple-600 hover:bg-purple-700">
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map(event => {
                  const EventIcon = EVENT_TYPES[event.event_type]?.icon || Calendar;
                  const hasRSVP = hasRSVPd(event.id);
                  
                  return (
                    <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: EVENT_TYPES[event.event_type]?.color + '20' }}
                            >
                              <EventIcon 
                                className="w-6 h-6"
                                style={{ color: EVENT_TYPES[event.event_type]?.color }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Badge 
                                className="mb-2"
                                style={{ 
                                  backgroundColor: EVENT_TYPES[event.event_type]?.color,
                                  color: 'white'
                                }}
                              >
                                {EVENT_TYPES[event.event_type]?.label}
                              </Badge>
                              <h3 className="font-bold text-xl mb-1">{event.title}</h3>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">{event.description}</p>
                        
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-start gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">
                                {format(parseISO(event.start_time), "EEEE, MMMM d, yyyy")}
                              </p>
                              <p className="text-gray-600">
                                {format(parseISO(event.start_time), "h:mm a")}
                                {event.end_time && ` - ${format(parseISO(event.end_time), "h:mm a")}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <p className="text-gray-700">{event.location}</p>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <p className="text-gray-700">
                              {event.rsvp_count || 0} {event.rsvp_count === 1 ? 'person' : 'people'} attending
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            onClick={() => rsvpMutation.mutate({ 
                              eventId: event.id, 
                              action: hasRSVP ? 'cancel' : 'rsvp' 
                            })}
                            disabled={rsvpMutation.isPending}
                            className={`flex-1 rounded-xl ${
                              hasRSVP 
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                          >
                            {hasRSVP ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Attending
                              </>
                            ) : (
                              'RSVP'
                            )}
                          </Button>
                        </div>

                        <div className="text-xs text-gray-500 pt-2 border-t">
                          Organized by {event.organizer_name}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* My Events */}
          <TabsContent value="my-events" className="space-y-4">
            {myEvents.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    You haven't created any events yet
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                    Organize a community gathering and bring people together!
                  </p>
                  <Button onClick={handleCreateEvent} className="bg-purple-600 hover:bg-purple-700">
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myEvents.map(event => {
                  const EventIcon = EVENT_TYPES[event.event_type]?.icon || Calendar;
                  
                  return (
                    <Card key={event.id} className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: EVENT_TYPES[event.event_type]?.color + '20' }}
                          >
                            <EventIcon 
                              className="w-6 h-6"
                              style={{ color: EVENT_TYPES[event.event_type]?.color }}
                            />
                          </div>
                          <div className="flex-1">
                            <Badge 
                              className="mb-2"
                              style={{ 
                                backgroundColor: EVENT_TYPES[event.event_type]?.color,
                                color: 'white'
                              }}
                            >
                              {EVENT_TYPES[event.event_type]?.label}
                            </Badge>
                            <h3 className="font-bold text-xl">{event.title}</h3>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-700">{event.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {format(parseISO(event.start_time), "MMM d, h:mm a")}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {event.rsvp_count || 0} RSVPs
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past" className="space-y-4">
            {pastEvents.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    No past events
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastEvents.map(event => (
                  <Card key={event.id} className="border-0 shadow-lg opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{format(parseISO(event.start_time), "MMM d, yyyy")}</span>
                            <span>{event.rsvp_count || 0} attended</span>
                          </div>
                        </div>
                        <Badge variant="secondary">Past</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Event Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Community Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              
              <div className="space-y-2">
                <Label>Event Type *</Label>
                <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EVENT_TYPES).map(([key, { label, icon: Icon }]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Event Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Winter Coat Distribution"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What's happening at this event?"
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Address or virtual link"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Zip Code *</Label>
                <Input
                  value={formData.location_zip}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_zip: e.target.value }))}
                  placeholder="12345"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time *</Label>
                  <Input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
              </div>

            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitEvent}
                disabled={
                  !formData.title || 
                  !formData.description || 
                  !formData.location || 
                  !formData.start_time ||
                  createEventMutation.isPending
                }
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {createEventMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}