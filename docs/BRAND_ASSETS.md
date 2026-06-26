# Brand Assets & AI Generation Prompts

Everything here is tuned to the brand: **light into dark — gold shafts drifting
through deep navy.** Reverent, cinematic, painterly. Never cheesy, never literal.

## How to use this file
1. Pick the asset you need below.
2. Copy the **House Style** block, then paste the specific prompt after it.
3. Generate, pick the best, drop the file at the **Save to** path.
4. For video, export H.264 `.mp4` (and ideally a `.webm`), 1080p+, 8–15s loop.

---

## 🎨 House Style (prepend to EVERY prompt)

```
Cinematic, reverent, painterly. Deep navy background (#0a0f1d to #0d1426),
warm gold accents (#c79a4b, #e0c483), soft cream highlights (#f4efe4).
Volumetric gold light shafts / god-rays drifting through darkness.
Chiaroscuro lighting, Rembrandt key light, anamorphic depth, subtle film grain,
shallow focus, atmospheric haze. Light emerging from dark is the theme.
Elegant, sacred, understated. No text, no logos, no watermarks.
```

### 🚫 Negative prompt (for tools that support it — Flux, SDXL, etc.)
```
text, words, letters, watermark, logo, signature, cartoon, anime, cheesy,
oversaturated, neon, garish, stock-photo cliché, glowing white robed figure,
lens flare overload, low quality, blurry, distorted hands, extra fingers,
plastic skin, HDR halo, clipart, meme
```

> **Tool tips:**
> - **Images:** Midjourney v6 (`--style raw --ar <ratio>`), Flux 1.1 Pro, DALL·E 3, Ideogram (best if you ever need text baked in).
> - **Video:** Runway Gen-3, Google Veo, Sora, Kling, Luma, Pika. Use the still image as a start-frame for consistency ("image-to-video").
> - Generate stills first, then animate the ones you love into loops.

---

## 1. ⭐ Hero background video loop (the signature piece)

**Save to:** `public/media/hero-loop.mp4` (+ `hero-loop.webm`) · **16:9, 10–15s seamless loop, muted**
Already wired into the homepage hero — it auto-fades in over the image and respects reduced-motion.

**Image start-frame prompt:**
```
[House Style] An abstract cinematic atmosphere: slow-drifting volumetric gold
light shafts descending through a vast dark navy space, fine dust motes
suspended and glinting in the beams, soft haze, deep shadow, a faint warm glow
near the horizon as if dawn is breaking in a cathedral. Minimal, no subject,
pure mood. Ultra-wide, anamorphic, film grain.
```

**Then animate (image-to-video):**
```
Very slow, subtle motion: the gold light shafts drift gently left to right,
dust motes float slowly upward, the haze breathes. Calm, hypnotic, seamless
loop. No camera cuts, minimal camera drift. 12 seconds.
```

**Alternative live-action concept (if shooting/handheld footage):**
```
[House Style] Slow-motion macro of warm golden light passing through a dusty
dark room, sunbeams through a high window, particles floating. Or: a film
projector beam cutting through darkness in an empty cinema, dust in the light.
```

---

## 2. Light-shaft overlay loops (optional, for section backgrounds)

**Save to:** `public/media/shaft-loop.webm` · **transparent or black, additive-blend**
Use behind the mission and premiere sections for extra life (overlay at low opacity).

```
[House Style] Isolated soft gold volumetric light beams on pure black
background, slowly drifting and shimmering, dust particles, meant to be used as
an additive overlay. Seamless loop, no subject, no text.
```

---

## 3. Film posters (2:3 portrait)

**Save to:** Supabase Storage → set as each film's `poster_url`. **`--ar 2:3`**

### The Witness
```
[House Style] Movie poster, 2:3. A lone man standing in a dark city alley at
night, lit from above by a single shaft of warm gold light breaking through,
his face half in shadow half in light, expression resolved and weary. Wet
pavement reflecting gold. Cinematic, moody, painterly. Space at the top for a
title. No text.
```

### Living Water
```
[House Style] Movie poster, 2:3. Cracked drought earth under a vast dark sky,
a single figure at an ancient stone well, a thread of luminous gold water /
light rising from the well into the dark. Hopeful, sacred, minimal. Warm gold
against deep navy. No text.
```

