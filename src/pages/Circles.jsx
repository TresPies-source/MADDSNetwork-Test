import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  Plus, 
  Lock,
  Globe,
  UserPlus,
  Shield,
  Heart,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function Circles() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_private: false
  });

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

  const { data: allCircles = [] } = useQuery({
    queryKey: ['circles'],
    queryFn: () => base44.entities.Circle.list("-created_date"),
  });

  const { data: circleInvites = [] } = useQuery({
    queryKey: ['circleInvites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const invites = await base44.entities.CircleInvite.list();
      return invites.filter(i => i.invited_email === user.email && i.status === 'pending');
    },
    enabled: !!user,
  });

  const createCircleMutation = useMutation({
    mutationFn: (data) => base44.entities.Circle.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
      setShowCreateDialog(false);
      setFormData({ name: "", description: "", is_private: false });
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ circleId, email }) => {
      await base44.entities.CircleInvite.create({
        circle_id: circleId,
        invited_by: user.id,
        invited_by_name: user.full_name,
        invited_email: email,
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circleInvites'] });
      setShowInviteDialog(false);
      setInviteEmail("");
      setSelectedCircle(null);
    },
  });

  const acceptInviteMutation = useMutation({
    mutationFn: async (invite) => {
      // Update invite status
      await base44.entities.CircleInvite.update(invite.id, { status: 'accepted' });
      
      // Add user to circle
      const circle = allCircles.find(c => c.id === invite.circle_id);
      if (circle) {
        const updatedMembers = [...(circle.member_ids || []), user.id];
        await base44.entities.Circle.update(circle.id, {
          member_ids: updatedMembers,
          member_count: updatedMembers.length
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
      queryClient.invalidateQueries({ queryKey: ['circleInvites'] });
    },
  });

  const declineInviteMutation = useMutation({
    mutationFn: (inviteId) => base44.entities.CircleInvite.update(inviteId, { status: 'declined' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circleInvites'] });
    },
  });

  const handleCreateCircle = () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    setShowCreateDialog(true);
  };

  const submitCircle = () => {
    createCircleMutation.mutate({
      ...formData,
      created_by: user.id,
      creator_name: user.full_name,
      member_ids: [user.id],
      member_count: 1
    });
  };

  const handleInvite = (circle) => {
    setSelectedCircle(circle);
    setShowInviteDialog(true);
  };

  const submitInvite = () => {
    if (inviteEmail && selectedCircle) {
      inviteMutation.mutate({
        circleId: selectedCircle.id,
        email: inviteEmail
      });
    }
  };

  const myCircles = allCircles.filter(c => c.member_ids?.includes(user?.id));
  const publicCircles = allCircles.filter(c => !c.is_private && !c.member_ids?.includes(user?.id));

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text)' }}>
            Request Circles
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            Small, trusted groups for sensitive requests and private sharing. 
            Build deeper connections with people you know.
          </p>
          <Button
            onClick={handleCreateCircle}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Circle
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-100 to-indigo-50">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="text-3xl font-bold text-indigo-600">{myCircles.length}</p>
              <p className="text-sm text-gray-600">My Circles</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-purple-50">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-3xl font-bold text-purple-600">
                {myCircles.reduce((sum, c) => sum + (c.member_count || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Total Members</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-100 to-pink-50">
            <CardContent className="p-6 text-center">
              <UserPlus className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <p className="text-3xl font-bold text-pink-600">{circleInvites.length}</p>
              <p className="text-sm text-gray-600">Pending Invites</p>
            </CardContent>
          </Card>
        </div>

        {/* Invitations */}
        {circleInvites.length > 0 && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-600" />
                Circle Invitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {circleInvites.map(invite => {
                const circle = allCircles.find(c => c.id === invite.circle_id);
                return (
                  <div key={invite.id} className="bg-white rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{circle?.name}</h3>
                      <p className="text-sm text-gray-600">
                        Invited by {invite.invited_by_name}
                      </p>
                      {circle?.description && (
                        <p className="text-sm text-gray-500 mt-1">{circle.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => acceptInviteMutation.mutate(invite)}
                        disabled={acceptInviteMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => declineInviteMutation.mutate(invite.id)}
                        disabled={declineInviteMutation.isPending}
                        variant="outline"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* My Circles */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            My Circles
          </h2>
          {myCircles.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  You're not in any circles yet
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                  Create a circle or wait for an invitation from someone you trust
                </p>
                <Button onClick={handleCreateCircle} className="bg-indigo-600 hover:bg-indigo-700">
                  Create Your First Circle
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCircles.map(circle => (
                <Link key={circle.id} to={createPageUrl(`CircleDetail?id=${circle.id}`)}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all group cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            {circle.is_private ? (
                              <Lock className="w-6 h-6 text-white" />
                            ) : (
                              <Globe className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xl mb-1 group-hover:text-indigo-600 transition-colors">
                              {circle.name}
                            </h3>
                            <Badge variant={circle.is_private ? "default" : "secondary"} className="mb-2">
                              {circle.is_private ? (
                                <>
                                  <Lock className="w-3 h-3 mr-1" />
                                  Private
                                </>
                              ) : (
                                <>
                                  <Globe className="w-3 h-3 mr-1" />
                                  Public
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 line-clamp-2">{circle.description}</p>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{circle.member_count || 0} members</span>
                        </div>
                        
                        {circle.created_by === user?.id && (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              handleInvite(circle);
                            }}
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Invite
                          </Button>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Created by {circle.creator_name}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Public Circles */}
        {publicCircles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              Public Circles You Can Join
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicCircles.map(circle => (
                <Card key={circle.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{circle.name}</h3>
                        <Badge variant="secondary">
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{circle.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{circle.member_count || 0} members</span>
                    </div>

                    <Button className="w-full rounded-xl bg-teal-600 hover:bg-teal-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Request to Join
                    </Button>

                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Created by {circle.creator_name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Safety Notice */}
        <Card className="border-0 shadow-lg bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Circle Safety</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Circles are for building trust with people you know. Only invite people you trust 
                  with sensitive requests. Private circles are not visible to others and requests 
                  within them are only seen by circle members.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Circle Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create a Request Circle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Circle Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Family & Close Friends"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What's this circle for? What kind of support does it provide?"
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <Label>Private Circle</Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Only visible to invited members
                  </p>
                </div>
                <Switch
                  checked={formData.is_private}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_private: checked }))}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-800">
                  💡 You'll be able to invite people after creating the circle
                </p>
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
                onClick={submitCircle}
                disabled={!formData.name || !formData.description || createCircleMutation.isPending}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {createCircleMutation.isPending ? "Creating..." : "Create Circle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite to {selectedCircle?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                Invite someone you trust to join this circle. They'll receive an invitation 
                they can accept or decline.
              </p>
              
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="rounded-xl"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowInviteDialog(false);
                  setInviteEmail("");
                  setSelectedCircle(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitInvite}
                disabled={!inviteEmail || inviteMutation.isPending}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {inviteMutation.isPending ? "Sending..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}