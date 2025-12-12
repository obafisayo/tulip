import { useCallback, useEffect, useState } from "react";
import useSWR, { KeyedMutator, mutate } from "swr";
import { FullConfiguration } from "swr/_internal";
import axios from "axios";
import moment from "moment";
import { toast } from "sonner";
import { baseURL } from "./index";

export const MULTIPART_HEADER = {
  headers: { "Content-Type": "multipart/form-data" },
};

export const BaseRequest = axios.create({ baseURL });
BaseRequest.defaults.headers.post["Content-Type"] = "application/json";

BaseRequest.interceptors.request.use((config) => {
  config.headers["time"] = moment().format("YYYY-MM-DD HH:mm:ss");
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

BaseRequest.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.message === "Network Error") {
      return Promise.reject("Network Error: Please check your connection.");
    }
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject("Session expired. Please log in again.");
    }
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred.";
    return Promise.reject(message);
  }
);

export const catchError = (error: any) => {
  toast.error(typeof error === "string" ? error : error?.message || "Error");
};

// ============================================================================
// PART 2: THE HOOK
// ============================================================================

export interface PaginationLink {
  url: string;
  label: string;
  active: boolean;
}

export interface PaginationProp<T = any> {
  current_page?: number;
  currentPage?: number;
  first_page_url?: string | null;
  from?: number;
  last_page?: number;
  last_page_url?: string | null;
  links?: PaginationLink[];
  data?: T;
  next_page_url?: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number;
  total?: number;
  has_more?: boolean;
  totalPages?: number;
  totalRecords?: number;
  perPage?: number;
  isValidating?: boolean;
}

interface DefaultConfig {
  goBackOnError?: boolean;
  handleError?: (error: any) => any;
  initialValue?: any;
  params?: Record<string, any>;
  keepPreviousData?: boolean;
  method?: string;
  baseUrl?: string;
  node?: string;
  onDone?: (data: any) => any;
  refreshInterval?: number;
  revalidateIfStale?: boolean;
  noCache?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  shouldRetryOnError?: boolean;
  showError?: boolean;
  showLoading?: boolean;
  keepPaginatedData?: boolean;
}

const defaultConfig: DefaultConfig = {
  method: "get",
  baseUrl: "",
  onDone: () => {},
  handleError: () => {},
  initialValue: {},
  node: "data",
  showError: false,
  noCache: true,
  showLoading: false,
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  shouldRetryOnError: false,
  keepPreviousData: true,
  keepPaginatedData: false,
  goBackOnError: false,
  params: {},
};

export interface ResponseProps<T = any> extends PaginationProp {
  isValidating: boolean;
  isLoading: boolean;
  data: T;
  onRefresh: () => void;
  onChangeParams: (param: Record<string, any>) => void;
  onRemoveParams: (param: string | string[]) => void;
  setParams: (param: Record<string, any>) => void;
  mutate: KeyedMutator<any>;
  params: Record<string, any>;
  onLoadMore: () => void;
  onLoadPrevious: () => void;
  post: (payload: any) => Promise<{ data: any; error: any }>;
}

