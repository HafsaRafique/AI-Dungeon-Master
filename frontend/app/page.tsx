"use client";

import { useState } from "react";
import { forgeWorld } from "@/services/api";
import SceneRenderer from "@/components/SceneRenderer";

export default function Home() {
  const [input, setInput] = useState("");
  const [world, setWorld] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState({
    background: "#050505",
    accent: "#ffffff",
  });

  // 
  const safeText = (item: any) => {
    if (item === null || item === undefined) return "";
    if (typeof item === "string" || typeof item === "number") return item;
    if (typeof item === "object") {
      return item.name || item.text || item.value || JSON.stringify(item);
    }
    return String(item);
  };

  async function submitAction(action: string) {
    if (!action || loading) return;

    setLoading(true);

    try {
      const data = await forgeWorld(action, world);

      setWorld({ ...data });

      // 
      if (data?.scene) {
        setTheme({
          background:
            data.scene.background?.colors?.[0] || "#050505",
          accent: "#ffffff",
        });
      }
    } catch (err) {
      console.error("Game error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="game-ui"
      style={{
        backgroundColor: theme.background,
        color: theme.accent,
      }}
    >
     
      <SceneRenderer scene={world?.scene} />

      {/* UI ABOVE SCENE */}
      <div className="relative z-10 flex w-full">

        {/* LEFT PANEL */}
        <div className="w-1/4 border-r border-white/10 p-6 space-y-6">
          <h1 className="text-2xl font-bold tracking-widest">
            LORECRAFT
          </h1>

          {world ? (
            <>
              <div>
                <h2 className="text-sm opacity-70">LOCATION</h2>
                <p className="text-lg">{world.location}</p>
              </div>

              <div>
                <h2 className="text-sm opacity-70">THEME</h2>
                <p>{world.theme}</p>
              </div>

              <div>
                <h2 className="text-sm opacity-70">MOOD</h2>
                <p>{world.mood}</p>
              </div>

              <div>
                <h2 className="text-sm opacity-70">INVENTORY</h2>
                <ul className="text-sm mt-1 space-y-1">
                  {world.inventory?.map((i: any, idx: number) => (
                    <li key={idx}>• {safeText(i)}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-sm opacity-70">NPCs</h2>
                <ul className="text-sm mt-1 space-y-1">
                  {world.npcs?.map((n: any, idx: number) => (
                    <li key={idx}>• {safeText(n)}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="opacity-60 text-sm">
              Enter a prompt to begin your journey...
            </p>
          )}
        </div>

        {/* CENTER PANEL */}
        <div className="flex-1 flex flex-col p-8">

          <h1 className="text-4xl font-bold mb-6 tracking-wider">
            ADVENTURE
          </h1>

          {!world ? (
            <div className="mt-10">
              <textarea
                className="w-full h-40 p-4 text-black rounded"
                placeholder="Describe your world..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button
                className="mt-4 px-6 py-3 border border-white hover:bg-white hover:text-black transition"
                onClick={() => submitAction(input)}
                disabled={loading}
              >
                {loading ? "Creating World..." : "Start Journey"}
              </button>
            </div>
          ) : (
            <>
              {/* STORY */}
              <div className="flex-1 border border-white/10 p-6 rounded bg-black/30 backdrop-blur">
                <p className="text-lg leading-relaxed">
                  {world.story}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                {world.choices?.map((c: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => submitAction(safeText(c))}
                    disabled={loading}
                    className="p-4 border border-white/20 hover:bg-white hover:text-black transition text-left"
                  >
                     {safeText(c)}
                  </button>
                ))}
              </div>

              {loading && (
                <p className="mt-4 opacity-60">
                  Processing...
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <style jsx>{`
  .game-ui {
    min-height: 100vh;
    display: flex;
    font-family: monospace;
    background: radial-gradient(circle at top, #1a1a1a, #0b0b0b);
    color: #eaeaea;
    overflow: hidden;
  }

  /* LEFT PANEL */
  .game-ui .w-1\\/4 {
    background: rgba(20, 20, 20, 0.6);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
  }

  /* CENTER */
  .game-ui .flex-1 {
    background: rgba(10, 10, 10, 0.4);
    backdrop-filter: blur(12px);
  }

  /* HEADINGS */
  .game-ui h1,
  .game-ui h2 {
    letter-spacing: 2px;
    color: #f0f0f0;
  }

  /* STORY BOX */
  .game-ui .bg-black\\/30 {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
  }

  /* PANELS SPACING */
  .game-ui .p-6 {
    padding: 18px;
  }

  /* TEXTAREA */
  .game-ui textarea {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 10px;
    outline: none;
  }

  /* BUTTONS (CHOICES) */
  .game-ui button {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #eaeaea;
    border-radius: 10px;
    transition: all 0.15s ease;
  }

  .game-ui button:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  /* LIST ITEMS */
  .game-ui li {
    opacity: 0.85;
  }

  /* SCROLL FEEL */
  .game-ui * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.2) transparent;
  }

    /* LEFT PANEL IMPROVEMENT */
  .game-ui .w-1\/4 {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.04),
      rgba(0, 0, 0, 0.2)
    );
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14px);
  }

  /* LEFT PANEL TITLE */
  .game-ui .w-1\/4 h1 {
    font-size: 18px;
    letter-spacing: 4px;
    margin-bottom: 10px;
    opacity: 0.9;
  }

  /* SECTION LABELS */
  .game-ui .w-1\/4 h2 {
    font-size: 11px;
    letter-spacing: 2px;
    opacity: 0.6;
    margin-bottom: 2px;
  }

  /* DATA BOXES */
  .game-ui .w-1\/4 .text-lg {
    font-size: 14px;
    padding: 4px 0;
    border-bottom: 1px dashed rgba(255,255,255,0.08);
  }

  /* INVENTORY + NPC LIST */
  .game-ui .w-1\/4 ul {
    margin-top: 6px;
    padding-left: 10px;
  }

  .game-ui .w-1\/4 li {
    font-size: 12px;
    opacity: 0.85;
    padding: 2px 0;
  }

  /* LEFT PANEL HOVER FEEL (SUBTLE RPG UI FEEDBACK) */
  .game-ui .w-1\/4 li:hover {
    opacity: 1;
    transform: translateX(2px);
    transition: all 0.1s ease;
  }

  /* EMPTY STATE */
  .game-ui .w-1\/4 .opacity-60 {
    font-size: 12px;
    letter-spacing: 1px;
  }
`}</style>
    </main>
    
  );
  
}