/*!
 *
 * Element state manager
 *
 * @compat: jQuery, Ender, Zepto
 * @author: @kitajchuk
 * @url: http://github.com/kitajchuk
 *
 *
 */
(function ( $ ) {


"use strict";


(function ( factory ) {

    if ( typeof define === "function" && define.amd ) {
        define( [ "jquery" ], factory );

    } else {
        factory( $ );
    }

})(function ( $ ) {

    $.fn.stateManage = function ( event, stateClass, callback ) {
        var $this = this;

        return this.on( event, function ( e ) {
            var $elem = $( this );

            $this.removeClass( stateClass );

            $elem.addClass( stateClass );

            if ( typeof callback === "function" ) {
                callback.call( this, e );
            }
        });
    };

});


})( (window.jQuery || window.ender || window.Zepto) );