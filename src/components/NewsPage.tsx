import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
  },
];

export function NewsPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((article, index) => (
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

                <Button variant="outline" className="w-full">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
