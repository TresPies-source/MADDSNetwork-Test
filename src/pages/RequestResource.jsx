
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
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, ArrowLeft, Sparkles, Check, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MADDS_MAIN_CATEGORIES, MADDS_SUBCATEGORIES } from "../components/shared/MADDSCategories";
import MADDSBrowser from "../components/shared/MADDSBrowser";

export default function RequestResource() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    madds_code: "",
    madds_class: "",
    two_word_code: "",
    quantity: 1,
    condition_acceptable: ["new", "like_new", "used"],
    location_zip: "",
    can_pickup: true,
    needs_delivery: false,
    urgency: "flexible",
    coordination_notes: "",
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
    mutationFn: (data) => base44.entities.Need.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      navigate(createPageUrl("BrowseNeeds"));
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

  const classifyFromText = async () => {
    if (!formData.title && !formData.description) {
      return;
    }

    setIsClassifying(true);

    try {
      const prompt = `Analyze this need/request someone posted in a mutual aid network.

What they're looking for:
Title: ${formData.title || "Not provided"}
Description: ${formData.description || "Not provided"}

Based on this information:
1. Suggest the best MADDS classification code
2. Improve title/description if vague
3. Suggest urgency level (emergency, urgent, soon, flexible)

MADDS Categories:
000 - EMERGENCY SURVIVAL (immediate crisis needs)
100 - NOURISH BODY (food, water, nutrition)
200 - SHELTER SAFELY (housing, furniture, bedding)
300 - CONNECT COMMUNITY (phones, transportation, childcare)
400 - HEAL WHOLENESS (medical equipment, medications, wellness)
500 - GROW KNOWLEDGE (education, books, computers)
600 - EARN LIVELIHOOD (work tools, business supplies)
700 - EXPRESS CREATIVITY (arts, music, crafts)
800 - PROTECT EARTH (sustainability, gardening)
900 - TRANSITION LIFE (birth, moving, ceremonies)

Return your analysis in this exact JSON format:
{
  "improved_title": "Better title if original was vague (or keep original)",
  "improved_description": "Enhanced description (or keep original)",
  "suggested_code": "110",
  "urgency": "emergency|urgent|soon|flexible",
  "confidence": "high|medium|low"
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            improved_title: { type: "string" },
            improved_description: { type: "string" },
            suggested_code: { type: "string" },
            urgency: { type: "string" },
            confidence: { type: "string" }
          }
        }
      });

      const fullCode = result.suggested_code.padEnd(3, '0');
      const mainCode = fullCode.charAt(0);
      const subs = MADDS_SUBCATEGORIES[mainCode] || [];
      const subcat = subs.find(s => s.code === fullCode);
      const mainCat = MADDS_MAIN_CATEGORIES.find(m => m.code === mainCode);

      if (subcat && mainCat) {
        setFormData(prev => ({
          ...prev,
          title: result.improved_title || prev.title,
          description: result.improved_description || prev.description,
          urgency: result.urgency || prev.urgency,
          madds_code: fullCode,
          madds_class: mainCat.title,
          two_word_code: subcat.twoWord
        }));
      }
    } catch (error) {
      console.error("AI classification error:", error);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleMADDSSelect = ({ code, mainCategory, subCategory, specific }) => {
    setFormData(prev => ({
      ...prev,
      madds_code: code,
      madds_class: mainCategory.title,
      two_word_code: specific ? specific.twoWord : subCategory.twoWord
    }));
    setShowMADDSBrowser(false);
  };

  const toggleCondition = (condition) => {
    setFormData(prev => ({
      ...prev,
      condition_acceptable: prev.condition_acceptable.includes(condition)
        ? prev.condition_acceptable.filter(c => c !== condition)
        : [...prev.condition_acceptable, condition]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const needData = {
      ...formData,
      requested_by: user.id,
      requested_by_name: user.full_name,
      status: "open"
    };

    createMutation.mutate(needData);
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
              Request a Resource
            </h1>
            <p style={{ color: 'var(--color-text-light)' }}>
              Tell the community what you need — no judgment, no questions asked
            </p>
          </div>
        </div>

        {/* Trust Notice */}
        <Card className="border-0 shadow-lg bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">You don't need to explain or justify.</p>
              <p>We trust you know what you need. Share what's comfortable, but you're not required to tell your whole story.</p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-[#E07A5F]/5 to-[#F2CC8F]/5">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E07A5F]" />
                What Do You Need?
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Reference Photo (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#E07A5F] transition-colors">
                  {formData.photo_url ? (
                    <div className="space-y-4">
                      <img
                        src={formData.photo_url}
                        alt="Reference"
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
                        {uploading ? "Uploading..." : "Upload a reference photo"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Help people identify what you need
                      </p>
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>What are you looking for? *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Winter coat size M, Baby formula, Ride to doctor appointment"
                  className="rounded-xl"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Details (Optional but Helpful)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Share any details that help people know if they can help... Size? Color? Specific brand? Why you need it? When you need it by?"
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
                      Auto-Classify from Description
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

              {/* Quantity & Urgency */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>How many do you need?</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>How soon do you need it?</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">🚨 Emergency (today)</SelectItem>
                      <SelectItem value="urgent">⚡ Urgent (this week)</SelectItem>
                      <SelectItem value="soon">📅 Soon (this month)</SelectItem>
                      <SelectItem value="flexible">🕐 Flexible (whenever available)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Acceptable Conditions */}
              <div className="space-y-3">
                <Label>What condition is acceptable?</Label>
                <div className="flex flex-wrap gap-3">
                  {["new", "like_new", "used", "as_is"].map(condition => (
                    <label
                      key={condition}
                      className="flex items-center gap-2 px-4 py-2 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: formData.condition_acceptable.includes(condition) ? '#E07A5F' : '#e5e7eb',
                        backgroundColor: formData.condition_acceptable.includes(condition) ? '#E07A5F10' : 'transparent'
                      }}
                    >
                      <Checkbox
                        checked={formData.condition_acceptable.includes(condition)}
                        onCheckedChange={() => toggleCondition(condition)}
                      />
                      <span className="capitalize">{condition.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Select all that work for you — more flexibility = more likely someone can help!
                </p>
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
                  Only zip code is shared for privacy
                </p>
              </div>

              {/* Pickup/Delivery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <Label>I can pick up</Label>
                    <p className="text-xs text-gray-500">I can go get it</p>
                  </div>
                  <Switch
                    checked={formData.can_pickup}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, can_pickup: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <Label>I need delivery</Label>
                    <p className="text-xs text-gray-500">No transportation/mobility issues</p>
                  </div>
                  <Switch
                    checked={formData.needs_delivery}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needs_delivery: checked }))}
                  />
                </div>
              </div>

              {/* Coordination Notes */}
              <div className="space-y-2">
                <Label>Coordination Details (Optional)</Label>
                <Textarea
                  value={formData.coordination_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, coordination_notes: e.target.value }))}
                  placeholder="e.g., Available weekdays after 5pm, prefer text messages, can meet at library..."
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
                "Posting..."
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Post My Need
                </>
              )}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
