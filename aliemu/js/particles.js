/* eslint-env browser */
(function() {
    if (document.readyState !== 'loading') init();
    else document.addEventListener('DOMContentLoaded', init);

    function init() {
        particlesJS('particles', {
            particles: {
                number: {
                    value: 150,
                    density: {
                        enable: true,
                        value_area: 850,
                    },
                },
                color: {
                    value: '#00b092',
                },
                shape: {
                    type: 'circle',
                },
                opacity: {
                    value: 0.8,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.4,
                        sync: false,
                    },
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 20,
                        size_min: 1,
                        sync: false,
                    },
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#345995',
                    opacity: 0.3,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200,
                    },
                },
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab',
                    },
                    onclick: {
                        enable: true,
                        mode: 'push',
                    },
                    resize: true,
                },
                modes: {
                    grab: {
                        distance: 175,
                        line_linked: {
                            opacity: 0.5,
                        },
                    },
                    bubble: {
                        distance: 400,
                        size: 4,
                        duration: 2,
                        opacity: 8,
                        speed: 3,
                    },
                    repulse: {
                        distance: 80,
                        duration: 0.4,
                    },
                    push: {
                        particles_nb: 4,
                    },
                    remove: {
                        particles_nb: 2,
                    },
                },
            },
            retina_detect: true,
        });
    }
})();
