import { useEffect, useMemo, useState } from "react";
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
import { contentApi, NewsRequest, BlogPostRequest } from "../../services/api";
import { Switch } from "../ui/switch";

interface ContentItem {
  id: number;
  title: string;
  type: "news" | "blog";
  author: string;
  publishedDate: string;
  status: "published" | "draft" | "archived";
  views: number;
  summary: string;
  content: string;
  featuredImage?: string;
  imageCaption?: string;
  imageAlt?: string;
  documentUrl?: string;
  sourceName?: string;
  authorBio?: string;
  authorAvatar?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  allowComments?: boolean;
}

const normalizeStatus = (status?: string): ContentItem["status"] => {
  const normalized = status?.toLowerCase();
  if (normalized === "published" || normalized === "archived") {
    return normalized;
  }
  return "draft";
};

export function AdminContent() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState<ContentItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [draftItem, setDraftItem] = useState<ContentItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ContentItem | null>(null);

  const [filterType, setFilterType] = useState<"all" | "news" | "blog">("all");

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const [newsRes, blogsRes] = await Promise.all([
        contentApi.getAllNews(0, 100),
        contentApi.getAllBlogPosts(0, 100)
      ]);

      const newsItems: ContentItem[] = newsRes.data?.content?.map(news => ({
        id: news.id,
        title: news.title,
        type: "news",
        author: news.authorName || "Admin User",
        publishedDate: news.publishedAt || news.createdAt || "",
        status: normalizeStatus(news.status),
        views: news.viewsCount || 0,
        summary: news.summary || "",
        content: news.content || "",
        featuredImage: news.featuredImage || "",
        imageCaption: news.imageCaption || "",
        documentUrl: news.sourceUrl || "",
        sourceName: news.sourceName || "",
        metaTitle: news.metaTitle || "",
        metaDescription: news.metaDescription || "",
        isFeatured: Boolean(news.isFeatured),
        isBreaking: Boolean(news.isBreaking),
      })) || [];

      const blogItems: ContentItem[] = blogsRes.data?.content?.map(blog => ({
        id: blog.id,
        title: blog.title,
        type: "blog",
        author: blog.authorName || "Admin User",
        publishedDate: blog.publishedAt || blog.createdAt || "",
        status: normalizeStatus(blog.status),
        views: blog.viewsCount || 0,
        summary: blog.excerpt || "",
        content: blog.content || "",
        featuredImage: blog.featuredImage || "",
        imageAlt: blog.imageAlt || "",
        documentUrl: "",
        authorBio: blog.authorBio || "",
        authorAvatar: blog.authorAvatar || "",
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
        metaKeywords: blog.metaKeywords || "",
        isFeatured: Boolean(blog.isFeatured),
        allowComments: blog.allowComments ?? true,
      })) || [];

      setContentItems([...newsItems, ...blogItems].sort((a, b) => 
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      ));
    } catch (error) {
      console.error("Failed to fetch content", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

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
      featuredImage: "",
      imageCaption: "",
      imageAlt: "",
      documentUrl: "",
      sourceName: "",
      authorBio: "",
      authorAvatar: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      isFeatured: false,
      isBreaking: false,
      allowComments: true,
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

  const handleSave = async () => {
    if (!draftItem) return;

    try {
      let savedId = draftItem.id;

      if (draftItem.type === "news") {
        const req: NewsRequest = {
          title: draftItem.title,
          summary: draftItem.summary,
          content: draftItem.content,
          featuredImage: draftItem.featuredImage,
          imageCaption: draftItem.imageCaption,
          authorName: draftItem.author,
          metaTitle: draftItem.metaTitle,
          metaDescription: draftItem.metaDescription,
          isFeatured: draftItem.isFeatured,
          isBreaking: draftItem.isBreaking,
          sourceName: draftItem.sourceName,
          sourceUrl: draftItem.documentUrl,
        };
        
        if (draftItem.id === 0) {
          const res = await contentApi.createNews(req);
          if (res.data) savedId = res.data.id;
        } else {
          await contentApi.updateNews(draftItem.id, req);
        }

        if (savedId > 0) {
           if (draftItem.status === "published") {
             await contentApi.publishNews(savedId);
           } else if (draftItem.status === "archived") {
             await contentApi.archiveNews(savedId);
           } else {
             await contentApi.draftNews(savedId);
           }
        }
      } else {
        const req: BlogPostRequest = {
          title: draftItem.title,
          excerpt: draftItem.summary,
          content: draftItem.content,
          featuredImage: draftItem.featuredImage,
          imageAlt: draftItem.imageAlt,
          authorName: draftItem.author,
          authorBio: draftItem.authorBio,
          authorAvatar: draftItem.authorAvatar,
          metaTitle: draftItem.metaTitle,
          metaDescription: draftItem.metaDescription,
          metaKeywords: draftItem.metaKeywords,
          isFeatured: draftItem.isFeatured,
          allowComments: draftItem.allowComments,
        };

        if (draftItem.id === 0) {
          const res = await contentApi.createBlogPost(req);
          if (res.data) savedId = res.data.id;
        } else {
          await contentApi.updateBlogPost(draftItem.id, req);
        }

        if (savedId > 0) {
           if (draftItem.status === "published") {
             await contentApi.publishBlogPost(savedId);
           } else if (draftItem.status === "archived") {
             await contentApi.archiveBlogPost(savedId);
           } else {
             await contentApi.draftBlogPost(savedId);
           }
        }
      }

      setIsEditOpen(false);
      setDraftItem(null);
      fetchContent();
    } catch (error) {
      console.error("Failed to save content", error);
      alert("Failed to save content. Please check the console for details.");
    }
  };

  const handleDelete = (item: ContentItem) => {
    setDeleteItem(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      if (deleteItem.type === "news") {
        await contentApi.deleteNews(deleteItem.id);
      } else {
        await contentApi.deleteBlogPost(deleteItem.id);
      }
      setIsDeleteOpen(false);
      setDeleteItem(null);
      fetchContent();
    } catch (error) {
      console.error("Failed to delete content", error);
      alert("Failed to delete content.");
    }
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

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Content List */}
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <Card key={`${item.type}-${item.id}`} className="p-6 hover:shadow-md transition-shadow">
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
                              : item.status === "draft"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-orange-100 text-orange-700"
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
                            {item.publishedDate ? new Date(item.publishedDate).toLocaleDateString() : 'N/A'}
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
        </>
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
                    disabled={draftItem.id !== 0}
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
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Published Date (Auto-generated)
                  </label>
                  <Input
                    type="text"
                    value={draftItem.publishedDate ? new Date(draftItem.publishedDate).toLocaleDateString() : ''}
                    disabled
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Featured Image URL
                  </label>
                  <Input
                    value={draftItem.featuredImage ?? ""}
                    onChange={(event) =>
                      updateDraft({ featuredImage: event.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Image Description
                  </label>
                  <Input
                    value={
                      draftItem.type === "news"
                        ? draftItem.imageCaption ?? ""
                        : draftItem.imageAlt ?? ""
                    }
                    onChange={(event) =>
                      draftItem.type === "news"
                        ? updateDraft({ imageCaption: event.target.value })
                        : updateDraft({ imageAlt: event.target.value })
                    }
                    placeholder="Short image description"
                  />
                </div>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                  <span className="text-sm font-medium text-slate-700">
                    Featured
                  </span>
                  <Switch
                    checked={Boolean(draftItem.isFeatured)}
                    onCheckedChange={(checked: boolean) =>
                      updateDraft({ isFeatured: checked })
                    }
                  />
                </label>
                {draftItem.type === "news" ? (
                  <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <span className="text-sm font-medium text-slate-700">
                      Breaking News
                    </span>
                    <Switch
                      checked={Boolean(draftItem.isBreaking)}
                      onCheckedChange={(checked: boolean) =>
                        updateDraft({ isBreaking: checked })
                      }
                    />
                  </label>
                ) : (
                  <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <span className="text-sm font-medium text-slate-700">
                      Comments
                    </span>
                    <Switch
                      checked={draftItem.allowComments ?? true}
                      onCheckedChange={(checked: boolean) =>
                        updateDraft({ allowComments: checked })
                      }
                    />
                  </label>
                )}
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