### The Prodigal Road
```
[House Style] Movie poster, 2:3. A long empty road at dusk vanishing into deep
navy darkness, a distant warm gold porch light glowing far ahead, a lone
silhouette walking toward it. Longing, redemption, cinematic. No text.
```

> **Poster recipe that always works:** one human silhouette + one source of gold
> light + lots of negative dark space + room at the top for the title.

---

## 4. Backdrops (16:9 wide, used behind film hero pages)

**Save to:** Supabase Storage → film `backdrop_url`. **`--ar 16:9`**, will sit at ~25% opacity behind text.

```
[House Style] Wide cinematic establishing shot for "<FILM>": <scene>. Lots of
dark negative space on the left for text overlay, the gold light source on the
right third. Atmospheric haze, shallow depth, film grain. No text, no people in
the dead-center.
```
Fill `<scene>` per film (e.g. Witness → rain-soaked night city; Living Water →
desert well at golden hour; Prodigal → the road home at dusk).

---

## 5. Brand illustrations — "Evangelists who carry cameras"

**Save to:** `public/illustrations/` · use on About, mission, and empty states.
Choose ONE consistent illustration style and reuse it everywhere.

**Style options (pick one and lock it in):**
- **Engraved / etched gold-line** on navy (feels sacred, timeless, like an old Bible plate).
- **Soft painterly / gouache** with gold leaf accents.
- **Minimal geometric line-art** in gold on navy.

### Signature motif
```
[House Style] Elegant <chosen style> illustration: a figure holding a film
camera that emits a beam of warm gold light into surrounding darkness, the beam
forming a path / open door. Symbolic of carrying light into dark places. Gold
line on deep navy. Iconic, simple, no text.
```

### Supporting spot illustrations (same style, for sections)
```
- An open cinema door with gold light pouring out into a dark street.
- A single seat in a dark cinema lit by the screen's gold glow.
- Two hands, one reaching from light into the dark to another — "the hand-off".
- A film reel that unspools into a path of light.
- A countdown / clock made of light for premieres.
```

---

## 6. Texture & grain (subtle, site-wide polish)

**Save to:** `public/textures/` · use at very low opacity (2–6%).
```
[House Style] Seamless subtle film grain / dust / fine paper texture, warm gold
flecks on transparent, tileable, very low contrast. For overlay only.
```
(The site already ships a CSS noise grain; this is only if you want a richer one.)

---

## 7. Social / Open Graph share cards (1200×630)

**Save to:** `public/og/` · referenced in page metadata for WhatsApp/X/Facebook previews.
**`--ar 1.91:1`** (1200×630). These need text — use **Ideogram** or add text in Canva/Figma after.
```
[House Style] Social share card, 1200x630. Left two-thirds: a gold light shaft
through navy darkness, room for a title. Leave clean dark space for overlaid
text "<headline>". Cinematic, premium. (Add the wordmark + headline in design
tool afterward.)
```
Make one generic (the site) + one per featured film.

---

## 8. Wordmark / logo refinement (optional)

**Save to:** `public/brand/` · for a proper SVG logo to replace the text wordmark.
```
[House Style] Minimalist logo concept for "Uriel Maforikan Productions": a
single elegant gold light shaft or an abstract camera-aperture forming a beam
of light, refined, sacred, works on dark backgrounds, vector-clean. Monogram
"UM" option as a gold light-aperture mark. No literal cross.
```
> For the final logo, hand the best concept to a designer to vectorize as SVG —
> AI raster logos shouldn't ship as the real mark.

---

## Placement cheat-sheet

| Asset | File / destination | Used on |
|-------|--------------------|---------|
| Hero loop video | `public/media/hero-loop.mp4` | Homepage hero |
| Shaft overlay loop | `public/media/shaft-loop.webm` | Section backgrounds |
| Film poster (2:3) | Supabase Storage → `films.poster_url` | Cards, film & watch pages |
| Film backdrop (16:9) | Supabase Storage → `films.backdrop_url` | Film hero, homepage hero |
| Cast/crew photos | Supabase Storage → `credits.photo_url` | Film detail |
| Illustrations | `public/illustrations/` | About, mission, empty states |
| OG cards | `public/og/` | Link previews / SEO |
| Logo SVG | `public/brand/` | Nav, footer, favicon |

## Workflow tip
Generate **stills first**, get the palette and mood locked across a few images,
*then* animate only the hero into video. Keeping one start-frame style across all
films makes the whole cinema feel like one brand instead of a stock-photo grab bag.
```
