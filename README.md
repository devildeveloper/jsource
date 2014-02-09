JSource
=======

> A vanilla javascript resource for the everyday developer.


These javascript resources can be used standalone or with one another. They are meant to be vanilla javascript resources that are lightweight and useful. Basically, this is where I write scripts one time only so I can reuse them. These resources are always a result of not being able to find what I need in another script. All too often javascript resources just try to do too much. I typically aim to make these as small and basic as possible. That being said, they are great starting points in a sea of bloated scripts.


### Docs
You can jsdoc the src directory to see what is in there.

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