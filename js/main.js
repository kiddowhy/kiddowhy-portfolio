(function () {
  const workView = document.getElementById("work-view");
  const aboutView = document.getElementById("about-view");
  const navLinks = document.querySelectorAll("[data-view]");
  const menuBtn = document.querySelector(".nav-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  const canvas = document.getElementById("particles");

  function setView(view) {
    const isWork = view === "work";

    workView.classList.toggle("page-view-active", isWork);
    workView.hidden = !isWork;

    aboutView.classList.toggle("page-view-active", !isWork);
    aboutView.hidden = isWork;

    navLinks.forEach((link) => {
      const active = link.dataset.view === view;
      link.classList.toggle("nav-link-active", active);
      link.classList.toggle("mobile-nav-link-active", active);
    });

    if (mobileNav && !mobileNav.hidden) {
      mobileNav.hidden = true;
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }

    document.title = isWork ? "Kiddowhy" : "Kiddowhy — About";
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      setView(link.dataset.view);
    });
  });

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const open = mobileNav.hidden;
      mobileNav.hidden = !open;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initParticles() {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];
    const count = 55;
    const linkDistance = 140;

    function resize() {
      const parent = canvas.parentElement;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function createParticles() {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 1,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180, 190, 200, 0.55)";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < linkDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(180, 190, 200, ${0.25 * (1 - dist / linkDistance)})`;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });
  }

  initParticles();
  setView("work");
})();
