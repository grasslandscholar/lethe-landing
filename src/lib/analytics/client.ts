"use client";

import type { LetheEventName, LetheEventProperties } from "./types";
export type { LetheEventName, LetheEventProperties } from "./types";

const SESSION_STORAGE_KEY = "lethe_session_id";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `lethe-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getLetheSessionId() {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const next = createSessionId();
  window.localStorage.setItem(SESSION_STORAGE_KEY, next);
  return next;
}

export function recordLetheEvent(event: LetheEventName, properties: LetheEventProperties = {}) {
  const sessionId = getLetheSessionId();
  if (!sessionId) return Promise.resolve();

  return fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      event,
      properties,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

export function recordCleanupRequest(services: string[]) {
  const sessionId = getLetheSessionId();
  if (!sessionId) return Promise.resolve();

  return fetch("/api/cleanup-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      services,
    }),
    keepalive: true,
  }).catch(() => undefined);
}
