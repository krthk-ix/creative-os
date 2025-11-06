# ComfyUI Workflow Requirements

## Overview
This document provides detailed specifications for each ComfyUI workflow that needs to be designed and deployed on RunPod. Each workflow must accept specific inputs and produce standardized outputs.

## General Requirements

### Input Format
All workflows must accept JSON input with the following structure:
```json
{
  "workflow_type": "string",
  "input": { ...workflow-specific-params },
  "num_outputs": 2,
  "output_format": "webp"
}
```

### Output Format
All workflows must return:
```json
{
  "images": ["base64_string_or_url"],
  "metadata": {
    "resolution": "1024x1024",
    "format": "webp",
    "generation_time": 15.2
  }
}
```

### Quality Standards
- Output resolution: Minimum 1024x1024 pixels
- Image quality: High (85%+ quality for lossy formats)
- Processing time: Target < 30 seconds per generation
- Batch support: Generate 1-4 images per request

---

## Workflow 1: Human Model Generation

### Workflow ID
`model`

### Description
Generate AI human models with specified characteristics for product photography and advertisements.

### Input Parameters
```json
{
  "gender": "male|female|non-binary",
  "pose": "standing|sitting|walking|action",
  "age_range": "18-25|25-35|35-50|50+",
  "ethnicity": "caucasian|asian|african|hispanic|mixed",
  "clothing_style": "casual|formal|athletic|fashion",
  "background": "studio_white|studio_gray|natural|custom"
}
```

### Use Case Example
**Scenario**: E-commerce brand needs diverse models for product catalog
**Input**:
```json
{
  "gender": "female",
  "pose": "standing",
  "age_range": "25-35",
  "ethnicity": "asian",
  "clothing_style": "casual",
  "background": "studio_white"
}
```
**Expected Output**: Full-body human model, studio lighting, white background, photorealistic quality

### Technical Notes
- Must support full body generation
- Consistent lighting across all poses
- Face must be photorealistic and detailed
- Hands should be properly rendered

---

## Workflow 2: Virtual Try-On

### Workflow ID
`tryon`

### Description
Place garments/products on human models realistically, maintaining fabric properties and fit.

### Input Parameters
```json
{
  "model_image": "base64_string_or_url",
  "garment_image": "base64_string_or_url",
  "garment_type": "top|bottom|dress|outerwear|accessory",
  "fit_adjustment": "tight|regular|loose"
}
```

### Use Case Example
**Scenario**: Fashion brand wants to show how a t-shirt looks on different models
**Input**:
```json
{
  "model_image": "https://example.com/model.jpg",
  "garment_image": "https://example.com/tshirt.jpg",
  "garment_type": "top",
  "fit_adjustment": "regular"
}
```
**Expected Output**: Model wearing the garment naturally, proper draping, realistic shadows and wrinkles

### Technical Notes
- Preserve garment texture and patterns
- Maintain proper proportions and perspective
- Generate realistic wrinkles and folds
- Handle occlusion correctly (arms over garment, etc.)
- Support transparent backgrounds on garment input

---

## Workflow 3: Color Change

### Workflow ID
`color_change`

### Description
Change the color of specific objects or areas in an image while preserving texture and lighting.

### Input Parameters
```json
{
  "input_image": "base64_string_or_url",
  "target_color": "#FF5733",
  "mask": "base64_mask_image_optional",
  "preserve_texture": true,
  "maintain_shadows": true
}
```

### Use Case Example
**Scenario**: Show product in multiple color variations
**Input**:
```json
{
  "input_image": "https://example.com/red-shoe.jpg",
  "target_color": "#0000FF",
  "preserve_texture": true,
  "maintain_shadows": true
}
```
**Expected Output**: Same shoe in blue color, leather texture preserved, lighting and shadows maintained

### Technical Notes
- Must preserve material properties (shine, roughness)
- Maintain original lighting and shadows
- Handle gradients naturally
- Support both RGB hex and RGB values

---

## Workflow 4: Image Upscale

### Workflow ID
`upscale`

### Description
Enhance image resolution while adding realistic details and improving quality.

### Input Parameters
```json
{
  "input_image": "base64_string_or_url",
  "upscale_level": 2|4|8,
  "enhance_face": true|false,
  "denoise_strength": 0.0-1.0,
  "add_details": true|false
}
```

