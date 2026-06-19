import { useEffect } from "react";
import { Calendar, CheckCircle2, Clock, Lightbulb, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export type DetailSection = {
  heading: string;
  body: string[];
};

type ContentDetailPageProps = {
  backLabel: string;
  contentType: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  highlights: string[];
  sections: DetailSection[];
  nextSteps: string[];
  author?: {
    name: string;
    imageUrl: string;
  };
  onBack: () => void;
};

export function ContentDetailPage({
  backLabel,
  contentType,
  title,
  excerpt,
  category,
  date,
  readTime,
  imageUrl,
  highlights,
  sections,
  nextSteps,
  author,
  onBack,
}: ContentDetailPageProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onBack();
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onBack]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 top-16 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-detail-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onBack();
        }
      }}
    >
      <article
        className="relative w-full max-w-5xl overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 7rem)" }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="absolute right-3 top-3 z-10 h-10 w-10 rounded-full bg-white/90 p-0 text-slate-700 shadow-md hover:bg-white"
          aria-label={backLabel}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="relative min-h-[260px] flex-none overflow-hidden md:min-h-[340px]">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge className="bg-blue-600 text-white">{category}</Badge>
              <span className="rounded-md bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                {contentType}
              </span>
            </div>

            <h1
              id="content-detail-title"
              className="max-w-4xl text-2xl font-bold leading-tight text-white md:text-4xl"
            >
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-100 md:text-lg">
              {excerpt}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-100">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readTime}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10">
          {author && (
            <div className="mb-8 flex items-center gap-3 border-b border-slate-200 pb-6">
              <Avatar className="h-12 w-12 border border-slate-200">
                <AvatarImage src={author.imageUrl} alt={author.name} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-slate-500">Written by</p>
                <p className="font-semibold text-slate-900">{author.name}</p>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-lg border border-blue-100 bg-blue-50 p-4"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm leading-6 text-slate-700">{highlight}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold text-slate-900">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-8 text-slate-700"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-lg border border-emerald-200 bg-emerald-50 p-5 md:p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Lightbulb className="h-5 w-5 text-emerald-700" />
              Helpful next steps
            </h2>
            <ul className="mt-4 space-y-3">
              {nextSteps.map((step) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-700" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
            <Button
              type="button"
              onClick={onBack}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {backLabel}
            </Button>
          </div>
        </div>
      </article>
    </div>,
    document.body,
  );
}
