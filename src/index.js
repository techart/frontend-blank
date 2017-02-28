import $ from 'jquery';

import 'block/common';
import 'layout/work';


(function() {

    if ($('body').hasClass('c-homepage')) {
        require.ensure([], (require) => {
            require('page/main');
        }, 'main');
    }

})();
