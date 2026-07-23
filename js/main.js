/* ============================================
   HIMACHAL TAXI — Main JavaScript
   All interactive functionality in one file
   ============================================ */

(function () {
    'use strict';

    /* ============================
       1. MOBILE HAMBURGER MENU
    ============================ */
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobileNav');
        const mobileNavClose = document.getElementById('mobileNavClose');

        if (!hamburger || !mobileNav) return;

        const openMenu = () => {
            mobileNav.classList.add('open');
            document.body.classList.add('no-scroll');
        };

        const closeMenu = () => {
            mobileNav.classList.remove('open');
            document.body.classList.remove('no-scroll');
        };

        hamburger.addEventListener('click', openMenu);

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMenu);
        }

        mobileNav.addEventListener('click', function (e) {
            if (e.target === mobileNav) closeMenu();
        });

        // Close on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                closeMenu();
            }
        });

        // Close mobile nav when any nav link is clicked
        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function (e) {
                // For modal trigger buttons, close the menu before opening modal
                if (link.hasAttribute('data-open-modal')) {
                    closeMenu();
                }
            });
        });
    }

    /* ============================
       2. FLEET IMAGE CAROUSELS
    ============================ */
    function initFleetCarousels() {
        const carousels = document.querySelectorAll('[data-carousel]');

        carousels.forEach(function (carousel) {
            const slidesWrap = carousel.querySelector('.fleet-slides');
            const slides = Array.from(carousel.querySelectorAll('.fleet-slide'));
            const prevBtn = carousel.querySelector('.fleet-prev');
            const nextBtn = carousel.querySelector('.fleet-next');
            const dotsWrap = carousel.querySelector('.fleet-dots');

            if (!slidesWrap || slides.length === 0) return;

            let index = 0;
            let autoplayTimer = null;

            // Build dots
            if (dotsWrap && dotsWrap.children.length === 0) {
                slides.forEach(function (_, i) {
                    var dot = document.createElement('button');
                    dot.type = 'button';
                    dot.className = 'fleet-dot';
                    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                    dot.addEventListener('click', function () { goTo(i); });
                    dotsWrap.appendChild(dot);
                });
            }

            var dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.fleet-dot')) : [];

            function render() {
                var slideWidth = carousel.clientWidth;
                slidesWrap.style.transform = 'translateX(' + (-index * slideWidth) + 'px)';

                dots.forEach(function (d, i) {
                    if (i === index) d.classList.add('active');
                    else d.classList.remove('active');
                });
            }

            function goTo(i) {
                index = (i + slides.length) % slides.length;
                render();
            }

            if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
            if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

            render();

            var resizeTimer;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(render, 100);
            });

            // Autoplay for multi-image carousels
            if (slides.length > 1) {
                function startAutoplay() {
                    autoplayTimer = setInterval(function () { goTo(index + 1); }, 3500);
                }
                function stopAutoplay() {
                    clearInterval(autoplayTimer);
                }

                startAutoplay();
                carousel.addEventListener('mouseenter', stopAutoplay);
                carousel.addEventListener('mouseleave', startAutoplay);
            }
        });
    }

    /* ============================
       3. TESTIMONIALS AUTO-SLIDER
    ============================ */
    function initTestimonialsSlider() {
        const track = document.querySelector('.testimonials-track');
        if (!track) return;

        let scrollAmount = 0;
        const card = track.querySelector('.testimonial-card');
        if (!card) return;

        const cardWidth = card.offsetWidth + 24; // card + gap
        let autoScroll;

        function scrollNext() {
            const maxScroll = track.scrollWidth - track.clientWidth;
            scrollAmount += cardWidth;
            if (scrollAmount > maxScroll) {
                scrollAmount = 0;
            }
            track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }

        function startAutoScroll() {
            autoScroll = setInterval(scrollNext, 4000);
        }

        function stopAutoScroll() {
            clearInterval(autoScroll);
        }

        // Only auto-scroll on desktop (no touch scrolling interference)
        if (window.innerWidth > 768) {
            startAutoScroll();
            track.addEventListener('mouseenter', stopAutoScroll);
            track.addEventListener('mouseleave', startAutoScroll);
        }
    }

    /* ============================
       4. FAQ ACCORDION
    ============================ */
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function (item) {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', function () {
                const isOpen = item.classList.contains('open');

                // Close all
                faqItems.forEach(function (el) {
                    el.classList.remove('open');
                });

                // Toggle current
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
    }

    /* ============================
       5. PLAN MY TRIP MODAL
    ============================ */
    function initPlanTripModal() {
        const modal = document.getElementById('planTripModal');
        const openBtns = document.querySelectorAll('[data-open-modal]');
        const closeBtn = document.getElementById('modalClose');

        if (!modal) return;

        function openModal() {
            modal.classList.add('open');
            document.body.classList.add('no-scroll');
        }

        function closeModal() {
            modal.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }

        openBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal();
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Close on overlay click (works on touch & mouse)
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
        modal.addEventListener('touchstart', function (e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });

        // Form submission
        const form = document.getElementById('planTripForm');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const name = document.getElementById('ptName').value.trim();
                const email = document.getElementById('ptEmail').value.trim();
                const phone = document.getElementById('ptPhone').value.trim();
                const pickup = document.getElementById('ptPickup').value.trim();
                const destination = document.getElementById('ptDestination').value.trim();
                const date = document.getElementById('ptDate').value;
                const passengers = document.getElementById('ptPassengers').value;
                const vehicle = document.getElementById('ptVehicle').value;
                const message = document.getElementById('ptMessage').value.trim();

                const combined = [
                    '🚖 *New Trip Booking Request*',
                    '',
                    '👤 *Name:* ' + (name || '-'),
                    '📧 *Email:* ' + (email || '-'),
                    '📞 *Phone:* ' + (phone || '-'),
                    '📍 *Pickup:* ' + (pickup || '-'),
                    '🏁 *Destination:* ' + (destination || '-'),
                    '📅 *Date:* ' + (date || '-'),
                    '👥 *Passengers:* ' + (passengers || '-'),
                    '🚗 *Vehicle:* ' + (vehicle || '-'),
                    '',
                    '💬 *Message:* ' + (message || '-'),
                ].join('\n');

                const number = '918091331806';
                const url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(combined);
                window.open(url, '_blank');

                closeModal();
                form.reset();
            });
        }
    }

    /* ============================
       6. FLOATING BOOKING PANEL
    ============================ */
    function initFloatingBookingPanel() {
        const wrapper = document.getElementById('floatingBookingBtn');
        const overlay = document.getElementById('floatingBookingOverlay');
        const closeBtn = document.getElementById('bookingClose');

        if (!wrapper || !overlay) return;

        wrapper.addEventListener('click', function () {
            overlay.classList.add('open');
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                overlay.classList.remove('open');
            });
        }

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.classList.remove('open');
            }
        });

        // Quick Book button inside
        var quickBtn = document.getElementById('quickBookBtn');
        if (quickBtn) {
            quickBtn.addEventListener('click', function () {
                var from = document.getElementById('quickFrom').value.trim();
                var to = document.getElementById('quickTo').value.trim();
                var date = document.getElementById('quickDate').value;
                var vehicle = document.getElementById('quickVehicle').value;

                var msg = '🚖 *Quick Booking Request*';
                msg += '\n\n📍 From: ' + (from || 'Not specified');
                msg += '\n🏁 To: ' + (to || 'Not specified');
                msg += '\n📅 Date: ' + (date || 'Not specified');
                msg += '\n🚗 Vehicle: ' + (vehicle || 'Not specified');

                window.open('https://wa.me/918091331806?text=' + encodeURIComponent(msg), '_blank');
                overlay.classList.remove('open');
            });
        }
    }

    /* ============================
       7. BACK TO TOP
    ============================ */
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ============================
       8. SMOOTH SCROLL FOR ANCHORS
    ============================ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /* ============================
       9. ACTIVE NAV LINK
    ============================ */
    function initActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a, .mobile-nav-content a').forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }

    /* ============================
       10. COUNTER ANIMATION
    ============================ */
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (counters.length === 0) return;

        let animated = false;

        function animateCounters() {
            if (animated) return;
            animated = true;

            counters.forEach(function (el) {
                const target = parseInt(el.getAttribute('data-target'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 2000;
                const step = Math.max(1, Math.floor(target / 60));
                let current = 0;

                const timer = setInterval(function () {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + suffix;
                }, duration / (target / step));
            });
        }

        // Trigger on scroll
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ============================
       11. CONTACT FORM (WhatsApp)
    ============================ */
    function initContactForm() {
        const btn = document.getElementById('contactSubmit');
        if (!btn) return;

        const nameEl = document.getElementById('contactName');
        const emailEl = document.getElementById('contactEmail');
        const phoneEl = document.getElementById('contactPhone');
        const msgEl = document.getElementById('contactMessage');

        if (!nameEl || !emailEl || !phoneEl || !msgEl) return;

        btn.addEventListener('click', function () {
            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const phone = phoneEl.value.trim();
            const message = msgEl.value.trim();

            const combined = [
                '👋 *New Contact Message*',
                '',
                '👤 Name: ' + (name || '-'),
                '📧 Email: ' + (email || '-'),
                '📞 Phone: ' + (phone || '-'),
                '',
                '💬 Message: ' + (message || '-'),
            ].join('\n');

            const url = 'https://wa.me/918091331806?text=' + encodeURIComponent(combined);
            window.open(url, '_blank');
        });
    }

    /* ============================
       12. INITIALIZE ALL
    ============================ */
    function init() {
        initMobileMenu();
        initFleetCarousels();
        initTestimonialsSlider();
        initFAQ();
        initPlanTripModal();
initFloatingBookingPanel();
        initBackToTop();
        initSmoothScroll();
        initActiveNav();
        initCounters();
        initContactForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

