(function() {
    if (document.readyState !== 'loading') {
        initDOM();
    } else {
        document.addEventListener('DOMContentLoaded', initDOM);
    }

    function initDOM() {
        var topMenus = document.querySelectorAll('.et_mobile_menu > li');
        var mobileMenuToggle = document.querySelector(
            '.mobile_menu_bar_toggle'
        );
        var mobileMenu = document.querySelector('.et_mobile_menu');

        // Add click handler for mobile menu toggle
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.toggle('mobile-menu--hidden');
        });

        // Add click event listeners that show/hide the submenu items
        Object.keys(topMenus).forEach(function(key) {
            var submenu = topMenus[key].getElementsByClassName('sub-menu')[0];
            if (submenu) {
                submenu.style.display = 'none';
            }
            topMenus[key].children[0].addEventListener('click', function(e) {
                var sibling = e.currentTarget.nextElementSibling;
                if (!sibling) return;
                sibling.style.display = sibling.style.display === 'none'
                    ? ''
                    : 'none';
            });
        });
    }
})();
