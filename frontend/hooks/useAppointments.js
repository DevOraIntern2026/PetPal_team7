"use client";

import { useCallback, useEffect, useState } from "react";
import { appointmentsApi, doctorsApi, getErrorMessage } from "../lib/api";

function isCanceledError(error) {
  return error?.name === "CanceledError" || error?.name === "AbortError";
}

export function useAvailability(doctorId, date) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSlots = useCallback(
    async (signal) => {
      if (!doctorId || !date) {
        setSlots([]);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await doctorsApi.availability(doctorId, date, signal);

        const data =
          response?.data?.slots ??
          response?.data ??
          response?.slots ??
          response;

        const items = Array.isArray(data)
          ? data
          : (data?.items ??
            data?.slots ??
            data?.availableSlots ??
            data?.result ??
            data?.data?.items ??
            data?.data?.slots ??
            []);

        if (!signal?.aborted) {
          setSlots(Array.isArray(items) ? items : []);
        }
      } catch (err) {
        if (!isCanceledError(err) && !signal?.aborted) {
          setError(
            getErrorMessage(err, "Failed to load available appointments."),
          );
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [doctorId, date],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchSlots(controller.signal);

    return () => controller.abort();
  }, [fetchSlots]);

  const refetch = useCallback(() => {
    return fetchSlots();
  }, [fetchSlots]);

  return { slots, loading, error, refetch };
}

export function useMyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await appointmentsApi.mine(signal);

      const data =
        response?.data?.appointments ??
        response?.data?.items ??
        response?.data ??
        response;

      const items = Array.isArray(data)
        ? data
        : (data?.items ?? data?.appointments ?? []);

      if (!signal?.aborted) {
        setAppointments(Array.isArray(items) ? items : []);
      }
    } catch (err) {
      if (!isCanceledError(err) && !signal?.aborted) {
        setError(getErrorMessage(err, "Failed to load your appointments."));
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    refresh(controller.signal);

    return () => controller.abort();
  }, [refresh]);

  return { appointments, loading, error, refresh };
}

export function useBookAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const book = useCallback(async (appointmentData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await appointmentsApi.book(appointmentData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to book the appointment."));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { book, loading, error, success };
}

export function useCancelAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cancel = useCallback(async (appointmentId) => {
    setLoading(true);
    setError("");

    try {
      return await appointmentsApi.cancel(appointmentId);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to cancel the appointment."));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancel, loading, error };
}
