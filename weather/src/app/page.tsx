"use client"
import { Zipcode } from "@/lib/models/Zipcode";
import { getZipData, getWeatherData } from "@/services/locationHelpers";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CustomCard from "@/components/CustomCard";

type ForecastPeriod = {
  number: number
  name: string
  startTime: string
  endTime: string
  isDaytime: boolean
  temperature: number
  temperatureUnit: string
  temperatureTrend: string | null
  probabilityOfPrecipitation?: {
    unitCode?: string
    value?: number | null
  }
  windSpeed: string
  windDirection: string
  icon: string
  shortForecast: string
  detailedForecast: string
}

type WeatherProperties = {
  periods?: ForecastPeriod[]
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherProperties[]>([]);
  const [weatherDataHourly, setWeatherDataHourly] = useState<WeatherProperties[]>([]);
  const [zipcode, setZipcode] = useState<Zipcode>();

  const buildHourlyHref = (item: ForecastPeriod) => {
    const params = new URLSearchParams({
      start: item.startTime,
      end: item.endTime,
      name: item.name,
    })

    return `/hourly?${params.toString()}`
  }

  useEffect(() => {
    const fetchData = async () => {
      const zipcodeData = await getZipData("53527")
      console.log(zipcodeData);
      setZipcode(zipcodeData);

      const allWeatherData: WeatherProperties[] = []
      const allWeatherDataHourly: WeatherProperties[] = []

      for (const place in zipcodeData.places) {
        const newPlace = zipcodeData.places[place];
        console.log(`City: ${newPlace["place name"]}, State: ${newPlace["state"]}, Latitude: ${newPlace.latitude}, Longitude: ${newPlace.longitude}`)

        const placeForecast = await getWeatherData(newPlace.latitude, newPlace.longitude, false)
        allWeatherData.push(((placeForecast as unknown) as { properties: WeatherProperties }).properties);

        const placeForecastHourly = await getWeatherData(newPlace.latitude, newPlace.longitude, true)
        allWeatherDataHourly.push(((placeForecastHourly as unknown) as { properties: WeatherProperties }).properties);
      }

      setWeatherData(allWeatherData)
      setWeatherDataHourly(allWeatherDataHourly)
      console.log(allWeatherData)
      console.log(allWeatherDataHourly)
    }

    fetchData();
  }, [])

  return (
    <>
      <Navbar zipcode={zipcode as Zipcode} />
      <div className="flex flex-col flex-wrap px-4 py-6 h-400 gap-4">
        {weatherData[0]?.periods?.map((item: ForecastPeriod) => (
          <div key={`daily-${item.number}`}>
            <CustomCard properties={item} hourlyHref={buildHourlyHref(item)} height={600} />
          </div>
        ))}
      </div>
    </>
  );
}
