import { useEffect, useState } from 'react';
import { Download, Eye, Trash2, Clock, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface HistoryItem {
  id: string;
  workflow_type: string;
  workflow_name: string;
  input_image_url: string | null;
  output_image_url: string;
  prompt: string | null;
  credits_used: number;
  status: 'completed' | 'failed' | 'processing';
  created_at: string;
}

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all');

  useEffect(() => {
    loadHistory();
  }, [filter]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('generation_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('generation_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadHistory();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    };
    return styles[status as keyof typeof styles] || styles.completed;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Generation History</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs">View and manage your past generations</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'failed'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            Failed
          </button>
        </div>

        {history.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <Clock className="mx-auto mb-4 text-gray-300 dark:text-gray-700" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No history yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all'
                ? 'Your generation history will appear here'
                : `No ${filter} generations found`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-gray-900 dark:hover:border-white transition-all group"
              >
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                  {item.output_image_url ? (
                    <img
                      src={item.output_image_url}
                      alt={item.workflow_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={32} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="p-2 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="View Details"
                    >
                      <Eye size={20} className="text-gray-900 dark:text-white" />
                    </button>
                    {item.output_image_url && (
                      <button
                        onClick={() => downloadImage(item.output_image_url, `${item.workflow_name}-${item.id}.png`)}
                        className="p-2 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Download"
                      >
                        <Download size={20} className="text-gray-900 dark:text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 bg-white dark:bg-gray-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate flex-1">
                      {item.workflow_name}
                    </h3>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  {item.prompt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                      {item.prompt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.credits_used} credits
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{selectedItem.workflow_name}</h3>
                <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedItem.status)}`}>
                  {selectedItem.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Eye size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedItem.input_image_url && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Input Image</h4>
                    <img
                      src={selectedItem.input_image_url}
                      alt="Input"
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-800"
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Output Image</h4>
                  <img
                    src={selectedItem.output_image_url}
                    alt="Output"
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>

              {selectedItem.prompt && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Prompt</h4>
                  <div className="bg-gray-50 dark:bg-black rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedItem.prompt}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Workflow Type</h4>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedItem.workflow_type}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Credits Used</h4>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedItem.credits_used}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Created At</h4>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedItem.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Status</h4>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedItem.status}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                {selectedItem.output_image_url && (
                  <button
                    onClick={() => downloadImage(selectedItem.output_image_url, `${selectedItem.workflow_name}-${selectedItem.id}.png`)}
                    className="flex-1 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    Download Image
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteItem(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
