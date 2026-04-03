import { useState, useEffect, useCallback } from 'react';
import { getClients, getInvoices, getDashboardStats, getAlerts } from '@/lib/api';

export function useClients() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    getClients().then(d => {
      if (d) setData(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refetch: fetch };
}

export function useInvoices() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    getInvoices().then(d => {
      if (d) setData(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refetch: fetch };
}

export function useDashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    getDashboardStats().then(d => {
      if (d) setData(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refetch: fetch };
}

export function useAlerts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    getAlerts().then(d => {
      if (d) setData(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refetch: fetch };
}