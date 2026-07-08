import { useNavigate } from "react-router";
import { Nav } from "../components/Nav";
import { useIsMobile } from "../../hooks/useIsMobile";


export function ExplorePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const scrollToHow = () => {
    document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#080808', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", color: '#fff' }}>
      <style>{`
        .year-card { transition: background 0.2s, border-color 0.2s, transform 0.2s; }
        .year-card:hover { background: #111 !important; border-color: #666 !important; transform: translateY(-2px); }
        .iconic-chip { transition: background 0.15s, border-color 0.15s; }
        .iconic-chip:hover { background: #141414 !important; border-color: #555 !important; }
        .archive-pill { transition: background 0.15s, color 0.15s; }
        .archive-pill:hover { background: #2a2a2a !important; color: #888 !important; }
      `}</style>

      <Nav />

      {/* Hero */}
      <section style={{
        minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '0 24px' : '0 48px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '680px' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(36px,8vw,88px)', fontWeight: 300,
            lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: '24px',
          }}>
            From red carpet<br />to verdict in<br /><em style={{ color: '#fb923c', fontStyle: 'italic' }}>seconds.</em>
          </h1>
          <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto 40px' }}>
            Drop any Met Gala look. We score it against the year's theme, critique it like a fashion editor, and tell you what they should've worn instead.
          </p>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/analyze')}
              style={{ fontSize: '14px', color: '#080808', background: '#fff', padding: '14px 32px', borderRadius: '100px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', width: isMobile ? '100%' : 'auto' }}
            >
              Analyze a look →
            </button>
            <button
              onClick={scrollToHow}
              style={{ fontSize: '14px', color: '#fff', background: 'transparent', padding: '14px 32px', borderRadius: '100px', border: '0.5px solid #2a2a2a', cursor: 'pointer', letterSpacing: '0.04em', width: isMobile ? '100%' : 'auto' }}
            >
              How it works
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)' }}>
        {[
          { num: '47', label: 'Looks analyzed — 2026' },
          { num: '12', label: 'Looks scored on-theme' },
          { num: '78', label: 'Years of Met Gala history' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: isMobile ? '24px 24px' : '36px 48px',
            borderRight: !isMobile && i < 2 ? '0.5px solid #2a2a2a' : 'none',
            borderBottom: isMobile && i < 2 ? '0.5px solid #2a2a2a' : 'none',
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '52px', fontWeight: 300, lineHeight: 1, marginBottom: '8px', color: '#fb923c' }}>{s.num}</div>
            <div style={{ fontSize: '13px', color: '#888', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Archive — teaser */}
      <div id="archive" style={{ padding: isMobile ? '60px 24px' : '100px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ overflow: 'hidden', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '52px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', letterSpacing: '0.22em', color: '#666', textTransform: 'uppercase', marginBottom: '16px' }}>The archive</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,56px)', fontWeight: 300, lineHeight: 1.1, margin: 0 }}>
                78 years. Pick one<br />and start scoring.
              </h2>
            </div>
            <button
              onClick={() => navigate('/archive')}
              style={{ fontSize: '13px', color: '#fff', background: 'transparent', padding: '12px 24px', borderRadius: '100px', border: '0.5px solid #2a2a2a', cursor: 'pointer', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}
            >
              The archive →
            </button>
          </div>

          {/* 3 featured year cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr 1fr', gap: '12px' }}>
            {[
              { year: '2026', theme: 'Fashion as Art', desc: 'Live now. Score looks in real time as the season unfolds.', tag: 'Live', tagColor: '#fb923c', tagBg: 'rgba(251,146,60,0.1)', active: true },
              { year: '2019', theme: 'Camp: Notes on Fashion', desc: 'The most memed Met ever. Drag, kitsch, maximalism — and very few people got it right.', tag: 'Iconic', tagColor: '#c084fc', tagBg: 'rgba(192,132,252,0.1)', active: false },
              { year: '2018', theme: 'Heavenly Bodies', desc: 'Religion meets runway. The most-attended Met in history and some of the most debated looks ever.', tag: 'Iconic', tagColor: '#c084fc', tagBg: 'rgba(192,132,252,0.1)', active: false },
            ].map((card) => (
              <div
                key={card.year}
                className="year-card"
                onClick={() => card.active ? navigate('/analyze') : navigate('/archive')}
                style={{
                  background: '#0d0d0d', border: `0.5px solid ${card.active ? '#2a2a2a' : '#2a2a2a'}`,
                  borderRadius: '20px', padding: '32px', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden', minHeight: '200px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}
              >
                <div style={{
                  display: 'inline-flex', alignSelf: 'flex-start',
                  fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase',
                  padding: '4px 10px', borderRadius: '100px', marginBottom: '24px',
                  background: card.tagBg, color: card.tagColor,
                }}>
                  {card.tag}
                </div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '56px', fontWeight: 300, color: card.active ? '#fff' : '#aaa', lineHeight: 1, marginBottom: '8px' }}>
                    {card.year}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px', letterSpacing: '0.02em' }}>{card.theme}</div>
                  <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
          </div>{/* end overflow:hidden card wrapper */}

          {/* Scrollable year strip */}
          <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
              {[2025,2024,2023,2022,2021,2017,2016,2015,2014,2013,2012,2011,2010,'2000s','1990s','1980s','1970s','History'].map(y => (
                <button
                  key={y}
                  className="archive-pill"
                  onClick={() => navigate('/archive')}
                  style={{
                    fontSize: '13px', color: '#777',
                    background: '#0d0d0d', border: '0.5px solid #2a2a2a',
                    padding: '9px 18px', borderRadius: '100px', cursor: 'pointer',
                    letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="how" style={{ padding: isMobile ? '60px 24px' : '100px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase', marginBottom: '20px' }}>How it works</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,4vw,60px)', fontWeight: 300, lineHeight: 1.15, marginBottom: '60px', maxWidth: '560px' }}>
          From red carpet to verdict in seconds.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: '1px', background: '#2a2a2a', border: '0.5px solid #2a2a2a' }}>
          {[
            { num: '01', title: 'Drop or search', desc: 'Upload a screenshot or type any celebrity name. We find the look automatically.' },
            { num: '02', title: 'We pull the look', desc: 'Our AI searches the internet for their exact outfit — brand, designer, every detail.' },
            { num: '03', title: 'Score & critique', desc: 'The look is scored 0–10 against the year\'s theme with a full fashion critique.' },
            { num: '04', title: 'See the alternative', desc: 'We surface real archive pieces and emerging brands that would have nailed the theme.' },
          ].map((step, i) => (
            <div key={i} style={{ background: '#080808', padding: isMobile ? '24px' : '36px 32px' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '48px', fontWeight: 300, color: '#333', lineHeight: 1, marginBottom: '20px' }}>{step.num}</div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '10px' }}>{step.title}</div>
              <div style={{ fontSize: '13px', color: '#999', lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2026 Scoreboard */}
      <div id="scoreboard" style={{ padding: isMobile ? '60px 24px' : '100px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase', marginBottom: '20px' }}>2026 scoreboard preview</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,4vw,60px)', fontWeight: 300, lineHeight: 1.15, marginBottom: '40px', maxWidth: '560px' }}>
            Who actually got it right.
          </h2>
          {[
            { num: '9.2', color: '#4ade80', name: 'Lisa (BLACKPINK)', detail: '3D-printed headgear and hand elements — wearable sculpture at its finest', badge: 'On Theme', badgeBg: 'rgba(74,222,128,0.1)', badgeColor: '#4ade80' },
            { num: '8.1', color: '#4ade80', name: 'Kim Petras', detail: 'Mirror dress with film roll motif — cinema as art, fashion as cultural reflection', badge: 'On Theme', badgeBg: 'rgba(74,222,128,0.1)', badgeColor: '#4ade80' },
            { num: '6.4', color: '#fb923c', name: 'Kim Kardashian', detail: 'Committed to an aesthetic. Concept present, execution could go further.', badge: 'Partial', badgeBg: 'rgba(251,146,60,0.1)', badgeColor: '#fb923c' },
            { num: '4.1', color: '#f87171', name: 'Jennie (BLACKPINK) — Chanel', detail: 'Gorgeous gown. Reads as campaign look. Beautiful fashion, not art.', badge: 'Off Theme', badgeBg: 'rgba(248,113,113,0.1)', badgeColor: '#f87171' },
            { num: '2.3', color: '#f87171', name: 'Kendall Jenner — Gap', detail: 'Gap is a commercial brand. This belongs at a brand launch, not the Met.', badge: 'Miss', badgeBg: 'rgba(248,113,113,0.1)', badgeColor: '#f87171' },
          ].map((score, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px', padding: '20px 0', borderBottom: '0.5px solid #111', ...(i === 0 && { borderTop: '0.5px solid #111' }) }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', fontWeight: 300, minWidth: '52px', flexShrink: 0, color: score.color }}>{score.num}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>{score.name}</div>
                <div style={{ fontSize: '13px', color: '#999' }}>{score.detail}</div>
              </div>
              <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.06em', background: score.badgeBg, color: score.badgeColor, flexShrink: 0 }}>{score.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div style={{ padding: isMobile ? '60px 24px' : '100px 48px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(26px,3.5vw,48px)', fontWeight: 300, fontStyle: 'italic', color: '#fff', maxWidth: '760px', margin: '0 auto 24px', lineHeight: 1.35 }}>
          "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street — fashion has to do with ideas."
        </p>
        <div style={{ fontSize: '13px', color: '#888', letterSpacing: '0.08em' }}>— Coco Chanel</div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '32px 24px' : '40px 48px',
        borderTop: '0.5px solid #2a2a2a',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between', gap: isMobile ? '16px' : '0',
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '18px', fontWeight: 300 }}>MetAI</div>
        <div style={{ fontSize: '12px', color: '#555' }}>© 2026 MetAI. Fashion criticism, powered by AI.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="https://asmikachare.vercel.app" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
