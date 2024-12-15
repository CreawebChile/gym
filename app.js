const { createApp } = Vue

createApp({
    data() {
        return {
            hasScrolled: false,
            isMenuOpen: false,
            showModal: false,
            selectedPlan: null,
            sending: false,
            formData: {
                nombre: '',
                email: '',
                telefono: ''
            },
            contactForm: {
                nombre: '',
                email: '',
                plan: '',
                mensaje: ''
            },
            plans: [
                {
                    id: 1,
                    name: 'Básico',
                    price: 25990,
                    featured: false,
                    features: [
                        'Acceso a sala de máquinas',
                        'Equipamiento básico',
                        'Acceso a vestidores'
                    ]
                },
                {
                    id: 2,
                    name: 'Premium',
                    price: 45990,
                    featured: true,
                    features: [
                        'Todos los beneficios Básicos',
                        'Clases grupales',
                        'Entrenador personal (2 veces/mes)',
                        'Asesoría nutricional'
                    ]
                },
                {
                    id: 3,
                    name: 'Elite',
                    price: 75990,
                    featured: false,
                    features: [
                        'Todos los beneficios Premium',
                        'Sesiones PT ilimitadas',
                        'Acceso al spa',
                        'Zona de recuperación'
                    ]
                }
            ],
            promos: {
                parejas: {
                    name: 'Plan Parejas',
                    discount: '50% OFF en segunda membresía',
                    price: 35990
                },
                estudiante: {
                    name: 'Plan Estudiante',
                    discount: '40% OFF',
                    price: 15990
                },
                early: {
                    name: 'Plan Early Bird',
                    discount: '30% OFF',
                    price: 19990
                }
            }
        }
    },
    methods: {
        formatPrice(price) {
            return `$${price.toLocaleString('es-CL')}`
        },
        scrollToPlans() {
            document.getElementById('plans').scrollIntoView({ behavior: 'smooth' })
        },
        selectPlan(plan) {
            this.selectedPlan = plan
            this.showModal = true
        },
        selectPromo(promoType) {
            this.selectedPlan = {
                name: this.promos[promoType].name,
                price: this.promos[promoType].price,
                features: [
                    this.promos[promoType].discount,
                    'Acceso a instalaciones',
                    'Programa personalizado'
                ]
            };
            this.showModal = true;
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
            
            // Prevenir desplazamiento en iOS
            if (this.isMenuOpen) {
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            } else {
                document.body.style.position = '';
                document.body.style.width = '';
            }
            
            // Añadir clase para animación
            const links = document.querySelectorAll('.nav-links a');
            links.forEach((link, index) => {
                if (this.isMenuOpen) {
                    link.style.transitionDelay = `${0.1 * index}s`;
                } else {
                    link.style.transitionDelay = '0s';
                }
            });
        },
        closeMenu() {
            this.isMenuOpen = false;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            
            // Resetear delays
            const links = document.querySelectorAll('.nav-links a');
            links.forEach(link => {
                link.style.transitionDelay = '0s';
            });
        },
        initIntersectionObserver() {
            const options = {
                root: null,
                threshold: 0.1
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate__animated');
                        if (entry.target.classList.contains('feature-card')) {
                            entry.target.classList.add('animate__fadeInUp');
                        } else if (entry.target.classList.contains('plan-card')) {
                            entry.target.classList.add('animate__zoomIn');
                        }
                        observer.unobserve(entry.target);
                    }
                })
            }, options)

            document.querySelectorAll('.feature-card, .plan-card, .contact-form')
                .forEach(el => observer.observe(el))
        },
        formatWhatsAppMessage(data, type) {
            const message = type === 'subscription' 
                ? `*¡Hola! Me interesa el Plan ${this.selectedPlan.name}* 🏋️‍♂️%0A%0A`+
                  `*Datos de contacto:*%0A`+
                  `👤 Nombre: ${data.nombre}%0A`+
                  `📧 Email: ${data.email}%0A`+
                  `📞 Teléfono: ${data.telefono}%0A%0A`+
                  `*Precio:* ${this.formatPrice(this.selectedPlan.price)}/mes`
                : `*¡Nueva Consulta!*%0A%0A`+
                  `*Nombre:* ${data.nombre}%0A%0A`+
                  `*Email:* ${data.email}%0A%0A`+
                  `*Plan de Interés:* ${this.plans.find(p => p.id == data.plan)?.name || 'No especificado'}%0A`+
                  `*Mensaje:* ${data.mensaje}`;
            
            return message;
        },

        async procesarSuscripcion() {
            const button = event.target;
            button.classList.add('loading');
            try {
                const message = this.formatWhatsAppMessage(this.formData, 'subscription');
                const whatsappURL = `https://wa.me/+56912345678?text=${message}`;
                
                // Abrir WhatsApp en una nueva ventana pequeña
                const whatsappWindow = window.open(whatsappURL, 'whatsapp', 
                    'width=800,height=600,toolbar=0,menubar=0,location=0');
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.showModal = false;
                this.formData = { nombre: '', email: '', telefono: '' };
            } catch (error) {
                alert('Hubo un error. Por favor intenta nuevamente.');
            } finally {
                button.classList.remove('loading');
            }
        },

        async submitContactForm() {
            const button = event.target;
            button.classList.add('loading');
            this.sending = true;
            try {
                const message = this.formatWhatsAppMessage(this.contactForm, 'contact');
                const whatsappURL = `https://wa.me/+56912345678?text=${message}`;
                
                const whatsappWindow = window.open(whatsappURL, 'whatsapp', 
                    'width=800,height=600,toolbar=0,menubar=0,location=0');
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.contactForm = { nombre: '', email: '', plan: '', mensaje: '' };
            } catch (error) {
                alert('Error al enviar el mensaje. Por favor intenta nuevamente.');
            } finally {
                this.sending = false;
                button.classList.remove('loading');
            }
        },

        // Optimizar el manejo de scroll en móviles
        handleScroll() {
            if (window.innerWidth <= 768) {
                const currentScroll = window.scrollY;
                this.hasScrolled = currentScroll > 50;
                
                // Ocultar/mostrar navbar al hacer scroll
                if (currentScroll > this.lastScroll && currentScroll > 100) {
                    document.querySelector('.navbar').style.transform = 'translateY(-100%)';
                } else {
                    document.querySelector('.navbar').style.transform = 'translateY(0)';
                }
                this.lastScroll = currentScroll;
            }
        }
    },
    mounted() {
        window.addEventListener('scroll', () => {
            this.hasScrolled = window.scrollY > 50
        })
        this.initIntersectionObserver()
        
        // Remove the old plan cards animation
        const planCards = document.querySelectorAll('.plan-card')
        planCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`
        })

        // Cerrar menú al redimensionar la ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Inicializar Swiper
        new Swiper('.promotionsSwiper', {
            effect: 'cards',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            }
        });

        // Mejorar rendimiento del scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Manejar cambios de orientación
        window.addEventListener('orientationchange', () => {
            if (this.isMenuOpen) this.closeMenu();
        });
    }
}).mount('#app')
