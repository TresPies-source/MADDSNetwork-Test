
// MADDS Complete Taxonomy - All 900+ Specific Categories
// Mutual Aid Dewey Decimal System - Production-Ready Classification

/**
 * MADDS SPECIFIC CATEGORIES (Third-Level Detail)
 * Format: XXX.YYY where:
 * - XXX = Main + Sub Domain (010-990)
 * - YYY = Specific Type (100-900)
 * 
 * Third digit philosophy:
 * .100 = Most immediate/critical
 * .200 = Baby/infant priority  
 * .300 = Medical/sustaining
 * .400 = Portable/emergency
 * .500 = Standard/common
 * .600 = Bulk/family-size
 * .700 = Premium/specialty
 * .800 = DIY/self-reliant
 * .900 = Cultural/spiritual
 */

export const MADDS_SPECIFIC_CATEGORIES = {
  
  // ========================================
  // 000 - EMERGENCY SURVIVAL
  // ========================================
  
  "010": [ // Immediate Food - Ready-to-eat, no preparation needed
    { code: "010.100", name: "Single-serve meals (microwaveable, shelf-stable)", twoWord: "SAVE LIFE" },
    { code: "010.200", name: "Infant formula & baby food (0-12 months)", twoWord: "FEED BABY" },
    { code: "010.300", name: "Nutrition shakes/supplements (Ensure, etc.)", twoWord: "SUSTAIN STRENGTH" },
    { code: "010.400", name: "Meal replacement bars (protein bars, emergency rations)", twoWord: "PROVIDE ENERGY" },
    { code: "010.500", name: "Portable soups (cup noodles, instant)", twoWord: "WARM QUICKLY" },
    { code: "010.600", name: "Grab-and-go snacks (granola bars, crackers)", twoWord: "CARRY EASILY" },
    { code: "010.700", name: "Electrolyte drinks (Gatorade, Pedialyte)", twoWord: "RESTORE BALANCE" },
    { code: "010.800", name: "Emergency water (bottled, purification tablets)", twoWord: "HYDRATE SAFELY" },
    { code: "010.900", name: "Culturally specific ready meals (halal, kosher, etc.)", twoWord: "HONOR PRACTICE" },
  ],
  
  "020": [ // Immediate Shelter - Same-day housing crisis
    { code: "020.100", name: "Emergency blankets/sleeping bags", twoWord: "STAY WARM" },
    { code: "020.200", name: "Tents & tarps", twoWord: "CREATE SHELTER" },
    { code: "020.300", name: "Hand warmers & heat packs", twoWord: "PREVENT COLD" },
    { code: "020.400", name: "Rain ponchos & weather protection", twoWord: "STAY DRY" },
    { code: "020.500", name: "Emergency shelter vouchers (hotel/motel)", twoWord: "FIND REFUGE" },
    { code: "020.600", name: "Car living essentials (window covers, etc.)", twoWord: "SURVIVE VEHICLE" },
    { code: "020.700", name: "Camping stoves & fuel", twoWord: "COOK SAFELY" },
    { code: "020.800", name: "Flashlights & batteries", twoWord: "SEE DARKNESS" },
    { code: "020.900", name: "Emergency phone chargers (solar, hand-crank)", twoWord: "STAY CONNECTED" },
  ],
  
  "030": [ // Immediate Hygiene - Dignity in crisis
    { code: "030.100", name: "Menstrual products (pads, tampons, cups)", twoWord: "MANAGE PERIOD" },
    { code: "030.200", name: "Diapers (all sizes, infant to adult)", twoWord: "MAINTAIN DIGNITY" },
    { code: "030.300", name: "Hygiene kits (soap, toothbrush, deodorant)", twoWord: "STAY CLEAN" },
    { code: "030.400", name: "Feminine hygiene (wipes, wash, etc.)", twoWord: "CARE BODY" },
    { code: "030.500", name: "Hand sanitizer & disinfecting wipes", twoWord: "PREVENT ILLNESS" },
    { code: "030.600", name: "Toilet paper & tissues", twoWord: "MEET NEED" },
    { code: "030.700", name: "Shower access passes (gym, public facility)", twoWord: "WASH BODY" },
    { code: "030.800", name: "Clean underwear & socks", twoWord: "FEEL HUMAN" },
    { code: "030.900", name: "Laundry vouchers", twoWord: "REFRESH CLOTHES" },
  ],
  
  "040": [ // Immediate Medical - First aid and urgent health
    { code: "040.100", name: "First aid kits", twoWord: "TREAT WOUNDS" },
    { code: "040.200", name: "Pain relievers (ibuprofen, acetaminophen)", twoWord: "EASE PAIN" },
    { code: "040.300", name: "Bandages & gauze", twoWord: "COVER INJURY" },
    { code: "040.400", name: "Prescription assistance (emergency refills)", twoWord: "CONTINUE MEDICATION" },
    { code: "040.500", name: "Diabetic supplies (glucose, test strips)", twoWord: "MANAGE DIABETES" },
    { code: "040.600", name: "EpiPens & allergy medication", twoWord: "PREVENT SHOCK" },
    { code: "040.700", name: "Naloxone/Narcan (overdose reversal)", twoWord: "SAVE OVERDOSE" },
    { code: "040.800", name: "Mental health crisis support (hotline cards)", twoWord: "FIND HELP" },
    { code: "040.900", name: "Eyeglasses/hearing aid batteries", twoWord: "SENSE WORLD" },
  ],
  
  "050": [ // Immediate Safety - Domestic violence, trafficking, immediate danger
    { code: "050.100", name: "Emergency cash assistance (gas, bus fare)", twoWord: "ESCAPE DANGER" },
    { code: "050.200", name: "Prepaid phones (for safety planning)", twoWord: "CALL HELP" },
    { code: "050.300", name: "Safe house vouchers", twoWord: "HIDE SAFELY" },
    { code: "050.400", name: "Legal advocacy referrals", twoWord: "KNOW RIGHTS" },
    { code: "050.500", name: "Safety planning materials", twoWord: "PREPARE ESCAPE" },
    { code: "050.600", name: "Child safety items (car seats, locks)", twoWord: "PROTECT CHILDREN" },
    { code: "050.700", name: "Identity documents (copies, storage)", twoWord: "PROVE SELF" },
    { code: "050.800", name: "Emergency contraception", twoWord: "PREVENT PREGNANCY" },
    { code: "050.900", name: "Trauma-informed resource guides", twoWord: "UNDERSTAND OPTIONS" },
  ],
  
  // ========================================
  // 100 - NOURISH BODY
  // ========================================
  
  "110": [ // Plant Proteins - Legumes, beans, meat alternatives
    { code: "110.100", name: "Dried beans (black, pinto, kidney)", twoWord: "NOURISH BODY" },
    { code: "110.200", name: "Lentils (red, green, brown)", twoWord: "BUILD STRENGTH" },
    { code: "110.300", name: "Chickpeas/garbanzo beans", twoWord: "FEED FAMILY" },
    { code: "110.400", name: "Split peas", twoWord: "MAKE SOUP" },
    { code: "110.500", name: "Canned beans (convenience)", twoWord: "COOK QUICKLY" },
    { code: "110.600", name: "Tofu & tempeh", twoWord: "CHOOSE PLANT" },
    { code: "110.700", name: "Textured vegetable protein (TVP)", twoWord: "STRETCH BUDGET" },
    { code: "110.800", name: "Peanut butter & nut butters", twoWord: "SPREAD GOODNESS" },
    { code: "110.900", name: "Hummus & bean dips", twoWord: "SHARE MEAL" },
  ],
  
  "120": [ // Animal Proteins - Meat, fish, eggs, dairy
    { code: "120.100", name: "Canned tuna & salmon", twoWord: "NOURISH BODY" },
    { code: "120.200", name: "Canned chicken & turkey", twoWord: "FEED FAMILY" },
    { code: "120.300", name: "Eggs (fresh, carton)", twoWord: "START DAY" },
    { code: "120.400", name: "Milk (dairy, shelf-stable)", twoWord: "BUILD BONES" },
    { code: "120.500", name: "Cheese (blocks, sliced, string)", twoWord: "ADD CALCIUM" },
    { code: "120.600", name: "Yogurt (cups, pouches)", twoWord: "AID DIGESTION" },
    { code: "120.700", name: "Frozen meat (ground beef, chicken)", twoWord: "COOK TRADITIONAL" },
    { code: "120.800", name: "Deli meat (for sandwiches)", twoWord: "PACK LUNCH" },
    { code: "120.900", name: "Halal/Kosher meat (religiously prepared)", twoWord: "HONOR FAITH" },
  ],
  
  "130": [ // Grains & Bread - Carbohydrates, energy sources
    { code: "130.100", name: "Rice (white, brown, jasmine)", twoWord: "NOURISH BODY" },
    { code: "130.200", name: "Pasta (spaghetti, macaroni, etc.)", twoWord: "FEED FAMILY" },
    { code: "130.300", name: "Oats & oatmeal", twoWord: "START MORNING" },
    { code: "130.400", name: "Quinoa & ancient grains", twoWord: "CHOOSE WHOLE" },
    { code: "130.500", name: "Bread (loaves, buns, tortillas)", twoWord: "MAKE SANDWICH" },
    { code: "130.600", name: "Cereal (cold, hot)", twoWord: "GRAB QUICKLY" },
    { code: "130.700", name: "Flour (all-purpose, whole wheat)", twoWord: "BAKE TOGETHER" },
    { code: "130.800", name: "Cornmeal & grits", twoWord: "COOK TRADITION" },
    { code: "130.900", name: "Culturally specific grains (couscous, farro, etc.)", twoWord: "HONOR ROOTS" },
  ],
  
  "140": [ // Fruits (Preserved) - Canned, dried, frozen fruits
    { code: "140.100", name: "Canned fruit (peaches, pears, mixed)", twoWord: "NOURISH BODY" },
    { code: "140.200", name: "Applesauce & fruit cups", twoWord: "PACK LUNCH" },
    { code: "140.300", name: "Dried fruit (raisins, apricots, dates)", twoWord: "CARRY SNACK" },
    { code: "140.400", name: "Frozen fruit (berries, mango)", twoWord: "BLEND SMOOTHIE" },
    { code: "140.500", name: "Fruit juice (100% juice, no sugar added)", twoWord: "DRINK VITAMINS" },
    { code: "140.600", name: "Jam & preserves", twoWord: "SPREAD JOY" },
    { code: "140.700", name: "Canned pie fillings", twoWord: "BAKE DESSERT" },
    { code: "140.800", name: "Fruit leather & fruit snacks", twoWord: "PLEASE CHILDREN" },
    { code: "140.900", name: "Baby food (fruit purees)", twoWord: "FEED BABY" },
  ],
  
  "150": [ // Vegetables (Preserved) - Canned, dried, frozen vegetables
    { code: "150.100", name: "Canned tomatoes (diced, sauce, paste)", twoWord: "NOURISH BODY" },
    { code: "150.200", name: "Canned corn, peas, green beans", twoWord: "ADD VEGETABLES" },
    { code: "150.300", name: "Canned mixed vegetables", twoWord: "MAKE STEW" },
    { code: "150.400", name: "Frozen vegetables (broccoli, carrots, etc.)", twoWord: "COOK QUICKLY" },
    { code: "150.500", name: "Tomato sauce & salsa", twoWord: "FLAVOR MEAL" },
    { code: "150.600", name: "Pickles & pickled vegetables", twoWord: "ADD CRUNCH" },
    { code: "150.700", name: "Sauerkraut & fermented vegetables", twoWord: "AID DIGESTION" },
    { code: "150.800", name: "Vegetable broth & stock", twoWord: "START SOUP" },
    { code: "150.900", name: "Baby food (vegetable purees)", twoWord: "FEED BABY" },
  ],
  
  "160": [ // Fresh Produce - Fresh fruits & vegetables (perishable)
    { code: "160.100", name: "Fresh fruit (apples, bananas, oranges)", twoWord: "NOURISH BODY" },
    { code: "160.200", name: "Fresh vegetables (lettuce, carrots, etc.)", twoWord: "EAT RAINBOW" },
    { code: "160.300", name: "Root vegetables (potatoes, onions, garlic)", twoWord: "COOK HEARTY" },
    { code: "160.400", name: "Herbs (fresh cilantro, basil, parsley)", twoWord: "ADD FLAVOR" },
    { code: "160.500", name: "Salad greens & pre-washed produce", twoWord: "PREPARE EASILY" },
    { code: "160.600", name: "Seasonal produce (local harvest)", twoWord: "EAT SEASON" },
    { code: "160.700", name: "Organic produce (pesticide-free)", twoWord: "CHOOSE CLEAN" },
    { code: "160.800", name: "Culturally specific produce (yuca, plantains, etc.)", twoWord: "COOK TRADITION" },
    { code: "160.900", name: "Produce vouchers (farmers market)", twoWord: "SUPPORT LOCAL" },
  ],
  
  "170": [ // Cooking Essentials - Oils, spices, condiments
    { code: "170.100", name: "Cooking oil (vegetable, olive, coconut)", twoWord: "FRY FOOD" },
    { code: "170.200", name: "Salt & pepper", twoWord: "SEASON SIMPLY" },
    { code: "170.300", name: "Spices & seasonings (cumin, garlic powder, etc.)", twoWord: "ADD FLAVOR" },
    { code: "170.400", name: "Sugar & sweeteners (white, brown, honey)", twoWord: "SWEETEN LIFE" },
    { code: "170.500", name: "Vinegar (white, apple cider, balsamic)", twoWord: "DRESS SALAD" },
    { code: "170.600", name: "Soy sauce & hot sauce", twoWord: "SPICE UP" },
    { code: "170.700", name: "Ketchup, mustard, mayo", twoWord: "TOP SANDWICH" },
    { code: "170.800", name: "Baking essentials (baking soda, powder, yeast)", twoWord: "RISE DOUGH" },
    { code: "170.900", name: "Cultural spice blends (curry, garam masala, etc.)", twoWord: "HONOR TRADITION" },
  ],
  
  "180": [ // Beverages - Drinks beyond water
    { code: "180.100", name: "Coffee (ground, instant, pods)", twoWord: "START DAY" },
    { code: "180.200", name: "Tea (black, green, herbal)", twoWord: "WARM SOUL" },
    { code: "180.300", name: "Hot chocolate & cocoa", twoWord: "COMFORT CHILDREN" },
    { code: "180.400", name: "Milk alternatives (almond, soy, oat)", twoWord: "CHOOSE PLANT" },
    { code: "180.500", name: "Sports drinks (electrolytes)", twoWord: "HYDRATE ACTIVE" },
    { code: "180.600", name: "Juice boxes (kid-friendly)", twoWord: "PACK LUNCH" },
    { code: "180.700", name: "Powdered drink mixes (Kool-Aid, lemonade)", twoWord: "FLAVOR WATER" },
    { code: "180.800", name: "Soda & carbonated drinks (occasional treat)", twoWord: "CELEBRATE SMALL" },
    { code: "180.900", name: "Cultural beverages (horchata mix, chai, etc.)", twoWord: "TASTE HOME" },
  ],
  
  "190": [ // Special Diets - Allergen-free, medical nutrition
    { code: "190.100", name: "Gluten-free products", twoWord: "AVOID GLUTEN" },
    { code: "190.200", name: "Dairy-free products", twoWord: "SKIP LACTOSE" },
    { code: "190.300", name: "Nut-free snacks", twoWord: "PROTECT ALLERGY" },
    { code: "190.400", name: "Low-sodium foods", twoWord: "MANAGE BLOOD PRESSURE" },
    { code: "190.500", name: "Diabetic-friendly foods (sugar-free)", twoWord: "CONTROL SUGAR" },
    { code: "190.600", name: "Vegan products (no animal products)", twoWord: "CHOOSE COMPASSION" },
    { code: "190.700", name: "Halal certified foods", twoWord: "FOLLOW ISLAM" },
    { code: "190.800", name: "Kosher certified foods", twoWord: "FOLLOW JUDAISM" },
    { code: "190.900", name: "Medical nutrition (feeding tubes, special formulas)", twoWord: "MEET MEDICAL NEED" },
  ],
  
  // ========================================
  // 200 - SHELTER SAFELY
  // ========================================
  
  "210": [ // Bedding & Sleep - Rest, comfort, warmth
    { code: "210.100", name: "Mattresses (twin, full, queen, king)", twoWord: "REST BODY" },
    { code: "210.200", name: "Bed frames & box springs", twoWord: "SUPPORT SLEEP" },
    { code: "210.300", name: "Pillows & pillow cases", twoWord: "CRADLE HEAD" },
    { code: "210.400", name: "Sheets & sheet sets", twoWord: "MAKE BED" },
    { code: "210.500", name: "Blankets (fleece, wool, electric)", twoWord: "STAY WARM" },
    { code: "210.600", name: "Comforters & duvets", twoWord: "NEST COZY" },
    { code: "210.700", name: "Sleeping bags (indoor, camping)", twoWord: "ROLL OUT" },
    { code: "210.800", name: "Crib mattresses & baby bedding", twoWord: "SLEEP SAFE" },
    { code: "210.900", name: "Mattress protectors & bedding accessories", twoWord: "PROTECT INVESTMENT" },
  ],
  
  "220": [ // Furniture (Living) - Seating, tables, daily living
    { code: "220.100", name: "Sofas & couches", twoWord: "GATHER FAMILY" },
    { code: "220.200", name: "Chairs (dining, office, accent)", twoWord: "SIT TOGETHER" },
    { code: "220.300", name: "Tables (dining, coffee, end)", twoWord: "SHARE MEAL" },
    { code: "220.400", name: "Dressers & storage furniture", twoWord: "ORGANIZE BELONGINGS" },
    { code: "220.500", name: "Bookshelves & shelving units", twoWord: "DISPLAY KNOWLEDGE" },
    { code: "220.600", name: "TV stands & entertainment centers", twoWord: "WATCH TOGETHER" },
    { code: "220.700", name: "Desks & workspaces", twoWord: "WORK HOME" },
    { code: "220.800", name: "Children's furniture (toy boxes, small chairs)", twoWord: "SCALE DOWN" },
    { code: "220.900", name: "Outdoor furniture (patio sets)", twoWord: "EXTEND LIVING" },
  ],
  
  "230": [ // Appliances (Major) - Essential home systems
    { code: "230.100", name: "Refrigerators", twoWord: "PRESERVE FOOD" },
    { code: "230.200", name: "Stoves & ovens (gas, electric)", twoWord: "COOK MEALS" },
    { code: "230.300", name: "Microwaves", twoWord: "HEAT QUICKLY" },
    { code: "230.400", name: "Dishwashers", twoWord: "WASH EFFICIENTLY" },
    { code: "230.500", name: "Washing machines", twoWord: "CLEAN CLOTHES" },
    { code: "230.600", name: "Dryers", twoWord: "DRY LAUNDRY" },
    { code: "230.700", name: "Air conditioners & fans", twoWord: "COOL SPACE" },
    { code: "230.800", name: "Space heaters (safe, certified)", twoWord: "WARM ROOM" },
    { code: "230.900", name: "Water heaters", twoWord: "PROVIDE HOT WATER" },
  ],
  
  "240": [ // Appliances (Small) - Kitchen & convenience
    { code: "240.100", name: "Coffee makers & kettles", twoWord: "BREW MORNING" },
    { code: "240.200", name: "Toasters & toaster ovens", twoWord: "CRISP BREAD" },
    { code: "240.300", name: "Blenders & food processors", twoWord: "BLEND SMOOTH" },
    { code: "240.400", name: "Slow cookers & Instant Pots", twoWord: "COOK EASY" },
    { code: "240.500", name: "Rice cookers", twoWord: "STEAM PERFECT" },
    { code: "240.600", name: "Mixers (hand, stand)", twoWord: "BAKE TOGETHER" },
    { code: "240.700", name: "Irons & ironing boards", twoWord: "PRESS CLOTHES" },
    { code: "240.800", name: "Vacuum cleaners", twoWord: "CLEAN FLOORS" },
    { code: "240.900", name: "Fans & portable heaters", twoWord: "ADJUST TEMPERATURE" },
  ],
  
  "250": [ // Household Goods - Dishes, cookware, linens
    { code: "250.100", name: "Dishes & dinnerware (plates, bowls)", twoWord: "SET TABLE" },
    { code: "250.200", name: "Glassware & mugs", twoWord: "DRINK TOGETHER" },
    { code: "250.300", name: "Silverware & utensils", twoWord: "EAT MEAL" },
    { code: "250.400", name: "Pots & pans (cookware sets)", twoWord: "COOK VARIETY" },
    { code: "250.500", name: "Bakeware (baking sheets, cake pans)", twoWord: "BAKE TREATS" },
    { code: "250.600", name: "Kitchen utensils (spatulas, ladles, etc.)", twoWord: "STIR POT" },
    { code: "250.700", name: "Storage containers (Tupperware, food storage)", twoWord: "SAVE LEFTOVERS" },
    { code: "250.800", name: "Towels (bath, hand, dish)", twoWord: "DRY OFF" },
    { code: "250.900", name: "Curtains & window treatments", twoWord: "FILTER LIGHT" },
  ],
  
  "260": [ // Home Maintenance - Tools, cleaning, repairs
    { code: "260.100", name: "Cleaning supplies (all-purpose, disinfectant)", twoWord: "KEEP CLEAN" },
    { code: "260.200", name: "Brooms, mops, vacuum bags", twoWord: "SWEEP FLOOR" },
    { code: "260.300", name: "Laundry detergent & fabric softener", twoWord: "WASH FRESH" },
    { code: "260.400", name: "Dish soap & dishwasher pods", twoWord: "SCRUB DISHES" },
    { code: "260.500", name: "Paper products (toilet paper, paper towels)", twoWord: "WIPE UP" },
    { code: "260.600", name: "Trash bags & waste bins", twoWord: "CONTAIN WASTE" },
    { code: "260.700", name: "Light bulbs & batteries", twoWord: "ILLUMINATE HOME" },
    { code: "260.800", name: "Basic tools (hammer, screwdriver set)", twoWord: "FIX SMALL" },
    { code: "260.900", name: "Pest control (traps, repellent)", twoWord: "PROTECT SPACE" },
  ],
  
  "270": [ // Utilities Support - Bill assistance, essential services
    { code: "270.100", name: "Electric bill assistance", twoWord: "KEEP POWER" },
    { code: "270.200", name: "Gas/heating bill assistance", twoWord: "STAY WARM" },
    { code: "270.300", name: "Water bill assistance", twoWord: "FLOW WATER" },
    { code: "270.400", name: "Internet/phone bill assistance", twoWord: "STAY CONNECTED" },
    { code: "270.500", name: "Rent assistance (one-time, ongoing)", twoWord: "MAINTAIN HOUSING" },
    { code: "270.600", name: "Security deposits (move-in support)", twoWord: "START FRESH" },
    { code: "270.700", name: "Eviction prevention services", twoWord: "SAVE HOME" },
    { code: "270.800", name: "Home repair grants (roof, plumbing)", twoWord: "FIX STRUCTURE" },
    { code: "270.900", name: "Weatherization services (insulation, sealing)", twoWord: "CONSERVE ENERGY" },
  ],
  
  "280": [ // Housing Navigation - Finding & securing housing
    { code: "280.100", name: "Housing search support (listings, apps)", twoWord: "FIND HOME" },
    { code: "280.200", name: "Application fee assistance", twoWord: "APPLY WIDELY" },
    { code: "280.300", name: "Credit repair resources", twoWord: "IMPROVE SCORE" },
    { code: "280.400", name: "Tenant rights education", twoWord: "KNOW RIGHTS" },
    { code: "280.500", name: "Lease negotiation support", twoWord: "UNDERSTAND TERMS" },
    { code: "280.600", name: "Moving supplies (boxes, tape)", twoWord: "PACK BELONGINGS" },
    { code: "280.700", name: "Moving truck/labor vouchers", twoWord: "TRANSPORT STUFF" },
    { code: "280.800", name: "Furniture rental programs (rent-to-own)", twoWord: "FURNISH GRADUALLY" },
    { code: "280.900", name: "Temporary housing (transition, bridge)", twoWord: "BRIDGE GAP" },
  ],
  
  "290": [ // Home Safety - Childproofing, fire safety, security
    { code: "290.100", name: "Smoke detectors & carbon monoxide alarms", twoWord: "DETECT DANGER" },
    { code: "290.200", name: "Fire extinguishers", twoWord: "STOP FIRE" },
    { code: "290.300", name: "First aid kits (home)", twoWord: "TREAT INJURY" },
    { code: "290.400", name: "Childproofing supplies (outlet covers, gates)", twoWord: "PROTECT CHILDREN" },
    { code: "290.500", name: "Door locks & security systems", twoWord: "SECURE ENTRY" },
    { code: "290.600", name: "Window guards & safety film", twoWord: "PREVENT FALLS" },
    { code: "290.700", name: "Emergency preparedness kits (72-hour supplies)", twoWord: "PREPARE DISASTER" },
    { code: "290.800", name: "Flashlights & emergency lighting", twoWord: "SEE OUTAGE" },
    { code: "290.900", name: "Medication lock boxes", twoWord: "STORE SAFELY" },
  ],

  // ========================================
  // 300-900 SERIES TO BE CONTINUED
  // ========================================
  // Next sections: CONNECT COMMUNITY, HEAL WHOLENESS, GROW KNOWLEDGE,
  // EARN LIVELIHOOD, EXPRESS CREATIVITY, PROTECT EARTH, TRANSITION LIFE
};

export default MADDS_SPECIFIC_CATEGORIES;
