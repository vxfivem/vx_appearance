import { useCallback, useEffect, useRef, useState } from 'react';

export const useGameRequest = <TValue, TPayload>(event: string, payload: TPayload) => {
  const [data, setData] = useState<TValue>(null!);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>(null!);
  const controller = useRef<AbortController>(null!);

  const reFetch = useCallback(async () => {
    controller.current?.abort('new request');
    controller.current = new AbortController();

    try {
      const response = await fetch(`https://${GetParentResourceName()}/${event}`, {
        signal: controller.current.signal,
      });
      const json = await response.json();
      setData(json);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [event, payload]);

  useEffect(() => {
    reFetch();
    return () => {
      controller.current?.abort('New render');
      controller.current = null!;
    };
  }, [event, payload]);

  return { data, isLoading, error, reFetch };
};
