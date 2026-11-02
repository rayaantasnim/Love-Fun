    /* ==========================================================================
       ENHANCED PARTICLE & 3D CANVAS CONTROLLER
       ========================================================================== */
    const canvas = document.getElementById('cosmic-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class CosmicParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 2.2 + 0.5;
        this.color = Math.random() > 0.3 ? 'rgba(245, 190, 210, ' : 'rgba(255, 215, 0, ';
        this.alpha = Math.random() * 0.8 + 0.25;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
      }

      update() {
        this.x += this.vx + (mouse.x * 0.012);
        this.y += this.vy + (mouse.y * 0.012);

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(245, 150, 190, 0.6)';
        ctx.fill();
      }
    }

    for (let i = 0; i < 280; i++) {
      particles.push(new CosmicParticle());
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX - window.innerWidth / 2) * 0.05;
      mouse.y = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    /* ==========================================================================
       GSAP SCROLLTRIGGER & INTERACTION LOGIC
       ========================================================================== */
    gsap.registerPlugin(ScrollTrigger);

    const splashScreen = document.getElementById('splash-screen');
    const initBtn = document.getElementById('initBtn');
    const heartIcon = document.getElementById('heartIcon');

    // Trigger Cosmic Confetti & Unlock Narrative
    initBtn.addEventListener('click', () => {
      confetti({
        particleCount: 160,
        spread: 95,
        origin: { y: 0.6 },
        colors: ['#e07096', '#d4af37', '#ffd700', '#ffb6c1', '#ffffff'],
        disableForReducedMotion: true
      });

      splashScreen.style.opacity = '0';
      splashScreen.style.visibility = 'hidden';
      document.body.classList.remove('locked');

      setTimeout(initScrollAnimations, 500);
    });

    function initScrollAnimations() {
      // CARD 1: Velocity Blur & Scale In
      gsap.fromTo('#card-1', 
        { filter: 'blur(22px)', scale: 0.88, opacity: 0.2 },
        {
          filter: 'blur(0px)',
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '#card-1',
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.8
          }
        }
      );

      // CARD 2: Horizontal Kinetic Drift
      gsap.fromTo('#card-2',
        { x: -140, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '#card-2',
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.8
          }
        }
      );

      // CARD 3: 3D Horizon Pitch Lift
      gsap.fromTo('#card-3',
        { rotateX: 28, y: 90, opacity: 0 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '#card-3',
            start: 'top 80%',
            end: 'top 45%',
            scrub: 0.8,
            onLeaveBack: () => gsap.killTweensOf(heartIcon),
            onEnter: () => {
              gsap.to(heartIcon, {
                scale: 1.28,
                duration: 0.65,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
              });
            }
          }
        }
      );

      // ENDING SECTION (Visual, Floating Hearts & Epilogue Card)
      gsap.to('#endingSection', {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '#endingSection',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      });

      // FOOTER: Slide Up Clipping Mask Reveal
      gsap.to('#footerContent', {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 92%',
          toggleActions: 'play none none reverse'
        }
      });
    }
