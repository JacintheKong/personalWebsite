// Comet Cursor Effect with Particle Trail
(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    particleCount: 3,           // Particles spawned per frame
    particleLifespan: 800,      // Particle lifespan in ms
    minParticleSize: 2,         // Min particle size in px
    maxParticleSize: 6,         // Max particle size in px
    particleColors: [           // Array of particle colors
      '#4a90e2',
      '#5ba3f5',
      '#6bb6ff',
      '#7ec8ff',
      '#ffffff'
    ],
    spawnInterval: 16,          // Spawn particles every ~16ms (60fps)
    maxParticles: 50,           // Maximum particles on screen
    particleSpread: 8           // Random offset spread in pixels
  };

  // State
  let mouseX = 0;
  let mouseY = 0;
  let lastSpawnTime = 0;
  let cometCursor = null;
  let particlePool = [];
  let activeParticles = [];
  let rafId = null;
  let isTouch = false;

  // Detect touch device
  function isTouchDevice() {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
  }

  // Initialize
  function init() {
    // Skip on touch devices
    if (isTouchDevice()) {
      isTouch = true;
      return;
    }

    // Create comet cursor element
    cometCursor = document.createElement('div');
    cometCursor.className = 'comet-cursor';
    document.body.appendChild(cometCursor);

    // Create particle pool for better performance
    createParticlePool();

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Interactive element hover detection
    setupHoverDetection();

    // Start animation loop
    animate();
  }

  // Create reusable particle pool
  function createParticlePool() {
    for (let i = 0; i < CONFIG.maxParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'comet-particle';
      particle.style.display = 'none';
      document.body.appendChild(particle);
      particlePool.push(particle);
    }
  }

  // Handle mouse move
  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  // Handle mouse enter
  function handleMouseEnter() {
    if (cometCursor) {
      cometCursor.style.opacity = '1';
    }
  }

  // Handle mouse leave
  function handleMouseLeave() {
    if (cometCursor) {
      cometCursor.style.opacity = '0';
    }
  }

  // Setup hover detection for interactive elements
  function setupHoverDetection() {
    const interactiveSelectors = 'a, button, input, select, textarea, [role="button"], .navigation li';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('comet-hovering');
      }
    }, true);

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('comet-hovering');
      }
    }, true);
  }

  // Get particle from pool
  function getParticle() {
    // Find inactive particle
    for (let i = 0; i < particlePool.length; i++) {
      const particle = particlePool[i];
      if (particle.style.display === 'none') {
        return particle;
      }
    }
    return null;
  }

  // Spawn particle
  function spawnParticle(x, y) {
    const particle = getParticle();
    if (!particle) return;

    // Random size
    const size = CONFIG.minParticleSize +
                 Math.random() * (CONFIG.maxParticleSize - CONFIG.minParticleSize);

    // Random color
    const color = CONFIG.particleColors[
      Math.floor(Math.random() * CONFIG.particleColors.length)
    ];

    // Random offset for spread
    const offsetX = (Math.random() - 0.5) * CONFIG.particleSpread;
    const offsetY = (Math.random() - 0.5) * CONFIG.particleSpread;

    // Set particle properties
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x + offsetX}px`;
    particle.style.top = `${y + offsetY}px`;
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    particle.style.display = 'block';
    particle.style.opacity = '1';
    particle.style.transform = 'scale(1)';

    // Add to active particles
    const particleData = {
      element: particle,
      birthTime: Date.now()
    };
    activeParticles.push(particleData);

    // Animate particle fade
    particle.style.animation = `particleFade ${CONFIG.particleLifespan}ms ease-out forwards`;
  }

  // Update particles
  function updateParticles() {
    const now = Date.now();

    // Remove dead particles
    activeParticles = activeParticles.filter(particleData => {
      const age = now - particleData.birthTime;
      if (age >= CONFIG.particleLifespan) {
        particleData.element.style.display = 'none';
        particleData.element.style.animation = '';
        return false;
      }
      return true;
    });
  }

  // Animation loop
  function animate() {
    const now = Date.now();

    // Update comet cursor position
    if (cometCursor) {
      cometCursor.style.left = `${mouseX}px`;
      cometCursor.style.top = `${mouseY}px`;
    }

    // Spawn particles at interval
    if (now - lastSpawnTime >= CONFIG.spawnInterval) {
      for (let i = 0; i < CONFIG.particleCount; i++) {
        spawnParticle(mouseX, mouseY);
      }
      lastSpawnTime = now;
    }

    // Update particles
    updateParticles();

    // Continue animation loop
    rafId = requestAnimationFrame(animate);
  }

  // Cleanup
  function cleanup() {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseenter', handleMouseEnter);
    document.removeEventListener('mouseleave', handleMouseLeave);

    if (cometCursor && cometCursor.parentNode) {
      cometCursor.parentNode.removeChild(cometCursor);
    }

    particlePool.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });

    particlePool = [];
    activeParticles = [];
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);

  // Expose cleanup for manual control if needed
  window.cometCursor = {
    cleanup: cleanup,
    reinit: function() {
      cleanup();
      setTimeout(init, 100);
    }
  };

})();
