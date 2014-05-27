JSource
=======

> A vanilla javascript resource for the everyday developer.

These javascript resources can be used standalone or with one another. They are meant to be vanilla javascript resources that are lightweight and useful. Basically, this is where I write scripts one time only so I can reuse them. There are a few scripts that are written on top of library dependencies such as [jQuery](https://github.com/jquery/jquery) and [Hammerjs](https://github.com/EightMedia/hammer.js).

## Authoring Javascript
Document all javascript fully in [jsdoc](http://usejsdoc.org/) format. You can generate jsdocs for jsource scripts with grunt, `grunt jsdoc`. They will be compiled into a `docs` directory. Javascript that is written as a [jQuery](https://github.com/jquery/jquery) extension should be done so in such a way that it supports extending other frameworks as well such as [Ender](https://github.com/ender-js/ender-js) and [Zepto](https://github.com/madrobby/zepto). This makes the code more reusable across projects using different frameworks either by necessity or preference.

### Javascript Listing
Check the [src](https://github.com/kitajchuk/jsource/blob/master/src/) to see what is available.