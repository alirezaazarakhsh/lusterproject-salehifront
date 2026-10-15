import React from 'react';
import {
  Lamp,
  LampCeiling,
  Crown,
  Grid,
  Zap,
  Sparkles,
  Box,
  ShoppingBag,
  Home,
  Send,
  Sliders,
  Shield,
  Gem,
  Heart,
  Flame,
  Tag,
  Layers,
  LayoutGrid,
  Lightbulb,
  Award,
  Star,
  Compass,
  Palette,
  CheckCircle2,
  Building,
  Coffee,
  Glasses,
  Tv,
} from 'lucide-react';
import { CategoryStarSeal } from './Ornaments';

interface DynamicCategoryIconProps {
  iconName?: string;
  className?: string;
  size?: number;
}

export const DynamicCategoryIcon: React.FC<DynamicCategoryIconProps> = ({
  iconName = '',
  className = '',
  size = 42,
}) => {
  const norm = String(iconName || '')
    .trim()
    .toLowerCase()
    .replace(/[-_\s]/g, '');

  if (!norm || norm === 'star' || norm === 'categorystarseal' || norm === 'seal') {
    return <CategoryStarSeal size={size} className={className} />;
  }

  // Matching logic for Iconsax and Lucide icon names
  let IconComponent: React.ComponentType<{ className?: string; style?: React.CSSProperties }> | null = null;

  if (norm.includes('lamp') || norm.includes('loster') || norm.includes('light') || norm.includes('bulb')) {
    IconComponent = LampCeiling || Lamp || Lightbulb;
  } else if (norm.includes('crown') || norm.includes('shakh') || norm.includes('king') || norm.includes('malakeh')) {
    IconComponent = Crown;
  } else if (norm.includes('flash') || norm.includes('zap') || norm.includes('electric') || norm.includes('charge')) {
    IconComponent = Zap;
  } else if (norm.includes('sparkle') || norm.includes('star') || norm.includes('crystal') || norm.includes('shine')) {
    IconComponent = Sparkles;
  } else if (norm.includes('box') || norm.includes('package') || norm.includes('carton')) {
    IconComponent = Box;
  } else if (norm.includes('bag') || norm.includes('shop') || norm.includes('buy')) {
    IconComponent = ShoppingBag;
  } else if (norm.includes('home') || norm.includes('house') || norm.includes('room')) {
    IconComponent = Home;
  } else if (norm.includes('direct') || norm.includes('send') || norm.includes('compass') || norm.includes('map') || norm.includes('location')) {
    IconComponent = Compass || Send;
  } else if (norm.includes('element') || norm.includes('grid') || norm.includes('category') || norm.includes('layout')) {
    IconComponent = LayoutGrid || Grid;
  } else if (norm.includes('setting') || norm.includes('slider') || norm.includes('filter')) {
    IconComponent = Sliders;
  } else if (norm.includes('shield') || norm.includes('lock') || norm.includes('guarantee') || norm.includes('tick')) {
    IconComponent = Shield;
  } else if (norm.includes('gem') || norm.includes('diamond') || norm.includes('jewel')) {
    IconComponent = Gem;
  } else if (norm.includes('heart') || norm.includes('like')) {
    IconComponent = Heart;
  } else if (norm.includes('flame') || norm.includes('fire') || norm.includes('sham')) {
    IconComponent = Flame;
  } else if (norm.includes('tag') || norm.includes('off') || norm.includes('discount')) {
    IconComponent = Tag;
  } else if (norm.includes('layer') || norm.includes('collection')) {
    IconComponent = Layers;
  } else if (norm.includes('award') || norm.includes('medal') || norm.includes('badge')) {
    IconComponent = Award;
  } else if (norm.includes('art') || norm.includes('palette') || norm.includes('color')) {
    IconComponent = Palette;
  } else if (norm.includes('building') || norm.includes('project') || norm.includes('villa') || norm.includes('house')) {
    IconComponent = Building;
  } else if (norm.includes('coffee') || norm.includes('rest')) {
    IconComponent = Coffee;
  } else if (norm.includes('glass') || norm.includes('mirror') || norm.includes('console')) {
    IconComponent = Glasses;
  } else if (norm.includes('tv') || norm.includes('screen') || norm.includes('video') || norm.includes('camera')) {
    IconComponent = Tv;
  } else if (norm.includes('check') || norm.includes('tick')) {
    IconComponent = CheckCircle2;
  } else {
    IconComponent = Sparkles;
  }

  // Render a golden royal badge containing the selected text icon
  const iconPx = Math.round(size * 0.48);

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`shrink-0 rounded-full bg-gradient-to-br from-[#d4b27c] via-[#b59766] to-[#8c6f41] p-[2px] shadow-sm flex items-center justify-center ${className}`}
      title={`آیکون: ${iconName}`}
    >
      <div className="w-full h-full rounded-full bg-[#181818] flex items-center justify-center text-[#e8d7b8] transition-transform duration-300 group-hover:scale-110">
        <IconComponent style={{ width: `${iconPx}px`, height: `${iconPx}px` }} className="stroke-[1.8]" />
      </div>
    </div>
  );
};
