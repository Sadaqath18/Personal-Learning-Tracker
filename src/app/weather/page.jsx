'use client'
import { useEffect, useState } from 'react'

export default function Weather() {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=35&longitude=139&hourly=temperature_2m')
      .then((res) => res.json())
      .then((data) => setWeather(data))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold">Weather</h1>
      {weather ? <p>Temp: {weather.hourly.temperature_2m[0]}°C</p> : <p>Loading...</p>}
    </div>
  )
}
