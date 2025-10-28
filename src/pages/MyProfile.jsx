import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Heart, Package, Settings, Save, Shield, Eye, EyeOff, Bell } from "lucide-react";
import { format } from "date-fns";

export default function MyProfile() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    zip_code: "",
    preferred_language: "en"
  });

  const [privacySettings, setPrivacySettings] = useState({
    show_stats: true,
    show_location_zip: true,
    show_gratitude: true,
    show_active_offers: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_requests: true,
    email_accepted: true,
    email_messages: true,
    email_gratitude: true,
    email_events: true,
    email_watches: true,
    frequency: "immediate"
  });

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData({
          full_name: currentUser.full_name || "",
          bio: currentUser.bio || "",
          zip_code: currentUser.zip_code || "",
          preferred_language: currentUser.preferred_language || "en"
        });
        setPrivacySettings({
          show_stats: currentUser.privacy_show_stats !== false,
          show_location_zip: currentUser.privacy_show_location !== false,
          show_gratitude: currentUser.privacy_show_gratitude !== false,
          show_active_offers: currentUser.privacy_show_offers !== false
        });
        setNotificationSettings({
          email_requests: currentUser.notification_email_requests !== false,
          email_accepted: currentUser.notification_email_accepted !== false,
          email_messages: currentUser.notification_email_messages !== false,
          email_gratitude: currentUser.notification_email_gratitude !== false,
          email_events: currentUser.notification_email_events !== false,
          email_watches: currentUser.notification_email_watches !== false,
          frequency: currentUser.notification_frequency || "immediate"
        });
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const { data: myResources = [] } = useQuery({
    queryKey: ['myResources'],
    queryFn: async () => {
      const resources = await base44.entities.Resource.list();
      return resources.filter(r => r.offered_by === user?.id);
    },
    enabled: !!user,
  });

  const { data: myGratitudes = [] } = useQuery({
    queryKey: ['myGratitudes'],
    queryFn: async () => {
      const gratitudes = await base44.entities.Gratitude.list();
      return gratitudes.filter(g => g.to_user === user?.id || g.from_user === user?.id);
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setEditMode(false);
      base44.auth.me().then(setUser);
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      ...formData,
      privacy_show_stats: privacySettings.show_stats,
      privacy_show_location: privacySettings.show_location_zip,
      privacy_show_gratitude: privacySettings.show_gratitude,
      privacy_show_offers: privacySettings.show_active_offers,
      notification_email_requests: notificationSettings.email_requests,
      notification_email_accepted: notificationSettings.email_accepted,
      notification_email_messages: notificationSettings.email_messages,
      notification_email_gratitude: notificationSettings.email_gratitude,
      notification_email_events: notificationSettings.email_events,
      notification_email_watches: notificationSettings.email_watches,
      notification_frequency: notificationSettings.frequency
    });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: 'var(--color-text-light)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const activeOffers = myResources.filter(r => r.status === 'available').length;
  const receivedGratitudes = myGratitudes.filter(g => g.to_user === user.id).length;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] rounded-full flex items-center justify-center shadow-xl">
            <span className="text-4xl font-bold text-white">
              {user.full_name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            {user.full_name || 'User'}
          </h1>
          <p style={{ color: 'var(--color-text-light)' }}>
            Member since {format(new Date(user.created_date), "MMMM yyyy")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-[#E07A5F]" />
              <p className="text-3xl font-bold text-[#E07A5F]">{user.items_given || 0}</p>
              <p className="text-sm text-gray-600">Items Given</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-[#81B29A]" />
              <p className="text-3xl font-bold text-[#81B29A]">{user.items_received || 0}</p>
              <p className="text-sm text-gray-600">Items Received</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-[#F2CC8F]" fill="#F2CC8F" />
              <p className="text-3xl font-bold text-[#F2CC8F]">{receivedGratitudes}</p>
              <p className="text-sm text-gray-600">Thanks Received</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-3xl font-bold text-purple-500">{activeOffers}</p>
              <p className="text-sm text-gray-600">Active Offers</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                {!editMode ? (
                  <Button
                    onClick={() => setEditMode(true)}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditMode(false)}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="rounded-xl bg-[#E07A5F] hover:bg-[#D16A4F]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  {editMode ? (
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="rounded-xl"
                    />
                  ) : (
                    <p className="text-lg font-medium">{user.full_name || "Not set"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-lg font-medium text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  {editMode ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell the community about yourself..."
                      className="rounded-xl min-h-[100px]"
                    />
                  ) : (
                    <p className="text-gray-700">{user.bio || "No bio yet"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  {editMode ? (
                    <Input
                      value={formData.zip_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                      placeholder="12345"
                      className="rounded-xl"
                    />
                  ) : (
                    <p className="text-lg font-medium">{user.zip_code || "Not set"}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Used for proximity matching (privacy-preserving)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  {editMode ? (
                    <select
                      value={formData.preferred_language}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferred_language: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="zh">中文</option>
                      <option value="ar">العربية</option>
                      <option value="fr">Français</option>
                    </select>
                  ) : (
                    <p className="text-lg font-medium capitalize">{user.preferred_language || "English"}</p>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Recent Gratitudes */}
            {myGratitudes.length > 0 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#E07A5F]" />
                    Recent Gratitude
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myGratitudes.slice(0, 3).map(gratitude => (
                    <div key={gratitude.id} className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-700 italic mb-2">"{gratitude.message}"</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {gratitude.to_user === user.id ? (
                          <>
                            <span className="font-medium text-[#E07A5F]">{gratitude.from_user_name}</span>
                            <span>thanked you</span>
                          </>
                        ) : (
                          <>
                            <span>You thanked</span>
                            <span className="font-medium text-[#81B29A]">{gratitude.to_user_name}</span>
                          </>
                        )}
                        <span className="ml-auto">{format(new Date(gratitude.created_date), "MMM d")}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Control what information is visible to other community members
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {privacySettings.show_stats ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      <Label className="font-medium">Show Activity Stats</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Display items given/received counts on your profile
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.show_stats}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, show_stats: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {privacySettings.show_location_zip ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      <Label className="font-medium">Show Location</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Display your zip code on your profile
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.show_location_zip}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, show_location_zip: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {privacySettings.show_gratitude ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      <Label className="font-medium">Show Gratitude Posts</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Display gratitude you've given/received on public wall
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.show_gratitude}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, show_gratitude: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {privacySettings.show_active_offers ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      <Label className="font-medium">Show Active Offers</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Display what resources you're currently offering
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.show_active_offers}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, show_active_offers: checked }))}
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="w-full rounded-xl bg-[#E07A5F] hover:bg-[#D16A4F] py-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Privacy Settings"}
                </Button>

              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="border-0 shadow-lg bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Your Privacy Matters</h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      We never share your exact address, only zip codes for proximity matching. 
                      You control what information is visible to others. For sensitive situations, 
                      consider using private Circles for requests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Email Notifications
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Choose when and how you'd like to be notified
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <Label className="font-medium">Request Received</Label>
                      <p className="text-sm text-gray-600">
                        When someone requests your resource
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_requests}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_requests: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <Label className="font-medium">Request Accepted</Label>
                      <p className="text-sm text-gray-600">
                        When your request is accepted
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_accepted}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_accepted: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <Label className="font-medium">Messages</Label>
                      <p className="text-sm text-gray-600">
                        When you receive a message
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_messages}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_messages: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <Label className="font-medium">Gratitude Received</Label>
                      <p className="text-sm text-gray-600">
                        When someone thanks you
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_gratitude}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_gratitude: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <Label className="font-medium">Event Reminders</Label>
                      <p className="text-sm text-gray-600">
                        Day before events you're attending
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_events}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_events: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <Label className="font-medium">Watched Categories</Label>
                      <p className="text-sm text-gray-600">
                        New resources in categories you watch
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_watches}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_watches: checked }))}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="font-medium mb-3 block">Notification Frequency</Label>
                  <Select
                    value={notificationSettings.frequency}
                    onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">
                        <div>
                          <p className="font-medium">Immediate</p>
                          <p className="text-xs text-gray-600">Get notified right away</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="daily_digest">
                        <div>
                          <p className="font-medium">Daily Digest</p>
                          <p className="text-xs text-gray-600">One email per day with all updates</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="weekly_digest">
                        <div>
                          <p className="font-medium">Weekly Digest</p>
                          <p className="text-xs text-gray-600">One email per week with highlights</p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="w-full rounded-xl bg-[#E07A5F] hover:bg-[#D16A4F] py-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Notification Preferences"}
                </Button>

              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Bell className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Stay Connected</h3>
                    <p className="text-sm text-green-800 leading-relaxed">
                      Email notifications help you stay connected with your community. We'll never spam you 
                      or share your email with anyone. You can unsubscribe at any time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}