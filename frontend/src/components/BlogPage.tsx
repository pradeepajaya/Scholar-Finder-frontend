import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  Clock,
  TrendingUp,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { ContentDetailPage } from "./ContentDetailPage";
import { matchesSearch } from "@/utils/search";

const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to Preparing Your Scholarship Application",
    excerpt:
      "A comprehensive step-by-step guide covering everything from choosing the right scholarship to submitting a winning application.",
    content:
      "A strong scholarship application is built through planning, evidence, and a clear story about your goals.",
    highlights: [
      "Start by matching your academic background with scholarships that fit your level, country, and field.",
      "Build a document checklist early so transcripts, references, and test results do not delay you.",
      "Use your essays to connect past preparation with future impact.",
    ],
    sections: [
      {
        heading: "Choose the right scholarships first",
        body: [
          "Many students lose time applying for awards that do not match their qualifications. Before writing essays, check the study level, eligible countries, subject areas, age limits, work experience requirements, and language rules.",
          "Create a short priority list instead of applying everywhere. A focused list lets you customize each application and gives you a better chance of sounding specific and prepared.",
        ],
      },
      {
        heading: "Prepare your evidence",
        body: [
          "Scholarship committees need proof. Keep scanned copies of transcripts, certificates, identity documents, awards, volunteering records, and work experience letters in one folder.",
          "Ask referees early and give them your CV, target scholarship, draft goals, and deadline. A detailed referee is much more helpful than a last-minute generic letter.",
        ],
      },
      {
        heading: "Write with a clear story",
        body: [
          "Your application should explain where you are coming from, what you want to study, why that path matters, and how you will use the opportunity. Every paragraph should support that story.",
          "After drafting, remove repeated claims and replace vague words with examples. Specific evidence makes the application more trustworthy.",
        ],
      },
    ],
    nextSteps: [
      "Create a spreadsheet with scholarship names, deadlines, documents, and status.",
      "Draft one core personal statement, then customize it for each opportunity.",
      "Schedule at least two review days before the final submission.",
    ],
    author: "Dr. Anura Perera",
    authorImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: "Guides",
    date: "2026-01-14",
    readTime: "10 min",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1645027718562-54414cd86f5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwYmxvZyUyMGxhcHRvcHxlbnwxfHx8fDE3Njg3NDk4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Understanding Z-Score Requirements for International Scholarships",
    excerpt:
      "How Sri Lankan A/L Z-scores are evaluated by international institutions and what you need to know.",
    content:
      "Z-scores help show academic standing, but international institutions may also review grades, course rigor, and admission context.",
    highlights: [
      "Z-scores are useful evidence, but they are usually reviewed alongside transcripts and grading explanations.",
      "Some universities may request converted grades or official explanations of the Sri Lankan A/L system.",
      "Strong subject performance can matter more than a single summary number for specialized degrees.",
    ],
    sections: [
      {
        heading: "How Z-scores are usually understood",
        body: [
          "A Z-score helps compare student performance within a subject stream. For international reviewers, it can be helpful when it is supported by official transcripts, rank information, or a grading scale explanation.",
          "Because each country uses different academic systems, universities may evaluate Sri Lankan results through their own admissions office or credential evaluation process.",
        ],
      },
      {
        heading: "What applicants should provide",
        body: [
          "If your scholarship or university asks for academic ranking, include official documents where possible. Do not estimate ranks or convert marks unless the application specifically asks you to do so.",
          "For STEM, medicine, economics, and other specialized fields, highlight the subjects most relevant to your intended degree.",
        ],
      },
      {
        heading: "How to explain your results",
        body: [
          "Use simple language in your application. Explain your subject stream, key grades, and how your academic results prepared you for the program.",
          "If you had a weaker result in one area, balance it with later achievements such as university grades, projects, research, or professional training.",
        ],
      },
    ],
    nextSteps: [
      "Request official transcripts and certified translations if needed.",
      "Check whether the university requires credential evaluation.",
      "Prepare a short academic explanation for applications that allow additional notes.",
    ],
    author: "Prof. Nimalka Fernando",
    authorImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Academic",
    date: "2026-01-11",
    readTime: "7 min",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1752920299210-0b727800ea50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBib29rc3xlbnwxfHx8fDE3Njg3MjY4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "Top 10 Mistakes in Scholarship Applications",
    excerpt:
      "Learn from common mistakes that lead to rejection and how to avoid them in your application.",
    content:
      "Most scholarship mistakes are avoidable when students plan early, read instructions carefully, and ask for feedback.",
    highlights: [
      "Generic essays, missing documents, and weak references are among the most common reasons applications fail.",
      "A strong application should answer the exact question asked, not reuse the same response everywhere.",
      "Final review matters because small errors can make an application look rushed.",
    ],
    sections: [
      {
        heading: "Mistakes that weaken strong students",
        body: [
          "Many capable students submit applications that feel too general. Reviewers need to see why you fit this specific scholarship, not just why you want financial support.",
          "Another common issue is poor evidence. Claims about leadership, service, or academic passion should be supported by examples, outcomes, or responsibilities.",
        ],
      },
      {
        heading: "Mistakes near the deadline",
        body: [
          "Late submissions often lead to missing attachments, file naming errors, incomplete forms, and rushed essays. These problems are easy to prevent with a checklist.",
          "Students should also avoid waiting for referees until the last week. Good recommendation letters take time and context.",
        ],
      },
      {
        heading: "How to review before submitting",
        body: [
          "Read every question again and check whether your answer responds directly. Then review document formats, word limits, names, dates, and contact details.",
          "Ask a trusted reader to summarize your application after reading it. If they cannot describe your goal clearly, the essay needs more focus.",
        ],
      },
    ],
    nextSteps: [
      "Make a final submission checklist for every scholarship.",
      "Customize the first and last paragraph of each essay for the specific award.",
      "Save proof of submission and copies of every uploaded document.",
    ],
    author: "Kasun Wijesinghe",
    authorImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    category: "Tips",
    date: "2026-01-09",
    readTime: "5 min",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1767647984803-af2b0e2d38d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHN1Y2Nlc3MlMjBhY2hpZXZlbWVudHxlbnwxfHx8fDE3Njg3NDk4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    title: "Navigating English Proficiency Tests: IELTS vs TOEFL",
    excerpt:
      "A detailed comparison to help you choose the right English proficiency test for your scholarship application.",
    content:
      "IELTS and TOEFL both prove English ability, but the better choice depends on your target country, university rules, and test style.",
    highlights: [
      "Always check the exact test and minimum score accepted by each university or scholarship.",
      "IELTS may feel more familiar to students who prefer a face-to-face speaking format.",
      "TOEFL can suit students who are comfortable with computer-based academic English tasks.",
    ],
    sections: [
      {
        heading: "Start with the requirement",
        body: [
          "The right test is the one your target institution accepts. Some universities accept both IELTS and TOEFL, while others list specific score bands for each section.",
          "Students should check whether the scholarship requires scores at application time or only after admission.",
        ],
      },
      {
        heading: "Compare the test experience",
        body: [
          "IELTS includes listening, reading, writing, and speaking. Many students choose it because the speaking test can feel like a direct interview.",
          "TOEFL is usually computer-based and often integrates skills, such as reading a passage and then speaking or writing about it. Students who like structured academic tasks may prefer this format.",
        ],
      },
      {
        heading: "Plan your preparation",
        body: [
          "Take a diagnostic test before booking the exam. This helps you identify whether your main challenge is vocabulary, timing, listening accuracy, speaking fluency, or essay structure.",
          "Leave enough time for a retake if your target scholarship is highly competitive or requires strong section scores.",
        ],
      },
    ],
    nextSteps: [
      "List the English score requirement for each target scholarship.",
      "Try one practice test for IELTS and one for TOEFL before choosing.",
      "Book the exam early enough to receive results before the deadline.",
    ],
    author: "Dilini Jayawardena",
    authorImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    category: "Preparation",
    date: "2026-01-06",
    readTime: "8 min",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwdGVzdCUyMGV4YW18ZW58MXx8fHwxNzY4NzQ5ODQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    title: "Life as a Scholarship Student Abroad: Real Experiences",
    excerpt:
      "Current scholarship recipients share their experiences studying abroad and tips for making the most of your opportunity.",
    content:
      "Studying abroad on a scholarship is exciting, but students succeed faster when they prepare for academic, financial, and cultural changes.",
    highlights: [
      "Scholarship students need to manage independence, budgeting, coursework, and homesickness at the same time.",
      "Building support networks early can make the transition smoother.",
      "The most successful students use the experience to grow academically and personally.",
    ],
    sections: [
      {
        heading: "The first few months",
        body: [
          "Most students describe the first semester as both inspiring and demanding. New teaching styles, different assessment methods, and independent living can feel overwhelming at first.",
          "The adjustment becomes easier when students attend orientation, meet academic advisors, and connect with other international students early.",
        ],
      },
      {
        heading: "Managing money and time",
        body: [
          "Even with scholarship support, budgeting matters. Rent, transport, winter clothing, books, and food can vary widely by city.",
          "Students should also protect study time. Part-time work, social activities, and travel are valuable, but coursework deadlines need steady attention.",
        ],
      },
      {
        heading: "Making the opportunity count",
        body: [
          "Scholarship life is not only about completing a degree. Students can join research groups, attend conferences, volunteer, and build professional networks.",
          "Keeping a simple record of projects, achievements, and lessons learned will help when applying for internships, jobs, or future study.",
        ],
      },
    ],
    nextSteps: [
      "Contact current students or alumni before departure.",
      "Prepare a monthly budget based on the city where you will study.",
      "Use university support services early instead of waiting until problems grow.",
    ],
    author: "Tharindu Madushanka",
    authorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    category: "Experience",
    date: "2026-01-04",
    readTime: "12 min",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1648301033733-44554c74ec50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcm5hdGlvbmFsJTIwc3R1ZGVudHMlMjBjYW1wdXN8ZW58MXx8fHwxNzY4NjkzOTE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 6,
    title: "How to Get Strong Recommendation Letters",
    excerpt:
      "Tips on approaching professors and mentors for recommendation letters that strengthen your application.",
    content:
      "Strong recommendation letters come from the right people, clear context, and enough time to write specific examples.",
    highlights: [
      "Choose referees who know your work well, not only people with impressive titles.",
      "Give referees your CV, goals, deadline, and scholarship details.",
      "A specific letter with examples is stronger than a general letter of praise.",
    ],
    sections: [
      {
        heading: "Choose the right referee",
        body: [
          "The best referee can describe your ability with evidence. This might be a lecturer, supervisor, research mentor, project advisor, or employer who has seen your work closely.",
          "If a famous professor barely knows you, the letter may be less useful than one from someone who can explain your strengths in detail.",
        ],
      },
      {
        heading: "Make the request easy to support",
        body: [
          "When asking, explain the scholarship, why you are applying, what the deadline is, and what qualities the letter should address.",
          "Attach your CV, transcript, draft personal statement, and a short list of achievements. This helps the referee write accurately.",
        ],
      },
      {
        heading: "Follow up professionally",
        body: [
          "Send a polite reminder before the deadline and thank the referee after submission. If you receive the scholarship, share the good news with them.",
          "Respect a referee's decision if they decline. A hesitant letter is rarely helpful.",
        ],
      },
    ],
    nextSteps: [
      "Identify two academic referees and one backup referee.",
      "Prepare a short referee information pack before making requests.",
      "Ask at least three weeks before the deadline whenever possible.",
    ],
    author: "Dr. Anura Perera",
    authorImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: "Tips",
    date: "2026-01-02",
    readTime: "6 min",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1518893560155-b89cac6db0c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNvbW1lbmRhdGlvbiUyMGxldHRlciUyMGRvY3VtZW50fGVufDF8fHx8MTc2ODc0OTg0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const categoryColors: Record<
  string,
  { bg: string; text: string; gradient: string }
