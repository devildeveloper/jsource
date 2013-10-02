app-js-bank
===========

[localhost:5050]: http://localhost:5050

Resource bank of app-js files that can be used with grunt-nautilus

## Testing a file

First install packages:

```
npm install
```

For example, to test the konami code util you would run the following:

```
grunt test:konami
```

Then to test the build run the following:

```
cd server

node server.js
```

You should be able to visit [localhost:5050][]. For scripts that require some applicational code to test, create an index.js file at the root of the repo and test there.

_(More to come on this...)_