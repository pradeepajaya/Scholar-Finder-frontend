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
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to Preparing Your Scholarship Application",
    excerpt:
      "A comprehensive step-by-step guide covering everything from choosing the right scholarship to submitting a winning application.",
    content: "Full guide content would go here...",
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
    content: "Full content...",
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
    content: "Full content...",
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
    content: "Full content...",
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
    content: "Full content...",
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
    content: "Full content...",
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
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

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
                      className={`w-full bg-gradient-to-r ${categoryColors[post.category]?.gradient} hover:opacity-90 text-white shadow-md`}
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
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
    </div>
  );
}
