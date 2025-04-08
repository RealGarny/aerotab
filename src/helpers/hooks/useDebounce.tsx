import { useRef } from 'react';

//заебався тип выводить
export function useDebounce (cb:(...args:any) => void, delay:number) {
  const timeoutId = useRef<NodeJS.Timeout>(undefined);

  return function (...args:any[]) {
    if (timeoutId.current) { // This check is not strictly necessary
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(
      () => cb(...args), delay
    )
  }
}
