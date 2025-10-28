
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  Heart,
  Lightbulb,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { MADDS_MAIN_CATEGORIES } from "../components/shared/MADDSCategories";
import MADDSBrowser from "../components/shared/MADDSBrowser";

export default function LearnMADDS() {
  const [selectedCode, setSelectedCode] = useState(null);

  const handleSelectCode = (codeData) => {
    setSelectedCode(codeData);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] mb-4">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text)' }}>
            The MADDS System
          </h1>
          <p className="text-xl font-semibold text-[#E07A5F]">
            Mutual Aid Dewey Decimal System
          </p>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            A relationship-centered classification for community resources. Unlike commercial systems 
            that prioritize exchange value, MADDS prioritizes relational healing, developmental growth, 
            and cultural dignity.
          </p>
        </div>

        {/* Design Principles */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-indigo-600" />
              Core Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-[#E07A5F] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Relational Healing</p>
                  <p className="text-sm text-gray-600">Items facilitate connection and care</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#F2CC8F] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Developmental Growth</p>
                  <p className="text-sm text-gray-600">Resources support life transitions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-[#81B29A] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Cultural Dignity</p>
                  <p className="text-sm text-gray-600">Categories honor diverse practices</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Community Resilience</p>
                  <p className="text-sm text-gray-600">Classification strengthens mutual support</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>How MADDS Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-mono text-2xl font-bold text-center mb-2" style={{ color: 'var(--color-primary)' }}>
                XXX.YYY
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-1">XXX = Main + Sub Domain</p>
                  <p className="text-gray-600">Primary human need (010-990)</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">YYY = Specific Type</p>
                  <p className="text-gray-600">Detailed resource classification (100-900)</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#E07A5F]/10 to-[#F2CC8F]/10 rounded-xl p-4">
              <p className="font-semibold mb-2">Example: 110.300</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge style={{ backgroundColor: '#16a34a', color: 'white' }}>1</Badge>
                <span className="text-gray-600">NOURISH BODY</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge variant="outline">110</Badge>
                <span className="text-gray-600">Plant Proteins</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge variant="outline">110.300</Badge>
                <span className="text-gray-600">Chickpeas</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge className="bg-green-600 text-white">FEED FAMILY</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Browser */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-6 h-6" />
              Explore the Complete MADDS Classification
            </CardTitle>
            <p className="text-sm text-gray-600">
              Browse all 900+ categories organized by human need. Click to expand and see detailed breakdowns.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <MADDSBrowser
                  onSelectCode={handleSelectCode}
                  selectedCode={selectedCode?.code}
                  showSearch={true}
                />
              </div>
              
              <div className="space-y-4">
                {selectedCode ? (
                  <Card className="border-2 border-blue-500 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Selected Category</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Full Code</p>
                        <p className="font-mono text-xl font-bold text-blue-900">
                          {selectedCode.code}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Main Category</p>
                        <Badge style={{ backgroundColor: selectedCode.mainCategory.color }}>
                          {selectedCode.mainCategory.title}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Subcategory</p>
                        <p className="font-semibold">{selectedCode.subCategory.name}</p>
                      </div>
                      
                      {selectedCode.specific && (
                        <>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Specific Type</p>
                            <p className="font-semibold">{selectedCode.specific.name}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {selectedCode.specific.description}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Two-Word Code</p>
                            <Badge 
                              className="text-sm"
                              style={{ 
                                backgroundColor: selectedCode.mainCategory.color, 
                                color: 'white' 
                              }}
                            >
                              {selectedCode.specific.twoWord}
                            </Badge>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="p-6 text-center">
                      <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-600">
                        Select a category to see details
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-sm mb-2">Did you know?</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      The third digit level (010.100, 010.200, etc.) is organized by 
                      philosophical principles — prioritizing immediate need, cultural 
                      specificity, and developmental appropriateness.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why MADDS Matters */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-teal-50">
          <CardHeader>
            <CardTitle>Why MADDS Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dignity-Centered</p>
                  <p className="text-sm text-gray-700">
                    Categories like "NOURISH BODY" and "REST SECURELY" honor human dignity 
                    instead of labeling people as "needy" or "poor"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Culturally Inclusive</p>
                  <p className="text-sm text-gray-700">
                    Recognizes diverse practices (halal/kosher food, indigenous resources, 
                    traditional healing) rather than assuming one-size-fits-all
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Relationship-First</p>
                  <p className="text-sm text-gray-700">
                    Organized by how resources build connection, not by commercial categories. 
                    "CONNECT COMMUNITY" and "GATHER JOY" are as important as food or shelter
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Emergency-Prioritized</p>
                  <p className="text-sm text-gray-700">
                    000 category ensures crisis resources (FEED BABY, STAY WARM, ESCAPE DANGER) 
                    are always visible and distributed first
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-[#E07A5F] to-[#F2CC8F]">
          <CardContent className="p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">
              Ready to Use MADDS?
            </h3>
            <p className="mb-6 opacity-90">
              Every resource you share is automatically organized by MADDS, 
              making it easy for people to find exactly what they need.
            </p>
            <Button 
              className="bg-white text-[#E07A5F] hover:bg-gray-100"
              size="lg"
            >
              Share Your First Resource
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
