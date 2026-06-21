"use client";

import { useEffect, useState } from "react";

export default function SceneRenderer({ scene, npcs }: any) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 120);
    return () => clearInterval(id);
  }, []);

  if (!scene) return null;

  return (
    <div className="scene">

      {/* BACKGROUND */}
      <div
        className="bg"
        style={{
          background: scene?.background?.colors
            ? `linear-gradient(${scene.background.colors[0]}, ${scene.background.colors[1]})`
            : "#050505",
        }}
      />

      {/* PARTICLES */}
      {scene?.particles?.map((p: any, i: number) =>
        Array.from({ length: p.params?.count || 10 }).map((_, j) => (
          <div
            key={`${i}-${j}`}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: p.params?.color || "#fff",
              animationDelay: `${j * 0.2}s`,
            }}
          />
        ))
      )}

      {/* 🧍 PIXEL CHARACTERS */}
      {npcs?.map((npc: any, i: number) => {
        const jitter = npc.state === "alert" ? Math.sin(tick / 2) * 2 : 0;

        return (
          <div
            key={i}
            className="npc"
            style={{
              left: `${npc.x}%`,
              top: `${npc.y}%`,
              transform: `translate(-50%, -50%) translate(${jitter}px, ${jitter}px)`,
            }}
          >
            <div
              className="sprite"
              style={{ background: npc.color || "#00f0ff" }}
            />
            <div className="label">{npc.name}</div>
          </div>
        );
      })}

      {/* EFFECT OVERLAY */}
      <div className="overlay" />

      <style jsx>{`
        .scene {
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .bg {
          position: absolute;
          inset: 0;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.03),
            transparent 2px
          );
          pointer-events: none;
        }

        .npc {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sprite {
          width: 10px;
          height: 10px;
          image-rendering: pixelated;
          box-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
          animation: blink 0.8s infinite;
        }

        .label {
          font-size: 10px;
          margin-top: 2px;
          color: white;
          opacity: 0.8;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          animation: float 6s infinite linear;
          opacity: 0.6;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}