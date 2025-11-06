# Backend Team Requirements

## Overview
ShootX is an AI-powered image generation platform that requires a backend API to connect the frontend React application with ComfyUI workflows running on RunPod.

## Technology Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Storage**: Supabase Storage for image files
- **Compute**: RunPod for ComfyUI workload execution

## Core Responsibilities

### 1. Database Management
The database schema is already defined in Supabase migrations. Your responsibilities:

- Maintain and optimize database queries
- Ensure RLS (Row Level Security) policies are enforced
- Monitor database performance
- Handle data backups and recovery

### 2. API Endpoints Required

#### Job Submission Endpoint
- **POST** `/api/v1/generate`
- Receives workflow requests from frontend
- Validates user authentication and credits
- Submits job to RunPod/ComfyUI
- Returns generation ID for tracking

**Request Body:**
```json
{
  "workflow_type": "string",
  "user_id": "uuid",
  "input_data": {
    "...workflow-specific parameters"
  },
  "settings": {
    "method": "string",
    "output_count": "number",
    "output_format": "string"
  }
}
```

**Response:**
```json
{
  "generation_id": "uuid",
  "status": "processing",
  "estimated_time": "number (seconds)"
}
```

#### Job Status Endpoint
- **GET** `/api/v1/status/{generation_id}`
- Polls ComfyUI job status
- Returns current processing status

**Response:**
```json
{
  "generation_id": "uuid",
  "status": "processing|completed|failed",
  "progress": "number (0-100)",
  "image_urls": ["string"],
  "error": "string|null"
}
```

#### Webhook Endpoint
- **POST** `/api/v1/webhook/comfyui`
- Receives completion notifications from RunPod
- Updates database with results
- Triggers user notifications if enabled

### 3. Credit Management

- Deduct credits before job submission
- Refund credits if job fails
- Track credit transactions in `credit_transactions` table
- Implement credit purchase/top-up API

### 4. Image Storage

- Upload generated images to Supabase Storage
- Generate signed URLs for secure access
- Implement image cleanup for old/unused images
- Organize images by user_id and generation_id

### 5. Error Handling

- Handle RunPod API failures gracefully
- Implement retry logic for transient failures
- Log all errors for debugging
- Return user-friendly error messages

### 6. Security

- Validate all user inputs
- Implement rate limiting per user
- Secure API keys (RunPod, Supabase) in environment variables
- Use HTTPS for all communications
- Implement request signing for webhook verification

## Database Schema

### Key Tables

#### `profiles`
- User profile information
- Linked to Supabase Auth users

#### `generations`
- Stores all generation requests and results
- Fields: `user_id`, `generation_type`, `status`, `input_data`, `output_urls`, `external_job_id`

#### `credits`
- User credit balances
- Updated on generation and purchase

#### `credit_transactions`
- Audit log of all credit changes

#### `subscriptions`
- User subscription information
- Links to `billing_plans`

## Environment Variables Required

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx
RUNPOD_API_KEY=xxx
RUNPOD_API_URL=https://api.runpod.io/v2
COMFYUI_ENDPOINT_ID=xxx
STORAGE_BUCKET=shootx-images
```

## Performance Requirements

- Job submission: < 500ms response time
- Status polling: < 200ms response time
- Support concurrent processing for 100+ users
- Handle 1000+ generations per hour

## Monitoring & Logging

- Log all API requests/responses
- Monitor job success/failure rates
- Track average generation times
- Alert on error rate > 5%
- Monitor credit balance anomalies

## Testing Requirements

- Unit tests for all endpoints
- Integration tests with mock ComfyUI responses
- Load testing for concurrent users
- Security testing for authentication/authorization
