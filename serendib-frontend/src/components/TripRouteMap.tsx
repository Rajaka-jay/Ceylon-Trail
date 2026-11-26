import { useMemo, useState } from "react";
import { MapPin, Route } from "lucide-react";
import type { Place } from "../data/travelPlaces";

type Props = { itinerary: Place[] };
type Point = { x: number; y: number };

const knownCoordinates: Record<string, [number, number]> = {
  sigiriya: [80.7603, 7.957], ella: [81.0466, 6.8667], "galle fort": [80.221, 6.0535],
  "yala national park": [81.52, 6.37], yala: [81.52, 6.37], mirissa: [80.459, 5.948],
  anuradhapura: [80.4037, 8.3114], kandy: [80.6337, 7.2906], trincomalee: [81.2152, 8.5874],
  "horton plains": [80.8, 6.8], polonnaruwa: [81.0, 7.9403], "arugam bay": [81.84, 6.84],
  minneriya: [80.9, 8.03], colombo: [79.8612, 6.9271], nuwara: [80.7891, 6.9497],
  jaffna: [80.0074, 9.6615], batticaloa: [81.6924, 7.7102], pasikudah: [81.566, 7.923],
  "negombo": [79.8358, 7.2083], "wilpattu": [80.0, 8.45], "adams peak": [80.4994, 6.8096],
};
const regionCenters: Record<string, [number, number]> = {
  "Cultural Triangle": [80.75, 8.05], "Hill Country": [80.78, 7.1], "South Coast": [80.58, 6.05],
  "East Coast": [81.65, 7.65], Southeast: [81.45, 6.55], "West Coast": [79.9, 7.25],
};

function coordinatesFor(place: Place, index: number): Point {
  const key = place.name.toLowerCase();
  const exact = knownCoordinates[key] ?? Object.entries(knownCoordinates).find(([name]) => key.includes(name))?.[1];
  const region = regionCenters[place.region] ?? regionCenters["Hill Country"];
  const [longitude, latitude] = exact ?? [region[0] + ((index % 3) - 1) * 0.08, region[1] + ((index % 4) - 1.5) * 0.07];
  return { x: 82 + (longitude - 79.55) * 255, y: 48 + (9.92 - latitude) * 122 };
}

export default function TripRouteMap({ itinerary }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const points = useMemo(() => itinerary.map(coordinatesFor), [itinerary]);
  const selected = itinerary[Math.min(selectedIndex, Math.max(0, itinerary.length - 1))];
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  function selectStop(index: number) {
    setSelectedIndex(index);
  }

  return (
    <section className="trip-route-map" aria-labelledby="trip-map-title">
      <div className="trip-map-heading">
        <div><p className="section-overline">YOUR ROUTE, ON THE ISLAND</p><h4 id="trip-map-title">Stops at a glance</h4></div>
        <span className="trip-map-count"><Route size={15} /> {itinerary.length} {itinerary.length === 1 ? "stop" : "stops"}</span>
      </div>
      <div className="trip-map-layout">
        <div className="trip-map-canvas">
          <svg viewBox="0 0 800 570" role="img" aria-labelledby="trip-map-svg-title trip-map-svg-description">
            <title id="trip-map-svg-title">Map of Sri Lanka with your selected route</title>
            <desc id="trip-map-svg-description">A schematic island map. Numbered markers show each stop in your planned route. Select a marker or stop name to see it highlighted.</desc>
            <defs>
              <linearGradient id="island-fill" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#d8e5da" /><stop offset="1" stopColor="#c5d8cc" /></linearGradient>
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a493f" strokeOpacity=".06" strokeWidth="1" /></pattern>
            </defs>
            <rect width="800" height="570" rx="18" fill="#e8f0ed" />
            <rect width="800" height="570" rx="18" fill="url(#map-grid)" />
            <text x="36" y="46" className="trip-map-sea-label">INDIAN OCEAN</text>
            <text x="590" y="525" className="trip-map-sea-label">BAY OF BENGAL</text>
            <path className="trip-map-island" d="M 193 58 C 248 48 295 55 347 73 C 404 86 463 95 511 122 C 572 153 617 202 631 250 C 653 302 675 355 657 407 C 640 446 589 473 557 495 C 520 522 450 543 347 548 C 303 548 276 527 253 510 C 219 489 179 464 147 436 C 116 407 100 371 98 332 C 91 293 103 257 125 222 C 145 189 130 164 149 132 C 162 98 174 73 193 58 Z" />
            {points.length > 1 && <polyline className="trip-map-route-line" points={polyline} />}
            {points.map((point, index) => (
              <g key={itinerary[index].id} className={index === selectedIndex ? "trip-map-marker is-selected" : "trip-map-marker"} role="button" tabIndex={0} aria-label={`Select stop ${index + 1}: ${itinerary[index].name}`} onClick={() => selectStop(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectStop(index); } }}>
                <circle className="trip-map-marker-halo" cx={point.x} cy={point.y} r={17} />
                <circle className="trip-map-marker-dot" cx={point.x} cy={point.y} r={12} />
                <text className="trip-map-marker-number" x={point.x} y={point.y + 4}>{index + 1}</text>
                <title>{itinerary[index].name}</title>
              </g>
            ))}
            <g className="trip-map-compass" transform="translate(742 68)"><path d="M0 20 L8 0 L16 20 L8 15 Z" /><text x="8" y="34">N</text></g>
          </svg>
        </div>
        <div className="trip-map-stops" aria-label="Stops in your planned route">
          <div className="trip-map-stop-list">{itinerary.map((place, index) => (
            <button type="button" key={place.id} className={index === selectedIndex ? "trip-map-stop is-selected" : "trip-map-stop"} onClick={() => selectStop(index)} aria-pressed={index === selectedIndex}>
              <span>{String(index + 1).padStart(2, "0")}</span><span><b>{place.name}</b><small>{place.region}</small></span><MapPin size={15} />
            </button>
          ))}</div>
          {selected && <div className="trip-map-selected"><p>SELECTED STOP · {String(Math.min(selectedIndex + 1, itinerary.length)).padStart(2, "0")}</p><h5>{selected.name}</h5><span>{selected.location}</span><small>{selected.shortDescription}</small></div>}
          <p className="trip-map-note">Schematic island view. Marker order follows your route sketch; travel time and road paths can vary.</p>
        </div>
      </div>
    </section>
  );
}
