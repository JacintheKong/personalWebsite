// Portal Entry Animation
(function () {
  // Skip portal if already visited this session
  if (sessionStorage.getItem('portal_entered')) {
    var overlay = document.getElementById('portal-overlay');
    if (overlay) overlay.style.display = 'none';
    return;
  }

  // ─── Stars Canvas ───────────────────────────────────────────────────────────
  var canvas = document.getElementById('portal-stars');
  var ctx = canvas.getContext('2d');
  var stars = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (var i = 0; i < 280; i++) {
      stars.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        r:       Math.random() * 1.4 + 0.2,
        opacity: Math.random() * 0.7 + 0.1,
        speed:   Math.random() * 0.008 + 0.002,
        phase:   Math.random() * Math.PI * 2,
      });
    }
  }

  var rafId;
  function animateStars(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function (s) {
      var tw = s.opacity * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,230,255,' + tw + ')';
      ctx.fill();
    });
    rafId = requestAnimationFrame(animateStars);
  }

  window.addEventListener('resize', function () {
    resizeCanvas();
    initStars();
  });

  resizeCanvas();
  initStars();
  requestAnimationFrame(animateStars);

  // ─── SVG Rings ──────────────────────────────────────────────────────────────
  var rings = [
    { r: 85,  color: '#a855f7', width: 2.5, dashPct: 0.69, delay: '0s'    },
    { r: 130, color: '#f97316', width: 2,   dashPct: 0.56, delay: '0.2s'  },
    { r: 175, color: '#22d3ee', width: 2.5, dashPct: 0.77, delay: '0.4s'  },
    { r: 220, color: '#ec4899', width: 2,   dashPct: 0.50, delay: '0.1s'  },
    { r: 258, color: '#4ade80', width: 2,   dashPct: 0.61, delay: '0.6s'  },
  ];

  var svg = document.getElementById('portal-svg');

  rings.forEach(function (ring, i) {
    var circ = 2 * Math.PI * ring.r;
    var arcLen = circ * ring.dashPct;
    var gap    = circ - arcLen;

    var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('cx', '0');
    el.setAttribute('cy', '0');
    el.setAttribute('r',  ring.r);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', ring.color);
    el.setAttribute('stroke-width', ring.width);
    el.setAttribute('stroke-dasharray', arcLen + ' ' + gap);
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('opacity', '0.85');
    el.classList.add('ring', 'ring-' + (i + 1));
    el.style.filter = 'drop-shadow(0 0 4px ' + ring.color + ')';

    svg.appendChild(el);
  });

  // ─── Click Handler ──────────────────────────────────────────────────────────
  var orbWrap   = document.querySelector('.portal-svg-wrap');
  var scene     = document.querySelector('.portal-scene');
  var access    = document.getElementById('portal-access');
  var overlay   = document.getElementById('portal-overlay');
  var radiateWrap = document.getElementById('radiate-wrap');

  orbWrap.addEventListener('click', function () {
    // 1. Hide the portal scene
    scene.style.transition = 'opacity 0.3s ease';
    scene.style.opacity    = '0';
    scene.style.pointerEvents = 'none';

    // 2. Show access granted screen
    setTimeout(function () {
      access.classList.add('active');
      buildAccessGranted();
    }, 350);

    // 3. Fade out and remove overlay after animation
    setTimeout(function () {
      overlay.classList.add('fade-out');
      cancelAnimationFrame(rafId);
    }, 3000);

    setTimeout(function () {
      overlay.style.display = 'none';
      sessionStorage.setItem('portal_entered', '1');
    }, 3800);
  });

  function buildAccessGranted() {
    // Radiate lines
    var numLines = 24;
    for (var i = 0; i < numLines; i++) {
      (function (idx) {
        var line = document.createElement('div');
        line.className = 'radiate-line';
        var angle  = (360 / numLines) * idx;
        var delay  = (idx % 4) * 0.04;
        var hue    = 160 + (idx * 8);
        line.style.transform       = 'rotate(' + angle + 'deg)';
        line.style.animationDelay  = delay + 's';
        line.style.background      = 'linear-gradient(to bottom, hsla(' + hue + ',80%,70%,0.9), transparent)';
        radiateWrap.appendChild(line);
      }(i));
    }

    // Concentric burst rings
    var burstSizes = [80, 160, 260, 380, 520];
    burstSizes.forEach(function (size, idx) {
      var ring = document.createElement('div');
      ring.className = 'ag-ring';
      ring.style.width  = size + 'px';
      ring.style.height = size + 'px';
      ring.style.marginLeft  = (-size / 2) + 'px';
      ring.style.marginTop   = (-size / 2) + 'px';
      ring.style.left = '50%';
      ring.style.top  = '50%';
      ring.style.animationDelay = (idx * 0.1) + 's';
      ring.style.borderColor = 'rgba(94,239,212,' + (0.6 - idx * 0.08) + ')';
      radiateWrap.appendChild(ring);
    });

    // Grid overlay
    var grid = document.createElement('div');
    grid.className = 'ag-grid';
    access.insertBefore(grid, access.firstChild);
  }

  // Prevent body scroll while portal is showing
  document.body.style.overflow = 'hidden';
  document.getElementById('portal-overlay').addEventListener('transitionend', function () {
    document.body.style.overflow = '';
  }, { once: true });

}());