### Use Case Example
**Scenario**: Enhance low-resolution product photo for large format printing
**Input**:
```json
{
  "input_image": "https://example.com/low-res-product.jpg",
  "upscale_level": 4,
  "enhance_face": false,
  "add_details": true
}
```
**Expected Output**: 4x larger image with enhanced details, sharp edges, no artifacts

### Technical Notes
- Use Real-ESRGAN or similar models
- Optional face enhancement for portraits
- Avoid over-sharpening
- Maintain color accuracy

---

## Workflow 5: Graphic Transfer

### Workflow ID
`graphic_transfer`

### Description
Place graphics, logos, or designs onto products maintaining perspective and surface properties.

### Input Parameters
```json
{
  "base_image": "base64_string_or_url",
  "graphic_image": "base64_string_or_url",
  "position": {"x": 0.5, "y": 0.5},
  "scale": 1.0,
  "blend_mode": "multiply|overlay|normal",
  "match_perspective": true
}
```

### Use Case Example
**Scenario**: Place custom logo on t-shirt mockup
**Input**:
```json
{
  "base_image": "https://example.com/plain-tshirt.jpg",
  "graphic_image": "https://example.com/logo.png",
  "position": {"x": 0.5, "y": 0.4},
  "scale": 0.3,
  "match_perspective": true
}
```
**Expected Output**: Logo placed on t-shirt with proper perspective, fabric texture applied to graphic

### Technical Notes
- Support transparent PNGs for graphics
- Apply surface deformation to match base image
- Maintain graphic quality
- Handle curved surfaces

---

## Workflow 6: Resize Photo

### Workflow ID
`resize`

### Description
Intelligently resize images to specific dimensions using content-aware fill or crop.

### Input Parameters
```json
{
  "input_image": "base64_string_or_url",
  "target_width": 1920,
  "target_height": 1080,
  "maintain_aspect": true|false,
  "fill_mode": "stretch|crop|content_aware|letterbox"
}
```

### Use Case Example
**Scenario**: Resize portrait image to landscape format for banner
**Input**:
```json
{
  "input_image": "https://example.com/portrait.jpg",
  "target_width": 1920,
  "target_height": 1080,
  "maintain_aspect": false,
  "fill_mode": "content_aware"
}
```
**Expected Output**: Image resized to 1920x1080, extended naturally using AI inpainting

### Technical Notes
- Use content-aware fill for dimension changes
- Preserve main subject in frame
- Seamless edge extension
- Support multiple fill modes

---

## Workflow 7: Background Generation/Replacement

### Workflow ID
`background`

### Description
Remove or replace image backgrounds with AI-generated scenes matching a description.

### Input Parameters
```json
{
  "input_image": "base64_string_or_url",
  "prompt": "modern office interior, natural lighting",
  "style": "photorealistic|artistic|minimal|abstract",
  "remove_only": false,
  "match_lighting": true
}
```

### Use Case Example
**Scenario**: Place product in lifestyle environment
**Input**:
```json
{
  "input_image": "https://example.com/headphones.jpg",
  "prompt": "modern workspace with laptop and coffee, morning light",
  "style": "photorealistic",
  "match_lighting": true
}
```
**Expected Output**: Headphones placed in generated workspace scene, lighting matched, realistic integration

### Technical Notes
- Accurate background removal/segmentation
- Generate backgrounds from text prompts
- Match lighting and perspective
- Realistic shadows and reflections

---

## Workflow 8: Lifestyle Scene Generation

### Workflow ID
`lifestyle`

### Description
Place products in realistic lifestyle scenes with proper context and environment.

### Input Parameters
```json
{
  "product_image": "base64_string_or_url",
  "scene": "living_room|office|outdoor|studio|kitchen|bedroom",
  "lighting": "natural|studio|dramatic|soft",
  "time_of_day": "morning|afternoon|evening|night",
  "style": "modern|rustic|minimalist|luxury"
}
```

### Use Case Example
**Scenario**: Show smartwatch in lifestyle context
**Input**:
```json
{
  "product_image": "https://example.com/smartwatch.jpg",
  "scene": "office",
  "lighting": "natural",
  "time_of_day": "morning",
  "style": "modern"
}
```
**Expected Output**: Smartwatch on wrist in modern office setting, morning natural light, professional context

### Technical Notes
- Generate contextually appropriate scenes
- Include complementary objects
- Proper product placement and scale
- Photorealistic rendering

