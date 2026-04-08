"use client"

import CustomCard from "@/components/CustomCard";
import Navbar from "@/components/Navbar";
import { Zipcode } from "@/lib/models/Zipcode";
import { getWeatherData, getZipData } from "@/services/locationHelpers";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function HourlyForecastPage() {
  const [zipcode, setZipcode] = useState<Zipcode>();
  const [hourlyWeatherData, setHourlyWeatherData] = useState<WeatherProperties[]>([]);
  const searchParams = useSearchParams()
  const selectedStart = searchParams.get("start")
  const selectedEnd = searchParams.get("end")
  const selectedName = searchParams.get("name")

  const filteredPeriods = hourlyWeatherData[0]?.periods?.filter((item: ForecastPeriod) => {
    if (!selectedStart || !selectedEnd) {
      return true
    }

    const periodStart = new Date(item.startTime).getTime()
    const periodEnd = new Date(item.endTime).getTime()
    const rangeStart = new Date(selectedStart).getTime()
    const rangeEnd = new Date(selectedEnd).getTime()

    return periodStart >= rangeStart && periodEnd <= rangeEnd
  })

  useEffect(() => {
    const fetchData = async () => {
      const zipcodeData = await getZipData("53527")
      setZipcode(zipcodeData)

      const allHourlyData: WeatherProperties[] = []

      for (const place in zipcodeData.places) {
        const newPlace = zipcodeData.places[place]
        const placeForecastHourly = await getWeatherData(newPlace.latitude, newPlace.longitude, true)
        allHourlyData.push(((placeForecastHourly as unknown) as { properties: WeatherProperties }).properties)
      }

      setHourlyWeatherData(allHourlyData)
    }

    fetchData()
  }, [])

  return (
    <>
      <Navbar zipcode={zipcode as Zipcode} />
      <div className="px-4 pt-2 pb-6">
        <h2 className="text-2xl font-semibold">Hourly Forecast for {selectedName ?? "Selected Period"}</h2>
        <p className="text-sm text-muted-foreground">Hourly outlook only for the day you selected.</p>
      </div>
      <div className="justify-center flex flex-row w-400 flex-wrap px-4 py-6 h-100 gap-4">
        {filteredPeriods?.map((item: ForecastPeriod) => (
          <div key={`hourly-${item.number}`}>
            <CustomCard properties={item} height={300} />
          </div>
        ))}
      </div>
    </>
  )
}
