import { useState, useRef, DragEvent } from 'react';
import { Search, Upload, ChevronDown } from 'lucide-react';
import { Nav } from '../components/Nav';
import { useSearchParams } from 'react-router';
import type { LookAnalysis, ArtReference, SearchImage } from '../../types';
import { MET_YEARS } from '../data/metYears';
import { useIsMobile } from '../../hooks/useIsMobile';

// ─── helpers ────────────────────────────────────────────────────────────────

const scoreColor = (s: number) =>
  s >= 7.5 ? '#4ade80' : s >= 5 ? '#fb923c' : '#f87171';

const verdictColor = (verdict: string): string => {
  if (verdict === 'On Theme')  return '#4ade80';
  if (verdict === 'Partial')   return '#fb923c';
  if (verdict === 'Off Theme') return '#d97706';
  return '#ef4444'; // Miss
};

const verdictStyle: Record<string, { bg: string; color: string }> = {
  'On Theme':  { bg: 'rgba(74,222,128,0.12)',  color: '#4ade80' },
  'Partial':   { bg: 'rgba(251,146,60,0.12)',  color: '#fb923c' },
  'Off Theme': { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
  'Miss':      { bg: 'rgba(248,113,113,0.08)', color: '#ef4444' },
};

// ─── score wheel ─────────────────────────────────────────────────────────────

function ScoreWheel({ score, verdict }: { score: number; verdict: string }) {
  const color = verdictColor(verdict);
  const r = 46, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 10);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a1a" strokeWidth="5" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.23,1,0.32,1)' }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontFamily="'Cormorant Garamond',serif" fontSize="30" fontWeight="300">
        {score % 1 === 0 ? score : score.toFixed(1)}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle"
        fill="#555" fontFamily="'DM Sans',sans-serif" fontSize="10" letterSpacing="0.06em">
        /10
      </text>
    </svg>
  );
}


