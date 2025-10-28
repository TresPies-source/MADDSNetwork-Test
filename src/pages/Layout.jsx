

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  Heart, 
  Home, 
  Plus, 
  Calendar, 
  User, 
  Users,
  Sparkles,
  Menu,
  LogOut,
  Bell,
  Upload,
  FileText,
  Shield,
  HelpCircle
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Learn MADDS",
    url: createPageUrl("LearnMADDS"),
    icon: Sparkles,
  },
  {
    title: "Request Resource",
    url: createPageUrl("RequestResource"),
    icon: Plus,
  },
  {
    title: "Browse Needs",
    url: createPageUrl("BrowseNeeds"),
    icon: Heart,
  },
  {
    title: "Share Multiple",
    url: createPageUrl("BulkShare"),
    icon: Upload,
  },
  {
    title: "Gratitude Wall",
    url: createPageUrl("GratitudeWall"),
    icon: Heart,
  },
  {
    title: "Events",
    url: createPageUrl("Events"),
    icon: Calendar,
  },
  {
    title: "Circles",
    url: createPageUrl("Circles"),
    icon: Users,
  },
  {
    title: "My Activity",
    url: createPageUrl("MyActivity"),
    icon: User,
  },
];

const helpItems = [
  {
    title: "How It Works",
    url: createPageUrl("HowItWorks"),
    icon: HelpCircle,
  },
  {
    title: "FAQ",
    url: createPageUrl("FAQ"),
    icon: HelpCircle,
  },
  {
    title: "Honor Code",
    url: createPageUrl("HonorCode"),
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    url: createPageUrl("PrivacyPolicy"),
    icon: Shield,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

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

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const requests = await base44.entities.Request.list();
      return requests.filter(r => r.offered_by === user.id && r.status === 'pending');
    },
    enabled: !!user,
  });

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --color-primary: #E07A5F;
          --color-secondary: #81B29A;
          --color-accent: #F2CC8F;
          --color-background: #FAF8F5;
          --color-surface: #FFFFFF;
          --color-text: #3D3D3D;
          --color-text-light: #6B6B6B;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full" style={{ backgroundColor: 'var(--color-background)' }}>
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-6">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl" style={{ color: 'var(--color-text)' }}>MADDS Network</h2>
                <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Mutual Aid Community</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`rounded-xl mb-1 transition-all duration-200 relative ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-[#E07A5F]/10 to-[#F2CC8F]/10 text-[#E07A5F] font-medium' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                          {item.title === "My Activity" && pendingRequests.length > 0 && (
                            <Badge className="ml-auto bg-red-500 text-white text-xs">
                              {pendingRequests.length}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Help Section */}
            <SidebarGroup className="mt-6">
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">Help & Info</p>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {helpItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`rounded-xl mb-1 transition-all duration-200 ${
                          location.pathname === item.url 
                            ? 'bg-gray-200 font-medium' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-2 text-sm">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {user && (
              <SidebarGroup className="mt-6">
                <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-[#81B29A]/10 to-[#81B29A]/5">
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-light)' }}>
                    Your Impact
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        {user.items_given || 0}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Items Given</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                        {user.items_received || 0}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Items Received</p>
                    </div>
                  </div>
                </div>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4">
            {user ? (
              <div className="space-y-3">
                <Link to={createPageUrl("MyProfile")} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>
                      {user.full_name || 'User'}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-text-light)' }}>
                      View profile
                    </p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => base44.auth.redirectToLogin()}
                className="w-full bg-[#E07A5F] hover:bg-[#D16A4F]"
              >
                Sign In
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Menu className="w-6 h-6" />
              </SidebarTrigger>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                MADDS Network
              </h1>
              {pendingRequests.length > 0 && (
                <Link to={createPageUrl("MyActivity")} className="ml-auto">
                  <div className="relative">
                    <Bell className="w-5 h-5" />
                    <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                      {pendingRequests.length}
                    </Badge>
                  </div>
                </Link>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

