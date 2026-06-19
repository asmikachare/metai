import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Nav } from '../components/Nav';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

// ─── Types ───────────────────────────────────────────────────────────────────

type YearImage = { url: string; thumbnail: string; title: string };
type YearData = { status: 'loading' | 'done' | 'error'; images?: YearImage[]; blurb?: string; must_knows?: string[] };

// ─── Swiper card data ─────────────────────────────────────────────────────────

const CARDS = [
  { year: '2019', label: 'Camp: Notes on Fashion', src: '/archive/2019.jpg', gradient: 'linear-gradient(145deg,#7c3aed,#db2777,#f97316)' },
  { year: '2018', label: 'Heavenly Bodies', src: '/archive/2018.jpg', gradient: 'linear-gradient(145deg,#1e1b4b,#4c1d95,#7c3aed)' },
  { year: '2016', label: 'Manus x Machina', src: '/archive/2016.jpg', gradient: 'linear-gradient(145deg,#0f172a,#1e293b,#475569)' },
  { year: '2015', label: 'China: Through the Looking Glass', src: '/archive/2015.jpg', gradient: 'linear-gradient(145deg,#7f1d1d,#b91c1c,#fca5a5)' },
  { year: '2013', label: 'PUNK: Chaos to Couture', src: '/archive/2013.jpg', gradient: 'linear-gradient(145deg,#111,#1c1917,#78716c)' },
  { year: '2011', label: 'Alexander McQueen: Savage Beauty', src: '/archive/2011.jpg', gradient: 'linear-gradient(145deg,#064e3b,#065f46,#6ee7b7)' },
];

// ─── Row data ─────────────────────────────────────────────────────────────────

const ROWS = [
  {
    label: 'Recent · 2020s',
    showArrows: false,
    years: [
      { year: 2026, theme: 'Fashion as Art', fact: 'The first time AI started judging the judges.', tag: 'Live', tagColor: '#fb923c', tagBg: 'rgba(251,146,60,0.12)' },
      { year: 2025, theme: 'Superfine: Tailoring Black Style', fact: 'A love letter to Black dandyism. Long overdue.' },
      { year: 2024, theme: 'The Garden of Time', fact: 'Florals interpreted literally. Again.' },
      { year: 2023, theme: 'Karl Lagerfeld: A Line of Beauty', fact: 'Honoring a legend. Half the room wore Chanel.' },
      { year: 2022, theme: 'In America: An Anthology', fact: "Part two of America's identity crisis. Still unresolved." },
      { year: 2021, theme: 'In America: A Lexicon', fact: 'Post-pandemic return. The fashion was hungry.' },
    ],
  },
  {
    label: 'The iconic era · 2010s',
    showArrows: true,
    years: [
      { year: 2019, theme: 'Camp: Notes on Fashion', fact: 'The most memed Met in history. Drag. Kitsch. Chaos.' },
      { year: 2018, theme: 'Heavenly Bodies', fact: 'Most attended ever. Religion meets runway.' },
      { year: 2017, theme: 'Rei Kawakubo / Comme des Garçons', fact: "Fashion's most cerebral designer finally gets her moment." },
      { year: 2016, theme: 'Manus x Machina', fact: "Technology vs. craft. Most didn't get the memo." },
      { year: 2015, theme: 'China: Through the Looking Glass', fact: 'The most controversial theme. The most gorgeous exhibition.' },
      { year: 2014, theme: 'Charles James: Beyond Fashion', fact: 'The ballgown as architecture. And Kim K was pregnant.' },
      { year: 2013, theme: 'PUNK: Chaos to Couture', fact: 'The year everyone wore leather and safety pins wrong.' },
      { year: 2012, theme: 'Schiaparelli and Prada', fact: "Two designers, one show. Fashion's ultimate odd couple." },
      { year: 2011, theme: 'Alexander McQueen: Savage Beauty', fact: 'In memory of Lee. The most emotional Met ever.' },
      { year: 2010, theme: 'American Woman', fact: "Lady Gaga's first Met. Enough said." },
    ],
  },
  {
    label: 'Archive · Before 2010',
    showArrows: false,
    years: [
      { year: 2009, theme: 'The Model as Muse', fact: 'Supermodels were the theme. Naturally they all showed up.' },
      { year: 2008, theme: 'Superheroes: Fashion and Fantasy', fact: 'Iron Man came out this year. The fashion was less heroic.' },
      { year: 2007, theme: 'Poiret: King of Fashion', fact: 'The designer who freed women from corsets, remembered.' },
      { year: 2006, theme: 'AngloMania', fact: 'Britain takes over the Met. Tea not included.' },
      { year: 2005, theme: 'The House of Chanel', fact: 'Chanel as museum piece. Karl was very much alive.' },
      { year: 2004, theme: 'Dangerous Liaisons', fact: 'Costume drama energy. The most theatrical Met of the decade.' },
    ],
  },
];

