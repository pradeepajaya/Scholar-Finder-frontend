import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  Award,
  FileText, 
  Settings, 
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  Bell,
  AlertCircle,
  Inbox,
  Loader2,
  Megaphone,
  Menu,
  RefreshCw,
  X as CloseIcon
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminInstitutions } from './admin/AdminInstitutions';
import { AdminScholarships } from './admin/AdminScholarships';
import { AdminStudents } from './admin/AdminStudents';
import { AdminContent } from './admin/AdminContent';
import { AdminSuccessStories } from './admin/AdminSuccessStories';
import { AdminSettings } from './admin/AdminSettings';
import { AdminAnnouncements } from './admin/AdminAnnouncements';
import { AdminAlertDto, contentApi, notificationApi, TestimonialDto } from '../services/api';

const SEEN_ADMIN_ALERT_IDS_KEY = 'scholar_finder_seen_admin_alert_ids';

const readSeenAlertIds = () => {
  try {
    const raw = localStorage.getItem(SEEN_ADMIN_ALERT_IDS_KEY);
    if (!raw) return new Set<number>();
    const ids = JSON.parse(raw) as number[];
    return new Set(ids.filter((id) => Number.isFinite(id)));
  } catch {
    return new Set<number>();
  }
};

const writeSeenAlertIds = (ids: Set<number>) => {
  localStorage.setItem(SEEN_ADMIN_ALERT_IDS_KEY, JSON.stringify([...ids]));
};

interface AdminPortalProps {
  onLogout?: () => void | Promise<void>;
}

