import { useState, useEffect } from 'react';
import { Bell, Globe, Lock, Trash2, Save, Database, Zap, Download, Moon, Sun, LayoutGrid, Columns2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLayout } from '../contexts/LayoutContext';
import { supabase } from '../lib/supabase';

interface Settings {
  email_notifications: boolean;
  weekly_summary: boolean;
  product_updates: boolean;
  usage_analytics: boolean;
  auto_save: boolean;
  default_quality: string;
  language: string;
}

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { layoutMode, setLayoutMode } = useLayout();
  const [settings, setSettings] = useState<Settings>({
    email_notifications: true,
    weekly_summary: true,
    product_updates: false,
    usage_analytics: true,
    auto_save: true,
    default_quality: 'high',
    language: 'en'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings saved successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    if (!user) return;

    try {
      const { data: generations } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id);

      const dataStr = JSON.stringify({ generations }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shootx-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage({ type: 'error', text: 'Failed to export data' });
    }
  };

  return (
    <div className="h-screen overflow-auto bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Manage your application preferences</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Globe size={20} className="text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Switch between light and dark theme
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Moon size={14} />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun size={14} />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">Light</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Studio Layout</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Choose between floating chat or split-view layout
                  </div>
                </div>
                <button
                  onClick={() => setLayoutMode(layoutMode === 'floating' ? 'split' : 'floating')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  {layoutMode === 'split' ? (
                    <>
                      <Columns2 size={14} />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">Split</span>
                    </>
                  ) : (
                    <>
                      <LayoutGrid size={14} />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">Float</span>
                    </>
                  )}
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Default Output Quality
                </label>
                <select
                  value={settings.default_quality}
                  onChange={(e) => setSettings({ ...settings, default_quality: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                >
                  <option value="standard">Standard (720p)</option>
                  <option value="high">High (1080p)</option>
                  <option value="ultra">Ultra (4K)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Bell size={20} className="text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications for completed generations</span>
                <input
                  type="checkbox"
                  checked={settings.email_notifications}
                  onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">Weekly summary emails</span>
                <input
                  type="checkbox"
                  checked={settings.weekly_summary}
                  onChange={(e) => setSettings({ ...settings, weekly_summary: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">Product updates and announcements</span>
                <input
                  type="checkbox"
                  checked={settings.product_updates}
                  onChange={(e) => setSettings({ ...settings, product_updates: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </label>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Auto-save generations</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Automatically save all generations to your library</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_save}
                  onChange={(e) => setSettings({ ...settings, auto_save: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </label>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Lock size={20} className="text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Usage analytics</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Help us improve by sharing anonymous usage data</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.usage_analytics}
                  onChange={(e) => setSettings({ ...settings, usage_analytics: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </label>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Database size={20} className="text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Export Your Data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Download all your generations and project data in JSON format
                </p>
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm font-medium"
                >
                  <Download size={16} />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                <Trash2 size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-400">Danger Zone</h2>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Once you delete your account, there is no going back. All your data will be permanently deleted.
            </p>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium">
              Delete Account
            </button>
          </div>

          <div className="sticky bottom-0 pt-6 pb-2 bg-white dark:bg-black">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
