// src/pages/LivePage.jsx — fixed chat version, still zero backend.
//
// FIX: YouTube's chat embed does NOT accept a channel ID — it needs the
// video ID of the current broadcast (live_chat?v=VIDEO_ID). That's why the
// chat panel showed YouTube's "something went wrong" monkey. This version
// uses the YouTube iframe API to ask the player for its video ID once the
// stream loads, then builds the chat URL from that. Chat appears only when
// a live video is actually resolved — no monkey when offline either.

import { useEffect, useRef, useState } from 'react';

const CHANNEL_ID = 'UCCskVLO1uO8yArKnrSRr6FA';

const EMBED_DOMAIN =
        typeof window !== 'undefined' ? window.location.hostname : 'jobhuntingu.com';

// Edit per event if you want an announcement card, or leave null.
const NEXT_SESSION = null;
// const NEXT_SESSION = {
//   title: 'Live mock interview — Product Manager role',
//   when: 'Friday, Aug 28 · 7:00 PM GST',
// };

// Loads the YouTube iframe API script once, resolves when ready.
let ytApiPromise = null;
function loadYouTubeApi() {
        if (ytApiPromise) return ytApiPromise;
        ytApiPromise = new Promise((resolve) => {
                if (window.YT && window.YT.Player) {
                        resolve(window.YT);
                        return;
                }
                const prev = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = () => {
                        if (prev) prev();
                        resolve(window.YT);
                };
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(tag);
        });
        return ytApiPromise;
}

const LivePage = () => {
        const playerHostRef = useRef(null);
        const playerRef = useRef(null);
        const [liveVideoId, setLiveVideoId] = useState(null);
        const [chatVisible, setChatVisible] = useState(true);

        useEffect(() => {
                let cancelled = false;
                let pollId = null;

                loadYouTubeApi().then((YT) => {
                        if (cancelled || !playerHostRef.current) return;

                        const grabVideoId = (player) => {
                                try {
                                        const data = player.getVideoData ? player.getVideoData() : null;
                                        const id = data && data.video_id;
                                        // When offline, the persistent embed has no video — id is empty.
                                        if (id && id !== 'live_stream') {
                                                setLiveVideoId(id);
                                                if (pollId) {
                                                        clearInterval(pollId);
                                                        pollId = null;
                                                }
                                        }
                                } catch {
                                        // player not ready yet — poll will retry
                                }
                        };

                        playerRef.current = new YT.Player(playerHostRef.current, {
                                width: '100%',
                                height: '100%',
                                playerVars: {
                                        listType: 'user_uploads', // ignored for live_stream, harmless
                                        channel: CHANNEL_ID,
                                },
                                // The persistent live embed is set via the special videoId-less URL,
                                // so we point the player at it through the host param instead:
                                events: {
                                        onReady: (e) => {
                                                grabVideoId(e.target);
                                                // Keep checking for a while: the video ID often becomes
                                                // available a few seconds after load, or when a stream starts
                                                // while the viewer is already on the page.
                                                pollId = setInterval(() => grabVideoId(e.target), 5000);
                                        },
                                        onStateChange: (e) => grabVideoId(e.target),
                                },
                        });

                        // YT.Player with just channel playerVars won't load the live embed
                        // directly — set the src explicitly to the persistent live URL:
                        const iframe = playerRef.current.getIframe();
                        iframe.src = `https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&enablejsapi=1&origin=${encodeURIComponent(
                                window.location.origin
                        )}`;
                });

                return () => {
                        cancelled = true;
                        if (pollId) clearInterval(pollId);
                        if (playerRef.current && playerRef.current.destroy) {
                                playerRef.current.destroy();
                        }
                };
        }, []);

        const showChat = chatVisible && liveVideoId;

        return (
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <header className="mb-8">
                                <h1 className="text-3xl font-bold text-foreground">Live sessions</h1>
                                <p className="mt-2 max-w-2xl text-muted-foreground">
                                        Mock interviews and career coaching, streamed live for the JobHuntingU
                                        community. When we&apos;re live, the stream appears below automatically.
                                </p>
                        </header>

                        {NEXT_SESSION && (
                                <div className="mb-6 rounded-xl border bg-card px-6 py-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Next session
                                        </p>
                                        <p className="mt-1 font-semibold text-foreground">{NEXT_SESSION.title}</p>
                                        <p className="text-sm text-muted-foreground">{NEXT_SESSION.when}</p>
                                </div>
                        )}

                        <div
                                className={`grid gap-4 ${showChat ? 'lg:grid-cols-[minmax(0,1fr)_350px]' : 'grid-cols-1'
                                        }`}
                        >
                                <div className="relative overflow-hidden rounded-xl border bg-black pt-[56.25%]">
                                        <div ref={playerHostRef} className="absolute inset-0 h-full w-full" />
                                </div>

                                {showChat && (
                                        <aside
                                                className="flex min-h-[380px] flex-col overflow-hidden rounded-xl border bg-card lg:min-h-0"
                                                aria-label="Live chat"
                                        >
                                                <iframe
                                                        className="w-full flex-1"
                                                        src={`https://www.youtube.com/live_chat?v=${liveVideoId}&embed_domain=${EMBED_DOMAIN}`}
                                                        title="Live chat"
                                                />
                                        </aside>
                                )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4">
                                {liveVideoId && (
                                        <button
                                                type="button"
                                                onClick={() => setChatVisible((v) => !v)}
                                                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                        >
                                                {chatVisible ? 'Hide chat' : 'Show chat'}
                                        </button>
                                )}
                                <a
                                        href={`https://www.youtube.com/channel/${CHANNEL_ID}?sub_confirmation=1`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                >
                                        Get notified on YouTube →
                                </a>
                                <a
                                        href={`https://www.youtube.com/channel/${CHANNEL_ID}/streams`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                >
                                        Watch past sessions →
                                </a>
                        </div>
                </div>
        );
};

export default LivePage;
