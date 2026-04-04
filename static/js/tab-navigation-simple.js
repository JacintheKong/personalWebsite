// Simplified tabbed navigation - CSS-driven approach
document.addEventListener('DOMContentLoaded', function() {

    // Kill onePageNav completely — it runs via IIFE in custom-script.js before
    // DOMContentLoaded, so we need to unbind its window events and neutralize
    // its setInterval which otherwise always selects "projects" (last nav item)
    // because all display:none sections have offset().top === 0.
    if (window.jQuery) {
        jQuery('ul.scroll-nav').off('.onePageNav');
        jQuery(window).off('scroll.onePageNav');
        jQuery(window).off('resize.onePageNav');
        // Brute-force clear onePageNav's setInterval (interval IDs are sequential)
        var highId = setInterval(function(){}, 9999);
        clearInterval(highId);
        for (var i = highId - 50; i <= highId; i++) { clearInterval(i); }
    }

    const navLinks = document.querySelectorAll('.scroll-nav li');
    const contentSections = document.querySelectorAll('[id$="-section"]');

    console.log('Found sections:', contentSections.length);

    // Initialize: Add active-tab to home only
    function init() {
        contentSections.forEach(section => {
            if (section.id === 'home-section') {
                section.classList.add('active-tab');
            } else {
                section.classList.remove('active-tab');
            }
        });

        navLinks.forEach(link => {
            if (link.classList.contains('home')) {
                link.classList.add('current');
            } else {
                link.classList.remove('current');
            }
        });

        // Ensure skills section is hidden initially
        const skillsSection = document.getElementById('skills-section');
        if (skillsSection) skillsSection.classList.remove('active-tab');
    }

    // Switch tabs - pure CSS approach
    function switchTab(targetSection, targetNav) {
        console.log('Switching to:', targetSection.id);

        // Remove active from all sections
        contentSections.forEach(s => s.classList.remove('active-tab'));

        // Add active to target
        targetSection.classList.add('active-tab');

        // NUCLEAR OPTION: Force inline styles to override everything
        targetSection.style.display = 'block';
        targetSection.style.width = '100%';
        targetSection.style.minWidth = '100%';
        targetSection.style.height = 'auto';
        targetSection.style.minHeight = '0';
        targetSection.style.visibility = 'visible';
        targetSection.style.opacity = '1';
        targetSection.style.position = 'relative';

        // DEBUG: Check what's happening
        setTimeout(() => {
            const computed = window.getComputedStyle(targetSection);
            const rect = targetSection.getBoundingClientRect();
            console.log('🔍 DEBUG:', targetSection.id);
            console.log('  - display:', computed.display);
            console.log('  - visibility:', computed.visibility);
            console.log('  - opacity:', computed.opacity);
            console.log('  - height:', computed.height);
            console.log('  - position:', computed.position);
            console.log('  - top:', computed.top);
            console.log('  - left:', computed.left);
            console.log('  - z-index:', computed.zIndex);
            console.log('  - has active-tab?', targetSection.classList.contains('active-tab'));
            console.log('  - content length:', targetSection.innerHTML.length);
            console.log('  - bounding rect:', {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });
        }, 100);

        // Update nav
        navLinks.forEach(link => link.classList.remove('current'));
        targetNav.classList.add('current');

        // Scroll to top
        const rightContent = document.querySelector('.right-content');
        if (rightContent) {
            rightContent.scrollTop = 0;
        }
    }

    // Add click handlers
    navLinks.forEach(link => {
        const navLink = link.querySelector('a');

        navLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                switchTab(targetSection, link);
            }

            // Close mobile nav overlay when a link is clicked
            document.body.classList.remove('navbar-visible');
        }, true);
    });

    init();

    // MutationObserver backup — if any script wrongly changes the current class,
    // immediately correct it to match whichever section has active-tab.
    var _resetting = false;
    var navObserver = new MutationObserver(function() {
        if (_resetting) return;
        var activeSection = document.querySelector('[id$="-section"].active-tab');
        if (!activeSection) return;
        var correctLink = document.querySelector('.scroll-nav a[href="#' + activeSection.id + '"]');
        if (!correctLink) return;
        var correctLi = correctLink.parentElement;
        if (!correctLi.classList.contains('current')) {
            _resetting = true;
            navLinks.forEach(function(li) { li.classList.remove('current'); });
            correctLi.classList.add('current');
            _resetting = false;
        }
    });
    navLinks.forEach(function(li) {
        navObserver.observe(li, { attributes: true, attributeFilter: ['class'] });
    });
});
