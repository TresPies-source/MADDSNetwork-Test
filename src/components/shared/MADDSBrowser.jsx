import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Sparkles,
  Filter
} from "lucide-react";
import { 
  MADDS_MAIN_CATEGORIES, 
  getSubcategories, 
  getSpecificCategories,
  searchCategories 
} from "./MADDSCategories";

export default function MADDSBrowser({ 
  onSelectCode, 
  selectedCode = "", 
  showSearch = true,
  compact = false 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMain, setExpandedMain] = useState("");
  const [expandedSub, setExpandedSub] = useState("");
  const [viewMode, setViewMode] = useState("browse"); // browse or search

  const searchResults = searchQuery ? searchCategories(searchQuery) : [];

  const handleSelectCode = (code, mainCategory, subCategory, specific) => {
    if (onSelectCode) {
      onSelectCode({
        code,
        mainCategory,
        subCategory,
        specific
      });
    }
  };

  const toggleMain = (code) => {
    setExpandedMain(expandedMain === code ? "" : code);
    setExpandedSub("");
  };

  const toggleSub = (code) => {
    setExpandedSub(expandedSub === code ? "" : code);
  };

  if (viewMode === "search" && searchQuery) {
    return (
      <div className="space-y-4">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MADDS categories..."
              className="pl-10 rounded-xl"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setViewMode("browse");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                Clear
              </Button>
            )}
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No results found for "{searchQuery}"</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("browse")}
                className="mt-2"
              >
                Browse all categories
              </Button>
            </div>
          ) : (
            searchResults.map((result, idx) => (
              <SearchResultCard
                key={idx}
                result={result}
                onSelect={handleSelectCode}
                isSelected={selectedCode === result.code}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setViewMode("search");
              }}
              placeholder="Search MADDS categories..."
              className="pl-10 rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "browse" ? "search" : "browse")}
            className="rounded-xl"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {MADDS_MAIN_CATEGORIES.map((mainCat) => (
          <MainCategoryCard
            key={mainCat.code}
            category={mainCat}
            isExpanded={expandedMain === mainCat.code}
            onToggle={toggleMain}
            expandedSub={expandedSub}
            onToggleSub={toggleSub}
            onSelectCode={handleSelectCode}
            selectedCode={selectedCode}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

function MainCategoryCard({ 
  category, 
  isExpanded, 
  onToggle, 
  expandedSub, 
  onToggleSub,
  onSelectCode,
  selectedCode,
  compact 
}) {
  const subcategories = getSubcategories(category.code);

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all">
      <CardHeader 
        className="cursor-pointer p-4"
        onClick={() => onToggle(category.code)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: category.color + '15' }}
            >
              {category.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge 
                  className="font-mono text-xs font-bold"
                  style={{ backgroundColor: category.color, color: 'white' }}
                >
                  {category.code}00
                </Badge>
                <h3 className="font-bold text-sm">{category.title}</h3>
              </div>
              {!compact && (
                <p className="text-xs text-gray-600 mt-1">{category.description}</p>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 px-4 pb-4 space-y-2">
          {subcategories.map((sub) => (
            <SubcategoryCard
              key={sub.code}
              subcategory={sub}
              mainCategory={category}
              isExpanded={expandedSub === sub.code}
              onToggle={onToggleSub}
              onSelectCode={onSelectCode}
              selectedCode={selectedCode}
              compact={compact}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
}

function SubcategoryCard({ 
  subcategory, 
  mainCategory, 
  isExpanded, 
  onToggle,
  onSelectCode,
  selectedCode,
  compact 
}) {
  const specificCategories = getSpecificCategories(subcategory.code);
  const hasSpecifics = specificCategories.length > 0;

  return (
    <div className="border-l-2 pl-4 ml-6" style={{ borderColor: mainCategory.color + '30' }}>
      <div
        className={`p-3 rounded-xl cursor-pointer transition-all ${
          selectedCode === subcategory.code 
            ? 'bg-blue-50 border-2 border-blue-500' 
            : 'hover:bg-gray-50 border border-gray-200'
        }`}
        onClick={() => hasSpecifics ? onToggle(subcategory.code) : onSelectCode(
          subcategory.code,
          mainCategory,
          subcategory,
          null
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge 
                variant="outline" 
                className="font-mono text-xs"
                style={{ borderColor: mainCategory.color, color: mainCategory.color }}
              >
                {subcategory.code}
              </Badge>
              <p className="font-semibold text-sm">{subcategory.name}</p>
              <Badge 
                className="text-xs"
                style={{ backgroundColor: mainCategory.color, color: 'white' }}
              >
                {subcategory.twoWord}
              </Badge>
            </div>
            {!compact && (
              <p className="text-xs text-gray-600">{subcategory.description}</p>
            )}
          </div>
          {hasSpecifics && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>

      {isExpanded && hasSpecifics && (
        <div className="mt-2 space-y-1 pl-4">
          {specificCategories.map((specific) => (
            <SpecificCategoryCard
              key={specific.code}
              specific={specific}
              mainCategory={mainCategory}
              subcategory={subcategory}
              onSelectCode={onSelectCode}
              isSelected={selectedCode === specific.code}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SpecificCategoryCard({ 
  specific, 
  mainCategory, 
  subcategory,
  onSelectCode,
  isSelected,
  compact 
}) {
  return (
    <div
      className={`p-2 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'bg-green-50 border-2 border-green-500' 
          : 'hover:bg-gray-50 border border-gray-100'
      }`}
      onClick={() => onSelectCode(specific.code, mainCategory, subcategory, specific)}
    >
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className="font-mono text-[10px] px-1.5 py-0.5"
          style={{ borderColor: mainCategory.color, color: mainCategory.color }}
        >
          {specific.code}
        </Badge>
        <div className="flex-1">
          <p className="text-xs font-medium">{specific.name}</p>
          {!compact && (
            <p className="text-[10px] text-gray-500">{specific.description}</p>
          )}
        </div>
        <Badge 
          className="text-[10px] px-2 py-0.5"
          style={{ backgroundColor: mainCategory.color + '20', color: mainCategory.color }}
        >
          {specific.twoWord}
        </Badge>
      </div>
    </div>
  );
}

function SearchResultCard({ result, onSelect, isSelected }) {
  return (
    <div
      className={`p-3 rounded-xl cursor-pointer transition-all ${
        isSelected 
          ? 'bg-blue-50 border-2 border-blue-500' 
          : 'hover:bg-gray-50 border border-gray-200'
      }`}
      onClick={() => onSelect(
        result.code,
        result.mainCategory,
        result.subCategory || result,
        result.type === 'specific' ? result : null
      )}
    >
      {result.type === 'main' ? (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: result.color + '20' }}
          >
            {result.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge style={{ backgroundColor: result.color, color: 'white' }}>
                {result.code}00
              </Badge>
              <p className="font-bold text-sm">{result.title}</p>
            </div>
            <p className="text-xs text-gray-600">{result.description}</p>
          </div>
        </div>
      ) : result.type === 'sub' ? (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono text-xs">
              {result.code}
            </Badge>
            <p className="font-semibold text-sm">{result.name}</p>
            <Badge 
              className="text-xs"
              style={{ backgroundColor: result.mainCategory.color, color: 'white' }}
            >
              {result.twoWord}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">{result.description}</p>
          <p className="text-[10px] text-gray-500 mt-1">
            Part of: {result.mainCategory.title}
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              variant="outline" 
              className="font-mono text-[10px]"
              style={{ borderColor: result.mainCategory.color, color: result.mainCategory.color }}
            >
              {result.code}
            </Badge>
            <p className="font-medium text-sm">{result.name}</p>
            <Badge 
              className="text-[10px]"
              style={{ backgroundColor: result.mainCategory.color + '20', color: result.mainCategory.color }}
            >
              {result.twoWord}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">{result.description}</p>
          <p className="text-[10px] text-gray-500 mt-1">
            {result.mainCategory.title} → {result.subCategory.name}
          </p>
        </div>
      )}
    </div>
  );
}