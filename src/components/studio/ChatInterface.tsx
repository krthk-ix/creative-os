import { useState } from 'react';
import { Download, ThumbsUp, ThumbsDown, Sparkles, User, Shirt, Palette, ArrowUpCircle, Image, Maximize2, Camera, Video, FileImage, RectangleHorizontal, RectangleVertical, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import MinimalChatControls from './MinimalChatControls';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import WorkflowSuggestions from './WorkflowSuggestions';
import { getTopSuggestions } from '../../lib/workflowChaining';
import HumanModelOptions from './HumanModelOptions';
import VirtualTryonOptions from './VirtualTryonOptions';
import ColorChangeOptions from './ColorChangeOptions';
import UpscaleOptions from './UpscaleOptions';
import GraphicTransferOptions from './GraphicTransferOptions';
import ResizePhotoOptions from './ResizePhotoOptions';
import BackgroundOptions from './BackgroundOptions';
import LifestyleOptions from './LifestyleOptions';
import VideoGenOptions from './VideoGenOptions';
import SocialPosterOptions from './SocialPosterOptions';
import type { WorkflowSettings } from './WorkflowOptions';

interface GenerationResult {
  id: string;
  imageUrls: string[];
  prompt?: string;
  settings: WorkflowSettings;
  timestamp: Date;
  generationData?: Record<string, unknown>;
  workflowType: string;
}

interface WorkflowOption {
  id: string;
  name: string;
  icon: typeof User;
  description: string;
}

const workflows: WorkflowOption[] = [
  { id: 'model', name: 'Human Model', icon: User, description: 'Generate AI models' },
  { id: 'tryon', name: 'Virtual Try-On', icon: Shirt, description: 'Try clothes on models' },
  { id: 'color_change', name: 'Color Change', icon: Palette, description: 'Change product colors' },
  { id: 'upscale', name: 'Upscale', icon: ArrowUpCircle, description: 'Enhance image quality' },
  { id: 'graphic_transfer', name: 'Graphic Transfer', icon: Image, description: 'Apply graphics' },
  { id: 'resize', name: 'Resize Photo', icon: Maximize2, description: 'Resize images' },
  { id: 'background', name: 'Background', icon: Camera, description: 'Change backgrounds' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Camera, description: 'Create lifestyle shots' },
  { id: 'video', name: 'Video Gen', icon: Video, description: 'Generate videos' },
  { id: 'poster', name: 'Social Poster', icon: FileImage, description: 'Create social posts' },
];

interface ChatInterfaceProps {
  selectedWorkflow: string;
  workflowName: string;
  sidebarCollapsed: boolean;
  onSelectWorkflow: (id: string, name: string) => void;
}

export default function ChatInterface({ selectedWorkflow, workflowName, sidebarCollapsed, onSelectWorkflow }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [credits, setCredits] = useState(60);
  const totalCredits = 200;
  const [pendingChainImage, setPendingChainImage] = useState<string | null>(null);

  const [settings, setSettings] = useState<WorkflowSettings>({
    method: 'automatic',
    outputCount: 2,
    outputFormat: 'webp',
  });

  const [videoSettings, setVideoSettings] = useState({
    format: 'MP4',
    duration: 5,
    orientation: 'landscape' as 'landscape' | 'portrait',
  });

  const handleGenerate = async (data: Record<string, unknown>) => {
    if (!user) return;

    setIsGenerating(true);
    setIsExpanded(false);

    try {
      const { data: generationData, error } = await supabase.from('generations').insert({
        user_id: user.id,
        generation_type: selectedWorkflow,
        method: settings.method,
        input_data: data,
        status: 'processing',
      }).select().single();

      if (error) throw error;

      setTimeout(() => {
        const mockImages = [
          'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800',
        ];

        const selectedImages = mockImages.slice(0, settings.outputCount);
        const newResult: GenerationResult = {
          id: generationData.id,
          imageUrls: selectedImages,
          settings,
          timestamp: new Date(),
          generationData: data,
          workflowType: selectedWorkflow,
        };

        setResults((prev) => [newResult, ...prev]);
        setIsGenerating(false);
      }, 3000);
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 pb-[140px] sm:pb-[100px]" style={{ paddingBottom: isExpanded ? '420px' : undefined }}>
        {results.length === 0 && !isGenerating ? (
          <div className="h-full flex items-center justify-center p-6">
            {!selectedWorkflow ? (
              <div className="text-center max-w-5xl w-full px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg shadow-brand/20">
                  <Sparkles className="text-white" size={32} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Create stunning visuals
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
                  Choose a workflow to get started
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 max-w-4xl mx-auto">
                  {workflows.map((workflow) => {
                    const Icon = workflow.icon;
                    return (
                      <button
                        key={workflow.id}
                        onClick={() => onSelectWorkflow(workflow.id, workflow.name)}
                        className="group relative bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-800 hover:border-brand dark:hover:border-brand transition-all hover:shadow-lg hover:shadow-brand/10 hover:-translate-y-0.5"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-brand/10 dark:group-hover:bg-brand/20 flex items-center justify-center transition-colors">
                            <Icon className="text-gray-600 dark:text-gray-400 group-hover:text-brand" size={24} />
                          </div>
                          <div className="text-center">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                              {workflow.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {workflow.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center max-w-2xl px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg shadow-brand/20">
                  <Sparkles className="text-white" size={32} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Create stunning visuals
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Tap workflow selector above to begin
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-3xl w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Generating...</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: settings.outputCount }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {results.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onChainWorkflow={(workflowId: string, imageUrl: string) => {
                  setPendingChainImage(imageUrl);
                  onSelectWorkflow(workflowId, workflows.find(w => w.id === workflowId)?.name || '');
                  setIsExpanded(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-auto z-40 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-gray-50/95 dark:via-gray-950/95 to-transparent pt-6 pb-20 lg:pb-6 transition-all duration-300 lg:right-0" style={{ left: window.innerWidth >= 1024 ? (sidebarCollapsed ? '64px' : '208px') : '0' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-3">
            {selectedWorkflow && (
              <div className="bg-gray-200 dark:bg-gray-800 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {credits}/{totalCredits} credits
                  </span>
                  <span className="hidden sm:inline text-gray-500">•</span>
                  <button className="text-red-600 dark:text-red-400 font-medium hover:underline">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
            <button
              onClick={() => selectedWorkflow && setIsExpanded(!isExpanded)}
              className={`w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-colors ${
                selectedWorkflow ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-white" size={18} />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {selectedWorkflow ? workflowName : 'Select workflow'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block truncate">
                    {selectedWorkflow ? (isExpanded ? 'Customize settings' : 'Tap to customize') : 'Choose from menu'}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                {selectedWorkflow && selectedWorkflow === 'video' ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Format:</span>
                      <div className="flex gap-1">
                        {(['MP4', 'WEBM'] as const).map((format) => (
                          <button
                            key={format}
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoSettings({ ...videoSettings, format });
                            }}
                            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                              videoSettings.format === format
                                ? 'bg-brand text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                            title={format}
                          >
                            {format}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Duration:</span>
                      <div className="flex gap-1">
                        {([5, 8, 15] as const).map((duration) => (
                          <button
                            key={duration}
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoSettings({ ...videoSettings, duration });
                            }}
                            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                              videoSettings.duration === duration
                                ? 'bg-brand text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                            title={`${duration} seconds`}
                          >
                            {duration}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoSettings({ ...videoSettings, orientation: 'landscape' });
                        }}
                        className={`p-1 rounded transition-colors ${
                          videoSettings.orientation === 'landscape'
                            ? 'bg-brand text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                        title="Landscape (16:9)"
                      >
                        <RectangleHorizontal size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoSettings({ ...videoSettings, orientation: 'portrait' });
                        }}
                        className={`p-1 rounded transition-colors ${
                          videoSettings.orientation === 'portrait'
                            ? 'bg-brand text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                        title="Portrait (9:16)"
                      >
                        <RectangleVertical size={16} />
                      </button>
                    </div>
                  </div>
                ) : selectedWorkflow ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Format:</span>
                      <div className="flex gap-1">
                        {(['avif', 'webp', 'jpg'] as const).map((format) => (
                          <button
                            key={format}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSettings({ ...settings, outputFormat: format });
                            }}
                            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                              settings.outputFormat === format
                                ? 'bg-brand text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                            title={`${format.toUpperCase()} - ${format === 'avif' ? 'Best quality, smaller size' : format === 'webp' ? 'Good balance' : 'Universal compatibility'}`}
                          >
                            {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Outputs:</span>
                      <div className="flex gap-1">
                        {([2, 4] as const).map((count) => (
                          <button
                            key={count}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSettings({ ...settings, outputCount: count });
                            }}
                            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                              settings.outputCount === count
                                ? 'bg-brand text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                            title={`Generate ${count} images`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
                {selectedWorkflow && (isExpanded ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronUp size={20} className="text-gray-400" />
                ))}
              </div>
            </button>

            {selectedWorkflow && (
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-800 pt-4">
                  {selectedWorkflow === 'model' && (
                    <HumanModelOptions onGenerate={handleGenerate} />
                  )}
                  {selectedWorkflow === 'tryon' && (
                    <VirtualTryonOptions onGenerate={handleGenerate} />
                  )}
                  {selectedWorkflow === 'color_change' && (
                    <ColorChangeOptions onGenerate={handleGenerate} />
                  )}
                  {selectedWorkflow === 'upscale' && (
                    <UpscaleOptions
                      onGenerate={handleGenerate}
                      preloadedImage={pendingChainImage}
                      onImageUsed={() => setPendingChainImage(null)}
                    />
                  )}
                  {selectedWorkflow === 'graphic_transfer' && (
                    <GraphicTransferOptions onGenerate={handleGenerate} />
                  )}
                  {selectedWorkflow === 'resize' && (
                    <ResizePhotoOptions
                      onGenerate={handleGenerate}
                      preloadedImage={pendingChainImage}
                      onImageUsed={() => setPendingChainImage(null)}
                    />
                  )}
                  {selectedWorkflow === 'background' && (
                    <BackgroundOptions
                      onGenerate={handleGenerate}
                      preloadedImage={pendingChainImage}
                      onImageUsed={() => setPendingChainImage(null)}
                    />
                  )}
                  {selectedWorkflow === 'lifestyle' && (
                    <LifestyleOptions onGenerate={handleGenerate} />
                  )}
                  {selectedWorkflow === 'video' && (
                    <VideoGenOptions onGenerate={handleGenerate} />
                  )}
                  {selectedWorkflow === 'poster' && (
                    <SocialPosterOptions
                      onGenerate={handleGenerate}
                      preloadedImage={pendingChainImage}
                      onImageUsed={() => setPendingChainImage(null)}
                    />
                  )}
                  {!['model', 'tryon', 'color_change', 'upscale', 'graphic_transfer', 'resize', 'background', 'lifestyle', 'video', 'poster'].includes(selectedWorkflow) && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        Options for {workflowName} coming soon...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResultCardProps {
  result: GenerationResult;
  onChainWorkflow: (workflowId: string, imageUrl: string) => void;
}

function ResultCard({ result, onChainWorkflow }: ResultCardProps) {
  const workflowNames: Record<string, string> = {
    model: 'Human Model',
    tryon: 'Virtual Try-On',
    color_change: 'Color Change',
    upscale: 'Upscale',
    graphic_transfer: 'Graphic Transfer',
    resize: 'Resize Photo',
    background: 'Background',
    lifestyle: 'Lifestyle',
    video: 'Video Gen',
    poster: 'Social Poster',
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-4xl w-full">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {workflowNames[result.workflowType] || result.workflowType}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(result.timestamp)} • {result.imageUrls.length} {result.imageUrls.length === 1 ? 'variant' : 'variants'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300">
                  {result.settings.outputFormat?.toUpperCase() || 'WEBP'}
                </span>
              </div>
            </div>

            {result.generationData && Object.keys(result.generationData).length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {result.generationData.mode && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Mode:</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{String(result.generationData.mode)}</span>
                    </div>
                  )}
                  {result.generationData.gender && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Gender:</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{String(result.generationData.gender)}</span>
                    </div>
                  )}
                  {result.generationData.upscaleLevel && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Scale:</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{String(result.generationData.upscaleLevel)}x</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {result.imageUrls.map((imageUrl, index) => (
                <ImageCard
                  key={`${result.id}-${index}`}
                  imageUrl={imageUrl}
                  onChainWorkflow={onChainWorkflow}
                  workflowType={result.workflowType}
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImageCardProps {
  imageUrl: string;
  onChainWorkflow: (workflowId: string, imageUrl: string) => void;
  workflowType: string;
  index: number;
}

function ImageCard({ imageUrl, onChainWorkflow, workflowType, index }: ImageCardProps) {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [showActions, setShowActions] = useState(false);
  const suggestions = getTopSuggestions(workflowType, 2);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-${Date.now()}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Generated Image',
          text: 'Check out this AI-generated image!',
          url: imageUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(imageUrl);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="group relative"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-md">
              #{index}
            </span>
          </div>

          <img
            src={imageUrl}
            alt={`Generated result ${index}`}
            className="w-full h-auto"
          />

          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity ${
              showActions ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all ${
              showActions ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
                  className={`p-2 rounded-lg backdrop-blur-md transition-all ${
                    feedback === 'like'
                      ? 'bg-green-500 text-white'
                      : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900'
                  }`}
                  title="Like"
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
                  className={`p-2 rounded-lg backdrop-blur-md transition-all ${
                    feedback === 'dislike'
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900'
                  }`}
                  title="Dislike"
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 rounded-lg backdrop-blur-md transition-all text-gray-700 dark:text-gray-300"
                  title="Share"
                >
                  <Share2 size={14} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 rounded-lg backdrop-blur-md transition-all text-gray-700 dark:text-gray-300"
                  title="Download"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg p-2.5">
                <WorkflowSuggestions
                  suggestions={suggestions}
                  onSelectWorkflow={(workflowId) => onChainWorkflow(workflowId, imageUrl)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
