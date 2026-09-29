import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  Sun,
  Moon,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
  SwitchCamera,
  Upload,
  Move,
} from 'lucide-react';
import { GENERATED_IMAGES } from '../data/chandelierData';

export type ChandelierModelType =
  | 'emerald-hero'
  | 'shah-malakeh'
  | '12-shakheh'
  | 'ristani'
  | 'crystali';

/**
 * رنگ‌های واقعی و استاندارد قابل اجرا در خط آبکاری لوستر (بدون رنگ‌های غیرواقعی یا انتخابگر رنگ آزاد)
 */
export type FinishType =
  | 'original'
  | 'gold-24k'
  | 'antique-bronze'
  | 'dark-patina'
  | 'royal-silver'
  | 'champagne'
  | 'rose-gold';

export type ShowroomAmbiance = 'studio-day' | 'night-lit' | 'living-room';

interface Chandelier3DViewerProps {
  modelType?: ChandelierModelType;
  imageUrl?: string;
  initialFinish?: FinishType;
  onFinishChange?: (finish: FinishType) => void;
  initialTheme?: 'light' | 'dark';
  compact?: boolean;
  showControls?: boolean;
  className?: string;
}

export const FINISH_PRESETS: Record<
  FinishType,
  {
    label: string;
    color: number;
    metalness: number;
    roughness: number;
    swatch: string;
    filterCss: string;
  }
> = {
  original: {
    label: 'رنگ اصلی محصول',
    color: 0xffffff,
    metalness: 0.65,
    roughness: 0.25,
    swatch: 'conic-gradient(#d4af37, #7c5a35, #cfd6dc, #d4af37)',
    filterCss: 'none',
  },
  'gold-24k': {
    label: 'آبکاری طلایی فورتیک',
    color: 0xd4af37,
    metalness: 0.92,
    roughness: 0.16,
    swatch: '#d4af37',
    filterCss: 'sepia(0.65) saturate(2.1) brightness(1.04) hue-rotate(-5deg)',
  },
  'antique-bronze': {
    label: 'آبکاری برنز آنتیک',
    color: 0x7c5a35,
    metalness: 0.82,
    roughness: 0.28,
    swatch: '#7c5a35',
    filterCss: 'sepia(0.55) saturate(1.4) brightness(0.92) hue-rotate(-12deg)',
  },
  'dark-patina': {
    label: 'آبکاری سیاه‌قلم',
    color: 0x322b26,
    metalness: 0.78,
    roughness: 0.3,
    swatch: '#322b26',
    filterCss: 'grayscale(0.75) contrast(1.18) brightness(0.82)',
  },
  'royal-silver': {
    label: 'آبکاری نقره‌ای کروم',
    color: 0xcfd6dc,
    metalness: 0.94,
    roughness: 0.14,
    swatch: '#cfd6dc',
    filterCss: 'grayscale(0.95) contrast(1.08) brightness(1.06)',
  },
  champagne: {
    label: 'آبکاری شامپاینی',
    color: 0xc8b084,
    metalness: 0.86,
    roughness: 0.22,
    swatch: '#c8b084',
    filterCss: 'sepia(0.38) saturate(1.25) brightness(1.03)',
  },
  'rose-gold': {
    label: 'آبکاری مسی / رزگلد',
    color: 0xb87b65,
    metalness: 0.88,
    roughness: 0.2,
    swatch: '#b87b65',
    filterCss: 'sepia(0.5) saturate(1.6) hue-rotate(328deg) brightness(0.96)',
  },
};

interface ProcessedClean3DData {
  coreUnlitTexture: THREE.CanvasTexture;
  coreLitTexture: THREE.CanvasTexture;
  branchUnlitTexture: THREE.CanvasTexture;
  branchLitTexture: THREE.CanvasTexture;
  opticalBloomTexture: THREE.CanvasTexture;
  depthMap256: Float32Array;
}

/**
 * بلور جدایی‌پذیر افقی و عمودی سریع (Separable 2D Box/Gaussian Blur)
 */
function blurFloatMap2D(
  src: Float32Array,
  w: number,
  h: number,
  radius: number,
  passes = 2
): Float32Array {
  let curr = new Float32Array(src);
  const temp = new Float32Array(w * h);
  const out = new Float32Array(w * h);

  for (let pass = 0; pass < passes; pass++) {
    for (let y = 0; y < h; y++) {
      let sum = 0;
      const rowOffset = y * w;
      const winSize = radius * 2 + 1;

      for (let x = -radius; x <= radius; x++) {
        const cx = Math.max(0, Math.min(w - 1, x));
        sum += curr[rowOffset + cx];
      }
      for (let x = 0; x < w; x++) {
        temp[rowOffset + x] = sum / winSize;
        const leftIdx = Math.max(0, x - radius);
        const rightIdx = Math.min(w - 1, x + radius + 1);
        sum += curr[rowOffset + rightIdx] - curr[rowOffset + leftIdx];
      }
    }

    for (let x = 0; x < w; x++) {
      let sum = 0;
      const winSize = radius * 2 + 1;

      for (let y = -radius; y <= radius; y++) {
        const cy = Math.max(0, Math.min(h - 1, y));
        sum += temp[cy * w + x];
      }
      for (let y = 0; y < h; y++) {
        out[y * w + x] = sum / winSize;
        const topIdx = Math.max(0, y - radius);
        const botIdx = Math.min(h - 1, y + radius + 1);
        sum += temp[botIdx * w + x] - temp[topIdx * w + x];
      }
    }

    if (pass < passes - 1) {
      curr.set(out);
    }
  }

  return out;
}

