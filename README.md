JSource
=======

> A vanilla javascript resource for the everyday developer.


These javascript resources can be used standalone or with one another. They are meant to be vanilla js resources that are lightweight and useful. Basically, this is where I write scripts I don't want to have to write more than once and when I cannot find something out there that does what I want the way I want. A lot of resources just try to do too much.


### Docs
You can jsdoc the src directory to see what is in there.

```shell
# make jsdocs
make jsdocs

# start a server
python -m SimpleHTTPServer
```

You should be able to see the docs at [http://localhost:8000/docs/](http://localhost:8000/docs/);


### Build
You can use [grunt](http://gruntjs.com/) to build just a single resource you need. You can also just read the files and take what you need. They are clearly documented and state whether they need another file or not.
```shell
# build Router with grunt
grunt build:Router
```

The above would distribute to dist/Router.js and dist/Router.min.js.