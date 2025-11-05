import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Undo, RotateCcw, RotateCw, Eraser } from 'lucide-react';

interface ManualMaskingEditorProps {
  image: string;
  onComplete: (maskData: string) => void;
  onCancel: () => void;
  mode: 'automatic' | 'manual';
}

interface LayerRegion {
  id: string;
  name: string;
  path: Path2D;
  selected: boolean;
  color: string;
}

export default function ManualMaskingEditor({ image, onComplete, onCancel, mode }: ManualMaskingEditorProps) {
  const [zoom, setZoom] = useState(100);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [layers, setLayers] = useState<LayerRegion[]>([]);
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === 'automatic') {
      generateMockLayers();
    } else if (mode === 'manual' && canvasRef.current && imageRef.current) {
      initializeCanvas();
    }
  }, [mode]);

  const generateMockLayers = () => {
    const mockLayers: LayerRegion[] = [
      {
        id: '1',
        name: 'Upper Body',
        path: new Path2D(),
        selected: false,
        color: 'rgba(59, 130, 246, 0.5)',
      },
      {
        id: '2',
        name: 'Lower Body',
        path: new Path2D(),
        selected: false,
        color: 'rgba(16, 185, 129, 0.5)',
      },
      {
        id: '3',
        name: 'Accessories',
        path: new Path2D(),
        selected: false,
        color: 'rgba(245, 158, 11, 0.5)',
      },
      {
        id: '4',
        name: 'Background',
        path: new Path2D(),
        selected: false,
        color: 'rgba(139, 92, 246, 0.5)',
      },
    ];

    if (imageRef.current) {
      const img = imageRef.current;
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      mockLayers[0].path.rect(w * 0.2, h * 0.15, w * 0.6, h * 0.35);
      mockLayers[1].path.rect(w * 0.25, h * 0.5, w * 0.5, h * 0.45);
      mockLayers[2].path.arc(w * 0.5, h * 0.3, w * 0.15, 0, Math.PI * 2);
      mockLayers[3].path.rect(0, 0, w, h);
    }

    setLayers(mockLayers);
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveHistory();
    }
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const newStep = historyStep - 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const newStep = historyStep + 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'manual') return;
    setIsDrawing(true);
    draw(e, e.button === 2);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'manual' || !isDrawing) return;
    draw(e, e.buttons === 2);
  };

  const handleCanvasMouseUp = () => {
    if (mode !== 'manual' || !isDrawing) return;
    setIsDrawing(false);
    saveHistory();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>, isEraser: boolean) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'automatic' || !imageRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const img = imageRef.current;
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    let found = false;
    for (const layer of layers) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx && ctx.isPointInPath(layer.path, x, y)) {
        setHoveredLayer(layer.id);
        found = true;
        break;
      }
    }
    if (!found) setHoveredLayer(null);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'automatic' || !imageRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const img = imageRef.current;
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    for (const layer of layers) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx && ctx.isPointInPath(layer.path, x, y)) {
        toggleLayer(layer.id);
        break;
      }
    }
  };

  const handleZoomIn = () => setZoom(Math.min(200, zoom + 10));
  const handleZoomOut = () => setZoom(Math.max(50, zoom - 10));
  const handleReset = () => {
    setZoom(100);
    if (mode === 'automatic') {
      setLayers(layers.map(l => ({ ...l, selected: false })));
    } else {
      initializeCanvas();
    }
  };

  const toggleLayer = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, selected: !l.selected } : l));
  };

  const handleSave = () => {
    if (mode === 'automatic') {
      const selectedLayerIds = layers.filter(l => l.selected).map(l => l.id);
      onComplete(JSON.stringify({ mode: 'automatic', layers: selectedLayerIds }));
    } else {
      const canvas = canvasRef.current;
      if (canvas) {
        const maskData = canvas.toDataURL();
        onComplete(JSON.stringify({ mode: 'manual', maskData }));
      }
    }
  };

  const canSave = mode === 'automatic'
    ? layers.some(l => l.selected)
    : history.length > 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {mode === 'automatic' ? 'Automatic Masking' : 'Manual Masking'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {mode === 'automatic'
                ? 'Hover and click to select AI-detected layers'
                : 'Left-click to paint, right-click to erase'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} className="text-gray-600 dark:text-gray-400" />
                </button>

                <div className="flex items-center gap-2 px-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Zoom</span>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand"
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-10">{zoom}%</span>
                </div>

                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Reset"
                >
                  <RotateCcw size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                {mode === 'manual' && (
                  <>
                    <button
                      onClick={undo}
                      disabled={historyStep <= 0}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Undo"
                    >
                      <Undo size={18} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyStep >= history.length - 1}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Redo"
                    >
                      <RotateCw size={18} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex">
            <div className="flex-1 bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 overflow-auto">
              <div
                ref={containerRef}
                className="relative cursor-pointer select-none"
                style={{ width: `${zoom}%` }}
                onMouseMove={mode === 'automatic' ? handleImageMouseMove : undefined}
                onClick={mode === 'automatic' ? handleImageClick : undefined}
              >
                <img
                  ref={imageRef}
                  src={image}
                  alt="Target"
                  className="w-full h-auto rounded-lg shadow-lg"
                  onLoad={() => {
                    if (mode === 'automatic') generateMockLayers();
                    else if (mode === 'manual') initializeCanvas();
                  }}
                  draggable={false}
                />

                {mode === 'automatic' && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ mixBlendMode: 'multiply' }}
                  >
                    {layers.map((layer) => {
                      const isHovered = hoveredLayer === layer.id;
                      const isSelected = layer.selected;

                      if (!isHovered && !isSelected) return null;

                      return (
                        <g key={layer.id}>
                          <path
                            d={getPathD(layer.path, imageRef.current)}
                            fill={isSelected ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.3)'}
                            stroke={isSelected ? '#3b82f6' : '#ffffff'}
                            strokeWidth="2"
                          />
                        </g>
                      );
                    })}
                  </svg>
                )}

                {mode === 'manual' && (
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-auto rounded-lg"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    onContextMenu={handleContextMenu}
                    style={{ cursor: `crosshair` }}
                  />
                )}
              </div>
            </div>

            {mode === 'manual' && (
              <div className="w-64 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Brush Settings</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Brush Size
                      </label>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">{brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Shortcuts</h4>
                    <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>Paint (Select)</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">Left Click</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Erase (Deselect)</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">Right Click</kbd>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Use the brush to paint over areas you want to select. Right-click to erase mistakes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'automatic' && (
              <span>
                {layers.filter(l => l.selected).length} layer(s) selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="px-6 py-2.5 text-sm font-semibold bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPathD(path: Path2D, img: HTMLImageElement | null): string {
  if (!img) return '';

  const w = img.naturalWidth;
  const h = img.naturalHeight;

  const pathString = path.toString();
  if (pathString.includes('rect')) {
    return `M ${w * 0.2} ${h * 0.15} L ${w * 0.8} ${h * 0.15} L ${w * 0.8} ${h * 0.5} L ${w * 0.2} ${h * 0.5} Z`;
  }

  return '';
}
