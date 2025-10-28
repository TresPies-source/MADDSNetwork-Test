import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";

export default function WatchButton({ maddsCode, maddsClass }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

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

  const { data: watches = [] } = useQuery({
    queryKey: ['watches', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const allWatches = await base44.entities.Watch.list();
      return allWatches.filter(w => w.user_id === user.id);
    },
    enabled: !!user,
  });

  const watchMutation = useMutation({
    mutationFn: async (action) => {
      if (action === 'watch') {
        await base44.entities.Watch.create({
          user_id: user.id,
          madds_code: maddsCode,
          madds_class: maddsClass
        });
      } else {
        const watch = watches.find(w => w.madds_code === maddsCode);
        if (watch) {
          await base44.entities.Watch.delete(watch.id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watches'] });
    },
  });

  if (!user) return null;

  const isWatching = watches.some(w => w.madds_code === maddsCode);

  return (
    <Button
      onClick={() => watchMutation.mutate(isWatching ? 'unwatch' : 'watch')}
      disabled={watchMutation.isPending}
      variant={isWatching ? "default" : "outline"}
      size="sm"
      className={`rounded-xl ${isWatching ? 'bg-[#E07A5F] hover:bg-[#D16A4F]' : ''}`}
    >
      {isWatching ? (
        <>
          <BellOff className="w-4 h-4 mr-2" />
          Watching
        </>
      ) : (
        <>
          <Bell className="w-4 h-4 mr-2" />
          Watch Category
        </>
      )}
    </Button>
  );
}