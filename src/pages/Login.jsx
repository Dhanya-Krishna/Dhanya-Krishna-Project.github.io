import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

// Floating stationery icons scattered around the page
const STATIONERY = [
  { emoji: '✏️', x: 8,  y: 12, delay: 0,   size: 28 },
  { emoji: '📎', x: 85, y: 8,  delay: 0.4, size: 22 },
  { emoji: '📐', x: 92, y: 70, delay: 0.8, size: 26 },
  { emoji: '📏', x: 5,  y: 75, delay: 1.2, size: 24 },
  { emoji: '🖊️', x: 50, y: 4,  delay: 0.6, size: 20 },
  { emoji: '📌', x: 78, y: 40, delay: 1.0, size: 18 },
  { emoji: '✂️', x: 15, y: 45, delay: 1.4, size: 22 },
  { emoji: '📓', x: 40, y: 91, delay: 0.2, size: 26 },
  { emoji: '🖋️', x: 68, y: 88, delay: 1.6, size: 20 },
  { emoji: '📦', x: 22, y: 88, delay: 0.9, size: 18 },
];

const SPARKLE_COLORS = ['#f0c2ff', '#d4a0ff', '#a259e6', '#fce4ff'];

function Sparkle({ x, y, color, size }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, width: size, height: size, pointerEvents: 'none', zIndex: 0 }}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 90, 180] }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <svg viewBox="0 0 20 20" fill={color} width={size} height={size}>
        <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
      </svg>
    </motion.div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [toast, setToast]       = useState(null);
  const [sparkles, setSparkles] = useState([]);
  const [showPwd, setShowPwd]   = useState(false);
  const cardRef = useRef(null);

  // 3-D tilt on mouse move
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [6, -6]);
  const rotateY = useTransform(mouseX, [-300, 300], [-6, 6]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (left + width / 2));
    mouseY.set(e.clientY - (top  + height / 2));
  };

  const spawnSparkles = (btnEl) => {
    const { left, top, width, height } = btnEl.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top  + height / 2;
    const batch = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: cx - 8 + (Math.random() - 0.5) * 90,
      y: cy - 8 + (Math.random() - 0.5) * 55,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      size: 10 + Math.random() * 14,
    }));
    setSparkles(s => [...s, ...batch]);
    setTimeout(() => setSparkles(s => s.filter(sp => !batch.find(b => b.id === sp.id))), 900);
  };

  const validate = () => {
    const errs = {};
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) errs.email = 'Email cannot be empty.';
    else if (!re.test(email)) errs.email = 'Please enter a valid email address.';
    if (!password) errs.password = 'Password cannot be empty.';
    return errs;
  };

  const handleLogin = (e) => {
    if (e?.currentTarget) spawnSparkles(e.currentTarget);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = login(email.trim(), password);
    if (!result.ok) {
      if (result.field) setErrors({ [result.field]: result.message });
      setToast({ message: result.message, type: 'error' });
      return;
    }
    setToast({ message: 'Login successful! Redirecting…', type: 'success' });
    setTimeout(() => navigate('/home'), 1500);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <>
      {/* ── Styles ─────────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        /* Page & background */
        .lp-page {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #0f001a;
          overflow: hidden;
          position: relative;
        }
        .lp-bg {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 65% 55% at 18% 28%, rgba(188,114,244,.22) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 82% 72%, rgba(120,40,200,.18) 0%, transparent 70%),
            radial-gradient(ellipse 42% 62% at 58% 8%,  rgba(230,160,255,.12) 0%, transparent 70%),
            #0f001a;
        }
        /* Aurora blobs */
        .lp-aurora { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .lp-blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: .18;
          animation: blobDrift 14s ease-in-out infinite alternate;
        }
        .lp-blob:nth-child(1){ width:500px;height:500px;background:#bc72f4;left:-150px;top:-100px;animation-delay:0s; }
        .lp-blob:nth-child(2){ width:400px;height:400px;background:#7a28c8;right:-100px;bottom:-80px;animation-delay:-5s; }
        .lp-blob:nth-child(3){ width:300px;height:300px;background:#e8a8ff;left:40%;top:50%;animation-delay:-9s; }
        .logo-graphic {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  filter: drop-shadow(0 0 12px rgba(180,160,255,0.6));
  transition: all 0.4s ease-in-out;
  animation: waveAnimation 8s linear infinite;
}
@keyframes waveAnimation {
  0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
}
.logo-graphic:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 24px rgba(180,160,255,0.95));
  animation-play-state: paused;
}

        /* Floating stationery */
        .lp-float {
          position: fixed; font-size: 24px; z-index: 1; pointer-events: none;
          animation: floatDrift 8s ease-in-out infinite alternate;
          filter: drop-shadow(0 2px 8px rgba(188,114,244,.3));
        }
        @keyframes floatDrift {
          0%  { transform: translateY(0)    rotate(-3deg); }
          50% { transform: translateY(-14px) rotate(3deg); }
          100%{ transform: translateY(4px)  rotate(-1deg); }
        }

        /* Sparkle layer */
        .lp-sparkles { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }

        /* Card */
        .lp-card {
          position: relative; z-index: 10;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(188,114,244,.28);
          border-radius: 24px;
          padding: 2.8rem 2.4rem 2.4rem;
          width: 100%; max-width: 415px;
          backdrop-filter: blur(28px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.06) inset,
            0 8px 40px rgba(0,0,0,.5),
            0 0 80px rgba(188,114,244,.12);
          transform-style: preserve-3d;
          perspective: 800px;
        }
        .lp-card-glow {
          position: absolute; top:-1px; left:50%; transform:translateX(-50%);
          width:60%; height:3px;
          background:linear-gradient(90deg,transparent,#bc72f4,#e8a0ff,#bc72f4,transparent);
          border-radius:0 0 50% 50%; filter:blur(2px);
        }

        /* Brand */
        .lp-brand { display:flex; flex-direction:column; align-items:center; gap:8px; margin-bottom:6px; }
        .lp-brand-icon {
          width:38px; height:38px;
          background:linear-gradient(135deg,#bc72f4,#7a28c8);
          border-radius:10px; display:flex; align-items:center; justify-content:center;
          font-size:18px; box-shadow:0 4px 14px rgba(188,114,244,.45);
          animation: iconPop .7s cubic-bezier(.22,1,.36,1) .3s both;
        }
        @keyframes iconPop { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }
        .lp-brand-name {
          font-family:'Playfair Display',serif; font-size:26px; font-weight:700;
          background:linear-gradient(135deg,#e8c8ff,#bc72f4);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          letter-spacing:-.3px; text-align:center;
        }
        .lp-subtitle { font-size:13px; color:rgba(200,150,255,.6); margin-bottom:1.8rem; font-weight:300; letter-spacing:.3px; text-align:center; }

        /* Illustration strip */
        .lp-strip {
          display:flex; align-items:center; justify-content:center; gap:14px;
          margin-bottom:1.75rem; padding:13px 16px;
          background:rgba(188,114,244,.08); border:1px solid rgba(188,114,244,.15);
          border-radius:14px; overflow:hidden;
        }
        .lp-strip-item { display:flex; flex-direction:column; align-items:center; gap:4px; }
        .lp-strip-emoji {
          font-size:24px; filter:drop-shadow(0 2px 6px rgba(188,114,244,.4));
          animation:stripBounce 3s ease-in-out infinite;
        }
        .lp-strip-item:nth-child(1) .lp-strip-emoji{ animation-delay:0s }
        .lp-strip-item:nth-child(2) .lp-strip-emoji{ animation-delay:.35s }
        .lp-strip-item:nth-child(3) .lp-strip-emoji{ animation-delay:.7s }
        .lp-strip-item:nth-child(4) .lp-strip-emoji{ animation-delay:1.05s }
        .lp-strip-item:nth-child(5) .lp-strip-emoji{ animation-delay:1.4s }
        @keyframes stripBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .lp-strip-label { font-size:9px; color:rgba(200,150,255,.45); text-transform:uppercase; letter-spacing:.5px; font-weight:500; }

        /* Fields */
        .lp-field { margin-bottom:1.2rem; }
        .lp-label { display:block; font-size:11.5px; font-weight:600; color:rgba(210,170,255,.7); margin-bottom:7px; text-transform:uppercase; letter-spacing:.9px; }
        .lp-input-wrap { position:relative; }
        .lp-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:13px; opacity:.4; pointer-events:none; transition:opacity .2s; }
        .lp-input-wrap:focus-within .lp-input-icon { opacity:.9; }
        .lp-input {
          width:100%; padding:11px 14px 11px 38px;
          font-size:14px; font-family:'DM Sans',sans-serif;
          border:1px solid rgba(188,114,244,.22); border-radius:10px;
          background:rgba(255,255,255,.05); color:#f0d8ff; outline:none;
          transition:border-color .2s, box-shadow .2s, background .2s;
        }
        .lp-input::placeholder { color:rgba(180,130,220,.32); }
        .lp-input:focus {
          border-color:#bc72f4; background:rgba(188,114,244,.09);
          box-shadow:0 0 0 3px rgba(188,114,244,.18);
        }
        .lp-input.err { border-color:#ff6b8a; box-shadow:0 0 0 3px rgba(255,107,138,.15); }
        .lp-eye {
          position:absolute; right:12px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; font-size:14px;
          opacity:.45; color:#e8c8ff; transition:opacity .2s; padding:2px;
        }
        .lp-eye:hover { opacity:1; }
        .lp-err { font-size:11.5px; color:#ff6b8a; display:block; margin-top:5px; font-weight:500; }

        .lp-forgot { text-align:right; margin-top:-.5rem; margin-bottom:1.1rem; }
        .lp-forgot-link { font-size:11.5px; color:rgba(188,114,244,.7); text-decoration:none; transition:color .2s; }
        .lp-forgot-link:hover { color:#e0aaff; }

        /* Button */
        .lp-btn {
          width:100%; padding:13px; font-size:14.5px; font-weight:600;
          font-family:'DM Sans',sans-serif; letter-spacing:.5px;
          background:linear-gradient(135deg,#bc72f4 0%,#7a28c8 100%);
          color:#fff; border:none; border-radius:11px; cursor:pointer;
          position:relative; overflow:hidden;
          transition:box-shadow .2s, transform .15s;
          box-shadow:0 4px 22px rgba(188,114,244,.48);
        }
        .lp-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.13) 0%,transparent 60%); pointer-events:none; }
        .lp-btn::after {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
          transform:skewX(-20deg); animation:btnShine 4s ease-in-out infinite;
        }
        @keyframes btnShine { 0%,65%{left:-100%} 100%{left:160%} }
        .lp-btn:hover { box-shadow:0 6px 30px rgba(188,114,244,.65); transform:translateY(-1px); }
        .lp-btn:active { transform:translateY(1px); box-shadow:0 2px 10px rgba(188,114,244,.35); }


        .lp-reg { text-align:center; font-size:13.5px; color:rgba(180,140,220,.62); }
        .lp-reg a { color:#d48fff; font-weight:600; text-decoration:none; transition:color .2s; }
        .lp-reg a:hover { color:#f0c2ff; }

        /* Trust row */
        .lp-trust { display:flex; align-items:center; justify-content:center; gap:18px; margin-top:1.4rem; padding-top:1.3rem; border-top:1px solid rgba(188,114,244,.1); }
        .lp-trust-item { display:flex; align-items:center; gap:5px; font-size:10.5px; color:rgba(180,130,220,.48); font-weight:500; }
      `}</style>

      {/* ── Page shell ───────────────────────────────────────────────────── */}
      <div
        className="lp-page"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      >
        <div className="lp-bg" />

        {/* Aurora */}
        <div className="lp-aurora">
          <div className="lp-blob" /><div className="lp-blob" /><div className="lp-blob" />
        </div>

        {/* Floating stationery */}
        {STATIONERY.map((item, i) => (
          <motion.div
            key={i}
            className="lp-float"
            style={{ left: `${item.x}%`, top: `${item.y}%`, fontSize: item.size, animationDelay: `${item.delay * -8}s` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: .55, scale: 1 }}
            transition={{ delay: item.delay + 0.5, type: 'spring', stiffness: 110 }}
          >
            {item.emoji}
          </motion.div>
        ))}

        {/* Sparkle layer */}
        <div className="lp-sparkles">
          <AnimatePresence>
            {sparkles.map(sp => <Sparkle key={sp.id} {...sp} />)}
          </AnimatePresence>
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <motion.div
          ref={cardRef}
          className="lp-card"
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0, y: 44, scale: .95 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          transition={{ duration: .65, ease: [.22, 1, .36, 1] }}
        >
          <div className="lp-card-glow" />

          {/* Brand */}
          <motion.div className="lp-brand"
            initial={{ opacity:0, y:-60, rotate: -15 }}
            animate={{ opacity:1, y:0, rotate: 0 }}
            transition={{ delay:.15, type:'spring', stiffness:180, damping:14 }}
          >
            {/* Animated SVG logo */}
            <img src="/Logo.jpeg" alt="StatioShop Logo" className="logo-graphic" />
            <span className="lp-brand-name">StatioShop</span>
          </motion.div>
          <motion.p className="lp-subtitle" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.38 }}>
            Your premium stationery destination
          </motion.p>

          {/* Illustration strip */}
          <motion.div className="lp-strip" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.44 }}>
            {[['📔','Journals'],['🖊️','Pens'],['📐','Rulers'],['🎨','Art'],['📎','Clips']].map(([e,l],i) => (
              <div className="lp-strip-item" key={i}>
                <span className="lp-strip-emoji">{e}</span>
                <span className="lp-strip-label">{l}</span>
              </div>
            ))}
          </motion.div>

          {/* Email */}
          <motion.div className="lp-field" initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.50 }}>
            <label className="lp-label">Email</label>
            <div className="lp-input-wrap">
              <span className="lp-input-icon">📧</span>
              <input
                className={`lp-input${errors.email ? ' err' : ''}`}
                type="email" placeholder="you@example.com" value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email:'' })); }}
                onKeyDown={handleKeyDown}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.span className="lp-err" initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} transition={{ duration:.2 }}>
                  {errors.email}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password */}
          <motion.div className="lp-field" initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.56 }}>
            <label className="lp-label">Password</label>
            <div className="lp-input-wrap">
              <span className="lp-input-icon">🔒</span>
              <input
                className={`lp-input${errors.password ? ' err' : ''}`}
                type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password:'' })); }}
                onKeyDown={handleKeyDown}
                style={{ paddingRight:'38px' }}
              />
              <button className="lp-eye" type="button" onClick={() => setShowPwd(s => !s)}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.span className="lp-err" initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} transition={{ duration:.2 }}>
                  {errors.password}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div className="lp-forgot" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.60 }}>
            <a href="#" className="lp-forgot-link">Forgot password?</a>
          </motion.div>

          {/* CTA */}
          <motion.button
            className="lp-btn"
            onClick={handleLogin}
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:.64 }}
            whileTap={{ scale:.97 }}
          >
            Sign in to StatioShop ✨
          </motion.button>

          <motion.p className="lp-reg" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.78 }}>
            New to StatioShop?{' '}<Link to="/register">Create an account</Link>
          </motion.p>

          {/* Trust badges */}
          <motion.div className="lp-trust" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.84 }}>
            <div className="lp-trust-item">🔒 Secure Login</div>
            <div className="lp-trust-item">⚡ Instant Access</div>
            <div className="lp-trust-item">🎁 Rewards</div>
          </motion.div>
        </motion.div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}

