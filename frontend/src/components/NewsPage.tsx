import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, ArrowRight, Search, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { ContentDetailPage } from "./ContentDetailPage";
import { matchesSearch } from "@/utils/search";
import { contentApi, NewsDto } from "../services/api";

export function NewsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsDto | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await contentApi.getNews(0, 100);
        setNewsArticles(response.data.content);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const showArticle = (article: NewsDto) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showList = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredArticles = useMemo(
    () =>
      newsArticles.filter((article) =>
        matchesSearch(searchQuery, [
          article.title,
          article.summary,
          article.category?.name || "News",
        ]),
      ),
    [newsArticles, searchQuery],
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

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredArticles.length === 0 ? (
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
              transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.18) }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow bg-[rgba(15,98,231,0.22)]">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={article.featuredImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                    {article.category?.name || "News Update"}
                  </Badge>
                </div>

                <div className="p-5 flex-1 flex flex-col bg-[rgba(0,0,0,0.06)]">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {article.viewsCount ? `${article.viewsCount} views` : "3 min read"}
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
          excerpt={selectedArticle.summary || ""}
          category={selectedArticle.category?.name || "News Update"}
          date={selectedArticle.publishedAt || new Date().toISOString()}
          readTime={selectedArticle.viewsCount ? `${selectedArticle.viewsCount} views` : "3 min read"}
          imageUrl={selectedArticle.featuredImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"}
          highlights={[]}
          sections={[{ heading: "Article Content", body: (selectedArticle.content || "").split("\n") }]}
          nextSteps={[]}
          onBack={showList}
        />
      )}
    </div>
  );
}
