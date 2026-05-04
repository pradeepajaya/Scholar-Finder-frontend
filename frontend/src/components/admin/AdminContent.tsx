import { useMemo, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  FileText,
  Newspaper,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
} from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  type: "news" | "blog";
  author: string;
  publishedDate: string;
  status: "published" | "draft";
  views: number;
  summary: string;
  content: string;
  documentUrl?: string;
}

const initialContent: ContentItem[] = [
  {
    id: 1,
    title: "New Scholarship Opportunities for 2026",
    type: "news",
    author: "Admin User",
    publishedDate: "2026-01-15",
    status: "published",
    views: 1245,
    summary:
      "A roundup of new scholarships opening in 2026 with key deadlines and eligibility.",
    content:
      "This update highlights new scholarship opportunities for local and international students. It includes application windows, required documents, and official announcement links. Review eligibility carefully and submit early.",
    documentUrl: "https://example.com/docs/scholarship-opportunities-2026.pdf",
  },
  {
    id: 2,
    title: "How to Write a Winning Scholarship Application",
    type: "blog",
    author: "Admin User",
    publishedDate: "2026-01-12",
    status: "published",
    views: 987,
    summary:
      "Practical tips for writing personal statements, organizing documents, and meeting deadlines.",
    content:
      "Strong applications focus on clarity, evidence, and alignment with scholarship goals. This guide covers structuring a personal statement, collecting recommendations, and avoiding common mistakes.",
  },
  {
    id: 3,
    title: "Tips for A/L Students Seeking Higher Education",
    type: "blog",
    author: "Admin User",
    publishedDate: "2026-01-10",
    status: "published",
    views: 1532,
    summary:
      "Planning advice for A/L students preparing applications and selecting programs.",
    content:
      "Start early by mapping application calendars, shortlisting programs, and preparing documents. Keep a checklist of transcripts, exam results, and ID documents.",
  },
  {
    id: 4,
    title: "Upcoming Scholarship Deadlines",
    type: "news",
    author: "Admin User",
    publishedDate: "2026-01-08",
    status: "draft",
    views: 0,
    summary:
      "Draft list of upcoming scholarship deadlines for the next quarter.",
    content:
      "This draft compiles upcoming deadlines by region and field of study. Verify dates against official sources before publishing.",
  },
];