export function AdminPortal({ onLogout }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AdminAlertDto[]>([]);
  const [seenAlertIds, setSeenAlertIds] = useState<Set<number>>(readSeenAlertIds);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pendingStories, setPendingStories] = useState<TestimonialDto[]>([]);
  const [isLoadingPendingStories, setIsLoadingPendingStories] = useState(false);
  const [storyActionId, setStoryActionId] = useState<number | null>(null);
  const [successStoryFocusId, setSuccessStoryFocusId] = useState<number | null>(null);
  const pendingStoryCount = pendingStories.length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'institutions', label: 'Institutions', icon: Building2 },
    { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
    { id: 'students', label: 'Students', icon: Users },
    {
      id: 'success-stories',
      label: 'Story Reviews',
      icon: Award,
      badge: pendingStoryCount,
    },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            onOpenStoryReviews={() => setActiveTab('success-stories')}
            onPendingStoryChange={loadPendingStoryCount}
          />
        );
      case 'institutions':
        return <AdminInstitutions />;
      case 'scholarships':
        return <AdminScholarships />;
      case 'students':
        return <AdminStudents />;
      case 'success-stories':
        return (
          <AdminSuccessStories
            focusStoryId={successStoryFocusId}
            onReviewChange={loadPendingStoryCount}
          />
        );
      case 'announcements':
        return <AdminAnnouncements />;
      case 'content':
        return <AdminContent />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  const loadAlerts = useCallback(async () => {
    setIsLoadingAlerts(true);
    setAlertsError(null);

    try {
      const response = await notificationApi.getAdminAlerts(0, 20);
      setAlerts(response.data?.content ?? []);
    } catch (error) {
      setAlertsError(
        error instanceof Error ? error.message : 'Failed to load alerts',
      );
    } finally {
      setIsLoadingAlerts(false);
    }
  }, []);

  const loadPendingStoryCount = useCallback(async () => {
    setIsLoadingPendingStories(true);
    try {
      const response = await contentApi.getAllTestimonials('PENDING');
      setPendingStories(response.data ?? []);
    } catch {
      setPendingStories([]);
    } finally {
      setIsLoadingPendingStories(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
    loadPendingStoryCount();
    const intervalId = window.setInterval(loadAlerts, 60000);
    const storyIntervalId = window.setInterval(loadPendingStoryCount, 60000);
    return () => {
      window.clearInterval(intervalId);
      window.clearInterval(storyIntervalId);
    };
  }, [loadAlerts, loadPendingStoryCount]);

  useEffect(() => {
    if (!isAlertsOpen || alerts.length === 0) {
      return;
    }

    setSeenAlertIds((current) => {
      const next = new Set(current);
      let changed = false;

      alerts.forEach((alert) => {
        if (!next.has(alert.id)) {
          next.add(alert.id);
          changed = true;
        }
      });

      if (changed) {
        writeSeenAlertIds(next);
      }

      return changed ? next : current;
    });
  }, [alerts, isAlertsOpen]);

  const unseenAlertCount = useMemo(
    () => alerts.filter((alert) => !seenAlertIds.has(alert.id)).length,
    [alerts, seenAlertIds],
  );

  const handleLogout = async () => {
    if (!onLogout || isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleReviewAlert = (alert: AdminAlertDto) => {
    if (!isSuccessStoryAlert(alert)) {
      return;
    }

    setSuccessStoryFocusId(alert.referenceId ?? null);
    setActiveTab('success-stories');
    setIsAlertsOpen(false);
    setIsSidebarOpen(false);
  };

  const handleAcceptPendingStory = async (story: TestimonialDto) => {
    setStoryActionId(story.id);
    try {
      await contentApi.approveTestimonial(story.id, {
        reviewedBy: 'Admin',
      });
      setPendingStories((current) =>
        current.filter((item) => item.id !== story.id),
      );
      toast.success('Success story accepted and published');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to accept success story',
      );
    } finally {
      setStoryActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Scholar-Finder Admin</h1>
          </div>

          <div className="flex items-center gap-3">
            <Popover open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  aria-label="View admin alerts"
                >
                  <Bell className="w-5 h-5" />
                  {unseenAlertCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                      {unseenAlertCount > 9 ? '9+' : unseenAlertCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[min(92vw,24rem)] p-0">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div>
                    <h2 className="font-semibold text-slate-900">Alerts</h2>
                    <p className="text-xs text-slate-500">
                      Recent admin notifications
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={loadAlerts}
                    disabled={isLoadingAlerts}
                    title="Refresh alerts"
                    aria-label="Refresh alerts"
                  >
                    {isLoadingAlerts ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {alertsError && (
                  <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {alertsError}
                  </div>
                )}

                <ScrollArea className="h-96">
                  {alerts.length === 0 && !isLoadingAlerts ? (
                    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                      <Inbox className="mb-3 h-9 w-9 text-slate-300" />
                      <p className="font-medium text-slate-900">No alerts yet</p>
                      <p className="mt-1 text-sm text-slate-500">
                        New system notifications will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {alerts.map((alert) => (
                        <AdminAlertItem
                          key={alert.id}
                          alert={alert}
                          onReviewAlert={handleReviewAlert}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
                  Showing latest {alerts.length} alert
                  {alerts.length === 1 ? '' : 's'}
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2 pl-3 border-l">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">admin@scholarfinder.lk</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
              title="Logout"
              className="text-slate-600 hover:bg-red-50 hover:text-red-600"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-white border-r border-slate-200 z-30 transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const badge = 'badge' in item ? item.badge ?? 0 : 0;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-100 px-1.5 text-xs font-semibold text-amber-700">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {(pendingStories.length > 0 || isLoadingPendingStories) && (
            <section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Award className="h-5 w-5 text-amber-700" />
                    <h2 className="font-semibold text-slate-900">
                      Pending Success Story Reviews
                    </h2>
                    <Badge className="bg-amber-100 text-amber-800">
                      {pendingStoryCount} Waiting
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Accept submitted student stories here, or open the full review queue.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-amber-300 bg-white"
                  onClick={() => setActiveTab('success-stories')}
                >
                  Review All
                </Button>
              </div>

              {isLoadingPendingStories && pendingStories.length === 0 ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-700" />
                  Loading pending stories...
                </div>
              ) : (
                <div className="mt-4 grid gap-3 xl:grid-cols-2">
                  {pendingStories.slice(0, 2).map((story) => (
                    <div
                      key={story.id}
                      className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-white p-4 lg:flex-row lg:items-start lg:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">
                          {story.isAnonymous
                            ? 'Anonymous Scholar'
                            : story.scholarName || 'Scholar'}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {story.scholarshipName}
                          {story.university ? ` - ${story.university}` : ''}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                          {story.testimonialText}
                        </p>
                      </div>
                      <Button
                        className="bg-green-400 text-black hover:bg-green-500"
                        onClick={() => handleAcceptPendingStory(story)}
                        disabled={storyActionId === story.id}
                      >
                        {storyActionId === story.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Accept & Publish
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function AdminAlertItem({
  alert,
  onReviewAlert,
}: {
  alert: AdminAlertDto;
  onReviewAlert: (alert: AdminAlertDto) => void;
}) {
  const isError = alert.severity === 'ERROR';
  const isWarning = alert.severity === 'WARNING';
  const Icon = isError ? AlertCircle : isWarning ? Clock : CheckCircle;
  const iconClassName = isError
    ? 'bg-red-50 text-red-600'
    : isWarning
    ? 'bg-amber-50 text-amber-600'
    : 'bg-emerald-50 text-emerald-600';
  const badgeClassName = isError
    ? 'bg-red-100 text-red-700'
    : isWarning
    ? 'bg-amber-100 text-amber-700'
    : 'bg-emerald-100 text-emerald-700';
  const message = alert.errorMessage || alert.message || 'No details available';
  const canReviewSuccessStory = isSuccessStoryAlert(alert);

  return (
    <div className="flex gap-3 px-4 py-3">
      <div
        className={`mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg ${iconClassName}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold text-slate-900">
              {alert.title || formatAlertType(alert.notificationType)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formatAlertType(alert.notificationType)}
              {alert.referenceType ? ` · ${formatAlertType(alert.referenceType)}` : ''}
            </p>
          </div>
          <Badge className={`${badgeClassName} flex-none`}>
            {formatAlertType(alert.status)}
          </Badge>
        </div>

        <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600">
          {message}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>{formatAlertTime(alert.createdAt || alert.sentAt)}</span>
          {alert.recipientEmail && (
            <span className="max-w-full truncate">{alert.recipientEmail}</span>
          )}
        </div>

        {canReviewSuccessStory && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-3 h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => onReviewAlert(alert)}
          >
            Review / Accept
          </Button>
        )}
      </div>
    </div>
  );
}

function isSuccessStoryAlert(alert: AdminAlertDto) {
  return (
    alert.referenceType?.toUpperCase() === 'TESTIMONIAL' ||
    alert.notificationType?.toUpperCase().startsWith('SUCCESS_STORY') === true
  );
}

function formatAlertType(value?: string) {
  if (!value) {
    return 'System alert';
  }

  return value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatAlertTime(value?: string) {
  if (!value) {
    return 'Just now';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
