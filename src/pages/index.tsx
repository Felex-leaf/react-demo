import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import './index.less';

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};

const fadeInUp = {
  hidden: { y: 60, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInLeft = {
  hidden: { x: -80, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInRight = {
  hidden: { x: 80, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isVisible, value, duration]);

  return <div ref={ref}>{displayValue.toLocaleString()}{suffix}</div>;
}

type ProductType = {
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  bgGradient: string;
  accentColor: string;
  visualType: 'pulse' | 'rings' | 'aurora' | 'waves' | 'sphere' | 'prism';
  emoji: string;
};

function ProductShowcase({
  product,
  index,
}: {
  product: ProductType;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const isEven = index % 2 === 0;
  const imageY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.35, 0.15, 0.15, 0.45]);
  const visualScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const textProgress = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      className={`product-showcase ${isEven ? 'layout-right' : 'layout-left'}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={staggerContainer}
    >
      <div className="showcase-bg" style={{ background: product.bgGradient }} />

      <motion.div
        className="showcase-overlay"
        style={{ opacity: overlayOpacity, background: `linear-gradient(${isEven ? 90 : 270}deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 80%)` }}
      />

      <motion.div
        className="showcase-visual"
        style={{ y: imageY, scale: visualScale }}
      >
        <ProductVisual type={product.visualType} accentColor={product.accentColor} emoji={product.emoji} />
      </motion.div>

      <div className="showcase-content">
        <motion.div
          className="showcase-text"
          style={{ y: contentY, opacity: textProgress }}
          variants={isEven ? fadeInRight : fadeInLeft}
        >
          <motion.div
            className="showcase-tag"
            style={{ background: `linear-gradient(135deg, ${product.accentColor}, ${product.accentColor}cc)` }}
          >
            {product.tag}
          </motion.div>
          <motion.h2 className="showcase-title">
            {product.title}
          </motion.h2>
          <motion.h3
            className="showcase-subtitle"
            style={{ color: product.accentColor }}
          >
            {product.subtitle}
          </motion.h3>
          <motion.p className="showcase-description">
            {product.description}
          </motion.p>
          <motion.div className="showcase-bottom">
            <motion.div className="showcase-price" style={{ color: product.accentColor }}>
              {product.price}
            </motion.div>
            <motion.a
              className="showcase-btn"
              href="#"
              style={{
                background: `linear-gradient(135deg, ${product.accentColor}, ${product.accentColor}dd)`,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 20px 60px ${product.accentColor}60`, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              在线选购 <span className="btn-arrow">→</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <div className="showcase-index">
        <span className="index-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="index-line" />
        <span className="index-total">{String(6).padStart(2, '0')}</span>
      </div>
    </motion.section>
  );
}

function ProductVisual({ type, accentColor, emoji }: { type: ProductType['visualType']; accentColor: string; emoji: string }) {
  switch (type) {
    case 'pulse':
      return (
        <div className="visual-container pulse-visual">
          <motion.div
            className="pulse-ring ring-1"
            style={{ borderColor: accentColor }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="pulse-ring ring-2"
            style={{ borderColor: accentColor }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
          <motion.div
            className="pulse-core"
            style={{ background: `radial-gradient(circle at 30% 30%, ${accentColor}, ${accentColor}99 60%, ${accentColor}55 100%)` }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <motion.span
              className="visual-emoji"
              animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {emoji}
            </motion.span>
          </motion.div>
        </div>
      );
    case 'rings':
      return (
        <div className="visual-container rings-visual">
          <motion.div
            className="ring-orbit orbit-1"
            style={{ borderColor: `${accentColor}80`, boxShadow: `inset 0 0 60px ${accentColor}40` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <motion.span style={{ background: accentColor }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.div>
          <motion.div
            className="ring-orbit orbit-2"
            style={{ borderColor: `${accentColor}60` }}
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <motion.span style={{ background: accentColor }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
          </motion.div>
          <motion.div
            className="ring-core"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)` }}
          >
            <span className="visual-emoji">{emoji}</span>
          </motion.div>
        </div>
      );
    case 'aurora':
      return (
        <div className="visual-container aurora-visual">
          <motion.div
            className="aurora-band band-1"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
            animate={{ x: ['-100%', '100%'], y: [0, -40, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="aurora-band band-2"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}cc, transparent)` }}
            animate={{ x: ['-100%', '100%'], y: [0, 30, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="aurora-core"
            style={{ background: `radial-gradient(circle, ${accentColor}dd, ${accentColor}44 60%, transparent)` }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="visual-emoji">{emoji}</span>
          </motion.div>
        </div>
      );
    case 'waves':
      return (
        <div className="visual-container waves-visual">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="wave"
              style={{
                borderColor: `${accentColor}40`,
                animationDelay: `${i * 0.2}s`,
              }}
              animate={{
                scale: [0.4 + i * 0.15, 1 + i * 0.15],
                opacity: [0.7, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
          <motion.div
            className="wave-core"
            style={{ background: `radial-gradient(circle at 40% 40%, ${accentColor}, ${accentColor}bb 50%, ${accentColor}55)` }}
          >
            <motion.span
              className="visual-emoji"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {emoji}
            </motion.span>
          </motion.div>
        </div>
      );
    case 'sphere':
      return (
        <div className="visual-container sphere-visual">
          <motion.div
            className="sphere"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${accentColor}ff, ${accentColor}cc 40%, ${accentColor}66 70%, ${accentColor}22 100%)`,
              boxShadow: `0 0 120px ${accentColor}aa, inset -30px -30px 80px rgba(0,0,0,0.4), inset 20px 20px 60px ${accentColor}66`,
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            <span className="visual-emoji">{emoji}</span>
          </motion.div>
          <motion.div
            className="sphere-highlight"
            style={{ background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.7), transparent 40%)` }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      );
    case 'prism':
      return (
        <div className="visual-container prism-visual">
          <motion.div
            className="prism-shape"
            style={{
              background: `conic-gradient(from 0deg, ${accentColor}, ${accentColor}88, ${accentColor}cc, ${accentColor})`,
              filter: `drop-shadow(0 0 80px ${accentColor}aa)`,
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="prism-inner"
            style={{ background: `radial-gradient(circle, ${accentColor}, ${accentColor}88)` }}
            animate={{ scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="visual-emoji">{emoji}</span>
          </motion.div>
        </div>
      );
  }
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollY } = useScroll();

  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.92]);

  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 300 });
  const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX.set((e.clientX - centerX) / 120);
    mouseY.set((e.clientY - centerY) / 120);
  };

  const parallaxX = useTransform(mouseX, (val) => val);
  const parallaxY = useTransform(mouseY, (val) => val);

  const [navVisible, setNavVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const diff = currentY - lastScrollY.current;
    if (Math.abs(diff) < 5) return;
    if (currentY < 100) {
      setNavVisible(true);
    } else if (diff > 0) {
      setNavVisible(false);
      setMobileMenuOpen(false);
    } else {
      setNavVisible(true);
    }
    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const products: ProductType[] = [
    {
      tag: '新品上市',
      title: '发现全球',
      subtitle: '品质之美',
      description: '精选全球优质商品，汇聚五大洲时尚潮流。每一件商品都经过严格甄选，为您带来独一无二的购物体验。',
      price: '¥299起',
      bgGradient: 'radial-gradient(ellipse at 70% 50%, #2a1f4e 0%, #1a1033 50%, #0a0618 100%)',
      accentColor: '#8b7dff',
      visualType: 'pulse',
      emoji: '💎',
    },
    {
      tag: '热销爆款',
      title: '极致美妆',
      subtitle: '奢宠体验',
      description: '来自世界各地的顶级美妆品牌，从护肤到彩妆，满足您对美的所有追求。',
      price: '¥599起',
      bgGradient: 'radial-gradient(ellipse at 30% 50%, #3a1a3e 0%, #2a0f2e 50%, #140518 100%)',
      accentColor: '#ff6ec7',
      visualType: 'aurora',
      emoji: '💄',
    },
    {
      tag: '精选推荐',
      title: '科技生活',
      subtitle: '未来已来',
      description: '全球最前沿的数码产品，智能设备，让科技真正改变您的生活方式。',
      price: '¥1299起',
      bgGradient: 'radial-gradient(ellipse at 70% 40%, #0a2a4a 0%, #061830 50%, #020a18 100%)',
      accentColor: '#4facfe',
      visualType: 'sphere',
      emoji: '⌚',
    },
    {
      tag: '限时优惠',
      title: '健康生活',
      subtitle: '每日活力',
      description: '来自全球的健康产品，从营养补充到生活方式，让每一天都充满活力。',
      price: '¥199起',
      bgGradient: 'radial-gradient(ellipse at 30% 60%, #0a3a28 0%, #042818 50%, #011408 100%)',
      accentColor: '#43e97b',
      visualType: 'waves',
      emoji: '🌿',
    },
    {
      tag: '全球直邮',
      title: '时尚精选',
      subtitle: '潮流箱包',
      description: '汇聚全球顶级设计师品牌，每一件产品都是工艺与时尚的完美结合。',
      price: '¥899起',
      bgGradient: 'radial-gradient(ellipse at 60% 40%, #3a2010 0%, #241408 50%, #0f0804 100%)',
      accentColor: '#fa709a',
      visualType: 'prism',
      emoji: '👜',
    },
    {
      tag: '品质保证',
      title: '智能家居',
      subtitle: '未来生活',
      description: '全球领先的智能家居品牌，让您的家更加智能、便捷、舒适。',
      price: '¥1599起',
      bgGradient: 'radial-gradient(ellipse at 50% 50%, #2a1a4e 0%, #180e30 50%, #0a0518 100%)',
      accentColor: '#a18cd1',
      visualType: 'rings',
      emoji: '🏠',
    },
  ];

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="home-container">
      <motion.div
        className="scroll-progress"
        style={{ width: progressWidth }}
      />

      <div className="animated-bg">
        <motion.div
          className="gradient-orb orb-1"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="gradient-orb orb-2"
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <AnimatePresence>
        {navVisible && (
          <motion.nav
            key="navbar"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="navbar"
          >
            <div className="nav-inner">
              <motion.div
                className="logo"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="logo-icon">✦</span>
                <span className="logo-text">GLOBAL<span className="logo-accent">X</span></span>
              </motion.div>
              <motion.ul className="nav-links">
                {['首页', '产品中心', '品牌故事', '全球门店', '服务支持'].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ y: -3 }}
                  >
                    <a href="#">{item}</a>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="nav-actions">
                <motion.button
                  className="btn-ghost"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  EN / 中文
                </motion.button>
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  立即选购
                </motion.button>
              </div>
              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                  <span /><span /><span />
                </span>
              </button>
            </div>
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div 
                  className="mobile-menu"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ul className="mobile-nav-links">
                    {['首页', '产品中心', '品牌故事', '全球门店', '服务支持'].map((item, i) => (
                      <li key={i} onClick={() => setMobileMenuOpen(false)}>
                        <a href="#">{item}</a>
                      </li>
                    ))}
                  </ul>
                  <div className="mobile-nav-actions">
                    <button className="btn-ghost">EN / 中文</button>
                    <button className="btn-primary">立即选购</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.section
        className="hero-section"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="hero-decorations">
          <motion.div
            className="hero-particle p-1"
            animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="hero-particle p-2"
            animate={{ y: [0, -20, 0], x: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="hero-particle p-3"
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="hero-particle p-4"
            animate={{ y: [0, -25, 0], x: [0, 20, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="hero-particle p-5"
            animate={{ y: [0, -15, 0], x: [0, -20, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <motion.div
            className="hero-float-shape shape-ring"
            animate={{ rotate: [0, 360], scale: [1, 1.05, 1] }}
            transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, scale: { duration: 4, repeat: Infinity } }}
          />
          <motion.div
            className="hero-float-shape shape-dot"
            animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="hero-grid-lines"
            style={{ y: useTransform(scrollY, [0, 800], [0, -100]) }}
          />
          <motion.div
            className="hero-glow glow-1"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="hero-glow glow-2"
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          />
          <motion.span
            className="art-text art-outline outline-1"
            style={{ y: useTransform(scrollY, [0, 800], [0, -60]) }}
          >
            DISCOVER
          </motion.span>
          <motion.span
            className="art-text art-outline outline-2"
            style={{ y: useTransform(scrollY, [0, 800], [0, 40]) }}
          >
            GLOBAL
          </motion.span>
          <motion.span
            className="art-text art-gradient-text gradient-1"
            style={{ y: useTransform(scrollY, [0, 800], [0, -30]) }}
          >
            全球
          </motion.span>
          <motion.span
            className="art-text art-vertical vertical-left"
          >
            CROSS-BORDER · GLOBAL · QUALITY
          </motion.span>
          <motion.span
            className="art-text art-vertical vertical-right"
          >
            品质 · 全球 · 发现
          </motion.span>
          <motion.span
            className="art-text art-blur blur-1"
            style={{ y: useTransform(scrollY, [0, 800], [0, -80]) }}
          >
            ✦
          </motion.span>
          <motion.span
            className="art-text art-blur blur-2"
            style={{ y: useTransform(scrollY, [0, 800], [0, 50]) }}
          >
            ✧
          </motion.span>
          <motion.span className="art-text art-circle-text">
            QUALITY ·
          </motion.span>
        </div>

        <motion.div
          className="hero-content"
          style={{ x: parallaxX, y: parallaxY }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="hero-badge" variants={fadeInUp}>
            <span className="badge-dot" /> 全球发货 · 48小时送达
          </motion.div>
          <motion.h1 className="hero-title" variants={fadeInUp}>
            <span className="title-main">发现</span>
            <span className="title-gradient"> 全球品质</span>
          </motion.h1>
          <motion.div className="hero-title-caption" variants={fadeInUp}>
            <span className="caption-line" />
            <span className="caption-text">Explore Worldwide Quality</span>
            <span className="caption-line" />
          </motion.div>
          <motion.p className="hero-subtitle" variants={fadeInUp}>
            跨境电商新体验
          </motion.p>
          <motion.p className="hero-description" variants={fadeInUp}>
            精选全球优质商品，汇聚五大洲时尚潮流。从美妆护肤到家居生活，
            每一件商品都经过严格甄选，为您带来独一无二的购物体验。
          </motion.p>
          <motion.div className="hero-stats" variants={fadeInUp}>
            {[
              { num: '100+', label: '合作品牌' },
              { num: '50+', label: '覆盖国家' },
              { num: '98%', label: '好评率' },
              { num: '48h', label: '全球发货' },
            ].map((s, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
          <motion.div className="hero-actions" variants={fadeInUp}>
            <motion.button
              className="btn-hero-primary"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>开始探索</span>
              <span className="btn-arrow">→</span>
            </motion.button>
            <motion.button
              className="btn-hero-secondary"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="play-icon">▶</span>
              <span>观看视频</span>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
          <span>向下滚动探索</span>
        </motion.div>
      </motion.section>

      {products.map((product, index) => (
        <ProductShowcase key={index} product={product} index={index} />
      ))}

      <motion.section
        className="stats-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="stats-bg" />
        <div className="stats-content">
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="stat-icon">🌍</div>
            <div className="stat-value"><AnimatedCounter value={100} suffix="+" /></div>
            <div className="stat-label">覆盖国家</div>
          </motion.div>
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="stat-icon">🏪</div>
            <div className="stat-value"><AnimatedCounter value={2000} suffix="+" /></div>
            <div className="stat-label">合作品牌</div>
          </motion.div>
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="stat-icon">📦</div>
            <div className="stat-value"><AnimatedCounter value={500000} suffix="+" /></div>
            <div className="stat-label">发货订单</div>
          </motion.div>
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="stat-icon">⭐</div>
            <div className="stat-value"><AnimatedCounter value={98} suffix="%" /></div>
            <div className="stat-label">好评率</div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="newsletter-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="newsletter-bg" />
        <motion.div
          className="newsletter-content"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp}>订阅全球优惠资讯</motion.h2>
          <motion.p variants={fadeInUp}>第一时间获取新品上架、限时折扣和专属优惠</motion.p>
          <motion.div className="newsletter-form" variants={fadeInUp}>
            <motion.input
              type="email"
              placeholder="输入您的邮箱地址"
              whileFocus={{ scale: 1.02, borderColor: '#ff6b35' }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              立即订阅
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">✦</span>
              <span className="logo-text">GLOBAL<span className="logo-accent">X</span></span>
            </div>
            <p>跨境电商，全球品质，尽在指尖。</p>
            <div className="social-links">
              {['微', '博', 'Ins', 'FB'].map((s, i) => (
                <motion.div
                  key={i}
                  className="social-icon"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {s}
                </motion.div>
              ))}
            </div>
          </div>
          {[
            { title: '产品分类', links: ['美妆护肤', '服饰箱包', '3C数码', '家居生活', '食品保健'] },
            { title: '客户服务', links: ['帮助中心', '退换货政策', '配送信息', '尺码指南', '联系客服'] },
            { title: '关于我们', links: ['品牌故事', '加入我们', '媒体报道', '可持续发展', '企业责任'] },
          ].map((col, i) => (
            <div key={i} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link, j) => (
                  <motion.li
                    key={j}
                    whileHover={{ x: 5, color: '#ff6b35' }}
                  >
                    <a href="#">{link}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© 2026 GLOBALX. All Rights Reserved. 全球跨境电商平台</p>
        </div>
      </footer>
    </div>
  );
}