export const useRequest = <T = any>(
  path: string,
  configuration?: FullConfiguration | DefaultConfig,
  options = {}
): ResponseProps<T> => {
  const config = { ...defaultConfig, ...configuration };
  const { params: defaultParams } = config;
  const [params, setParams] = useState<Record<string, any>>(defaultParams || {});
  const [initialValue, setInitialValue] = useState(config.initialValue || {});
  const [paginated, setPaginated] = useState<any[]>([]);
  const [paginationState, setPaginationState] = useState<PaginationProp<T>>({});
  const [loading, setLoading] = useState(false);

  // 🔹 Merge params into query string
  let url = path;
  if (params && typeof params === "object") {
    const searchParams = new URLSearchParams(params).toString();
    url = `${path}${searchParams ? `?${searchParams}` : ""}`;
  }

  // 🔹 Axios headers setup
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) BaseRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  if (config.noCache) BaseRequest.defaults.headers["Cache-Control"] = "no-cache";

  // 🔹 Define fetcher
  const fetcher = async (url: string) => {
    const method = (config.method || "get") as "get" | "delete" | "head" | "options" | "post" | "put" | "patch";
    // FIX 1: Cast return to Promise<any> so useSWR knows it's not a strict AxiosResponse
    return BaseRequest[method](url) as Promise<any>;
  };

  const others = {
    revalidateIfStale: config.revalidateIfStale,
    revalidateOnFocus: config.revalidateOnFocus,
    revalidateOnReconnect: config.revalidateOnReconnect,
    refreshInterval: config.refreshInterval,
    shouldRetryOnError: config.shouldRetryOnError,
    keepPreviousData: config.keepPreviousData,
    ...options,
  };

  const { data, error, isValidating, mutate } = useSWR(url, fetcher, others);

  // 🔹 Handle loading UI
  useEffect(() => {
    if (config.showLoading) {
      if (isValidating && !data && !loading) {
        setLoading(true);
        toast.info("Loading data...");
      } else if (!isValidating && loading) {
        setLoading(false);
        toast.dismiss();
      }
    }
  }, [isValidating, data, loading, config.showLoading]);

  // 🔹 Handle errors
  useEffect(() => {
    if (error) {
      if (config.goBackOnError) window.history.back();
      if (config.showError) catchError(error);
      if (config.handleError) config.handleError(error);
    }
  }, [error, config]);

  // 🔹 Parse data & handle pagination
  const handleDataCleaning = useCallback(() => {
    if (!data) return;

    // FIX 2: Cast data to 'any' here so we can safely check for 'current_page' and '[node]'
    const responseData = data as any;
    const node = config.node || "data";

    if (responseData?.current_page) {
      const { data: items, ...rest } = responseData;
      setPaginationState({
        ...rest,
        has_more: responseData.current_page < responseData.last_page,
      });
      setInitialValue(items);
    } else if (responseData?.[node]) {
      setInitialValue(responseData[node]);
    } else {
      setInitialValue(responseData);
    }
  }, [data, config.node]);

  useEffect(() => {
    if (data) {
      handleDataCleaning();
      if (config.onDone) config.onDone(data);
    }
  }, [data, handleDataCleaning]);

  // 🔹 Pagination handlers
  const onLoadMore = useCallback(() => {
    const current = paginationState.current_page || 1;
    const last = paginationState.last_page || 1;
    if (current < last) onChangeParams({ page: current + 1 });
  }, [paginationState]);

  const onLoadPrevious = useCallback(() => {
    const current = paginationState.current_page || 1;
    if (current > 1) onChangeParams({ page: current - 1 });
  }, [paginationState]);

  // 🔹 Params handlers
  const onChangeParams = (state: object) =>
    setParams((prevState) => ({ ...prevState, ...state }));

  const onRemoveParams = (keys: string | string[]) => {
    const arr = Array.isArray(keys) ? keys : [keys];
    setParams((prev) => {
      const copy = { ...prev };
      arr.forEach((k) => delete copy[k]);
      return copy;
    });
  };

  const post = async (payload: any) => {
    const method = (config.method || "post") as "post" | "put" | "patch" | "delete";
    try {
      const res = await BaseRequest[method](path, payload);
      return { data: res, error: null };
    } catch (error) {
      catchError(error);
      return { data: null, error };
    }
  };

  // 🔹 Refresh
  const onRefresh = async () => {
    handleDataCleaning();
    await mutate();
  };

  return {
    ...paginationState,
    isValidating,
    mutate,
    data: (config.keepPaginatedData ? paginated : initialValue) as T,
    isLoading: isValidating,
    params,
    onChangeParams,
    onRemoveParams,
    onLoadPrevious,
    onLoadMore,
    setParams,
    onRefresh,
    post,
  };
};

// 🔹 Revalidate all SWR caches globally
export const onReloadData = async () => {
  await mutate((key: any) => true, undefined, { revalidate: true });
};