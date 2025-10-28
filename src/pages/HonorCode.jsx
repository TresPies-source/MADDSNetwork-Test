import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Heart, Shield, Users, Scale, Lock } from "lucide-react";

export default function HonorCode() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text)' }}>
            MADDS Network Honor Code
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            Our community agreement — shaped by our values of trust, dignity, and mutual care
          </p>
          <p className="text-sm text-gray-500">Last Updated: January 2025 • Version 1.0</p>
        </div>

        {/* Welcome */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to Our Community</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MADDS Network is a cooperative mutual aid platform. We're not a marketplace, charity, or business. 
              We're neighbors helping neighbors through trust, dignity, and care.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using this platform, you agree to honor these principles:
            </p>
          </CardContent>
        </Card>

        {/* Core Principles */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Core Principles</h2>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">1. Give When You Can, Receive When You Need</h3>
                  <p className="text-gray-700 mb-3">
                    No one is required to give before they receive. No one owes anything for receiving help. 
                    Mutual aid is about community care, not transactions.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      You can request resources without having offered anything
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      You can offer resources without expecting anything back
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      We trust you know what you need better than any algorithm
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">2. No Questions Asked</h3>
                  <p className="text-gray-700 mb-3">
                    We don't verify need. We don't gatekeep resources. We trust our community.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      No income verification
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      No ID required
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      No invasive questions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">3. Relationships Over Transactions</h3>
                  <p className="text-gray-700 mb-3">
                    Every exchange is a chance to build connection. Be kind, be patient, be human.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      Communicate clearly and respectfully
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      Be patient if someone's late or needs to reschedule
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      Treat each other with dignity
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">4. Community Accountability (Not Punishment)</h3>
                  <p className="text-gray-700 mb-3">
                    When harm happens, we focus on repair, not revenge. We use restorative justice, not bans.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">5. Your Data is Yours</h3>
                  <p className="text-gray-700 mb-3">
                    We collect minimal data and you control it all. We never sell your data (written into our bylaws).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What We Expect */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">What We Expect From You</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  DO:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Be honest in your resource descriptions</li>
                  <li>• Show up for pickups you've committed to</li>
                  <li>• Report safety concerns to coordinators</li>
                  <li>• Respect others' time and boundaries</li>
                  <li>• Participate in governance (vote on decisions)</li>
                  <li>• Share feedback to improve the platform</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  DON'T:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Post items you don't actually have</li>
                  <li>• "No-show" repeatedly without communication</li>
                  <li>• Harass, discriminate, or threaten others</li>
                  <li>• Sell items (this isn't a marketplace)</li>
                  <li>• Post dangerous, illegal, or expired items</li>
                  <li>• Use the platform to scam or exploit others</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conflict Resolution */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">When Things Go Wrong</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">If you experience harm:</h3>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Talk directly (if you feel safe doing so)</li>
                  <li>Contact a Care Coordinator (mediation available)</li>
                  <li>Flag content (use the flag button on any post)</li>
                  <li>Email coordinators (urgent safety issues)</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold mb-2">We remove users only when:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Physical safety is threatened</li>
                  <li>• Repeated pattern of harm after mediation attempts</li>
                  <li>• Scamming/fraudulent behavior</li>
                  <li>• Platform misuse (spam, hate speech, illegal activity)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cooperative Ownership */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Cooperative Ownership</h2>
            <p className="text-gray-700 mb-4">
              MADDS Network is owned by its users. That means:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Vote on major platform changes</p>
                  <p className="text-sm text-gray-600">1 User = 1 Vote (no special privileges)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Run for coordinator</p>
                  <p className="text-sm text-gray-600">Elections every 6 months</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Propose changes</p>
                  <p className="text-sm text-gray-600">Anyone can suggest features</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Fork the code</p>
                  <p className="text-sm text-gray-600">Open source — take it and adapt it</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Content */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Platform Rules</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-700 mb-3">Prohibited Content:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>❌ Weapons, ammunition, explosives</li>
                  <li>❌ Illegal drugs or drug paraphernalia</li>
                  <li>❌ Stolen items</li>
                  <li>❌ Expired food or medicine (unless clearly marked)</li>
                  <li>❌ Recalled products</li>
                  <li>❌ Live animals (except coordinated adoptions)</li>
                  <li>❌ Hate speech, harassment, or discriminatory content</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-yellow-700 mb-3">Allowed But Needs Care:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>⚠️ Used car seats (must not be expired or in accidents)</li>
                  <li>⚠️ Medications (with valid prescription, coordinate privately)</li>
                  <li>⚠️ Alcohol (legal age verification required)</li>
                  <li>⚠️ Large furniture (ensure safe delivery/pickup plans)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-[#E07A5F] to-[#F2CC8F]">
          <CardContent className="p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">You Belong Here</h2>
            <p className="mb-6 text-lg opacity-90">
              MADDS Network exists because we believe:
            </p>
            <div className="space-y-2 mb-6">
              <p>• Everyone deserves dignity</p>
              <p>• Community care is possible</p>
              <p>• Trust is the foundation</p>
              <p>• We're all in this together</p>
            </div>
            <p className="text-2xl font-bold">Welcome home. 🤝</p>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-600 space-y-2 pb-8">
          <p>Questions about this Honor Code?</p>
          <p>
            Email: <a href="mailto:community@maddsnetwork.org" className="text-blue-600 hover:underline">community@maddsnetwork.org</a>
          </p>
          <p className="text-xs text-gray-500">
            This Honor Code is a living document, shaped by our community.
          </p>
        </div>

      </div>
    </div>
  );
}