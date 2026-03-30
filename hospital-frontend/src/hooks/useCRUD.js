import { useState, useEffect, useCallback } from "react";
export default function useCRUD(fetchAll) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const data = await fetchAll(); setItems(Array.isArray(data) ? data : []); }
    catch (e) { setError(e.message); setItems([]); }
    finally { setLoading(false); }
  }, [fetchAll]);
  useEffect(() => { load(); }, [load]);
  return { items, loading, error, reload: load };
}
