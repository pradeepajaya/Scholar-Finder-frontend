import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, ArrowRight, Search, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { ContentDetailPage } from "./ContentDetailPage";
import { matchesSearch } from "@/utils/search";

const newsArticles = [
  {
    id: 1,
    title: "Commonwealth Scholarship Applications Open for 2026",
    excerpt:
      "The Commonwealth Scholarship Commission has announced the opening of applications for Master's and PhD programs in the UK for the 2026 academic year.",
    category: "Scholarship Alert",
    date: "2026-01-15",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    highlights: [
      "Applications are open for eligible Master's and PhD candidates planning UK study in 2026.",
      "Applicants should prepare transcripts, references, and development impact statements early.",
      "Shortlisting usually values leadership, academic strength, and a clear plan to serve Sri Lanka.",
    ],
    sections: [
      {
        heading: "What students should know",
        body: [
          "The Commonwealth Scholarship cycle is one of the most competitive opportunities for postgraduate study in the UK. Students should begin by checking whether their preferred course, university, and study level match the scholarship route they plan to use.",
          "A strong application connects academic goals with a practical development need. Reviewers look for students who can explain why the UK program matters and how the knowledge gained will be used after returning home.",
        ],
      },
      {
        heading: "Documents to prepare",
        body: [
          "Most applicants will need academic transcripts, degree certificates, referee details, a personal statement, and evidence of admission or course selection. Preparing these early reduces the risk of rushed submissions near the deadline.",
          "Recommendation letters should come from people who can speak about your academic ability, leadership, and long-term potential with specific examples.",
        ],
      },
    ],
    nextSteps: [
      "Shortlist two or three eligible UK programs that match your academic background.",
      "Ask referees early and share your scholarship goals with them.",
      "Draft a development impact statement before completing the final form.",
    ],
  },
  {
    id: 2,
    title: "New DAAD Scholarship Program for STEM Students",
    excerpt:
      "Germany announces expanded scholarship opportunities for students from Sri Lanka pursuing STEM fields with increased monthly stipends.",
    category: "New Opportunity",
    date: "2026-01-12",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800",
    highlights: [
      "The expanded DAAD program is focused on science, technology, engineering, and mathematics fields.",
      "Monthly support has increased to help students manage living costs while studying in Germany.",
      "Applicants with research experience, strong grades, and clear study plans will be better positioned.",
    ],
    sections: [
      {
        heading: "Why this matters",
        body: [
          "Germany continues to attract international students because of its research universities, industry links, and wide range of English-taught postgraduate programs. The expanded DAAD support gives STEM students from Sri Lanka another pathway to build advanced technical skills.",
          "Students should compare program language requirements, research fit, and admission timelines before choosing where to apply.",
        ],
      },
      {
        heading: "How to prepare a stronger profile",
        body: [
          "Applicants should highlight research projects, internships, publications, technical portfolios, or final-year projects that show readiness for postgraduate work.",
          "A focused study plan is important. It should explain the field you want to specialize in, why Germany is a good fit, and how the degree supports your career goals.",
        ],
      },
    ],
    nextSteps: [
      "Create a list of German STEM programs that match your qualifications.",
      "Check whether each program requires IELTS, TOEFL, or German language evidence.",
      "Prepare a one-page research or study motivation summary before requesting references.",
    ],
  },
  {
    id: 3,
    title: "Australia Awards Scholarship Success Stories",
    excerpt:
      "Meet five Sri Lankan scholars who transformed their careers through Australia Awards Scholarships and returned to contribute to national development.",
    category: "Success Stories",
    date: "2026-01-10",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    highlights: [
      "The featured scholars used their awards to build skills in public policy, health, engineering, and education.",
      "Their stories show the value of choosing programs that connect directly to national needs.",
      "Returning scholars often continue their impact through public service, research, and community work.",
    ],
    sections: [
      {
        heading: "Lessons from successful scholars",
        body: [
          "The strongest scholarship journeys usually start with a clear purpose. The scholars featured in these stories did not only apply for a degree; they connected their study plans to specific problems they wanted to solve.",
          "Their applications also showed evidence of leadership before the scholarship. Community projects, university societies, volunteer work, and professional achievements all helped demonstrate readiness.",
        ],
      },
      {
        heading: "What future applicants can learn",
        body: [
          "Success stories are useful because they make the application process feel more practical. Students can study how past recipients described their goals, selected universities, and built support networks abroad.",
          "A good application should feel personal and grounded. Reviewers need to understand what you have already done and what you are prepared to contribute next.",
        ],
      },
    ],
    nextSteps: [
      "Write down your own academic story and the problem you want to work on.",
      "Collect examples of leadership, service, or research from the last three years.",
      "Use alumni stories to shape your goals, not to copy someone else's wording.",
    ],
  },
  {
    id: 4,
    title: "Tips for Writing a Winning Scholarship Essay",
    excerpt:
      "Expert advice from scholarship reviewers on crafting personal statements that stand out and increase your chances of success.",
    category: "Tips & Guides",
    date: "2026-01-08",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    highlights: [
      "A winning essay should be specific, personal, and directly connected to the scholarship mission.",
      "Reviewers respond better to evidence than broad claims about passion or ambition.",
      "Clear structure matters: motivation, preparation, goals, and impact should be easy to follow.",
    ],
    sections: [
      {
        heading: "What reviewers look for",
        body: [
          "Scholarship essays are not just writing samples. They help reviewers understand your judgment, motivation, and fit for the award. Strong essays show why your chosen field matters and why you are ready for the opportunity now.",
          "Avoid generic statements that could apply to any applicant. Replace them with concrete examples from your studies, work, volunteering, or personal experience.",
        ],
      },
      {
        heading: "A simple structure to follow",
        body: [
          "Start with the problem or goal that motivates you. Then explain the preparation you already have, the program you want to pursue, and the impact you hope to create after the scholarship.",
          "End with a confident but realistic conclusion. The best essays sound thoughtful and focused, not exaggerated.",
        ],
      },
    ],
    nextSteps: [
      "Draft your essay in sections before trying to polish the language.",
      "Ask one person to check clarity and another to check grammar.",
      "Remove repeated ideas so every paragraph adds something new.",
    ],
  },
  {
    id: 5,
    title: "Fulbright Program Extends Application Deadline",
    excerpt:
      "Due to high demand, the Fulbright Foreign Student Program has extended its application deadline by two weeks.",
    category: "Deadline Update",
    date: "2026-01-05",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    highlights: [
      "The Fulbright Foreign Student Program deadline has been extended by two weeks.",
      "Students who were nearly ready should use the extra time to improve clarity and documentation.",
      "Late preparation still needs discipline because references and transcripts can take time.",
    ],
    sections: [
      {
        heading: "What the extension means",
        body: [
          "The deadline extension gives applicants additional time to complete forms, review essays, and confirm supporting documents. It should be treated as a chance to strengthen the application, not as a reason to delay.",
          "Students who have not started yet should first confirm eligibility and program fit before investing time in the full application.",
        ],
      },
      {
        heading: "How to use the extra time",
        body: [
          "Prioritize the parts that are hardest to change later: recommendation letters, transcripts, test evidence, and the core study objective.",
          "Applicants should also read the application instructions carefully. Small mistakes in document format or missing fields can weaken an otherwise strong submission.",
        ],
      },
    ],
    nextSteps: [
      "Create a final checklist with every required document and form section.",
      "Send polite reminders to referees with the new deadline clearly stated.",
      "Use the final days for review rather than major rewrites.",
    ],
  },
  {
    id: 6,
    title: "Mahapola Scholarship: Changes in Income Criteria",
    excerpt:
      "The Mahapola Higher Education Scholarship Trust Fund announces revised income thresholds for the upcoming academic year.",
    category: "Policy Update",
    date: "2026-01-03",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
    highlights: [
      "Mahapola income criteria have been revised for the upcoming academic year.",
      "Students should recheck household income documentation before applying.",
      "Accurate information is important because incorrect details can delay assessment.",
    ],
    sections: [
      {
        heading: "What has changed",
        body: [
          "The revised income thresholds are intended to update eligibility assessment for students seeking higher education support. Applicants should not rely on last year's assumptions when deciding whether they qualify.",
          "Household income, family circumstances, and university enrollment details may all be considered during review.",
        ],
      },
      {
        heading: "How students can prepare",
        body: [
          "Before applying, students should collect recent income certificates, university admission details, identity documents, and any additional evidence requested by the scholarship body.",
          "If family income has changed recently, students should keep supporting documents that explain the change clearly.",
        ],
      },
    ],
    nextSteps: [
      "Review the latest eligibility guidance before starting the application.",
      "Prepare income documents in advance and check that names and dates are correct.",
      "Contact the relevant student affairs office if your family circumstances need explanation.",
    ],
  },
];

