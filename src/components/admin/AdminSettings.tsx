import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Settings,
  Bell,
  Shield,
  Mail,
  Globe,
  Save
} from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Scholar-Finder',
    siteUrl: 'https://scholarfinder.lk',
    adminEmail: 'admin@scholarfinder.lk',
    supportEmail: 'support@scholarfinder.lk',
    notificationsEnabled: true,
    emailNotifications: true,
    autoApproval: false,
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Settings</h2>
        <p className="text-slate-600">Manage platform settings and configurations</p>
      </div>

      {/* General Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">General Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              placeholder="Scholar-Finder"
            />
          </div>

          <div>
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input
              id="siteUrl"
              type="url"
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              placeholder="https://scholarfinder.lk"
            />
          </div>
        </div>
      </Card>

      {/* Email Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Email Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input
              id="adminEmail"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              placeholder="admin@scholarfinder.lk"
            />
          </div>

          <div>
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              placeholder="support@scholarfinder.lk"
            />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Bell className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Notification Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Enable Notifications</p>
              <p className="text-sm text-slate-600">Receive notifications for new registrations</p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Email Notifications</p>
              <p className="text-sm text-slate-600">Send email alerts for important events</p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, emailNotifications: !settings.emailNotifications })
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-3 rounded-lg">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Security Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Auto-Approval</p>
              <p className="text-sm text-slate-600">
                Automatically approve institutions without manual review
              </p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoApproval: !settings.autoApproval })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.autoApproval ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.autoApproval ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
