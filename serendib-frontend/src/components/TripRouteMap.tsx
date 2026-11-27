import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Compass, ExternalLink, MapPin, Minus, Navigation, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import type { Place } from "../data/travelPlaces";

type Props = { itinerary: Place[]; showDirections?: boolean; fullPage?: boolean; eyebrow?: string; title?: string };
type Point = { x: number; y: number };
type GeoPoint = { longitude: number; latitude: number };
type MapView = GeoPoint & { zoom: number };
type Tile = { key: string; src: string; left: number; top: number };
type PlaceKind = "culture" | "beach" | "nature" | "wildlife" | "adventure";

const TILE_SIZE = 256;
const TILE_URL = "https://tile.openstreetmap.org";
const initialView: MapView = { longitude: 80.72, latitude: 7.82, zoom: 7 };

const knownCoordinates: Record<string, GeoPoint> = {
  sigiriya: { longitude: 80.7603, latitude: 7.957 },
  ella: { longitude: 81.0466, latitude: 6.8667 },
  "galle fort": { longitude: 80.221, latitude: 6.0535 },
  "yala national park": { longitude: 81.52, latitude: 6.37 },
  yala: { longitude: 81.52, latitude: 6.37 },
  mirissa: { longitude: 80.459, latitude: 5.948 },
  anuradhapura: { longitude: 80.4037, latitude: 8.3114 },
  kandy: { longitude: 80.6337, latitude: 7.2906 },
  trincomalee: { longitude: 81.2152, latitude: 8.5874 },
  "horton plains": { longitude: 80.8, latitude: 6.8 },
  polonnaruwa: { longitude: 81.0, latitude: 7.9403 },
  "arugam bay": { longitude: 81.84, latitude: 6.84 },
  minneriya: { longitude: 80.9, latitude: 8.03 },
  colombo: { longitude: 79.8612, latitude: 6.9271 },
  nuwara: { longitude: 80.7891, latitude: 6.9497 },
  jaffna: { longitude: 80.0074, latitude: 9.6615 },
  batticaloa: { longitude: 81.6924, latitude: 7.7102 },
  pasikudah: { longitude: 81.566, latitude: 7.923 },
  negombo: { longitude: 79.8358, latitude: 7.2083 },
  wilpattu: { longitude: 80.0, latitude: 8.45 },
  "adams peak": { longitude: 80.4994, latitude: 6.8096 },
};

const regionCenters: Record<string, GeoPoint> = {
  "Cultural Triangle": { longitude: 80.75, latitude: 8.05 },
  "Hill Country": { longitude: 80.78, latitude: 7.1 },
  "South Coast": { longitude: 80.58, latitude: 6.05 },
  "East Coast": { longitude: 81.65, latitude: 7.65 },
  Southeast: { longitude: 81.45, latitude: 6.55 },
  "West Coast": { longitude: 79.9, latitude: 7.25 },
};

function coordinatesFor(place: Place, index: number): GeoPoint {
  const key = place.name.toLowerCase();
  const exact = knownCoordinates[key] ?? Object.entries(knownCoordinates).find(([name]) => key.includes(name))?.[1];
  const region = regionCenters[place.region] ?? initialView;
  return exact ?? {
    longitude: region.longitude + ((index % 3) - 1) * 0.08,
    latitude: region.latitude + ((index % 4) - 1.5) * 0.07,
  };
}

function toWorld(point: GeoPoint, zoom: number): Point {
  const scale = TILE_SIZE * 2 ** zoom;
  const latitude = Math.max(-85.0511, Math.min(85.0511, point.latitude)) * Math.PI / 180;
  return {
    x: ((point.longitude + 180) / 360) * scale,
    y: ((1 - Math.log(Math.tan(latitude) + 1 / Math.cos(latitude)) / Math.PI) / 2) * scale,
  };
}

function fromWorld(point: Point, zoom: number): GeoPoint {
  const scale = TILE_SIZE * 2 ** zoom;
  const longitude = point.x / scale * 360 - 180;
  const n = Math.PI - 2 * Math.PI * point.y / scale;
  return { longitude, latitude: 180 / Math.PI * Math.atan(Math.sinh(n)) };
}

