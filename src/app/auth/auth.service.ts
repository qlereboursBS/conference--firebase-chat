import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';

import { useAuthContext } from '@/app/auth/AuthContext';

export const useLogin = (
  config: UseMutationOptions<
    { id_token: string },
    AxiosError<any>,
    { username: string; password: string }
  > = {}
) => {
  // const { updateUser } = useAuthContext();
  // return useMutation(
  //   ({ username, password }) =>
  //     Axios.post('/authenticate', { username, password }),
  //   {
  //     ...config,
  //     onSuccess: (data, ...rest) => {
  //       updateUser(data.id_token);
  //       if (config.onSuccess) {
  //         config.onSuccess(data, ...rest);
  //       }
  //     },
  //   }
  // );
};
