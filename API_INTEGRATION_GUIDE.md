# API Integration Guide

## Overview
This document explains how to integrate the backend API with the ShootX frontend application. The frontend is already structured to support API integration through a service layer.

## Frontend Service Layer

### Location
`src/services/comfyui.ts`

This service handles all communication between frontend and backend API.

### Key Methods

#### `submitWorkflow(request: WorkflowRequest)`
Submits a new generation job to the backend.

**Usage:**
```typescript
import { comfyUIService } from '../services/comfyui';

const response = await comfyUIService.submitWorkflow({
  workflowType: 'model',
  userId: user.id,
  inputData: {
    gender: 'female',
    pose: 'standing',
    ageRange: '25-35'
  },
  settings: {
    method: 'automatic',
    outputCount: 4,
    outputFormat: 'webp'
  }
});
```

#### `checkJobStatus(jobId: string)`
Checks the status of a running job.

**Usage:**
```typescript
const status = await comfyUIService.checkJobStatus(jobId);
if (status.status === 'COMPLETED') {
  // Handle completion
}
```

#### `pollJobUntilComplete(generationId, jobId)`
Polls a job until it completes or fails.

**Usage:**
```typescript
const result = await comfyUIService.pollJobUntilComplete(
  generationId,
  jobId,
  60, // max attempts
  5000 // interval in ms
);
```

## API Endpoints to Implement

### 1. Submit Workflow Job

**Endpoint:** `POST {COMFYUI_API_URL}/run`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {COMFYUI_API_KEY}
```

**Request Body:**
```json
{
  "workflow_type": "model|tryon|color_change|upscale|graphic_transfer|resize|background|lifestyle|video|poster",
  "input": {
    ...workflow-specific-parameters
  },
  "num_outputs": 2,
  "output_format": "webp|jpg|png|avif"
}
```

**Response:**
```json
{
  "id": "job_abc123",
  "status": "IN_QUEUE"
}
```

### 2. Check Job Status

**Endpoint:** `GET {COMFYUI_API_URL}/status/{job_id}`

**Headers:**
```
Authorization: Bearer {COMFYUI_API_KEY}
```

**Response:**
```json
{
  "id": "job_abc123",
  "status": "IN_QUEUE|IN_PROGRESS|COMPLETED|FAILED",
  "output": {
    "images": ["https://..."]
  },
  "error": "string|null"
}
```

## Workflow Input Parameters

### 1. Human Model Generation (`model`)
```json
{
  "gender": "male|female|non-binary",
  "pose": "standing|sitting|walking|action",
  "age_range": "18-25|25-35|35-50|50+",
  "ethnicity": "caucasian|asian|african|hispanic|mixed"
}
```

### 2. Virtual Try-On (`tryon`)
```json
{
  "model_image": "base64_or_url",
  "garment_image": "base64_or_url",
  "garment_type": "top|bottom|dress|outerwear"
}
```

### 3. Color Change (`color_change`)
```json
{
  "input_image": "base64_or_url",
  "target_color": "#hex_color",
  "mask": "base64_mask_image_optional"
}
```

### 4. Upscale (`upscale`)
```json
{
  "input_image": "base64_or_url",
  "upscale_level": 2|4|8,
  "enhance_face": true|false
}
```

### 5. Graphic Transfer (`graphic_transfer`)
```json
{
  "base_image": "base64_or_url",
  "graphic_image": "base64_or_url",
  "position": {"x": 0, "y": 0},
  "scale": 1.0
}
```

### 6. Resize Photo (`resize`)
```json
{
  "input_image": "base64_or_url",
  "target_width": 1920,
  "target_height": 1080,
  "maintain_aspect": true|false
}
```

### 7. Background Generation (`background`)
```json
{
  "input_image": "base64_or_url",
  "prompt": "text_description",
  "style": "photorealistic|artistic|minimal"
}
```

### 8. Lifestyle Scene (`lifestyle`)
```json
{
  "product_image": "base64_or_url",
  "scene": "living_room|office|outdoor|studio",
  "lighting": "natural|studio|dramatic"
}
```

### 9. Video Generation (`video`)
```json
{
  "input_images": ["base64_or_url"],
  "duration": 5,
  "transition": "fade|slide|zoom"
}
```

### 10. Social Poster (`poster`)
```json
{
  "input_image": "base64_or_url",
  "platform": "instagram_post|instagram_story|facebook|twitter",
  "dimensions": {"width": 1080, "height": 1080},
  "text_overlay": {
    "text": "string",
    "position": "top|center|bottom"
  }
}
```

## Environment Variables

Add these to your `.env` file:

```env
VITE_COMFYUI_API_URL=https://api.runpod.io/v2
VITE_COMFYUI_API_KEY=your_runpod_api_key
```

## Error Handling

The service layer automatically handles errors and updates the database. Ensure your API returns proper error messages:

```json
{
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Integration Steps

### Step 1: Update Environment Variables
Set `VITE_COMFYUI_API_URL` and `VITE_COMFYUI_API_KEY` in `.env` file.

### Step 2: Test API Endpoints
Use the provided service layer to test API endpoints:
```typescript
const response = await comfyUIService.submitWorkflow({...});
```

### Step 3: Implement Polling
The frontend will automatically poll job status every 5 seconds until completion.

### Step 4: Handle Webhooks (Optional)
For faster updates, implement webhook callbacks from RunPod to your backend.

## Database Updates

The service layer automatically updates these database fields:

- `generations.external_job_id` - RunPod job ID
- `generations.status` - Current job status
- `generations.output_urls` - Array of generated image URLs
- `generations.error_message` - Error details if failed
- `generations.completed_at` - Completion timestamp

## Testing

Test the integration with mock responses:

```typescript
// Mock successful response
const mockResponse = {
  id: 'test_job_123',
  status: 'COMPLETED',
  output: {
    images: [
      'https://example.com/image1.webp',
      'https://example.com/image2.webp'
    ]
  }
};
```

## Troubleshooting

### Issue: API Key Invalid
- Verify `VITE_COMFYUI_API_KEY` is correct
- Check API key permissions in RunPod dashboard

### Issue: Job Stuck in Queue
- Increase polling interval
- Check RunPod pod availability
- Verify workflow type is supported

### Issue: Images Not Displaying
- Ensure image URLs are publicly accessible
- Check CORS settings on image storage
- Verify signed URL expiration

## Support

For API-related issues:
1. Check browser console for errors
2. Verify network requests in DevTools
3. Check backend logs for API failures
4. Contact backend team with generation_id
