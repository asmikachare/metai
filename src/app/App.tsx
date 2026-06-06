import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export default function App() {
  const navigate = useNavigate();
  const grainRef = useRef<HTMLCanvasElement>(null);
  const grainRunning = useRef(true);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!grainRunning.current) return;
      const { width: w, height: h } = canvas;
      const img = ctx.createImageData(w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 180;
      }
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(draw);
    };
    draw();

    return () => {
      grainRunning.current = false;
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>('.block');
    const cleanups: (() => void)[] = [];
    blocks.forEach(block => {
      const onMove = (e: MouseEvent) => {
        const r = block.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        block.style.transform = `scale(0.97) rotateX(${dy * -6}deg) rotateY(${dx * 6}deg)`;
      };
      const onLeave = () => { block.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)'; };
      block.addEventListener('mousemove', onMove);
      block.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { block.removeEventListener('mousemove', onMove); block.removeEventListener('mouseleave', onLeave); });
    });
    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <div style={{ background: '#080808', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", color: '#fff' }}>
      <style>{`
        @keyframes flow1 { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes flow2 { 0%,100%{background-position:100% 0%} 50%{background-position:0% 100%} }
        @keyframes flow3 { 0%,100%{background-position:50% 0%} 50%{background-position:50% 100%} }
        @keyframes flow4 { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes flow5 { 0%,100%{background-position:100% 50%} 50%{background-position:0% 50%} }
        .year-card { transition: background 0.2s, border-color 0.2s, transform 0.2s; }
        .year-card:hover { background: #111 !important; border-color: #333 !important; transform: translateY(-2px); }
        .iconic-chip { transition: background 0.15s, border-color 0.15s; }
        .iconic-chip:hover { background: #141414 !important; border-color: #2a2a2a !important; }
        .archive-pill { transition: background 0.15s, color 0.15s; }
        .archive-pill:hover { background: #1a1a1a !important; color: #888 !important; }
        .block { transition: transform 0.4s cubic-bezier(0.23,1,0.32,1); }
      `}</style>

      {/* ── Hero — gradient blocks ────────────────────────────────────── */}
      <section style={{
        height: '100vh', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(90deg,
          #040404 0%,#0a0a0a 3%,#141414 6%,#0a0a0a 10%,#050505 14%,
          #0c0c0c 18%,#161616 22%,#0c0c0c 26%,#060606 30%,
          #0e0e0e 34%,#181818 38%,#0e0e0e 42%,#050505 46%,
          #0a0a0a 50%,#151515 54%,#0a0a0a 58%,#040404 62%,
          #0c0c0c 66%,#171717 70%,#0c0c0c 74%,#060606 78%,
          #0e0e0e 82%,#161616 86%,#0e0e0e 90%,#050505 94%,
          #0a0a0a 97%,#040404 100%)`,
      }}>
        {/* Fabric noise overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px', opacity: 0.12, mixBlendMode: 'overlay',
        }} />

        {/* Gradient blocks grid */}
        <div style={{
          position: 'absolute', inset: '32px', zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '2fr 1.35fr 0.85fr',
          gridTemplateRows: '1.6fr 0.65fr 1fr',
          gap: '14px',
          perspective: '1000px',
        }}>
          <div className="block" style={{ gridColumn: '1', gridRow: '1/4', background: 'linear-gradient(160deg,#f87171,#fb923c,#f472b6,#c084fc,#fb923c,#f87171)', backgroundSize: '300% 300%', animation: 'flow1 10s ease infinite', borderRadius: '26px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', willChange: 'transform' }} />
          <div className="block" style={{ gridColumn: '2', gridRow: '1/3', background: 'linear-gradient(145deg,#1e1b4b,#3730a3,#4c1d95,#2d1b69,#1e1b4b,#3730a3)', backgroundSize: '300% 300%', animation: 'flow2 12s ease infinite', borderRadius: '26px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', willChange: 'transform' }} />
          <div className="block" style={{ gridColumn: '3', gridRow: '1', background: 'linear-gradient(135deg,#fef3c7,#fde68a,#c9a96e,#fef3c7,#fde68a)', backgroundSize: '300% 300%', animation: 'flow3 9s ease infinite', borderRadius: '26px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', willChange: 'transform' }} />
          <div className="block" style={{ gridColumn: '3', gridRow: '2', background: 'linear-gradient(135deg,#c2410c,#ea580c,#b45309,#c2410c,#ea580c)', backgroundSize: '300% 300%', animation: 'flow4 11s ease infinite', borderRadius: '26px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', willChange: 'transform' }} />
          <div className="block" style={{ gridColumn: '2/4', gridRow: '3', background: 'linear-gradient(135deg,#0f766e,#2dd4bf,#a7f3d0,#f0fdf4,#0f766e,#2dd4bf)', backgroundSize: '300% 300%', animation: 'flow5 13s ease infinite', borderRadius: '26px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', willChange: 'transform' }} />
        </div>

        {/* Centered content over blocks */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(80px,11vw,160px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '20px' }}>
            MetAI
          </h1>
          <p style={{ fontSize: 'clamp(13px,1.4vw,16px)', color: 'rgba(255,255,255,0.45)', maxWidth: '380px', textAlign: 'center', lineHeight: 1.6, marginBottom: '36px' }}>
            Score any Met Gala look against the year's theme. No mercy.
          </p>
          <div style={{ pointerEvents: 'auto' }}>
            <button
              onClick={() => navigate('/explore')}
              style={{ fontSize: '14px', color: '#080808', background: '#fff', padding: '14px 34px', borderRadius: '100px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}
            >
              Analyze a look →
            </button>
          </div>
        </div>

        {/* Grain overlay */}
        <canvas ref={grainRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 11, mixBlendMode: 'soft-light' }} />
      </section>

    </div>
  );
}
