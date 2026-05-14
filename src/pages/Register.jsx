import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATIONERY = [
  { emoji: '✏️', x: 7,  y: 10, delay: 0,   size: 28 },
  { emoji: '📎', x: 87, y: 7,  delay: 0.4, size: 22 },
  { emoji: '📐', x: 91, y: 68, delay: 0.8, size: 26 },
  { emoji: '📏', x: 4,  y: 74, delay: 1.2, size: 24 },
  { emoji: '🖊️', x: 52, y: 3,  delay: 0.6, size: 20 },
  { emoji: '📌', x: 76, y: 42, delay: 1.0, size: 18 },
  { emoji: '✂️', x: 14, y: 44, delay: 1.4, size: 22 },
  { emoji: '📓', x: 38, y: 93, delay: 0.2, size: 26 },
  { emoji: '🖋️', x: 66, y: 90, delay: 1.6, size: 20 },
  { emoji: '📦', x: 24, y: 87, delay: 0.9, size: 18 },
];

const SPARKLE_COLORS = ['#f0c2ff', '#d4a0ff', '#a259e6', '#fce4ff'];

function Sparkle({ x, y, color, size }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, width: size, height: size, pointerEvents: 'none' }}
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

const FIELDS = [
  { label: 'Full Name',        field: 'name',     type: 'text',     icon: '👤', placeholder: 'Jane Doe' },
  { label: 'Email',            field: 'email',    type: 'email',    icon: '📧', placeholder: 'you@example.com' },
  { label: 'Password',         field: 'password', type: 'password', icon: '🔒', placeholder: '••••••••' },
  { label: 'Confirm Password', field: 'confirm',  type: 'password', icon: '🔑', placeholder: '••••••••' },
  { label: 'Phone Number',     field: 'phone',    type: 'text',     icon: '📱', placeholder: '10-digit number' },
  { label: 'Address',          field: 'address',  type: 'text',     icon: '🏠', placeholder: 'Your delivery address' },
  { label: 'Pincode',          field: 'pincode',  type: 'text',     icon: '📮', placeholder: '6-digit pincode' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', phone:'', address:'', pincode:'' });
  const [showPwd, setShowPwd]   = useState({ password: false, confirm: false });
  const [error, setError]       = useState('');
  const [sparkles, setSparkles] = useState([]);
  const cardRef = useRef(null);

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (left + width / 2));
    mouseY.set(e.clientY - (top  + height / 2));
  };

  const set = (field) => (e) => {
    let val = e.target.value;
    if (field === 'phone')   val = val.replace(/[^0-9]/g, '').slice(0, 10);
    if (field === 'pincode') val = val.replace(/[^0-9]/g, '').slice(0, 6);
    setForm(p => ({ ...p, [field]: val }));
    setError('');
  };

  const spawnSparkles = (btnEl) => {
    const { left, top, width, height } = btnEl.getBoundingClientRect();
    const cx = left + width / 2, cy = top + height / 2;
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

  const handleRegister = (e) => {
    if (e?.currentTarget) spawnSparkles(e.currentTarget);
    const { name, email, password, confirm, phone, address, pincode } = form;
    if (!name || !email || !password || !confirm || !phone || !address || !pincode) {
      setError('Please fill in all fields.'); return;
    }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!/^[0-9]{10}$/.test(phone))   { setError('Phone number must be exactly 10 digits.'); return; }
    if (!/^[0-9]{6}$/.test(pincode))  { setError('Pincode must be exactly 6 digits.'); return; }
    register({ name, email, password, phone, address, pincode });
    navigate('/home');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .rp-page {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #0f001a;
          overflow: hidden; position: relative;
          padding: 40px 16px;
        }
        .rp-bg {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 65% 55% at 15% 25%, rgba(188,114,244,.22) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 85% 75%, rgba(120,40,200,.18) 0%, transparent 70%),
            radial-gradient(ellipse 42% 62% at 55% 5%,  rgba(230,160,255,.12) 0%, transparent 70%),
            #0f001a;
        }
        .rp-aurora { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .rp-blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: .18;
          animation: rpBlobDrift 14s ease-in-out infinite alternate;
        }
        .rp-blob:nth-child(1){ width:500px;height:500px;background:#bc72f4;left:-150px;top:-100px;animation-delay:0s; }
        .rp-blob:nth-child(2){ width:400px;height:400px;background:#7a28c8;right:-100px;bottom:-80px;animation-delay:-5s; }
        .rp-blob:nth-child(3){ width:300px;height:300px;background:#e8a8ff;left:42%;top:45%;animation-delay:-9s; }
        @keyframes rpBlobDrift { from{transform:translate(0,0) scale(1)} to{transform:translate(40px,30px) scale(1.12)} }

        .rp-float {
          position: fixed; z-index: 1; pointer-events: none;
          animation: rpFloat 8s ease-in-out infinite alternate;
          filter: drop-shadow(0 2px 8px rgba(188,114,244,.3));
        }
        @keyframes rpFloat {
          0%  { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-14px) rotate(3deg); }
          100%{ transform: translateY(4px) rotate(-1deg); }
        }

        .rp-sparkles { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }

        /* Card */
        .rp-card {
          position: relative; z-index: 10;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(188,114,244,.28);
          border-radius: 24px;
          padding: 2.6rem 2.4rem 2.4rem;
          width: 100%; max-width: 430px;
          backdrop-filter: blur(28px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.06) inset,
            0 8px 40px rgba(0,0,0,.5),
            0 0 80px rgba(188,114,244,.12);
          transform-style: preserve-3d;
        }
        .rp-card-glow {
          position: absolute; top:-1px; left:50%; transform:translateX(-50%);
          width:60%; height:3px;
          background:linear-gradient(90deg,transparent,#bc72f4,#e8a0ff,#bc72f4,transparent);
          border-radius:0 0 50% 50%; filter:blur(2px);
        }

        /* Brand */
        .rp-brand { display:flex; flex-direction:column; align-items:center; gap:8px; margin-bottom:6px; }
        .rp-brand-name {
          font-family:'Playfair Display',serif; font-size:26px; font-weight:700;
          background:linear-gradient(135deg,#e8c8ff,#bc72f4);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          text-align:center;
        }
        .rp-subtitle { font-size:13px; color:rgba(200,150,255,.6); margin-bottom:1.6rem; font-weight:300; letter-spacing:.3px; text-align:center; }

        /* Progress bar */
        .rp-progress-wrap { display:flex; gap:5px; margin-bottom:1.6rem; }
        .rp-progress-dot {
          flex:1; height:3px; border-radius:2px;
          background: rgba(188,114,244,.18);
          transition: background .35s;
        }
        .rp-progress-dot.filled { background: linear-gradient(90deg,#bc72f4,#e8a0ff); }

        /* Fields */
        .rp-field { margin-bottom:1.1rem; }
        .rp-label { display:block; font-size:11.5px; font-weight:600; color:rgba(210,170,255,.7); margin-bottom:7px; text-transform:uppercase; letter-spacing:.9px; }
        .rp-input-wrap { position:relative; }
        .rp-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:13px; opacity:.4; pointer-events:none; transition:opacity .2s; }
        .rp-input-wrap:focus-within .rp-input-icon { opacity:.9; }
        .rp-input {
          width:100%; padding:11px 14px 11px 38px;
          font-size:14px; font-family:'DM Sans',sans-serif;
          border:1px solid rgba(188,114,244,.22); border-radius:10px;
          background:rgba(255,255,255,.05); color:#f0d8ff; outline:none;
          transition:border-color .2s, box-shadow .2s, background .2s;
        }
        .rp-input::placeholder { color:rgba(180,130,220,.32); }
        .rp-input:focus {
          border-color:#bc72f4; background:rgba(188,114,244,.09);
          box-shadow:0 0 0 3px rgba(188,114,244,.18);
        }
        .rp-eye {
          position:absolute; right:12px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; font-size:14px;
          opacity:.45; color:#e8c8ff; transition:opacity .2s; padding:2px;
        }
        .rp-eye:hover { opacity:1; }

        .rp-error {
          background: rgba(255,107,138,.1);
          border: 1px solid rgba(255,107,138,.3);
          border-radius: 9px;
          padding: 10px 14px;
          font-size: 12.5px; color: #ff9ab5; font-weight:500;
          margin-bottom: 1rem;
          display:flex; align-items:center; gap:8px;
        }

        /* Button */
        .rp-btn {
          width:100%; padding:13px; font-size:14.5px; font-weight:600;
          font-family:'DM Sans',sans-serif; letter-spacing:.5px;
          background:linear-gradient(135deg,#bc72f4 0%,#7a28c8 100%);
          color:#fff; border:none; border-radius:11px; cursor:pointer;
          position:relative; overflow:hidden;
          transition:box-shadow .2s, transform .15s;
          box-shadow:0 4px 22px rgba(188,114,244,.48);
        }
        .rp-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.13) 0%,transparent 60%); pointer-events:none; }
        .rp-btn::after {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
          transform:skewX(-20deg); animation:rpBtnShine 4s ease-in-out infinite;
        }
        @keyframes rpBtnShine { 0%,65%{left:-100%} 100%{left:160%} }
        .rp-btn:hover { box-shadow:0 6px 30px rgba(188,114,244,.65); transform:translateY(-1px); }
        .rp-btn:active { transform:translateY(1px); box-shadow:0 2px 10px rgba(188,114,244,.35); }

        .rp-back { text-align:center; margin-top:1.1rem; font-size:13.5px; color:rgba(180,140,220,.62); }
        .rp-back a { color:#d48fff; font-weight:600; text-decoration:none; transition:color .2s; }
        .rp-back a:hover { color:#f0c2ff; }

        /* Trust row */
        .rp-trust { display:flex; align-items:center; justify-content:center; gap:18px; margin-top:1.4rem; padding-top:1.3rem; border-top:1px solid rgba(188,114,244,.1); }
        .rp-trust-item { display:flex; align-items:center; gap:5px; font-size:10.5px; color:rgba(180,130,220,.48); font-weight:500; }
      `}</style>

      <div
        className="rp-page"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      >
        <div className="rp-bg" />
        <div className="rp-aurora">
          <div className="rp-blob" /><div className="rp-blob" /><div className="rp-blob" />
        </div>

        {/* Floating stationery */}
        {STATIONERY.map((item, i) => (
          <motion.div
            key={i}
            className="rp-float"
            style={{ left:`${item.x}%`, top:`${item.y}%`, fontSize: item.size, animationDelay:`${item.delay * -8}s` }}
            initial={{ opacity:0, scale:0 }}
            animate={{ opacity:.5, scale:1 }}
            transition={{ delay: item.delay + 0.4, type:'spring', stiffness:110 }}
          >
            {item.emoji}
          </motion.div>
        ))}

        {/* Sparkles */}
        <div className="rp-sparkles">
          <AnimatePresence>
            {sparkles.map(sp => <Sparkle key={sp.id} {...sp} />)}
          </AnimatePresence>
        </div>

        {/* Card */}
        <motion.div
          ref={cardRef}
          className="rp-card"
          style={{ rotateX, rotateY }}
          initial={{ opacity:0, y:44, scale:.95 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:.65, ease:[.22,1,.36,1] }}
        >
          <div className="rp-card-glow" />

          {/* Animated logo + title */}
          <motion.div className="rp-brand"
            initial={{ opacity:0, y:-50, rotate:-12 }}
            animate={{ opacity:1, y:0, rotate:0 }}
            transition={{ delay:.15, type:'spring', stiffness:180, damping:14 }}
          >
            <motion.svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate:[0,-8,8,-4,4,0] }}
              transition={{ delay:.6, duration:.8, ease:'easeInOut' }}
              style={{ filter:'drop-shadow(0 4px 18px rgba(188,114,244,0.55))' }}
            >
              <rect x="10" y="8" width="40" height="48" rx="5" fill="url(#rpLogoGrad)" />
              <rect x="10" y="8" width="8" height="48" rx="4" fill="rgba(0,0,0,0.18)" />
              {[16,24,32,40,48].map((cy,i) => <circle key={i} cx="14" cy={cy} r="3" fill="#fff" opacity="0.7" />)}
              <rect x="24" y="20" width="20" height="2.5" rx="1.2" fill="rgba(255,255,255,0.45)" />
              <rect x="24" y="27" width="16" height="2.5" rx="1.2" fill="rgba(255,255,255,0.35)" />
              <rect x="24" y="34" width="18" height="2.5" rx="1.2" fill="rgba(255,255,255,0.35)" />
              <motion.g
                animate={{ rotate:[0,12,-6,10,0] }}
                transition={{ delay:.9, duration:.7, ease:'easeInOut' }}
                style={{ transformOrigin:'48px 44px' }}
              >
                <rect x="44" y="30" width="6" height="22" rx="1.5" fill="#f5c842" />
                <polygon points="44,52 50,52 47,58" fill="#f0a830" />
                <rect x="44" y="30" width="6" height="4" rx="1" fill="#e8aaaa" />
                <rect x="44" y="34" width="6" height="2" rx="0" fill="#c0776e" />
              </motion.g>
              <defs>
                <linearGradient id="rpLogoGrad" x1="10" y1="8" x2="50" y2="56" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d48fff" />
                  <stop offset="100%" stopColor="#7a28c8" />
                </linearGradient>
              </defs>
            </motion.svg>
            <span className="rp-brand-name">StatioShop</span>
          </motion.div>

          <motion.p className="rp-subtitle" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.38 }}>
            Create your account
          </motion.p>

          {/* Progress dots — fill as fields are completed */}
          <motion.div className="rp-progress-wrap" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.42 }}>
            {FIELDS.map(({ field }) => (
              <div key={field} className={`rp-progress-dot${form[field] ? ' filled' : ''}`} />
            ))}
          </motion.div>

          {/* Fields */}
          {FIELDS.map(({ label, field, type, icon, placeholder }, i) => {
            const isPwd = type === 'password';
            const visible = isPwd ? showPwd[field] : false;
            return (
              <motion.div
                className="rp-field"
                key={field}
                initial={{ opacity:0, x:-16 }}
                animate={{ opacity:1, x:0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
              >
                <label className="rp-label">{label}</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">{icon}</span>
                  <input
                    className="rp-input"
                    type={isPwd ? (visible ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={set(field)}
                    style={isPwd ? { paddingRight:'38px' } : {}}
                  />
                  {isPwd && (
                    <button className="rp-eye" type="button"
                      onClick={() => setShowPwd(p => ({ ...p, [field]: !p[field] }))}>
                      {visible ? '🙈' : '👁️'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div className="rp-error"
                initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                transition={{ duration:.2 }}
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <motion.button
            className="rp-btn"
            onClick={handleRegister}
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:.92 }}
            whileTap={{ scale:.97 }}
          >
            Create Account ✨
          </motion.button>

          <motion.p className="rp-back" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.98 }}>
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </motion.p>

          {/* Trust badges */}
          <motion.div className="rp-trust" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.02 }}>
            <div className="rp-trust-item">🔒 Secure</div>
            <div className="rp-trust-item">⚡ Instant</div>
            <div className="rp-trust-item">🎁 Rewards</div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
