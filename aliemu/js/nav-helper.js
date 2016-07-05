(function() {
    'use strict';

    if (document.readyState != 'loading') {
        initDOM();
    } else {
        document.addEventListener('DOMContentLoaded', initDOM);
    }

    function initDOM() {

        var topMenus = document.querySelectorAll('#mobile_menu > li');

        // Add click event listeners that show/hide the submenu items
        Object.keys(topMenus).forEach(function(key) {

            var submenu = topMenus[key].getElementsByClassName('sub-menu')[0];
            if (submenu) {
                submenu.style.display = 'none';
                for (var i = 0; i < submenu.children.length; i++) {
                    submenu.children[i].style.display = 'none';
                }
            }

            topMenus[key].children[0].outerHTML = topMenus[key].children[0].outerHTML;

            topMenus[key].children[0].addEventListener('click', function(e) {
                e.preventDefault();
                var isLink =
                    e.target.tagName === 'A'
                    && e.target.attributes[0].nodeValue !== '#'
                    && e.target.pathname !== '/user/'

                if (isLink) {
                    return window.location.href = e.target.href;
                }

                var items = e.target.nextElementSibling.children;
                var i;

                if (items[0].style.display == 'none' || !items[0].style.display) {
                    for (i = 0; i < items.length; i++) {
                        items[i].style.display = 'list-item';
                    }
                } else {
                    for (i = 0; i < items.length; i++) {
                        items[i].style.display = 'none';
                    }
                }
            });
        });
    }

})();
