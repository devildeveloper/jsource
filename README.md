JSource
=======

> A vanilla javascript resource for the everyday developer.


These javascript resources can be used standalone or with one another. They are meant to be vanilla javascript resources that are lightweight and useful. Basically, this is where I write scripts one time only so I can reuse them. These resources are always a result of not being able to find what I need in another script. All too often javascript resources just try to do too much. I typically aim to make these as small and basic as possible. That being said, they are great starting points in a sea of bloated scripts.


### Src
 - [Blit](https://github.com/kitajchuk/jsource/blob/master/src/Blit.js) - A simple gamecycle engine
 - [debounce](https://github.com/kitajchuk/jsource/blob/master/src/debounce.js) - The classic debounce pattern
 - [Easing](https://github.com/kitajchuk/jsource/blob/master/src/Easing.js) - A base set of easing methods
 - [EventApi](https://github.com/kitajchuk/jsource/blob/master/src/EventApi.js) - A basic cross-browser event api
 - [Eventful](https://github.com/kitajchuk/jsource/blob/master/src/Eventful.js) - A singleton event dispatching utility
 - [Isearch](https://github.com/kitajchuk/jsource/blob/master/src/Isearch.js) - Expression matching for term lists
 - [KonamiCode](https://github.com/kitajchuk/jsource/blob/master/src/KonamiCode.js) - A konami code easter egg handler
 - [MatchRoute](https://github.com/kitajchuk/jsource/blob/master/src/MatchRoute.js) - A wildcard route matcher
 - [MediaBox](https://github.com/kitajchuk/jsource/blob/master/src/MediaBox.js) - An audio and video box manager
 - [PushState](https://github.com/kitajchuk/jsource/blob/master/src/PushState.js) - A simple history pushState class utility
 - [Router](https://github.com/kitajchuk/jsource/blob/master/src/Router.js) - Handles basic GET routing
 - [scroll2](https://github.com/kitajchuk/jsource/blob/master/src/scroll2.js) - A basic window scroll-to function
 - [Stagger](https://github.com/kitajchuk/jsource/blob/master/src/Stagger.js) - A stepped timeout manager
 - [throttle](https://github.com/kitajchuk/jsource/blob/master/src/throttle.js) - The classic throttle pattern
 - [TouchMe](https://github.com/kitajchuk/jsource/blob/master/src/TouchMe.js) - A lightweight, singleton touch event api
 - [Tween](https://github.com/kitajchuk/jsource/blob/master/src/Tween.js) - A simple tween class using requestAnimationFrame


### Docs
Run the following to jsdoc all the code in the src directory.

```shell
# make jsdocs
make jsdocs

# start a server
python -m SimpleHTTPServer
```

You should be able to see the docs at [http://localhost:8000/docs/](http://localhost:8000/docs/)


### Build
You can use [grunt](http://gruntjs.com/) to build just a single resource you need. For instance, the `Router` uses `PushState` and `MatchRoute` standalone classes. That's actually the only case where files are broken out and need to be combined. Well, `scrollTo` uses `Tween`. Anyway, the following would build Router for you as an example:
```shell
# build Router with grunt
grunt build:Router
```

This distributes to `dist/Router.js` and `dist/Router.min.js`.