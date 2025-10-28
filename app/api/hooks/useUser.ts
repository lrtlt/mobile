import {useMutation, useQuery} from '@tanstack/react-query';
import {del, get, put} from '../HttpClient';
import queryClient from '../../../AppQueryClient';

type UserInfo = {
  id: number;
  name: string | null;
  createdAt: string;
  onboardingCompleted?: boolean;
  auth0_info: {
    given_name: string;
    family_name: string;
    nickname?: string;
    name: string;
    picture?: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
    iss: string;
    aud: string;
    sub: string;
    iat: number;
    exp: number;
    sid: string;
    nonce: string;
  };
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async ({signal}) => {
      const response = await get<UserInfo>(`https://www.lrt.lt/servisai/authrz/user/me`, {
        signal,
      });
      return response;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes
  });
};

export const useUserOnboardingCompleted = (completed: boolean) => {
  return useMutation({
    mutationFn: async () => {
      const response = await put<{}>(
        `https://www.lrt.lt/servisai/authrz/user/set-onboarding-completed/${completed ? 1 : 0}`,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user']});
    },
  });
};

export const useDeleteCurrentUser = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await del<{}>(`https://www.lrt.lt/servisai/authrz/user/me`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user']});
    },
  });
};
