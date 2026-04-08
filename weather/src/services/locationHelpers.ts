import { Zipcode } from "@/lib/models/zipcode";

async function getZipData(zipcode: string | number): Promise<Zipcode> {
  const response = await fetch(`http://api.zippopotam.us/us/${zipcode}`);

  if (!response.ok) {
    throw new Error("Network error, could not fetch the Zipcode data")
  }
  
  return await response.json() as Zipcode;
}

async function getWeatherData(lat: string, log: string, hourly: boolean): Promise<JSON> {
  // Get the Point data from the api
  const pointResponse = await fetch(`https://api.weather.gov/points/${lat},${log}`)

  if (!pointResponse.ok) {
    throw new Error("Network error, could not fetch the point data")
  }

  const pointData = await pointResponse.json();


  if (hourly) {
    // Get the hourly forcast data from the api
    const forcastResponse = await fetch(pointData.properties.forecastHourly)

    if (!forcastResponse.ok) {
      throw new Error("Network error, could not fetch the hourly forcast data")
    }

    return await forcastResponse.json();
  } else {
    // Get the forcast data from the api 
    const forcastResponse = await fetch(pointData.properties.forecast)

    if (!forcastResponse.ok) {
      throw new Error("Network error, could not fetch the forcast data")
    }

    return await forcastResponse.json();
  }
}

export {getZipData, getWeatherData};