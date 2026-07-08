import { useEffect, useRef } from "react";

/*
  Fixed, full-page warm brand gradient with soft colour blobs that glide toward
  the mouse cursor (lerped) — like faria.org. Lives behind all content (z-0) and
  stays put while scrolling, so every section shares the same bright, consistent
  backdrop from top to bottom.
*/
export default function InteractiveGradient() {
  const b1 = useRef<HTMLDivElement>(null);
  const b2 = useRef<HTMLDivElement>(null);
  const b3 = useRef<HTMLDivElement>(null);
  const tgt = useRef({ x: 0.68, y: 0.32 });
  const cur = useRef({ x: 0.68, y: 0.32 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      tgt.current = {
        x: e.clientX / Math.max(1, window.innerWidth),
        y: e.clientY / Math.max(1, window.innerHeight),
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      cur.current.x += (tgt.current.x - cur.current.x) * 0.05;
      cur.current.y += (tgt.current.y - cur.current.y) * 0.05;
      const { x, y } = cur.current;
      const W = window.innerWidth, H = window.innerHeight;
      // each blob tracks the cursor from a different anchor → parallax depth
      if (b1.current) b1.current.style.transform = `translate3d(${x * W - 320}px, ${y * H - 320}px, 0)`;
      if (b2.current) b2.current.style.transform = `translate3d(${(1 - x) * W - 380}px, ${(1 - y) * H - 380}px, 0)`;
      if (b3.current) b3.current.style.transform = `translate3d(${x * W - 270}px, ${(1 - y) * H - 270}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0, background: "linear-gradient(158deg, #F9C766 0%, #F38AA0 44%, #E1408F 78%, #D81E86 100%)" }}>
      <div ref={b1} className="absolute rounded-full" style={{ left: 0, top: 0, width: 640, height: 640, willChange: "transform",
        background: "radial-gradient(circle, rgba(255,238,158,0.95) 0%, rgba(255,238,158,0) 60%)", filter: "blur(30px)" }} />
      <div ref={b2} className="absolute rounded-full" style={{ left: 0, top: 0, width: 760, height: 760, willChange: "transform",
        background: "radial-gradient(circle, rgba(232,55,172,0.85) 0%, rgba(232,55,172,0) 62%)", filter: "blur(40px)" }} />
      <div ref={b3} className="absolute rounded-full" style={{ left: 0, top: 0, width: 540, height: 540, willChange: "transform",
        background: "radial-gradient(circle, rgba(247,139,67,0.8) 0%, rgba(247,139,67,0) 60%)", filter: "blur(36px)" }} />
    </div>
  );
}
