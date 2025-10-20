# Lazy image component

`LazyImg` (`apps/svc-website/src/ui/img/LazyImg.tsx`) standardises intrinsic sizing and lazy loading for catalogue imagery.

- Always require `width` and `height` so browsers can reserve layout boxes and prevent content layout shift (CLS).
- Applies `loading="lazy"` to defer requests for off-screen assets, reducing initial payloads on slower devices.
- Extends native `<img>` props so callers can opt into `srcSet`, `sizes`, or decoding hints without reimplementing boilerplate.
- Rounds corners with the design token radius to match other card/gallery treatments by default; pass `className` to override.

## Usage

```tsx
import { LazyImg } from "../../ui/img/LazyImg";

<LazyImg
  src="/media/vendor-1.jpg"
  alt="Купольный зал с декором"
  width={800}
  height={600}
  decoding="async"
/>
```

Placeholders or skeletons should reserve equal dimensions to avoid layout jumps while the image downloads.
