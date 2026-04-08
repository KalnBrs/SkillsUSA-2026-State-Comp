import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

type ForecastProperties = {
  number?: number
  name?: string
  startTime?: string
  endTime?: string
  isDaytime?: boolean
  shortForecast?: string
  detailedForecast?: string
  temperature?: number
  temperatureTrend?: string | null
  temperatureUnit?: string
  windSpeed?: string
  windDirection?: string
  probabilityOfPrecipitation?: {
    unitCode?: string
    value?: number | null
  }
  icon: string
}

type CustomCardProps = {
  properties: ForecastProperties
  hourlyHref?: string
  height: number
}

export default function CustomCard({ properties, hourlyHref, height }: CustomCardProps) {
  const precipitation = properties.probabilityOfPrecipitation?.value
  const formattedTimeRange =
    properties.startTime && properties.endTime
      ? `${new Date(properties.startTime).toLocaleString([], {
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
        })} - ${new Date(properties.endTime).toLocaleString([], {
          hour: "numeric",
          minute: "2-digit",
        })}`
      : "Forecast window unavailable"

  return (
    <Card style={{height: height}} className="mx-auto w-55 max-w-sm overflow-hidden pt-0">
      <div className="relative aspect-16/10 overflow-hidden border-b bg-muted/40">
        <Image
          src={properties.icon}
          alt={properties.name ?? "Weather forecast"}
          width={640}
          height={360}
          className="h-full w-full object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
        <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/75">
              {properties.isDaytime ? "Day forecast" : "Night forecast"}
            </p>
            <p className="text-3xl font-semibold leading-none">
              {properties.temperature !== undefined
                ? `${properties.temperature}${properties.temperatureUnit ?? ""}`
                : "--"}
            </p>
          </div>
          <Badge variant="secondary" className="border-white/20 bg-white/15 text-white backdrop-blur">
            {properties.shortForecast ?? "Forecast"}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardAction>
          <Badge variant="outline">{properties.name ?? "Period"}</Badge>
        </CardAction>
        <CardTitle>{properties.shortForecast ?? properties.name ?? "Weather update"}</CardTitle>
        <CardDescription>{formattedTimeRange}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-4 text-sm leading-6 text-foreground/85 mb-auto">
          {properties.detailedForecast ?? "No forecast available."}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm mt-auto">
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Wind</p>
            <p className="font-medium text-foreground">
              {[properties.windDirection, properties.windSpeed].filter(Boolean).join(" ") || "Unavailable"}
            </p>
          </div>
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Rain chance</p>
            <p className="font-medium text-foreground">
              {precipitation !== undefined && precipitation !== null ? `${precipitation}%` : "Unavailable"}
            </p>
          </div>
        </div>
      </CardContent>
      {hourlyHref ? (
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={hourlyHref}>View hourly forecast</Link>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  )
}