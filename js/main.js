/* ===== 未来科技风作品集 - 核心交互脚本 ===== */

// ===== 全息粒子背景 =====
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.particleCount = 80;
    this.init();
    this.animate();
    this.bindEvents();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(this.particleCount, Math.floor((this.canvas.width * this.canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const speedX = (Math.random() - 0.5) * 0.5;
      const speedY = (Math.random() - 0.5) * 0.5;
      const color = Math.random() > 0.5 ? '0, 212, 255' : '123, 47, 255';
      this.particles.push({ x, y, size, speedX, speedY, color, baseX: x, baseY: y });
    }
  }

  drawParticle(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${p.color}, 0.8)`;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = `rgba(${p.color}, 0.8)`;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  updateParticle(p) {
    p.x += p.speedX;
    p.y += p.speedY;

    // 边界检测
    if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

    // 鼠标交互
    if (this.mouse.x !== null && this.mouse.y !== null) {
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.mouse.radius) {
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.x -= Math.cos(angle) * force * 2;
        p.y -= Math.sin(angle) * force * 2;
      }
    }
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.3;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      this.updateParticle(p);
      this.drawParticle(p);
    });
    this.connectParticles();
    requestAnimationFrame(() => this.animate());
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
}

// ===== 滚动入场动画 =====
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    this.init();
  }

  init() {
    this.checkElements();
    window.addEventListener('scroll', () => this.checkElements());
  }

  checkElements() {
    const triggerPoint = window.innerHeight * 0.85;
    this.elements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < triggerPoint) {
        el.classList.add('active');
      }
    });
  }
}

// ===== 轮播Banner =====
class Carousel {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '.carousel');
    if (!this.container) return;
    this.slides = this.container.querySelectorAll('.carousel-slide');
    this.indicators = this.container.querySelectorAll('.carousel-indicator');
    this.prevBtn = this.container.querySelector('.carousel-prev');
    this.nextBtn = this.container.querySelector('.carousel-next');
    this.currentIndex = 0;
    this.autoPlay = options.autoPlay !== false;
    this.interval = options.interval || 5000;
    this.timer = null;
    this.isAnimating = false;
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;
    this.showSlide(0);
    this.bindEvents();
    if (this.autoPlay) this.startAutoPlay();
  }

  showSlide(index) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev', 'next');
      if (i === index) {
        slide.classList.add('active');
      } else if (i === this.currentIndex) {
        slide.classList.add(index > this.currentIndex ? 'prev' : 'next');
      }
    });

    this.indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });

    this.currentIndex = index;

    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prevIndex);
  }

  goTo(index) {
    if (index === this.currentIndex) return;
    this.showSlide(index);
  }

  startAutoPlay() {
    this.timer = setInterval(() => this.next(), this.interval);
  }

  stopAutoPlay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  bindEvents() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        if (this.autoPlay) {
          this.stopAutoPlay();
          this.startAutoPlay();
        }
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        if (this.autoPlay) {
          this.stopAutoPlay();
          this.startAutoPlay();
        }
      });
    }

    this.indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => {
        this.goTo(i);
        if (this.autoPlay) {
          this.stopAutoPlay();
          this.startAutoPlay();
        }
      });
    });

    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => {
      if (this.autoPlay) this.startAutoPlay();
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) this.next();
        else this.prev();
      }
    }, { passive: true });
  }
}

// ===== 导航栏交互 =====
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.mobileToggle = document.querySelector('.mobile-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.dropdowns = document.querySelectorAll('.nav-dropdown');
    this.backToTop = document.querySelector('.back-to-top');
    this.init();
  }

  init() {
    this.bindScroll();
    this.bindMobileMenu();
    this.bindBackToTop();
    this.setActiveNav();
  }

  bindScroll() {
    window.addEventListener('scroll', () => {
      // 导航栏滚动效果
      if (window.scrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }

      // 返回顶部按钮
      if (window.scrollY > 300) {
        this.backToTop?.classList.add('visible');
      } else {
        this.backToTop?.classList.remove('visible');
      }
    });
  }

  bindMobileMenu() {
    if (!this.mobileToggle || !this.navMenu) return;

    this.mobileToggle.addEventListener('click', () => {
      this.mobileToggle.classList.toggle('active');
      this.navMenu.classList.toggle('active');
      document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // 移动端下拉菜单
    this.dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.nav-link');
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    });

    // 点击菜单项关闭移动菜单
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.mobileToggle.classList.remove('active');
          this.navMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  bindBackToTop() {
    if (!this.backToTop) return;
    this.backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }
}

// ===== 打字机效果 =====
class Typewriter {
  constructor(element, words, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;
    this.words = words;
    this.typeSpeed = options.typeSpeed || 100;
    this.deleteSpeed = options.deleteSpeed || 50;
    this.pauseTime = options.pauseTime || 2000;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const currentWord = this.words[this.wordIndex];
    
    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.element.textContent = currentWord.substring(0, this.charIndex);

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ===== 数字计数动画 =====
class Counter {
  constructor(element, target, duration = 2000) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;
    this.target = parseInt(target);
    this.duration = duration;
    this.started = false;
    this.observe();
  }

  observe() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.started) {
          this.started = true;
          this.animate();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(this.element);
  }

  animate() {
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * this.target);
      this.element.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.element.textContent = this.target.toLocaleString();
      }
    };
    requestAnimationFrame(step);
  }
}

// ===== 图片懒加载 =====
class LazyImage {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, { rootMargin: '50px' });

    this.images.forEach(img => observer.observe(img));
  }
}

// ===== 图片灯箱 =====
class Lightbox {
  constructor() {
    this.lightbox = null;
    this.lightboxImg = null;
    this.init();
  }

  init() {
    this.createLightbox();
    this.bindEvents();
  }

  createLightbox() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <button class="lightbox-close">&times;</button>
      <img src="" alt="">
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(this.lightbox);
    this.lightboxImg = this.lightbox.querySelector('img');
    this.lightboxCaption = this.lightbox.querySelector('.lightbox-caption');
  }

  bindEvents() {
    // 点击图片打开灯箱
    document.querySelectorAll('.gallery-item img, .gallery-item-vertical img, .gallery-item-horizontal img, .gallery-item-square img').forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        this.open(img.src, img.alt);
      });
    });

    // 点击关闭按钮
    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      this.close();
    });

    // 点击背景关闭
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });

    // ESC关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(src, alt) {
    this.lightboxImg.src = src;
    this.lightboxImg.alt = alt;
    this.lightboxCaption.textContent = alt || '';
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  // 初始化粒子系统
  new ParticleSystem('particles-canvas');

  // 初始化导航
  new Navigation();

  // 初始化滚动动画
  new ScrollReveal();

  // 初始化图片懒加载
  new LazyImage();

  // 初始化图片灯箱
  new Lightbox();

  // 隐藏加载动画
  setTimeout(() => {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
  }, 800);
});

// 页面加载完成后执行
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
