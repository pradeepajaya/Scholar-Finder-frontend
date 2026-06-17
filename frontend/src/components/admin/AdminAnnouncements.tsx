import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AnnouncementRecipientGroup,
  AnnouncementResponse,
  AudienceCountsResponse,
  notificationApi,
} from "../../services/api";

const audienceLabels: Record<AnnouncementRecipientGroup, string> = {
  ALL: "All users",
  STUDENTS: "Students",
  INSTITUTIONS: "Institutions",
  CUSTOM: "Custom emails",
};

export function AdminAnnouncements() {
  const [recipientGroup, setRecipientGroup] =
    useState<AnnouncementRecipientGroup>("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [customEmails, setCustomEmails] = useState("");
  const [counts, setCounts] = useState<AudienceCountsResponse | null>(null);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<AnnouncementResponse | null>(
    null,
  );

  const customRecipients = useMemo(
    () =>
      customEmails
        .split(/[\n,;]/)
        .map((email) => email.trim())
        .filter(Boolean),
    [customEmails],
  );

  const selectedCount = useMemo(() => {
    if (recipientGroup === "CUSTOM") {
      return customRecipients.length;
    }
    if (!counts) {
      return 0;
    }
    if (recipientGroup === "STUDENTS") {
      return counts.students;
    }
    if (recipientGroup === "INSTITUTIONS") {
      return counts.institutions;
    }
    return counts.all;
  }, [counts, customRecipients.length, recipientGroup]);

  const canSend =
    subject.trim().length > 0 &&
    message.trim().length > 0 &&
    selectedCount > 0 &&
    !isSending;

  useEffect(() => {
    let ignore = false;

    const loadCounts = async () => {
      setIsLoadingCounts(true);
      try {
        const response =
          await notificationApi.getAnnouncementAudienceCounts(verifiedOnly);
        if (!ignore) {
          setCounts(response.data);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load announcement audiences",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingCounts(false);
        }
      }
    };

    loadCounts();

    return () => {
      ignore = true;
    };
  }, [verifiedOnly]);

  const handleSend = async () => {
    if (!canSend) {
      return;
    }

    setIsSending(true);
    setLastResult(null);

    try {
      const response = await notificationApi.sendAnnouncement({
        recipientGroup,
        subject: subject.trim(),
        message: message.trim(),
        verifiedOnly,
        recipientEmails:
          recipientGroup === "CUSTOM" ? customRecipients : undefined,
      });

      setLastResult(response.data);

      if (!response.success || response.data.failedCount > 0) {
        toast.error(response.message || "Announcement completed with failures");
      } else {
        toast.success(response.message || "Announcement sent");
        setSubject("");
        setMessage("");
        setCustomEmails("");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send announcement",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Announcements
          </h2>
          <p className="text-slate-600">Send email announcements</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">
          {isLoadingCounts ? "Loading" : `${selectedCount} recipients`}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AudienceCard
          icon={Users}
          label="All users"
          count={counts?.all ?? 0}
          active={recipientGroup === "ALL"}
          onClick={() => setRecipientGroup("ALL")}
        />
        <AudienceCard
          icon={GraduationCap}
          label="Students"
          count={counts?.students ?? 0}
          active={recipientGroup === "STUDENTS"}
          onClick={() => setRecipientGroup("STUDENTS")}
        />
        <AudienceCard
          icon={Building2}
          label="Institutions"
          count={counts?.institutions ?? 0}
          active={recipientGroup === "INSTITUTIONS"}
          onClick={() => setRecipientGroup("INSTITUTIONS")}
        />
      </div>

      <Card className="p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recipientGroup">Audience</Label>
                <Select
                  value={recipientGroup}
                  onValueChange={(value) =>
                    setRecipientGroup(value as AnnouncementRecipientGroup)
                  }
                >
                  <SelectTrigger id="recipientGroup">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All users</SelectItem>
                    <SelectItem value="STUDENTS">Students</SelectItem>
                    <SelectItem value="INSTITUTIONS">Institutions</SelectItem>
                    <SelectItem value="CUSTOM">Custom emails</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  maxLength={255}
                  placeholder="Scholarship deadline update"
                />
              </div>
            </div>

            {recipientGroup !== "CUSTOM" && (
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <Checkbox
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                />
                <span className="text-sm font-medium text-slate-700">
                  Verified accounts only
                </span>
              </label>
            )}

            {recipientGroup === "CUSTOM" && (
              <div className="space-y-2">
                <Label htmlFor="customEmails">Recipient emails</Label>
                <Textarea
                  id="customEmails"
                  value={customEmails}
                  onChange={(event) => setCustomEmails(event.target.value)}
                  placeholder="first@example.com, second@example.com"
                  className="min-h-28"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={10000}
                placeholder="Write the announcement email..."
                className="min-h-56"
              />
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSend}
                disabled={!canSend}
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Announcement
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail className="w-4 h-4 text-blue-600" />
                Delivery
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <InfoRow label="Audience" value={audienceLabels[recipientGroup]} />
                <InfoRow label="Recipients" value={String(selectedCount)} />
                <InfoRow label="Subject" value={subject.trim() || "-"} />
              </div>
            </div>

            {lastResult && (
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  {lastResult.failedCount === 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  Last send
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Metric label="Total" value={lastResult.recipientCount} />
                  <Metric label="Sent" value={lastResult.sentCount} />
                  <Metric label="Failed" value={lastResult.failedCount} />
                </div>
                {lastResult.failures.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {lastResult.failures.slice(0, 5).map((failure) => (
                      <div
                        key={failure.recipientEmail}
                        className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
                      >
                        <div className="font-medium break-all">
                          {failure.recipientEmail}
                        </div>
                        <div>{failure.errorMessage || failure.status}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function AudienceCard({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: typeof Users;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border bg-white p-5 text-left transition-colors ${
        active
          ? "border-blue-500 ring-2 ring-blue-100"
          : "border-slate-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-blue-50 p-3">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <span className="text-2xl font-bold text-slate-900">{count}</span>
      </div>
      <div className="mt-4 text-sm font-medium text-slate-700">{label}</div>
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <span className="font-medium text-slate-900 text-right break-words">
        {value}
      </span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-3">
      <div className="text-lg font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
