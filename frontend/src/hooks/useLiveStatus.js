// src/hooks/useLiveStatus.js  (FIXED — replace the whole file)
//
// Fix: the previous version called pb.collection() for the realtime
// subscription OUTSIDE the try/catch. If pocketbaseClient doesn't export a
// real PocketBase instance, that threw inside useEffect and white-screened
// the app. This version validates the client first and cannot crash the
// tree regardless of what pocketbaseClient exports.

import { useEffect, useState } from "react";
import pb from "../lib/pocketbaseClient";

// True only if pb is an actual PocketBase client instance.
const pbIsUsable = pb && typeof pb.collection === "function";

const OFFLINE_STATE = {
  loading: false,
  isLive: false,
  currentSession: null,
  nextSession: null,
  replays: [],
};

export function useLiveStatus() {
  const [state, setState] = useState(
    pbIsUsable ? { ...OFFLINE_STATE, loading: true } : OFFLINE_STATE,
  );

  useEffect(() => {
    if (!pbIsUsable) {
      console.warn(
        "useLiveStatus: pocketbaseClient does not export a PocketBase instance — live features disabled.",
      );
      return undefined;
    }

    let cancelled = false;

    async function load() {
      try {
        const [liveList, upcomingList, replayList] = await Promise.all([
          pb.collection("live_sessions").getList(1, 1, {
            filter: 'status = "live"',
            sort: "-scheduled_at",
          }),
          pb.collection("live_sessions").getList(1, 1, {
            filter: 'status = "upcoming"',
            sort: "scheduled_at",
          }),
          pb.collection("live_sessions").getList(1, 6, {
            filter: 'status = "ended" && youtube_video_id != ""',
            sort: "-scheduled_at",
          }),
        ]);

        if (cancelled) return;
        setState({
          loading: false,
          isLive: liveList.items.length > 0,
          currentSession: liveList.items[0] ?? null,
          nextSession: upcomingList.items[0] ?? null,
          replays: replayList.items,
        });
      } catch (err) {
        console.warn("useLiveStatus: could not load live_sessions", err);
        if (!cancelled) setState(OFFLINE_STATE);
      }
    }

    load();

    // Realtime subscription — now safely inside its own try/catch.
    let unsubscribe;
    try {
      pb.collection("live_sessions")
        .subscribe("*", load)
        .then((fn) => {
          unsubscribe = fn;
        })
        .catch(() => {});
    } catch {
      // Realtime unavailable — data still loads on mount/navigation.
    }

    return () => {
      cancelled = true;
      try {
        if (unsubscribe) unsubscribe();
      } catch {
        // ignore
      }
    };
  }, []);

  return state;
}
