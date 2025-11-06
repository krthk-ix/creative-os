import { useEffect, useState } from 'react';
import { Plus, Filter, Search, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Generation {
  id: string;
  image_url: string;
  workflow_name: string;
  brand_name: string | null;
  campaign_name: string | null;
  tags: string[];
  created_at: string;
}

export default function Projects() {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [filteredGenerations, setFilteredGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<Generation | null>(null);

  const [brandName, setBrandName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    loadGenerations();
  }, []);

  useEffect(() => {
    filterGenerations();
  }, [searchQuery, selectedWorkflow, generations]);

  const loadGenerations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGenerations(data || []);
      setFilteredGenerations(data || []);
    } catch (error) {
      console.error('Error loading generations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGenerations = () => {
    let filtered = [...generations];

    if (searchQuery) {
      filtered = filtered.filter(gen =>
        gen.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gen.campaign_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gen.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedWorkflow !== 'all') {
      filtered = filtered.filter(gen => gen.workflow_name === selectedWorkflow);
    }

    setFilteredGenerations(filtered);
  };

  const workflows = Array.from(new Set(generations.map(g => g.workflow_name)));

  const createProject = async () => {
    if (!user || !brandName.trim()) return;

    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);

      const { error } = await supabase.from('generations').insert({
        user_id: user.id,
        brand_name: brandName,
        campaign_name: campaignName || null,
        tags: tagsArray,
        workflow_name: 'Manual Upload',
        image_url: 'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg',
      });

      if (error) throw error;

      setBrandName('');
      setCampaignName('');
      setTags('');
      setShowCreateModal(false);
      loadGenerations();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-black">
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              {filteredGenerations.length} {filteredGenerations.length === 1 ? 'generation' : 'generations'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center gap-1.5 hover:opacity-90 transition-opacity text-sm"
            >
              <Plus size={14} />
              New
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-sm ${
                showFilters
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <Filter size={14} />
              Filter
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by brand, campaign, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </div>
              <select
                value={selectedWorkflow}
                onChange={(e) => setSelectedWorkflow(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              >
                <option value="all">All Workflows</option>
                {workflows.map(workflow => (
                  <option key={workflow} value={workflow}>{workflow}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading generations...</div>
        ) : filteredGenerations.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={64} />
            <h3 className="text-gray-900 dark:text-white text-lg font-medium mb-2">
              {generations.length === 0 ? 'No generations yet' : 'No matching generations'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {generations.length === 0
                ? 'Start creating in the Studio to see your work here'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredGenerations.map((generation) => (
              <div
                key={generation.id}
                onClick={() => setSelectedImage(generation)}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-all"
              >
                <img
                  src={generation.image_url}
                  alt={generation.brand_name || 'Generation'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="font-medium text-sm truncate">{generation.brand_name || 'Untitled'}</p>
                    <p className="text-xs text-gray-300 truncate">{generation.workflow_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50" onClick={() => setSelectedImage(null)}>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>
          <div className="max-w-5xl w-full max-h-[90vh] flex gap-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.brand_name || 'Generation'}
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />
            </div>
            <div className="w-80 bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4 overflow-auto">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedImage.brand_name || 'Untitled'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(selectedImage.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Workflow</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedImage.workflow_name}</p>
                </div>

                {selectedImage.campaign_name && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Campaign</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedImage.campaign_name}</p>
                  </div>
                )}

                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium">
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Project</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="Enter campaign name (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="Comma-separated tags (e.g., fashion, summer, sale)"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Separate multiple tags with commas
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  disabled={!brandName.trim()}
                  className="flex-1 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
