// ===== FINCORE SITE JS =====

document.addEventListener('DOMContentLoaded', function () {

    // AOS init
    AOS.init({ duration: 700, once: true, offset: 80 });

    // Navbar scroll effect
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 30);
        });
    }

    // Product tabs
    document.querySelectorAll('.fc-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fc-tab').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.fc-tab-pane').forEach(p => p.style.display = 'none');
            btn.classList.add('active');
            const target = document.getElementById('tab' + capitalize(btn.dataset.tab));
            if (target) { target.style.display = 'block'; AOS.refresh(); }
        });
    });

    // Animated counters (stat section)
    const counters = document.querySelectorAll('.fc-stat-num[data-count]');
    if (counters.length && typeof CountUp !== 'undefined') {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const val = parseInt(el.dataset.count);
                    const cu = new CountUp.CountUp(el, val, { duration: 2, useEasing: true });
                    if (!cu.error) cu.start();
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => observer.observe(c));
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // Contact form (basic front-end feedback)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = contactForm.querySelector('[type=submit]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Отправляем...';
            btn.disabled = true;

            await new Promise(r => setTimeout(r, 1200));

            const token = contactForm.querySelector('[name=__RequestVerificationToken]')?.value;
            const body = new FormData(contactForm);

            try {
                const res = await fetch('/Contacts?handler=Send', {
                    method: 'POST',
                    body: body,
                    headers: { 'RequestVerificationToken': token }
                });
                if (res.ok) {
                    showToast('Сообщение отправлено! Мы свяжемся с вами в течение 3 минут.', 'success');
                    contactForm.reset();
                } else {
                    showToast('Ошибка. Попробуйте ещё раз.', 'danger');
                }
            } catch {
                showToast('Нет подключения. Попробуйте позже.', 'danger');
            }

            btn.innerHTML = orig;
            btn.disabled = false;
        });
    }
});

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function showToast(msg, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} shadow-lg rounded-3 mb-0`;
    toast.style.cssText = 'min-width:280px;animation:slideIn 0.3s ease';
    toast.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>${msg}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 4000);
}
