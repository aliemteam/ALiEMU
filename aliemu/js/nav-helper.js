/* eslint-env browser */
/* eslint func-names: 0, prefer-arrow-callback: 0, vars-on-top: 0, no-var: 0 */
(function () {
    if (document.readyState !== 'loading') {
        initDOM();
    } else {
        document.addEventListener('DOMContentLoaded', initDOM);
    }

    function initDOM() {
        var topMenus = document.querySelectorAll('#mobile_menu > li');

        // Add click event listeners that show/hide the submenu items
        Object.keys(topMenus).forEach(function (key) {
            var submenu = topMenus[key].getElementsByClassName('sub-menu')[0];
            if (submenu) {
                submenu.style.display = 'none';
                for (var i = 0; i < submenu.children.length; i++) {
                    submenu.children[i].style.display = 'none';
                }
            }

            topMenus[key].children[0].outerHTML = topMenus[key].children[0].outerHTML;

            topMenus[key].children[0].addEventListener('click', function (e) {
                e.preventDefault();
                var isLink =
                    e.target.tagName === 'A'
                    && e.target.attributes[0].nodeValue !== '#'
                    && e.target.pathname !== '/user/';

                if (isLink) {
                    window.location.href = e.target.href;
                    return;
                }

                var items = e.target.nextElementSibling.children;
                var j;

                if (items[0].style.display === 'none' || !items[0].style.display) {
                    for (j = 0; j < items.length; j++) {
                        items[j].style.display = 'list-item';
                    }
                } else {
                    for (j = 0; j < items.length; j++) {
                        items[j].style.display = 'none';
                    }
                }
            });
        });
    }
}());
