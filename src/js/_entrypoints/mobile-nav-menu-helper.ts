jQuery(document).ready($ => {
    const BUTTON_OPEN_CLASS = 'nav__toggle-button--open';
    const MENU_OPEN_CLASS = 'menu--open';

    const button = $('.nav__toggle-button');
    const menu = $('#menu-primary');

    button.click(() => {
        button.toggleClass(BUTTON_OPEN_CLASS);
        button.attr('aria-expanded', (_, att) => {
            return att === 'true' ? 'false' : 'true';
        });
        menu.toggleClass(MENU_OPEN_CLASS);
    });
});
