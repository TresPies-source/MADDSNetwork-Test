import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search,
  Heart,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HowItWorks() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text)' }}>
            How MADDS Network Works
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            A simple, trust-based system for sharing resources and building community
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          
          {/* Step 1 */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] flex items-center justify-center flex-shrink-0">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                      1. Browse Resources
                    </h2>
                    <Badge className="bg-[#E07A5F] text-white">Start Here</Badge>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Search by need, not by product name. Instead of searching for "size 5 shoes," 
                    search "children's clothing" or browse the MADDS category "NOURISH BODY" → "Children's Needs."
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-2">Why it matters:</p>
                    <p className="text-sm text-gray-600">
                      The MADDS system organizes resources by human need and relationships, 
                      not commercial value. This honors dignity and makes finding help easier.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#81B29A] to-[#16a34a] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                    2. Request What You Need
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Click "I Need This" on any resource. Share your story if you'd like 
                    (optional but helpful for building trust). No verification required. 
                    No questions asked. We trust our community.
                  </p>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-2">What happens next:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• The giver receives your request</li>
                      <li>• They can accept or decline (no hard feelings)</li>
                      <li>• You'll get notified either way</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F2CC8F] to-[#f59e0b] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                    3. Coordinate Pickup
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Connect directly with the giver through the platform. Arrange a time 
                    and place that works for both of you. Some givers offer delivery, 
                    others prefer porch pickup. It's all flexible.
                  </p>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-2">Safety tips:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Meet in public places when possible</li>
                      <li>• Porch pickup is great for contactless exchange</li>
                      <li>• Communicate clearly about timing</li>
                      <li>• Life happens - be patient and flexible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-8 h-8 text-white" fill="white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                    4. Say Thank You
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    After you receive your item, share your gratitude with the community. 
                    Tell your story. Let people know how this helped. Your words inspire 
                    others to give and remind everyone why this work matters.
                  </p>
                  <div className="bg-pink-50 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-2">Gratitude builds community:</p>
                    <p className="text-sm text-gray-700">
                      When you share how a resource helped you, you're not just thanking 
                      one person—you're strengthening the bonds that hold our network together. 
                      Every story of care creates more care.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sharing Resources */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-[#E07A5F] to-[#F2CC8F]">
          <CardContent className="p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="w-10 h-10" />
              <h2 className="text-2xl font-bold">Want to Give?</h2>
            </div>
            <p className="mb-6 opacity-90 leading-relaxed">
              Sharing resources is just as easy! Post what you have to offer, wait for 
              requests, and connect with neighbors who need what you can give. Every item 
              shared strengthens our community.
            </p>
            <Link to={createPageUrl("AddResource")}>
              <Button className="bg-white text-[#E07A5F] hover:bg-gray-100 py-6 px-8 text-lg">
                Share a Resource
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Core Principles */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              Our Core Principles
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Trust First</p>
                  <p className="text-sm text-gray-600">
                    We believe people know what they need. No verification, no proof, no gatekeeping.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Give When You Can</p>
                  <p className="text-sm text-gray-600">
                    You don't have to give to receive. Share when you're able, ask when you need.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Relationships Over Transactions</p>
                  <p className="text-sm text-gray-600">
                    This isn't a marketplace. It's a community. We're building connections, not completing deals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Cultural Dignity</p>
                  <p className="text-sm text-gray-600">
                    MADDS honors diverse practices and identities. Your needs and ways of meeting them are valid.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Ready to Get Started?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={createPageUrl("Home")}>
              <Button className="bg-[#E07A5F] hover:bg-[#D16A4F] py-6 px-8 text-lg">
                Browse Resources
              </Button>
            </Link>
            <Link to={createPageUrl("LearnMADDS")}>
              <Button variant="outline" className="py-6 px-8 text-lg border-2">
                Learn About MADDS
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}