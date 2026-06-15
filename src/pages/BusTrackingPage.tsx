import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getBusById } from '../data/transport';

// ─── Polyline decoder (Google/OSRM encoded polyline format) ───
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let shift = 0, result = 0, byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    shift = 0; result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

// Date-based seed for starting position
function getDaySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export default function BusTrackingPage() {
  const { busId } = useParams<{ busId: string }>();
  const bus = getBusById(busId || '');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const animRef = useRef<number>(0);

  const [liveSpeed, setLiveSpeed] = useState(bus?.speed || 0);
  const [liveEta, setLiveEta] = useState(bus?.etaMinutes || 0);
  const [liveDistance, setLiveDistance] = useState(bus?.distanceLeftKm || 0);
  const [liveProgress, setLiveProgress] = useState(bus?.journeyProgress || 0);
  const [hasReached, setHasReached] = useState(false);
  const [completedStopCount, setCompletedStopCount] = useState(0);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);

  useEffect(() => {
    if (!bus || !mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [bus.stops[0].lat, bus.stops[0].lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    // ─── Fetch real road route from OSRM ───
    const coords = bus.stops.map(s => `${s.lng},${s.lat}`).join(';');
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=polyline&steps=false`;

    fetch(osrmUrl)
      .then(res => res.json())
      .then(data => {
        if (data.code !== 'Ok' || !data.routes?.[0]) {
          throw new Error('OSRM route not found');
        }

        const route = data.routes[0];
        const roadPath = decodePolyline(route.geometry);
        const totalDistanceKm = (route.distance / 1000);
        const totalDurationMin = Math.round(route.duration / 60);

        setIsLoadingRoute(false);
        setLiveDistance(Number(totalDistanceKm.toFixed(1)));
        setLiveEta(totalDurationMin);

        // ─── Draw Road-Accurate Blue Route ───
        // Shadow line
        L.polyline(roadPath, {
          color: '#1e3a8a',
          weight: 12,
          opacity: 0.15,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        // Main blue route
        const routeLine = L.polyline(roadPath, {
          color: '#2563eb',
          weight: 7,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        map.fitBounds(routeLine.getBounds(), { padding: [80, 80] });

        // ─── Stop Markers ───
        const stopMarkers: L.Marker[] = [];
        bus.stops.forEach((stop, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === bus.stops.length - 1;
          const size = isFirst || isLast ? 30 : 22;

          const stopIcon = L.divIcon({
            className: 'custom-stop-marker',
            html: `
              <div style="
                width: ${size}px; height: ${size}px; border-radius: 50%;
                background: ${stop.completed ? '#10b981' : '#ffffff'};
                border: 3px solid ${stop.completed ? '#059669' : (isFirst ? '#2563eb' : isLast ? '#dc2626' : '#9ca3af')};
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.25);
                font-size: ${isFirst || isLast ? 12 : 10}px;
                color: ${stop.completed ? '#fff' : (isFirst ? '#2563eb' : isLast ? '#dc2626' : '#6b7280')};
                font-weight: bold;
              ">
                ${isFirst ? 'A' : isLast ? 'B' : (stop.completed ? '&#10003;' : (idx + 1))}
              </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });

          const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: Inter, sans-serif; min-width: 180px; padding: 4px 0;">
              <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px;">${stop.name}</div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">⏰ Scheduled: ${stop.scheduledTime}</div>
              <div style="font-size: 11px; color: #64748b;">👨‍🎓 Students: ${stop.studentCount}</div>
              <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: ${stop.completed ? '#059669' : '#9ca3af'};">
                ${stop.completed ? '✅ COMPLETED' : '⏳ PENDING'}
              </div>
            </div>
          `, { className: 'clean-popup' });
          stopMarkers.push(marker);
        });

        // ─── 🚌 Bus Marker ───
        const busIcon = L.divIcon({
          className: 'bus-live-marker',
          html: `
            <div style="position: relative; width: 60px; height: 60px;">
              <div style="
                position: absolute; top: 0; left: 0;
                width: 60px; height: 60px; border-radius: 50%;
                background: rgba(234, 179, 8, 0.15);
                animation: busPulse 3s ease-in-out infinite;
              "></div>
              <div style="
                position: relative; z-index: 10;
                width: 60px; height: 60px;
                display: flex; align-items: center; justify-content: center;
                font-size: 38px;
                filter: drop-shadow(0 3px 8px rgba(0,0,0,0.3));
              ">🚌</div>
              <div style="
                position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
                background: #0f172a; color: #fbbf24;
                font-size: 9px; font-weight: 800; font-family: Inter, sans-serif;
                padding: 1px 8px; border-radius: 4px;
                white-space: nowrap; letter-spacing: 0.5px;
                z-index: 20;
              ">${bus.routeNumber}</div>
            </div>
          `,
          iconSize: [60, 60],
          iconAnchor: [30, 45],
        });

        // Start position based on day seed
        const daySeed = getDaySeed();
        const busNumericId = parseInt(bus.id.replace(/\D/g, ''), 10) || 1;
        const randomStart = ((daySeed * busNumericId) % 50) / 100;
        const startIdx = Math.floor((roadPath.length - 1) * randomStart);

        const busMarker = L.marker(roadPath[startIdx], { icon: busIcon, zIndexOffset: 1000 }).addTo(map);

        // ─── Animate bus along REAL ROAD path ───
        let currentIdx = startIdx;
        let subStep = 0;
        const subStepsPerSegment = 60; // Steps between each road point (many more points = slow overall)
        let reached = false;
        let lastTimestamp = 0;

        function animateBus(timestamp: number) {
          if (reached) return;
          if (timestamp - lastTimestamp < 16) {
            animRef.current = requestAnimationFrame(animateBus);
            return;
          }
          lastTimestamp = timestamp;

          if (currentIdx >= roadPath.length - 1) {
            reached = true;
            setHasReached(true);
            setLiveSpeed(0);
            setLiveEta(0);
            setLiveDistance(0);
            setLiveProgress(100);
            setCompletedStopCount(bus!.stops.length);

            const reachedIcon = L.divIcon({
              className: 'bus-live-marker',
              html: `
                <div style="position: relative; width: 60px; height: 60px;">
                  <div style="
                    position: relative; z-index: 10;
                    width: 60px; height: 60px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 38px;
                    filter: drop-shadow(0 3px 8px rgba(0,0,0,0.2));
                  ">🚌</div>
                  <div style="
                    position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
                    background: #16a34a; color: white;
                    font-size: 9px; font-weight: 800; font-family: Inter, sans-serif;
                    padding: 2px 8px; border-radius: 5px;
                    white-space: nowrap; z-index: 20;
                  ">✅ REACHED</div>
                </div>
              `,
              iconSize: [60, 60],
              iconAnchor: [30, 45],
            });
            busMarker.setIcon(reachedIcon);

            // Mark all stops completed
            bus!.stops.forEach((_, si) => {
              const sz = si === 0 || si === bus!.stops.length - 1 ? 30 : 22;
              stopMarkers[si]?.setIcon(L.divIcon({
                className: 'custom-stop-marker',
                html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:#10b981;border:3px solid #059669;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.25);font-size:10px;color:#fff;font-weight:bold;">&#10003;</div>`,
                iconSize: [sz, sz],
                iconAnchor: [sz / 2, sz / 2],
              }));
            });
            return;
          }

          const from = roadPath[currentIdx];
          const to = roadPath[currentIdx + 1];

          if (from && to) {
            const t = subStep / subStepsPerSegment;
            const lat = from[0] + (to[0] - from[0]) * t;
            const lng = from[1] + (to[1] - from[1]) * t;
            busMarker.setLatLng([lat, lng]);

            subStep++;
            if (subStep >= subStepsPerSegment) {
              subStep = 0;
              currentIdx++;

              // Update stats every 20 road segments
              if (currentIdx % 20 === 0) {
                const totalSegs = roadPath.length - 1;
                const remaining = totalSegs - currentIdx;
                const progress = Math.round((currentIdx / totalSegs) * 100);
                const distLeft = (totalDistanceKm * remaining) / totalSegs;
                const etaLeft = Math.round((totalDurationMin * remaining) / totalSegs);

                setLiveDistance(Number(distLeft.toFixed(1)));
                setLiveEta(Math.max(1, etaLeft));
                setLiveSpeed(20 + Math.floor(Math.random() * 15));
                setLiveProgress(progress);

                // Check which stops have been passed
                const completedCount = bus!.stops.filter((stop) => {
                  // Find closest road point to this stop
                  let minDist = Infinity;
                  let closestRoadIdx = 0;
                  roadPath.forEach((rp, ri) => {
                    const d = Math.abs(rp[0] - stop.lat) + Math.abs(rp[1] - stop.lng);
                    if (d < minDist) { minDist = d; closestRoadIdx = ri; }
                  });
                  return currentIdx >= closestRoadIdx;
                }).length;
                setCompletedStopCount(completedCount);

                // Update stop markers as completed
                bus!.stops.forEach((stop, si) => {
                  let minDist = Infinity;
                  let closestRoadIdx = 0;
                  roadPath.forEach((rp, ri) => {
                    const d = Math.abs(rp[0] - stop.lat) + Math.abs(rp[1] - stop.lng);
                    if (d < minDist) { minDist = d; closestRoadIdx = ri; }
                  });
                  if (currentIdx >= closestRoadIdx) {
                    const sz = si === 0 || si === bus!.stops.length - 1 ? 30 : 22;
                    stopMarkers[si]?.setIcon(L.divIcon({
                      className: 'custom-stop-marker',
                      html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:#10b981;border:3px solid #059669;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.25);font-size:10px;color:#fff;font-weight:bold;">&#10003;</div>`,
                      iconSize: [sz, sz],
                      iconAnchor: [sz / 2, sz / 2],
                    }));
                  }
                });
              }
            }
          }

          animRef.current = requestAnimationFrame(animateBus);
        }

        animRef.current = requestAnimationFrame(animateBus);
      })
      .catch(() => {
        // Fallback: use straight-line path if OSRM fails
        setIsLoadingRoute(false);
        const fallbackPath = bus.stops.map(s => [s.lat, s.lng] as [number, number]);
        L.polyline(fallbackPath, {
          color: '#2563eb', weight: 6, opacity: 0.8,
          lineCap: 'round', lineJoin: 'round',
        }).addTo(map);
        map.fitBounds(L.polyline(fallbackPath).getBounds(), { padding: [60, 60] });

        bus.stops.forEach((stop, idx) => {
          const size = idx === 0 || idx === bus.stops.length - 1 ? 28 : 20;
          const stopIcon = L.divIcon({
            className: 'custom-stop-marker',
            html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${stop.completed ? '#10b981' : '#fff'};border:3px solid ${stop.completed ? '#059669' : '#9ca3af'};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.2);font-size:10px;color:${stop.completed ? '#fff' : '#6b7280'};font-weight:bold;">${stop.completed ? '&#10003;' : (idx + 1)}</div>`,
            iconSize: [size, size], iconAnchor: [size / 2, size / 2],
          });
          L.marker([stop.lat, stop.lng], { icon: stopIcon }).addTo(map);
        });
      });

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [bus]);

  if (!bus) {
    return (
      <div className="p-8 text-center">
        <h2 className="font-[Outfit] text-2xl font-bold mb-4">Bus Not Found</h2>
        <Link to="/transport" className="text-primary font-bold hover:underline">Back to Fleet</Link>
      </div>
    );
  }

  const displayStatus = hasReached ? 'Reached' : bus.status;
  const statusStyle = hasReached
    ? 'text-emerald-700 bg-emerald-50'
    : bus.status === 'On Route' ? 'text-emerald-700 bg-emerald-50'
    : bus.status === 'Delayed' ? 'text-amber-700 bg-amber-50'
    : 'text-gray-600 bg-gray-100';

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Top Bar */}
      <div className="bg-surface border-b border-outline-variant px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/transport" className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-[Outfit] text-xl font-bold">Route {bus.routeNumber}</h2>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyle}`}>
                {displayStatus}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-semibold">{bus.routeName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-2 rounded-xl">
            <span className="material-symbols-outlined text-primary text-[18px]">speed</span>
            <div>
              <p className="text-[9px] text-on-surface-variant font-semibold uppercase">Speed</p>
              <p className="text-sm font-bold">{liveSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">schedule</span>
            <div>
              <p className="text-[9px] text-on-surface-variant font-semibold uppercase">ETA</p>
              <p className="text-sm font-bold">{hasReached ? 'Arrived' : `${liveEta} mins`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">straighten</span>
            <div>
              <p className="text-[9px] text-on-surface-variant font-semibold uppercase">Distance Left</p>
              <p className="text-sm font-bold">{hasReached ? '0 km' : `${liveDistance} km`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main: Map + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Loading overlay */}
          {isLoadingRoute && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
              <div className="bg-surface p-6 rounded-2xl shadow-xl border border-outline-variant flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[32px] animate-spin">sync</span>
                <p className="font-bold text-sm">Loading real road route...</p>
                <p className="text-[11px] text-on-surface-variant">Fetching road geometry from OSRM</p>
              </div>
            </div>
          )}

          {/* Live badge */}
          {!isLoadingRoute && (
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-outline-variant/50 flex items-center gap-2 z-[1000]">
              <div className={`w-2.5 h-2.5 rounded-full ${hasReached ? 'bg-emerald-500' : 'bg-emerald-500 animate-pulse'}`}></div>
              <span className="text-xs font-bold text-on-surface">{hasReached ? 'Journey Complete' : 'Live Tracking'}</span>
            </div>
          )}

          {/* Reached overlay */}
          {hasReached && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-[1000]">
              <span className="material-symbols-outlined text-[24px]">check_circle</span>
              <div>
                <p className="font-bold text-base">Bus has reached its destination</p>
                <p className="text-xs opacity-80">All stops completed. Journey resets tomorrow.</p>
              </div>
            </div>
          )}

          {/* Geo-fence alert */}
          {bus.geoFenceStatus === 'Alert' && !hasReached && (
            <div className="absolute top-4 right-4 bg-red-50 border border-red-200 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 z-[1000]">
              <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
              <span className="text-xs font-bold text-red-700">Geo-Fence Alert</span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-[360px] bg-surface border-l border-outline-variant overflow-y-auto shrink-0">
          {/* Driver */}
          <div className="p-5 border-b border-outline-variant">
            <h3 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-3">Driver Info</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                {bus.driverName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm">{bus.driverName}</p>
                <p className="text-xs text-on-surface-variant font-semibold">{bus.driverPhone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-surface-container-low p-2 rounded-lg">
                <p className="text-on-surface-variant font-semibold">Vehicle</p>
                <p className="font-bold">{bus.vehicleNumber}</p>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg">
                <p className="text-on-surface-variant font-semibold">Capacity</p>
                <p className="font-bold">{bus.currentStudents} / {bus.capacity}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <a href={`tel:${bus.driverPhone.replace(/\s+/g, '')}`} className="flex-1 bg-primary text-on-primary py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">call</span> Call
              </a>
              <a href={`sms:${bus.driverPhone.replace(/\s+/g, '')}`} className="flex-1 border border-outline-variant py-2 rounded-xl text-xs font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">sms</span> Message
              </a>
            </div>
          </div>

          {/* Journey Progress */}
          <div className="p-5 border-b border-outline-variant">
            <h3 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-3">Journey Progress</h3>
            <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${hasReached ? 'bg-emerald-500' : bus.status === 'Delayed' ? 'bg-amber-500' : 'bg-primary'}`}
                style={{ width: `${liveProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold">
              <span>{hasReached ? '100' : liveProgress}% complete</span>
              <span>{liveDistance} km remaining</span>
            </div>
          </div>

          {/* Stop Timeline */}
          <div className="p-5">
            <h3 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-4">Route Stops</h3>
            <div className="relative">
              <div className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-outline-variant/40" />

              {bus.stops.map((stop, idx) => {
                const isCompleted = idx < completedStopCount || hasReached;
                const isNext = idx === completedStopCount && !hasReached;

                return (
                  <div key={stop.id} className={`flex items-start gap-4 relative py-3 ${isNext ? 'bg-primary/5 -mx-5 px-5 rounded-xl' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 transition-all ${
                      isCompleted ? 'bg-emerald-500 shadow-sm' :
                      isNext ? 'bg-primary shadow-md ring-4 ring-primary/20' :
                      'bg-surface border-2 border-outline-variant'
                    }`}>
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-white text-[14px]">check</span>
                      ) : isNext ? (
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      ) : (
                        <span className="text-[9px] font-bold text-on-surface-variant">{idx + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${isCompleted ? 'text-on-surface' : isNext ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {stop.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-on-surface-variant font-semibold">
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[11px]">schedule</span>
                          {stop.scheduledTime}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[11px]">person</span>
                          {stop.studentCount} students
                        </span>
                      </div>
                      {isNext && (
                        <div className="mt-2 flex items-center gap-1.5 text-primary">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-bold">Next Stop</span>
                        </div>
                      )}
                      {isCompleted && idx === bus.stops.length - 1 && hasReached && (
                        <div className="mt-2 flex items-center gap-1.5 text-emerald-600">
                          <span className="material-symbols-outlined text-[12px]">flag</span>
                          <span className="text-[10px] font-bold">Final Destination</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geo-Fence */}
          <div className="p-5 border-t border-outline-variant">
            <h3 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-3">Geo-Fence Status</h3>
            <div className={`p-3 rounded-xl flex items-center gap-3 ${
              bus.geoFenceStatus === 'Alert' ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'
            }`}>
              <span className={`material-symbols-outlined text-[20px] ${
                bus.geoFenceStatus === 'Alert' ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {bus.geoFenceStatus === 'Alert' ? 'warning' : 'verified_user'}
              </span>
              <div>
                <p className={`text-sm font-bold ${bus.geoFenceStatus === 'Alert' ? 'text-red-700' : 'text-emerald-700'}`}>
                  {bus.geoFenceStatus === 'Alert' ? 'Zone Breach Detected' : 'Within Permitted Zone'}
                </p>
                <p className="text-[10px] text-on-surface-variant font-semibold">
                  {bus.geoFenceStatus === 'Alert' ? 'Bus deviated from assigned route.' : 'All geo-fence parameters normal.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes busPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2.5); opacity: 0; }
        }
        .clean-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          padding: 4px;
        }
        .clean-popup .leaflet-popup-tip { box-shadow: none; }
        .bus-live-marker, .custom-stop-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
