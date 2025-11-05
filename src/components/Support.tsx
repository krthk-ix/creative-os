import { useEffect, useState } from 'react';
import { Plus, MessageSquare, AlertCircle, CheckCircle, Clock, Mail, Book, MessageCircleQuestion, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  updated_at: string;
}

export default function Support() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as const,
    category: 'technical',
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!user || !newTicket.subject.trim() || !newTicket.description.trim()) return;

    try {
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority,
        category: newTicket.category,
        status: 'open',
      });

      if (error) throw error;

      setNewTicket({
        subject: '',
        description: '',
        priority: 'medium',
        category: 'technical',
      });
      setShowCreateModal(false);
      loadTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      in_progress: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      resolved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      closed: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
    };
    return styles[status as keyof typeof styles] || styles.open;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400',
      medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };
    return styles[priority as keyof typeof styles] || styles.medium;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400">Loading support tickets...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support</h1>
            <p className="text-gray-500 dark:text-gray-400">Get help when you need it</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity font-medium"
          >
            <Plus size={20} />
            New Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a
            href="mailto:support@shootx.com"
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-all group"
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
              <Mail size={24} className="text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-black" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get help via email within 24 hours</p>
          </a>

          <a
            href="#"
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-all group"
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
              <Book size={24} className="text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-black" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Documentation</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Browse our comprehensive guides</p>
          </a>

          <a
            href="#"
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-all group"
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
              <MessageCircleQuestion size={24} className="text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-black" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">FAQ</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Find answers to common questions</p>
          </a>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Tickets</h2>
          {tickets.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
              <MessageSquare className="mx-auto mb-4 text-gray-300 dark:text-gray-700" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tickets yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Create a ticket to get help from our support team</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl inline-flex items-center gap-2 hover:opacity-90 transition-opacity font-medium"
              >
                <Plus size={20} />
                Create Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{ticket.subject}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {ticket.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                      {ticket.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Support Ticket</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none"
                  placeholder="Provide detailed information about your issue..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  >
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={createTicket}
                  disabled={!newTicket.subject.trim() || !newTicket.description.trim()}
                  className="flex-1 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 max-w-3xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedTicket.subject}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(selectedTicket.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-black rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedTicket.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
