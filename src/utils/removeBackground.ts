/**
 * حذف خودکار، دقیق و بدون هاله پس‌زمینه عکس‌های لوستر (Ultra-Clean Transparent Cutout):
 * ۱. الگوریتم Flood-Fill از لبه‌های تصویر
 * ۲. تشخیص هوشمند حفرات بسته بین زنجیرهای بالا، تاج و شاخه‌های اسلیمی (بدون آسیب به شمع‌ها و گل‌های سفید)
 * ۳. حذف کامل رنگ سفید پس‌زمینه از لبه‌ها (Color Decontamination / Defringing) برای لبه‌های ۱۰۰٪ تمیز و نرم
 */

const processedCache = new Map<string, string>();

export function removeImageWhiteBackground(
  imageSrc: string,
  tolerance = 46
): Promise<string> {
  if (processedCache.has(imageSrc)) {
    return Promise.resolve(processedCache.get(imageSrc)!);
  }

  return new Promise((resolve) => {
    const img = new Image();
    if (imageSrc.startsWith('http') && !imageSrc.includes(window.location.host)) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const maxDim = 1024;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // نمونه‌برداری رنگ پس‌زمینه از گوشه‌ها و لبه‌های بالا
        const sampleCoords = [
          [2, 2],
          [w - 3, 2],
          [2, h - 3],
          [w - 3, h - 3],
          [Math.floor(w * 0.15), 2],
          [Math.floor(w * 0.85), 2],
        ];
        let bgR = 0;
        let bgG = 0;
        let bgB = 0;
        let validSamples = 0;

        for (const [sx, sy] of sampleCoords) {
          const idx = (Math.max(0, sy) * w + Math.max(0, sx)) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
          validSamples++;
        }
        bgR = Math.round(bgR / validSamples);
        bgG = Math.round(bgG / validSamples);
        bgB = Math.round(bgB / validSamples);

        // اگر پس‌زمینه تیره باشد (مثل بنر)، نیازی به حذف پس‌زمینه سفید نیست
        if ((bgR + bgG + bgB) / 3 < 185) {
          resolve(imageSrc);
          return;
        }

        const isBg = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const isBackgroundPixel = (pixelIdx: number, localTol = tolerance): boolean => {
          const i = pixelIdx * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const diff =
            Math.abs(r - bgR) * 0.35 +
            Math.abs(g - bgG) * 0.45 +
            Math.abs(b - bgB) * 0.2;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const sat = Math.max(r, g, b) - Math.min(r, g, b);
          return (
            (diff <= localTol && lum > 192 && sat < 28) ||
            (lum > 234 && sat < 18)
          );
        };

        // مرحله ۱: شروع Flood-Fill از چهار لبه تصویر
        for (let x = 0; x < w; x++) {
          const topIdx = x;
          const botIdx = (h - 1) * w + x;
          if (isBackgroundPixel(topIdx)) {
            isBg[topIdx] = 1;
            queue[tail++] = topIdx;
          }
          if (isBackgroundPixel(botIdx) && !isBg[botIdx]) {
            isBg[botIdx] = 1;
            queue[tail++] = botIdx;
          }
        }
        for (let y = 0; y < h; y++) {
          const leftIdx = y * w;
          const rightIdx = y * w + (w - 1);
          if (isBackgroundPixel(leftIdx) && !isBg[leftIdx]) {
            isBg[leftIdx] = 1;
            queue[tail++] = leftIdx;
          }
          if (isBackgroundPixel(rightIdx) && !isBg[rightIdx]) {
            isBg[rightIdx] = 1;
            queue[tail++] = rightIdx;
          }
        }

        // مرحله ۲: بذرگذاری هوشمند برای حفرات بسته بین زنجیرهای بالا، تاج و شاخه‌های فلزی
        for (let y = 3; y < h - 3; y++) {
          const ny = y / h;
          const isChainOrFinialZone = ny < 0.37 || ny > 0.84;

          for (let x = 3; x < w - 3; x++) {
            const p = y * w + x;
            if (isBg[p]) continue;
            const i = p * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const diff =
              Math.abs(r - bgR) * 0.35 +
              Math.abs(g - bgG) * 0.45 +
              Math.abs(b - bgB) * 0.2;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const sat = Math.max(r, g, b) - Math.min(r, g, b);

            if (isChainOrFinialZone) {
              // در ناحیه زنجیر بالا و گوی پایین هیچ شمع یا گل سفیدی وجود ندارد؛ تمام حفرات روشن بین زنجیرها پاک می‌شوند
              if (diff <= 38 && lum > 195 && sat <= 24) {
                isBg[p] = 1;
                queue[tail++] = p;
              }
            } else {
              // در ناحیه میانی (شاخه‌ها)، فقط حفرات کاملاً یکنواخت هم‌رنگ پس‌زمینه استودیو بذرگذاری می‌شوند
              if (diff <= 18 && lum > 224 && sat <= 12) {
                const iLeft = (p - 2) * 4;
                const iRight = (p + 2) * 4;
                const localGrad =
                  Math.abs(r - data[iLeft]) + Math.abs(r - data[iRight]);
                if (localGrad <= 6) {
                  isBg[p] = 1;
                  queue[tail++] = p;
                }
              }
            }
          }
        }

        const neighborOffsets = [-1, 1, -w, w, -w - 1, -w + 1, w - 1, w + 1];

        while (head < tail) {
          const curr = queue[head++];
          const cx = curr % w;
          const cy = (curr - cx) / w;
          const ny = cy / h;
          const localTol = ny < 0.37 || ny > 0.84 ? 48 : 34;

          for (let n = 0; n < 8; n++) {
            const next = curr + neighborOffsets[n];
            if (next < 0 || next >= w * h || isBg[next]) continue;
            const nx = next % w;
            const nyCoord = (next - nx) / w;
            if (Math.abs(nx - cx) > 1 || Math.abs(nyCoord - cy) > 1) continue;

            if (isBackgroundPixel(next, localTol)) {
              isBg[next] = 1;
              queue[tail++] = next;
            }
          }
        }

        // مرحله ۳: لبه‌گیری نرم و حذف هاله سفید پس‌زمینه (Soft Anti-Aliasing & Color Defringing)
        for (let p = 0; p < w * h; p++) {
          const i = p * 4;
          if (isBg[p]) {
            data[i + 3] = 0;
            continue;
          }

          const cx = p % w;
          const cy = (p - cx) / w;
          let bgNeighbors = 0;
          if (cx > 0 && isBg[p - 1]) bgNeighbors++;
          if (cx < w - 1 && isBg[p + 1]) bgNeighbors++;
          if (cy > 0 && isBg[p - w]) bgNeighbors++;
          if (cy < h - 1 && isBg[p + w]) bgNeighbors++;
          if (cx > 0 && cy > 0 && isBg[p - w - 1]) bgNeighbors++;
          if (cx < w - 1 && cy > 0 && isBg[p - w + 1]) bgNeighbors++;
          if (cx > 0 && cy < h - 1 && isBg[p + w - 1]) bgNeighbors++;
          if (cx < w - 1 && cy < h - 1 && isBg[p + w + 1]) bgNeighbors++;

          if (bgNeighbors > 0) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const sat = Math.max(r, g, b) - Math.min(r, g, b);

            if (lum > 180 && sat < 48) {
              const fade = Math.max(
                0,
                Math.min(1, (240 - lum) / 58) * (1 - bgNeighbors * 0.095)
              );
              const alpha = Math.round(255 * fade);
              data[i + 3] = alpha;

              // حذف سفیدی قاطی‌شده با فلز در پیکسل‌های لبه‌ای (Color Decontamination)
              if (alpha > 12 && alpha < 235 && sat > 6) {
                const invAlpha = Math.max(0.35, alpha / 255);
                data[i] = Math.max(
                  0,
                  Math.min(255, Math.round((r - bgR * (1 - invAlpha)) / invAlpha))
                );
                data[i + 1] = Math.max(
                  0,
                  Math.min(255, Math.round((g - bgG * (1 - invAlpha)) / invAlpha))
                );
                data[i + 2] = Math.max(
                  0,
                  Math.min(255, Math.round((b - bgB * (1 - invAlpha)) / invAlpha))
                );
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultDataUrl = canvas.toDataURL('image/png');
        processedCache.set(imageSrc, resultDataUrl);
        resolve(resultDataUrl);
      } catch {
        resolve(imageSrc);
      }
    };

    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}
