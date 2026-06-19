import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Calendar,
  BookOpen,
  ArrowRight,
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
import { contentApi, BlogPostDto } from "../services/api";

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
  Default: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    gradient: "from-slate-500 to-gray-500",
  }
};

export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPostDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPostDto | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await contentApi.getBlogPosts(0, 100);
        setBlogPosts(response.data.content);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const showPost = (post: BlogPostDto) => {
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
      post.authorName,
      post.category?.name,
    ]),
  );
  
  const featuredPosts = filteredPosts.filter((post) => post.isFeatured);
  const regularPosts = filteredPosts.filter((post) => !post.isFeatured);

  const getCategoryColor = (categoryName?: string) => {
    if (categoryName && categoryColors[categoryName]) {
      return categoryColors[categoryName];
    }
    return categoryColors["Default"];
  };

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

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
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
                {featuredPosts.map((post, index) => {
                  const colors = getCategoryColor(post.category?.name);
                  return (
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
                          src={post.featuredImage || "https://images.unsplash.com/photo-1645027718562-54414cd86f5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwYmxvZyUyMGxhcHRvcHxlbnwxfHx8fDE3Njg3NDk4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080"}
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
                            className={`${colors.bg} ${colors.text} border-0`}
                          >
                            {post.category?.name || "Blog"}
                          </Badge>
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col h-[calc(100%-14rem)]">
                        {/* Excerpt */}
                        <p className="text-slate-600 mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>

                        {/* Author & Meta Info */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                              <AvatarImage
                                src={post.authorAvatar}
                                alt={post.authorName}
                              />
                              <AvatarFallback>{(post.authorName || "A")[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {post.authorName || "Author"}
                              </p>
                              <div className="flex items-center text-xs text-slate-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>{post.readingTime ? `${post.readingTime} min` : "5 min"}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <Button
                          type="button"
                          className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-md`}
                          onClick={() => showPost(post)}
                        >
                          Read Full Article
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )})}
              </div>
            </div>
          )}

          {/* Regular Posts - Card Grid */}
          {regularPosts.length > 0 && (
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
                {regularPosts.map((post, index) => {
                  const colors = getCategoryColor(post.category?.name);
                  return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border hover:border-slate-300">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={post.featuredImage || "https://images.unsplash.com/photo-1752920299210-0b727800ea50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBib29rc3xlbnwxfHx8fDE3Njg3MjY4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute bottom-3 left-3">
                          <Badge
                            className={`${colors.bg} ${colors.text} border-0 shadow-md`}
                          >
                            {post.category?.name || "Blog"}
                          </Badge>
                        </div>

                        {/* Read Time */}
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
                          <div className="flex items-center gap-1 text-xs text-white">
                            <Clock className="w-3 h-3" />
                            <span>{post.readingTime ? `${post.readingTime} min` : "5 min"}</span>
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
                              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                              <AvatarFallback>{(post.authorName || "A")[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-medium text-slate-900">
                                {post.authorName || "Author"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString("en-GB", {
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
                )})}
              </div>
            </div>
          )}
        </>
      )}

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
          category={selectedPost.category?.name || "Blog"}
          date={selectedPost.publishedAt || selectedPost.createdAt || new Date().toISOString()}
          readTime={selectedPost.readingTime ? `${selectedPost.readingTime} min` : "5 min"}
          imageUrl={selectedPost.featuredImage || "https://images.unsplash.com/photo-1645027718562-54414cd86f5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwYmxvZyUyMGxhcHRvcHxlbnwxfHx8fDE3Njg3NDk4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080"}
          highlights={[]}
          sections={[{ heading: "Article Content", body: (selectedPost.content || "").split("\n") }]}
          nextSteps={[]}
          author={{
            name: selectedPost.authorName || "Author",
            imageUrl: selectedPost.authorAvatar || "",
          }}
          onBack={showList}
        />
      )}
    </div>
  );
}
