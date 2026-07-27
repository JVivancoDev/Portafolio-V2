/**
 * JV Design Solutions - script.js (UX & A11y Optimized)
 * Includes: Skeleton Loading, Mobile Menu, Custom Cursor, Scroll Reveal, and Modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCustomCursor();
  initScrollReveal();
  initHoverEffects();
  loadSkills();
  loadProjects();
});

// ── NAVEGACIÓN MÓVIL (listener único, clase consistente con el CSS) ──
function initMobileMenu() {
  const burger = document.querySelector('#burger');
  const navLinks = document.querySelector('.nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    burger.setAttribute('aria-expanded', isActive);
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-active');
      burger.classList.remove('toggle');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── CURSOR PERSONALIZADO ──
function initCustomCursor() {
  // Disable custom cursor on touch devices for better UX
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  cursor.style.display = 'block';
  ring.style.display = 'block';

  let rx = 0, ry = 0;
  let rafId = null;

  document.addEventListener('mousemove', e => {
    const { clientX, clientY } = e;
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
      rx += (clientX - rx) * 0.12;
      ry += (clientY - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
    });
  });
}

// Se puede volver a invocar tras cargar contenido dinámico (skills/proyectos)
function initHoverEffects() {
  document.querySelectorAll('a, button, .panel, .skill-card, .project-card').forEach(el => {
    if (el.dataset.hoverBound) return; // evita listeners duplicados
    el.dataset.hoverBound = 'true';
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

// ── SCROLL REVEAL ──
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observerOptions = { threshold: 0.12, rootMargin: "0px 0px -50px 0px" };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(r => observer.observe(r));
}

// ── CARGA DINÁMICA CON SKELETONS ──
async function loadSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  try {
    const res = await fetch('data/skills.json');
    if (!res.ok) throw new Error('Error al cargar skills');
    const skills = await res.json();

    // Reemplaza los skeletons por las tarjetas reales
    container.innerHTML = skills.map(skill => `
      <div class="skill-card reveal">
        <div class="skill-icon" aria-hidden="true">${skill.icon}</div>
        <div class="skill-name">${skill.name}</div>
        <div class="skill-sub">${skill.sub}</div>
      </div>
    `).join('');

    initScrollReveal(); // observar las nuevas tarjetas .reveal
    initHoverEffects();  // enlazar el cursor personalizado a las nuevas tarjetas
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="error-msg">No se pudieron cargar las habilidades. Por favor, intenta de nuevo más tarde.</p>';
  }
}

async function loadProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error('Error al cargar proyectos');
    const projects = await res.json();

    container.innerHTML = projects.map(project => `
      <div class="project-card reveal">
        <div class="project-img-container">
          <img src="${project.image}" alt="${project.name}" class="project-img" loading="lazy">
        </div>
        <div class="project-info">
          <h3 class="project-title">${project.name}</h3>
          <p class="project-desc">${project.description}</p>
          <div class="project-footer">
            <a href="${project.live}" class="project-link" target="_blank" rel="noopener">
              Ver Proyecto <span class="material-symbols-outlined">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    `).join('');

    initScrollReveal();
    initHoverEffects();
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="error-msg">No se pudieron cargar los proyectos.</p>';
  }
}

// ── MODAL ──
const modalData = {
  kolenka: {
    title: '// Kolenka Lashes — Galería Técnica',
    slides: [
      { label: 'Vista principal — Formulario de agendamiento', emoji: '📅' },
      { label: 'Vista móvil — Responsive completo', emoji: '📱' },
      { label: 'Panel de administración privado', emoji: '🔒' },
      { label: 'Flujo de confirmación automática por email', emoji: '📧' },
      { label: 'Integración Google Calendar en tiempo real', emoji: '🗓️' },
    ]
  },
  jardin: {
    title: '// Jardín Oasis — Galería Técnica',
    slides: [
      { label: 'Catálogo de productos con filtros dinámicos', emoji: '🌿' },
      { label: 'Vista móvil del catálogo', emoji: '📱' },
      { label: 'Formulario de cotización automática', emoji: '📋' },
      { label: 'Backend en Google Sheets — Gestión de inventario', emoji: '📊' },
      { label: 'Panel de control del administrador', emoji: '⚙️' },
    ]
  },
  lienza: {
    title: '// Lienza Estudio — Portafolio Arquitectura',
    slides: [
      { label: 'Vista principal — Portafolio Arquitectura', emoji: '🏘️' },
      { label: 'Vista móvil — Responsive completo', emoji: '📱' },
      { label: 'Panel de administración privado', emoji: '🔒' },
      { label: 'Backend en Google Sheets — Gestión de proyectos', emoji: '📊' },
      { label: 'Panel de control del administrador', emoji: '⚙️' },
    ]
  }
};

function openModal(projectId) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const data = modalData[projectId];
  if (!modal || !data) return;

  modalTitle.textContent = data.title;

  modalBody.innerHTML = `
    <div class="modal-grid">
      ${data.slides.map(s => `
        <div class="modal-item">
          <div class="modal-img-wrap">
            <div class="modal-placeholder">${s.emoji}</div>
          </div>
          <p class="modal-caption">${s.label}</p>
        </div>
      `).join('')}
    </div>
  `;

  const box = modal.querySelector('.modal-box');

  modal.style.display = 'flex';

  // Force reflow for transitions
  void modal.offsetWidth;

  modal.classList.add('active');

  requestAnimationFrame(() => {
    box.classList.add('active');
  });

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  const box = modal.querySelector('.modal-box');

  box.classList.remove('active');

  // Wait for box animation to finish before closing overlay
  setTimeout(() => {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 400); // Overlay transition duration
  }, 300); // Box animation leading
}

function closeModalOutside(e) {
  if (e.target.id === 'modal') closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