/**
 * موتور پردازش تمیز و بدون هاله تصویر لوستر برای رندر سه‌بعدی شفاف:
 * - حذف ۱۰۰٪ پس‌زمینه سفید و حفرات بین زنجیرهای بالا و تاج (بدون دیواره‌های قهوه‌ای یا سایه اضافه)
 * - حفظ ۱۰۰٪ ظرافت گل‌های سفید، شمع‌ها و شاخه‌های برنزی دقیقاً با وضوح عکس اصلی
 * - محاسبه نقشه عمق سه‌بعدی نرم (Smooth Depth Relief) و درخشش واقعی شمع‌ها
 */
function buildCrystalClean3DFromImage(
  img: HTMLImageElement,
  finish: FinishType,
  maxAnisotropy: number
): ProcessedClean3DData {
  const size = 1024;
  const aspect = img.width / Math.max(1, img.height);

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = size;
  srcCanvas.height = size;
  const srcCtx = srcCanvas.getContext('2d')!;

  srcCtx.fillStyle = '#ffffff';
  srcCtx.fillRect(0, 0, size, size);

  const pad = Math.round(size * 0.06);
  const availW = size - pad * 2;
  const availH = size - pad * 2;
  let drawW = availW;
  let drawH = availH;
  if (aspect > 1) {
    drawH = Math.round(availW / aspect);
  } else {
    drawW = Math.round(availH * aspect);
  }
  const offsetX = Math.round((size - drawW) / 2);
  const offsetY = Math.round((size - drawH) / 2);

  srcCtx.imageSmoothingEnabled = true;
  srcCtx.imageSmoothingQuality = 'high';
  srcCtx.drawImage(img, offsetX, offsetY, drawW, drawH);

  const imgData = srcCtx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // نمونه‌برداری رنگ پس‌زمینه از گوشه‌ها
  const samplePts = [
    [2, 2],
    [size - 3, 2],
    [2, size - 3],
    [size - 3, size - 3],
    [Math.floor(size * 0.2), 2],
    [Math.floor(size * 0.8), 2],
  ];
  let bgR = 0;
  let bgG = 0;
  let bgB = 0;
  for (const [sx, sy] of samplePts) {
    const idx = (sy * size + sx) * 4;
    bgR += data[idx];
    bgG += data[idx + 1];
    bgB += data[idx + 2];
  }
  bgR = Math.round(bgR / samplePts.length);
  bgG = Math.round(bgG / samplePts.length);
  bgB = Math.round(bgB / samplePts.length);

  const isBg = new Uint8Array(size * size);
  const queue = new Int32Array(size * size);
  let head = 0;
  let tail = 0;

  const isBackgroundPixel = (p: number, localTol = 46): boolean => {
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
    return (
      (diff <= localTol && lum > 192 && sat < 28) || (lum > 234 && sat < 18)
    );
  };

  for (let x = 0; x < size; x++) {
    const top = x;
    const bot = (size - 1) * size + x;
    if (isBackgroundPixel(top)) {
      isBg[top] = 1;
      queue[tail++] = top;
    }
    if (isBackgroundPixel(bot) && !isBg[bot]) {
      isBg[bot] = 1;
      queue[tail++] = bot;
    }
  }
  for (let y = 0; y < size; y++) {
    const left = y * size;
    const right = y * size + (size - 1);
    if (isBackgroundPixel(left) && !isBg[left]) {
      isBg[left] = 1;
      queue[tail++] = left;
    }
    if (isBackgroundPixel(right) && !isBg[right]) {
      isBg[right] = 1;
      queue[tail++] = right;
    }
  }

  // پاکسازی دقیق حفرات بسته بین زنجیرهای بالا، تاج و اسلیمی‌ها (بدون دست زدن به گل‌های سفید و شمع‌ها)
  for (let y = 3; y < size - 3; y++) {
    const ny = y / size;
    const isChainOrFinialZone = ny < 0.37 || ny > 0.84;

    for (let x = 3; x < size - 3; x++) {
      const p = y * size + x;
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
        if (diff <= 38 && lum > 195 && sat <= 24) {
          isBg[p] = 1;
          queue[tail++] = p;
        }
      } else {
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

  const neighborOffsets = [
    -1,
    1,
    -size,
    size,
    -size - 1,
    -size + 1,
    size - 1,
    size + 1,
  ];

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % size;
    const cy = (curr - cx) / size;
    const ny = cy / size;
    const localTol = ny < 0.37 || ny > 0.84 ? 48 : 34;

    for (let n = 0; n < 8; n++) {
      const next = curr + neighborOffsets[n];
      if (next < 0 || next >= size * size || isBg[next]) continue;
      const nx = next % size;
      const nyCoord = (next - nx) / size;
      if (Math.abs(nx - cx) > 1 || Math.abs(nyCoord - cy) > 1) continue;
      if (isBackgroundPixel(next, localTol)) {
        isBg[next] = 1;
        queue[tail++] = next;
      }
    }
  }

  // استخراج نقشه ارتفاع نرم (Smooth Depth Map) و نقشه منابع نور شمع‌ها در 256x256
  const bSize = 256;
  const bulbSeed = new Float32Array(bSize * bSize);
  const rawVolume256 = new Float32Array(bSize * bSize);
  let detectedBrightPixels = 0;

  for (let by = 0; by < bSize; by++) {
    const sy = Math.min(size - 1, by * 4 + 2);
    const ny = (size * 0.5 - sy) / (size * 0.5);

    for (let bx = 0; bx < bSize; bx++) {
      const sx = Math.min(size - 1, bx * 4 + 2);
      const nx = (sx - size * 0.5) / (size * 0.5);
      const absNx = Math.abs(nx);
      const p = sy * size + sx;
      const bIdx = by * bSize + bx;

      if (isBg[p]) {
        rawVolume256[bIdx] = 0;
        continue;
      }

      const i = p * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // برجستگی سه‌بعدی ملایم برای شاخه‌های جلویی و ستون میانی
      rawVolume256[bIdx] = 0.5 + lum * 0.5;

      if (ny >= -0.24 && ny <= 0.62 && absNx >= 0.06 && absNx <= 0.88) {
        if (lum > 0.7) {
          bulbSeed[bIdx] = Math.min(1, (lum - 0.66) / 0.26);
          detectedBrightPixels++;
        } else if (lum > 0.48 && r > g && g > b && r - b > 34) {
          bulbSeed[bIdx] = (lum - 0.44) * 0.7;
        }
      }
    }
  }

  if (detectedBrightPixels < 60) {
    for (let i = 0; i < bulbSeed.length; i++) {
      bulbSeed[i] = Math.min(1, bulbSeed[i] * 2.2);
    }
  }

  const depthMap256 = blurFloatMap2D(rawVolume256, bSize, bSize, 14, 3);

  const tightBloom256 = blurFloatMap2D(bulbSeed, bSize, bSize, 3, 2);
  const medBloom256 = blurFloatMap2D(bulbSeed, bSize, bSize, 10, 2);
  const wideBloom256 = blurFloatMap2D(bulbSeed, bSize, bSize, 26, 2);

  let maxMed = 0.001;
  let maxWide = 0.001;
  for (let i = 0; i < bSize * bSize; i++) {
    if (medBloom256[i] > maxMed) maxMed = medBloom256[i];
    if (wideBloom256[i] > maxWide) maxWide = wideBloom256[i];
  }
  const medNorm = 1 / Math.max(0.08, maxMed);
  const wideNorm = 1 / Math.max(0.05, maxWide);

  const targetColor = new THREE.Color(FINISH_PRESETS[finish].color);
  const applyTint = finish !== 'original';
  const tr = Math.round(targetColor.r * 255);
  const tg = Math.round(targetColor.g * 255);
  const tb = Math.round(targetColor.b * 255);

  const coreUnlitCanvas = document.createElement('canvas');
  coreUnlitCanvas.width = size;
  coreUnlitCanvas.height = size;
  const coreUnlitCtx = coreUnlitCanvas.getContext('2d')!;
  const coreUnlitData = coreUnlitCtx.createImageData(size, size);

  const coreLitCanvas = document.createElement('canvas');
  coreLitCanvas.width = size;
  coreLitCanvas.height = size;
  const coreLitCtx = coreLitCanvas.getContext('2d')!;
  const coreLitData = coreLitCtx.createImageData(size, size);

  const branchUnlitCanvas = document.createElement('canvas');
  branchUnlitCanvas.width = size;
  branchUnlitCanvas.height = size;
  const branchUnlitCtx = branchUnlitCanvas.getContext('2d')!;
  const branchUnlitData = branchUnlitCtx.createImageData(size, size);

  const branchLitCanvas = document.createElement('canvas');
  branchLitCanvas.width = size;
  branchLitCanvas.height = size;
  const branchLitCtx = branchLitCanvas.getContext('2d')!;
  const branchLitData = branchLitCtx.createImageData(size, size);

  const bloomCanvas = document.createElement('canvas');
  bloomCanvas.width = size;
  bloomCanvas.height = size;
  const bloomCtx = bloomCanvas.getContext('2d')!;
  const bloomData = bloomCtx.createImageData(size, size);

  for (let p = 0; p < size * size; p++) {
    const i = p * 4;
    const cx = p % size;
    const cy = (p - cx) / size;

    const nx = (cx - size * 0.5) / (size * 0.5); // -1 .. +1
    const ny = (size * 0.5 - cy) / (size * 0.5); // -1 (پایین) .. +1 (بالا)
    const absNx = Math.abs(nx);

    const bx = Math.min(bSize - 1, cx >> 2);
    const by = Math.min(bSize - 1, cy >> 2);
    const bIdx = by * bSize + bx;

    const bTight = Math.min(1, tightBloom256[bIdx] * 2.4);
    const bMed = Math.min(1, medBloom256[bIdx] * medNorm);
    const bWide = Math.min(1, wideBloom256[bIdx] * wideNorm);

    const auraStrength = Math.min(
      1,
      bTight * 0.75 + bMed * 0.55 + bWide * 0.22
    );
    if (auraStrength > 0.015) {
      const auraAlpha = Math.round(Math.pow(auraStrength, 1.15) * 210);
      bloomData.data[i] = 255;
      bloomData.data[i + 1] = Math.min(255, Math.round(198 + bTight * 55));
      bloomData.data[i + 2] = Math.min(255, Math.round(105 + bTight * 130));
      bloomData.data[i + 3] = auraAlpha;
    }

    if (isBg[p]) continue;

    let bgNeighbors = 0;
    if (cx > 0 && isBg[p - 1]) bgNeighbors++;
    if (cx < size - 1 && isBg[p + 1]) bgNeighbors++;
    if (cy > 0 && isBg[p - size]) bgNeighbors++;
    if (cy < size - 1 && isBg[p + size]) bgNeighbors++;
    if (cx > 0 && cy > 0 && isBg[p - size - 1]) bgNeighbors++;
    if (cx < size - 1 && cy > 0 && isBg[p - size + 1]) bgNeighbors++;
    if (cx > 0 && cy < size - 1 && isBg[p + size - 1]) bgNeighbors++;
    if (cx < size - 1 && cy < size - 1 && isBg[p + size + 1]) bgNeighbors++;

    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);

    let alpha = 255;
    if (bgNeighbors > 0 && lum > 0.7 && sat < 48) {
      const fade = Math.max(
        0,
        Math.min(1, (0.94 - lum) / 0.23) * (1 - bgNeighbors * 0.095)
      );
      alpha = Math.round(255 * fade);

      if (alpha > 12 && alpha < 235 && sat > 6) {
        const invAlpha = Math.max(0.35, alpha / 255);
        r = Math.max(
          0,
          Math.min(255, Math.round((r - bgR * (1 - invAlpha)) / invAlpha))
        );
        g = Math.max(
          0,
          Math.min(255, Math.round((g - bgG * (1 - invAlpha)) / invAlpha))
        );
        b = Math.max(
          0,
          Math.min(255, Math.round((b - bgB * (1 - invAlpha)) / invAlpha))
        );
      }
    }

    let outR = r;
    let outG = g;
    let outB = b;

    if (applyTint) {
      if (lum > 0.86) {
        outR = Math.min(255, Math.round(r * 0.86 + tr * 0.14));
        outG = Math.min(255, Math.round(g * 0.86 + tg * 0.14));
        outB = Math.min(255, Math.round(b * 0.86 + tb * 0.14));
      } else {
        const metallicCurve = Math.pow(Math.max(0.12, lum), 0.8) * 1.25;
        outR = Math.min(255, Math.round(r * 0.2 + tr * metallicCurve * 0.8));
        outG = Math.min(255, Math.round(g * 0.2 + tg * metallicCurve * 0.8));
        outB = Math.min(255, Math.round(b * 0.2 + tb * metallicCurve * 0.8));
      }
    }

    const isBulbFilament = lum > 0.68 && bTight > 0.18;
    const metalWarmBounce =
      (bTight * 0.95 + bMed * 0.75 + bWide * 0.48) * (0.28 + lum * 0.95);

    let litR = outR;
    let litG = outG;
    let litB = outB;

    if (isBulbFilament) {
      const filamentMix = Math.min(1, (lum - 0.65) * 2.6 + bTight * 0.6);
      litR = Math.min(255, Math.round(outR + (255 - outR) * filamentMix));
      litG = Math.min(255, Math.round(outG + (250 - outG) * filamentMix));
      litB = Math.min(255, Math.round(outB + (222 - outB) * filamentMix));
    } else {
      litR = Math.min(255, Math.round(outR + metalWarmBounce * 135));
      litG = Math.min(255, Math.round(outG + metalWarmBounce * 98));
      litB = Math.min(255, Math.round(outB + metalWarmBounce * 42));
    }

    // ۱. ماسک ستون مرکزی، زنجیر بالا و گوی پایین (Core Axis): همیشه یکپارچه در مرکز محور Y
    let coreHalfWidth = 0.16;
    if (ny > 0.28) {
      // ناحیه زنجیر و تاج بالا به طور کامل در ستون مرکزی قرار می‌گیرد تا هرگز دوتکه نشود
      coreHalfWidth = 0.36;
    } else if (ny < -0.34) {
      coreHalfWidth = 0.26;
    }
    const coreWeight =
      absNx <= coreHalfWidth * 0.65
        ? 1
        : absNx >= coreHalfWidth * 1.25
        ? 0
        : 1 -
          (absNx - coreHalfWidth * 0.65) /
            (coreHalfWidth * 0.6);

    const coreAlpha = Math.round(alpha * coreWeight);
    coreUnlitData.data[i] = outR;
    coreUnlitData.data[i + 1] = outG;
    coreUnlitData.data[i + 2] = outB;
    coreUnlitData.data[i + 3] = coreAlpha;

    coreLitData.data[i] = litR;
    coreLitData.data[i + 1] = litG;
    coreLitData.data[i + 2] = litB;
    coreLitData.data[i + 3] = coreAlpha;

    // ۲. ماسک شاخه‌های شعاعی ۳۶۰ درجه (Radial Branches): بدون زنجیر بالا تا در چرخش ۳۶۰ درجه زنجیر تکرار نشود
    let branchWeight = 1;
    if (ny > 0.34) {
      // حذف زنجیر بالا از بال‌های شعاعی چرخان
      branchWeight = Math.max(0, Math.min(1, (0.42 - ny) / 0.08)) * (absNx > 0.18 ? 1 : 0);
    } else if (absNx < 0.06) {
      branchWeight = 0;
    } else if (absNx < 0.15) {
      branchWeight = (absNx - 0.06) / 0.09;
    }

    const branchAlpha = Math.round(alpha * branchWeight);
    branchUnlitData.data[i] = outR;
    branchUnlitData.data[i + 1] = outG;
    branchUnlitData.data[i + 2] = outB;
    branchUnlitData.data[i + 3] = branchAlpha;

    branchLitData.data[i] = litR;
    branchLitData.data[i + 1] = litG;
    branchLitData.data[i + 2] = litB;
    branchLitData.data[i + 3] = branchAlpha;
  }

  coreUnlitCtx.putImageData(coreUnlitData, 0, 0);
  coreLitCtx.putImageData(coreLitData, 0, 0);
  branchUnlitCtx.putImageData(branchUnlitData, 0, 0);
  branchLitCtx.putImageData(branchLitData, 0, 0);
  bloomCtx.putImageData(bloomData, 0, 0);

  const configureTex = (canvas: HTMLCanvasElement) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = maxAnisotropy;
    tex.needsUpdate = true;
    return tex;
  };

  return {
    coreUnlitTexture: configureTex(coreUnlitCanvas),
    coreLitTexture: configureTex(coreLitCanvas),
    branchUnlitTexture: configureTex(branchUnlitCanvas),
    branchLitTexture: configureTex(branchLitCanvas),
    opticalBloomTexture: configureTex(bloomCanvas),
    depthMap256,
  };
}

