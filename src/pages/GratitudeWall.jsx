import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Plus, Sparkles, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { getMainCategory } from "../components/shared/MADDSCategories";

export default function GratitudeWall() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [gratitudeMessage, setGratitudeMessage] = useState("");
  const [filter, setFilter] = useState("all");

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

  const { data: gratitudes = [], isLoading } = useQuery({
    queryKey: ['gratitude'],
    queryFn: () => base44.entities.Gratitude.list("-created_date"),
  });

  const { data: myCompletedRequests = [] } = useQuery({
    queryKey: ['myCompletedRequests'],
    queryFn: async () => {
      if (!user) return [];
      const requests = await base44.entities.Request.list();
      return requests.filter(r => 
        r.requested_by === user.id && 
        r.status === 'completed'
      );
    },
    enabled: !!user,
  });

  const createGratitudeMutation = useMutation({
    mutationFn: (data) => base44.entities.Gratitude.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gratitude'] });
      setShowCreateDialog(false);
      setGratitudeMessage("");
    },
  });

  const filteredGratitudes = gratitudes
    .filter(g => g.is_public)
    .filter(g => {
      if (filter === 'mine' && user) {
        return g.from_user === user.id || g.to_user === user.id;
      }
      if (filter === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(g.created_date) > oneWeekAgo;
      }
      return true;
    });

  const handleCreateGratitude = () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    setShowCreateDialog(true);
  };

  const submitGratitude = () => {
    if (!gratitudeMessage) return;

    createGratitudeMutation.mutate({
      from_user: user.id,
      from_user_name: user.full_name,
      to_user: "community",
      to_user_name: "MADDS Community",
      message: gratitudeMessage,
      is_public: true
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] mb-4">
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text)' }}>
            Community Gratitude Wall
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            Celebrate the connections we're building together. Every thank you strengthens our community.
          </p>
          <Button
            onClick={handleCreateGratitude}
            className="bg-[#E07A5F] hover:bg-[#D16A4F] text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Share Your Gratitude
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-[#E07A5F]/10 to-[#F2CC8F]/10">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-[#E07A5F]" />
              <p className="text-3xl font-bold text-[#E07A5F]">{gratitudes.length}</p>
              <p className="text-sm text-gray-600">Total Thank Yous</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-[#81B29A]/10 to-[#81B29A]/5">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#81B29A]" />
              <p className="text-3xl font-bold text-[#81B29A]">
                {gratitudes.filter(g => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(g.created_date) > oneWeekAgo;
                }).length}
              </p>
              <p className="text-sm text-gray-600">This Week</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-purple-50">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-3xl font-bold text-purple-600">
                {user ? gratitudes.filter(g => g.from_user === user.id || g.to_user === user.id).length : 0}
              </p>
              <p className="text-sm text-gray-600">My Connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recent">This Week</TabsTrigger>
            <TabsTrigger value="mine">My Gratitudes</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Gratitude Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredGratitudes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGratitudes.map(gratitude => {
              const mainCategory = gratitude.madds_code ? getMainCategory(gratitude.madds_code) : null;
              
              return (
                <Card key={gratitude.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  {gratitude.photo_url && (
                    <div className="aspect-video overflow-hidden rounded-t-2xl">
                      <img
                        src={gratitude.photo_url}
                        alt="Gratitude"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  <CardContent className="p-6 space-y-4">
                    {/* Message */}
                    <div className="space-y-2">
                      <Heart className="w-5 h-5 text-[#E07A5F]" fill="#E07A5F" />
                      <p className="text-gray-700 leading-relaxed italic">
                        "{gratitude.message}"
                      </p>
                    </div>

                    {/* Resource Info */}
                    {gratitude.madds_code && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                          style={{ backgroundColor: mainCategory?.color + '20' }}
                        >
                          {mainCategory?.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {mainCategory?.title}
                        </span>
                      </div>
                    )}

                    {/* From/To */}
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="font-semibold text-[#E07A5F]">
                          {gratitude.from_user_name}
                        </p>
                      </div>
                      <div className="text-2xl text-gray-300">→</div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">To</p>
                        <p className="font-semibold text-[#81B29A]">
                          {gratitude.to_user_name}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-gray-400 pt-2">
                      {format(new Date(gratitude.created_date), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-16 text-center">
              <Heart className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                {filter === 'mine' 
                  ? "No gratitudes yet" 
                  : "No gratitudes to show"}
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
                {filter === 'mine'
                  ? "When you receive or give thanks, they'll appear here"
                  : "Be the first to share your gratitude!"}
              </p>
              <Button
                onClick={handleCreateGratitude}
                className="bg-[#E07A5F] hover:bg-[#D16A4F]"
              >
                Share Gratitude
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#E07A5F]" />
                Share Your Gratitude
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                Express your thanks to someone or to the community. Your message will be visible on the Gratitude Wall.
              </p>
              <Textarea
                value={gratitudeMessage}
                onChange={(e) => setGratitudeMessage(e.target.value)}
                placeholder="e.g., Thank you to everyone in this community. The winter coat helped my daughter stay warm walking to school..."
                className="min-h-[150px] rounded-xl"
              />
              <p className="text-xs text-gray-500">
                💡 Tip: Share how this resource helped you or your family
              </p>
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
                onClick={submitGratitude}
                disabled={!gratitudeMessage || createGratitudeMutation.isPending}
                className="flex-1 bg-[#E07A5F] hover:bg-[#D16A4F]"
              >
                {createGratitudeMutation.isPending ? "Posting..." : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Post Gratitude
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