export function AdminContent() {
  const [contentItems, setContentItems] =
    useState<ContentItem[]>(initialContent);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState<ContentItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [draftItem, setDraftItem] = useState<ContentItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ContentItem | null>(null);

  const [filterType, setFilterType] = useState<"all" | "news" | "blog">("all");

  const filteredContent = useMemo(
    () =>
      contentItems.filter(
        (item) => filterType === "all" || item.type === filterType,
      ),
    [contentItems, filterType],
  );

  const typeCounts = useMemo(
    () => ({
      all: contentItems.length,
      news: contentItems.filter((c) => c.type === "news").length,
      blog: contentItems.filter((c) => c.type === "blog").length,
    }),
    [contentItems],
  );

  const handleView = (item: ContentItem) => {
    setViewItem(item);
    setIsViewOpen(true);
  };

  const handleCreate = () => {
    setDraftItem({
      id: 0,
      title: "",
      type: "news",
      author: "Admin User",
      publishedDate: "",
      status: "draft",
      views: 0,
      summary: "",
      content: "",
      documentUrl: "",
    });
    setIsEditOpen(true);
  };

  const handleEdit = (item: ContentItem) => {
    setDraftItem({ ...item });
    setIsEditOpen(true);
  };

  const updateDraft = (patch: Partial<ContentItem>) => {
    setDraftItem((current) => (current ? { ...current, ...patch } : current));
  };

  const handleSave = () => {
    if (!draftItem) return;

    setContentItems((items) => {
      if (draftItem.id === 0) {
        const nextId = items.length
          ? Math.max(...items.map((item) => item.id)) + 1
          : 1;
        return [...items, { ...draftItem, id: nextId }];
      }
      return items.map((item) => (item.id === draftItem.id ? draftItem : item));
    });

    setIsEditOpen(false);
    setDraftItem(null);
  };

  const handleDelete = (item: ContentItem) => {
    setDeleteItem(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    setContentItems((items) =>
      items.filter((item) => item.id !== deleteItem.id),
    );
    setIsDeleteOpen(false);
    setDeleteItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Content Management
          </h2>
          <p className="text-slate-600">Manage news articles and blog posts</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Type Filters */}
      <div className="flex gap-3">
        {(["all", "news", "blog"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filterType === type
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            <span className="ml-2 font-semibold">({typeCounts[type]})</span>
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.map((item) => (
          <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <button
                  type="button"
                  onClick={() => handleView(item)}
                  className={`p-3 rounded-lg transition-colors hover:opacity-90 ${
                    item.type === "news" ? "bg-blue-100" : "bg-purple-100"
                  }`}
                  aria-label={`View ${item.type} document`}
                  title="View document"
                >
                  {item.type === "news" ? (
                    <Newspaper className="w-6 h-6 text-blue-600" />
                  ) : (
                    <FileText className="w-6 h-6 text-purple-600" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <Badge
                      className={
                        item.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>By {item.author}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(item.publishedDate).toLocaleDateString()}
                      </span>
                    </div>
                    {item.status === "published" && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views} views</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(item)}
                  aria-label="View content"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  aria-label="Edit content"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(item)}
                  aria-label="Delete content"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            No Content Found
          </h3>
          <p className="text-slate-600">
            Create your first article or blog post
          </p>
        </Card>
      )}

      <Dialog
        open={isViewOpen}
        onOpenChange={(open: boolean) => {
          setIsViewOpen(open);
          if (!open) setViewItem(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {viewItem && (
            <>
              <DialogHeader>
                <DialogTitle>{viewItem.title}</DialogTitle>
                <DialogDescription>{viewItem.summary}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <Badge
                    className={
                      viewItem.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }
                  >
                    {viewItem.status.toUpperCase()}
                  </Badge>
                  <span>By {viewItem.author}</span>
                  {viewItem.publishedDate && (
                    <span>
                      {new Date(viewItem.publishedDate).toLocaleDateString()}
                    </span>
                  )}
                  {viewItem.status === "published" && (
                    <span>{viewItem.views} views</span>
                  )}
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                  {viewItem.content}
                </div>
              </div>
              <DialogFooter>
                {viewItem.documentUrl && (
                  <Button asChild variant="outline">
                    <a
                      href={viewItem.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Document
                    </a>
                  </Button>
                )}
                <Button onClick={() => setIsViewOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open: boolean) => {
          setIsEditOpen(open);
          if (!open) setDraftItem(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {draftItem?.id === 0 ? "Create Content" : "Edit Content"}
            </DialogTitle>
            <DialogDescription>
              Update details, content, and document links.
            </DialogDescription>
          </DialogHeader>
          {draftItem && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <Input
                    value={draftItem.title}
                    onChange={(event) =>
                      updateDraft({ title: event.target.value })
                    }
                    placeholder="Enter title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Author
                  </label>
                  <Input
                    value={draftItem.author}
                    onChange={(event) =>
                      updateDraft({ author: event.target.value })
                    }
                    placeholder="Author name"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <Select
                    value={draftItem.type}
                    onValueChange={(value: string) =>
                      updateDraft({ type: value as ContentItem["type"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <Select
                    value={draftItem.status}
                    onValueChange={(value: string) =>
                      updateDraft({ status: value as ContentItem["status"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Published Date
                  </label>
                  <Input
                    type="date"
                    value={draftItem.publishedDate}
                    onChange={(event) =>
                      updateDraft({ publishedDate: event.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Views
                  </label>
                  <Input type="number" value={draftItem.views} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Summary
                </label>
                <Textarea
                  value={draftItem.summary}
                  onChange={(event) =>
                    updateDraft({ summary: event.target.value })
                  }
                  placeholder="Short summary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Content
                </label>
                <Textarea
                  value={draftItem.content}
                  onChange={(event) =>
                    updateDraft({ content: event.target.value })
                  }
                  placeholder="Full document content"
                  className="min-h-36"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Document URL
                </label>
                <Input
                  value={draftItem.documentUrl ?? ""}
                  onChange={(event) =>
                    updateDraft({ documentUrl: event.target.value })
                  }
                  placeholder="https://example.com/document.pdf"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={(open: boolean) => {
          setIsDeleteOpen(open);
          if (!open) setDeleteItem(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete content</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
