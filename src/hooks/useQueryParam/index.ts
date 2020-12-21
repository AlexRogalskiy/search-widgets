import { useEffect } from 'preact/hooks';
import { useDebounce } from '../useDebounce';

type ParamValue = string | number | boolean | string[] | number[] | boolean[];

interface UseQueryParamParams<T> {
  value?: ParamValue;
  callback?: (value: string) => void;
  debounce?: number;
}

export function useQueryParam<T>(key: string, options?: UseQueryParamParams<T>) {
  const { value, callback, debounce } = options ?? {};
  const debouncedValue = debounce ? useDebounce(value, debounce) : value;
  const getValue = () =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get(key) ?? '' : '';

  const setParam = (value?: ParamValue, replace = false) => {
    const url = new URL(window.location.href);

    if (typeof value === 'undefined') {
      return;
    }

    if (value) {
      url.searchParams.set(key, value.toString());
    } else if (value?.toString().length === 0) {
      url.searchParams.delete(key);
    }

    if (replace) {
      window.history.replaceState(null, '', url.toString());
    } else {
      window.history.pushState(null, '', url.toString());
    }
  };

  // Handle new state
  const handler = () => {
    if (typeof callback === 'function') {
      callback(getValue());
    }
  };

  useEffect(() => {
    // Listen for popstate changes
    window.addEventListener('popstate', handler);

    // Clean up the event binding
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, []);

  useEffect(() => {
    setParam(debouncedValue);
  }, [debouncedValue]);

  return { value: getValue() };
}
