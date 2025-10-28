
import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Upload,
  X,
  Plus,
  Save,
  Sparkles,
  MapPin,
  Calendar,
  Truck,
  Home,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MADDS_MAIN_CATEGORIES, MADDS_SUBCATEGORIES, searchCategories } from "../components/shared/MADDSCategories";

export default function BulkShare() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setSharedDetails(prev => ({ ...prev, location_zip: currentUser.zip_code || "" }));
      } catch (error) {
        navigate(createPageUrl("Home"));
      }
    };
    loadUser();
  }, [navigate]);

  // Shared details for all items
  const [sharedDetails, setSharedDetails] = useState({
    location_zip: "",
    pickup_available: true,
    delivery_available: false,
    pickup_instructions: "",
    availability_window: ""
  });

  // Individual items in the batch
  const [items, setItems] = useState([]);

  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successCount, setSuccessCount] = useState(0);

  // Add new item to list
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        photo_file: null,
        photo_url: "",
        photo_preview: null,
        title: "",
        description: "",
        madds_code: "",
        madds_class: "",
        two_word_code: "",
        quantity: 1,
        condition: "used",
        suggested_codes: [],
        isProcessingAI: false
      }
    ]);
  };

  // Handle photo upload
  const handlePhotoUpload = async (itemId, file) => {
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [itemId]: "Only JPEG, PNG, and WebP images are allowed"
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [itemId]: "Image must be smaller than 5MB"
      }));
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);

    // Upload to Base44
    try {
      setItems(items.map(item =>
        item.id === itemId ? { ...item, isProcessingAI: true } : item
      ));

      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Update item with URL
      setItems(items.map(item =>
        item.id === itemId
          ? { ...item, photo_file: file, photo_url: file_url, photo_preview: preview, isProcessingAI: false }
          : item
      ));

      // Clear error
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[itemId];
        return newErrors;
      });

      // Auto-process with AI
      await processWithAI(itemId, file_url);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [itemId]: "Failed to upload image"
      }));
      setItems(items.map(item =>
        item.id === itemId ? { ...item, isProcessingAI: false } : item
      ));
    }
  };

  // AI-assisted classification using Base44's LLM integration - with text
  const processWithAIText = async (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item || (!item.title && !item.description)) {
      return;
    }

    setItems(items.map(i =>
      i.id === itemId ? { ...i, isProcessingAI: true } : i
    ));

    try {
      const prompt = `Analyze this resource someone wants to share in a mutual aid network.

Item Information:
Title: ${item.title || "Not provided"}
Description: ${item.description || "Not provided"}

Based on this information:
1. Suggest the best MADDS classification code
2. If title/description is vague, suggest multiple possibilities
3. Infer likely condition if not specified

MADDS Categories:
000 - EMERGENCY SURVIVAL (immediate crisis needs)
  010 = Immediate Food | FEED QUICKLY
  020 = Immediate Shelter | STAY WARM
  030 = Basic Hygiene | FEEL HUMAN
  040 = Safety Items | ESCAPE DANGER
  050 = Crisis Communication | GET HELP
  060 = Infant/Child Urgent | FEED BABY
  070 = Medical Emergency | TREAT NOW
  080 = Weather Crisis | SURVIVE ELEMENTS
  090 = Urgent Transport | MOVE SAFELY

100 - NOURISH BODY (food, water, nutrition)
  110 = Plant Proteins | NOURISH PLANT
  120 = Animal Proteins | BUILD MUSCLE
  130 = Grains & Carbs | PROVIDE ENERGY
  140 = Fresh Produce | FEED VITAMINS
  150 = Cooking Essentials | FLAVOR FOOD
  160 = Baby/Child Nutrition | FEED CHILDREN
  170 = Cultural Foods | HONOR PRACTICE
  180 = Kitchen Equipment | COOK MEALS
  190 = Food Preservation | STORE SAFELY

200 - SHELTER SAFELY (housing, furniture, bedding)
  210 = Sleeping | REST BODY
  220 = Climate Control | STAY COMFORTABLE
  230 = Furniture | FURNISH HOME
  240 = Housewares | MAINTAIN SPACE
  250 = Housing Access | SECURE HOUSING
  260 = Utilities | KEEP SERVICES
  270 = Home Repair | FIX DWELLING
  280 = Moving Support | RELOCATE SAFELY
  290 = Yard/Garden | TEND OUTSIDE

300 - CONNECT COMMUNITY (relationships, communication)
  310 = Communication | STAY CONNECTED
  320 = Transportation | MOVE AROUND
  330 = Childcare | CARE CHILDREN
  340 = Elder Support | HONOR ELDERS
  350 = Pet Care | TEND ANIMALS
  360 = Social Events | GATHER JOY
  370 = Language Access | SPEAK TOGETHER
  380 = Disability Support | MOVE FREELY
  390 = Legal/Immigration | NAVIGATE SYSTEMS

400 - HEAL WHOLENESS (health, wellness, care)
  410 = Medical Equipment | SUPPORT BODY
  420 = Medications | TREAT ILLNESS
  430 = Mental Health | HEAL MIND
  440 = Vision/Hearing | SENSE CLEARLY
  450 = Dental Care | MAINTAIN TEETH
  460 = Fitness/Movement | MOVE BODY
  470 = Alternative Healing | RESTORE BALANCE
  480 = Addiction Recovery | RECLAIM LIFE
  490 = Sexual/Reproductive | HONOR BODY

500 - GROW KNOWLEDGE (learning, skills, education)
  510 = Early Childhood | GROW MINDS
  520 = School Age | LEARN BASICS
  530 = Higher Education | PURSUE DEGREE
  540 = Technology Access | CONNECT DIGITAL
  550 = Vocational Skills | MASTER TRADES
  560 = Literacy | READ WORDS
  570 = Arts Education | CREATE BEAUTY
  580 = Life Skills | NAVIGATE LIFE
  590 = Libraries/Resources | ACCESS KNOWLEDGE

600 - EARN LIVELIHOOD (work, income, economic stability)
  610 = Job Search | FIND WORK
  620 = Work Equipment | DO JOB
  630 = Business Start | START VENTURE
  640 = Financial Services | MANAGE MONEY
  650 = Professional Development | ADVANCE CAREER
  660 = Agriculture/Garden | GROW FOOD
  670 = Repair/Fix-It | FIX THINGS
  680 = Crafts/Artisan | MAKE GOODS
  690 = Income Support | MEET NEEDS

700 - EXPRESS CREATIVITY (arts, culture, joy)
  710 = Visual Arts | CREATE IMAGE
  720 = Music | MAKE SOUND
  730 = Performance Arts | EXPRESS MOVEMENT
  740 = Writing/Poetry | TELL STORIES
  750 = Crafts/Hobbies | CREATE JOY
  760 = Cultural Celebration | HONOR HERITAGE
  770 = Games/Recreation | PLAY TOGETHER
  780 = Photography/Media | CAPTURE MOMENTS
  790 = Entertainment Access | EXPERIENCE CULTURE

800 - PROTECT EARTH (environment, sustainability)
  810 = Waste Reduction | REDUCE WASTE
  820 = Reuse/Repair | EXTEND LIFE
  830 = Energy Conservation | SAVE ENERGY
  840 = Water Conservation | PRESERVE WATER
  850 = Gardening/Nature | GROW GREEN
  860 = Clean Transport | MOVE CLEANLY
  870 = Renewable Energy | POWER SUSTAINABLY
  880 = Wildlife Support | PROTECT CREATURES
  890 = Environmental Education | LEARN EARTH

900 - TRANSITION LIFE (milestones, ceremonies, life changes)
  910 = Birth/Newborn | WELCOME LIFE
  920 = Coming of Age | MARK GROWTH
  930 = Partnership/Marriage | JOIN LIVES
  940 = Separation/Divorce | TRANSITION APART
  950 = Illness/Injury | HEAL TOGETHER
  960 = Aging/Retirement | HONOR WISDOM
  970 = Death/Grief | MOURN TOGETHER
  980 = Immigration/Moving | BEGIN AGAIN
  990 = Spiritual Passages | BLESS JOURNEY

Return your analysis in this exact JSON format:
{
  "improved_title": "Better title if original was vague (or keep original)",
  "improved_description": "Enhanced description with helpful details (or keep original)",
  "condition": "new|like_new|used|as_is",
  "suggested_codes": [
    {"code": "110", "reason": "why this fits best"},
    {"code": "210", "reason": "alternate possibility"},
    {"code": "310", "reason": "another option"}
  ]
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            improved_title: { type: "string" },
            improved_description: { type: "string" },
            condition: { type: "string" },
            suggested_codes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Map codes to full category info
      const enrichedCodes = result.suggested_codes.map(sc => {
        const fullCode = sc.code.padEnd(3, '0');
        const mainCode = fullCode.charAt(0);
        const subs = MADDS_SUBCATEGORIES[mainCode] || [];
        const subcat = subs.find(s => s.code === fullCode);
        
        if (subcat) {
          return {
            code: fullCode,
            name: subcat.name,
            twoWord: subcat.twoWord,
            mainCategory: MADDS_MAIN_CATEGORIES.find(m => m.code === mainCode),
            reason: sc.reason
          };
        }
        return null;
      }).filter(Boolean);

      // Update item with AI suggestions
      setItems(items.map(i =>
        i.id === itemId
          ? {
              ...i,
              title: result.improved_title || i.title,
              description: result.improved_description || i.description,
              condition: result.condition || i.condition,
              suggested_codes: enrichedCodes,
              madds_code: enrichedCodes[0]?.code || i.madds_code,
              madds_class: enrichedCodes[0]?.mainCategory?.title || i.madds_class,
              two_word_code: enrichedCodes[0]?.twoWord || i.two_word_code,
              isProcessingAI: false
            }
          : i
      ));
    } catch (error) {
      console.error("AI classification error:", error);
      setItems(items.map(i =>
        i.id === itemId ? { ...i, isProcessingAI: false } : i
      ));
    }
  };

  // AI-assisted classification using Base44's LLM integration - with image
  const processWithAI = async (itemId, imageUrl) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, isProcessingAI: true } : item
    ));

    try {
      const prompt = `Analyze this image of a resource someone wants to share in a mutual aid network.

Identify:
1. What is this item? (be specific)
2. What condition does it appear to be in? (new, like_new, used, as_is)
3. Suggest 3 MADDS classification codes from this list that best match:

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

Each main category has subcategories like:
- 110 = Plant Proteins (beans, lentils)
- 120 = Animal Proteins (meat, dairy)
- 210 = Sleeping (beds, bedding)
- 220 = Climate Control (fans, heaters)
- 310 = Communication (phones, internet)
- etc.

Return your analysis in this exact JSON format:
{
  "title": "Brief descriptive title (5-7 words)",
  "description": "2-3 sentence description including condition details",
  "condition": "new|like_new|used|as_is",
  "suggested_codes": [
    {"code": "110", "reason": "why this fits"},
    {"code": "210", "reason": "why this fits"},
    {"code": "310", "reason": "why this fits"}
  ]
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: imageUrl,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            condition: { type: "string" },
            suggested_codes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Map codes to full category info
      const enrichedCodes = result.suggested_codes.map(sc => {
        const fullCode = sc.code.padEnd(3, '0');
        const mainCode = fullCode.charAt(0);
        const subs = MADDS_SUBCATEGORIES[mainCode] || [];
        const subcat = subs.find(s => s.code === fullCode);
        
        if (subcat) {
          return {
            code: fullCode,
            name: subcat.name,
            twoWord: subcat.twoWord,
            mainCategory: MADDS_MAIN_CATEGORIES.find(m => m.code === mainCode),
            reason: sc.reason
          };
        }
        return null;
      }).filter(Boolean);

      // Update item with AI suggestions
      setItems(items.map(item =>
        item.id === itemId
          ? {
              ...item,
              title: result.title || item.title,
              description: result.description || item.description,
              condition: result.condition || item.condition,
              suggested_codes: enrichedCodes,
              madds_code: enrichedCodes[0]?.code || item.madds_code,
              madds_class: enrichedCodes[0]?.mainCategory?.title || item.madds_class,
              two_word_code: enrichedCodes[0]?.twoWord || item.two_word_code,
              isProcessingAI: false
            }
          : item
      ));
    } catch (error) {
      console.error("AI classification error:", error);
      setItems(items.map(item =>
        item.id === itemId ? { ...item, isProcessingAI: false } : item
      ));
    }
  };

  // Update item field
  const updateItem = (itemId, field, value) => {
    setItems(items.map(item => (item.id === itemId ? { ...item, [field]: value } : item)));
  };

  // Select MADDS code
  const selectMADDSCode = (itemId, code) => {
    const mainCode = code.charAt(0);
    const subs = MADDS_SUBCATEGORIES[mainCode] || [];
    const subcat = subs.find(s => s.code === code);
    const mainCat = MADDS_MAIN_CATEGORIES.find(m => m.code === mainCode);

    if (subcat && mainCat) {
      setItems(items.map(item =>
        item.id === itemId
          ? {
              ...item,
              madds_code: code,
              madds_class: mainCat.title,
              two_word_code: subcat.twoWord
            }
          : item
      ));
    }
  };

  // Remove item
  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Validate before submission - photo now optional
  const validate = () => {
    const newErrors = {};

    if (!sharedDetails.location_zip || !/^\d{5}$/.test(sharedDetails.location_zip)) {
      newErrors.shared_zip = "Valid 5-digit ZIP code required";
    }

    if (!sharedDetails.pickup_instructions.trim()) {
      newErrors.shared_instructions = "Pickup instructions required";
    }

    if (!sharedDetails.availability_window.trim()) {
      newErrors.shared_availability = "Availability window required";
    }

    items.forEach(item => {
      // Photo is now optional
      if (!item.title.trim()) {
        newErrors[`${item.id}_title`] = "Title required";
      }
      if (!item.madds_code) {
        newErrors[`${item.id}_code`] = "MADDS code required";
      }
      if (item.quantity < 1) {
        newErrors[`${item.id}_quantity`] = "Quantity must be at least 1";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit all resources
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSaving(true);
    let savedCount = 0;

    try {
      for (const item of items) {
        const resourceData = {
          title: item.title,
          description: item.description,
          madds_code: item.madds_code,
          madds_class: item.madds_class,
          two_word_code: item.two_word_code,
          quantity: item.quantity,
          condition: item.condition,
          photo_url: item.photo_url,
          location_zip: sharedDetails.location_zip,
          pickup_available: sharedDetails.pickup_available,
          delivery_available: sharedDetails.delivery_available,
          pickup_instructions: sharedDetails.pickup_instructions,
          availability_window: sharedDetails.availability_window,
          offered_by: user.id,
          status: "available"
        };

        await base44.entities.Resource.create(resourceData);
        savedCount++;
        setSuccessCount(savedCount);
      }

      queryClient.invalidateQueries({ queryKey: ["resources"] });

      setTimeout(() => {
        navigate(createPageUrl("MyActivity"));
      }, 2000);
    } catch (error) {
      console.error("Error saving resources:", error);
      setErrors(prev => ({
        ...prev,
        submit: "Failed to save some resources. Please try again."
      }));
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-background)" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: "var(--color-text-light)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(createPageUrl("Home"))} className="rounded-full w-10 h-10 p-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>
              Share Multiple Resources
            </h1>
            <p style={{ color: "var(--color-text-light)" }}>
              Add items with photos or just text — AI helps classify them with MADDS codes
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {successCount > 0 && (
          <Card className="border-0 shadow-lg bg-green-50 border-green-200">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">
                  {successCount} of {items.length} resources saved successfully!
                </p>
                <p className="text-green-700 text-sm">Redirecting to your activity page...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Banner */}
        {errors.submit && (
          <Card className="border-0 shadow-lg bg-red-50 border-red-200">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{errors.submit}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          {/* Shared Details Section */}
          <Card className="border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle>Pickup & Coordination Details</CardTitle>
              <p className="text-sm text-gray-600">These details will apply to all items in this batch</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>
                    <MapPin className="w-4 h-4 inline mr-1" />
                    ZIP Code *
                  </Label>
                  <Input
                    value={sharedDetails.location_zip}
                    onChange={e =>
                      setSharedDetails({
                        ...sharedDetails,
                        location_zip: e.target.value
                      })
                    }
                    placeholder="90210"
                    maxLength={5}
                    className={`rounded-xl ${errors.shared_zip ? "border-red-500" : ""}`}
                  />
                  {errors.shared_zip && <p className="text-red-600 text-sm">{errors.shared_zip}</p>}
                </div>

                <div className="space-y-2">
                  <Label>
                    <Calendar className="w-4 h-4 inline mr-1" />
                    When Available *
                  </Label>
                  <Input
                    value={sharedDetails.availability_window}
                    onChange={e =>
                      setSharedDetails({
                        ...sharedDetails,
                        availability_window: e.target.value
                      })
                    }
                    placeholder="Weekdays after 5pm, weekends anytime"
                    className={`rounded-xl ${errors.shared_availability ? "border-red-500" : ""}`}
                  />
                  {errors.shared_availability && <p className="text-red-600 text-sm">{errors.shared_availability}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-gray-600" />
                    <div>
                      <Label>Pickup Available</Label>
                      <p className="text-sm text-gray-600">Recipients can pick up from your location</p>
                    </div>
                  </div>
                  <Switch
                    checked={sharedDetails.pickup_available}
                    onCheckedChange={checked =>
                      setSharedDetails({
                        ...sharedDetails,
                        pickup_available: checked
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <div>
                      <Label>Delivery Available</Label>
                      <p className="text-sm text-gray-600">You can deliver (within reasonable distance)</p>
                    </div>
                  </div>
                  <Switch
                    checked={sharedDetails.delivery_available}
                    onCheckedChange={checked =>
                      setSharedDetails({
                        ...sharedDetails,
                        delivery_available: checked
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pickup/Coordination Instructions *</Label>
                <Textarea
                  value={sharedDetails.pickup_instructions}
                  onChange={e =>
                    setSharedDetails({
                      ...sharedDetails,
                      pickup_instructions: e.target.value
                    })
                  }
                  placeholder="e.g., Ring doorbell, items on front porch. Please text 30 min before pickup."
                  className={`rounded-xl ${errors.shared_instructions ? "border-red-500" : ""}`}
                />
                {errors.shared_instructions && <p className="text-red-600 text-sm">{errors.shared_instructions}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Items List */}
          <div className="space-y-6 mb-6">
            {items.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
                onUpdate={updateItem}
                onRemove={removeItem}
                onPhotoUpload={handlePhotoUpload}
                onSelectCode={selectMADDSCode}
                onProcessImageAI={processWithAI} // Pass image AI function
                onProcessTextAI={processWithAIText} // Pass text AI function
                errors={errors}
              />
            ))}
          </div>

          {/* Add Item Button */}
          <Button
            type="button"
            onClick={addItem}
            variant="outline"
            className="w-full py-8 border-2 border-dashed rounded-2xl hover:border-[#E07A5F] hover:bg-[#E07A5F]/5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Item
          </Button>

          {/* Submit Button */}
          {items.length > 0 && (
            <div className="mt-8 flex gap-4">
              <Button
                type="button"
                onClick={() => navigate(createPageUrl("Home"))}
                variant="outline"
                className="flex-1 py-6 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-6 rounded-xl bg-[#E07A5F] hover:bg-[#D16A4F]"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Saving {successCount}/{items.length}...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Share {items.length} {items.length === 1 ? "Resource" : "Resources"}
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Individual Item Card Component
function ItemCard({ item, index, onUpdate, onRemove, onPhotoUpload, onSelectCode, onProcessImageAI, onProcessTextAI, errors }) {
  const fileInputRef = useRef(null);
  const [showCodePicker, setShowCodePicker] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");

  const searchResults = codeSearch ? searchCategories(codeSearch) : [];
  const filteredCodes = searchResults.filter(r => r.type === "sub").slice(0, 10);

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Item #{index + 1}</CardTitle>
          <Button type="button" onClick={() => onRemove(item.id)} variant="ghost" size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photo (Optional but Recommended)</Label>
            {!item.photo_preview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 hover:border-[#E07A5F] hover:bg-[#E07A5F]/5 transition-colors border-gray-300"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">Upload Photo</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (max 5MB)</p>
                </div>
              </button>
            ) : (
              <div className="relative aspect-square">
                <img src={item.photo_preview} alt={item.title || "Resource"} className="w-full h-full object-cover rounded-xl" />
                <Button
                  type="button"
                  onClick={() => {
                    onUpdate(item.id, "photo_file", null);
                    onUpdate(item.id, "photo_url", "");
                    onUpdate(item.id, "photo_preview", null);
                  }}
                  className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-red-600 hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>

                {item.isProcessingAI && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Sparkles className="w-8 h-8 animate-pulse mx-auto mb-2" />
                      <p className="text-sm">Analyzing...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => onPhotoUpload(item.id, e.target.files[0])}
              className="hidden"
            />

            {item.photo_url && !item.isProcessingAI && (
              <Button
                type="button"
                onClick={() => onProcessImageAI(item.id, item.photo_url)}
                variant="outline"
                className="w-full rounded-xl"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Re-classify with AI
              </Button>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={item.title}
                onChange={e => onUpdate(item.id, "title", e.target.value)}
                placeholder="e.g., Canned Beans (12-pack)"
                className={`rounded-xl ${errors[`${item.id}_title`] ? "border-red-500" : ""}`}
              />
              {errors[`${item.id}_title`] && <p className="text-red-600 text-sm">{errors[`${item.id}_title`]}</p>}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={e => onUpdate(item.id, "description", e.target.value)}
                placeholder="Additional details..."
                className="rounded-xl"
                rows={3}
              />
            </div>

            {/* AI Text Classification Button */}
            {(item.title || item.description) && !item.photo_url && !item.madds_code && (
              <Button
                type="button"
                onClick={() => onProcessTextAI(item.id)}
                disabled={item.isProcessingAI}
                variant="outline"
                className="w-full rounded-xl border-2 border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F]/10"
              >
                {item.isProcessingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E07A5F] mr-2" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Auto-Classify from Text
                  </>
                )}
              </Button>
            )}

            <div className="space-y-2">
              <Label>MADDS Category *</Label>
              {item.madds_code ? (
                <div className="relative">
                  <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-mono text-blue-900">{item.madds_code}</p>
                        <p className="text-xs text-blue-700 mt-1">
                          {item.madds_class} | {item.two_word_code}
                        </p>
                      </div>
                      <Button type="button" onClick={() => setShowCodePicker(!showCodePicker)} variant="ghost" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => setShowCodePicker(!showCodePicker)}
                  variant="outline"
                  className={`w-full rounded-xl justify-start ${errors[`${item.id}_code`] ? "border-red-500" : ""}`}
                >
                  Select a category...
                </Button>
              )}
              {errors[`${item.id}_code`] && <p className="text-red-600 text-sm">{errors[`${item.id}_code`]}</p>}

              {showCodePicker && (
                <Card className="border-0 shadow-lg max-h-80 overflow-auto">
                  <CardContent className="p-3 space-y-2">
                    <Input
                      value={codeSearch}
                      onChange={e => setCodeSearch(e.target.value)}
                      placeholder="Search categories..."
                      className="rounded-xl"
                    />
                    <div className="space-y-2">
                      {filteredCodes.length > 0 ? (
                        filteredCodes.map(code => (
                          <button
                            key={code.code}
                            type="button"
                            onClick={() => {
                              onSelectCode(item.id, code.code);
                              setShowCodePicker(false);
                              setCodeSearch("");
                            }}
                            className="w-full text-left p-3 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <p className="text-sm font-mono text-gray-900">{code.code}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {code.mainCategory?.title} | {code.twoWord}
                            </p>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No categories found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!showCodePicker && item.suggested_codes && item.suggested_codes.length > 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">AI also suggests:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.suggested_codes.slice(1, 4).map(code => (
                      <Button
                        key={code.code}
                        type="button"
                        onClick={() => onSelectCode(item.id, code.code)}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        {code.code} - {code.twoWord}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => onUpdate(item.id, "quantity", parseInt(e.target.value) || 1)}
                  className={`rounded-xl ${errors[`${item.id}_quantity`] ? "border-red-500" : ""}`}
                />
                {errors[`${item.id}_quantity`] && <p className="text-red-600 text-sm">{errors[`${item.id}_quantity`]}</p>}
              </div>

              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select value={item.condition} onValueChange={value => onUpdate(item.id, "condition", value)}>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