> = {
  Guides: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    gradient: "from-blue-500 to-cyan-500",
  },
  Academic: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    gradient: "from-purple-500 to-pink-500",
  },
  Tips: {
    bg: "bg-green-100",
    text: "text-green-700",
    gradient: "from-green-500 to-emerald-500",
  },
  Preparation: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    gradient: "from-orange-500 to-amber-500",
  },
  Experience: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    gradient: "from-pink-500 to-rose-500",
  },
};

export function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<
    (typeof blogPosts)[number] | null
  >(null);

  const showPost = (post: (typeof blogPosts)[number]) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showList = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredPosts = blogPosts.filter((post) =>
    matchesSearch(searchQuery, [
      post.title,
      post.excerpt,
      post.content,
      post.author,
      post.category,
      post.date,
      post.readTime,
      post.highlights,
      post.sections.map((section) => [section.heading, section.body]),
      post.nextSteps,
    ]),
  );
  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">
            Expert Insights & Resources
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Blog & Learning Center
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Practical advice, expert tips, and inspiring stories to help you
          succeed in your scholarship journey
        </p>
      </div>

      <Card className="p-4 mb-10 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search articles by title, author, category, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-6 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear blog search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>

      {filteredPosts.length === 0 && (
        <Card className="p-12 text-center mb-16">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No articles found
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
      )}

      {/* Featured Posts - Hero Layout */}
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Featured Articles
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300">
                  {/* Image Header */}
                  <div className="relative h-56 overflow-hidden">
                    <ImageWithFallback
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        className={`${categoryColors[post.category]?.bg} ${categoryColors[post.category]?.text} border-0`}
                      >
                        {post.category}
                      </Badge>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Excerpt */}
                    <p className="text-slate-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Author & Meta Info */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                          <AvatarImage
                            src={post.authorImage}
                            alt={post.author}
                          />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {post.author}
                          </p>
                          <div className="flex items-center text-xs text-slate-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      type="button"
                      className={`w-full bg-gradient-to-r ${categoryColors[post.category]?.gradient} hover:opacity-90 text-white shadow-md`}
                      onClick={() => showPost(post)}
                    >
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts - Card Grid */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Latest Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border hover:border-slate-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge
                      className={`${categoryColors[post.category]?.bg} ${categoryColors[post.category]?.text} border-0 shadow-md`}
                    >
                      {post.category}
                    </Badge>
                  </div>

                  {/* Read Time */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
                    <div className="flex items-center gap-1 text-xs text-white">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Author & Date */}
                  <div className="flex items-center justify-between pt-4 border-t mt-auto">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.authorImage} alt={post.author} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-slate-900">
                          {post.author}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => showPost(post)}
                    >
                      Read
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="mt-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              Stay Updated
            </span>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Never Miss New Articles
          </h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest scholarship tips,
            application guides, and success stories delivered to your inbox
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-white font-semibold placeholder:text-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 shadow-lg">
              Subscribe
            </Button>
          </div>

          <p className="text-xs text-blue-200 mt-4">
            Join 5,000+ students already receiving weekly scholarship insights
          </p>
        </div>
      </div>

      {selectedPost && (
        <ContentDetailPage
          backLabel="Back to Blog"
          contentType="Blog Article"
          title={selectedPost.title}
          excerpt={selectedPost.excerpt}
          category={selectedPost.category}
          date={selectedPost.date}
          readTime={selectedPost.readTime}
          imageUrl={selectedPost.imageUrl}
          highlights={selectedPost.highlights}
          sections={selectedPost.sections}
          nextSteps={selectedPost.nextSteps}
          author={{
            name: selectedPost.author,
            imageUrl: selectedPost.authorImage,
          }}
          onBack={showList}
        />
      )}
    </div>
  );
}
