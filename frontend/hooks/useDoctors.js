"use client";

import { useCallback, useEffect, useState } from "react";
import { doctorsApi, getErrorMessage } from "../lib/api";

function isCanceledError(error) {
  return error?.name === "CanceledError" || error?.name === "AbortError";
}

export function useDoctors({ specialty, page = 1, pageSize = 100 } = {}) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctors = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const data = await doctorsApi.list(
          { specialty, page, pageSize },
          signal,
        );

        const items = Array.isArray(data)
          ? data
          : (data?.items ??
            data?.data?.items ??
            data?.data?.doctors ??
            data?.doctors ??
            data?.result ??
            data?.results ??
            data?.data?.result ??
            data?.data?.results ??
            data?.data ??
            []);

        if (!signal?.aborted) {
          setDoctors(Array.isArray(items) ? items : []);
        }
      } catch (err) {
        if (!isCanceledError(err) && !signal?.aborted) {
          setError(getErrorMessage(err, "Failed to load doctors."));
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [specialty, page, pageSize],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchDoctors(controller.signal);

    return () => controller.abort();
  }, [fetchDoctors]);

  return { doctors, loading, error };
}

export function useDoctor(id) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  const fetchDoctor = useCallback(
    async (signal) => {
      if (!id) {
        setDoctor(null);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await doctorsApi.get(id, signal);

        const result =
          response?.data?.doctor ??
          response?.data ??
          response?.doctor ??
          response;

        if (!signal?.aborted) {
          setDoctor(result);
        }
      } catch (err) {
        if (!isCanceledError(err) && !signal?.aborted) {
          setError(getErrorMessage(err, "Failed to load doctor details."));
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [id],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchDoctor(controller.signal);

    return () => controller.abort();
  }, [fetchDoctor]);

  const refetch = useCallback(() => {
    return fetchDoctor();
  }, [fetchDoctor]);

  return { doctor, loading, error, refetch };
}

export { useAvailability } from "./useAppointments";
