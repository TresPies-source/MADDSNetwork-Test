import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Users, 
  Lock,
  Globe,
  UserPlus,
  Package,
  Plus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ResourceCard from "../components/shared/ResourceCard";

export default function CircleDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const circleId = urlParams.get('id');

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

  const { data: circle, isLoading } = useQuery({
    queryKey: ['circle', circleId],
    queryFn: async () => {
      const circles = await base44.entities.Circle.list();
      return circles.find(c => c.id === circleId);
    },
    enabled: !!circleId,
  });

  const { data: circleResources = [] } = useQuery({
    queryKey: ['circleResources', circleId],
    queryFn: async () => {
      const resources = await base44.entities.Resource.list();
      // For now, showing all resources - in production, filter by circle_id
      return resources.filter(r => r.status === 'available').slice(0, 6);
    },
    enabled: !!circleId,
  });

  const { data: members = [] } = useQuery({
    queryKey: ['circleMembers', circleId],
    queryFn: async () => {
      if (!circle?.member_ids) return [];
      const users = await base44.entities.User.list();
      return users.filter(u => circle.member_ids.includes(u.id));
    },
    enabled: !!circle?.member_ids,
  });

  if (isLoading || !circle) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: 'var(--color-text-light)' }}>Loading circle...</p>
        </div>
      </div>
    );
  }

  const isMember = circle.member_ids?.includes(user?.id);
  const isCreator = circle.created_by === user?.id;

  if (!isMember) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Private Circle
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>
                You must be a member to view this circle
              </p>
              <Button onClick={() => navigate(createPageUrl("Circles"))}>
                Back to Circles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Circles"))}
            className="rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {circle.name}
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              Circle Details
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column - Circle Info */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Circle Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    {circle.is_private ? (
                      <Lock className="w-8 h-8 text-white" />
                    ) : (
                      <Globe className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle>{circle.name}</CardTitle>
                    <Badge variant={circle.is_private ? "default" : "secondary"} className="mt-1">
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {circle.description}
                  </p>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500">
                    Created by {circle.creator_name}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members ({circle.member_count || 0})
                </CardTitle>
                {isCreator && (
                  <Button size="sm" variant="outline" className="rounded-xl">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {member.full_name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{member.full_name}</p>
                      {member.id === circle.created_by && (
                        <Badge variant="secondary" className="text-xs mt-1">Creator</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Resources */}
          <div className="md:col-span-2 space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                Shared Resources
              </h2>
              <Link to={createPageUrl("AddResource")}>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Share in Circle
                </Button>
              </Link>
            </div>

            {circleResources.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    No resources shared yet
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                    Be the first to share a resource with this circle
                  </p>
                  <Link to={createPageUrl("AddResource")}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Share Resource
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {circleResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}

            {/* Circle Guidelines */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Circle Guidelines</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Resources shared in this circle are only visible to members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Trust and respect are the foundation of this space</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Share sensitive requests here that you wouldn't post publicly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Support each other with compassion and no judgment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}