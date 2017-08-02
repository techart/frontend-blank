import $ from 'jquery';

import 'block/common';
import 'layout/work';

(function () {
    "use strict";
    $(function () {
        if ($('body').hasClass('c-homepage')) {
            require.ensure([], (require) => {
                require('page/main');
            }, 'main');
        }
    })
})();
