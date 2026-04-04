// Clean tabbed navigation system
document.addEventListener('DOMContentLoaded', function() {

    // CRITICAL: Disable the onePageNav scroll plugin to prevent conflicts
    setTimeout(function() {
        if (window.jQuery && jQuery.fn.onePageNav) {
            jQuery('ul.scroll-nav').off('.onePageNav');
            console.log('Disabled onePageNav scroll plugin');
        }
    }, 100);

    // Get all navigation links and content sections
    const navLinks = document.querySelectorAll('.scroll-nav li');
    const contentSections = document.querySelectorAll('[id$="-section"]');

    // Hide all sections except home initially
    function initializeTabs() {
        console.log('Initializing tabs, found sections:', contentSections.length);
        contentSections.forEach((section, index) => {
            console.log('Section:', section.id, 'Classes:', section.className);
            if (section.id === 'home-section') {
                section.classList.add('active-tab');
                section.style.display = 'block';
                section.style.opacity = '1';
            } else {
                section.classList.remove('active-tab');
                section.style.display = 'none';
                section.style.opacity = '0';
            }
        });

        // Set home as active in nav
        navLinks.forEach(link => {
            if (link.classList.contains('home')) {
                link.classList.add('current');
            } else {
                link.classList.remove('current');
            }
        });
    }

    // Smooth fade transition function
    function showSection(targetSection, targetNav) {
        console.log('Showing section:', targetSection.id);

        // Fade out current section
        const currentSection = document.querySelector('.active-tab');
        if (currentSection && currentSection !== targetSection) {
            currentSection.style.opacity = '0';

            setTimeout(() => {
                currentSection.classList.remove('active-tab');
                currentSection.style.display = 'none';

                // Show new section with fade in
                targetSection.style.display = 'block';
                targetSection.style.opacity = '0';

                // Trigger reflow
                targetSection.offsetHeight;

                setTimeout(() => {
                    targetSection.style.opacity = '1';
                    targetSection.classList.add('active-tab');

                    // Scroll to top of content area smoothly
                    const rightContent = document.querySelector('.right-content');
                    if (rightContent) {
                        rightContent.scrollTop = 0;
                    }
                }, 50);
            }, 300);
        } else if (!currentSection) {
            // No current section, show target immediately
            targetSection.style.display = 'block';
            targetSection.style.opacity = '1';
            targetSection.classList.add('active-tab');
        }

        // Update active navigation
        navLinks.forEach(link => link.classList.remove('current'));
        targetNav.classList.add('current');
    }

    // Add click handlers to navigation
    navLinks.forEach(link => {
        const navLink = link.querySelector('a');

        navLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            console.log('Click on nav link, target:', targetId, 'found:', !!targetSection);

            if (targetSection) {
                showSection(targetSection, link);
            }
        }, true); // Use capture phase to intercept before onePageNav
    });

    // Initialize on load
    initializeTabs();

    // Show keyboard navigation hint on first load
    const navHint = document.getElementById('navHint');
    if (navHint) {
        setTimeout(() => {
            navHint.classList.add('show');
            setTimeout(() => {
                navHint.classList.remove('show');
            }, 3000);
        }, 2000);
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash || '#home-section';
        const targetSection = document.querySelector(hash);
        const targetNav = document.querySelector(`.scroll-nav a[href="${hash}"]`)?.parentElement;

        if (targetSection && targetNav) {
            showSection(targetSection, targetNav);
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.altKey || e.ctrlKey) return; // Don't interfere with browser shortcuts

        const currentNav = document.querySelector('.scroll-nav li.current');
        if (!currentNav) return;

        let targetNav = null;

        // Arrow keys for tab navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            targetNav = currentNav.nextElementSibling;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            targetNav = currentNav.previousElementSibling;
        }

        if (targetNav) {
            e.preventDefault();
            const targetLink = targetNav.querySelector('a');
            const targetId = targetLink.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                showSection(targetSection, targetNav);
                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        }
    });

    // Add touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const contentContainer = document.querySelector('.right-content');

    if (contentContainer) {
        contentContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        contentContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const currentNav = document.querySelector('.scroll-nav li.current');

        if (!currentNav) return;

        let targetNav = null;

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next tab
            targetNav = currentNav.nextElementSibling;
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous tab
            targetNav = currentNav.previousElementSibling;
        }

        if (targetNav) {
            const targetLink = targetNav.querySelector('a');
            const targetId = targetLink.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                showSection(targetSection, targetNav);
                history.pushState(null, null, targetId);
            }
        }
    }

    // Add visual feedback for tab switching
    navLinks.forEach(link => {
        const navLink = link.querySelector('a');

        navLink.addEventListener('mouseenter', function() {
            if (!link.classList.contains('current')) {
                this.style.transform = 'translateX(5px)';
            }
        });

        navLink.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});
