import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { MAP_CONTINENT, findShortestRoute, MapLandmark, MapZone, getLandmark } from '../data/worldData';
import { TRANSPORTS, TransportOption } from '../utils/dice';
import { soundEngine } from '../utils/audio';
import { 
  ZoomIn, 
  ZoomOut, 
  X, 
  Compass, 
  Send,
  Search,
  CheckCircle2,
  Navigation,
  ListFilter,
  Map as MapIcon,
  ChevronDown
} from 'lucide-react';

interface WorldMapModalProps {
  currentLandmark: string;
  onClose: () => void;
  onStartTravel: (destination: string, transportId: string) => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  currentLandmark,
  onClose,
  onStartTravel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(0.06);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  // View mode: 'canvas' or 'directory'
  const [viewMode, setViewMode] = useState<'canvas' | 'directory'>('canvas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('all');

  const [selectedLandmark, setSelectedLandmark] = useState<MapLandmark | null>(null);
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<TransportOption>(TRANSPORTS[1]); // Default thoroughbred horse

  // Calculate route whenever selectedLandmark changes
  const travelRoute = useMemo(() => {
    if (!selectedLandmark || selectedLandmark.name === currentLandmark) return null;
    return findShortestRoute(currentLandmark, selectedLandmark.name);
  }, [selectedLandmark, currentLandmark]);

  // Center on player landmark initially
  useEffect(() => {
    let playerX = 0;
    let playerY = 0;
    for (const z of MAP_CONTINENT.zones) {
      for (const lm of z.landmarks) {
        if (lm.name === currentLandmark) {
          playerX = lm.x;
          playerY = lm.y;
          break;
        }
      }
    }

    if (canvasRef.current) {
      const w = canvasRef.current.clientWidth || window.innerWidth;
      const h = canvasRef.current.clientHeight || window.innerHeight;
      const initialScale = Math.min(w, h) / 10000;
      setScale(initialScale);
      setOffset({
        x: w / 2 - playerX * initialScale,
        y: h / 2 - playerY * initialScale
      });
    }
  }, [currentLandmark]);

  // Canvas drawing
  const renderMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== 'canvas') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, width, height);

    const tx = (x: number) => x * scale + offset.x;
    const ty = (y: number) => y * scale + offset.y;

    // Draw continent zones
    for (const zone of MAP_CONTINENT.zones) {
      if (zone.path && zone.path.length > 2) {
        ctx.beginPath();
        zone.path.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(tx(p.x), ty(p.y));
          else ctx.lineTo(tx(p.x), ty(p.y));
        });
        ctx.closePath();
        ctx.fillStyle = zone.color;
        ctx.fill();
        ctx.strokeStyle = zone.border;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Draw Roads
    for (const road of MAP_CONTINENT.roads) {
      if (road.points.length < 2) continue;
      ctx.beginPath();
      road.points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(tx(p.x), ty(p.y));
        else ctx.lineTo(tx(p.x), ty(p.y));
      });
      ctx.strokeStyle = road.type === 'highway' ? '#d4a020' : '#8a7a5a';
      ctx.lineWidth = road.type === 'highway' ? 3 : 1.8;
      ctx.stroke();
    }

    // Highlight travel route
    if (travelRoute && travelRoute.path.length >= 2) {
      ctx.beginPath();
      travelRoute.path.forEach((lmName, idx) => {
        const found = getLandmark(lmName);
        if (found) {
          if (idx === 0) ctx.moveTo(tx(found.landmark.x), ty(found.landmark.y));
          else ctx.lineTo(tx(found.landmark.x), ty(found.landmark.y));
        }
      });
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Mountains
    for (const m of MAP_CONTINENT.mountains) {
      const px = tx(m.x);
      const py = ty(m.y);
      if (px < -100 || px > width + 100 || py < -100 || py > height + 100) continue;
      ctx.font = `${Math.max(14, Math.floor(180 * scale))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.icon, px, py);
    }

    // Draw Landmarks
    for (const zone of MAP_CONTINENT.zones) {
      for (const lm of zone.landmarks) {
        const px = tx(lm.x);
        const py = ty(lm.y);
        if (px < -100 || px > width + 100 || py < -100 || py > height + 100) continue;

        const isPlayer = lm.name === currentLandmark;
        const isSelected = selectedLandmark?.name === lm.name;

        // Player glowing circle marker
        if (isPlayer) {
          ctx.beginPath();
          ctx.arc(px, py, Math.max(20, 320 * scale), 0, Math.PI * 2);
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
          ctx.fill();
        }

        // Selection glowing target marker
        if (isSelected && !isPlayer) {
          ctx.beginPath();
          ctx.arc(px, py, Math.max(18, 300 * scale), 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.fill();
        }

        // Icon
        ctx.font = `${Math.max(14, Math.floor(170 * scale))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lm.icon, px, py - 4);

        // Name Tag
        const fontSize = Math.max(10, Math.min(13, Math.floor(130 * scale)));
        ctx.font = `600 ${fontSize}px sans-serif`;
        const textWidth = ctx.measureText(lm.name).width;

        ctx.fillStyle = isPlayer 
          ? 'rgba(234, 179, 8, 0.95)' 
          : isSelected 
          ? 'rgba(56, 189, 248, 0.95)' 
          : 'rgba(10, 10, 15, 0.85)';
        ctx.fillRect(px - textWidth / 2 - 4, py + fontSize * 0.4, textWidth + 8, fontSize + 4);

        ctx.fillStyle = isPlayer ? '#000' : isSelected ? '#000' : '#e5e5e5';
        ctx.fillText(lm.name, px, py + fontSize);
      }
    }

    ctx.restore();
  }, [scale, offset, currentLandmark, selectedLandmark, travelRoute, viewMode]);

  useEffect(() => {
    renderMap();
  }, [renderMap]);

  // Handle tap or click on canvas - uses generous screen-pixel radius (80px for effortless touch)
  const processClickAt = (screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = screenX - rect.left;
    const clickY = screenY - rect.top;

    let closestLm: MapLandmark | null = null;
    let closestZone: MapZone | null = null;
    let minDist = 80; // 80 screen pixels radius for mobile and desktop

    for (const zone of MAP_CONTINENT.zones) {
      for (const lm of zone.landmarks) {
        const sx = lm.x * scale + offset.x;
        const sy = lm.y * scale + offset.y;
        const d = Math.hypot(sx - clickX, sy - clickY);
        if (d < minDist) {
          minDist = d;
          closestLm = lm;
          closestZone = zone;
        }
      }
    }

    if (closestLm && closestZone) {
      soundEngine.playClick();
      setSelectedLandmark(closestLm);
      setSelectedZone(closestZone);
    }
  };

  const handleZoom = (factor: number) => {
    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const newScale = Math.max(0.015, Math.min(0.25, scale * factor));
    setOffset({
      x: w / 2 - (w / 2 - offset.x) * (newScale / scale),
      y: h / 2 - (h / 2 - offset.y) * (newScale / scale)
    });
    setScale(newScale);
  };

  const handleCenterPlayer = () => {
    soundEngine.playClick();
    const current = getLandmark(currentLandmark);
    if (!current || !canvasRef.current) return;
    const w = canvasRef.current.clientWidth;
    const h = canvasRef.current.clientHeight;
    const s = Math.min(w, h) / 10000;
    setScale(s);
    setOffset({
      x: w / 2 - current.landmark.x * s,
      y: h / 2 - current.landmark.y * s
    });
  };

  const handleSelectLandmarkDirectly = (name: string) => {
    const found = getLandmark(name);
    if (!found) return;
    soundEngine.playClick();
    setSelectedLandmark(found.landmark);
    setSelectedZone(found.zone);

    // Center canvas lightly on selected landmark
    if (canvasRef.current) {
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      setOffset({
        x: w / 2 - found.landmark.x * scale,
        y: h / 2 - found.landmark.y * scale
      });
    }
  };

  const handleConfirmTravel = () => {
    if (!selectedLandmark) return;
    soundEngine.playClick();
    onStartTravel(selectedLandmark.name, selectedTransport.id);
    onClose();
  };

  // Filtered landmarks for directory view
  const allLandmarksList = useMemo(() => {
    const list: { landmark: MapLandmark; zone: MapZone; dist: number }[] = [];
    for (const zone of MAP_CONTINENT.zones) {
      if (selectedZoneFilter !== 'all' && zone.id !== selectedZoneFilter) continue;
      for (const lm of zone.landmarks) {
        if (searchQuery.trim() && !lm.name.includes(searchQuery.trim()) && !zone.name.includes(searchQuery.trim())) {
          continue;
        }
        const route = findShortestRoute(currentLandmark, lm.name);
        list.push({
          landmark: lm,
          zone,
          dist: route ? route.dist : 0
        });
      }
    }
    return list.sort((a, b) => a.dist - b.dist);
  }, [selectedZoneFilter, searchQuery, currentLandmark]);

  const travelDays = travelRoute
    ? Math.max(1, Math.ceil(travelRoute.dist / selectedTransport.kmPerDay))
    : 1;
  const travelCostCopper = selectedTransport.costCopperPerDay * travelDays;
  const travelCaloriesBurn = travelRoute
    ? Math.round(travelDays * (selectedTransport.caloriesPerDay ?? 2000))
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950 border-b border-amber-900/40 text-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <span className="font-serif font-bold text-amber-300 text-sm">خريطة قارة التربة القاتمة</span>
          <span className="text-neutral-500 hidden sm:inline">|</span>
          <span className="text-neutral-400 hidden sm:inline">
            موقعك: <strong className="text-amber-400">{currentLandmark}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-neutral-900 rounded-lg border border-neutral-800 p-0.5">
            <button
              onClick={() => {
                soundEngine.playClick();
                setViewMode('canvas');
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'canvas' ? 'bg-amber-600 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>الخريطة</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setViewMode('directory');
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'directory' ? 'bg-amber-600 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>دليل المعالم</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col">
        {viewMode === 'canvas' ? (
          <div className="relative flex-1 w-full min-h-0">
            {/* Quick Destination Floating Dropdown Bar */}
            <div className="absolute top-3 inset-x-3 z-20 max-w-xl mx-auto flex items-center gap-2 bg-neutral-950/90 border border-amber-900/50 p-2 rounded-xl backdrop-blur-md shadow-2xl">
              <span className="text-[11px] font-bold text-amber-400 whitespace-nowrap hidden sm:inline">
                اختر وجهة السفر:
              </span>
              <div className="relative flex-1">
                <select
                  value={selectedLandmark?.name || ''}
                  onChange={(e) => {
                    if (e.target.value) handleSelectLandmarkDirectly(e.target.value);
                  }}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-amber-200 outline-none cursor-pointer focus:border-amber-500 appearance-none text-right font-serif"
                >
                  <option value="">-- اضغط على الخريطة أو اختر مدينة هنا --</option>
                  {MAP_CONTINENT.zones.map((zone) => (
                    <optgroup key={zone.id} label={`📍 ${zone.name}`}>
                      {zone.landmarks.map((lm) => (
                        <option key={lm.name} value={lm.name}>
                          {lm.icon} {lm.name} {lm.name === currentLandmark ? '(موقعك الحالي)' : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute left-2.5 top-2 pointer-events-none" />
              </div>
            </div>

            <canvas
              ref={canvasRef}
              onMouseDown={(e) => {
                pointerDownPos.current = { x: e.clientX, y: e.clientY };
                setIsDragging(true);
                setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
              }}
              onMouseMove={(e) => {
                if (!isDragging) return;
                setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
              }}
              onMouseUp={(e) => {
                setIsDragging(false);
                if (pointerDownPos.current) {
                  const distMoved = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y);
                  if (distMoved < 25) {
                    processClickAt(e.clientX, e.clientY);
                  }
                }
              }}
              onClick={(e) => {
                // Ensure clicks reliably select landmarks on desktop and laptop
                if (pointerDownPos.current) {
                  const distMoved = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y);
                  if (distMoved < 25) {
                    processClickAt(e.clientX, e.clientY);
                  }
                } else {
                  processClickAt(e.clientX, e.clientY);
                }
              }}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  const t = e.touches[0];
                  pointerDownPos.current = { x: t.clientX, y: t.clientY };
                  setIsDragging(true);
                  setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
                }
              }}
              onTouchMove={(e) => {
                if (!isDragging || e.touches.length !== 1) return;
                const t = e.touches[0];
                setOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
              }}
              onTouchEnd={(e) => {
                setIsDragging(false);
                if (pointerDownPos.current && e.changedTouches.length >= 1) {
                  const t = e.changedTouches[0];
                  const distMoved = Math.hypot(t.clientX - pointerDownPos.current.x, t.clientY - pointerDownPos.current.y);
                  if (distMoved < 30) {
                    processClickAt(t.clientX, t.clientY);
                  }
                }
              }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />

            {/* Canvas Floating Zoom & Center Buttons */}
            <div className="absolute top-16 left-3 flex flex-col gap-1.5 bg-neutral-950/85 p-1.5 rounded-xl border border-neutral-800 backdrop-blur-md z-10">
              <button
                onClick={() => handleZoom(1.3)}
                className="p-2 text-neutral-300 hover:text-amber-400 bg-neutral-900 rounded-lg cursor-pointer"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom(0.7)}
                className="p-2 text-neutral-300 hover:text-amber-400 bg-neutral-900 rounded-lg cursor-pointer"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleCenterPlayer}
                className="p-2 text-neutral-300 hover:text-amber-400 bg-neutral-900 rounded-lg cursor-pointer"
                title="إعادة التمركز على موقعي الحالي"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Directory List View */
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-4xl mx-auto w-full">
            {/* Search and Zone Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2 sticky top-0 bg-neutral-950/95 p-2 rounded-xl border border-neutral-800 z-10">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مدينة أو قلعة أو معلم..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-neutral-200 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                {[
                  { id: 'all', name: 'الكل' },
                  { id: 'central_plains', name: 'السهول الوسطى' },
                  { id: 'north_highlands', name: 'المرتفعات الشمالية' },
                  { id: 'east_desert', name: 'الصحراء الشرقية' },
                  { id: 'west_coast', name: 'الساحل الغربي' },
                  { id: 'south_wetlands', name: 'الأراضي الرطبة' }
                ].map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setSelectedZoneFilter(z.id)}
                    className={`px-2.5 py-1 rounded-lg border whitespace-nowrap cursor-pointer transition-all ${
                      selectedZoneFilter === z.id
                        ? 'bg-amber-600 text-black font-bold border-amber-600'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {z.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Landmarks Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {allLandmarksList.map(({ landmark, zone, dist }) => {
                const isCurrent = landmark.name === currentLandmark;
                const isSelected = selectedLandmark?.name === landmark.name;

                return (
                  <button
                    key={landmark.name}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedLandmark(landmark);
                      setSelectedZone(zone);
                    }}
                    className={`flex flex-col text-right p-3 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-950/30 border-amber-500/70'
                        : isSelected
                        ? 'bg-neutral-900 border-sky-500 shadow-md shadow-sky-950/40'
                        : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-neutral-200 text-xs flex items-center gap-1.5">
                        <span>{landmark.icon}</span>
                        <span>{landmark.name}</span>
                      </span>
                      {isCurrent ? (
                        <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-bold font-mono">
                          موقعك الآن
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-amber-400/90 font-bold">
                          {dist} كم
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-neutral-500 font-mono mb-2">
                      {zone.name}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-auto pt-1.5 border-t border-neutral-800/60">
                      <span>خطر: {landmark.danger}%</span>
                      <span>{landmark.resources.slice(0, 2).join(' · ')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Landmark & Safe Travel Card Drawer (Pinned at bottom, immediately visible when clicking ANY city) */}
        {selectedLandmark && (
          <div className="shrink-0 bg-neutral-950/98 border-t-2 border-amber-600/80 p-3 sm:p-4 shadow-2xl backdrop-blur-md z-30 animate-in slide-in-from-bottom-5 duration-200">
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center justify-between w-full md:w-auto gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl p-2 sm:p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
                    {selectedLandmark.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-amber-200 text-sm md:text-base">
                        {selectedLandmark.name}
                      </h3>
                      <span className="text-xs text-neutral-400 font-mono">
                        ({selectedZone?.name || 'الإقليم'})
                      </span>
                    </div>

                    {selectedLandmark.name !== currentLandmark && travelRoute ? (
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-neutral-400 mt-1 font-mono">
                        <span className="text-amber-400 font-bold">المسافة: {travelRoute.dist} كم</span>
                        <span>·</span>
                        <span className="text-amber-300 font-bold">المدة: {travelDays} يوم</span>
                        <span>·</span>
                        <span className="text-orange-400 font-bold flex items-center gap-0.5">
                          🔥 {travelCaloriesBurn.toLocaleString('ar-SA')} سعرة
                        </span>
                        {travelCostCopper > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-amber-500 font-bold">التكلفة: {travelCostCopper} نحاس</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-amber-500 font-medium">أنت متواجد في هذا المعلم حالياً</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLandmark(null)}
                  className="md:hidden text-neutral-400 hover:text-white p-1 text-sm bg-neutral-900 rounded border border-neutral-800"
                  title="إلغاء التحديد"
                >
                  ✕
                </button>
              </div>

              {/* Transport selection & Safe Travel launch */}
              {selectedLandmark.name !== currentLandmark && travelRoute && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                  {/* Transport pill selector */}
                  <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 overflow-x-auto text-xs">
                    {TRANSPORTS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedTransport(t);
                        }}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs ${
                          selectedTransport.id === t.id
                            ? 'bg-amber-600 text-black font-bold shadow-md'
                            : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>

                  {/* Guaranteed Safe Travel Button */}
                  <button
                    onClick={handleConfirmTravel}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-950/60 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>سافر بأمان إلى {selectedLandmark.name}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedLandmark(null)}
                    className="hidden md:flex items-center justify-center p-2 text-neutral-400 hover:text-white bg-neutral-900 rounded-xl border border-neutral-800 cursor-pointer"
                    title="إلغاء التحديد"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Safe travel notice */}
            {selectedLandmark.name !== currentLandmark && (
              <div className="max-w-3xl mx-auto flex items-center justify-center gap-1.5 text-[11px] text-emerald-400/95 font-medium mt-2 pt-2 border-t border-neutral-900">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>سفر سالم ومضمون 100% بدون أي قطاع طرق أو سيناريوهات تعطل.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