export const Chandelier3DViewer: React.FC<Chandelier3DViewerProps> = ({
  imageUrl,
  initialFinish = 'original',
  initialTheme = 'light',
  compact = false,
  showControls = true,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [finish, setFinish] = useState<FinishType>(initialFinish);
  const [ambiance, setAmbiance] = useState<ShowroomAmbiance>(
    initialTheme === 'dark' ? 'night-lit' : 'studio-day'
  );
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [candlesLit, setCandlesLit] = useState<boolean>(
    initialTheme === 'dark'
  );
  const [zoomDistance, setZoomDistance] = useState<number>(
    compact ? 4.05 : 4.3
  );
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // وضعیت‌های دوربین زنده واقعیت افزوده (AR) برای تست در منزل خود مشتری
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>(
    'environment'
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [customRoomPhoto, setCustomRoomPhoto] = useState<string | null>(null);
  const [arDragMode, setArDragMode] = useState<'move' | 'rotate'>('move');

  const stateRef = useRef({
    autoRotate,
    candlesLit,
    ambiance,
    zoomDistance,
    arDragMode,
    orbitPhase: 0,
    userAngleY: 0,
    userAngleX: 0.02,
    targetPosX: 0,
    targetPosY: 0,
    isDragging: false,
  });

  useEffect(() => {
    setFinish(initialFinish);
  }, [initialFinish]);

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
    stateRef.current.candlesLit = candlesLit;
    stateRef.current.ambiance = ambiance;
    stateRef.current.zoomDistance = zoomDistance;
    stateRef.current.arDragMode = arDragMode;
  }, [autoRotate, candlesLit, ambiance, zoomDistance, arDragMode]);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startLiveCamera = async (facing: 'environment' | 'user') => {
    stopCameraStream();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        'مرورگر شما از دوربین زنده پشتیبانی نمی‌کند؛ می‌توانید عکس منزل خود را آپلود کنید.'
      );
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setCameraActive(true);
      setCustomRoomPhoto(null);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch {
      setCameraError(
        'دسترسی به دوربین داده نشد. لطفاً مجوز دوربین را تایید کنید یا عکس پذیرایی خود را انتخاب نمایید.'
      );
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const handleActivateLivingRoomAR = () => {
    setAmbiance('living-room');
    setCandlesLit(true);
    setArDragMode('move');
    stateRef.current.targetPosY = 0.22;
    stateRef.current.targetPosX = 0;
    startLiveCamera(cameraFacing);
  };

  const handleToggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startLiveCamera(nextFacing);
  };

  const handleRoomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCameraStream();
    setCameraError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomRoomPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const srcToLoad = imageUrl || GENERATED_IMAGES.crystaliCherub;
    let active = true;
    const img = new Image();
    if (
      srcToLoad.startsWith('http') &&
      !srcToLoad.includes(window.location.host)
    ) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      if (active) setLoadedImage(img);
    };
    img.onerror = () => {
      if (active && srcToLoad !== GENERATED_IMAGES.crystaliCherub) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          if (active) setLoadedImage(fallbackImg);
        };
        fallbackImg.src = GENERATED_IMAGES.crystaliCherub;
      }
    };
    img.src = srcToLoad;
    return () => {
      active = false;
    };
  }, [imageUrl]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !loadedImage) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.0, stateRef.current.zoomDistance);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy() || 8;
    const maps = buildCrystalClean3DFromImage(
      loadedImage,
      finish,
      maxAnisotropy
    );

    const rootGroup = new THREE.Group();
    rootGroup.position.y = compact ? -0.01 : -0.02;
    scene.add(rootGroup);

    const planeSize = 2.96;
    const segments = 96;

    // ۱. هندسه ستون مرکزی، زنجیر بالا و گوی پایین (در محور مرکزی X=0, Z=0)
    const coreGeo = new THREE.PlaneGeometry(planeSize, planeSize, 48, 48);
    const corePos = coreGeo.attributes.position;
    for (let i = 0; i < corePos.count; i++) {
      const x = corePos.getX(i);
      const nx = x / (planeSize * 0.5);
      const z = Math.cos(Math.min(1, Math.abs(nx) * 3.5) * Math.PI * 0.5) * 0.04;
      corePos.setZ(i, z);
    }
    coreGeo.computeVertexNormals();

    // ۲. هندسه شاخه‌های شعاعی ۳۶۰ درجه (S-Curve در Z که در مرکز nx=0 دقیقاً Z=0 دارد)
    const branchGeo = new THREE.PlaneGeometry(
      planeSize,
      planeSize,
      segments,
      segments
    );
    const branchPos = branchGeo.attributes.position;
    for (let i = 0; i < branchPos.count; i++) {
      const x = branchPos.getX(i);
      const nx = x / (planeSize * 0.5);
      const z = Math.sin(nx * Math.PI) * 0.11;
      branchPos.setZ(i, z);
    }
    branchGeo.computeVertexNormals();

    const coreMat = new THREE.MeshBasicMaterial({
      map: maps.coreUnlitTexture,
      transparent: true,
      alphaTest: 0.15,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    const branchMat = new THREE.MeshBasicMaterial({
      map: maps.branchUnlitTexture,
      transparent: true,
      alphaTest: 0.18,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    const bloomMat = new THREE.MeshBasicMaterial({
      map: maps.opticalBloomTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      toneMapped: false,
      opacity: 0,
    });

    const coreGroup = new THREE.Group();
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);
    rootGroup.add(coreGroup);

    // چیدمان شعاعی ۳۶۰ درجه شاخه‌ها در زوایای ۰، ۶۰ و ۱۲۰ درجه (۶ بازوی شعاعی دور تا دور ۳۶۰ درجه)
    const radialAngles = [0, Math.PI / 3, (2 * Math.PI) / 3];
    const bloomMeshes: THREE.Mesh[] = [];

    radialAngles.forEach((angle) => {
      const wingGroup = new THREE.Group();
      wingGroup.rotation.y = angle;

      const wingMesh = new THREE.Mesh(branchGeo, branchMat);
      wingGroup.add(wingMesh);

      const wingBloom = new THREE.Mesh(branchGeo, bloomMat);
      wingBloom.position.z = 0.005;
      wingBloom.visible = false;
      wingGroup.add(wingBloom);
      bloomMeshes.push(wingBloom);

      rootGroup.add(wingGroup);
    });

    let startX = 0;
    let startY = 0;

    const onPointerDown = (e: PointerEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.autoRotate = false;
      setAutoRotate(false);
      startX = e.clientX;
      startY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!stateRef.current.isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = e.clientX;
      startY = e.clientY;

      if (
        stateRef.current.ambiance === 'living-room' &&
        stateRef.current.arDragMode === 'move'
      ) {
        stateRef.current.targetPosX = Math.max(
          -1.35,
          Math.min(1.35, stateRef.current.targetPosX + dx * 0.0045)
        );
        stateRef.current.targetPosY = Math.max(
          -0.95,
          Math.min(0.95, stateRef.current.targetPosY - dy * 0.0045)
        );
      } else {
        stateRef.current.orbitPhase += dx * 0.011;
        stateRef.current.userAngleX = Math.max(
          -0.28,
          Math.min(0.28, stateRef.current.userAngleX + dy * 0.005)
        );
      }
    };

    const onPointerUp = () => {
      stateRef.current.isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let animId = 0;
    const clock = new THREE.Clock();
    let activeLitState = false;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.elapsedTime;

      if (stateRef.current.autoRotate && !stateRef.current.isDragging) {
        stateRef.current.orbitPhase += dt * 0.58;
      }

      rootGroup.rotation.y +=
        (stateRef.current.orbitPhase - rootGroup.rotation.y) * 0.12;

      const targetRotX = stateRef.current.autoRotate
        ? Math.sin(elapsed * 0.7) * 0.04 + 0.03
        : stateRef.current.userAngleX;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.12;

      coreGroup.rotation.y = -rootGroup.rotation.y;

      const baseOffsetY = compact ? -0.01 : -0.02;
      rootGroup.position.x +=
        (stateRef.current.targetPosX - rootGroup.position.x) * 0.14;
      rootGroup.position.y +=
        (baseOffsetY + stateRef.current.targetPosY - rootGroup.position.y) *
        0.14;

      const isNight = stateRef.current.ambiance === 'night-lit';
      const lit = stateRef.current.candlesLit || isNight;

      if (lit !== activeLitState) {
        activeLitState = lit;
        coreMat.map = lit ? maps.coreLitTexture : maps.coreUnlitTexture;
        coreMat.needsUpdate = true;
        branchMat.map = lit ? maps.branchLitTexture : maps.branchUnlitTexture;
        branchMat.needsUpdate = true;
      }

      const flicker =
        0.92 +
        Math.sin(elapsed * 3.8) * 0.05 +
        Math.cos(elapsed * 7.1) * 0.03;
      const targetBloomOpacity = lit ? (isNight ? 0.95 : 0.72) * flicker : 0;

      for (const bm of bloomMeshes) {
        bm.visible = lit;
      }
      if (lit) {
        bloomMat.opacity = targetBloomOpacity;
      }

      camera.position.z +=
        (stateRef.current.zoomDistance - camera.position.z) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      coreGeo.dispose();
      branchGeo.dispose();
      coreMat.dispose();
      branchMat.dispose();
      bloomMat.dispose();
      maps.coreUnlitTexture.dispose();
      maps.coreLitTexture.dispose();
      maps.branchUnlitTexture.dispose();
      maps.branchLitTexture.dispose();
      maps.opticalBloomTexture.dispose();
      renderer.dispose();
    };
  }, [loadedImage, finish, compact]);

  const resetCameraView = () => {
    stateRef.current.orbitPhase = 0;
    stateRef.current.userAngleY = 0;
    stateRef.current.userAngleX = 0.02;
    stateRef.current.targetPosX = 0;
    stateRef.current.targetPosY = ambiance === 'living-room' ? 0.22 : 0;
    setZoomDistance(compact ? 4.05 : 4.3);
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    const isLit = candlesLit || ambiance === 'night-lit';
    if (ambiance === 'night-lit') {
      return {
        background:
          'radial-gradient(circle at 50% 42%, #4a3820 0%, #1c1610 54%, #0c0a08 100%)',
      };
    }
    if (ambiance === 'living-room') {
      if (cameraActive) {
        return { backgroundColor: '#111111' };
      }
      if (customRoomPhoto) {
        return {
          backgroundImage: `url(${customRoomPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(20, 16, 12, 0.35), rgba(20, 16, 12, 0.55)), url(${GENERATED_IMAGES.projectFereshteh})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (isLit) {
      return {
        background:
          'radial-gradient(circle at 50% 42%, #fff9ea 0%, #f9eed4 45%, #efe6d5 100%)',
      };
    }
    return {
      background:
        'radial-gradient(circle at 50% 45%, #ffffff 0%, #f8f6f1 65%, #efeae0 100%)',
    };
  };

  return (
    <div
      style={getBackgroundStyle()}
      className={`relative select-none overflow-hidden transition-colors duration-500 ${className}`}
    >
      {/* تصویر زنده دوربین موبایل / وب‌کم برای مشاهده لوستر در منزل خود مشتری (AR) */}
      {ambiance === 'living-room' && cameraActive && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        />
      )}

      {/* نوار ابزار ویژه واقعیت افزوده (AR) در بالای تصویر هنگام انتخاب «تست در پذیرایی» */}
      {ambiance === 'living-room' && !compact && (
        <div className="absolute top-14 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white border border-white/15 shadow-lg text-[11px]">
            <button
              type="button"
              onClick={() => startLiveCamera(cameraFacing)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                cameraActive
                  ? 'bg-[#b59766] text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>
                {cameraActive ? 'دوربین زنده فعال' : 'روشن کردن دوربین'}
              </span>
            </button>

            {cameraActive && (
              <button
                type="button"
                onClick={handleToggleCameraFacing}
                title="تعویض دوربین پشت و جلو موبایل"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
              >
                <SwitchCamera className="w-3.5 h-3.5" />
                <span>تعویض دوربین</span>
              </button>
            )}

            <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#dfc088]" />
              <span>عکس پذیرایی شما</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleRoomPhotoUpload}
                className="sr-only"
              />
            </label>

            <button
              type="button"
              onClick={() =>
                setArDragMode((prev) => (prev === 'move' ? 'rotate' : 'move'))
              }
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[#f5dec0] font-semibold transition-colors cursor-pointer"
            >
              <Move className="w-3.5 h-3.5" />
              <span>
                {arDragMode === 'move'
                  ? 'حالت: جابجایی روی سقف (با کشیدن دست)'
                  : 'حالت: چرخش سه‌بعدی لوستر'}
              </span>
            </button>
          </div>

          {cameraError && (
            <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-amber-950/90 text-amber-100 border border-amber-500/40 text-[11px]">
              {cameraError}
            </div>
          )}
        </div>
      )}

      {/* بوم رندر سه‌بعدی یکپارچه */}
      <div
        ref={mountRef}
        className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* نوار ابزار سه‌بعدی در پایین کادر */}
      {showControls && !compact && (
        <div className="absolute bottom-3.5 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* سمت راست: انتخاب فضای نمایش */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-[#e5dec9] shadow-sm">
            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                setAmbiance('studio-day');
                setCandlesLit(false);
                stateRef.current.targetPosX = 0;
                stateRef.current.targetPosY = 0;
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                ambiance === 'studio-day'
                  ? 'bg-[#262626] text-white shadow-2xs'
                  : 'text-[#555] hover:text-[#222]'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>استودیو روشن</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                setAmbiance('night-lit');
                setCandlesLit(true);
                stateRef.current.targetPosX = 0;
                stateRef.current.targetPosY = 0;
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                ambiance === 'night-lit'
                  ? 'bg-[#b59766] text-white shadow-2xs'
                  : 'text-[#555] hover:text-[#222]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>تست نور در شب</span>
            </button>

            <button
              type="button"
              onClick={handleActivateLivingRoomAR}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                ambiance === 'living-room'
                  ? 'bg-[#b59766] text-white shadow-2xs'
                  : 'text-[#555] hover:text-[#222]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>تست در پذیرایی (دوربین زنده)</span>
            </button>
          </div>

          {/* سمت چپ: کنترل چرخش، شمع‌ها و زوم */}
          <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-[#e5dec9] shadow-sm">
            <button
              type="button"
              onClick={() => setCandlesLit((prev) => !prev)}
              title={candlesLit ? 'خاموش کردن شمع‌ها' : 'روشن کردن شمع‌ها'}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                candlesLit
                  ? 'bg-[#fbf3e4] text-[#9b7635] border border-[#e5d1a7]'
                  : 'text-[#666] hover:bg-black/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{candlesLit ? 'شمع‌ها روشن' : 'شمع‌ها خاموش'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAutoRotate((prev) => !prev)}
              title="چرخش سه‌بعدی خودکار"
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                autoRotate
                  ? 'bg-[#b59766] text-white'
                  : 'text-[#555] hover:bg-black/5'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>چرخش ۳۶۰°</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setZoomDistance((z) => Math.max(2.6, +(z - 0.35).toFixed(2)))
              }
              title="بزرگ‌نمایی"
              className="w-7 h-7 rounded-lg text-[#555] hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setZoomDistance((z) => Math.min(6.2, +(z + 0.35).toFixed(2)))
              }
              title="کوچک‌نمایی"
              className="w-7 h-7 rounded-lg text-[#555] hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={resetCameraView}
              title="بازنشانی زاویه دید"
              className="w-7 h-7 rounded-lg text-[#555] hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
