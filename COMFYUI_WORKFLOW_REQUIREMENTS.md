# ComfyUI Workflow Requirements

## Overview
This document provides detailed specifications for each ComfyUI workflow that needs to be designed and deployed on RunPod. Each workflow must accept specific inputs and produce standardized outputs.

---

## Global Options & LLM Detection

### Overview
The system includes global intelligence capabilities that work across all workflows through LLM-based detection. These options describe what the system is capable of understanding and generating automatically, **without showing sub-options in the UI**.

### Product Categories (Auto-Detected by LLM)

The LLM automatically detects product types and sub-types from uploaded images. The frontend never displays these categories to users - they are resolved internally by the backend/LLM system.

**Supported Product Categories:**

#### 1. Apparel
- Tops: shirts, t-shirts, blouses, sweaters, hoodies, jackets
- Bottoms: pants, jeans, shorts, skirts, leggings
- Dresses: casual, formal, cocktail, evening, maxi, mini
- Ethnic wear: sarees, kurtas, salwar, lehenga, sherwani
- Outerwear: coats, blazers, parkas, windbreakers
- Footwear: shoes, sneakers, boots, sandals, heels
- Lingerie: bras, underwear, sleepwear, loungewear
- Bridal: wedding dresses, bridal accessories
- Activewear: sports clothing, yoga wear, gym wear

#### 2. Jewelry
- Neck: necklaces, chains, pendants, chokers
- Ears: earrings, studs, hoops, danglers
- Wrist: bracelets, bangles, cuffs
- Fingers: rings, bands, statement rings
- Nose: nose rings, studs, septum jewelry
- Face: face chains, tikkas, headpieces
- Anklets: ankle bracelets, toe rings
- Watches: analog, digital, smart watches

#### 3. Accessories
- Eyewear: glasses, sunglasses, reading glasses
- Belts: leather belts, fabric belts, chain belts
- Scarves: silk scarves, wool scarves, bandanas
- Bags: handbags, backpacks, clutches, totes, crossbody
- Masks: face masks, decorative masks
- Hats: caps, beanies, fedoras, sun hats
- Socks: ankle socks, knee-high, compression
- Gloves: winter gloves, fashion gloves
- Headphones: over-ear, in-ear, earbuds

#### 4. Objects & Tech
- Phone accessories: cases, skins, grips, stands
- Laptop accessories: skins, cases, sleeves
- Straps: watch straps, camera straps
- Gadgets: smart devices, electronics
- Wearable tech: fitness trackers, smart watches

#### 5. Home & Furniture
- Upholstery: sofa fabrics, chair covers
- Window treatments: curtains, drapes, blinds
- Bedding: sheets, comforters, pillows
- Rugs: area rugs, runners, mats
- Table coverings: tablecloths, placemats

#### 6. Automobile
- Seat covers: leather, fabric, custom
- Vehicle wraps: full wraps, partial wraps, decals
- Wheels: rims, hubcaps, wheel covers
- Lighting: LED strips, headlights, underglow
- Trim: interior trim, exterior accents
- Parts: body parts, spoilers, grilles

#### 7. Cosmetics & Beauty
- Makeup: lipstick, eyeshadow, foundation
- Hair: hair color, highlights, wigs
- Nails: nail polish, nail art, extensions
- Face art: temporary tattoos, face paint
- Body: body paint, temporary tattoos

#### 8. Pets
- Collars: dog collars, cat collars
- Pet clothing: sweaters, costumes, coats
- Harnesses: walking harnesses, vests
- Accessories: bows, bandanas, pet jewelry

### Detection Methods

#### Automatic Mode (Default)
- **LLM analyzes** the uploaded image
- **Detects** product type and sub-type automatically
- **Sends** the correct processing instructions to ComfyUI
- **No user interaction** required for categorization
- **Example**: User uploads image of a t-shirt → LLM detects "apparel/tops/t-shirt" → Applies appropriate processing

#### Manual Mode (Optional Override)
- User selects **high-level categories only** (e.g., "Apparel", "Jewelry")
- **Sub-types still auto-inferred** by LLM based on image
- Provides user control when needed
- **Example**: User selects "Jewelry" → LLM still detects specific type (necklace vs ring)

### Implementation Notes