function getPlaceKind(place: Place): PlaceKind {
  const details = [place.category?.name ?? "", ...place.tags].join(" ").toLowerCase();
  if (/wildlife|safari|animal|bird/.test(details)) return "wildlife";
  if (/beach|coast|surf|diving|sea/.test(details)) return "beach";
  if (/culture|heritage|history|temple/.test(details)) return "culture";
  if (/adventure|hiking|trek|climb/.test(details)) return "adventure";
  return "nature";
}

const emojiForKind: Record<PlaceKind, string> = {
  culture: "🏛️",
  beach: "🏖️",
  nature: "🌿",
  wildlife: "🐘",
  adventure: "🥾",
};

function PlaceEmoji({ kind }: { kind: PlaceKind }) {
  const label: Record<PlaceKind, string> = {
    culture: "Culture and heritage",
    beach: "Beach and coast",
    nature: "Nature",
    wildlife: "Wildlife",
    adventure: "Adventure",
  };
  return <span className="trip-place-emoji" role="img" aria-label={label[kind]}>{emojiForKind[kind]}</span>;
}

function googleDirectionsFor(place: Place, index: number) {
  const point = coordinatesFor(place, index);
  const parameters = new URLSearchParams({
    api: "1",
    destination: `${point.latitude},${point.longitude}`,
    travelmode: "driving",
  });
  return `https://www.google.com/maps/dir/?${parameters.toString()}`;
}

function tilesFor(view: MapView, width: number, height: number): Tile[] {
  if (!width || !height) return [];
  const center = toWorld(view, view.zoom);
  const firstX = Math.floor((center.x - width / 2) / TILE_SIZE);
  const lastX = Math.floor((center.x + width / 2) / TILE_SIZE);
  const firstY = Math.floor((center.y - height / 2) / TILE_SIZE);
  const lastY = Math.floor((center.y + height / 2) / TILE_SIZE);
  const tileCount = 2 ** view.zoom;
  const tiles: Tile[] = [];

  for (let tileY = firstY; tileY <= lastY; tileY += 1) {
    if (tileY < 0 || tileY >= tileCount) continue;
    for (let tileX = firstX; tileX <= lastX; tileX += 1) {
      const wrappedX = ((tileX % tileCount) + tileCount) % tileCount;
      tiles.push({
        key: `${view.zoom}/${wrappedX}/${tileY}`,
        src: `${TILE_URL}/${view.zoom}/${wrappedX}/${tileY}.png`,
        left: tileX * TILE_SIZE - center.x + width / 2,
        top: tileY * TILE_SIZE - center.y + height / 2,
      });
    }
  }
  return tiles;
}

