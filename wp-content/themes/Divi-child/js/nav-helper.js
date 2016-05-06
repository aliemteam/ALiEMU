(function() {
  'use strict';

  if (document.readyState != 'loading'){
    initDOM();
  } else {
    document.addEventListener('DOMContentLoaded', initDOM);
  }

  function initDOM() {

    var topMenus = document.querySelectorAll('#mobile_menu > li');

    // Add click event listeners that show/hide the submenu items
    Object.keys(topMenus).forEach(function(key) {
      topMenus[key].addEventListener('click', function(e) {
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
