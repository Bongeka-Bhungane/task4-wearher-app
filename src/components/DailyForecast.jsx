export default function DailyForecast({ data, unit }) {
  const getWeatherEmoji = (main) => {
    const emojis = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Smoke: "💨",
      Haze: "🌫️",
      Dust: "🌪️",
      Fog: "🌫️",
      Sand: "🌪️",
      Ash: "🌪️",
      Squall: "🌪️",
      Tornado: "🌪️",
    };
    return emojis[main] || "🌤️";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="daily">
      {data.map((d) => (
        <div key={d.date} className="card">
          <p style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
            {formatDate(d.date)}
          </p>
          <p style={{ fontSize: "1.5rem" }}>{getWeatherEmoji(d.main)}</p>
          <p style={{ fontWeight: "bold" }}>
            {Math.round(d.maxTemperature)}° / {Math.round(d.minTemperature)}°
            {unit}
          </p>
          <p
            style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.25rem" }}
          >
            {d.main}
          </p>
        </div>
      ))}
    </div>
  );
}
