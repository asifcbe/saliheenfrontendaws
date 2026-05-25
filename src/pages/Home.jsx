import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import YouTube from 'react-youtube';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiArrowRight, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import API from '../utils/api';
import { getImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';
import CouponTimer from '../components/CouponTimer';
import LoadingSpinner from '../components/LoadingSpinner';

/* ─── Hardcoded history timeline ─── */
const HISTORY_TIMELINE = [
  {
    era: '3000 BCE',
    region: 'Ancient Egypt',
    title: 'The Birth of Sacred Scent',
    text: 'Egyptians burned kyphi — a blend of frankincense, myrrh and calamus — in temples to honour their gods. Fragrant resins and oils were considered divine gifts, used in rituals, healing and royal burial.'
  },
  {
    era: '1000 BCE',
    region: 'Arabia & Persia',
    title: 'The Incense Roads',
    text: 'Camel caravans carried oud, frankincense and myrrh from Southern Arabia along the ancient Incense Road to Egypt, Greece and Rome. Perfume trade shaped the wealth of entire civilisations and became a cornerstone of commerce.'
  },
  {
    era: '10th Century',
    region: 'The Islamic Golden Age',
    title: "Avicenna's Great Discovery",
    text: 'Physician-philosopher Ibn Sina (Avicenna) refined the art of steam distillation, enabling the extraction of true floral essence — the world\'s first attar. His rose distillate from Persia set the foundation for perfumery as a science.'
  },
  {
    era: '13th Century',
    region: 'Kannauj, India',
    title: 'The Attar Capital of the World',
    text: 'The ancient city of Kannauj on the banks of the Ganga became the global heart of attar craft. Families passed down the art of distillation through generations, their copper degs producing legendary rose, jasmine and oud attars.'
  },
  {
    era: '17th Century',
    region: 'Mughal India',
    title: 'Perfume of the Emperors',
    text: 'Mughal courts elevated attar to high art. Empress Nur Jahan is said to have discovered rose attar by noticing fragrant essence floating on rose-water canals. Emperors bathed in rose water and perfumed their garments before prayer.'
  },
  {
    era: 'Present Day',
    region: 'Saliheen Perfumes',
    title: 'Centuries of Tradition, One Bottle',
    text: 'Saliheen Perfumes carries forward this ancient legacy — blending time-honoured distillation wisdom with the finest natural ingredients to craft attars and perfumes that honour heritage, purity and the timeless language of scent.'
  }
];

/* ─── Hardcoded perfume-making process ─── */
const PROCESS_STEPS = [
  {
    num: '01',
    symbol: '🌹',
    title: 'Harvest at Dawn',
    text: 'Botanicals — rose, jasmine, agarwood — are harvested at first light when their aromatic oils are at peak concentration. Timing is everything.'
  },
  {
    num: '02',
    symbol: '💧',
    title: 'Hydro-Distillation',
    text: 'Flowers are placed in copper degs with water and gently heated. Rising steam carries the volatile essence through a coiled pipe into a cooling vessel.'
  },
  {
    num: '03',
    symbol: '🪵',
    title: 'Sandalwood Absorption',
    text: 'The condensed aromatic water is slowly absorbed into a base of pure Mysore sandalwood oil over several hours. The sandalwood acts as a natural fixative.'
  },
  {
    num: '04',
    symbol: '⏳',
    title: 'Maturation',
    text: 'The attar rests in sealed leather bottles (kuppi) for months — sometimes years. Like fine wine, time deepens complexity, softens raw notes and marries the ingredients.'
  },
  {
    num: '05',
    symbol: '🔬',
    title: 'Quality Testing',
    text: 'Master perfumers evaluate each batch for strength, clarity and character. Only batches that meet our standards of purity and balance are approved.'
  },
  {
    num: '06',
    symbol: '✦',
    title: 'Bottling',
    text: 'The finished attar is poured into hand-inspected bottles, sealed and presented — ready to begin its next journey on your skin.'
  }
];

/* ─── Why Attar cards ─── */
const ATTAR_VIRTUES = [
  { icon: '🌿', title: 'Alcohol-Free', stat: '100% Halal & Pure', text: 'Pure attar contains no alcohol. It respects the skin and the spirit — suitable for all, including those observing religious practice.' },
  { icon: '⏱', title: 'Long-Lasting', stat: '8–12 Hours on Skin', text: 'A single drop applied to pulse points can linger for 8–12 hours, evolving beautifully as it warms with your body heat.' },
  { icon: '🌱', title: 'Skin-Nourishing', stat: 'Zero Synthetics', text: 'The sandalwood base moisturises as it perfumes. Natural oils seal in fragrance while caring for the skin beneath.' },
  { icon: '🍃', title: 'Eco-Conscious', stat: 'Biodegradable', text: 'No synthetic fixatives, no harmful chemicals. Attar is biodegradable, cruelty-free and gentle on the environment — luxury without compromise.' }
];

/* ─── 20 multilingual quotes about fragrance ─── */
const QUOTES = [
  { text: 'ما أجملَ العِطرَ يُحيي الأرواحَ ويُقرِّبُ القلوب', language: 'Arabic', author: 'Al-Ghazali', englishMeaning: 'How beautiful is perfume — it revives souls and draws hearts closer', rtl: true },
  { text: 'عطر گل را باد صبا با خود برده است', language: 'Persian', author: 'Hafez', englishMeaning: 'The morning breeze has carried away the fragrance of the flower', rtl: true },
  { text: 'خوشبو وہ زبان ہے جو بے الفاظ بولتی ہے', language: 'Urdu', author: 'Mirza Ghalib', englishMeaning: 'Fragrance is the language that speaks without words', rtl: true },
  { text: 'सुगंध वह है जो आँखें बंद होने पर भी सुनाई दे', language: 'Hindi', author: 'Kabir Das', englishMeaning: 'Fragrance is that which is felt even with the eyes closed' },
  { text: 'সুগন্ধের স্পর্শে মন ফিরে পায় হারানো স্বপ্ন', language: 'Bengali', author: 'Rabindranath Tagore', englishMeaning: 'In the touch of fragrance, the mind rediscovers lost dreams' },
  { text: 'Güzel koku, ruhun görünmez çiçeğidir', language: 'Turkish', author: 'Yunus Emre', englishMeaning: 'A beautiful fragrance is the invisible flower of the soul' },
  { text: 'Le parfum est la mémoire du bonheur', language: 'French', author: 'Victor Hugo', englishMeaning: 'Perfume is the memory of happiness' },
  { text: '香りは時を超え、魂を動かす', language: 'Japanese', author: 'Matsuo Bashō', englishMeaning: 'Fragrance transcends time and moves the soul' },
  { text: '花香不语，却远传千里', language: 'Chinese', author: 'Confucius', englishMeaning: 'A flower speaks no words, yet its fragrance travels a thousand miles' },
  { text: 'सुगन्धिः पुण्यकृतां लोके गन्धः पृथिव्यां च', language: 'Sanskrit', author: 'Bhagavad Gita', englishMeaning: 'I am the fragrance of the earth — born of virtue and devotion' },
  { text: 'Il profumo è il suono del silenzio', language: 'Italian', author: 'Dante Alighieri', englishMeaning: 'Perfume is the sound of silence' },
  { text: 'El perfume es el susurro del alma que los labios no pueden pronunciar', language: 'Spanish', author: 'Federico García Lorca', englishMeaning: 'Perfume is the whisper of the soul that lips cannot speak' },
  { text: 'Der Duft ist die Sprache der Erinnerung', language: 'German', author: 'Johann von Goethe', englishMeaning: 'Fragrance is the language of memory' },
  { text: 'ריח הגן בבוקר — שיר ללא מילים', language: 'Hebrew', author: 'King Solomon', englishMeaning: 'The scent of the garden at dawn — a song without words', rtl: true },
  { text: 'Η ευωδιά είναι η μνήμη της ψυχής', language: 'Greek', author: 'Plato', englishMeaning: 'Fragrance is the memory of the soul' },
  { text: 'நறுமணம் இயற்கையின் கவிதை', language: 'Tamil', author: 'Thiruvalluvar', englishMeaning: 'Fragrance is the poetry of nature' },
  { text: 'സൗഗന്ധം ദൈവത്തിന്റെ ശ്വാസമാണ്', language: 'Malayalam', author: 'Ezhuthachan', englishMeaning: 'Fragrance is the very breath of God' },
  { text: 'Harufu nzuri ni zawadi ya moyo', language: 'Swahili', author: 'African Proverb', englishMeaning: 'A beautiful fragrance is a gift of the heart' },
  { text: 'Аромат — это музыка, которую слышит душа', language: 'Russian', author: 'Leo Tolstoy', englishMeaning: 'Fragrance is the music that the soul hears' },
  { text: 'Wewangian adalah jiwa yang mengalir ke seluruh alam', language: 'Indonesian', author: 'Chairil Anwar', englishMeaning: 'Fragrance is the soul that flows through all of nature' },
];


export default function Home() {
  const [landing, setLanding] = useState(null);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeQuote, setActiveQuote] = useState(0);

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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ paddingTop: '70px' }}><LoadingSpinner fullPage /></div>;

  const carouselSettings = {
    dots: true, arrows: false, infinite: true, speed: 800, slidesToShow: 1, slidesToScroll: 1,
    autoplay: true, autoplaySpeed: 5000, pauseOnHover: true, fade: true,
    appendDots: dots => (
      <div style={{ bottom: '20px' }}>
        <ul style={{ margin: 0, padding: 0, display: 'flex', gap: '8px', justifyContent: 'center' }}>{dots}</ul>
      </div>
    )
  };

  return (
    <div style={{ paddingTop: '70px' }}>

      {/* ═══════════════════════════════════════
          HERO CAROUSEL
      ═══════════════════════════════════════ */}
      {landing?.carouselImages?.length > 0 ? (
        <div style={{ position: 'relative' }}>
          <Slider {...carouselSettings}>
            {landing.carouselImages.map((img, i) => (
              <div key={i}>
                <div style={{ position: 'relative', height: 'calc(100vh - 70px)', minHeight: '500px', overflow: 'hidden' }}>
                  <img src={getImageUrl(img.url)} alt={img.alt || `Slide ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7) 100%)' }} />
                  {(img.caption || img.subcaption) && (
                    <div style={{ position: 'absolute', bottom: '10%', left: 0, right: 0, textAlign: 'center', padding: '0 2rem' }}>
                      {img.caption && (
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem,4vw,3rem)', color: 'var(--gold-pale)', marginBottom: '0.5rem', textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
                          {img.caption}
                        </h2>
                      )}
                      {img.subcaption && (
                        <p style={{ fontFamily: 'var(--font-accent)', fontSize: 'clamp(0.9rem,2vw,1.3rem)', color: 'var(--gold)', fontStyle: 'italic', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                          {img.subcaption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Slider>

          {/* Welcome overlay — always present, sits above the sliding images */}
          <div style={{
            position: 'absolute', inset: 0,
            zIndex: 10, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '0 2rem', paddingBottom: '18vh'
          }}>
            <p style={{
              fontFamily: 'var(--font-accent)',
              fontSize: 'clamp(0.7rem, 1.8vw, 1rem)',
              color: 'var(--gold)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
              marginBottom: '0.6rem',
              opacity: 0.9
            }}>
              Welcome to
            </p>
            <h1 className="welcome-title" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              lineHeight: 1.05,
              marginBottom: '1rem'
            }}>
              Saliheen Perfumes
            </h1>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
              <span style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.15em', opacity: 0.7 }}>✦</span>
              <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
            </div>
            <p style={{
              fontFamily: 'var(--font-accent)',
              fontSize: 'clamp(0.8rem, 1.8vw, 1.1rem)',
              color: 'rgba(255,255,255,0.75)',
              fontStyle: 'italic',
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
              letterSpacing: '0.05em',
              marginBottom: '2rem'
            }}>
              {landing?.heroSubtitle || settings?.storeTagline || 'The Essence of Luxury'}
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg" style={{ pointerEvents: 'auto' }}>
              Explore Collection <FiArrowRight />
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ height: 'calc(100vh - 70px)', minHeight: '500px', background: 'linear-gradient(135deg,#0a0a00,#1a1200,#0a0a00)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(var(--accent-rgb),0.1) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative' }}>
            <div className="ornament" style={{ marginBottom: '1.5rem' }}>✦</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem,8vw,6rem)', color: 'var(--gold)', marginBottom: '1rem', lineHeight: 1.1 }} className="gold-glow">
              {landing?.heroTitle || settings.storeName || 'Saliheen Perfumes'}
            </h1>
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: 'clamp(1.2rem,3vw,2rem)', color: 'var(--text-secondary)', marginBottom: '2rem', fontStyle: 'italic' }}>
              {landing?.heroSubtitle || settings.storeTagline || 'The Essence of Luxury'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-primary btn-lg">Explore Collection <FiArrowRight /></Link>
              <Link to="/shop?type=attar" className="btn btn-outline btn-lg">Discover Attars</Link>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          COUPON TIMER
      ═══════════════════════════════════════ */}
      <section style={{ background: 'var(--black-surface)', padding: '2rem 0' }}>
        <div className="container"><CouponTimer /></div>
      </section>

      {/* ═══════════════════════════════════════
          QUOTES  (20 languages, hardcoded)
      ═══════════════════════════════════════ */}
      <section className="section section-dark">
        <div className="container">
          <p className="section-label" style={{ textAlign: 'center' }}>Wisdom of the Ages</p>
          <h2 className="section-title">The Language of Fragrance</h2>
          <p className="section-subtitle">Perfume speaks in every tongue, across every culture</p>
          <div className="gold-divider" />

          <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', minHeight: '220px' }}>
            {QUOTES.map((q, i) => (
              <div key={i} style={{
                position: i === 0 ? 'relative' : 'absolute',
                top: 0, left: 0, right: 0,
                opacity: activeQuote === i ? 1 : 0,
                transform: activeQuote === i ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
                pointerEvents: activeQuote === i ? 'auto' : 'none',
                textAlign: 'center', padding: '1.5rem 2rem'
              }}>
                <div style={{ fontSize: '4.5rem', color: 'var(--gold)', opacity: 0.15, lineHeight: 1, marginBottom: '0.25rem', fontFamily: 'Georgia', userSelect: 'none' }}>"</div>
                <p style={{
                  fontFamily: 'var(--font-accent)', fontSize: 'clamp(1.1rem,2.5vw,1.7rem)',
                  color: 'var(--gold-pale)', fontStyle: 'italic', lineHeight: 1.7,
                  marginBottom: '1.25rem', direction: q.rtl ? 'rtl' : 'ltr'
                }}>{q.text}</p>
                <div style={{ width: '40px', height: '1px', background: 'var(--gold-dark)', margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  {q.language} {q.author && <span style={{ color: 'var(--gold-dim)' }}>— {q.author}</span>}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-accent)', fontSize: '0.95rem', fontStyle: 'italic', maxWidth: '560px', margin: '0 auto' }}>
                  "{q.englishMeaning}"
                </p>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' }}>
            <button onClick={() => setActiveQuote(p => (p - 1 + QUOTES.length) % QUOTES.length)}
              style={{ background: 'none', border: '1px solid var(--black-border)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)', fontSize: '1rem' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--black-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              ‹
            </button>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '260px' }}>
              {QUOTES.map((_, i) => (
                <button key={i} onClick={() => setActiveQuote(i)} style={{
                  width: activeQuote === i ? '20px' : '6px', height: '6px',
                  borderRadius: '3px', border: 'none', cursor: 'pointer',
                  background: activeQuote === i ? 'var(--gold)' : 'var(--black-border)',
                  transition: 'all 0.3s ease', padding: 0
                }} />
              ))}
            </div>
            <button onClick={() => setActiveQuote(p => (p + 1) % QUOTES.length)}
              style={{ background: 'none', border: '1px solid var(--black-border)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)', fontSize: '1rem' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--black-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              ›
            </button>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="section-label" style={{ textAlign: 'center' }}>Curated for You</p>
            <h2 className="section-title">Our Collection</h2>
            <p className="section-subtitle">Handcrafted fragrances for the discerning soul</p>
            <div className="gold-divider" />
            <div className="grid-4">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/shop" className="btn btn-outline btn-lg">View All Products <FiArrowRight /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          HISTORY TIMELINE  (hardcoded)
      ═══════════════════════════════════════ */}
      <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(var(--accent-rgb),0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Through the Centuries</p>
          <h2 className="section-title">A Journey Through Time</h2>
          <p className="section-subtitle">From ancient temples to your skin — the story of perfume</p>
          <div className="gold-divider" />

          <div style={{ maxWidth: '860px', margin: '4rem auto 0', position: 'relative' }}>
            {/* Centre spine */}
            <div className="tl-spine" style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px',
              background: 'linear-gradient(to bottom, transparent 0%, var(--gold-dark) 8%, var(--gold) 50%, var(--gold-dark) 92%, transparent 100%)',
              transform: 'translateX(-50%)'
            }} />

            {HISTORY_TIMELINE.map((item, i) => (
              <div key={i} className="tl-row" style={{
                display: 'flex',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                gap: '2.5rem', marginBottom: '3.5rem',
                alignItems: 'flex-start', position: 'relative'
              }}>
                {/* Diamond node */}
                <div className="tl-node" style={{
                  position: 'absolute', left: '50%', top: '1.1rem',
                  width: '14px', height: '14px', background: 'var(--gold)',
                  transform: 'translateX(-50%) rotate(45deg)', zIndex: 2,
                  boxShadow: '0 0 12px rgba(var(--accent-rgb),0.6), 0 0 24px rgba(var(--accent-rgb),0.2)'
                }} />

                {/* Card */}
                <div className="tl-card" style={{
                  width: 'calc(50% - 2rem)',
                  background: 'linear-gradient(145deg,var(--black-card),var(--black-surface))',
                  border: '1px solid var(--black-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem 1.75rem', position: 'relative',
                  transition: 'var(--transition)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb),0.35)'; e.currentTarget.style.boxShadow = 'var(--shadow-gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--black-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--gold)', letterSpacing: '0.08em', fontWeight: 600 }}>{item.era}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', background: 'rgba(var(--accent-rgb),0.08)', border: '1px solid rgba(var(--accent-rgb),0.2)', padding: '2px 8px', borderRadius: '2px' }}>{item.region}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-pale)', fontSize: '1rem', marginBottom: '0.65rem', lineHeight: 1.3 }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.8, fontFamily: 'var(--font-accent)' }}>{item.text}</p>
                </div>

                <div className="tl-spacer" style={{ width: 'calc(50% - 2rem)' }} />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 680px) {
            .tl-spine { left: 1rem !important; transform: none !important; }
            .tl-row { flex-direction: column !important; padding-left: 2.5rem; }
            .tl-card { width: 100% !important; }
            .tl-spacer { display: none; }
            .tl-node { left: 1rem !important; transform: translateX(-50%) rotate(45deg) !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════
          PERFUME PROCESS  (hardcoded)
      ═══════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--black-surface)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(var(--accent-rgb),0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Crafted with Care</p>
          <h2 className="section-title">The Art of Making Attar</h2>
          <p className="section-subtitle">Six ancient steps, unchanged for a thousand years</p>
          <div className="gold-divider" />

          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3.5rem' }}>
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="process-card" style={{
                background: 'linear-gradient(160deg, var(--black-card) 0%, var(--black-rich) 100%)',
                border: '1px solid var(--black-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem 1.75rem 1.75rem',
                position: 'relative', overflow: 'hidden', cursor: 'default',
                animation: `fadeInUp 0.55s ease ${i * 0.09}s both`,
                transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb),0.45)';
                  e.currentTarget.style.transform = 'translateY(-7px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(var(--accent-rgb),0.12), 0 0 0 1px rgba(var(--accent-rgb),0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--black-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Full-width top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent 0%, rgba(var(--accent-rgb),0.7) 50%, transparent 100%)` }} />

                {/* Watermark step number */}
                <div style={{ position: 'absolute', bottom: '-8px', right: '12px', fontFamily: 'var(--font-display)', fontSize: '6rem', color: 'rgba(var(--accent-rgb),0.04)', fontWeight: 900, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.05em' }}>{step.num}</div>

                {/* Icon + step badge row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '52px', height: '52px', flexShrink: 0, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, rgba(var(--accent-rgb),0.18), rgba(var(--accent-rgb),0.04) 70%, transparent)',
                    border: '1px solid rgba(var(--accent-rgb),0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}>{step.symbol}</div>
                  <span style={{ fontSize: '0.62rem', color: 'var(--gold-dim)', letterSpacing: '0.18em', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Step {step.num}</span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.05rem', marginBottom: '0.6rem', lineHeight: 1.3 }}>{step.title}</h3>
                <div style={{ width: '28px', height: '1px', background: 'var(--gold-dark)', marginBottom: '0.875rem' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.8, fontFamily: 'var(--font-accent)' }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeInUp      { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
          @keyframes scaleIn       { from { opacity:0; transform:scale(0.82); } to { opacity:1; transform:scale(1); } }
          @keyframes floatY        { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-8px); } }
          @keyframes welcomeSettle { from { opacity:0; letter-spacing:0.35em; transform:translateY(18px); }
                                     to   { opacity:1; letter-spacing:0.1em;  transform:translateY(0); } }
          @keyframes shimmerSweep  { 0%   { background-position: -250% center; }
                                     100% { background-position: 350% center; } }
          .welcome-title {
            background: linear-gradient(105deg,
              var(--gold-pale) 15%,
              var(--gold)      35%,
              #ffffff          50%,
              var(--gold)      65%,
              var(--gold-pale) 85%
            );
            background-size: 300% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: welcomeSettle 4.5s cubic-bezier(0.16,1,0.3,1) both,
                       shimmerSweep  14s ease-in-out 5s infinite;
          }
          @media (max-width: 900px) { .process-grid { grid-template-columns: repeat(2,1fr) !important; } }
          @media (max-width: 540px) { .process-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════
          WHY ATTAR  (hardcoded)
      ═══════════════════════════════════════ */}
      <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(var(--accent-rgb),0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.3), transparent)' }} />

        <div className="container" style={{ position: 'relative' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Pure. Natural. Timeless.</p>
          <h2 className="section-title">Why Choose Attar?</h2>
          <p className="section-subtitle">The difference you can feel — and sense</p>
          <div className="gold-divider" />

          <div className="attar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '3.5rem' }}>
            {ATTAR_VIRTUES.map((v, i) => (
              <div key={i} style={{
                background: 'linear-gradient(145deg, var(--black-card), var(--black-surface))',
                border: '1px solid var(--black-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem 2rem 1.75rem',
                display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                animation: `fadeInUp 0.55s ease ${i * 0.12}s both`,
                transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative', overflow: 'hidden'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb),0.4)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(var(--accent-rgb),0.1), 0 0 0 1px rgba(var(--accent-rgb),0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--black-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Corner accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, rgba(var(--accent-rgb),0.5), transparent)' }} />

                {/* Floating icon in glowing circle */}
                <div style={{
                  width: '64px', height: '64px', flexShrink: 0, borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, rgba(var(--accent-rgb),0.22), rgba(var(--accent-rgb),0.06) 60%, transparent)',
                  border: '1px solid rgba(var(--accent-rgb),0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem',
                  animation: `floatY ${3.5 + i * 0.7}s ease-in-out ${i * 0.4}s infinite`,
                  boxShadow: '0 0 20px rgba(var(--accent-rgb),0.08)'
                }}>{v.icon}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.1rem', marginBottom: '0.4rem', lineHeight: 1.2 }}>{v.title}</h3>
                  <div style={{ width: '36px', height: '1px', background: 'var(--gold-dark)', marginBottom: '0.75rem' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8, fontFamily: 'var(--font-accent)', marginBottom: '1rem' }}>{v.text}</p>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '3px 11px', borderRadius: '20px',
                    background: 'rgba(var(--accent-rgb),0.08)',
                    border: '1px solid rgba(var(--accent-rgb),0.2)',
                    fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.06em'
                  }}>✦ {v.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) { .attar-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════
          YOUTUBE VIDEO
      ═══════════════════════════════════════ */}
      {landing?.youtubeVideoId && (
        <section className="section section-surface">
          <div className="container">
            <p className="section-label" style={{ textAlign: 'center' }}>Watch & Discover</p>
            <h2 className="section-title">{landing.youtubeTitle || 'Our Story'}</h2>
            <p className="section-subtitle">See the world of Saliheen come to life</p>
            <div className="gold-divider" />
            <div style={{ maxWidth: '820px', margin: '0 auto', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(var(--accent-rgb),0.25)', boxShadow: 'var(--shadow-gold)' }}>
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
          BRANCHES TIMELINE
      ═══════════════════════════════════════ */}
      {branches.length > 0 && (
        <section className="section section-dark">
          <div className="container">
            <p className="section-label" style={{ textAlign: 'center' }}>Find Us</p>
            <h2 className="section-title">Our Branches</h2>
            <p className="section-subtitle">A Saliheen store near you</p>
            <div className="gold-divider" />
            <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
              <div className="branch-spine" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, var(--gold-dark), transparent)', transform: 'translateX(-50%)' }} />
              {branches.map((branch, i) => (
                <div key={branch._id} className="branch-row" style={{ display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', gap: '2rem', marginBottom: '3rem', position: 'relative', alignItems: 'flex-start' }}>
                  <div className="branch-node" style={{ position: 'absolute', left: '50%', top: '16px', width: '14px', height: '14px', borderRadius: '50%', background: branch.isComingSoon ? 'var(--black-surface)' : 'var(--gold)', border: '2px solid var(--gold)', transform: 'translateX(-50%)', zIndex: 1, boxShadow: branch.isComingSoon ? 'none' : '0 0 10px rgba(var(--accent-rgb),0.5)' }} />
                  <div className="branch-card" style={{ width: '45%', background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', transition: 'var(--transition)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.95rem', lineHeight: 1.3 }}>{branch.name}</h3>
                      {branch.isComingSoon && <span className="badge badge-warning" style={{ fontSize: '0.6rem', flexShrink: 0 }}>Coming Soon</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.4rem' }}>
                      <FiMapPin size={13} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.55, wordBreak: 'break-word' }}>{branch.address}</p>
                    </div>
                    {branch.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        <FiPhone size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <a href={`tel:${branch.phone}`} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none', wordBreak: 'break-all' }}>{branch.phone}</a>
                      </div>
                    )}
                    {branch.timings && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                        <FiClock size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{branch.timings}</span>
                      </div>
                    )}
                    {branch.googleMapLink && !branch.isComingSoon && (
                      <a href={branch.googleMapLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', gap: '0.3rem', marginTop: '0.25rem' }}>
                        <FiMapPin size={12} /> Get Directions
                      </a>
                    )}
                  </div>
                  <div className="branch-spacer" style={{ width: '45%' }} />
                </div>
              ))}
            </div>

            <style>{`
              @media (max-width: 600px) {
                .branch-spine { left: 14px !important; transform: none !important; }
                .branch-row   { flex-direction: column !important; padding-left: 2.25rem; gap: 0 !important; }
                .branch-card  { width: 100% !important; }
                .branch-spacer{ display: none !important; }
                .branch-node  { left: 14px !important; transform: translateX(-50%) !important; }
              }
            `}</style>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg,#1a1200,#0a0800)', padding: '5rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(var(--accent-rgb),0.1) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="ornament">✦ ✦ ✦</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--gold)', marginBottom: '1rem' }}>
            Discover Your Signature Scent
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-accent)', fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Every bottle tells a story. Every fragrance leaves a memory.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg">Shop Now <FiArrowRight /></Link>
        </div>
      </section>

    </div>
  );
}
