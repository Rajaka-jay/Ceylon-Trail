import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  CalendarDays,
  Check,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
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
  { title: "Regional weather", description: "Check a three-day forecast for key towns around the island.", label: "Open forecast", target: "weather-title", to: undefined },
  { title: "Currency converter", description: "Compare an indicative reference rate for common travel currencies.", label: "Convert currency", target: "currency-title", to: undefined },
  { title: "Island distances", description: "Compare approximate straight-line distances between selected towns.", label: "Check distances", target: "distance-title", to: undefined },
  { title: "Before you set off", description: "Keep a simple preparation checklist on this device.", label: "View checklist", target: "checklist-title", to: undefined },
  { title: "Visitor assistance", description: "Keep important local assistance numbers close at hand.", label: "View numbers", target: "emergency-title", to: undefined },
  { title: "Destination guide", description: "Browse island places, save favourites and start building a route.", label: "Explore destinations", target: "", to: "/explore" },
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

function getWeatherScene(code: number) {
  if (code >= 95) return "stormy";
  if (code >= 51 && code <= 82) return "rainy";
  if (code <= 2) return "sunny";
  return "cloudy";
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
        setError("Live weather could not load right now. Try another town or reload.");
        setWeather(null);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [selectedStop.latitude, selectedStop.longitude]);

  const todayHigh = weather?.daily.temperature_2m_max[0] ?? 0;
  const todayLow = weather?.daily.temperature_2m_min[0] ?? 0;
  const rainChance = weather?.daily.precipitation_probability_max[0] ?? 0;

  return (
    <section className="desk-panel weather-panel" aria-labelledby="weather-title">
      <div className="desk-panel-heading weather-heading">
        <div><p className="desk-kicker">A QUICK LOOK OUTSIDE</p><h2 id="weather-title">Weather by region</h2></div>
        <label className="desk-select-label"><span className="sr-only">Choose a town for the forecast</span>
          <select value={stopName} onChange={(event) => setStopName(event.target.value)}>
            {stops.map((stop) => <option key={stop.name}>{stop.name}</option>)}
          </select>
        </label>
      </div>
      {loading && <p className="desk-status weather-status" role="status">Reading the sky over {selectedStop.name}…</p>}
      {!loading && error && <div className="desk-error weather-status" role="status">{error}</div>}
      {!loading && weather && <>
        <div className="weather-showcase">
          <div className="weather-current">
            <div className="weather-live-label"><span className="weather-live-dot" /> LIVE ISLAND FORECAST</div>
            <p className="weather-place">{selectedStop.name}, Sri Lanka</p>
            <div className="weather-temp">{Math.round(weather.current.temperature_2m)}°<span>C</span></div>
            <p className="weather-condition">{getWeatherLabel(weather.current.weather_code)} · feels like {Math.round(weather.current.apparent_temperature)}°C</p>
            <p className="weather-high-low">Today <b>H {Math.round(todayHigh)}°</b><span>·</span><b>L {Math.round(todayLow)}°</b><span>·</span>{rainChance}% chance of rain</p>
          </div>
          <div className={`weather-visual weather-visual--${getWeatherScene(weather.current.weather_code)}`} aria-hidden="true">
            <div className="weather-scene-stars"><i /><i /><i /><i /></div>
            <div className="weather-orbit weather-orbit--outer" />
            <div className="weather-orbit weather-orbit--inner" />
            <div className="weather-sun"><span /></div>
            <div className="weather-cloud weather-cloud--back"><i /><i /><i /></div>
            <div className="weather-cloud weather-cloud--front"><i /><i /><i /></div>
            <div className="weather-rain"><i /><i /><i /><i /><i /></div>
            <div className="weather-scene-glow" />
            <div className="weather-scene-caption"><span>RIGHT NOW</span><b>{getWeatherLabel(weather.current.weather_code)}</b></div>
          </div>
        </div>
        <div className="weather-detail-grid">
          <div className="weather-detail"><Thermometer size={17} /><span>Feels like</span><b>{Math.round(weather.current.apparent_temperature)}°C</b></div>
          <div className="weather-detail"><Wind size={17} /><span>Wind</span><b>{Math.round(weather.current.wind_speed_10m)} km/h</b></div>
          <div className="weather-detail"><CloudRain size={17} /><span>Rain chance</span><b>{rainChance}%</b></div>
          <div className="weather-detail"><CloudSun size={17} /><span>Humidity</span><b>{Math.round(weather.current.relative_humidity_2m)}%</b></div>
        </div>
        <div className="weather-forecast-heading"><span>Three-day outlook</span><small>Updated {formatIslandDate(weather.current.time)}</small></div>
        <div className="weather-forecast">{weather.daily.time.map((day, index) => <div className="weather-day" key={day}><span>{index === 0 ? "Today" : formatIslandDate(day, true)}</span><WeatherIcon code={weather.daily.weather_code[index] ?? 0} size={18} /><b>{Math.round(weather.daily.temperature_2m_max[index] ?? 0)}° <i>/</i> {Math.round(weather.daily.temperature_2m_min[index] ?? 0)}°</b><small>{weather.daily.precipitation_probability_max[index] ?? 0}% rain chance</small></div>)}</div>
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
        setError("A reference rate is unavailable right now. Try again later.");
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
      <p className="desk-attribution">Indicative reference rates only; your bank, card provider or cash exchange may use a different rate.</p>
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

  return (
    <section className="desk-panel distance-panel" aria-labelledby="distance-title">
      <div className="desk-panel-heading"><div><p className="desk-kicker">BETWEEN TWO STOPS</p><h2 id="distance-title">Map a leg of your trip</h2></div><Navigation size={21} /></div>
      <div className="distance-fields">
        <label className="desk-field"><span>Start</span><select value={from} onChange={(event) => setFrom(event.target.value)}>{stops.map((stop) => <option key={stop.name}>{stop.name}</option>)}</select></label>
        <label className="desk-field"><span>End</span><select value={to} onChange={(event) => setTo(event.target.value)}>{stops.map((stop) => <option key={stop.name}>{stop.name}</option>)}</select></label>
      </div>
      <div className="distance-result"><MapPin size={18} /><strong>{straightLineKm} km</strong><span>approximate straight-line distance</span></div>
      <p className="desk-attribution">Road and rail routes are longer and may take very different times. The route sketch includes a stop map inside Ceylon Trail.</p>
      <Link className="desk-action-link" to="/?planner=1">Build a route in Ceylon Trail <ArrowRight size={15} /></Link>
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
      <div className="desk-section-intro"><p className="desk-kicker">TOOLS BUILT INTO CEYLON TRAIL</p><h2 id="official-services-title">Plan from right here</h2><p>Open the island guide’s planning tools, or jump to the part of the Travel Desk you need.</p></div>
      <div className="official-service-grid">{officialServices.map((service, index) => {
        const content = <><span className="official-index">0{index + 1}</span><h3>{service.title}</h3><p>{service.description}</p><span className="official-open">{service.label}<ArrowRight size={14} /></span></>;
        return service.to
          ? <Link className="official-service-card tilt-card" to={service.to} key={service.title}>{content}</Link>
          : <button type="button" className="official-service-card tilt-card" key={service.title} onClick={() => document.getElementById(service.target ?? "")?.scrollIntoView({ behavior: "smooth", block: "center" })}>{content}</button>;
      })}</div>
    </section>
  );
}

function EmergencyContacts() {
  return (
    <section className="desk-emergency" aria-labelledby="emergency-title">
      <div className="emergency-copy"><p className="desk-kicker">KEEP THE RIGHT NUMBERS CLOSE</p><h2 id="emergency-title">Visitor assistance</h2><p>For emergencies, contact the relevant local service. Coverage and response may differ by area.</p><span>Tap a number to call from your device.</span></div>
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
          <div><p className="desk-kicker">THE ISLAND, WELL PREPARED</p><h1>Useful details for<br /><em>the way there.</em></h1><p>Weather, money, route notes and useful planning tools — gathered in one calm place before you set out.</p><Link className="desk-hero-link" to="/?planner=1">Sketch your island route <ArrowRight size={16} /></Link></div>
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
