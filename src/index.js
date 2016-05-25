import $ from 'jquery';
import svg4everybody from 'svg4everybody';

import 'block/common';
import 'layout/work';

svg4everybody();

(function() {

    if ($('body').hasClass('c-homepage')) {
        require.ensure([], (require) => {
            require('page/main');
        }, 'main');
    }

})();