export default function TripRouteMap({ itinerary, showDirections = false, fullPage = false, eyebrow = "YOUR ROUTE, ON THE ISLAND", title = "Places on your map" }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; centerX: number; centerY: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [view, setView] = useState(initialView);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [tilesFailed, setTilesFailed] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;
    const resize = () => {
      const bounds = element.getBoundingClientRect();
      setViewport({ width: Math.round(bounds.width), height: Math.round(bounds.height) });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const places = useMemo(() => itinerary.map((place, index) => ({
    place,
    index,
    point: coordinatesFor(place, index),
    kind: getPlaceKind(place),
  })), [itinerary]);
  const centerWorld = useMemo(() => toWorld(view, view.zoom), [view]);
  const tiles = useMemo(() => tilesFor(view, viewport.width, viewport.height), [view, viewport]);
  const activeIndex = Math.min(selectedIndex, Math.max(0, places.length - 1));
  const selected = places[activeIndex];

  function selectStop(index: number) {
    setSelectedIndex(index);
  }

  function zoomBy(amount: number) {
    setView((current) => ({ ...current, zoom: Math.max(5, Math.min(11, current.zoom + amount)) }));
  }

  function resetView() {
    setView(initialView);
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest(".trip-map-control, .trip-map-pin")) return;
    if (!mapRef.current) return;
    const center = toWorld(view, view.zoom);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, centerX: center.x, centerY: center.y };
    mapRef.current.setPointerCapture(event.pointerId);
    setIsDragging(true);
    event.preventDefault();
  }

  function moveMap(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setView((current) => ({
      ...fromWorld({ x: drag.centerX - (event.clientX - drag.x), y: drag.centerY - (event.clientY - drag.y) }, current.zoom),
      zoom: current.zoom,
    }));
  }

  function stopDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
      if (mapRef.current?.hasPointerCapture(event.pointerId)) mapRef.current.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section className={fullPage ? "trip-route-map trip-route-map--full-page" : "trip-route-map"} aria-labelledby="trip-map-title">
      <div className="trip-map-heading">
        <div><p className="section-overline">{eyebrow}</p><h4 id="trip-map-title">{title}</h4></div>
        {!fullPage && <Link className="trip-map-full-page-link" to="/locations">Open full locations map</Link>}
        <span className="trip-map-count"><MapPin size={15} /> {itinerary.length} {itinerary.length === 1 ? "place" : "places"}</span>
      </div>
      <div className="trip-map-layout">
        <div
          ref={mapRef}
          className={isDragging ? "trip-map-canvas is-dragging" : "trip-map-canvas"}
          role="region"
          aria-label="Interactive Sri Lanka map showing destinations from your route"
          onPointerDown={startDrag}
          onPointerMove={moveMap}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          <div className="trip-map-tiles" aria-hidden="true">
            {tiles.map((tile) => <img key={tile.key} src={tile.src} alt="" draggable={false} onLoad={() => setMapReady(true)} onError={() => { setTilesFailed(true); setMapReady(true); }} style={{ left: tile.left, top: tile.top }} />)}
          </div>
          {places.map(({ place, index, point, kind }) => {
            const world = toWorld(point, view.zoom);
            const x = world.x - centerWorld.x + viewport.width / 2;
            const y = world.y - centerWorld.y + viewport.height / 2;
            if (x < -40 || y < -40 || x > viewport.width + 40 || y > viewport.height + 40) return null;
            return <button
              type="button"
              key={place.id}
              className={`trip-map-pin trip-map-pin--${kind}${index === activeIndex ? " is-selected" : ""}`}
              style={{ left: x, top: y }}
              onClick={() => selectStop(index)}
              aria-label={`Show ${place.name} on the itinerary`}
              aria-pressed={index === activeIndex}
              title={place.name}
            ><PlaceEmoji kind={kind} /><span className="sr-only">{place.name}</span></button>;
          })}
          <div className="trip-map-controls" aria-label="Map controls">
            <button className="trip-map-control" type="button" onClick={() => zoomBy(1)} aria-label="Zoom in"><Plus size={17} /></button>
            <button className="trip-map-control" type="button" onClick={() => zoomBy(-1)} aria-label="Zoom out"><Minus size={17} /></button>
            <button className="trip-map-control" type="button" onClick={resetView} aria-label="Reset map view"><Compass size={16} /></button>
          </div>
          {!mapReady && <div className="trip-map-loading" role="status"><span />Loading Sri Lanka street map…</div>}
          {tilesFailed && <div className="trip-map-error" role="status">Some map tiles could not load. Check your connection to view the full street map.</div>}
          <div className="trip-map-attribution">Map data © OpenStreetMap contributors · ODbL</div>
        </div>
        <div className="trip-map-stops" aria-label="Places in your planned route">
          <div className="trip-map-stop-list">{places.map(({ place, index, kind }) => (
            <div className="trip-map-stop-row" key={place.id}>
              <button type="button" className={index === activeIndex ? "trip-map-stop is-selected" : "trip-map-stop"} onClick={() => selectStop(index)} aria-pressed={index === activeIndex}>
                <span className={`trip-map-stop-icon trip-map-pin--${kind}`}><PlaceEmoji kind={kind} /></span><span><b>{place.name}</b><small>{place.region}</small></span><MapPin size={15} />
              </button>
              {showDirections && <a className="trip-map-row-directions" href={googleDirectionsFor(place,index)} target="_blank" rel="noopener noreferrer" aria-label={`Get Google Maps driving directions to ${place.name}`} title={`Directions to ${place.name}`}><Navigation size={16} /></a>}
            </div>
          ))}</div>
          {selected && <div className="trip-map-selected"><p>SELECTED PLACE · {String(activeIndex + 1).padStart(2, "0")}</p><h5>{selected.place.name}</h5><span>{selected.place.location}</span><small>{selected.place.shortDescription}</small>{showDirections && <a className="trip-map-directions" href={googleDirectionsFor(selected.place,activeIndex)} target="_blank" rel="noopener noreferrer"><Navigation size={16} /> Get Google directions <ExternalLink size={13} /></a>}</div>}
          <p className="trip-map-note">Drag to explore the street map. Choose any marker or destination to see its details.</p>
        </div>
      </div>
    </section>
  );
}