// ─── Card swiper ──────────────────────────────────────────────────────────────

function CardSwiper() {
  const n = CARDS.length;
  const [order, setOrder] = useState(() => Array.from({ length: n }, (_, i) => i));
  const [animDir, setAnimDir] = useState<'next' | 'prev' | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);

  const BASE = [
    { x: 0,  y: 0,  rot: 0, scale: 1.00, opacity: 1.00, zIndex: 12 },
    { x: 14, y: 8,  rot: 2, scale: 0.96, opacity: 0.88, zIndex: 11 },
    { x: 24, y: 14, rot: 4, scale: 0.92, opacity: 0.76, zIndex: 10 },
  ];
  // prevCard rests at the back-of-deck position, invisible but physically there
  const PREV_REST = { x: 24, y: 14, rot: 4, scale: 0.92, opacity: 0, zIndex: 8 };
  // truly gone — used when a card exits the visible set
  const GONE = { x: 32, y: 20, rot: 6, scale: 0.85, opacity: 0, zIndex: 7 };

  const goNext = () => {
    if (animDir) return;
    setAnimDir('next');
    setTimeout(() => {
      setOrder(o => { const a = [...o]; a.push(a.shift()!); return a; });
      setAnimDir(null);
    }, 420);
  };

  const goPrev = () => {
    if (animDir) return;
    setAnimDir('prev');
    setTimeout(() => {
      setOrder(o => { const a = [...o]; a.unshift(a.pop()!); return a; });
      setAnimDir(null);
    }, 420);
  };

  const handleDragStart = (x: number) => {
    if (animDir) return;
    dragStartX.current = x;
    dragging.current = true;
  };
  const handleDragMove = (x: number) => {
    if (!dragging.current || dragStartX.current === null || animDir) return;
    setDragOffset(x - dragStartX.current);
  };
  const handleDragEnd = (x: number) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = dragStartX.current !== null ? x - dragStartX.current : 0;
    dragStartX.current = null;
    setDragOffset(0);
    if (dx < -50) goNext();
    else if (dx > 50) goPrev();
  };

  // 3 visible + 1 pre-mounted "previous" card so goPrev can animate it to front
  const visible = order.slice(0, 3);
  const prevCardIdx = order[n - 1];
  const allRendered = [...new Set([...visible, prevCardIdx])];

  const getPos = (cardIdx: number) => {
    const slot = visible.indexOf(cardIdx);
    const isPrev = cardIdx === prevCardIdx && slot === -1;

    if (isPrev) {
      // Rests physically at the back of the deck (same position as BASE[2], just invisible)
      // When goPrev fires, it slides forward to the front — mirrors goNext exactly in reverse
      if (animDir === 'prev') return { ...BASE[0], zIndex: 13 };
      return PREV_REST;
    }
    if (slot === -1) return GONE;
    if (!animDir) return BASE[slot];

    if (animDir === 'next') {
      if (slot === 0) return { ...BASE[2], zIndex: 9 }; // goes to back
      if (slot === 1) return BASE[0];                    // comes to front
      if (slot === 2) return BASE[1];                    // comes to middle
    }
    if (animDir === 'prev') {
      if (slot === 0) return BASE[1];  // goes to middle
      if (slot === 1) return BASE[2];  // goes to back
      if (slot === 2) return GONE;     // exits deeper behind
    }
    return BASE[slot];
  };

  const frontCardIdx =
    !animDir        ? visible[0] :
    animDir === 'next' ? visible[1] :
    prevCardIdx;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
      <div
        style={{ position: 'relative', width: '320px', height: '400px', cursor: dragging.current ? 'grabbing' : 'grab', userSelect: 'none' }}
        onMouseDown={e => handleDragStart(e.clientX)}
        onMouseMove={e => handleDragMove(e.clientX)}
        onMouseUp={e => handleDragEnd(e.clientX)}
        onMouseLeave={e => handleDragEnd(e.clientX)}
        onTouchStart={e => handleDragStart(e.touches[0].clientX)}
        onTouchMove={e => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={e => handleDragEnd(e.changedTouches[0].clientX)}
      >
        {allRendered.map(cardIdx => {
          const pos = getPos(cardIdx);
          const card = CARDS[cardIdx];
          const isFront = cardIdx === frontCardIdx;
          return (
            <div
              key={cardIdx}
              style={{
                position: 'absolute', inset: 0,
                zIndex: pos.zIndex,
                borderRadius: '20px', overflow: 'hidden',
                transform: isFront && !animDir
                  ? `translateX(${pos.x + dragOffset}px) translateY(${pos.y}px) rotate(${pos.rot + dragOffset * 0.025}deg) scale(${pos.scale})`
                  : `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rot}deg) scale(${pos.scale})`,
                opacity: pos.opacity,
                transition: isFront && dragging.current ? 'none' : 'transform 0.42s cubic-bezier(0.23,1,0.32,1), opacity 0.42s ease',
                boxShadow: isFront ? '0 24px 60px rgba(0,0,0,0.7)' : '0 8px 24px rgba(0,0,0,0.5)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ width: '100%', height: '100%', background: card.gradient, position: 'relative' }}>
                {card.src && (
                  <img src={card.src} alt={card.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                )}
                {isFront && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 24px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                    <div style={{ fontSize: '11px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '6px' }}>{card.label}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '52px', fontWeight: 300, color: '#fff', lineHeight: 1 }}>{card.year}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation hint — arrows are clickable */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button onClick={goPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#fff', opacity: 0.4, padding: '4px 8px', transition: 'opacity 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}>←</button>
        <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', opacity: 0.3 }}>swipe</span>
        <button onClick={goNext} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#fff', opacity: 0.4, padding: '4px 8px', transition: 'opacity 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}>→</button>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {CARDS.map((_, i) => (
          <div key={i} style={{
            width: i === order[0] ? '20px' : '6px', height: '6px',
            borderRadius: '3px',
            background: i === order[0] ? '#fff' : '#333',
            transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '24px' : '48px', padding: isMobile ? '24px' : '40px 48px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[100, 85, 90].map((w, i) => (
          <div key={i} style={{ height: '16px', width: `${w}%`, borderRadius: '4px', background: 'linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
        ))}
        <div style={{ marginTop: '20px' }}>
          {[60, 70, 55].map((w, i) => (
            <div key={i} style={{ height: '12px', width: `${w}%`, borderRadius: '4px', background: 'linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: '10px' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: '260px', borderRadius: '10px', background: 'linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s infinite ${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Expansion panel ──────────────────────────────────────────────────────────

function ExpansionPanel({ year, data, visible, navigate }: { year: number; data: YearData | undefined; visible: boolean; navigate: (p: string) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{
      overflow: 'hidden',
      maxHeight: visible ? '1200px' : '0px',
      opacity: visible ? 1 : 0,
      transition: 'max-height 0.45s cubic-bezier(0.23,1,0.32,1), opacity 0.3s ease',
      borderTop: visible ? '0.5px solid #1a1a1a' : 'none',
      background: '#0a0a0a',
    }}>
      {data?.status === 'loading' && <Skeleton />}

      {data?.status === 'done' && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '24px' : '48px', padding: isMobile ? '24px' : '40px 48px' }}>
          {/* Left — editorial */}
          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(16px,1.6vw,20px)', fontWeight: 300, fontStyle: 'italic',
              color: '#ccc', lineHeight: 1.7, marginBottom: '28px',
            }}>
              {data.blurb}
            </p>
            {data.must_knows && data.must_knows.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#555', marginBottom: '10px' }}>Ones to know</div>
                <div style={{ fontSize: '13px', color: '#888', letterSpacing: '0.06em' }}>
                  {data.must_knows.join(' · ')}
                </div>
              </div>
            )}
            <button
              onClick={() => navigate(`/analyze?year=${year}`)}
              style={{ marginTop: '32px', fontSize: '13px', color: '#080808', background: '#fff', padding: '11px 24px', borderRadius: '100px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}
            >
              Analyze a look from {year} →
            </button>
          </div>

          {/* Right — images */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
            {(data.images ?? []).slice(0, 6).map((img, i) => (
              <div
                key={i}
                onClick={() => navigate(`/analyze?year=${year}`)}
                style={{ height: '260px', borderRadius: '10px', overflow: 'hidden', background: '#111', cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <img src={img.thumbnail || img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.status === 'error' && (
        <div style={{ padding: '32px 48px', fontSize: '13px', color: '#555' }}>
          Couldn't load this year. Try again.
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function ArchivePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const yearDataRef = useRef<Record<number, YearData>>({});
  const [yearData, setYearData] = useState<Record<number, YearData>>({});
  // One scroll ref per row — keyed by label
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCardClick = (year: number) => {
    if (expandedYear === year) { setExpandedYear(null); return; }
    setExpandedYear(year);
    if (yearDataRef.current[year]) return; // already fetched
    yearDataRef.current[year] = { status: 'loading' };
    setYearData({ ...yearDataRef.current });
    fetch('/api/archive-year', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year }),
    })
      .then(r => r.json())
      .then(data => {
        yearDataRef.current[year] = { status: 'done', ...data };
        setYearData({ ...yearDataRef.current });
      })
      .catch(() => {
        yearDataRef.current[year] = { status: 'error' };
        setYearData({ ...yearDataRef.current });
      });
  };

  const scroll = (label: string, dir: 'left' | 'right') => {
    rowRefs.current[label]?.scrollBy({ left: dir === 'right' ? 520 : -520, behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#080808', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", color: '#fff' }}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <Nav back={{ to: "/explore" }} />

      {/* Hero */}
      <section style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '48px' : '80px', alignItems: 'center', padding: isMobile ? '60px 24px' : '100px 80px', minHeight: isMobile ? 'auto' : '88vh', borderBottom: '0.5px solid #1a1a1a', maxWidth: '1200px', margin: '0 auto' }}>
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.22em', color: '#666', textTransform: 'uppercase', marginBottom: '28px' }}>Looking back</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,5vw,72px)', fontWeight: 300, lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: '28px' }}>
            78 years. Pick one<br />and start<br /><em style={{ color: '#fb923c', fontStyle: 'italic' }}>deconstructing.</em>
          </h1>
          <p style={{ fontSize: '15px', color: '#777', lineHeight: 1.8, maxWidth: '420px', marginBottom: '16px' }}>
            The Met Gala began in 1948 as a fundraising dinner for the Costume Institute. For decades it was a quiet industry event. Then Anna Wintour took over in 1995 and turned it into the most photographed night in fashion.
          </p>
          <p style={{ fontSize: '15px', color: '#777', lineHeight: 1.8, maxWidth: '420px', marginBottom: '40px' }}>
            Each year has a theme. Each celebrity makes a choice. Most of them get it wrong. We score all of it.
          </p>
          <button onClick={() => navigate('/analyze')} style={{ fontSize: '14px', color: '#080808', background: '#fff', padding: '14px 32px', borderRadius: '100px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
            Analyze a look →
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CardSwiper />
        </div>
      </section>

      {/* Netflix-style year rows */}
      <div style={{ padding: '80px 0 120px' }}>
        {ROWS.map(({ label, years, showArrows }) => {
          const activeInRow = years.some(y => y.year === expandedYear);
          return (
            <div key={label} style={{ marginBottom: '60px' }}>
              {/* Row header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: isMobile ? '20px' : '48px', paddingRight: isMobile ? '20px' : '48px', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#777', textTransform: 'uppercase' }}>{label}</div>
                {showArrows && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => scroll(label, 'left')} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#777')} style={{ background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#777', transition: 'color 0.15s ease' }}>
                      <ChevronLeft size={15} />
                    </button>
                    <button onClick={() => scroll(label, 'right')} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#777')} style={{ background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#777', transition: 'color 0.15s ease' }}>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </div>

              {/* Cards */}
              <div ref={el => { rowRefs.current[label] = el; }} style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingLeft: isMobile ? '20px' : '48px', paddingRight: isMobile ? '20px' : '48px', paddingTop: '12px', paddingBottom: '16px', scrollbarWidth: 'none' }}>
                {years.map(({ year, theme, fact, tag, tagColor, tagBg }: any) => {
                  const isOpen = expandedYear === year;
                  return (
                    <div
                      key={year}
                      onClick={() => handleCardClick(year)}
                      style={{
                        flexShrink: 0, width: isMobile ? '170px' : '220px',
                        background: isOpen ? '#141414' : '#0d0d0d',
                        border: `0.5px solid ${isOpen ? '#fb923c' : '#1a1a1a'}`,
                        borderRadius: '16px', padding: '24px 22px',
                        cursor: 'pointer', position: 'relative',
                        transition: 'transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        if (!isOpen) {
                          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.02)';
                          (e.currentTarget as HTMLElement).style.borderColor = '#333';
                          (e.currentTarget as HTMLElement).style.background = '#111';
                        }
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'none';
                        (e.currentTarget as HTMLElement).style.borderColor = isOpen ? '#fb923c' : '#1a1a1a';
                        (e.currentTarget as HTMLElement).style.background = isOpen ? '#141414' : '#0d0d0d';
                      }}
                    >
                      {tag && (
                        <div style={{ display: 'inline-block', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '100px', background: tagBg, color: tagColor, marginBottom: '16px' }}>{tag}</div>
                      )}
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '48px', fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: '8px' }}>{year}</div>
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '12px', lineHeight: 1.4 }}>{theme}</div>
                      <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.6, margin: 0 }}>{fact}</p>
                    </div>
                  );
                })}
              </div>

              {/* Expansion panel — renders below this row if it contains the active year */}
              <ExpansionPanel
                year={expandedYear ?? 0}
                data={expandedYear ? yearData[expandedYear] : undefined}
                visible={activeInRow && expandedYear !== null}
                navigate={navigate}
              />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '32px 24px' : '40px 48px',
        borderTop: '0.5px solid #1a1a1a',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between', gap: isMobile ? '16px' : '0',
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '18px', fontWeight: 300 }}>MetAI</div>
        <div style={{ fontSize: '12px', color: '#333' }}>© 2026 MetAI. Fashion criticism, powered by AI.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: '12px', color: '#555', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