---

## Workflow 9: Video Generation

### Workflow ID
`video`

### Description
Generate short video clips from still images with motion and transitions.

### Input Parameters
```json
{
  "input_images": ["base64_or_url"],
  "duration": 5,
  "transition": "fade|slide|zoom|morph",
  "motion": "pan|zoom|rotate|none",
  "fps": 30,
  "format": "mp4|gif"
}
```

### Use Case Example
**Scenario**: Create product showcase video from multiple angles
**Input**:
```json
{
  "input_images": [
    "https://example.com/product-front.jpg",
    "https://example.com/product-side.jpg",
    "https://example.com/product-back.jpg"
  ],
  "duration": 9,
  "transition": "morph",
  "fps": 30
}
```
**Expected Output**: 9-second video showing product from all angles with smooth transitions

### Technical Notes
- Support image-to-video conversion
- Smooth interpolation between frames
- Support multiple transition types
- Output in MP4 format (H.264 codec)

---

## Workflow 10: Social Media Poster

### Workflow ID
`poster`

### Description
Create social media posts with proper dimensions, layouts, and optional text overlays.

### Input Parameters
```json
{
  "input_image": "base64_string_or_url",
  "platform": "instagram_post|instagram_story|facebook|twitter|linkedin",
  "dimensions": {"width": 1080, "height": 1080},
  "text_overlay": {
    "text": "string",
    "position": "top|center|bottom",
    "font": "bold|regular|elegant",
    "color": "#FFFFFF"
  },
  "style": "minimal|vibrant|professional|artistic"
}
```

### Use Case Example
**Scenario**: Create Instagram post from product photo
**Input**:
```json
{
  "input_image": "https://example.com/product.jpg",
  "platform": "instagram_post",
  "text_overlay": {
    "text": "New Arrival",
    "position": "top",
    "font": "bold",
    "color": "#FFFFFF"
  },
  "style": "vibrant"
}
```
**Expected Output**: 1080x1080 Instagram-optimized image with text overlay, vibrant colors, product centered

### Technical Notes
- Platform-specific dimensions
- Text overlay with proper readability
- Support multiple text positions
- Maintain image quality for social media

---

## Platform Integration

### RunPod Setup
1. Deploy each workflow as a separate serverless endpoint
2. Configure auto-scaling based on queue depth
3. Set up GPU instances (minimum RTX 3090 or equivalent)
4. Enable webhook notifications for job completion

### API Response Format
```json
{
  "status": "IN_QUEUE|IN_PROGRESS|COMPLETED|FAILED",
  "progress": 0-100,
  "output": {
    "images": ["https://cdn.example.com/output1.webp"],
    "metadata": {
      "resolution": "1024x1024",
      "format": "webp",
      "generation_time": 15.2,
      "seed": 12345
    }
  },
  "error": null
}
```

### Error Handling
Return appropriate error messages:
- `INVALID_INPUT` - Input parameters invalid
- `INSUFFICIENT_RESOLUTION` - Input image too small
- `TIMEOUT` - Generation exceeded time limit
- `GPU_ERROR` - Hardware failure

## Performance Targets

| Workflow | Target Time | Max Time |
|----------|-------------|----------|
| Model Generation | 20s | 45s |
| Virtual Try-On | 25s | 60s |
| Color Change | 10s | 30s |
| Upscale | 15s | 45s |
| Graphic Transfer | 12s | 35s |
| Resize | 8s | 20s |
| Background | 20s | 50s |
| Lifestyle | 25s | 60s |
| Video | 45s | 120s |
| Poster | 10s | 30s |

## Testing Checklist

For each workflow:
- [ ] Accepts all specified input parameters
- [ ] Returns output in correct format
- [ ] Handles missing optional parameters gracefully
- [ ] Returns appropriate errors for invalid inputs
- [ ] Meets performance targets
- [ ] Produces high-quality, photorealistic results
- [ ] Handles edge cases (extreme ratios, colors, etc.)
- [ ] Works with different image formats (JPG, PNG, WEBP)
- [ ] Batch processing (1-4 images) works correctly

## Support & Questions

For technical questions about workflow implementation:
1. Review this requirements document thoroughly
2. Check ComfyUI official documentation
3. Test with sample inputs provided in examples
4. Document any limitations or issues discovered
