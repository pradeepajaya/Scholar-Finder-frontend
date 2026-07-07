import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Award,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  Mail,
  RefreshCw,
  Star,
  User,
  XCircle,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { contentApi, TestimonialDto } from "../../services/api";

type StoryFilter = "all" | "pending" | "published" | "rejected";

const filterLabels: Record<StoryFilter, string> = {
  all: "All",
  pending: "Pending",
  published: "Approved",
  rejected: "Rejected",
};

interface AdminSuccessStoriesProps {
  focusStoryId?: number | null;
  onReviewChange?: () => void;
}

export function AdminSuccessStories({
  focusStoryId,
  onReviewChange,
}: AdminSuccessStoriesProps) {
  const [stories, setStories] = useState<TestimonialDto[]>([]);
  const [filter, setFilter] = useState<StoryFilter>("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [rejectStory, setRejectStory] = useState<TestimonialDto | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const response = await contentApi.getAllTestimonials();
      setStories(response.data ?? []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load success stories",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    if (focusStoryId) {
      setFilter("all");
    }
  }, [focusStoryId]);

  const counts = useMemo(
    () => ({
      all: stories.length,
      pending: stories.filter((story) => normalizeStatus(story.status) === "pending").length,
      published: stories.filter((story) => normalizeStatus(story.status) === "published").length,
      rejected: stories.filter((story) => normalizeStatus(story.status) === "rejected").length,
    }),
    [stories],
  );

  const filteredStories = useMemo(
    () =>
      stories.filter(
        (story) => filter === "all" || normalizeStatus(story.status) === filter,
      ),
    [filter, stories],
  );

  const pendingStories = useMemo(
    () => stories.filter((story) => normalizeStatus(story.status) === "pending"),
    [stories],
  );

  const handleApprove = async (story: TestimonialDto) => {
    setActionId(story.id);
    try {
      const response = await contentApi.approveTestimonial(story.id, {
        reviewedBy: "Admin",
      });
      setStories((current) =>
        current.map((item) => (item.id === story.id ? response.data : item)),
      );
      onReviewChange?.();
      toast.success("Success story accepted and published");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to approve success story",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectStory) {
      return;
    }
    if (!rejectionReason.trim()) {
      toast.error("Please add a rejection reason before sending the email");
      return;
    }

    setActionId(rejectStory.id);
    try {
      const response = await contentApi.rejectTestimonial(rejectStory.id, {
        rejectionReason: rejectionReason.trim(),
        reviewedBy: "Admin",
      });
      setStories((current) =>
        current.map((item) =>
          item.id === rejectStory.id ? response.data : item,
        ),
      );
      onReviewChange?.();
      toast.success("Success story rejected and email notification requested");
      setRejectStory(null);
      setRejectionReason("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reject success story",
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Success Story Reviews
          </h2>
          <p className="text-slate-600">
            Review student success stories before they appear publicly.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadStories}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Award className="h-5 w-5 text-amber-700" />
              <h3 className="font-semibold text-slate-900">
                Pending Review Queue
              </h3>
              <Badge className="bg-amber-100 text-amber-800">
                {pendingStories.length} Waiting
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              These stories are waiting for admin acceptance before becoming visible to students.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-amber-300 bg-white"
            onClick={loadStories}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Queue
          </Button>
        </div>

        {pendingStories.length === 0 ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-white p-4 text-sm text-slate-600">
            No success stories are currently waiting for acceptance.
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {pendingStories.map((story) => {
              const isBusy = actionId === story.id;

              return (
                <div
                  key={story.id}
                  className="flex flex-col gap-4 rounded-lg border border-amber-200 bg-white p-4 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {story.isAnonymous
                          ? "Anonymous Scholar"
                          : story.scholarName || "Scholar"}
                      </p>
                      <StoryStatusBadge status="pending" />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {story.scholarshipName}
                      {story.university ? ` - ${story.university}` : ""}
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">
                      {story.testimonialText}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                    <button
                      type="button"
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isBusy}
                      onClick={() => handleApprove(story)}
                    >
                      {isBusy ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Accept Story
                    </button>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      disabled={isBusy}
                      onClick={() => {
                        setRejectStory(story);
                        setRejectionReason("");
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-3">
        {(["pending", "published", "rejected", "all"] as StoryFilter[]).map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                filter === status
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filterLabels[status]}
              <span className="ml-2 font-semibold">({counts[status]})</span>
            </button>
          ),
        )}
      </div>

      {isLoading ? (
        <Card className="p-12">
          <div className="flex items-center justify-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            Loading success stories...
          </div>
        </Card>
      ) : filteredStories.length === 0 ? (
        <Card className="p-12 text-center">
          <Award className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <h3 className="mb-1 text-lg font-semibold text-slate-900">
            No success stories found
          </h3>
          <p className="text-slate-600">
            New submissions will appear here for admin review.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredStories.map((story) => {
            const status = normalizeStatus(story.status);
            const isPending = status === "pending";
            const isBusy = actionId === story.id;
            const isFocused = focusStoryId === story.id;

            return (
              <Card
                key={story.id}
                className={`p-6 ${isFocused ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {story.isAnonymous
                              ? "Anonymous Scholar"
                              : story.scholarName || "Scholar"}
                          </h3>
                          <StoryStatusBadge status={status} />
                          {story.isAnonymous && (
                            <Badge className="bg-amber-100 text-amber-800">
                              Anonymous public display
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                          {story.submitterEmail && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {story.submitterEmail}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(story.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <InfoTile
                        icon={<Award className="h-4 w-4" />}
                        label="Scholarship"
                        value={story.scholarshipName}
                      />
                      <InfoTile
                        icon={<GraduationCap className="h-4 w-4" />}
                        label="University"
                        value={story.university || "Not provided"}
                      />
                      <InfoTile
                        icon={<Star className="h-4 w-4" />}
                        label="Field / Year"
                        value={[
                          story.fieldOfStudy,
                          story.yearCompleted,
                        ]
                          .filter(Boolean)
                          .join(" - ") || "Not provided"}
                      />
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {story.testimonialText}
                      </p>
                    </div>

                    {status === "rejected" && story.rejectionReason && (
                      <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-800">
                        <span className="font-semibold">Rejection reason:</span>{" "}
                        {story.rejectionReason}
                      </div>
                    )}

                    {isPending && (
                      <div className="flex flex-col gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-emerald-900">
                            Ready for admin decision
                          </p>
                          <p className="text-sm text-emerald-800">
                            Accepting publishes this success story to the student page.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isBusy}
                            onClick={() => handleApprove(story)}
                          >
                            {isBusy ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                            )}
                            Accept Story
                          </button>
                          <Button
                            variant="outline"
                            className="border-red-200 bg-white text-red-700 hover:bg-red-50"
                            disabled={isBusy}
                            onClick={() => {
                              setRejectStory(story);
                              setRejectionReason("");
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 lg:flex-col">
                    <button
                      type="button"
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={!isPending || isBusy}
                      onClick={() => handleApprove(story)}
                    >
                      {isBusy ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Accept Story
                    </button>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      disabled={!isPending || isBusy}
                      onClick={() => {
                        setRejectStory(story);
                        setRejectionReason("");
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={!!rejectStory}
        onOpenChange={(open) => {
          if (!open) {
            setRejectStory(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Success Story</DialogTitle>
            <DialogDescription>
              The submitter will receive an email with this reason.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="rejectionReason">Rejection reason</Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Explain what the student should change before resubmitting..."
              className="min-h-32"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectStory(null);
                setRejectionReason("");
              }}
              disabled={actionId === rejectStory?.id}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleReject}
              disabled={actionId === rejectStory?.id}
            >
              {actionId === rejectStory?.id && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reject and Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StoryStatusBadge({ status }: { status: StoryFilter }) {
  if (status === "published") {
    return <Badge className="bg-emerald-100 text-emerald-700">APPROVED</Badge>;
  }
  if (status === "rejected") {
    return <Badge className="bg-red-100 text-red-700">REJECTED</Badge>;
  }
  if (status === "pending") {
    return <Badge className="bg-amber-100 text-amber-700">PENDING</Badge>;
  }
  return <Badge className="bg-slate-100 text-slate-700">UNKNOWN</Badge>;
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function normalizeStatus(status?: string): StoryFilter {
  const normalized = status?.trim().toLowerCase();
  if (
    normalized === "pending" ||
    normalized === "published" ||
    normalized === "rejected"
  ) {
    return normalized;
  }
  if (normalized === "approved") {
    return "published";
  }
  return "all";
}

function formatDate(value?: string) {
  if (!value) {
    return "Just now";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
