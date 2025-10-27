import {useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {ForecastLocation, ForecastResponse} from '../Types';

export const useWeatherForecast = (city: string) => {
  return useQuery({
    queryKey: ['weatherForecast', city],
    queryFn: async ({signal}) => {
      const response = await get<ForecastResponse>(`https://www.lrt.lt/servisai/orai/?code=${city}`, {
        signal,
      });
      return response;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 10, // 10 minutes
  });
};

export const useWeatherForecastLocations = () =>
  useQuery({
    queryKey: ['weatherForecastLocations'],
    queryFn: async ({signal}) => {
      const response = await get<ForecastLocation[]>(
        'https://www.lrt.lt/static/data/weather/places.json?v=1',
        {
          signal,
        },
      );
      return response;
    },
    staleTime: Infinity,
  });
