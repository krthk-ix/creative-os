import { supabase } from '../lib/supabase';

const COMFYUI_API_URL = import.meta.env.VITE_COMFYUI_API_URL || 'https://api.runpod.io/v2';
const COMFYUI_API_KEY = import.meta.env.VITE_COMFYUI_API_KEY || '';

export interface WorkflowRequest {
  workflowType: string;
  userId: string;
  inputData: Record<string, unknown>;
  settings: {
    method?: string;
    outputCount?: number;
    outputFormat?: string;
  };
}

export interface WorkflowResponse {
  generationId: string;
  status: 'processing' | 'completed' | 'failed';
  imageUrls?: string[];
  error?: string;
}

export interface ComfyUIJobPayload {
  workflow_type: string;
  input: Record<string, unknown>;
  num_outputs: number;
  output_format: string;
}

export interface ComfyUIJobResponse {
  id: string;
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  output?: {
    images: string[];
  };
  error?: string;
}

class ComfyUIService {
  private async makeRequest(endpoint: string, method: string, data?: unknown): Promise<unknown> {
    try {
      const response = await fetch(`${COMFYUI_API_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${COMFYUI_API_KEY}`,
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ComfyUI API Error:', error);
      throw error;
    }
  }

  async submitWorkflow(request: WorkflowRequest): Promise<WorkflowResponse> {
    try {
      const { data: generation, error: dbError } = await supabase
        .from('generations')
        .insert({
          user_id: request.userId,
          generation_type: request.workflowType,
          method: request.settings.method || 'automatic',
          input_data: request.inputData,
          status: 'processing',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const payload: ComfyUIJobPayload = {
        workflow_type: request.workflowType,
        input: this.prepareWorkflowInput(request.workflowType, request.inputData),
        num_outputs: request.settings.outputCount || 2,
        output_format: request.settings.outputFormat || 'webp',
      };

      const jobResponse = await this.makeRequest('/run', 'POST', payload) as ComfyUIJobResponse;

      await supabase
        .from('generations')
        .update({
          external_job_id: jobResponse.id,
        })
        .eq('id', generation.id);

      return {
        generationId: generation.id,
        status: 'processing',
      };
    } catch (error) {
      console.error('Submit workflow error:', error);
      throw error;
    }
  }

  async checkJobStatus(jobId: string): Promise<ComfyUIJobResponse> {
    try {
      const response = await this.makeRequest(`/status/${jobId}`, 'GET') as ComfyUIJobResponse;
      return response;
    } catch (error) {
      console.error('Check job status error:', error);
      throw error;
    }
  }

  async pollJobUntilComplete(
    generationId: string,
    jobId: string,
    maxAttempts = 60,
    intervalMs = 5000
  ): Promise<WorkflowResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const jobStatus = await this.checkJobStatus(jobId);

      if (jobStatus.status === 'COMPLETED' && jobStatus.output?.images) {
        await supabase
          .from('generations')
          .update({
            status: 'completed',
            output_urls: jobStatus.output.images,
            completed_at: new Date().toISOString(),
          })
          .eq('id', generationId);

        return {
          generationId,
          status: 'completed',
          imageUrls: jobStatus.output.images,
        };
      }

      if (jobStatus.status === 'FAILED') {
        await supabase
          .from('generations')
          .update({
            status: 'failed',
            error_message: jobStatus.error || 'Job failed',
          })
          .eq('id', generationId);

        return {
          generationId,
          status: 'failed',
          error: jobStatus.error,
        };
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error('Job polling timeout');
  }

  private prepareWorkflowInput(workflowType: string, inputData: Record<string, unknown>): Record<string, unknown> {
    switch (workflowType) {
      case 'model':
        return {
          gender: inputData.gender,
          pose: inputData.pose,
          age_range: inputData.ageRange,
          ethnicity: inputData.ethnicity,
        };

      case 'tryon':
        return {
          model_image: inputData.modelImage,
          garment_image: inputData.garmentImage,
          garment_type: inputData.garmentType,
        };

      case 'color_change':
        return {
          input_image: inputData.inputImage,
          target_color: inputData.targetColor,
          mask: inputData.mask,
        };

      case 'upscale':
        return {
          input_image: inputData.inputImage,
          upscale_level: inputData.upscaleLevel,
          enhance_face: inputData.enhanceFace,
        };

      case 'graphic_transfer':
        return {
          base_image: inputData.baseImage,
          graphic_image: inputData.graphicImage,
          position: inputData.position,
          scale: inputData.scale,
        };

      case 'resize':
        return {
          input_image: inputData.inputImage,
          target_width: inputData.targetWidth,
          target_height: inputData.targetHeight,
          maintain_aspect: inputData.maintainAspect,
        };

      case 'background':
        return {
          input_image: inputData.inputImage,
          prompt: inputData.prompt,
          style: inputData.style,
        };

      case 'lifestyle':
        return {
          product_image: inputData.productImage,
          scene: inputData.scene,
          lighting: inputData.lighting,
        };

      case 'video':
        return {
          input_images: inputData.inputImages,
          duration: inputData.duration,
          transition: inputData.transition,
        };

      case 'poster':
        return {
          input_image: inputData.inputImage,
          platform: inputData.platform,
          dimensions: inputData.dimensions,
          text_overlay: inputData.textOverlay,
        };

      default:
        return inputData;
    }
  }

  mapWorkflowTypeToEndpoint(workflowType: string): string {
    const mappings: Record<string, string> = {
      model: 'human-model-generation',
      tryon: 'virtual-tryon',
      color_change: 'color-change',
      upscale: 'image-upscale',
      graphic_transfer: 'graphic-transfer',
      resize: 'image-resize',
      background: 'background-generation',
      lifestyle: 'lifestyle-scene',
      video: 'video-generation',
      poster: 'social-poster',
    };

    return mappings[workflowType] || workflowType;
  }
}

export const comfyUIService = new ComfyUIService();