**CRITICAL**: Sub-options and detailed categories **NEVER appear on the frontend**. They are:
- Resolved internally by the LLM/backend
- Used for processing instructions to ComfyUI
- Invisible to end users
- Part of the backend intelligence layer

The frontend only needs to:
1. Upload the image
2. Optionally allow high-level category selection
3. Display results

All product detection and categorization happens server-side.

---

## Prompt Behaviour & AI Generation

### Auto-Generated Prompt Variations

**RULE**: Whenever any workflow accepts prompts as an input type, the system **MUST automatically generate 6 prompt variations** by default.

### How It Works

1. **User uploads image** → LLM analyzes image context, product type, background, lighting, style
2. **System generates 6 prompts** based on:
   - Uploaded image characteristics
   - Product type detected
   - Current workflow context
   - Industry best practices
3. **User reviews and selects** from the 6 variations
4. **User can optionally edit** any prompt before generation
5. **System uses selected prompt** for generation

### Prompt Generation Requirements

**Input to LLM Prompt Generator:**
```json
{
  "image": "base64_or_url",
  "workflow_type": "model|lifestyle|background|etc",
  "product_type": "detected_category",
  "user_context": "optional_user_input"
}
```

**Output from LLM:**
```json
{
  "prompts": [
    "Variation 1: Detailed, specific prompt",
    "Variation 2: Alternative style prompt",
    "Variation 3: Different mood prompt",
    "Variation 4: Professional context prompt",
    "Variation 5": "Creative variation prompt",
    "Variation 6": "Unique angle prompt"
  ]
}
```

### Applicable Workflows

This prompt generation system applies to:

1. **Human Model Generation** (Prompt mode)
   - Generates 6 model pose/style variations
   - Based on intended product use

2. **Background Generation/Replacement** (AI Prompts mode)
   - Generates 6 background suggestions
   - Based on product and context

3. **Lifestyle Scene Generation** (Prompt-enabled templates)
   - Generates 6 scene/context variations
   - Based on product placement

4. **Video Generation** (Prompt-driven variations)
   - Generates 6 motion/style variations
   - Based on image content

5. **Social Media Poster** (When using AI mode)
   - Generates 6 design style variations
   - Based on platform and content

6. **Any workflow where prompts drive creative direction**

### UI Behavior

**Display:**
- Show all 6 prompts in a selectable list
- Highlight selected prompt
- Show edit button for each prompt
- Allow regeneration of all 6 prompts

**Example UI Flow:**
```
1. User uploads product image
2. System shows: "Generating prompt suggestions..." (loading state)
3. System displays 6 prompts:
   ○ "Modern minimalist studio with soft shadows"
   ○ "Professional office with glass walls"
   ○ "Urban rooftop terrace with city skyline"
   ○ "Natural outdoor garden with morning light"
   ○ "Contemporary art gallery with white walls"
   ○ "Luxury hotel lobby with marble floors"
4. User clicks to select one
5. User can click "Edit" to modify
6. User can click "Regenerate" for 6 new suggestions
7. User proceeds with selected prompt
```

### Quality Standards for Generated Prompts

Each generated prompt must be:
- **Specific**: Include concrete details (materials, lighting, mood)
- **Relevant**: Match the product type and use case
- **Diverse**: Each of 6 variations should be meaningfully different
- **Professional**: Use industry-standard terminology
- **Actionable**: Provide clear direction for image generation
- **Contextual**: Consider the workflow and end goal

### Example Prompt Sets

**For Apparel Background Replacement:**
1. "Clean white studio backdrop with soft diffused lighting and subtle shadows"
2. "Modern urban street scene with graffiti wall and natural daylight"
3. "Minimalist concrete interior with industrial metal accents and directional light"
4. "Vibrant outdoor park setting with green foliage and golden hour sunlight"
5. "Elegant marble showroom with spotlights and reflective surfaces"
6. "Cozy home interior with warm ambient lighting and textured walls"

**For Jewelry Product Shots:**
1. "Luxury velvet display with dramatic side lighting and dark background"
2. "Clean white surface with soft overhead lighting and minimal shadows"
3. "Reflective black acrylic with spotlight creating dramatic highlights"
4. "Natural stone surface with indirect sunlight and organic textures"
5. "Silk fabric backdrop with gradient lighting and elegant draping"
6. "Minimalist geometric display with architectural lighting and modern aesthetic"

---

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
