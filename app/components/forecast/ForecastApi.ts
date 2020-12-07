export type Forecast = {
  location: {
    code: string;
    name: string;
  };
  forecast: {
    forecastTimeUtc: string;
    localDateTime: string;
    airTemperature: number;
    relativeHumidity: number;
    conditionCode: string;
  };
};

type ForecastResponse = {
  current?: Forecast;
  default: Forecast;
};

const API_URL = 'https://www.lrt.lt/servisai/orai/';

export const getForecast = async (cityCode?: string): Promise<Forecast | undefined> => {
  const url = `${API_URL}?code=${cityCode}`;
  console.log('Getting weather: ', url);
  const response = await fetch(url);
  if (response.ok) {
    const data = (await response.json()) as ForecastResponse;
    return data.current ?? data.default;
  } else {
    return undefined;
  }
};
