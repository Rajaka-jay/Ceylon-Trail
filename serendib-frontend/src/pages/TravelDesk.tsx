import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  ExternalLink,
  MapPin,
  Navigation,
  ShieldCheck,
  Sun,
  Thermometer,
  WalletCards,
  Wind,
} from "lucide-react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

type IslandStop = {
  name: string;
  latitude: number;
  longitude: number;
};

type WeatherSnapshot = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

type RateRow = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

const stops: IslandStop[] = [
  { name: "Colombo", latitude: 6.9271, longitude: 79.8612 },
  { name: "Kandy", latitude: 7.2906, longitude: 80.6337 },
  { name: "Sigiriya", latitude: 7.957, longitude: 80.7603 },
  { name: "Ella", latitude: 6.8667, longitude: 81.0466 },
  { name: "Galle", latitude: 6.0535, longitude: 80.221 },
  { name: "Trincomalee", latitude: 8.5874, longitude: 81.2152 },
];

const currencies = ["LKR", "USD", "EUR", "GBP", "AUD", "INR"];
const checklistItems = [
  { id: "entry", title: "Check entry and visa requirements", note: "Confirm your own passport and travel details with the official service." },
  { id: "travel-cover", title: "Arrange travel insurance", note: "Check that it covers your planned activities and dates." },
  { id: "weather", title: "Check regional weather", note: "Coastal conditions can differ across the island." },
  { id: "temple", title: "Pack respectful temple clothing", note: "Bring clothes that cover shoulders and knees for sacred sites." },
  { id: "power", title: "Pack a suitable power adaptor", note: "Check your device rating and the socket type where you stay." },
  { id: "cash", title: "Plan how you will access money", note: "Keep a backup payment method and some smaller notes." },
  { id: "transport", title: "Confirm transport details", note: "Recheck services and pickup arrangements before travelling." },
];

const officialServices = [
  { title: "Visa and arrival", description: "Review current entry information and follow the official application route.", href: "https://www.srilanka.travel/before-you-go", label: "Before you go" },
  { title: "Stays, flights and park visits", description: "Open the official visitor services directory for booking links and availability.", href: "https://www.srilanka.travel/online-services", label: "Visitor services" },
  { title: "Travel tips", description: "Read practical guidance about transport, local customs, health and money.", href: "https://www.srilanka.travel/travel-tips", label: "Travel tips" },
  { title: "Tourist map", description: "Open the official map and explore the island’s regions and attractions.", href: "https://www.srilanka.travel/tourist-map", label: "Tourist map" },
  { title: "Public holidays", description: "Check Poya days and public holidays before confirming opening times.", href: "https://www.srilanka.travel/public-holidays", label: "Holiday calendar" },
  { title: "Travel notices", description: "Check official notices for current visitor updates and advisories.", href: "https://www.srilanka.travel/situation_update/", label: "Official notices" },
  { title: "Events and festivals", description: "See the latest event listings and cultural dates from Sri Lanka Tourism.", href: "https://www.srilanka.travel/", label: "Browse events" },
];

function getWeatherLabel(code: number) {
  if (code === 0) return "Clear";
  if (code <= 2) return "Mostly clear";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Misty";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorms";
  return "Changeable";
}

function WeatherIcon({ code, size = 22 }: { code: number; size?: number }) {
  if (code === 0) return <Sun size={size} />;
  if (code <= 2) return <CloudSun size={size} />;
  if (code === 3) return <Cloud size={size} />;
  if (code === 45 || code === 48) return <CloudFog size={size} />;
  if (code >= 95) return <CloudLightning size={size} />;
  if (code >= 51 && code <= 82) return <CloudRain size={size} />;
  return <Cloud size={size} />;
}

function formatIslandDate(value: string, weekday = false) {
  const date = new Date(value.length === 10 ? value + "T12:00:00+05:30" : value + "+05:30");
  return new Intl.DateTimeFormat("en", weekday
    ? { weekday: "short", day: "numeric" }
    : { hour: "numeric", minute: "2-digit", timeZone: "Asia/Colombo" }).format(date);
}

