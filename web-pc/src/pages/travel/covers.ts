// 每个景区/路线的独特封面配色

type CoverStyle = { gradient: string; icon: string; accent: string };

export const scenicSpotCovers: Record<number, CoverStyle> = {
  1: { gradient: 'linear-gradient(135deg, #1F5FA8 0%, #3B7BC5 50%, #6B8E3D 100%)', icon: '🏔️', accent: '#E8F1FB' },
  2: { gradient: 'linear-gradient(135deg, #D4A14B 0%, #E85D2F 50%, #7A5230 100%)', icon: '🏛️', accent: '#FFF1EA' },
  3: { gradient: 'linear-gradient(135deg, #6B8E3D 0%, #8CB555 50%, #D4A14B 100%)', icon: '🌾', accent: '#F6FFED' },
};

export const routeCovers: Record<number, CoverStyle> = {
  1: { gradient: 'linear-gradient(135deg, #E85D2F 0%, #D4A14B 100%)', icon: '🎒', accent: '#FFF1EA' },
  2: { gradient: 'linear-gradient(135deg, #0E3D75 0%, #1F5FA8 50%, #6B8E3D 100%)', icon: '🌙', accent: '#E8F1FB' },
  3: { gradient: 'linear-gradient(135deg, #7A5230 0%, #D4A14B 50%, #E85D2F 100%)', icon: '🎨', accent: '#FFF1EA' },
  4: { gradient: 'linear-gradient(135deg, #6B8E3D 0%, #1F5FA8 50%, #D4A14B 100%)', icon: '👨‍👩‍👧', accent: '#F6FFED' },
};

export const transportCovers: Record<number, CoverStyle> = {
  1: { gradient: 'linear-gradient(135deg, #1F5FA8, #3B7BC5)', icon: '🚌', accent: '#E8F1FB' },
  2: { gradient: 'linear-gradient(135deg, #6B8E3D, #8CB555)', icon: '🚐', accent: '#F6FFED' },
  3: { gradient: 'linear-gradient(135deg, #0E3D75, #1F5FA8)', icon: '🚄', accent: '#E8F1FB' },
  4: { gradient: 'linear-gradient(135deg, #E85D2F, #D4A14B)', icon: '🚗', accent: '#FFF1EA' },
};

// 默认封面（万一 ID 没匹配到）
export const defaultCover: CoverStyle = { gradient: 'linear-gradient(135deg, #1F5FA8, #6B8E3D)', icon: '🗺️', accent: '#E8F1FB' };
