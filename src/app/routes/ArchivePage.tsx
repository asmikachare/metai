import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Nav } from '../components/Nav';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Swap src for real images when ready — these are placeholder gradients
const CARDS = [
  { year: '2019', label: 'Camp: Notes on Fashion', src: null, gradient: 'linear-gradient(145deg,#7c3aed,#db2777,#f97316)' },
  { year: '2018', label: 'Heavenly Bodies', src: null, gradient: 'linear-gradient(145deg,#1e1b4b,#4c1d95,#7c3aed)' },
  { year: '2016', label: 'Manus x Machina', src: null, gradient: 'linear-gradient(145deg,#0f172a,#1e293b,#475569)' },
  { year: '2015', label: 'China: Through the Looking Glass', src: null, gradient: 'linear-gradient(145deg,#7f1d1d,#b91c1c,#fca5a5)' },
  { year: '2013', label: 'PUNK: Chaos to Couture', src: null, gradient: 'linear-gradient(145deg,#111,#1c1917,#78716c)' },
  { year: '2011', label: 'Alexander McQueen: Savage Beauty', src: null, gradient: 'linear-gradient(145deg,#064e3b,#065f46,#6ee7b7)' },
];


// ─── Stacked card swiper ─────────────────────────────────────────────────────

function CardSwiper() {
  const [idx, setIdx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [entering, setEntering] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const canNext = idx < CARDS.length - 1;
  const canPrev = idx > 0;

  const goNext = () => {
    if (exiting || !canNext) return;
    setExiting(true);
    setTimeout(() => {
      setIdx(i => i + 1);
      setExiting(false);
    }, 380);
  };

  const goPrev = () => {
    if (exiting || !canPrev) return;
    setEntering(true);
    setTimeout(() => {
      setIdx(i => i - 1);
      setEntering(false);
    }, 220);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) goNext();
    else if (dx > 40) goPrev();
    touchStartX.current = null;
  };

  // The 3 cards we render: front (idx), idx+1, idx+2
  const visibleCount = Math.min(3, CARDS.length - idx);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
      {/* Card stack */}
      <div
        style={{ position: 'relative', width: '320px', height: '400px', cursor: canNext ? 'pointer' : 'default' }}
        onClick={goNext}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {Array.from({ length: visibleCount }).map((_, stackPos) => {
          const card = CARDS[idx + stackPos];
          const isFront = stackPos === 0;

          // Base stack offsets (back cards peek behind and to the right)
          const baseTransforms = [
            { x: 0,   y: 0,  rot: 0,  scale: 1.00 },
            { x: 14,  y: 8,  rot: 2,  scale: 0.96 },
            { x: 24,  y: 14, rot: 4,  scale: 0.92 },
          ];
          const { x, y, rot, scale } = baseTransforms[stackPos];

          let transform = `translateX(${x}px) translateY(${y}px) rotate(${rot}deg) scale(${scale})`;
          let opacity = 1 - stackPos * 0.12;
          let transition = 'transform 0.38s cubic-bezier(0.23,1,0.32,1), opacity 0.38s ease';

          // Front card exit animation
          if (isFront && exiting) {
            transform = `translateX(-110%) translateY(-24px) rotate(-12deg) scale(0.88)`;
            opacity = 0;
          }

          // Non-front cards shift forward when front is exiting
          if (!isFront && exiting) {
            const next = baseTransforms[stackPos - 1];
            transform = `translateX(${next.x}px) translateY(${next.y}px) rotate(${next.rot}deg) scale(${next.scale})`;
            opacity = 1 - (stackPos - 1) * 0.12;
          }

          return (
            <div
              key={idx + stackPos}
              style={{
                position: 'absolute', inset: 0,
                zIndex: 10 - stackPos,
                borderRadius: '20px',
                overflow: 'hidden',
                transform, opacity, transition,
                boxShadow: isFront ? '0 24px 60px rgba(0,0,0,0.7)' : '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              {card.src ? (
                <img src={card.src} alt={card.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: card.gradient, position: 'relative' }}>
                  {isFront && (
                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                      <div style={{ fontSize: '11px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        {card.label}
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '52px', fontWeight: 300, color: '#fff', lineHeight: 1 }}>
                        {card.year}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Tap hint on front card */}
        {canNext && !exiting && (
          <div style={{
            position: 'absolute', top: '18px', right: '18px', zIndex: 20,
            fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
          }}>
            tap →
          </div>
        )}
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {CARDS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === idx ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === idx ? '#fff' : '#333',
              transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
              cursor: 'pointer',
            }}
            onClick={e => { e.stopPropagation(); if (i < idx) goPrev(); else if (i > idx) goNext(); }}
          />
        ))}
      </div>

      {/* Back button — only shows after advancing */}
      {canPrev && (
        <button
          onClick={e => { e.stopPropagation(); goPrev(); }}
          style={{
            fontSize: '12px', color: '#555', background: 'transparent',
            border: 'none', cursor: 'pointer', letterSpacing: '0.08em',
          }}
        >
          ← back
        </button>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function ArchivePage() {
  const navigate = useNavigate();


  return (
    <div style={{ background: '#080808', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", color: '#fff' }}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <Nav back={{ to: "/explore" }} />

      {/* Hero — two column */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '80px', alignItems: 'center',
        padding: '100px 80px', minHeight: '88vh',
        borderBottom: '0.5px solid #1a1a1a',
        maxWidth: '1200px', margin: '0 auto',
      }}>
        {/* Left — text */}
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.22em', color: '#666', textTransform: 'uppercase', marginBottom: '28px' }}>
            Looking back
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(40px,5vw,72px)', fontWeight: 300,
            lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: '28px',
          }}>
            78 years. Pick one<br />and start<br /><em style={{ color: '#fb923c', fontStyle: 'italic' }}>deconstructing.</em>
          </h1>
          <p style={{ fontSize: '15px', color: '#777', lineHeight: 1.8, maxWidth: '420px', marginBottom: '16px' }}>
            The Met Gala began in 1948 as a fundraising dinner for the Costume Institute. For decades it was a quiet industry event. Then Anna Wintour took over in 1995 and turned it into the most photographed night in fashion.
          </p>
          <p style={{ fontSize: '15px', color: '#777', lineHeight: 1.8, maxWidth: '420px', marginBottom: '40px' }}>
            Each year has a theme. Each celebrity makes a choice. Most of them get it wrong. We score all of it.
          </p>
          <button
            onClick={() => navigate('/analyze')}
            style={{ fontSize: '14px', color: '#080808', background: '#fff', padding: '14px 32px', borderRadius: '100px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}
          >
            Analyze a look →
          </button>
        </div>

        {/* Right — card swiper */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CardSwiper />
        </div>
      </section>

      {/* Netflix-style year rows */}
      <div style={{ padding: '80px 0 120px' }}>

        {[
          {
            label: 'Recent · 2020s',
            years: [
              { year: '2026', theme: 'Fashion as Art', fact: 'The first time AI started judging the judges.', tag: 'Live', tagColor: '#fb923c', tagBg: 'rgba(251,146,60,0.12)' },
              { year: '2025', theme: 'Superfine: Tailoring Black Style', fact: 'A love letter to Black dandyism. Long overdue.' },
              { year: '2024', theme: 'The Garden of Time', fact: 'Florals interpreted literally. Again.' },
              { year: '2023', theme: 'Karl Lagerfeld: A Line of Beauty', fact: 'Honoring a legend. Half the room wore Chanel.' },
              { year: '2022', theme: 'In America: An Anthology', fact: 'Part two of America\'s identity crisis. Still unresolved.' },
              { year: '2021', theme: 'In America: A Lexicon', fact: 'Post-pandemic return. The fashion was hungry.' },
            ],
          },
          {
            label: 'The iconic era · 2010s',
            showArrows: true,
            years: [
              { year: '2019', theme: 'Camp: Notes on Fashion', fact: 'The most memed Met in history. Drag. Kitsch. Chaos.' },
              { year: '2018', theme: 'Heavenly Bodies', fact: 'Most attended ever. Religion meets runway.' },
              { year: '2017', theme: 'Rei Kawakubo / Comme des Garçons', fact: 'Fashion\'s most cerebral designer finally gets her moment.' },
              { year: '2016', theme: 'Manus x Machina', fact: 'Technology vs. craft. Most didn\'t get the memo.' },
              { year: '2015', theme: 'China: Through the Looking Glass', fact: 'The most controversial theme. The most gorgeous exhibition.' },
              { year: '2014', theme: 'Charles James: Beyond Fashion', fact: 'The ballgown as architecture. And Kim K was pregnant.' },
              { year: '2013', theme: 'PUNK: Chaos to Couture', fact: 'The year everyone wore leather and safety pins wrong.' },
              { year: '2012', theme: 'Schiaparelli and Prada', fact: 'Two designers, one show. Fashion\'s ultimate odd couple.' },
              { year: '2011', theme: 'Alexander McQueen: Savage Beauty', fact: 'In memory of Lee. The most emotional Met ever.' },
              { year: '2010', theme: 'American Woman', fact: 'Lady Gaga\'s first Met. Enough said.' },
            ],
          },
          {
            label: 'Archive · Before 2010',
            years: [
              { year: '2009', theme: 'The Model as Muse', fact: 'Supermodels were the theme. Naturally they all showed up.' },
              { year: '2008', theme: 'Superheroes: Fashion and Fantasy', fact: 'Iron Man came out this year. The fashion was less heroic.' },
              { year: '2007', theme: 'Poiret: King of Fashion', fact: 'The designer who freed women from corsets, remembered.' },
              { year: '2006', theme: 'AngloMania', fact: 'Britain takes over the Met. Tea not included.' },
              { year: '2005', theme: 'The House of Chanel', fact: 'Chanel as museum piece. Karl was very much alive.' },
              { year: '2004', theme: 'Dangerous Liaisons', fact: 'Costume drama energy. The most theatrical Met of the decade.' },
            ],
          },
        ].map(({ label, years, showArrows }: any) => {
          const rowRef = useRef<HTMLDivElement>(null);
          const scroll = (dir: 'left' | 'right') => {
            rowRef.current?.scrollBy({ left: dir === 'right' ? 520 : -520, behavior: 'smooth' });
          };
          return (
          <div key={label} style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '48px', paddingRight: '48px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#777', textTransform: 'uppercase' }}>
                {label}
              </div>
              {showArrows && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => scroll('left')} onMouseEnter={e => (e.currentTarget.style.color='#fff')} onMouseLeave={e => (e.currentTarget.style.color='#777')} style={{ background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#777', transition: 'color 0.15s ease' }}>
                    <ChevronLeft size={15} />
                  </button>
                  <button onClick={() => scroll('right')} onMouseEnter={e => (e.currentTarget.style.color='#fff')} onMouseLeave={e => (e.currentTarget.style.color='#777')} style={{ background: '#141414', border: '0.5px solid #2a2a2a', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#777', transition: 'color 0.15s ease' }}>
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>
            <div ref={rowRef} style={{
              display: 'flex', gap: '14px',
              overflowX: 'auto', paddingLeft: '48px', paddingRight: '48px', paddingTop: '12px', paddingBottom: '16px',
              scrollbarWidth: 'none',
            }}>
              {years.map(({ year, theme, fact, tag, tagColor, tagBg }: any) => (
                <div
                  key={year}
                  onClick={() => navigate('/analyze')}
                  style={{
                    flexShrink: 0, width: '220px',
                    background: '#0d0d0d', border: '0.5px solid #1a1a1a',
                    borderRadius: '16px', padding: '24px 22px',
                    cursor: 'pointer', position: 'relative',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.02)';
                    (e.currentTarget as HTMLElement).style.borderColor = '#333';
                    (e.currentTarget as HTMLElement).style.background = '#111';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                    (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a';
                    (e.currentTarget as HTMLElement).style.background = '#0d0d0d';
                  }}
                >
                  {tag && (
                    <div style={{
                      display: 'inline-block', fontSize: '9px', letterSpacing: '0.16em',
                      textTransform: 'uppercase', padding: '3px 9px', borderRadius: '100px',
                      background: tagBg, color: tagColor, marginBottom: '16px',
                    }}>
                      {tag}
                    </div>
                  )}
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '48px', fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: '8px' }}>
                    {year}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '12px', lineHeight: 1.4 }}>{theme}</div>
                  <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.6, margin: 0 }}>{fact}</p>
                </div>
              ))}
            </div>
          </div>
        )})}
      </div>

      {/* Footer */}
      <footer style={{ padding: '40px 48px', borderTop: '0.5px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
