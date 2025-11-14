import {
  User,
  Shirt,
  Palette,
  ArrowUpCircle,
  Image,
  Maximize2,
  Camera,
  Video,
  FileImage,
  Wand2,
} from 'lucide-react';

interface WorkflowOption {
  id: string;
  name: string;
  description: string;
  icon: typeof User;
}

const workflows: WorkflowOption[] = [
  {
    id: 'model',
    name: 'Realistic Human Model',
    description: 'Create AI-generated human models',
    icon: User,
  },
  {
    id: 'tryon',
    name: 'Virtual Try-On',
    description: 'Try items on any model',
    icon: Shirt,
  },
  {
    id: 'color_change',
    name: 'Color Change',
    description: 'Modify colors in images',
    icon: Palette,
  },
  {
    id: 'upscale',
    name: 'Upscale Image',
    description: 'Enhance resolution up to 4x',
    icon: ArrowUpCircle,
  },
  {
    id: 'graphic_transfer',
    name: 'Graphic Transfer',
    description: 'Transfer graphics between images',
    icon: Image,
  },
  {
    id: 'resize',
    name: 'Resize Photo',
    description: 'Resize for social media',
    icon: Maximize2,
  },
  {
    id: 'background',
    name: 'Background Change',
    description: 'Replace or remove backgrounds',
    icon: Camera,
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Photoshoot',
    description: 'Create lifestyle scenes',
    icon: Camera,
  },
  {
    id: 'video',
    name: 'Video Generation',
    description: 'Generate videos from images',
    icon: Video,
  },
  {
    id: 'poster',
    name: 'Social Media Poster',
    description: 'Create social media graphics',
    icon: FileImage,
  },
];

interface WorkflowSelectorProps {
  onSelect: (id: string, name: string) => void;
}

export default function WorkflowSelector({ onSelect }: WorkflowSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Wand2 className="text-gray-700" size={18} />
        <h3 className="text-gray-900 font-medium text-sm">Choose a workflow</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {workflows.map((workflow) => {
          const Icon = workflow.icon;
          return (
            <button
              key={workflow.id}
              onClick={() => onSelect(workflow.id, workflow.name)}
              className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500 rounded-xl p-3 transition-all group text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
                  <Icon className="text-blue-600" size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-900 text-sm font-medium leading-tight">{workflow.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{workflow.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
