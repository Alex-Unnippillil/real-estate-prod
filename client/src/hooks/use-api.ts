import useSWR, { SWRConfiguration, SWRResponse } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
};

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 60000,
  keepPreviousData: true,
};

export function useApi<T>(key: string | null, config?: SWRConfiguration): SWRResponse<T, any> {
  return useSWR<T>(key, fetcher, { ...defaultConfig, ...config });
}
