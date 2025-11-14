import { useState } from 'react';
import { Upload, Download, ChevronRight, Trash2, CheckCircle2, AlertCircle, Loader2, User, Shirt, Palette, ArrowUpCircle, Image, Maximize2, Camera, Video, FileImage, Settings } from 'lucide-react';
import HumanModelOptions from './studio/HumanModelOptions';
import VirtualTryonOptions from './studio/VirtualTryonOptions';
import ColorChangeOptions from './studio/ColorChangeOptions';
import UpscaleOptions from './studio/UpscaleOptions';
import GraphicTransferOptions from './studio/GraphicTransferOptions';
import ResizePhotoOptions from './studio/ResizePhotoOptions';
import BackgroundOptions from './studio/BackgroundOptions';
import LifestyleOptions from './studio/LifestyleOptions';
import VideoGenOptions from './studio/VideoGenOptions';
import SocialPosterOptions from './studio/SocialPosterOptions';

interface BulkJob {
  id: string;
  workflow: string;
  images: File[];
  options: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results: string[];
  error?: string;
}

const workflows = [
  { id: 'model', name: 'Human Model', icon: User, description: 'Generate AI models in bulk' },
  { id: 'tryon', name: 'Virtual Try-On', icon: Shirt, description: 'Batch try-on processing' },
  { id: 'color_change', name: 'Color Change', icon: Palette, description: 'Bulk color modifications' },
  { id: 'upscale', name: 'Upscale', icon: ArrowUpCircle, description: 'Batch image enhancement' },
  { id: 'graphic_transfer', name: 'Graphic Transfer', icon: Image, description: 'Apply graphics to multiple items' },
  { id: 'resize', name: 'Resize Photo', icon: Maximize2, description: 'Batch resizing with generative fill' },
  { id: 'background', name: 'Background', icon: Camera, description: 'Bulk background operations' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Camera, description: 'Create multiple lifestyle scenes' },
  { id: 'video', name: 'Video Gen', icon: Video, description: 'Generate videos in bulk' },
  { id: 'poster', name: 'Social Poster', icon: FileImage, description: 'Batch social media posts' },
];

