import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import YouTube from 'react-youtube';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import API from '../utils/api';
import { getImageUrl, handleImageError } from '../utils/api';
import ProductCard from '../components/ProductCard';
import CouponTimer from '../components/CouponTimer';
import LoadingSpinner from '../components/LoadingSpinner';

/* ─── Scroll-reveal: fade + rise the first time an element enters view ─── */
function Reveal({ children, delay = 0, className = '', style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`
    }}>
      {children}
    </div>
  );
}

/* ─── A short rotation of multilingual quotes about fragrance ─── */
const QUOTES = [
  { text: 'ما أجملَ العِطرَ يُحيي الأرواحَ ويُقرِّبُ القلوب', language: 'Arabic', author: 'Al-Ghazali', englishMeaning: 'How beautiful is perfume — it revives souls and draws hearts closer', rtl: true },
  { text: 'Le parfum est la mémoire du bonheur', language: 'French', author: 'Victor Hugo', englishMeaning: 'Perfume is the memory of happiness' },
  { text: 'सुगंध वह है जो आँखें बंद होने पर भी सुनाई दे', language: 'Hindi', author: 'Kabir Das', englishMeaning: 'Fragrance is that which is felt even with the eyes closed' },
  { text: 'நறுமணம் இயற்கையின் கவிதை', language: 'Tamil', author: 'Thiruvalluvar', englishMeaning: 'Fragrance is the poetry of nature' },
  { text: 'Der Duft ist die Sprache der Erinnerung', language: 'German', author: 'Johann von Goethe', englishMeaning: 'Fragrance is the language of memory' },
];

export default function Home() {
  const [landing, setLanding] = useState(null);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeQuote, setActiveQuote] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    Promise.all([
      API.get('/api/landing'),
      API.get('/api/products?featured=true&limit=8'),
      API.get('/api/branches'),
      API.get('/api/settings')
    ]).then(([l, p, b, s]) => {
      setLanding(l.data);
      setProducts(p.data.products || []);
      setBranches(b.data || []);
      setSettings(s.data || {});
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote(prev => (prev + 1) % QUOTES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ paddingTop: '70px' }}><LoadingSpinner fullPage /></div>;

  const carouselSettings = {
    dots: false, arrows: false, infinite: true, speed: 1100, slidesToShow: 1, slidesToScroll: 1,
    autoplay: true, autoplaySpeed: 6500, pauseOnHover: true, fade: true,
    beforeChange: (_, next) => setActiveSlide(next)
  };

  const galleryImages = products.flatMap(p => (p.images || []).slice(0, 1).map(img => ({ img, name: p.name, id: p._id }))).slice(0, 4);

  return (
    <div style={{ paddingTop: '70px' }}>

      {/* ═══════════════════════════════════════
          HERO — one headline, one line, one action. Nothing else.
      ═══════════════════════════════════════ */}
      {landing?.carouselImages?.length > 0 ? (
        <>
          {/* Image band — framed and centered, capped so it never balloons on ultra-wide screens */}
          <div style={{ background: 'var(--black)' }}>
            <div className="hero-carousel" style={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto', height: '34vh', minHeight: '240px', maxHeight: '460px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.55)' }}>
              <Slider ref={sliderRef} {...carouselSettings}>
                {landing.carouselImages.map((img, i) => (
                  <div key={i}>
                    <div style={{ position: 'relative', height: '34vh', minHeight: '240px', maxHeight: '460px', overflow: 'hidden' }}>
                      <img
                        src={getImageUrl(img.url)} alt={img.alt || `Slide ${i + 1}`}
                        className={activeSlide === i ? 'ken-burns' : ''}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImageError}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.35) 100%)' }} />
                    </div>
                  </div>
                ))}
              </Slider>
              <div className="hero-carousel-frame" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 0 1px rgba(var(--accent-rgb),0.25)' }} />

              {/* Slide index + custom line-segment navigation */}
              {landing.carouselImages.length > 1 && (
                <div style={{
                  position: 'absolute', right: '1.25rem', bottom: '1rem', zIndex: 11,
                  display: 'flex', alignItems: 'center', gap: '0.6rem'
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(245,232,192,0.7)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                    {String(activeSlide + 1).padStart(2, '0')}/{String(landing.carouselImages.length).padStart(2, '0')}
                  </span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {landing.carouselImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => sliderRef.current?.slickGoTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        style={{
                          width: activeSlide === i ? '22px' : '10px', height: '2px', padding: 0, border: 'none', cursor: 'pointer',
                          background: activeSlide === i ? 'var(--gold)' : 'rgba(245,232,192,0.4)',
                          boxShadow: activeSlide === i ? '0 0 6px rgba(var(--accent-rgb),0.7)' : 'none',
                          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text + CTA — 20% of viewport height, on the plain background */}
          <div className="hero-cta-band" style={{
            position: 'relative', height: '20vh', minHeight: '190px', background: 'var(--black)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem 2rem'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 100% at 50% 0%, rgba(var(--accent-rgb),0.09) 0%, transparent 70%)' }} />
            <h1 className="hero-cta-title" style={{
              fontFamily: 'var(--font-heading)', fontWeight: 400, position: 'relative',
              fontSize: 'clamp(1.5rem, 3.4vw, 2.4rem)', lineHeight: 1.15,
              color: 'var(--gold-pale)', marginBottom: '0.5rem'
            }}>
              {landing?.heroTitle || settings?.storeName || 'Saliheen Perfumes'}
            </h1>
            <p className="hero-cta-tagline" style={{
              fontFamily: 'var(--font-accent)', fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)', position: 'relative',
              color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.1rem'
            }}>
              {landing?.heroSubtitle || settings?.storeTagline || 'The Essence of Luxury'}
            </p>
            <Link to="/shop" className="btn btn-primary hero-cta-btn" style={{ position: 'relative' }}>
              Shop Now
            </Link>
          </div>

          {/* Mishap animation + collection tagline, side by side in one row — shared gold-mist background */}
          <div className="mishap-row" style={{ position: 'relative', width: '100%', minHeight: '30vh', background: 'var(--black-rich)', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 90% at 50% 50%, rgba(var(--accent-rgb),0.07) 0%, transparent 70%)' }} />

            {/* Scent wisps — soft gold mist drifting up across the whole row */}
            <div className="scent-wisps" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              <span className="wisp wisp-1" />
              <span className="wisp wisp-2" />
              <span className="wisp wisp-3" />
              <span className="wisp wisp-4" />
              <span className="wisp wisp-5" />
            </div>

            {/* Content stays centered within the site's standard container so the
                bottle and quote never drift apart on ultra-wide viewports */}
            <div className="mishap-inner container" style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

            {/* The one little gag — the bottle sprays itself, delights in it, then plays it cool */}
            <div className="mishap-col" style={{ position: 'relative', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0 1rem' }}>
              <div className="mishap-bottle" aria-hidden="true" style={{ position: 'relative' }}>
                <svg width="72" height="86" viewBox="0 0 34 40" fill="none">
                  {/* Spritz cloud */}
                  <g className="mishap-cloud">
                    <circle cx="26" cy="6" r="4.2" fill="var(--gold-bright)" fillOpacity="0.65" />
                    <circle cx="31" cy="3" r="2.6" fill="var(--gold-bright)" fillOpacity="0.55" />
                    <circle cx="22" cy="1.5" r="2.4" fill="var(--gold-bright)" fillOpacity="0.5" />
                  </g>

                  {/* Atomizer + cap */}
                  <rect x="19" y="9" width="4" height="6" rx="1.5" fill="var(--gold-dark)" />
                  <rect x="14" y="6" width="7" height="5" rx="2.5" fill="var(--gold)" />
                  <rect x="11" y="12" width="12" height="6" rx="2" fill="var(--gold-dark)" />

                  {/* Body — this is what shudders */}
                  <g className="mishap-body">
                    <path d="M9 18 h16 a2 2 0 0 1 2 2 v15 a3 3 0 0 1 -3 3 H10 a3 3 0 0 1 -3 -3 V20 a2 2 0 0 1 2 -2 Z" fill="var(--gold-pale)" fillOpacity="0.14" stroke="var(--gold)" strokeWidth="1.4" />
                    <path d="M8.3 27 h17.4 v7.7 a3 3 0 0 1 -3 3 H11.3 a3 3 0 0 1 -3 -3 Z" fill="var(--gold)" fillOpacity="0.5" />

                    {/* Face: content (default) */}
                    <g className="face face-content">
                      <path d="M12.5 24.5 q1.3 -1.3 2.6 0" stroke="var(--black)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                      <path d="M18 24.5 q1.3 -1.3 2.6 0" stroke="var(--black)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                      <path d="M14.5 28 q2.5 2 5 0" stroke="var(--black)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                    </g>

                    {/* Face: delighted — big eyes-closed grin, mid-spray joy */}
                    <g className="face face-delighted">
                      <path d="M11.8 24.6 q1.4 -1.8 2.8 0" stroke="var(--black)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                      <path d="M17.4 24.6 q1.4 -1.8 2.8 0" stroke="var(--black)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                      <path d="M13.5 27.6 q3 3 8 0" stroke="var(--black)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                    </g>

                    {/* Face: smug — one relaxed closed eye, one raised brow, lopsided smirk */}
                    <g className="face face-smug">
                      <path d="M12.2 24.5 q1.3 -1.3 2.6 0" stroke="var(--black)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                      <path d="M17.6 23.1 q1.5 -0.9 3 0.1" stroke="var(--black)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                      <path d="M13.5 27.6 q2 2.2 6.5 0.3" stroke="var(--black)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    </g>

                    <circle cx="11.5" cy="27" r="1" fill="var(--gold-bright)" fillOpacity="0.6" />
                    <circle cx="21.5" cy="27" r="1" fill="var(--gold-bright)" fillOpacity="0.6" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Rotating multilingual quotes about fragrance, centered beneath the bottle */}
            <div className="mishap-col mishap-col-quote" style={{ position: 'relative', flex: '0 0 auto', minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 0 2rem' }}>
              <Reveal>
                <div style={{ maxWidth: '620px', margin: '0 auto', position: 'relative', minHeight: '110px', textAlign: 'center' }}>
                  {QUOTES.map((q, i) => (
                    <div key={i} style={{
                      position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0, right: 0,
                      opacity: activeQuote === i ? 1 : 0,
                      transition: 'opacity 1s ease',
                      pointerEvents: activeQuote === i ? 'auto' : 'none'
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-accent)', fontSize: 'clamp(1.1rem,2.2vw,1.5rem)',
                        color: 'var(--gold-pale)', fontStyle: 'italic', lineHeight: 1.55,
                        marginBottom: '0.6rem', direction: q.rtl ? 'rtl' : 'ltr'
                      }}>"{q.text}"</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
                        "{q.englishMeaning}" <span style={{ color: 'var(--gold-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontStyle: 'normal', fontSize: '0.64rem' }}>— {q.language}, {q.author}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ height: 'calc(100vh - 70px)', minHeight: '560px', background: 'var(--black)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(var(--accent-rgb),0.08) 0%, transparent 65%)' }} />
          <div style={{ position: 'relative' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(2.4rem,7vw,5.5rem)', color: 'var(--gold-pale)', marginBottom: '1.25rem', lineHeight: 1.1 }}>
              {landing?.heroTitle || settings.storeName || 'Saliheen Perfumes'}
            </h1>
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: 'clamp(1.1rem,2.4vw,1.5rem)', color: 'var(--text-secondary)', marginBottom: '2.5rem', fontStyle: 'italic' }}>
              {landing?.heroSubtitle || settings.storeTagline || 'The Essence of Luxury'}
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--black)', padding: '1.5rem 0' }}>
        <div className="container"><CouponTimer /></div>
      </div>

      {/* ═══════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════ */}
      {products.length > 0 && (
        <section style={{ padding: 'clamp(4rem,8vw,6rem) 0' }}>
          <div className="container">
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,5vw,3.5rem)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>
                  Curated Selection
                </p>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(1.7rem,3.6vw,2.6rem)', color: 'var(--gold-pale)' }}>
                  Signature Fragrances
                </h2>
                <div className="gold-divider" />
              </div>
            </Reveal>
            <div className="grid-4">
              {products.map((p, i) => (
                <Reveal key={p._id} delay={(i % 4) * 0.08} style={{ height: '100%' }}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'clamp(3rem,6vw,4.5rem)' }}>
              <Link to="/shop" style={{ color: 'var(--gold)', fontFamily: 'var(--font-accent)', fontSize: '1rem', fontStyle: 'italic', textDecoration: 'none', borderBottom: '1px solid var(--gold-dark)', paddingBottom: '2px' }}>
                View the full collection →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          THE CRAFT — one full-bleed image, one idea, no lists
      ═══════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {landing?.historyImage ? (
            <img src={getImageUrl(landing.historyImage)} alt="The craft of Saliheen attars" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImageError} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, var(--black-rich), var(--black))' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--black) 0%, rgba(8,7,5,0.75) 38%, transparent 75%)' }} />
        </div>

        <div className="container" style={{ position: 'relative', padding: 'clamp(4rem,10vw,7rem) 2rem' }}>
          <Reveal>
            <div style={{ maxWidth: '460px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
                Since Kannauj, India
              </p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: 'var(--gold-pale)', marginBottom: '1.75rem', lineHeight: 1.2 }}>
                A craft carried through centuries
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-accent)', fontSize: '1.15rem', lineHeight: 1.9, fontStyle: 'italic', marginBottom: '2rem' }}>
                Every attar is steam-distilled in copper degs and rested in pure sandalwood oil for months — a technique unchanged since the 10th century, unhurried by design.
              </p>
              <Link to="/shop?type=attar" style={{ color: 'var(--gold)', fontFamily: 'var(--font-accent)', fontSize: '1rem', fontStyle: 'italic', textDecoration: 'none', borderBottom: '1px solid var(--gold-dark)', paddingBottom: '2px' }}>
                Discover our attars →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY ATTAR — a single statement, stats as plain text, no cards
      ═══════════════════════════════════════ */}
      <section style={{ padding: 'clamp(5rem,10vw,9rem) 0' }}>
        <div className="container">
          <Reveal>
            <p style={{
              fontFamily: 'var(--font-heading)', fontWeight: 400, textAlign: 'center',
              fontSize: 'clamp(1.6rem,3.6vw,2.6rem)', color: 'var(--gold-pale)', lineHeight: 1.45,
              maxWidth: '780px', margin: '0 auto'
            }}>
              Alcohol-free and true to the skin — a single drop lingers <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>8 to 12 hours</em>, with zero synthetics and nothing the earth cannot take back.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          GALLERY — a few large product images, close, quiet
      ═══════════════════════════════════════ */}
      {galleryImages.length >= 3 && (
        <section style={{ padding: '0 0 clamp(5rem,10vw,9rem)' }}>
          <div className="container">
            <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {galleryImages.map((g, i) => (
                <Reveal key={g.id} delay={(i % 4) * 0.08}>
                  <Link to={`/product/${g.id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', aspectRatio: '3 / 4' }}>
                    <img src={getImageUrl(g.img)} alt={g.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      onError={handleImageError}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          YOUTUBE VIDEO
      ═══════════════════════════════════════ */}
      {landing?.youtubeVideoId && (
        <section style={{ padding: 'clamp(5rem,10vw,8rem) 0' }}>
          <div className="container">
            <div style={{ maxWidth: '780px', margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <YouTube videoId={landing.youtubeVideoId} opts={{ width: '100%', height: '100%', playerVars: { modestbranding: 1 } }} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          BRANCHES — plain list, no card chrome
      ═══════════════════════════════════════ */}
      {branches.length > 0 && (
        <section style={{ padding: 'clamp(5rem,10vw,8rem) 0' }}>
          <div className="container">
            <Reveal>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', textAlign: 'center', marginBottom: '3.5rem' }}>
                Find Us
              </p>
            </Reveal>
            <div className="branch-list" style={{ maxWidth: '760px', margin: '0 auto' }}>
              {branches.map((branch, i) => (
                <Reveal key={branch._id} delay={(i % 4) * 0.06}>
                  <div className="branch-row" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem',
                    padding: '1.75rem 0', borderBottom: '1px solid var(--black-border)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: 'var(--gold-pale)', fontSize: '1.15rem' }}>{branch.name}</h3>
                        {branch.isComingSoon && <span className="badge badge-warning" style={{ fontSize: '0.6rem' }}>Coming Soon</span>}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: branch.phone || branch.timings ? '0.4rem' : 0 }}>{branch.address}</p>
                      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        {branch.phone && (
                          <a href={`tel:${branch.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
                            <FiPhone size={12} /> {branch.phone}
                          </a>
                        )}
                        {branch.timings && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <FiClock size={12} /> {branch.timings}
                          </span>
                        )}
                      </div>
                    </div>
                    {branch.googleMapLink && !branch.isComingSoon && (
                      <a href={branch.googleMapLink} target="_blank" rel="noreferrer" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gold)', fontSize: '0.82rem', textDecoration: 'none', marginTop: '0.3rem' }}>
                        <FiMapPin size={13} /> Directions
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          CTA — quiet, typographic, no gradients or ornaments
      ═══════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem,12vw,10rem) 0', textAlign: 'center', borderTop: '1px solid var(--black-border)' }}>
        <div className="container">
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(1.9rem,4.5vw,3.2rem)', color: 'var(--gold-pale)', marginBottom: '2.25rem', lineHeight: 1.25 }}>
              Discover your signature scent
            </h2>
            <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
          </Reveal>
        </div>
      </section>

      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1); }
          to   { transform: scale(1.09); }
        }
        .ken-burns { animation: kenBurns 7s cubic-bezier(0.25,0.1,0.25,1) both; }

        @keyframes heroCtaRise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-cta-title   { animation: heroCtaRise 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .hero-cta-tagline { animation: heroCtaRise 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .hero-cta-btn     { animation: heroCtaRise 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both; }

        /* Scent wisps — see .ambient-wisps .wisp / @keyframes wispRise in globals.css (shared with the app-wide ambient background) */
        .scent-wisps .wisp {
          position: absolute;
          bottom: -10%;
          width: 90px; height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(var(--accent-rgb),0.5) 0%, rgba(var(--accent-rgb),0.14) 45%, transparent 72%);
          filter: blur(6px);
          opacity: 0;
          animation: wispRise 9s ease-in infinite;
        }
        .scent-wisps .wisp-1 { left: 10%; width: 70px;  height: 70px;  animation-delay: 0s;   animation-duration: 8s; }
        .scent-wisps .wisp-2 { left: 30%; width: 110px; height: 110px; animation-delay: 1.6s; animation-duration: 10s; }
        .scent-wisps .wisp-3 { left: 50%; width: 80px;  height: 80px;  animation-delay: 3.2s; animation-duration: 9s; }
        .scent-wisps .wisp-4 { left: 70%; width: 60px;  height: 60px;  animation-delay: 4.8s; animation-duration: 7.5s; }
        .scent-wisps .wisp-5 { left: 88%; width: 55px;  height: 55px;  animation-delay: 2.4s; animation-duration: 8.5s; }

        /* The mishap — one little bottle sprays itself, delights in it, then plays it cool. One 7s loop, one joke. */
        .mishap-bottle { animation: mishapBob 7s ease-in-out infinite; transform-origin: bottom center; }
        @keyframes mishapBob {
          0%, 8%, 42%, 100% { transform: translateY(0) rotate(0deg); }
          11%  { transform: translateY(0) scaleY(0.86); }
          16%, 20%, 24% { transform: translateY(-2px) rotate(-6deg); }
          18%, 22%      { transform: translateY(-2px) rotate(6deg); }
          28%  { transform: translateY(0) rotate(0deg); }
          58%  { transform: translateY(-3px) rotate(-3deg); }
          64%  { transform: translateY(0) rotate(2deg); }
          68%  { transform: translateY(0) rotate(0deg); }
        }

        .mishap-cloud { opacity: 0; animation: mishapCloud 7s ease-out infinite; }
        @keyframes mishapCloud {
          0%, 9%   { opacity: 0; transform: scale(0.3); }
          13%      { opacity: 0.95; transform: scale(1); }
          30%      { opacity: 0; transform: scale(1.7) translateY(-10px); }
          100%     { opacity: 0; }
        }

        .face { opacity: 0; }
        .face-content   { animation: mishapFaceContent 7s ease-in-out infinite; }
        .face-delighted { animation: mishapFaceDelighted 7s ease-in-out infinite; }
        .face-smug      { animation: mishapFaceSmug 7s ease-in-out infinite; }
        @keyframes mishapFaceContent {
          0%, 10%, 96%, 100% { opacity: 1; }
          13%, 94%           { opacity: 0; }
        }
        @keyframes mishapFaceDelighted {
          0%, 13%, 42%, 100% { opacity: 0; }
          16%, 38%           { opacity: 1; }
        }
        @keyframes mishapFaceSmug {
          0%, 44%, 76%, 100% { opacity: 0; }
          48%, 72%           { opacity: 1; }
        }

        /* Mishap row content stays centered in the standard container (max 1300px)
           so the bottle and quote stay centered and never drift on ultra-wide monitors. */
        .mishap-inner { max-width: 900px; margin: 0 auto; padding: 2.5rem 1.5rem; }
        .mishap-col-quote { border-top: 1px solid var(--black-border); }

        @media (min-width: 1440px) {
          .hero-carousel { max-width: 960px !important; }
        }

        @media (max-width: 900px) {
          .hero-carousel { max-width: 92% !important; }
        }

        @media (max-width: 768px) {
          .mishap-row { min-height: auto !important; }
        }

        @media (max-width: 640px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-carousel { max-width: 100% !important; }
        }
        @media (max-width: 560px) {
          .branch-row { flex-direction: column !important; gap: 0.75rem !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ken-burns { animation: none; }
          .hero-cta-title, .hero-cta-tagline, .hero-cta-btn { animation: none; }
          .scent-wisps .wisp { animation: none; opacity: 0; }
          .mishap-bottle, .mishap-cloud { animation: none; }
          .face { animation: none; opacity: 0; }
          .face-content { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
