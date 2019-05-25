import domReady from '@wordpress/dom-ready';

const BUTTON_OPEN_CLASS = 'nav__toggle-button--open';
const MENU_OPEN_CLASS = 'menu--open';

domReady(() => {
    const button = document.querySelector<HTMLButtonElement>(
        '.nav__toggle-button',
    );
    const menu = document.querySelector<HTMLUListElement>('#menu-primary');

    if (button && menu) {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.classList.toggle(BUTTON_OPEN_CLASS);
            button.setAttribute('aria-expanded', (!isExpanded).toString());
            menu.classList.toggle(MENU_OPEN_CLASS);
        });
    }
});