function WeatherTool() {
  const [stopName, setStopName] = useState("Colombo");
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const selectedStop = stops.find((stop) => stop.name === stopName) ?? stops[0];

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({
      latitude: String(selectedStop.latitude),
      longitude: String(selectedStop.longitude),
      current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "Asia/Colombo",
      forecast_days: "3",
    });
    setLoading(true);
    setError("");
    fetch("https://api.open-meteo.com/v1/forecast?" + query.toString(), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("The forecast is not available right now.");
        return response.json() as Promise<WeatherSnapshot>;
      })
      .then(setWeather)
      .catch((loadError: unknown) => {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        setError("Live weather could not load. Check the official forecast before travelling.");
        setWeather(null);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [selectedStop.latitude, selectedStop.longitude]);

  return (
    <section className="desk-panel weather-panel" aria-labelledby="weather-title">
      <div className="desk-panel-heading">
        <div><p className="desk-kicker">A QUICK LOOK OUTSIDE</p><h2 id="weather-title">Weather by region</h2></div>
        <label className="desk-select-label"><span className="sr-only">Choose a town for the forecast</span>
          <select value={stopName} onChange={(event) => setStopName(event.target.value)}>
            {stops.map((stop) => <option key={stop.name}>{stop.name}</option>)}
          </select>
        </label>
      </div>
      {loading && <p className="desk-status" role="status">Loading the latest forecast…</p>}
      {!loading && error && <div className="desk-error" role="status">{error}<a href="https://www.srilanka.travel/weather-in-sri-lanka" target="_blank" rel="noreferrer">Open Sri Lanka Tourism weather <ExternalLink size={14} /></a></div>}
      {!loading && weather && <>
        <div className="weather-now">
          <div className="weather-current-icon"><WeatherIcon code={weather.current.weather_code} size={35} /></div>
          <div><p className="weather-place">{selectedStop.name}, Sri Lanka</p><div className="weather-temp">{Math.round(weather.current.temperature_2m)}°<span>C</span></div><p className="weather-condition">{getWeatherLabel(weather.current.weather_code)} · feels like {Math.round(weather.current.apparent_temperature)}°C</p></div>
          <div className="weather-facts"><span><Thermometer size={15} /> Humidity {Math.round(weather.current.relative_humidity_2m)}%</span><span><Wind size={15} /> Wind {Math.round(weather.current.wind_speed_10m)} km/h</span><span>Updated {formatIslandDate(weather.current.time)}</span></div>
        </div>
        <div className="weather-forecast">{weather.daily.time.map((day, index) => <div className="weather-day" key={day}><span>{index === 0 ? "Today" : formatIslandDate(day, true)}</span><WeatherIcon code={weather.daily.weather_code[index] ?? 0} size={18} /><b>{Math.round(weather.daily.temperature_2m_max[index] ?? 0)}° / {Math.round(weather.daily.temperature_2m_min[index] ?? 0)}°</b><small>{weather.daily.precipitation_probability_max[index] ?? 0}% rain chance</small></div>)}</div>
        <p className="desk-attribution">Forecast by Open-Meteo. Conditions are approximate and can change; confirm local advisories before outdoor trips.</p>
      </>}
    </section>
  );
}

