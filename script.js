// public/script.js

// 1. Subtle Twinkling Starfield
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, stars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(Math.floor((width * height) / 12000), 110);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.3,
      alpha: Math.random() * 0.5 + 0.15,
      speed: Math.random() * 0.015 + 0.004,
      phase: Math.random() * Math.PI * 2,
      tint: Math.random() > 0.78
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      s.phase += s.speed;
      const a = Math.max(0.05, Math.min(0.85, s.alpha + Math.sin(s.phase) * 0.25));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.tint ? `rgba(244, 165, 220, ${a})` : `rgba(255, 255, 255, ${a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// 2. Waitlist Form Submission -> Express API
(function initWaitlistForm() {
  const form = document.getElementById('notifyForm');
  const input = document.getElementById('notifyInput');
  const msg = document.getElementById('formMessage');
  if (!form || !input || !msg) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  const API_BASE =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000'
      : 'https://api.thegridgaming.fun';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const val = input.value.trim();
    msg.classList.remove('hidden', 'text-emerald-400', 'text-rose-400');

    if (val.length < 5) {
      msg.textContent = 'Please enter a valid WhatsApp number or email.';
      msg.classList.add('text-rose-400');
      input.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
    }

    try {
      const res = await fetch(`${API_BASE}/api/public/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: val })
      });

      const data = await res.json();

      if (res.ok) {
        msg.textContent = `Saved! We’ll alert ${val} when booking goes live.`;
        msg.classList.add('text-emerald-400');
        input.value = '';
      } else {
        msg.textContent = data.message || 'Something went wrong. Please try again.';
        msg.classList.add('text-rose-400');
      }
    } catch {
      msg.textContent = 'Network error. Please try again.';
      msg.classList.add('text-rose-400');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Notify Me';
      }
    }
  });
})();