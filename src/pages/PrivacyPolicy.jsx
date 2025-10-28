import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Download, Trash2, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-600 mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text)' }}>
            Privacy Policy
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            We collect minimal information. You control your data. We never sell it.
          </p>
          <p className="text-sm text-gray-500">Last Updated: January 2025 • GDPR Compliant</p>
        </div>

        {/* Plain Language Summary */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Plain Language Summary</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We collect minimal information to make the platform work. You control your data. 
              We never sell it. You can delete everything anytime.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              <strong>That's it.</strong> The rest of this document explains the details.
            </p>
          </CardContent>
        </Card>

        {/* Who We Are */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Who We Are</h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                MADDS Network is a cooperative mutual aid platform. We're owned by our users, not investors.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Contact:</strong></p>
                <p>Website: maddsnetwork.org</p>
                <p>Email: privacy@maddsnetwork.org</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What We Collect */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">What Information We Collect</h2>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3">Information You Give Us:</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900 mb-2">When you create an account:</p>
                  <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                    <li>Email (required for login)</li>
                    <li>Full name (required)</li>
                    <li>ZIP code (required, for proximity matching)</li>
                    <li>Preferred language (optional)</li>
                    <li>Bio (optional)</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 mb-2">When you share resources:</p>
                  <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                    <li>Photos of items</li>
                    <li>Item descriptions</li>
                    <li>Pickup/delivery availability</li>
                    <li>Coordination messages</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-red-50 border-red-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 text-red-900">We do NOT collect:</h3>
              <ul className="space-y-1 text-sm text-red-800">
                <li>❌ Exact location (only ZIP code)</li>
                <li>❌ Browsing history</li>
                <li>❌ Search history outside MADDS Network</li>
                <li>❌ Personal identifiers beyond what you provide</li>
                <li>❌ Social media connections</li>
                <li>❌ Financial information</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How We Use Your Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">How We Use Your Information</h2>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">To Make the Platform Work:</h3>
                  <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                    <li>Show you resources near your ZIP code</li>
                    <li>Match requests with offers</li>
                    <li>Send notifications (if you opt in)</li>
                    <li>Coordinate pickups between users</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">To Keep the Community Safe:</h3>
                  <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                    <li>Investigate reported content</li>
                    <li>Prevent spam and abuse</li>
                    <li>Resolve conflicts</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">We NEVER use your data to:</h3>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    <li>❌ Sell to advertisers</li>
                    <li>❌ Build user profiles for marketing</li>
                    <li>❌ Train AI models without consent</li>
                    <li>❌ Track you across other websites</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Who Can See */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Who Can See Your Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Public Information</h3>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Username</li>
                  <li>• ZIP code (if enabled)</li>
                  <li>• Resources you offer</li>
                  <li>• Gratitude posts (if public)</li>
                  <li>• Activity stats (if enabled)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Private Information</h3>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Email address</li>
                  <li>• Request messages</li>
                  <li>• Private circles</li>
                  <li>• Notification settings</li>
                  <li>• Login history</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-blue-900 font-semibold text-lg mb-2">
                We NEVER sell your data.
              </p>
              <p className="text-blue-800 text-sm">
                This is written into our cooperative bylaws and cannot be changed without community vote.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Your Rights */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Rights (GDPR & Beyond)</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Access Your Data</h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Download everything we have about you
                </p>
                <p className="text-xs text-gray-600">
                  Settings → "Export Data" or email privacy@maddsnetwork.org
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Correct Your Data</h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Update your profile anytime
                </p>
                <p className="text-xs text-gray-600">
                  Edit in your profile settings
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold">Delete Your Data</h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Delete your entire account
                </p>
                <p className="text-xs text-gray-600">
                  Settings → "Delete Account" (data deleted within 30 days)
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold">Object to Processing</h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Opt out of email notifications
                </p>
                <p className="text-xs text-gray-600">
                  Privacy settings in your profile
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">How We Protect Your Data</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Encryption</p>
                  <p className="text-sm text-gray-600">HTTPS for all data in transit, encrypted database backups</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Access Control</p>
                  <p className="text-sm text-gray-600">Role-based permissions, coordinators see only what they need</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Session Security</p>
                  <p className="text-sm text-gray-600">Auto-logout after inactivity, secure password hashing</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Active accounts:</strong> Data kept as long as account is active (you can delete anytime)</p>
              <p><strong>Deleted accounts:</strong> Personal data deleted within 30 days</p>
              <p><strong>Backups:</strong> Kept for 90 days (disaster recovery), then purged</p>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="border-0 shadow-xl bg-yellow-50 border-yellow-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-3">
              MADDS Network is for users 13 and older. We don't knowingly collect data from children under 13.
            </p>
            <p className="text-sm text-gray-600">
              If you're under 18, you can use MADDS Network with parent/guardian permission.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Cookies & Tracking</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-green-700 mb-2">Cookies We Use:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Essential cookies (session management, login state)</li>
                  <li>• Preference cookies (language selection, theme)</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="font-semibold text-red-900 mb-2">We DON'T use:</h3>
                <ul className="space-y-1 text-sm text-red-800">
                  <li>❌ Advertising cookies</li>
                  <li>❌ Tracking cookies</li>
                  <li>❌ Third-party analytics (no Google Analytics)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500 to-purple-600">
          <CardContent className="p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Questions or Concerns?</h2>
            <p className="mb-6 text-lg opacity-90">
              Contact our Privacy Team
            </p>
            <p className="mb-4">
              Email: <a href="mailto:privacy@maddsnetwork.org" className="underline">privacy@maddsnetwork.org</a>
            </p>
            <p className="text-sm opacity-80">Response time: Within 5 business days</p>
          </CardContent>
        </Card>

        {/* Our Commitment */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-gray-700 text-lg mb-6">
              <strong>We promise to:</strong>
            </p>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <p className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Collect only what's needed
              </p>
              <p className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Never sell your data
              </p>
              <p className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Give you full control
              </p>
              <p className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Be transparent about changes
              </p>
              <p className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Respond to requests quickly
              </p>
              <p className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Protect your data seriously
              </p>
            </div>
            <p className="text-lg font-semibold mt-6" style={{ color: 'var(--color-text)' }}>
              Because you deserve dignity, and dignity includes privacy.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 space-y-2 pb-8">
          <p className="text-xs text-gray-500">
            This Privacy Policy is part of our cooperative commitment to our community.
          </p>
          <p className="text-xs text-gray-500">
            Version 1.0 | January 2025
          </p>
        </div>

      </div>
    </div>
  );
}