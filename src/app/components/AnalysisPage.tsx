import { useState } from "react";
import { Upload, Search, ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { CELEBRITY_LOOKS, DESIGNER_ALTERNATIVES } from "../data/mockData";

type Look = typeof CELEBRITY_LOOKS[number];
type Alternatives = typeof DESIGNER_ALTERNATIVES[number];

function getScoreColor(score: number) {
  if (score >= 90) return '#4ade80';
  if (score >= 75) return '#60a5fa';
  if (score >= 60) return '#facc15';
  if (score >= 40) return '#fb923c';
  return '#f87171';
}

function getVerdictBg(score: number) {
  if (score >= 90) return { bg: 'rgba(74,222,128,0.1)', color: '#4ade80' };
  if (score >= 75) return { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa' };
  if (score >= 60) return { bg: 'rgba(250,204,21,0.1)', color: '#facc15' };
  if (score >= 40) return { bg: 'rgba(251,146,60,0.1)', color: '#fb923c' };
  return { bg: 'rgba(248,113,113,0.1)', color: '#f87171' };
}

function matchLook(query: string): Look {
  const q = query.toLowerCase();
  const match = CELEBRITY_LOOKS.find(l =>
    l.celebrity.toLowerCase().includes(q) ||
    l.designer.toLowerCase().includes(q) ||
    (l.group && l.group.toLowerCase().includes(q))
  );
  return match ?? CELEBRITY_LOOKS[3]; // default: Jenny (a "miss" so alternatives show)
}

function ScoreWheel({ score, color }: { score: number; color: string }) {
  const r = 46;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ display: 'block' }}>
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="5"
      />
      {/* Progress arc — starts at top (−90°) */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.23,1,0.32,1)' }}
      />
      {/* Score number */}
      <text
        x={cx} y={cy - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontFamily="'Cormorant Garamond',serif"
        fontSize="30"
        fontWeight="300"
      >
        {score}
      </text>
      {/* /100 label */}
      <text
        x={cx} y={cy + 16}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#555"
        fontFamily="'DM Sans',sans-serif"
        fontSize="10"
        letterSpacing="0.06em"
      >
        /100
      </text>
    </svg>
  );
}

function DimensionBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
        <span style={{ color: '#888' }}>{label}</span>
        <span style={{ color: '#fff' }}>{value}/10</span>
      </div>
      <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${value * 10}%`,
            background: value >= 8 ? '#4ade80' : value >= 6 ? '#fb923c' : '#f87171',
            borderRadius: '2px',
            transition: 'width 0.8s cubic-bezier(0.23,1,0.32,1)'
          }}
        />
      </div>
    </div>
  );
}

function AnalysisResult({
  look,
  alternatives,
  uploadedImage,
  onReset,
}: {
  look: Look;
  alternatives: Alternatives | undefined;
  uploadedImage: string | null;
  onReset: () => void;
}) {
  const scoreColor = getScoreColor(look.score);
  const verdict = getVerdictBg(look.score);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 48px' }}>
      {/* Score hero */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '48px', marginBottom: '60px' }}>
        <div style={{ flexShrink: 0 }}>
          <ScoreWheel score={look.score} color={scoreColor} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-block',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: '100px',
            background: verdict.bg,
            color: verdict.color,
            marginBottom: '14px'
          }}>
            {look.verdict}
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(28px,4vw,44px)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '6px'
          }}>
            {look.celebrity}
            {look.group && <span style={{ color: '#555', fontWeight: 300 }}> — {look.group}</span>}
          </h2>
          <div style={{ fontSize: '14px', color: '#555', letterSpacing: '0.04em' }}>{look.designer}</div>
        </div>
      </div>

      {/* Two-col layout: image + analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '2/3', background: '#111' }}>
          <img
            src={uploadedImage ?? look.imageUrl}
            alt={look.celebrity}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Critique */}
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444', marginBottom: '12px' }}>Critique</div>
            <p style={{ fontSize: '14px', color: '#aaa', lineHeight: 1.75 }}>{look.analysis}</p>
          </div>

          {/* Dimensions */}
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444', marginBottom: '16px' }}>Dimension Scores</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <DimensionBar label="Silhouette" value={look.dimensions.silhouette} />
              <DimensionBar label="Material" value={look.dimensions.material} />
              <DimensionBar label="Artistic Movement" value={look.dimensions.artisticMovement} />
              <DimensionBar label="Conceptual Depth" value={look.dimensions.conceptualDepth} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444', marginBottom: '12px' }}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {look.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '11px',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  border: '0.5px solid #2a2a2a',
                  color: '#666',
                  letterSpacing: '0.04em'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Designer Alternatives */}
      {alternatives && (
        <div style={{ borderTop: '0.5px solid #1a1a1a', paddingTop: '48px', marginBottom: '48px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444', marginBottom: '8px' }}>
            What they should have worn
          </div>
          <h3 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(24px,3vw,36px)',
            fontWeight: 300,
            color: '#fff',
            marginBottom: '32px',
            lineHeight: 1.2
          }}>
            {alternatives.currentDesigner} has archive pieces that nail the brief.
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {alternatives.alternatives.map((alt, i) => (
              <div key={i} style={{
                background: '#0d0d0d',
                border: '0.5px solid #1a1a1a',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', aspectRatio: '2/3' }}>
                  <img
                    src={alt.imageUrl}
                    alt={alt.collection}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(74,222,128,0.9)',
                    color: '#000',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '100px'
                  }}>
                    <TrendingUp size={12} />
                    +{alt.projectedScore - alternatives.currentScore} pts
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '2px' }}>{alt.designer}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>{alt.collection}</div>
                      <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>Look #{alt.lookNumber} · {alt.year}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: '28px',
                        fontWeight: 300,
                        color: '#4ade80',
                        lineHeight: 1
                      }}>
                        {alt.projectedScore}
                      </div>
                      <div style={{ fontSize: '10px', color: '#444' }}>projected</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#777', lineHeight: 1.65 }}>{alt.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        style={{
          fontSize: '13px',
          color: '#666',
          background: 'transparent',
          border: '0.5px solid #1a1a1a',
          padding: '12px 28px',
          borderRadius: '100px',
          cursor: 'pointer',
          letterSpacing: '0.04em'
        }}
      >
        ← Analyze another look
      </button>
    </div>
  );
}

export function AnalysisPage({ onBack }: { onBack: () => void }) {
  const [searchMode, setSearchMode] = useState<'upload' | 'search'>('upload');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ look: Look; alternatives: Alternatives | undefined; uploadedImage: string | null } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFile(url);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const look = matchLook(searchQuery || 'jenny');
      const alternatives = DESIGNER_ALTERNATIVES.find(a => a.celebrity === look.celebrity);
      setResult({ look, alternatives, uploadedImage: searchMode === 'upload' ? selectedFile : null });
      setAnalyzing(false);
    }, 2500);
  };

  const handleReset = () => {
    setResult(null);
    setSearchQuery('');
    setSelectedFile(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'DM Sans',sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '0.5px solid #1a1a1a', background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666', background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
            <ArrowLeft size={16} />
            Back
          </button>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '22px', fontWeight: 300, color: '#fff', letterSpacing: '0.06em' }}>MetAI</div>
        </div>
        <div style={{ fontSize: '13px', color: '#666', letterSpacing: '0.04em' }}>2026 Met Gala · Fashion as Art</div>
      </nav>

      {result ? (
        <AnalysisResult
          look={result.look}
          alternatives={result.alternatives}
          uploadedImage={result.uploadedImage}
          onReset={handleReset}
        />
      ) : (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(44px,6vw,72px)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '16px' }}>
              Analyze a Met Gala look
            </h1>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7 }}>
              Upload a photo or search for any celebrity to score their look against the theme.
            </p>
          </div>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: '#0d0d0d', padding: '6px', borderRadius: '12px', border: '0.5px solid #1a1a1a' }}>
            <button
              onClick={() => setSearchMode('upload')}
              style={{
                flex: 1,
                padding: '12px 24px',
                fontSize: '14px',
                color: searchMode === 'upload' ? '#080808' : '#666',
                background: searchMode === 'upload' ? '#fff' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                letterSpacing: '0.04em'
              }}
            >
              <Upload size={16} />
              Upload photo
            </button>
            <button
              onClick={() => setSearchMode('search')}
              style={{
                flex: 1,
                padding: '12px 24px',
                fontSize: '14px',
                color: searchMode === 'search' ? '#080808' : '#666',
                background: searchMode === 'search' ? '#fff' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                letterSpacing: '0.04em'
              }}
            >
              <Search size={16} />
              Search celebrity
            </button>
          </div>

          {searchMode === 'upload' ? (
            <div>
              <label
                htmlFor="file-upload"
                style={{
                  display: 'block',
                  border: '1.5px dashed #333',
                  borderRadius: '16px',
                  padding: '80px 48px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: selectedFile ? '#0d0d0d' : 'transparent'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.background = '#0d0d0d'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = selectedFile ? '#0d0d0d' : 'transparent'; }}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                {selectedFile ? (
                  <div>
                    <img src={selectedFile} alt="Uploaded look" style={{ maxWidth: '100%', maxHeight: '400px', margin: '0 auto 24px', borderRadius: '12px' }} />
                    <div style={{ fontSize: '14px', color: '#666' }}>Click to change image</div>
                  </div>
                ) : (
                  <div>
                    <Upload size={48} style={{ color: '#333', margin: '0 auto 16px' }} />
                    <div style={{ fontSize: '15px', color: '#fff', marginBottom: '8px' }}>Drop an image here</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>or click to browse</div>
                  </div>
                )}
              </label>
              {selectedFile && (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  style={{
                    width: '100%',
                    marginTop: '24px',
                    padding: '16px 32px',
                    fontSize: '14px',
                    color: '#080808',
                    background: analyzing ? '#555' : '#fff',
                    border: 'none',
                    borderRadius: '100px',
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={16} />
                  {analyzing ? 'Analyzing look...' : 'Analyze this look'}
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Quick picks */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Quick picks</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {CELEBRITY_LOOKS.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setSearchQuery(l.celebrity)}
                      style={{
                        fontSize: '12px',
                        padding: '6px 14px',
                        borderRadius: '100px',
                        border: searchQuery === l.celebrity ? '0.5px solid #fff' : '0.5px solid #222',
                        background: searchQuery === l.celebrity ? '#fff' : 'transparent',
                        color: searchQuery === l.celebrity ? '#080808' : '#666',
                        cursor: 'pointer',
                        letterSpacing: '0.04em',
                        transition: 'all 0.15s'
                      }}
                    >
                      {l.celebrity}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                <input
                  type="text"
                  placeholder="Search by celebrity name (e.g., Zendaya, Rihanna, Blake Lively)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '18px 20px 18px 52px',
                    fontSize: '14px',
                    color: '#fff',
                    background: '#0d0d0d',
                    border: '0.5px solid #1a1a1a',
                    borderRadius: '12px',
                    outline: 'none',
                    letterSpacing: '0.02em'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#333'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#1a1a1a'; }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) handleAnalyze(); }}
                />
              </div>
              {searchQuery && (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    fontSize: '14px',
                    color: '#080808',
                    background: analyzing ? '#555' : '#fff',
                    border: 'none',
                    borderRadius: '100px',
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Search size={16} />
                  {analyzing ? 'Finding and analyzing look...' : 'Find and analyze'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
