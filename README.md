# image-magnifier

[![Build Status](https://travis-ci.org/BigAB/image-magnifier.svg?branch=master)](https://travis-ci.org/BigAB/image-magnifier)

A CanJS Component for zoomable images

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'image-magnifier';
```

### CommonJS use

Use `require` to load `image-magnifier` and everything else
needed to create a template that uses `image-magnifier`:

```js
var plugin = require("image-magnifier");
```

## AMD use

Configure the `can` and `jquery` paths and the `image-magnifier` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'image-magnifier',
		    	location: 'node_modules/image-magnifier/dist/amd',
		    	main: 'lib/image-magnifier'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/image-magnifier/dist/global/image-magnifier.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
