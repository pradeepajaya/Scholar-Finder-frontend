import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { GraduationCap, Mail, MapPin, Award } from "lucide-react";

interface ScholarCardProps {
  name: string;
  title: string;
  institution: string;
  location: string;
  imageUrl: string;
  specializations: string[];
  citations: number;
  hIndex: number;
  delay?: number;
}

export function ScholarCard({
  name,
  title,
  institution,
  location,
  imageUrl,
  specializations,
  citations,
  hIndex,
  delay = 0,
}: ScholarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-blue-700 hover:bg-white">
              <Award className="w-3 h-3 mr-1" />
              h-index: {hIndex}
            </Badge>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-slate-900 mb-1">{name}</h3>
          <p className="text-sm text-blue-600 mb-1 font-medium">{title}</p>

          <div className="flex items-center text-sm text-slate-600 mb-3">
            <GraduationCap className="w-4 h-4 mr-1.5 text-slate-400" />
            <span className="truncate">{institution}</span>
          </div>

          <div className="flex items-center text-sm text-slate-500 mb-4">
            <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
            <span>{location}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {specializations.map((spec, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {spec}
              </Badge>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <p className="text-sm text-slate-500">Citations</p>
                <p className="text-lg font-semibold text-slate-900">
                  {citations.toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-sm text-slate-500">h-index</p>
                <p className="text-lg font-semibold text-slate-900">{hIndex}</p>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Mail className="w-4 h-4 mr-2" />
              Contact Scholar
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
