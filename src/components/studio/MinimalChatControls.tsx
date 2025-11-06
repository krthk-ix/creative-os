import { Sparkles, ChevronDown, ChevronUp, RectangleHorizontal, RectangleVertical } from 'lucide-react';

interface MinimalChatControlsProps {
  selectedWorkflow: string;
  workflowName: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  settings: {
    outputFormat: 'avif' | 'webp' | 'jpg';
    outputCount: 2 | 4;
  };
  onSettingsChange: (settings: { outputFormat?: 'avif' | 'webp' | 'jpg'; outputCount?: 2 | 4 }) => void;
  videoSettings: {
    format: 'MP4' | 'WEBM';
    duration: 5 | 8 | 15;
    orientation: 'landscape' | 'portrait';
  };
  onVideoSettingsChange: (settings: { format?: 'MP4' | 'WEBM'; duration?: 5 | 8 | 15; orientation?: 'landscape' | 'portrait' }) => void;
  credits: number;
  totalCredits: number;
}

export default function MinimalChatControls({
  selectedWorkflow,
  workflowName,
  isExpanded,
  onToggleExpand,
  settings,
  onSettingsChange,
  videoSettings,
  onVideoSettingsChange,
  credits,
  totalCredits,
}: MinimalChatControlsProps) {
  return (
    <>
      {selectedWorkflow && (
        <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-1.5 text-center text-xs">
          <span className="text-gray-700 dark:text-gray-300">
            {credits}/{totalCredits} credits
          </span>
          <button className="text-brand font-medium hover:underline ml-1">
            Upgrade
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <button
          onClick={() => selectedWorkflow && onToggleExpand()}
          className={`w-full px-4 py-2.5 flex items-center justify-between transition-colors ${
            selectedWorkflow ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer' : 'cursor-default'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="text-white" size={16} />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                {selectedWorkflow ? workflowName : 'Select a workflow'}
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {selectedWorkflow ? (isExpanded ? 'Adjust options' : 'Click to adjust') : 'Choose workflow above'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedWorkflow && selectedWorkflow === 'video' ? (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Fmt:</span>
                  <div className="flex gap-0.5">
                    {(['MP4', 'WEBM'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={(e) => {
                          e.stopPropagation();
                          onVideoSettingsChange({ format });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          videoSettings.format === format
                            ? 'bg-brand text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Dur:</span>
                  <div className="flex gap-0.5">
                    {([5, 8, 15] as const).map((duration) => (
                      <button
                        key={duration}
                        onClick={(e) => {
                          e.stopPropagation();
                          onVideoSettingsChange({ duration });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          videoSettings.duration === duration
                            ? 'bg-brand text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onVideoSettingsChange({ orientation: 'landscape' });
                    }}
                    className={`p-1 rounded transition-colors ${
                      videoSettings.orientation === 'landscape'
                        ? 'bg-brand text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <RectangleHorizontal size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onVideoSettingsChange({ orientation: 'portrait' });
                    }}
                    className={`p-1 rounded transition-colors ${
                      videoSettings.orientation === 'portrait'
                        ? 'bg-brand text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <RectangleVertical size={12} />
                  </button>
                </div>
              </div>
            ) : selectedWorkflow ? (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Fmt:</span>
                  <div className="flex gap-0.5">
                    {(['avif', 'webp', 'jpg'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSettingsChange({ outputFormat: format });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          settings.outputFormat === format
                            ? 'bg-brand text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Qty:</span>
                  <div className="flex gap-0.5">
                    {([2, 4] as const).map((count) => (
                      <button
                        key={count}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSettingsChange({ outputCount: count });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          settings.outputCount === count
                            ? 'bg-brand text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            {selectedWorkflow && (isExpanded ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronUp size={16} className="text-gray-400" />
            ))}
          </div>
        </button>
      </div>
    </>
  );
}
