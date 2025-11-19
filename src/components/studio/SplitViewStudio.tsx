import { useState } from 'react';
import { User, Shirt, Palette, ArrowUpCircle, Image as ImageIcon, Maximize2, Camera, Video, FileImage, Download, ThumbsUp, ThumbsDown, Settings } from 'lucide-react';
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
  timestamp: Date;
  settings: WorkflowSettings;
}

interface WorkflowOption {
  id: string;
  name: string;
  icon: typeof User;
  description: string;
}

const workflows: WorkflowOption[] = [
  { id: 'model', name: 'Human Model', icon: User, description: 'Generate AI models' },
  { id: 'tryon', name: 'Virtual Try-On', icon: Shirt, description: 'Try items on models' },
  { id: 'color_change', name: 'Color Change', icon: Palette, description: 'Change product colors' },
  { id: 'upscale', name: 'Upscale', icon: ArrowUpCircle, description: 'Enhance image quality' },
  { id: 'graphic_transfer', name: 'Graphic Transfer', icon: ImageIcon, description: 'Apply graphics' },
  { id: 'resize', name: 'Resize Photo', icon: Maximize2, description: 'Resize images' },
  { id: 'background', name: 'Background', icon: Camera, description: 'Change backgrounds' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Camera, description: 'Create lifestyle shots' },
  { id: 'video', name: 'Video Gen', icon: Video, description: 'Generate videos' },
  { id: 'poster', name: 'Social Poster', icon: FileImage, description: 'Create social posts' },
];

interface SplitViewStudioProps {
  selectedWorkflow: string;
  workflowName: string;
  onSelectWorkflow: (id: string, name: string) => void;
}

export default function SplitViewStudio({ selectedWorkflow, workflowName, onSelectWorkflow }: SplitViewStudioProps) {
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingChainImage, setPendingChainImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<WorkflowSettings>({
    method: 'automatic',
    outputCount: 2,
    outputFormat: 'webp',
  });

  const handleGenerate = async (data: Record<string, unknown>) => {
    setIsGenerating(true);

    setTimeout(() => {
      const mockImages = [
        'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800',
      ];

      const newResult: GenerationResult = {
        id: Date.now().toString(),
        imageUrls: mockImages.slice(0, settings.outputCount),
        timestamp: new Date(),
        settings,
      };

      setResults((prev) => [newResult, ...prev]);
      setIsGenerating(false);
    }, 3000);
  };

  const renderWorkflowOptions = () => {
    switch (selectedWorkflow) {
      case 'model':
        return <HumanModelOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      case 'tryon':
        return <VirtualTryonOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      case 'color_change':
        return <ColorChangeOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      case 'upscale':
        return <UpscaleOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      case 'graphic_transfer':
        return <GraphicTransferOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      case 'resize':
        return <ResizePhotoOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      case 'background':
        return <BackgroundOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      case 'lifestyle':
        return <LifestyleOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      case 'video':
        return <VideoGenOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      case 'poster':
        return <SocialPosterOptions onGenerate={handleGenerate} preloadedImage={pendingChainImage} onImageUsed={() => setPendingChainImage(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-white dark:bg-black">
      {/* Left Sidebar - Workflow Options */}
      <div className="w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {selectedWorkflow ? workflowName : 'Select Workflow'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedWorkflow ? 'Configure options below' : 'Choose a workflow to begin'}
          </p>
        </div>

        {/* Workflow Selection */}
        {!selectedWorkflow ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {workflows.map((workflow) => {
                const Icon = workflow.icon;
                return (
                  <button
                    key={workflow.id}
                    onClick={() => onSelectWorkflow(workflow.id, workflow.name)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand dark:hover:border-brand transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 group-hover:bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-brand" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {workflow.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
          <>
            {/* Workflow Options - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {renderWorkflowOptions()}
              </div>
            </div>

            {/* Output Settings - Fixed at Bottom */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings size={16} className="text-gray-600 dark:text-gray-400" />
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                    Output Settings
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Output Count */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Number of Outputs
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          onClick={() => setSettings({ ...settings, outputCount: count })}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                            settings.outputCount === count
                              ? 'bg-brand text-white shadow-sm'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Output Format */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Output Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['webp', 'png', 'jpg', 'avif'] as const).map((format) => (
                        <button
                          key={format}
                          onClick={() => setSettings({ ...settings, outputFormat: format })}
                          className={`py-2 px-3 rounded-lg text-xs font-medium uppercase transition-all ${
                            settings.outputFormat === format
                              ? 'bg-brand text-white shadow-sm'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand'
                          }`}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Method */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['automatic', 'manual'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setSettings({ ...settings, method })}
                          className={`py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all ${
                            settings.method === method
                              ? 'bg-brand text-white shadow-sm'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Panel - Output */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header with Actions */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Generated Results
          </h2>
          {results.length > 0 && (
            <button className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Download size={14} />
              Download All
            </button>
          )}
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {results.length === 0 && !isGenerating ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No results yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedWorkflow ? 'Configure options and generate' : 'Select a workflow to start'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {isGenerating && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Generating...</span>
                  </div>
                  <div className={`grid gap-3 ${settings.outputCount === 1 ? 'grid-cols-1' : settings.outputCount === 2 ? 'grid-cols-2' : settings.outputCount === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {Array.from({ length: settings.outputCount }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              )}

              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                >
                  <div className="p-4">
                    <div className={`grid gap-3 mb-4 ${result.imageUrls.length === 1 ? 'grid-cols-1' : result.imageUrls.length === 2 ? 'grid-cols-2' : result.imageUrls.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {result.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Result ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                              <Download size={14} className="text-gray-900 dark:text-white" />
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white rounded px-2 py-0.5 text-xs font-medium">
                            #{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.timestamp.toLocaleTimeString()} • {result.settings.outputFormat.toUpperCase()} • {result.imageUrls.length} outputs
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                          <ThumbsUp size={14} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                          <ThumbsDown size={14} className="text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
