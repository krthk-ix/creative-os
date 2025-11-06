import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Save, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserProfile {
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    company_name: '',
    avatar_url: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          company_name: data.company_name || '',
          avatar_url: data.avatar_url || '',
          bio: data.bio || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Manage your account information</p>
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

        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-gray-400" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                  <Camera size={16} className="text-white dark:text-black" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {profile.full_name || 'Your Name'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Mail size={14} />
                  {user?.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar size={14} />
                  Member since {new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={profile.company_name || ''}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Bio
              </label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={14} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Email</span>
              <span className="text-gray-900 dark:text-white font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Account ID</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">{user?.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400">Email Verified</span>
              <span className="text-green-600 dark:text-green-400 font-medium">Yes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
