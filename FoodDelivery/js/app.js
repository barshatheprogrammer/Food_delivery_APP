/**
 * app.js - UI Logic & Global Features
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Preloader
    // ==========================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800); // Small delay for visual effect
    });

    // ==========================================
    // 2. Sticky Navbar & Active Links
    // ==========================================
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scroll-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll to Top Button
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }

        // Active Navigation Highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 3. Mobile Menu Toggle
    // ==========================================
    const menuBtn = document.getElementById('menu-btn');
    const navbar = document.getElementById('navbar');

    menuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (navbar.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuBtn.contains(e.target) && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            menuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
        });
    });

    // ==========================================
    // 4. Dark Mode Toggle
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check Local Storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            showToast('Dark mode enabled', 'success');
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            showToast('Light mode enabled', 'success');
        }
    });

    // ==========================================
    // 5. Scroll Reveal Animation
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-right, .reveal-left');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // ==========================================
    // 6. Animated Counters
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                startCounters();
                hasCounted = true;
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // ==========================================
    // 7. Customer Review Slider
    // ==========================================
    const track = document.getElementById('review-track');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const slides = document.querySelectorAll('.review-card');
        const totalSlides = slides.length;

        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
            updateSlider();
        });

        // Auto slide
        setInterval(() => {
            currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
            updateSlider();
        }, 5000);
    }

    // ==========================================
    // 8. FAQ Accordion
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            // Close all others
            document.querySelectorAll('.accordion-header').forEach(other => {
                other.classList.remove('active');
                other.nextElementSibling.style.maxHeight = null;
            });

            if (!isActive) {
                header.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // 9. Newsletter Validation
    // ==========================================
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMsg = document.getElementById('newsletter-msg');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email').value;
            
            // Basic email validation regex
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (regex.test(emailInput)) {
                newsletterMsg.textContent = "Thank you for subscribing!";
                newsletterMsg.className = "form-msg success";
                newsletterForm.reset();
                showToast("Subscribed successfully!", "success");
            } else {
                newsletterMsg.textContent = "Please enter a valid email.";
                newsletterMsg.className = "form-msg error";
                showToast("Invalid email address", "error");
            }

            setTimeout(() => {
                newsletterMsg.textContent = "";
            }, 3000);
        });
    }

    // ==========================================
    // 10. Auth, Profile, & Order History Logic
    // ==========================================
    const loginBtn = document.getElementById('login-btn');
    const userProfileContainer = document.getElementById('user-profile-container');
    const userGreeting = document.getElementById('user-greeting');
    const userProfileBtn = document.getElementById('user-profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const accountDetailsBtn = document.getElementById('account-details-btn');
    
    const authOverlay = document.getElementById('auth-overlay');
    const accountOverlay = document.getElementById('account-overlay');
    const closeModals = document.querySelectorAll('.close-modal');
    
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const orderHistoryList = document.getElementById('order-history-list');

    // Check session on load
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    if (activeUser) {
        setLoggedInState(activeUser.name);
    } else {
        setLoggedOutState();
    }

    // Login button click
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            authOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }

    // Toggle Dropdown
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userProfileContainer.classList.toggle('active');
        });
    }

    // Close Dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (userProfileContainer && !userProfileContainer.contains(e.target)) {
            userProfileContainer.classList.remove('active');
        }
    });

    // Close Modals
    closeModals.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    [authOverlay, accountOverlay].forEach(overlay => {
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeAllModals();
            });
        }
    });

    function closeAllModals() {
        if(authOverlay) authOverlay.classList.remove('active');
        if(accountOverlay) accountOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // Auth Tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.getAttribute('data-target') === 'login') {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });

    // Sign Up Submit
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            
            try {
                const response = await fetch('http://127.0.0.1:5000/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, password })
                });
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('activeUser', JSON.stringify(data.user));
                    setLoggedInState(data.user.name);
                    closeAllModals();
                    if(typeof showToast === 'function') showToast(data.message, 'success');
                    signupForm.reset();
                } else {
                    if(typeof showToast === 'function') showToast(data.message, 'error');
                }
            } catch (err) {
                if(typeof showToast === 'function') showToast('Server connection failed', 'error');
            }
        });
    }

    // Login Submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            try {
                const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('activeUser', JSON.stringify(data.user));
                    setLoggedInState(data.user.name);
                    closeAllModals();
                    if(typeof showToast === 'function') showToast(data.message, 'success');
                    loginForm.reset();
                } else {
                    if(typeof showToast === 'function') showToast(data.message, 'error');
                }
            } catch (err) {
                if(typeof showToast === 'function') showToast('Server connection failed', 'error');
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('activeUser');
            setLoggedOutState();
            userProfileContainer.classList.remove('active');
            if(typeof showToast === 'function') showToast('Logged out successfully', 'success');
        });
    }

    // Account Details (Order History)
    if (accountDetailsBtn) {
        accountDetailsBtn.addEventListener('click', () => {
            userProfileContainer.classList.remove('active');
            renderOrderHistory();
            accountOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }

    async function renderOrderHistory() {
        if (!orderHistoryList) return;
        const currentUser = JSON.parse(localStorage.getItem('activeUser'));
        if (!currentUser) return;
        
        orderHistoryList.innerHTML = `<div class="empty-history">Loading orders...</div>`;
        
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/orders/${currentUser.email}`);
            const data = await response.json();
            
            if (data.success && data.orders.length > 0) {
                let html = '';
                data.orders.forEach((order, index) => {
                    html += `
                        <div class="order-history-item">
                            <h4>Order #${data.orders.length - index}</h4>
                            <p><strong>Date:</strong> ${order.date}</p>
                            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                            <p><strong>Items:</strong> ${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
                        </div>
                    `;
                });
                orderHistoryList.innerHTML = html;
            } else {
                orderHistoryList.innerHTML = `<div class="empty-history">You haven't ordered anything yet.</div>`;
            }
        } catch (err) {
            orderHistoryList.innerHTML = `<div class="empty-history" style="color:red">Failed to load orders.</div>`;
        }
    }

    function setLoggedInState(name) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfileContainer) userProfileContainer.style.display = 'block';
        if (userGreeting) userGreeting.textContent = `Hi, ${name}`;
    }

    function setLoggedOutState() {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userProfileContainer) userProfileContainer.style.display = 'none';
    }


});

// Global Toast Notification Function
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-xmark';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);

    // Remove toast after animation finishes (3.5s total)
    setTimeout(() => {
        toast.remove();
    }, 3500);
}
