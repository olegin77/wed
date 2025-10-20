# Media minification pipeline

The `@wt/media` package provides helpers for generating responsive, optimised image variants for vendor uploads and marketing
assets.

## API surface

- `minifyImage(buffer, options)` – produces a single optimised output in the requested format (JPEG/WebP/AVIF/PNG) and supports
  resizing, progressive encoding, and transparent backgrounds.
- `minifyVariants(buffer, variants)` – batches multiple output definitions (e.g. 480/960/1440 widths) while reusing Sharp, making
  scheduled thumbnail generation straightforward.
- `extractMetadata(buffer)` – returns base width/height/format information without writing to disk, useful for validation flows.

All helpers degrade gracefully: when Sharp is unavailable, the original buffer is returned so the pipeline still succeeds in local
or CI environments without native dependencies.

## Recommended presets

```ts
import { minifyVariants } from "@wt/media";

const variants = await minifyVariants(buffer, [
  { width: 480, format: "webp", quality: 70 },
  { width: 960, format: "jpeg", quality: 75 },
  { width: 1440, format: "avif", quality: 60 },
]);
```

Each result entry includes the encoded buffer and metadata (format, size, output dimensions) so uploaders can persist and audit the
transformation results.
