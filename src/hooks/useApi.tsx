import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

const useApi = <T,>(
  url: string,
  method: ApiMethod,
  options?: UseMutationOptions<AxiosResponse<T>, Error, any, unknown>
) => {
  return useMutation<AxiosResponse<T>, Error, any, unknown>({
    mutationFn: (data?: any) => {
      return axios({
        url: `${BACKEND_URL}${url}`,
        method,
        data,
      }) as Promise<AxiosResponse<T>>;
    },
    ...options,
  });
};

export default useApi;
