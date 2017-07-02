document.addEventListener('DOMContentLoaded', function() {
    var mobileMenuToggle = document.querySelector('.mobile_menu_bar_toggle');
    var mobileMenu = document.querySelector('.et_mobile_menu');
    var menus = document.querySelectorAll('.et_mobile_menu > li > a');
    var submenus = document.querySelectorAll('.et_mobile_menu ul.sub-menu');

    submenus.forEach(function(submenu) {
        submenu.style.display = 'none';
    });

    menus.forEach(function(menu) {
        menu.addEventListener('click', clickHandler);
    });

    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        mobileMenu.classList.toggle('mobile-menu--hidden');
    });

    function clickHandler(e) {
        e.preventDefault();
        var sibling = e.currentTarget.nextElementSibling;
        if (sibling.style.display === '') {
            sibling.style.display = 'none';
            return;
        }
        submenus.forEach(function(submenu) {
            submenu.style.display = 'none';
        });
        e.currentTarget.nextElementSibling.style.display = '';
    }
});
