import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "Do I have to give something to receive?",
        a: "No! MADDS Network operates on trust and mutual aid principles. Give when you can, receive when you need. There's no requirement to \"pay it forward\" or balance your giving and receiving."
      },
      {
        q: "How do I find resources near me?",
        a: "Use the search bar on the home page and enter your zip code. Resources are organized by the MADDS system (Mutual Aid Dewey Decimal System), so browse by need category rather than specific product names."
      },
      {
        q: "What is the MADDS system?",
        a: "MADDS (Mutual Aid Dewey Decimal System) organizes resources by human need rather than commercial value. Instead of searching for \"winter coat,\" you'd look in SHELTER SAFELY → Climate Control. Learn more on our Learn MADDS page."
      }
    ]
  },
  {
    category: "Requests & Exchanges",
    questions: [
      {
        q: "What if someone doesn't show up for pickup?",
        a: "Life happens! Be patient and understanding. Try reaching out again. If there's a pattern of no-shows, our Care Coordinators can help mediate. Remember, this is community care, not commerce."
      },
      {
        q: "Can I request multiple items from the same person?",
        a: "Yes, but be mindful. Make separate requests for each item so the giver can decide what they're able to share. Don't overwhelm people with too many asks at once."
      },
      {
        q: "What if my request gets declined?",
        a: "That's okay! People decline for many reasons—timing, logistics, or they've already committed the item. No hard feelings. Keep browsing or post a request in a Circle."
      },
      {
        q: "How long should I wait before requesting again?",
        a: "There's no rule, but we suggest waiting a few days between requests for similar items. This gives others a chance and prevents any one person from receiving too much at once."
      }
    ]
  },
  {
    category: "Sharing Resources",
    questions: [
      {
        q: "What can I share on MADDS Network?",
        a: "Anything that helps meet human needs! Food, clothing, household items, tools, books, services, skills, even advice. If it's legal and safe, and you have it to give, share it."
      },
      {
        q: "Do I have to meet people in person?",
        a: "Not always! Many people do porch pickups (leave items on your porch for contactless exchange). You can also meet in public places. Do what feels safe and comfortable for you."
      },
      {
        q: "What if I change my mind about giving something?",
        a: "That's completely fine. Just update the listing to mark it as no longer available and message anyone who's requested it. Communication is key!"
      },
      {
        q: "How do I know if someone really needs what I'm offering?",
        a: "We operate on trust. People know what they need. Our philosophy is \"no questions asked, no verification required.\" Trust is the foundation of mutual aid."
      }
    ]
  },
  {
    category: "Safety & Privacy",
    questions: [
      {
        q: "Is my personal information safe?",
        a: "Yes. We only share your first name and zip code publicly. Your full name and email are only visible when you make or accept a request. We never sell data or track you for advertising."
      },
      {
        q: "How do I stay safe when meeting strangers?",
        a: "Meet in public places, do porch pickups, bring a friend, trust your instincts. Most exchanges happen without issue, but prioritize your safety. You can also use Circles for people you already know."
      },
      {
        q: "What if I experience harassment or feel unsafe?",
        a: "Contact our Care Coordinators immediately. We take safety seriously and will address the issue through our restorative justice process. Serious violations may result in removal from the network."
      },
      {
        q: "Can I block or report someone?",
        a: "Yes. While we prefer restorative approaches, you can report concerning behavior to coordinators. They'll investigate and take appropriate action to keep the community safe."
      }
    ]
  },
  {
    category: "Circles & Events",
    questions: [
      {
        q: "What are Circles?",
        a: "Circles are small, trusted groups for sensitive requests and private sharing. Create circles with family, friends, neighbors, or affinity groups for more intimate mutual aid."
      },
      {
        q: "Should I make my Circle public or private?",
        a: "Private circles are best for sensitive needs (domestic violence survival, immigration support, etc.). Public circles are great for neighborhood groups or interest-based communities."
      },
      {
        q: "How do I organize a community event?",
        a: "Go to the Events page and click \"Create Event.\" You can organize distributions, skill shares, repair cafes, or any gathering that builds community. Promote it to your network!"
      }
    ]
  },
  {
    category: "Community Guidelines",
    questions: [
      {
        q: "What happens if someone abuses the system?",
        a: "We use a restorative justice approach. Care Coordinators will talk with everyone involved, understand what happened, and work toward repair and accountability. Serious or repeated violations may result in membership review."
      },
      {
        q: "Can I sell things on MADDS Network?",
        a: "No. This is a mutual aid network, not a marketplace. Everything shared should be given freely. If you need income, check our EARN LIVELIHOOD category for job resources and economic support."
      },
      {
        q: "Who owns MADDS Network?",
        a: "We all do! MADDS Network is a community-owned cooperative. Members have a say in how it operates through democratic governance. No investors, no venture capital."
      },
      {
        q: "How is MADDS Network funded?",
        a: "Through member contributions, grants, and donations. We're committed to staying ad-free and never selling user data. Support us if you're able, but receiving help is never dependent on paying."
      }
    ]
  },
  {
    category: "Technical Issues",
    questions: [
      {
        q: "I can't log in. What should I do?",
        a: "Try resetting your password. If that doesn't work, clear your browser cache and cookies. Still stuck? Email support@maddsnetwork.org with your username."
      },
      {
        q: "How do I delete my account?",
        a: "Go to your Profile → Settings → Privacy. At the bottom, you'll see \"Delete Account.\" All your data will be permanently removed within 30 days."
      },
      {
        q: "Can I use MADDS Network on my phone?",
        a: "Yes! Our site is fully mobile-responsive. For the best experience, add it to your home screen (it works like an app)."
      },
      {
        q: "I found a bug. How do I report it?",
        a: "Thank you! Email bugs@maddsnetwork.org with screenshots and a description of what happened. We'll fix it as soon as possible."
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState({});

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedIndex(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredFaqs = searchQuery
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text)' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-light)' }}>
            Find answers to common questions about how MADDS Network works
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 rounded-2xl border-2 focus:border-[#E07A5F] text-lg"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredFaqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-0 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((item, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`;
                    const isExpanded = expandedIndex[key];
                    
                    return (
                      <div
                        key={questionIndex}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-4">
                            {item.q}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Have Questions */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-[#E07A5F] to-[#F2CC8F]">
          <CardContent className="p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">
              Still Have Questions?
            </h2>
            <p className="mb-6 opacity-90">
              Can't find what you're looking for? Reach out to our community support team.
            </p>
            <a href="mailto:support@maddsnetwork.org">
              <button className="bg-white text-[#E07A5F] hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors">
                Contact Support
              </button>
            </a>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}