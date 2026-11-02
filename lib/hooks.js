'use client';
import { useCallback, useEffect, useState } from 'react';

export function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => {
    setLoading(true);
    setError(null);
    return fn().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, deps);
  useEffect(() => { run(); }, [run]);
  return { data, error, loading, reload: run };
}