function CurrencyTool() {
  const [amount, setAmount] = useState("100");
  const [base, setBase] = useState("USD");
  const [quote, setQuote] = useState("LKR");
  const [rate, setRate] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (base === quote) {
      setRate(1);
      setRateDate(new Date().toISOString().slice(0, 10));
      setError("");
      return;
    }
    const controller = new AbortController();
    const query = new URLSearchParams({ base, quotes: quote });
    setLoading(true);
    setError("");
    fetch("https://api.frankfurter.dev/v2/rates?" + query.toString(), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("No current reference rate was returned.");
        return response.json() as Promise<RateRow[]>;
      })
      .then((rows) => {
        const match = rows.find((row) => row.base === base && row.quote === quote);
        if (!match) throw new Error("No current reference rate was returned.");
        setRate(match.rate);
        setRateDate(match.date);
      })
      .catch((loadError: unknown) => {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        setRate(null);
        setError("A reference rate is unavailable. Check the Central Bank of Sri Lanka for current rates.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [base, quote]);

  const converted = useMemo(() => {
    const numericAmount = Number(amount);
    return rate !== null && Number.isFinite(numericAmount) ? numericAmount * rate : null;
  }, [amount, rate]);

  function swapCurrencies() {
    setBase(quote);
    setQuote(base);
  }

  const formatter = new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="desk-panel currency-panel" aria-labelledby="currency-title">
      <div className="desk-panel-heading"><div><p className="desk-kicker">REFERENCE RATE</p><h2 id="currency-title">Currency converter</h2></div><WalletCards size={21} /></div>
      <label className="desk-field"><span>Amount</span><input inputMode="decimal" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
      <div className="currency-pair">
        <label className="desk-field"><span>From</span><select value={base} onChange={(event) => setBase(event.target.value)}>{currencies.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
        <button type="button" className="swap-currency" onClick={swapCurrencies} aria-label="Swap currencies"><ArrowLeftRight size={17} /></button>
        <label className="desk-field"><span>To</span><select value={quote} onChange={(event) => setQuote(event.target.value)}>{currencies.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
      </div>
      <div className="currency-result" aria-live="polite">
        {loading ? <span>Checking the latest reference rate…</span> : converted !== null
          ? <><small>{formatter.format(Number(amount || 0))} {base} is approximately</small><strong>{formatter.format(converted)} {quote}</strong><small>Reference rate date: {rateDate}</small></>
          : <span>{error || "Enter an amount to see the conversion."}</span>}
      </div>
      <p className="desk-attribution">Indicative reference rates, not a bank, card or cash exchange quote. <a href="https://www.cbsl.gov.lk/en/rates-and-indicators/exchange-rates" target="_blank" rel="noreferrer">Check CBSL rates <ExternalLink size={12} /></a></p>
    </section>
  );
}

function DistanceTool() {
  const [from, setFrom] = useState("Colombo");
  const [to, setTo] = useState("Kandy");
  const origin = stops.find((stop) => stop.name === from) ?? stops[0];
  const destination = stops.find((stop) => stop.name === to) ?? stops[1];
  const straightLineKm = useMemo(() => {
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    const latDelta = toRadians(destination.latitude - origin.latitude);
    const lonDelta = toRadians(destination.longitude - origin.longitude);
    const a = Math.sin(latDelta / 2) ** 2
      + Math.cos(toRadians(origin.latitude)) * Math.cos(toRadians(destination.latitude)) * Math.sin(lonDelta / 2) ** 2;
    return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }, [origin, destination]);

  const mapsUrl = "https://www.google.com/maps/dir/?api=1&origin="
    + encodeURIComponent(from + ", Sri Lanka")
    + "&destination=" + encodeURIComponent(to + ", Sri Lanka");

  return (
    <section className="desk-panel distance-panel" aria-labelledby="distance-title">
      <div className="desk-panel-heading"><div><p className="desk-kicker">BETWEEN TWO STOPS</p><h2 id="distance-title">Map a leg of your trip</h2></div><Navigation size={21} /></div>
      <div className="distance-fields">
        <label className="desk-field"><span>Start</span><select value={from} onChange={(event) => setFrom(event.target.value)}>{stops.map((stop) => <option key={stop.name}>{stop.name}</option>)}</select></label>
        <label className="desk-field"><span>End</span><select value={to} onChange={(event) => setTo(event.target.value)}>{stops.map((stop) => <option key={stop.name}>{stop.name}</option>)}</select></label>
      </div>
      <div className="distance-result"><MapPin size={18} /><strong>{straightLineKm} km</strong><span>approximate straight-line distance</span></div>
      <p className="desk-attribution">Road and rail routes are longer and may take very different times. Open a live map for route choices.</p>
      <a className="desk-action-link" href={mapsUrl} target="_blank" rel="noreferrer">Open directions in Google Maps <ArrowUpRight size={15} /></a>
    </section>
  );
}

function TripChecklist() {
  const [checked, setChecked] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("ceylon-trail-prep-list") ?? "[]") as string[]; } catch { return []; }
  });

  function toggleItem(id: string) {
    setChecked((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("ceylon-trail-prep-list", JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="desk-panel checklist-panel" aria-labelledby="checklist-title">
      <div className="desk-panel-heading"><div><p className="desk-kicker">SAVE YOUR PROGRESS ON THIS DEVICE</p><h2 id="checklist-title">Before you set off</h2></div><ShieldCheck size={21} /></div>
      <div className="checklist-progress"><span>{checked.length} of {checklistItems.length} ready</span><button type="button" onClick={() => { setChecked([]); localStorage.removeItem("ceylon-trail-prep-list"); }}>Clear list</button></div>
      <div className="prep-list">{checklistItems.map((item) => {
        const isChecked = checked.includes(item.id);
        return <label className={isChecked ? "prep-item is-done" : "prep-item"} key={item.id}>
          <input type="checkbox" checked={isChecked} onChange={() => toggleItem(item.id)} />
          <span className="prep-check" aria-hidden="true">{isChecked && <Check size={14} />}</span>
          <span><b>{item.title}</b><small>{item.note}</small></span>
        </label>;
      })}</div>
    </section>
  );
}

function OfficialServices() {
  return (
    <section className="desk-official-section" aria-labelledby="official-services-title">
      <div className="desk-section-intro"><p className="desk-kicker">USEFUL LINKS, FROM THE SOURCE</p><h2 id="official-services-title">Official travel services</h2><p>Visa rules, bookings and public notices can change. Continue to the official service to confirm current details.</p></div>
      <div className="official-service-grid">{officialServices.map((service, index) => <a className="official-service-card tilt-card" href={service.href} target="_blank" rel="noreferrer" key={service.title}>
        <span className="official-index">0{index + 1}</span><h3>{service.title}</h3><p>{service.description}</p><span className="official-open">{service.label}<ExternalLink size={14} /></span>
      </a>)}</div>
    </section>
  );
}

function EmergencyContacts() {
  return (
    <section className="desk-emergency" aria-labelledby="emergency-title">
      <div className="emergency-copy"><p className="desk-kicker">KEEP THE RIGHT NUMBERS CLOSE</p><h2 id="emergency-title">Visitor assistance</h2><p>For emergencies, contact the relevant local service. Coverage and response may differ by area.</p><a href="https://www.srilanka.travel/emergency-services" target="_blank" rel="noreferrer">See the official contact directory <ExternalLink size={14} /></a></div>
      <div className="emergency-number"><span>Tourism hotline</span><a href="tel:1912">1912</a><small>Visitor assistance</small></div>
      <div className="emergency-number"><span>Police emergency</span><a href="tel:119">119</a><small>Police response</small></div>
      <div className="emergency-number"><span>Ambulance service</span><a href="tel:1990">1990</a><small>Suwa Seriya</small></div>
    </section>
  );
}

export default function TravelDesk() {
  return (
    <div className="page-shell">
      <Header />
      <main className="travel-desk-page page-enter">
        <section className="travel-desk-hero">
          <div><p className="desk-kicker">THE ISLAND, WELL PREPARED</p><h1>Useful details for<br /><em>the way there.</em></h1><p>Weather, money, route notes and trusted links — gathered in one calm place before you set out.</p><a className="desk-hero-link" href="https://www.srilanka.travel/before-you-go" target="_blank" rel="noreferrer">Start with official arrival guidance <ArrowUpRight size={16} /></a><Link className="desk-planner-link" to="/?planner=1">Sketch my island route <ArrowRight size={16} /></Link></div>
          <div className="desk-hero-index"><span>CEYLON TRAIL</span><b>01</b><span>TRAVEL DESK</span></div>
        </section>

        <div className="travel-desk-content">
          <section className="desk-tools-grid" aria-label="Travel planning tools">
            <WeatherTool />
            <CurrencyTool />
            <DistanceTool />
            <TripChecklist />
          </section>
          <OfficialServices />
          <EmergencyContacts />
          <div className="desk-footer-note"><CalendarDays size={16} /><span>Schedules, entry rules and availability change. Confirm important details with the official provider before booking.</span></div>
        </div>
      </main>
    </div>
  );
}