export default function BulkOperations() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [bulkJobs, setBulkJobs] = useState<BulkJob[]>([]);
  const [showWorkflowSelect, setShowWorkflowSelect] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [workflowOptions, setWorkflowOptions] = useState<Record<string, unknown>>({});

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleWorkflowOptionsSubmit = (data: Record<string, unknown>) => {
    setWorkflowOptions(data);
    setShowOptions(false);
  };

  const startBulkJob = () => {
    if (!selectedWorkflow || uploadedFiles.length === 0) return;

    const newJob: BulkJob = {
      id: Date.now().toString(),
      workflow: selectedWorkflow,
      images: uploadedFiles,
      options: workflowOptions,
      status: 'pending',
      progress: 0,
      results: [],
    };

    setBulkJobs(prev => [newJob, ...prev]);
    setUploadedFiles([]);
    setWorkflowOptions({});
    setShowWorkflowSelect(true);
    setSelectedWorkflow('');

    setTimeout(() => {
      setBulkJobs(prev => prev.map(job =>
        job.id === newJob.id ? { ...job, status: 'processing' as const } : job
      ));
    }, 1000);
  };

  const downloadAllResults = (job: BulkJob) => {
    alert(`Download all ${job.results.length} results for ${job.workflow}`);
  };

  const deleteJob = (jobId: string) => {
    setBulkJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />;
      case 'failed':
        return <AlertCircle size={20} className="text-red-600 dark:text-red-400" />;
      case 'processing':
        return <Loader2 size={20} className="text-blue-600 dark:text-blue-400 animate-spin" />;
      default:
        return <Loader2 size={20} className="text-gray-400" />;
    }
  };

  const renderWorkflowOptions = () => {
    const dummyImage = uploadedFiles[0] ? URL.createObjectURL(uploadedFiles[0]) : null;

    switch (selectedWorkflow) {
      case 'model':
        return <HumanModelOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      case 'tryon':
        return <VirtualTryonOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      case 'color_change':
        return <ColorChangeOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      case 'upscale':
        return <UpscaleOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      case 'graphic_transfer':
        return <GraphicTransferOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      case 'resize':
        return <ResizePhotoOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      case 'background':
        return <BackgroundOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      case 'lifestyle':
        return <LifestyleOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      case 'video':
        return <VideoGenOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      case 'poster':
        return <SocialPosterOptions onGenerate={handleWorkflowOptionsSubmit} preloadedImage={dummyImage} onImageUsed={() => {}} />;
      default:
        return null;
    }
  };

  const currentWorkflow = workflows.find(w => w.id === selectedWorkflow);

  return (
    <div className="h-screen overflow-auto bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Bulk Operations</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Process multiple images at once with batch export</p>
        </div>

        {/* Workflow Selection */}
        {showWorkflowSelect ? (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Select Workflow</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {workflows.map((workflow) => {
                const Icon = workflow.icon;
                return (
                  <button
                    key={workflow.id}
                    onClick={() => {
                      setSelectedWorkflow(workflow.id);
                      setShowWorkflowSelect(false);
                    }}
                    className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-all text-left group"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
                        <Icon size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-white dark:group-hover:text-black" />
                      </div>
                      <div>
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
        ) : showOptions ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {currentWorkflow && (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                      <currentWorkflow.icon size={20} className="text-white dark:text-black" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Configure {currentWorkflow.name} Options
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        These settings will apply to all {uploadedFiles.length} images
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowOptions(false)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Back to Upload
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 max-w-2xl mx-auto">
              {renderWorkflowOptions()}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {currentWorkflow && (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                      <currentWorkflow.icon size={20} className="text-white dark:text-black" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {currentWorkflow.name}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currentWorkflow.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setShowWorkflowSelect(true);
                  setSelectedWorkflow('');
                  setUploadedFiles([]);
                  setWorkflowOptions({});
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Change Workflow
              </button>
            </div>

            {/* Upload Area */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 mb-4">
              <div className="text-center">
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Multiple Images
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Drag and drop or click to select multiple images
                </p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl cursor-pointer hover:opacity-90 transition-opacity font-medium">
                  <Upload size={20} />
                  Select Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  JPG, PNG, WebP up to 10MB each
                </p>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 dark:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2">
                        <p className="text-xs text-white truncate">{file.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Configure Options Button */}
            {uploadedFiles.length > 0 && (
              <button
                onClick={() => setShowOptions(true)}
                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2 mb-4"
              >
                <Settings size={20} />
                Configure Workflow Options
                <ChevronRight size={20} />
              </button>
            )}

            {/* Start Button (only if options configured) */}
            {uploadedFiles.length > 0 && Object.keys(workflowOptions).length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                      Options Configured
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Ready to process {uploadedFiles.length} images with your configured settings
                    </p>
                  </div>
                </div>
              </div>
            )}

            {uploadedFiles.length > 0 && Object.keys(workflowOptions).length > 0 && (
              <button
                onClick={startBulkJob}
                className="w-full py-4 bg-brand hover:bg-brand/90 text-white rounded-xl font-medium flex items-center justify-center gap-2"
              >
                Start Bulk Processing
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        {/* Jobs List */}
        {bulkJobs.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Processing Jobs</h2>
            <div className="space-y-3">
              {bulkJobs.map((job) => {
                const workflow = workflows.find(w => w.id === job.workflow);
                const Icon = workflow?.icon || FileImage;

                return (
                  <div
                    key={job.id}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                          <Icon size={24} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {workflow?.name}
                            </h3>
                            {getStatusIcon(job.status)}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {job.images.length} images • {job.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.status === 'completed' && (
                          <button
                            onClick={() => downloadAllResults(job)}
                            className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
                          >
                            <Download size={14} />
                            Export All
                          </button>
                        )}
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {job.status === 'processing' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Processing...</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{job.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-900 dark:bg-white transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {job.status === 'failed' && job.error && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-xs text-red-800 dark:text-red-200">{job.error}</p>
                      </div>
                    )}

                    {/* Results Preview */}
                    {job.status === 'completed' && job.results.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                        {job.results.slice(0, 8).map((result, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden"
                          >
                            <img
                              src={result}
                              alt={`Result ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {job.results.length > 8 && (
                          <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                              +{job.results.length - 8}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bulkJobs.length === 0 && showWorkflowSelect && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <FileImage className="mx-auto mb-4 text-gray-300 dark:text-gray-700" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bulk jobs yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Select a workflow to start batch processing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
