jQuery(document).ready(() => {
    const mobileMenuToggle = document.querySelector('.mobile_menu_bar_toggle');
    const mobileMenu = document.querySelector('.et_mobile_menu');
    const menus = document.querySelectorAll('.et_mobile_menu > li > a');
    const submenus = <NodeListOf<HTMLUListElement>>document.querySelectorAll('.et_mobile_menu ul.sub-menu');

    for (const submenu of submenus) {
        submenu.style.display = 'none';
    }

    for (const menu of menus) {
        menu.addEventListener('click', clickHandler);
    }

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', e => {
            e.preventDefault();
            mobileMenu.classList.toggle('mobile-menu--hidden');
        });
    }

    function clickHandler(e: any) {
        if (e.currentTarget.innerText === 'Login') {
            return;
        }
        e.preventDefault();
        const sibling = e.currentTarget.nextElementSibling;
        if (sibling.style.display === '') {
            sibling.style.display = 'none';
            return;
        }
        for (const submenu of submenus) {
            submenu.style.display = 'none';
        }
        e.currentTarget.nextElementSibling.style.display = '';
    }
});