function PillarBar({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>{label}</span>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '18px', fontWeight: 300, color }}>{value}</span>
      </div>
      <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value * 10}%`, background: color, borderRadius: '1px', transition: 'width 1s cubic-bezier(0.23,1,0.32,1)' }} />
      </div>
    </div>
  );
}

// ─── results ─────────────────────────────────────────────────────────────────

function RefChip({ ref: r }: { ref: ArtReference }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        background: open ? '#161616' : '#0d0d0d',
        border: `0.5px solid ${open ? '#333' : '#1a1a1a'}`,
        borderRadius: '10px', padding: '10px 14px', cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <span style={{ fontSize: '12px', color: '#ccc', letterSpacing: '0.02em' }}>{r.name}</span>
        <ChevronDown size={12} style={{ color: '#555', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      {open && (
        <p style={{ fontSize: '12px', color: '#777', lineHeight: 1.65, marginTop: '8px', marginBottom: 0 }}>
          {r.plain_english}
        </p>
      )}
    </div>
  );
}

function AnalysisResults({
  analysis, imageUrl, name, onReset,
}: {
  analysis: LookAnalysis; imageUrl: string; name?: string; onReset: () => void;
}) {
  const vs = verdictStyle[analysis.verdict] ?? verdictStyle['Miss'];
  const color = verdictColor(analysis.verdict);
  const isMobile = useIsMobile();

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: isMobile ? '32px 20px' : '60px 48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 3fr', gap: isMobile ? '32px' : '52px', alignItems: 'start' }}>

        {/* Image */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#111', height: isMobile ? '280px' : undefined, aspectRatio: isMobile ? undefined : '2/3', position: isMobile ? 'relative' : 'sticky', top: isMobile ? undefined : '100px' }}>
          <img src={imageUrl} alt={name ?? 'Met Gala look'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Score + verdict + identity */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <ScoreWheel score={analysis.score} verdict={analysis.verdict} />
            <div style={{ paddingTop: '6px', minWidth: 0, flex: 1 }}>
              <span style={{
                display: 'inline-block', fontSize: '10px', letterSpacing: '0.16em',
                textTransform: 'uppercase', padding: '4px 12px', borderRadius: '100px',
                marginBottom: '12px', background: vs.bg, color: vs.color,
              }}>
                {analysis.verdict}
              </span>
              {name && (
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? '22px' : '28px', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '5px' }}>
                  {name}
                </div>
              )}
              {analysis.brand && analysis.brand !== 'Unknown' && (
                <div style={{ fontSize: '13px', color: '#bbb', marginBottom: analysis.house_context ? '4px' : '5px' }}>{analysis.brand}</div>
              )}
              {analysis.house_context && (
                <div style={{ fontSize: '12px', color: '#555', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '5px', maxWidth: '260px' }}>
                  {analysis.house_context}
                </div>
              )}
              {(analysis.creative_director || analysis.artist) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
                  {analysis.creative_director && (
                    <div style={{ fontSize: '12px', color: '#555' }}>
                      <span style={{ color: '#333', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>CD </span>
                      {analysis.creative_director}
                    </div>
                  )}
                  {analysis.artist && (
                    <div style={{ fontSize: '12px', color: '#555' }}>
                      <span style={{ color: '#333', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Artist </span>
                      {analysis.artist}
                    </div>
                  )}
                </div>
              )}
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.1em' }}>
                {analysis.met_year ?? 2026} Met Gala&nbsp;·&nbsp;{analysis.met_theme ?? 'Fashion as Art'}
              </div>
            </div>
          </div>

          {/* Verdict line — big editorial pull quote */}
          <div style={{ borderLeft: `2px solid ${color}`, paddingLeft: '20px' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(20px,2.4vw,28px)', fontWeight: 300, fontStyle: 'italic',
              color: '#fff', lineHeight: 1.35, margin: 0,
            }}>
              "{analysis.verdict_line}"
            </p>
          </div>

          {/* Pillar breakdown */}
          {analysis.pillars && (
            <div>
              <div style={labelStyle}>Theme pillars</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
                {Object.entries(analysis.pillars).map(([key, val]) => (
                  <PillarBar key={key} label={analysis.pillar_labels?.[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} value={val as number} />
                ))}
              </div>
            </div>
          )}

          {/* The look */}
          <div>
            <div style={labelStyle}>The look</div>
            <p style={bodyStyle}>{analysis.look_description}</p>
          </div>

          {/* Plain English — for fashion lovers still learning */}
          {analysis.plain_english && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid #1e1e1e', borderRadius: '12px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>In plain english</span>
              </div>
              <p style={{ ...bodyStyle, color: '#bbb', margin: 0 }}>{analysis.plain_english}</p>
            </div>
          )}

          {/* Critique */}
          <div>
            <div style={labelStyle}>Expert critique</div>
            <p style={bodyStyle}>{analysis.critique}</p>
          </div>

          {/* Art references — expandable chips */}
          {analysis.art_references && analysis.art_references.length > 0 && (
            <div>
              <div style={labelStyle}>References explained</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                {analysis.art_references.map((r, i) => (
                  <RefChip key={i} ref={r} />
                ))}
              </div>
            </div>
          )}

          {/* Standout element */}
          <div style={{ background: '#0d0d0d', border: '0.5px solid #1a1a1a', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={labelStyle}>Standout element</div>
            <p style={{ ...bodyStyle, marginTop: 6 }}>{analysis.standout_element}</p>
          </div>

          {/* What we wish they wore */}
          <div style={{ background: 'rgba(251,146,60,0.06)', border: '0.5px solid rgba(251,146,60,0.18)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ ...labelStyle, color: '#fb923c' }}>What we wish they wore</div>
            <p style={{ ...bodyStyle, marginTop: 8, color: '#ccc' }}>{analysis.what_they_should_have_worn}</p>
          </div>

          <button onClick={onReset} style={{
            alignSelf: 'flex-start', fontSize: '13px', color: '#555',
            background: 'transparent', border: '0.5px solid #1a1a1a',
            padding: '10px 24px', borderRadius: '100px', cursor: 'pointer', letterSpacing: '0.04em',
          }}>
            Try another look
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444', marginBottom: '8px',
};
const bodyStyle: React.CSSProperties = {
  fontSize: '14px', color: '#888', lineHeight: 1.8,
};

// ─── main page ───────────────────────────────────────────────────────────────

type Phase = 'idle' | 'searching' | 'analyzing' | 'done' | 'error';

export function AnalyzePage() {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const yearFromUrl = parseInt(searchParams.get('year') ?? '2026');
  const [tab, setTab]               = useState<'search' | 'upload'>('search');
  const [selectedYear, setYear]     = useState(isNaN(yearFromUrl) ? 2026 : yearFromUrl);
  const [query, setQuery]           = useState('');
  const [images, setImages]         = useState<SearchImage[]>([]);
  const [selected, setSelected]     = useState<string | null>(null);
  const [selectedThumb, setSelThumb] = useState<string | null>(null);
  const [uploadPreview, setPreview] = useState<string | null>(null);
  const [uploadData, setUpload]     = useState<{ base64: string; mediaType: string } | null>(null);
  const [dragging, setDragging]     = useState(false);
  const [phase, setPhase]           = useState<Phase>('idle');
  const [analysis, setAnalysis]         = useState<LookAnalysis | null>(null);
  const [resultImage, setResultImg]     = useState<string | null>(null);
  const [errorMsg, setError]            = useState('');
  const [suggestedYears, setSuggested]  = useState<number[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentMetYear = MET_YEARS.find(y => y.year === selectedYear) ?? MET_YEARS[0];

  const reset = () => {
    setPhase('idle'); setAnalysis(null); setImages([]); setSelected(null); setSelThumb(null);
    setPreview(null); setUpload(null); setQuery(''); setError(''); setSuggested([]);
  };

  const switchTab = (t: 'search' | 'upload') => { setTab(t); reset(); };
  const switchYear = (y: number) => { setYear(y); reset(); };

  // ── search ─────────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!query.trim()) return;
    setPhase('searching'); setImages([]); setSelected(null); setSuggested([]);
    try {
      const res = await fetch('/api/search-look', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: query.trim(), year: selectedYear }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Search failed');

      // Celebrity didn't attend this year
      if (!data.attended && (!data.images || data.images.length === 0)) {
        setSuggested(data.suggestedYears ?? []);
        setPhase('error');
        setError('not_attended');
        return;
      }

      if (!data.images?.length) throw new Error('No images found');
      setImages(data.images);
      setSelected(data.images[0].url);
      setSelThumb(data.images[0].thumbnail || data.images[0].url);
      setPhase('idle');
    } catch (e: any) {
      setPhase('error'); setError(e.message ?? 'Search failed');
    }
  };

  // ── upload ─────────────────────────────────────────────────────────────────
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const [meta, base64] = dataUrl.split(',');
      const mediaType = meta.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
      setPreview(dataUrl);
      setUpload({ base64, mediaType });
      setPhase('idle');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  };

  // ── analyze ────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    setPhase('analyzing');
    const payload = tab === 'search'
      ? { imageUrl: selected!, celebrityName: query, candidateUrls: images.map(i => i.url), year: selectedYear }
      : { imageBase64: uploadData!.base64, mediaType: uploadData!.mediaType, year: selectedYear };

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? 'Analysis failed');
      setAnalysis(data);
      setResultImg(tab === 'search' ? (selectedThumb ?? selected!) : uploadPreview!);
      setPhase('done');
    } catch (e: any) {
      setPhase('error'); setError(e.message ?? 'Analysis failed');
    }
  };

  const canAnalyze = (tab === 'search' ? !!selected : !!uploadData) && phase !== 'analyzing';

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        .meta-input {
          width: 100%; background: #0d0d0d !important; border: 0.5px solid #2a2a2a !important;
          color: #fff !important; border-radius: 12px; height: 52px;
          padding: 0 16px; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .meta-input::placeholder { color: #444; }
        .meta-input:focus { border-color: #555 !important; }
      `}</style>

      <Nav back={{ to: "/explore" }} />

      {/* Results */}
      {phase === 'done' && analysis && resultImage ? (
        <AnalysisResults
          analysis={analysis}
          imageUrl={resultImage}
          name={tab === 'search' ? query : undefined}
          onReset={reset}
        />
      ) : (

        /* Input area */
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: isMobile ? '48px 20px' : '80px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(40px,6vw,68px)', fontWeight: 300,
              color: '#fff', lineHeight: 1.1, marginBottom: '14px',
            }}>
              Analyze a look
            </h1>
            <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.7, marginBottom: '32px' }}>
              Scored against the year's theme. No mercy.
            </p>

            {/* Year selector */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#555', textTransform: 'uppercase', marginBottom: '12px' }}>
                Select a year
              </div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', justifyContent: 'center', flexWrap: 'wrap' }}>
                {MET_YEARS.map(({ year, theme }) => (
                  <button
                    key={year}
                    onClick={() => switchYear(year)}
                    style={{
                      fontSize: '13px', padding: '8px 16px', borderRadius: '100px',
                      border: `0.5px solid ${selectedYear === year ? '#fff' : '#2a2a2a'}`,
                      background: selectedYear === year ? '#fff' : 'transparent',
                      color: selectedYear === year ? '#080808' : '#666',
                      cursor: 'pointer', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '10px', fontStyle: 'italic' }}>
                {currentMetYear.theme}
              </div>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', gap: '6px', marginBottom: '32px',
            background: '#0d0d0d', padding: '5px', borderRadius: '12px', border: '0.5px solid #1a1a1a',
          }}>
            {(['search', 'upload'] as const).map(t => (
              <button key={t} onClick={() => switchTab(t)} style={{
                flex: 1, padding: '11px 20px', fontSize: '13px', borderRadius: '8px',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#080808' : '#555',
              }}>
                {t === 'search' ? <><Search size={14} />Search by name</> : <><Upload size={14} />Drop a photo</>}
              </button>
            ))}
          </div>

          {/* ── Search tab ─────────────────────────────────────── */}
          {tab === 'search' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <input
                  className="meta-input"
                  placeholder="e.g. Zendaya, Lisa BLACKPINK, Rihanna"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  disabled={phase === 'searching'}
                />
                <button
                  onClick={handleSearch}
                  disabled={!query.trim() || phase === 'searching'}
                  style={{
                    padding: '0 22px',
                    background: !query.trim() || phase === 'searching' ? '#111' : '#fff',
                    color: !query.trim() || phase === 'searching' ? '#555' : '#080808',
                    border: !query.trim() || phase === 'searching' ? '0.5px solid #1a1a1a' : 'none',
                    borderRadius: '12px', cursor: 'pointer',
                    fontSize: '13px', letterSpacing: '0.04em', flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {phase === 'searching' ? 'Finding...' : 'Find'}
                </button>
              </div>

              {images.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Select the right photo
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(5,1fr)', gap: '8px' }}>
                    {images.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => { setSelected(img.url); setSelThumb(img.thumbnail || img.url); }}
                        style={{
                          borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                          aspectRatio: '2/3', background: '#111',
                          border: `2px solid ${selected === img.url ? '#fff' : 'transparent'}`,
                          transition: 'border-color 0.15s',
                        }}
                      >
                        <img
                          src={img.thumbnail || img.url}
                          alt={img.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Upload tab ─────────────────────────────────────── */}
          {tab === 'upload' && (
            <div
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `1.5px dashed ${dragging ? '#666' : '#222'}`,
                borderRadius: '16px', padding: '64px 40px', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: '28px',
                background: dragging ? '#0d0d0d' : 'transparent',
              }}
            >
              <input
                ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {uploadPreview ? (
                <>
                  <img src={uploadPreview} alt="preview" style={{ maxHeight: '280px', borderRadius: '10px', marginBottom: '14px', maxWidth: '100%' }} />
                  <div style={{ fontSize: '12px', color: '#444' }}>Click to change</div>
                </>
              ) : (
                <>
                  <Upload size={36} style={{ color: '#222', margin: '0 auto 16px' }} />
                  <div style={{ fontSize: '15px', color: '#fff', marginBottom: '6px' }}>Drop an image here</div>
                  <div style={{ fontSize: '13px', color: '#444' }}>or click to browse</div>
                </>
              )}
            </div>
          )}

          {/* Error — didn't attend */}
          {phase === 'error' && errorMsg === 'not_attended' && (
            <div style={{
              background: '#0d0d0d', border: '0.5px solid #2a2a2a',
              borderRadius: '16px', padding: '24px', marginBottom: '20px',
            }}>
              <div style={{ fontSize: '15px', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
                Oops — {query} didn't attend the {selectedYear} Met Gala.
              </div>
              <div style={{ fontSize: '13px', color: '#777', marginBottom: '20px' }}>
                Try one of the years they did show up:
              </div>
              {suggestedYears.length > 0 ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {suggestedYears.map(y => (
                    <button
                      key={y}
                      onClick={() => { switchYear(y); setTimeout(() => handleSearch(), 50); }}
                      style={{
                        fontSize: '13px', padding: '8px 18px', borderRadius: '100px',
                        border: '0.5px solid #2a2a2a', background: 'transparent',
                        color: '#fff', cursor: 'pointer', letterSpacing: '0.04em',
                        transition: 'background 0.15s, border-color 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1a1a1a'; (e.currentTarget as HTMLElement).style.borderColor = '#444'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#555' }}>No other years found — try a different name.</div>
              )}
            </div>
          )}

          {/* Error — generic */}
          {phase === 'error' && errorMsg !== 'not_attended' && (
            <div style={{
              background: 'rgba(248,113,113,0.08)', border: '0.5px solid rgba(248,113,113,0.2)',
              borderRadius: '10px', padding: '14px 18px', marginBottom: '20px',
              fontSize: '13px', color: '#f87171',
            }}>
              {errorMsg}
            </div>
          )}

          {/* Analyze button */}
          <div>
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              style={{
                width: '100%', padding: '16px', fontSize: '14px',
                color: canAnalyze && phase !== 'analyzing' ? '#080808' : '#555',
                background: canAnalyze && phase !== 'analyzing' ? '#fff' : 'transparent',
                border: canAnalyze && phase !== 'analyzing' ? 'none' : '0.5px solid #1a1a1a',
                borderRadius: '100px',
                cursor: canAnalyze && phase !== 'analyzing' ? 'pointer' : 'default',
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
                opacity: phase === 'analyzing' ? 0.55 : 1,
              }}
            >
              {phase === 'analyzing' ? 'Analyzing...' : 'Analyze this look →'}
            </button>
            {!canAnalyze && phase !== 'analyzing' && (
              <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#444', textAlign: 'center', marginTop: '12px' }}>
                {tab === 'search' ? 'Select a photo first' : 'Drop a photo first'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
