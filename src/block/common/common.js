function requireAll(r) {
    r.keys().map(function(key) {
        if (key.split('/').length <= 3) {
            return r(key);
        }
    });
}
requireAll(require.context('.', true, /[^twig]$/));
