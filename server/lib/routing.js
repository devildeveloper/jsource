/*
 * Serve static files
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */

(function ( exports ) {

var router,
    
    _instance;

router = function ( app ) {
    if ( !(this instanceof router) ) {
        return new router( app );
    }
    
    _instance = this;
    
    this.app = app;
};

exports.router = router;

})( exports );