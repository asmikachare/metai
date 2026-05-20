import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

export default function App() {
  const navigate = useNavigate();
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const curtainCanvasRef = useRef<HTMLCanvasElement>(null);
  const grainRunningRef = useRef(true);
  const [dropped, setDropped] = useState(false);
  const [page1Hidden, setPage1Hidden] = useState(false);

  // Grain effect
  useEffect(() => {
    const grain = grainCanvasRef.current;
    if (!grain) return;

    const gctx = grain.getContext('2d');
    if (!gctx) return;

    function resizeGrain() {
      if (!grain) return;
      grain.width = window.innerWidth;
      grain.height = window.innerHeight;
    }
    resizeGrain();
    window.addEventListener('resize', resizeGrain);

    function drawGrain() {
      if (!grainRunningRef.current) return;
      if (!gctx || !grain) return;
      const w = grain.width;
      const h = grain.height;
      if (!w || !h) {
        requestAnimationFrame(drawGrain);
        return;
      }
      const img = gctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 180;
      }
      gctx.putImageData(img, 0, 0);
      requestAnimationFrame(drawGrain);
    }
    drawGrain();

    return () => {
      window.removeEventListener('resize', resizeGrain);
    };
  }, []);

  // Block tilt
  useEffect(() => {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
      const handleMouseMove = (e: MouseEvent) => {
        const r = (block as HTMLElement).getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        (block as HTMLElement).style.transform = `scale(0.93) rotateX(${dy * -8}deg) rotateY(${dx * 8}deg)`;
      };

      const handleMouseLeave = () => {
        (block as HTMLElement).style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
      };

      block.addEventListener('mousemove', handleMouseMove as EventListener);
      block.addEventListener('mouseleave', handleMouseLeave);
    });
  }, []);

  const drawCurtainFabric = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    const stops: [number, string][] = [
      [0, '#040404'], [0.03, '#0a0a0a'], [0.06, '#141414'], [0.10, '#0a0a0a'], [0.14, '#050505'],
      [0.18, '#0c0c0c'], [0.22, '#161616'], [0.26, '#0c0c0c'], [0.30, '#060606'],
      [0.34, '#0e0e0e'], [0.38, '#181818'], [0.42, '#0e0e0e'], [0.46, '#050505'],
      [0.50, '#0a0a0a'], [0.54, '#151515'], [0.58, '#0a0a0a'], [0.62, '#040404'],
      [0.66, '#0c0c0c'], [0.70, '#171717'], [0.74, '#0c0c0c'], [0.78, '#060606'],
      [0.82, '#0e0e0e'], [0.86, '#161616'], [0.90, '#0e0e0e'], [0.94, '#050505'],
      [0.97, '#0a0a0a'], [1.00, '#040404']
    ];
    stops.forEach(([p, c]) => grad.addColorStop(p, c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const seams = 14;
    for (let i = 1; i < seams; i++) {
      const x = W * (i / seams) + (Math.sin(i * 7.3) * W * 0.02);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(x, 0, 1, H);
    }
  };

  const drawRoundedGradient = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number,
    stops: [string, number][],
    angleDeg: number
  ) => {
    const rad = angleDeg * Math.PI / 180;
    const len = Math.abs(Math.cos(rad) * w) + Math.abs(Math.sin(rad) * h);
    const dx = Math.cos(rad) * len / 2;
    const dy = Math.sin(rad) * len / 2;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    stops.forEach(([col, pos]) => grad.addColorStop(pos, col));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  };

  const renderCurtainCanvas = (W: number, H: number): HTMLCanvasElement => {
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const ctx = off.getContext('2d')!;

    drawCurtainFabric(ctx, W, H);

    const pad = 32, gap = 14;
    const gW = W - pad * 2, gH = H - pad * 2;
    const totalCols = 4.2, totalRows = 3.25;
    const col1W = (gW - gap * 2) * (2 / totalCols);
    const col2W = (gW - gap * 2) * (1.35 / totalCols);
    const col3W = (gW - gap * 2) * (0.85 / totalCols);
    const row1H = (gH - gap * 2) * (1.6 / totalRows);
    const row2H = (gH - gap * 2) * (0.65 / totalRows);
    const row3H = (gH - gap * 2) * (1 / totalRows);
    const x1 = pad, x2 = pad + col1W + gap, x3 = pad + col1W + gap + col2W + gap;
    const y1 = pad, y2 = pad + row1H + gap, y3 = pad + row1H + gap + row2H + gap;

    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    drawRoundedGradient(ctx, x1, y1, col1W, gH, 26, [['#f87171', 0], ['#fb923c', 0.25], ['#f472b6', 0.5], ['#c084fc', 0.75], ['#fb923c', 1]], 160);
    drawRoundedGradient(ctx, x2, y1, col2W, row1H + gap + row2H, 26, [['#1e1b4b', 0], ['#3730a3', 0.35], ['#4c1d95', 0.65], ['#2d1b69', 1]], 145);
    drawRoundedGradient(ctx, x3, y1, col3W, row1H, 26, [['#fef3c7', 0], ['#fde68a', 0.4], ['#c9a96e', 1]], 135);
    drawRoundedGradient(ctx, x3, y2, col3W, row2H, 26, [['#c2410c', 0], ['#ea580c', 0.5], ['#b45309', 1]], 135);
    drawRoundedGradient(ctx, x2, y3, col2W + gap + col3W, row3H, 26, [['#0f766e', 0], ['#2dd4bf', 0.35], ['#a7f3d0', 0.65], ['#f0fdf4', 1]], 135);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    const fontSize = Math.min(W * 0.11, 160);
    ctx.font = `300 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MetAI', W / 2, H / 2);

    return off;
  };

  const handleSceneClick = () => {
    if (dropped) return;
    setDropped(true);

    const cc = curtainCanvasRef.current;
    if (!cc) return;

    const cctx = cc.getContext('2d');
    if (!cctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const src = renderCurtainCanvas(W, H);

    cc.style.display = 'block';
    setPage1Hidden(true);

    const DURATION = 2400;
    const start = Date.now();
    const dropDist = H + 200;

    const ROWS = 80;
    const rowH = H / ROWS;

    const easeInQuad = (t: number) => t * t;

    const animate = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / DURATION, 1);
      const eased = easeInQuad(t);
      const dropY = eased * dropDist;
      const speedFactor = Math.min(1, eased * 1.4);

      cctx.clearRect(0, 0, W, H);

      if (dropY < H + 100) {
        for (let r = 0; r < ROWS; r++) {
          const srcY = r * rowH;
          const depth = r / ROWS;
          const phase = depth * Math.PI * 3.5;
          const ampBase = 4 + speedFactor * 22;
          const xWave = Math.sin(phase + elapsed * 0.0028 - depth * 0.8) * ampBase * (0.3 + depth * 1.2)
            + Math.sin(phase * 2.1 + elapsed * 0.004) * ampBase * 0.35 * depth;
          cctx.drawImage(src,
            0, srcY, W, rowH + 1,
            xWave, dropY + srcY, W, rowH + 1);
        }
      }

      if (t < 1) requestAnimationFrame(animate);
      else cc.style.display = 'none';
    };

    animate();
  };

  useEffect(() => {
    const cc = curtainCanvasRef.current;
    if (!cc) return;

    function resize() {
      if (!cc) return;
      cc.width = window.innerWidth;
      cc.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes flow1 { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes flow2 { 0%,100%{background-position:100% 0%} 50%{background-position:0% 100%} }
        @keyframes flow3 { 0%,100%{background-position:50% 0%} 50%{background-position:50% 100%} }
        @keyframes flow4 { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes flow5 { 0%,100%{background-position:100% 50%} 50%{background-position:0% 50%} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
      `}</style>

      {/* PAGE 2: LANDING */}
      <div id="page2" style={{ position: 'fixed', inset: 0, zIndex: 1, background: '#080808', overflowY: 'auto', fontFamily: "'DM Sans',sans-serif" }}>
        {/* Nav */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '0.5px solid #1a1a1a', background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '22px', fontWeight: 300, color: '#fff', letterSpacing: '0.06em' }}>MetAI</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#" style={{ fontSize: '13px', color: '#666', textDecoration: 'none', letterSpacing: '0.04em' }}>How it works</a>
            <a href="#" style={{ fontSize: '13px', color: '#666', textDecoration: 'none', letterSpacing: '0.04em' }}>Features</a>
            <a href="#" style={{ fontSize: '13px', color: '#666', textDecoration: 'none', letterSpacing: '0.04em' }}>2026 Scoreboard</a>
            <button onClick={() => navigate('/analyze')} style={{ fontSize: '13px', color: '#080808', background: '#fff', padding: '10px 24px', borderRadius: '100px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>Analyze a look →</button>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(251,146,60,0.06) 0%,rgba(192,132,252,0.04) 40%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: '28px' }}>2026 Met Gala · Fashion as Art</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(52px,7vw,110px)', fontWeight: 300, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '24px', maxWidth: '900px' }}>
            Fashion is art.<br /><em style={{ color: '#fb923c', fontStyle: 'italic' }}>Some just wear clothes.</em>
          </h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 44px' }}>MetAI scores Met Gala looks against the year's theme — then tells you exactly what they should have worn instead.</p>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/analyze')} style={{ fontSize: '14px', color: '#080808', background: '#fff', padding: '14px 32px', borderRadius: '100px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>Analyze a look →</button>
            <a href="#" style={{ fontSize: '14px', color: '#fff', padding: '14px 32px', borderRadius: '100px', textDecoration: 'none', letterSpacing: '0.04em', border: '0.5px solid #333' }}>See the 2026 scoreboard</a>
          </div>
        </section>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '0.5px solid #1a1a1a', borderBottom: '0.5px solid #1a1a1a' }}>
          <div style={{ padding: '36px 48px', borderRight: '0.5px solid #1a1a1a' }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '52px', fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: '8px' }}><span style={{ color: '#fb923c' }}>47</span></div>
            <div style={{ fontSize: '13px', color: '#444', letterSpacing: '0.04em' }}>Looks analyzed — 2026</div>
          </div>
          <div style={{ padding: '36px 48px', borderRight: '0.5px solid #1a1a1a' }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '52px', fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: '8px' }}><span style={{ color: '#fb923c' }}>12</span></div>
            <div style={{ fontSize: '13px', color: '#444', letterSpacing: '0.04em' }}>Looks scored on-theme</div>
          </div>
          <div style={{ padding: '36px 48px' }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '52px', fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: '8px' }}><span style={{ color: '#fb923c' }}>10</span></div>
            <div style={{ fontSize: '13px', color: '#444', letterSpacing: '0.04em' }}>Years of Met Gala themes tracked</div>
          </div>
        </div>

        {/* How it works section */}
        <div style={{ padding: '100px 48px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '20px' }}>How it works</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,4vw,60px)', fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: '60px', maxWidth: '600px' }}>From red carpet to verdict in seconds.</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: '#1a1a1a', border: '0.5px solid #1a1a1a' }}>
            {[
              { num: '01', title: 'Drop or search', desc: 'Upload a screenshot or type any celebrity name. We find the look automatically.' },
              { num: '02', title: 'We pull the look', desc: 'Our AI searches the internet for their exact outfit — brand, designer, and every detail.' },
              { num: '03', title: 'Score & critique', desc: 'The look is scored 0–10 against the year\'s theme with a full fashion critique.' },
              { num: '04', title: 'See the alternative', desc: 'We surface real archive pieces and emerging brands that would have nailed the theme.' }
            ].map((step, i) => (
              <div key={i} style={{ background: '#080808', padding: '36px 32px' }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '48px', fontWeight: 300, color: '#1e1e1e', lineHeight: 1, marginBottom: '20px' }}>{step.num}</div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '10px' }}>{step.title}</div>
                <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: '0 48px 100px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '20px' }}>Features</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,4vw,60px)', fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: '60px', maxWidth: '600px' }}>Everything a stylist wishes they had.</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {[
              { icon: '🔍', bg: 'rgba(251,146,60,0.12)', num: '01 — Analyze', title: 'Drop or search any look', desc: 'Upload a screenshot or type any celebrity name. MetAI pulls the look from the internet and scores it against the Met Gala theme.' },
              { icon: '🗂', bg: 'rgba(192,132,252,0.12)', num: '02 — Archive', title: 'Designer archive pull', desc: 'We surface past runway looks from the brand\'s actual catalog that would have nailed the theme. Specific seasons. Specific pieces.' },
              { icon: '✦', bg: 'rgba(45,212,191,0.12)', num: '03 — Discover', title: 'Emerging brands', desc: 'Find independent designers from NYFW and beyond whose entire aesthetic is built for the theme. The ones who deserve a Met Gala moment.' }
            ].map((feature, i) => (
              <div key={i} style={{ background: '#0d0d0d', border: '0.5px solid #1a1a1a', borderRadius: '20px', padding: '36px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '18px', background: feature.bg }}>{feature.icon}</div>
                <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: '#333', textTransform: 'uppercase', marginBottom: '12px' }}>{feature.num}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '24px', fontWeight: 400, color: '#fff', marginBottom: '12px' }}>{feature.title}</div>
                <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scoreboard */}
        <div style={{ padding: '100px 48px', borderTop: '0.5px solid #1a1a1a' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '20px' }}>2026 scoreboard preview</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,4vw,60px)', fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: '40px', maxWidth: '600px' }}>Who actually got it right.</h3>
            {[
              { num: '9.2', color: '#4ade80', name: 'Lisa (BLACKPINK)', detail: '3D-printed headgear and hand elements — wearable sculpture at its finest', badge: 'On Theme', badgeBg: 'rgba(74,222,128,0.1)', badgeColor: '#4ade80' },
              { num: '8.1', color: '#4ade80', name: 'Bi (Kim Petras)', detail: 'Mirror dress with film roll motif — cinema as art, fashion as cultural reflection', badge: 'On Theme', badgeBg: 'rgba(74,222,128,0.1)', badgeColor: '#4ade80' },
              { num: '6.4', color: '#fb923c', name: 'Kim Kardashian', detail: 'Committed to an aesthetic. Concept present, execution could go further.', badge: 'Partial', badgeBg: 'rgba(251,146,60,0.1)', badgeColor: '#fb923c' },
              { num: '4.1', color: '#f87171', name: 'Jenny (BLACKPINK) — Chanel', detail: 'Gorgeous gown. Reads as campaign look. Beautiful fashion, not art.', badge: 'Off Theme', badgeBg: 'rgba(248,113,113,0.1)', badgeColor: '#f87171' },
              { num: '2.3', color: '#f87171', name: 'Kendall Jenner — Gap', detail: 'Gap is a commercial brand. This belongs at a brand launch, not the Met.', badge: 'Miss', badgeBg: 'rgba(248,113,113,0.1)', badgeColor: '#f87171' }
            ].map((score, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 0', borderBottom: '0.5px solid #111', ...(i === 0 && { borderTop: '0.5px solid #111' }) }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', fontWeight: 300, minWidth: '52px', color: score.color }}>{score.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>{score.name}</div>
                  <div style={{ fontSize: '13px', color: '#555' }}>{score.detail}</div>
                </div>
                <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.06em', background: score.badgeBg, color: score.badgeColor }}>{score.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div style={{ padding: '100px 48px', textAlign: 'center', borderTop: '0.5px solid #1a1a1a' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, fontStyle: 'italic', color: '#fff', maxWidth: '800px', margin: '0 auto 24px', lineHeight: 1.3 }}>"Fashion is not something that exists in dresses only. Fashion is in the sky, in the street — fashion has to do with ideas."</p>
          <div style={{ fontSize: '13px', color: '#444', letterSpacing: '0.08em' }}>— Coco Chanel</div>
        </div>

        {/* CTA */}
        <div style={{ padding: '120px 48px', textAlign: 'center', borderTop: '0.5px solid #1a1a1a' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,88px)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '32px' }}>
            Your look.<br /><em style={{ color: '#fb923c', fontStyle: 'italic' }}>Analyzed.</em>
          </h2>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/analyze')} style={{ fontSize: '14px', color: '#080808', background: '#fff', padding: '14px 32px', borderRadius: '100px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>Analyze a look →</button>
            <a href="#" style={{ fontSize: '14px', color: '#fff', padding: '14px 32px', borderRadius: '100px', textDecoration: 'none', letterSpacing: '0.04em', border: '0.5px solid #333' }}>View full 2026 scoreboard</a>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ padding: '48px', borderTop: '0.5px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '18px', fontWeight: 300, color: '#fff' }}>MetAI</div>
          <div style={{ fontSize: '12px', color: '#333' }}>© 2026 MetAI. Fashion criticism, powered by AI.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>Contact</a>
          </div>
        </footer>
      </div>

      {/* PAGE 1: VELVET CURTAIN */}
      <div id="page1" style={{ position: 'fixed', inset: 0, zIndex: 2, visibility: page1Hidden ? 'hidden' : 'visible' }}>
        <div
          className="scene"
          id="scene"
          onClick={handleSceneClick}
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            position: 'relative',
            cursor: 'pointer',
            background: `linear-gradient(90deg,
              #040404 0%, #0a0a0a 3%, #141414 6%, #0a0a0a 10%, #050505 14%,
              #0c0c0c 18%, #161616 22%, #0c0c0c 26%, #060606 30%,
              #0e0e0e 34%, #181818 38%, #0e0e0e 42%, #050505 46%,
              #0a0a0a 50%, #151515 54%, #0a0a0a 58%, #040404 62%,
              #0c0c0c 66%, #171717 70%, #0c0c0c 74%, #060606 78%,
              #0e0e0e 82%, #161616 86%, #0e0e0e 90%, #050505 94%,
              #0a0a0a 97%, #040404 100%)`
          }}
        >
          <div style={{
            content: '',
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
            opacity: 0.15,
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }} />

          <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '2fr 1.35fr 0.85fr', gridTemplateRows: '1.6fr 0.65fr 1fr', gap: '14px', perspective: '1000px', position: 'relative', zIndex: 2 }}>
            <div className="block" style={{ gridColumn: '1', gridRow: '1/4', background: 'linear-gradient(160deg,#f87171,#fb923c,#f472b6,#c084fc,#fb923c,#f87171)', backgroundSize: '300% 300%', animation: 'flow1 10s ease infinite', borderRadius: '26px', overflow: 'hidden', position: 'relative', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', cursor: 'pointer', willChange: 'transform', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }} />
            <div className="block" style={{ gridColumn: '2', gridRow: '1/3', background: 'linear-gradient(145deg,#1e1b4b,#3730a3,#4c1d95,#2d1b69,#1e1b4b,#3730a3)', backgroundSize: '300% 300%', animation: 'flow2 12s ease infinite', borderRadius: '26px', overflow: 'hidden', position: 'relative', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', cursor: 'pointer', willChange: 'transform', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }} />
            <div className="block" style={{ gridColumn: '3', gridRow: '1', background: 'linear-gradient(135deg,#fef3c7,#fde68a,#c9a96e,#fef3c7,#fde68a)', backgroundSize: '300% 300%', animation: 'flow3 9s ease infinite', borderRadius: '26px', overflow: 'hidden', position: 'relative', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', cursor: 'pointer', willChange: 'transform', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }} />
            <div className="block" style={{ gridColumn: '3', gridRow: '2', background: 'linear-gradient(135deg,#c2410c,#ea580c,#b45309,#c2410c,#ea580c)', backgroundSize: '300% 300%', animation: 'flow4 11s ease infinite', borderRadius: '26px', overflow: 'hidden', position: 'relative', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', cursor: 'pointer', willChange: 'transform', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }} />
            <div className="block" style={{ gridColumn: '2/4', gridRow: '3', background: 'linear-gradient(135deg,#0f766e,#2dd4bf,#a7f3d0,#f0fdf4,#0f766e,#2dd4bf)', backgroundSize: '300% 300%', animation: 'flow5 13s ease infinite', borderRadius: '26px', overflow: 'hidden', position: 'relative', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', cursor: 'pointer', willChange: 'transform', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }} />
          </div>

          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(80px,11vw,160px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>MetAI</h1>
          </div>

          <div style={{ position: 'absolute', bottom: '44px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'DM Sans',sans-serif", fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', pointerEvents: 'none', zIndex: 10, animation: 'pulse 2.5s ease infinite' }}>
            Click anywhere
          </div>
        </div>
      </div>

      {/* Curtain Canvas */}
      <canvas
        ref={curtainCanvasRef}
        id="curtainCanvas"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9,
          pointerEvents: 'none',
          display: 'none'
        }}
      />

      {/* Grain Canvas */}
      <canvas
        ref={grainCanvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
          mixBlendMode: 'soft-light'
        }}
      />
    </>
  );
}
