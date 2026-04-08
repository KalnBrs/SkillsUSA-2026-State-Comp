import { Zipcode } from "@/lib/models/Zipcode";
import Link from "next/link";

export default function Navbar({zipcode}: {zipcode: Zipcode}) {
  return (
    <div className="navbar flex m-5 flex-row ">
        <h1 className="text-bold text-4xl justify-center w-fit mr-auto"><Link href="/">Weather App</Link></h1>
        <div className="link-container flex row space-x-5 items-center">
          <li>City: {zipcode?.places[0]["place name"]}</li>
          <li>State: {zipcode?.places[0].state}</li>
          <li>Latitude: {zipcode?.places[0].latitude}</li>
          <li>Longitude: {zipcode?.places[0].longitude}</li>
        </div>
      </div>
  )
}