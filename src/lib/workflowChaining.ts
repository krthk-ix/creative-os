export interface WorkflowRelationship {
  id: string;
  name: string;
  description: string;
  icon: string;
  priority: number;
}

export const workflowRelationships: Record<string, WorkflowRelationship[]> = {
  model: [
    { id: 'tryon', name: 'Virtual Try-On', description: 'Try items on this model', icon: 'Shirt', priority: 1 },
    { id: 'background', name: 'Change Background', description: 'Place in different setting', icon: 'Camera', priority: 2 },
    { id: 'lifestyle', name: 'Lifestyle Shot', description: 'Create lifestyle scene', icon: 'Camera', priority: 3 },
    { id: 'upscale', name: 'Upscale', description: 'Enhance quality', icon: 'ArrowUpCircle', priority: 4 },
    { id: 'resize', name: 'Resize', description: 'Adjust dimensions', icon: 'Maximize2', priority: 5 },
  ],
  tryon: [
    { id: 'background', name: 'Change Background', description: 'Place in different setting', icon: 'Camera', priority: 1 },
    { id: 'upscale', name: 'Upscale', description: 'Enhance image quality', icon: 'ArrowUpCircle', priority: 2 },
    { id: 'resize', name: 'Resize', description: 'Adjust dimensions', icon: 'Maximize2', priority: 3 },
    { id: 'poster', name: 'Social Poster', description: 'Create social media post', icon: 'FileImage', priority: 4 },
  ],
  color_change: [
    { id: 'background', name: 'Change Background', description: 'Update the background', icon: 'Camera', priority: 1 },
    { id: 'upscale', name: 'Upscale', description: 'Enhance quality', icon: 'ArrowUpCircle', priority: 2 },
    { id: 'resize', name: 'Resize', description: 'Adjust dimensions', icon: 'Maximize2', priority: 3 },
    { id: 'poster', name: 'Social Poster', description: 'Create social media post', icon: 'FileImage', priority: 4 },
  ],
  upscale: [
    { id: 'resize', name: 'Resize', description: 'Adjust dimensions', icon: 'Maximize2', priority: 1 },
    { id: 'background', name: 'Change Background', description: 'Update the background', icon: 'Camera', priority: 2 },
    { id: 'poster', name: 'Social Poster', description: 'Create social media post', icon: 'FileImage', priority: 3 },
  ],
  graphic_transfer: [
    { id: 'upscale', name: 'Upscale', description: 'Enhance quality', icon: 'ArrowUpCircle', priority: 1 },
    { id: 'resize', name: 'Resize', description: 'Adjust dimensions', icon: 'Maximize2', priority: 2 },
    { id: 'poster', name: 'Social Poster', description: 'Create social media post', icon: 'FileImage', priority: 3 },
  ],
  resize: [
    { id: 'upscale', name: 'Upscale', description: 'Enhance quality', icon: 'ArrowUpCircle', priority: 1 },
    { id: 'background', name: 'Change Background', description: 'Update the background', icon: 'Camera', priority: 2 },
    { id: 'poster', name: 'Social Poster', description: 'Create social media post', icon: 'FileImage', priority: 3 },
  ],
  background: [
    { id: 'upscale', name: 'Upscale', description: 'Enhance quality', icon: 'ArrowUpCircle', priority: 1 },
    { id: 'resize', name: 'Resize', description: 'Adjust dimensions', icon: 'Maximize2', priority: 2 },
    { id: 'lifestyle', name: 'Lifestyle Shot', description: 'Create lifestyle scene', icon: 'Camera', priority: 3 },
    { id: 'poster', name: 'Social Poster', description: 'Create social media post', icon: 'FileImage', priority: 4 },
  ],
  lifestyle: [
    { id: 'upscale', name: 'Upscale', description: 'Enhance quality', icon: 'ArrowUpCircle', priority: 1 },
    { id: 'resize', name: 'Resize', description: 'Adjust dimensions', icon: 'Maximize2', priority: 2 },
    { id: 'poster', name: 'Social Poster', description: 'Create social media post', icon: 'FileImage', priority: 3 },
    { id: 'video', name: 'Video Gen', description: 'Animate this scene', icon: 'Video', priority: 4 },
  ],
  video: [
    { id: 'resize', name: 'Resize', description: 'Adjust dimensions', icon: 'Maximize2', priority: 1 },
  ],
  poster: [
    { id: 'resize', name: 'Resize', description: 'Try different size', icon: 'Maximize2', priority: 1 },
  ],
};

export function getNextWorkflows(currentWorkflow: string): WorkflowRelationship[] {
  return workflowRelationships[currentWorkflow] || [];
}

export function getTopSuggestions(currentWorkflow: string, count: number = 3): WorkflowRelationship[] {
  const suggestions = getNextWorkflows(currentWorkflow);
  return suggestions.slice(0, count);
}
