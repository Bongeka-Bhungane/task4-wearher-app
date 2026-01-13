export default function HourlyForecast({ data, unit }) {
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

  return (
    <div className="hourly">
      {data.map((h) => {
        const hour = new Date(h.timestamp * 1000).getHours();
        const formattedTime = `${hour.toString().padStart(2, "0")}:00`;
        return (
          <div key={h.timestamp} className="card">
            <p style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              {formattedTime}
            </p>
            <p style={{ fontSize: "1.5rem" }}>{getWeatherEmoji(h.main)}</p>
            <p style={{ fontWeight: "bold" }}>
              {Math.round(h.temperature)}°{unit}
            </p>
            <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>{h.humidity}%</p>
          </div>
        );
      })}
    </div>
  );
}
