interface Place {
  "place name": string;
  "longitude": string;
  "state": string;
  "state abbreviation": string;
  "latitude": string;
}

export interface Zipcode {
  "post code": string;
  "country": string;
  "country abreviation": string;
  "places": [Place]
}