
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, ArrowLeft, Sparkles, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MADDS_MAIN_CATEGORIES, MADDS_SUBCATEGORIES } from "../components/shared/MADDSCategories";
import MADDSBrowser from "../components/shared/MADDSBrowser";

export default function AddResource() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false); // New state for AI classification
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    madds_code: "",
    madds_class: "",
    two_word_code: "",
    quantity: 1,
    condition: "used",
    location_zip: "",
    pickup_available: true,
    delivery_available: false,
    pickup_instructions: "",
    availability_window: "",
    photo_url: ""
  });

  const [uploading, setUploading] = useState(false);
  const [showMADDSBrowser, setShowMADDSBrowser] = useState(false);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData(prev => ({ ...prev, location_zip: currentUser.zip_code || "" }));
      } catch (error) {
        navigate(createPageUrl("Home"));
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [navigate]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Resource.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      navigate(createPageUrl("Home"));
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, photo_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleMADDSSelect = ({ code, mainCategory, subCategory, specific }) => {
    setFormData(prev => ({
      ...prev,
      madds_code: code,
      madds_class: mainCategory.title,
      two_word_code: specific ? specific.name : subCategory.name
    }));
    setShowMADDSBrowser(false);
  };

  // AI-assisted classification from text
  const classifyFromText = async () => {
    if (!formData.title && !formData.description) {
      return;
    }

    setIsClassifying(true);

    try {
      const prompt = `Analyze this resource someone wants to share in a mutual aid network.

Item Information:
Title: ${formData.title || "Not provided"}
Description: ${formData.description || "Not provided"}

Based on this information:
1. Suggest the best MADDS classification code
2. If title/description is vague, suggest multiple possibilities
3. Infer likely condition if not specified

MADDS Categories:
000 - EMERGENCY SURVIVAL (immediate crisis needs)
  010 = Immediate Food, 020 = Immediate Shelter, 030 = Basic Hygiene, etc.

100 - NOURISH BODY (food, water, nutrition)
  110 = Plant Proteins, 120 = Animal Proteins, 130 = Grains & Carbs, 140 = Fresh Produce, 150 = Cooking Essentials, 160 = Baby/Child Nutrition, 170 = Cultural Foods, 180 = Kitchen Equipment, 190 = Food Preservation

200 - SHELTER SAFELY (housing, furniture, bedding)
  210 = Sleeping, 220 = Climate Control, 230 = Furniture, 240 = Housewares, 250 = Housing Access, 260 = Utilities, 270 = Home Repair, 280 = Moving Support, 290 = Yard/Garden

300 - CONNECT COMMUNITY (relationships, communication)
  310 = Communication, 320 = Transportation, 330 = Childcare, 340 = Elder Support, 350 = Pet Care, 360 = Social Events, 370 = Language Access, 380 = Disability Support, 390 = Legal/Immigration

400 - HEAL WHOLENESS (health, wellness, care)
  410 = Medical Equipment, 420 = Medications, 430 = Mental Health, 440 = Vision/Hearing, 450 = Dental Care, 460 = Fitness/Movement, 470 = Alternative Healing, 480 = Addiction Recovery, 490 = Sexual/Reproductive

500 - GROW KNOWLEDGE (learning, skills, education)
  510 = Early Childhood, 520 = School Age, 530 = Higher Education, 540 = Technology Access, 550 = Vocational Skills, 560 = Literacy, 570 = Arts Education, 580 = Life Skills, 590 = Libraries/Resources

600 - EARN LIVELIHOOD (work, income, economic stability)
  610 = Job Search, 620 = Work Equipment, 630 = Business Start, 640 = Financial Services, 650 = Professional Development, 660 = Agriculture/Garden, 670 = Repair/Fix-It, 680 = Crafts/Artisan, 690 = Income Support

700 - EXPRESS CREATIVITY (arts, culture, joy)
  710 = Visual Arts, 720 = Music, 730 = Performance Arts, 740 = Writing/Poetry, 750 = Crafts/Hobbies, 760 = Cultural Celebration, 770 = Games/Recreation, 780 = Photography/Media, 790 = Entertainment Access

800 - PROTECT EARTH (environment, sustainability)
  810 = Waste Reduction, 820 = Reuse/Repair, 830 = Energy Conservation, 840 = Water Conservation, 850 = Gardening/Nature, 860 = Clean Transport, 870 = Renewable Energy, 880 = Wildlife Support, 890 = Environmental Education

900 - TRANSITION LIFE (milestones, ceremonies, life changes)
  910 = Birth/Newborn, 920 = Coming of Age, 930 = Partnership/Marriage, 940 = Separation/Divorce, 950 = Illness/Injury, 960 = Aging/Retirement, 970 = Death/Grief, 980 = Immigration/Moving, 990 = Spiritual Passages

Return your analysis in this exact JSON format:
{
  "improved_title": "Better title if original was vague (or keep original)",
  "improved_description": "Enhanced description with helpful details (or keep original)",
  "condition": "new|like_new|used|as_is",
  "suggested_code": "110",
  "confidence": "high|medium|low"
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            improved_title: { type: "string" },
            improved_description: { type: "string" },
            condition: { type: "string", enum: ["new", "like_new", "used", "as_is"] },
            suggested_code: { type: "string" },
            confidence: { type: "string", enum: ["high", "medium", "low"] }
          },
          required: ["suggested_code"]
        }
      });

      // Map code to full category info
      const fullCode = result.suggested_code.padEnd(3, '0');
      const mainCode = fullCode.charAt(0) + '00'; // Main category code is like '100', '200'
      const mainCategoryRawCode = fullCode.charAt(0); // For looking up subcategories

      const subs = MADDS_SUBCATEGORIES[mainCategoryRawCode] || [];
      const subcat = subs.find(s => s.code === fullCode);
      const mainCat = MADDS_MAIN_CATEGORIES.find(m => m.code === mainCode);

      if (subcat && mainCat) {
        setFormData(prev => ({
          ...prev,
          title: result.improved_title || prev.title,
          description: result.improved_description || prev.description,
          condition: result.condition || prev.condition,
          madds_code: fullCode,
          madds_class: mainCat.title,
          two_word_code: subcat.name // Using sub.name as per existing handleSubcategoryChange
        }));
      }
    } catch (error) {
      console.error("AI classification error:", error);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const resourceData = {
      ...formData,
      offered_by: user.id,
      status: "available"
    };

    createMutation.mutate(resourceData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: 'var(--color-text-light)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Home"))}
            className="rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
              Share a Resource
            </h1>
            <p style={{ color: 'var(--color-text-light)' }}>
              Help your community by offering something you have
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-[#E07A5F]/5 to-[#F2CC8F]/5">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E07A5F]" />
                Resource Details
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Photo (Optional but Recommended)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#E07A5F] transition-colors">
                  {formData.photo_url ? (
                    <div className="space-y-4">
                      <img
                        src={formData.photo_url}
                        alt="Resource"
                        className="max-h-64 mx-auto rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData(prev => ({ ...prev, photo_url: "" }))}
                      >
                        Remove Photo
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="font-medium mb-1">
                        {uploading ? "Uploading..." : "Click to upload an image"}
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Winter coat size M, Canned beans (12 pack)"
                  className="rounded-xl"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell people about this resource - condition, how it helped you, any details..."
                  className="rounded-xl min-h-[120px]"
                />
              </div>

              {/* AI Classification Button */}
              {(formData.title || formData.description) && !formData.madds_code && (
                <Button
                  type="button"
                  onClick={classifyFromText}
                  disabled={isClassifying}
                  className="w-full rounded-xl border-2 border-[#E07A5F] bg-white text-[#E07A5F] hover:bg-[#E07A5F]/10"
                >
                  {isClassifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E07A5F] mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Auto-Classify from Title & Description
                    </>
                  )}
                </Button>
              )}

              {/* MADDS Category Selection */}
              <div className="space-y-4">
                <Label>Category (MADDS Code) *</Label>
                
                {formData.madds_code ? (
                  <div className="relative">
                    <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-mono text-blue-900">{formData.madds_code}</p>
                          <p className="text-xs text-blue-700 mt-1">
                            {formData.madds_class} | {formData.two_word_code}
                          </p>
                        </div>
                        <Button 
                          type="button" 
                          onClick={() => setShowMADDSBrowser(true)} 
                          variant="ghost" 
                          size="sm"
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setShowMADDSBrowser(true)}
                    variant="outline"
                    className="w-full rounded-xl justify-start"
                  >
                    Select a category...
                  </Button>
                )}

                {showMADDSBrowser && (
                  <Card className="border-2 border-blue-500 shadow-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">Browse MADDS Categories</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowMADDSBrowser(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <MADDSBrowser
                        onSelectCode={handleMADDSSelect}
                        selectedCode={formData.madds_code}
                        showSearch={true}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Quantity & Condition */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="as_is">As-Is</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Your Zip Code *</Label>
                <Input
                  value={formData.location_zip}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_zip: e.target.value }))}
                  placeholder="12345"
                  className="rounded-xl"
                  required
                />
                <p className="text-xs text-gray-500">
                  Only zip code is shared for privacy - no exact address
                </p>
              </div>

              {/* Pickup/Delivery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <Label>Pickup Available</Label>
                    <p className="text-xs text-gray-500">Recipient can pick up</p>
                  </div>
                  <Switch
                    checked={formData.pickup_available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pickup_available: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <Label>Delivery Available</Label>
                    <p className="text-xs text-gray-500">You can deliver</p>
                  </div>
                  <Switch
                    checked={formData.delivery_available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, delivery_available: checked }))}
                  />
                </div>
              </div>

              {/* Pickup Instructions */}
              <div className="space-y-2">
                <Label>Pickup/Coordination Details</Label>
                <Textarea
                  value={formData.pickup_instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, pickup_instructions: e.target.value }))}
                  placeholder="e.g., Available weekdays after 5pm, leave on front porch, contact via email..."
                  className="rounded-xl"
                />
              </div>

              {/* Availability Window */}
              <div className="space-y-2">
                <Label>When Available</Label>
                <Input
                  value={formData.availability_window}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability_window: e.target.value }))}
                  placeholder="e.g., Monday-Friday 6-8pm, Weekends anytime"
                  className="rounded-xl"
                />
              </div>

            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Home"))}
              className="flex-1 py-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title || !formData.madds_code || !formData.location_zip || createMutation.isPending}
              className="flex-1 py-6 rounded-xl bg-[#E07A5F] hover:bg-[#D16A4F] text-white font-semibold"
            >
              {createMutation.isPending ? (
                "Sharing..."
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Share Resource
                </>
              )}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
