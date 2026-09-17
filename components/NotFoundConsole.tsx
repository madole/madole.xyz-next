import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { HINT_TEXT } from "../hooks/useRocketHint";

/**
 * The 404 framed as a deep-field tracking station that has lost its target.
 *
 * The requested path is echoed back in the telemetry so the page is about the
 * link that failed rather than a generic apology - the one thing a 404 knows
 * that nothing else on the site does. Purely presentational: the page owns the
 * rocket state and decides whether the keyboard hint is honest.
 */

type Tone = "default" | "warn" | "good" | "bad";

const TONE_TEXT: Record<Tone, string> = {
  default: "text-white/80",
  warn: "text-amber-300",
  good: "text-cyan-300",
  bad: "text-rose-300",
};

const TONE_DOT: Record<Tone, string> = {
  default: "bg-white/40",
  warn: "bg-amber-300",
  good: "bg-cyan-300",
  bad: "bg-rose-400",
};

const Telemetry: React.FC<{
  label: string;
  value: string;
  tone?: Tone;
  title?: string;
  pulse?: boolean;
}> = ({ label, value, tone = "default", title, pulse = false }) => (
  <div className="flex items-baseline justify-between gap-4 py-2.5">
    <dt className="shrink-0 uppercase tracking-wider text-white/40">
      {label}
    </dt>
    <dd
      className={cn(
        "flex min-w-0 items-center gap-2 text-right",
        TONE_TEXT[tone],
      )}
    >
      {pulse ? (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full motion-safe:animate-pulse",
            TONE_DOT[tone],
          )}
        />
      ) : null}
      <span className="truncate" title={title ?? value}>
        {value}
      </span>
    </dd>
  </div>
);

/**
 * The dish: rings, crosshair and one sweep arm. The sweep is the only motion,
 * and it stops outright under prefers-reduced-motion, where the ring of stars
 * still carries the idea of a scope.
 */
const Radar: React.FC = () => (
  <div
    aria-hidden="true"
    className="relative aspect-square w-40 shrink-0 sm:w-44"
  >
    <div className="absolute inset-0 rounded-full border border-cyan-300/25" />
    <div className="absolute inset-[16%] rounded-full border border-cyan-300/15" />
    <div className="absolute inset-[32%] rounded-full border border-cyan-300/10" />
    <div className="absolute inset-[48%] rounded-full border border-cyan-300/10" />

    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-300/10" />
    <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-cyan-300/10" />

    {/* Sweep arm. `spin` is Tailwind's own keyframe; only the duration is ours. */}
    <div
      className="absolute inset-0 rounded-full motion-safe:animate-[spin_4s_linear_infinite]"
      style={{
        background:
          "conic-gradient(from 0deg, rgba(103,232,249,0.45), rgba(103,232,249,0.08) 28%, transparent 42%)",
      }}
    />

    <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/80" />

    {/* The contact that cannot be found: a blip at the edge of the sweep. */}
    <div className="absolute left-[64%] top-[34%] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_2px_rgba(103,232,249,0.8)]" />
    <div className="absolute left-[64%] top-[34%] h-1.5 w-1.5 rounded-full bg-cyan-200 motion-safe:animate-ping" />
  </div>
);

export interface NotFoundConsoleProps {
  /** The path that failed, echoed back as the target. */
  path: string;
  /** True when a keyboard easter egg is actually available and worth advertising. */
  showRocketHint: boolean;
  /** True once the rocket is on its way, so the console can acknowledge it. */
  rocketActive: boolean;
}

const NotFoundConsole: React.FC<NotFoundConsoleProps> = ({
  path,
  showRocketHint,
  rocketActive,
}) => (
  <div className="w-full max-w-2xl">
    <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.35em] text-cyan-300/60">
      Station 404 &middot; Deep Field Relay
    </p>

    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-9">
      {/* A soft wash of the site's cyan, so the panel reads as lit rather than flat. */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-7 text-center sm:flex-row sm:gap-9 sm:text-left">
        <Radar />
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Signal lost
          </h1>
          <p className="mt-3 text-pretty text-white/70">
            The coordinates you gave me don&apos;t point at anything. This page
            isn&apos;t on any map I&apos;ve got.
          </p>
        </div>
      </div>

      <dl className="relative mt-7 divide-y divide-white/5 border-y border-white/10 font-mono text-sm">
        <Telemetry label="Target" value={path} />
        <Telemetry
          label="Signal"
          value={rocketActive ? "RESCUE INBOUND" : "ACQUIRING..."}
          tone={rocketActive ? "good" : "warn"}
          pulse
        />
        <Telemetry label="Satellites locked" value="0" />
        <Telemetry label="Status" value="404 — PAGE NOT FOUND" tone="bad" />
      </dl>

      <div className="relative mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-md bg-white px-5 py-2.5 text-center text-sm font-semibold text-[#0c0722] transition-colors hover:bg-cyan-100"
        >
          Return to Earth
        </Link>
        <Link
          href="/blog-index"
          className="rounded-md border border-white/20 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10"
        >
          Recheck the manifest
        </Link>
      </div>

      {showRocketHint ? (
        <p className="relative mt-6 text-center font-mono text-xs text-white/40">
          <span className="text-cyan-300/80">{HINT_TEXT}</span> for a rescue.
        </p>
      ) : null}
    </div>
  </div>
);

export default NotFoundConsole;