export function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<
    (typeof newsArticles)[number] | null
  >(null);

  const showArticle = (article: (typeof newsArticles)[number]) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showList = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredArticles = newsArticles.filter((article) =>
    matchesSearch(searchQuery, [
      article.title,
      article.excerpt,
      article.category,
      article.date,
      article.readTime,
      article.highlights,
      article.sections.map((section) => [section.heading, section.body]),
      article.nextSteps,
    ]),
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[rgba(13,4,4,0)]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Latest News & Updates
        </h1>
        <p className="text-slate-600">
          Stay informed about new scholarship opportunities and important
          updates
        </p>
      </div>

      <Card className="p-4 mb-8 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search news by title, category, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-6 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear news search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>

      {filteredArticles.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No news found
          </h3>
          <p className="text-slate-600 mb-4">
            Try a different keyword or clear the search.
          </p>
          <Button
            onClick={() => setSearchQuery("")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Clear Search
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow bg-[rgba(15,98,231,0.22)]">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                    {article.category}
                  </Badge>
                </div>

                <div className="p-5 flex-1 flex flex-col bg-[rgba(0,0,0,0.06)]">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {new Date(article.date).toLocaleDateString("en-GB")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {article.readTime}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => showArticle(article)}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {selectedArticle && (
        <ContentDetailPage
          backLabel="Back to News"
          contentType="News Update"
          title={selectedArticle.title}
          excerpt={selectedArticle.excerpt}
          category={selectedArticle.category}
          date={selectedArticle.date}
          readTime={selectedArticle.readTime}
          imageUrl={selectedArticle.image}
          highlights={selectedArticle.highlights}
          sections={selectedArticle.sections}
          nextSteps={selectedArticle.nextSteps}
          onBack={showList}
        />
      )}
    </div>
  );
}
