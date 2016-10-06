# Overview

## Javascript 

The app is built with [CommonsJS](https://en.wikipedia.org/wiki/CommonJS) modules, which is the format used by [Node.js](https://nodejs.org). This allows us to use any modules from the vast [NPM](https://www.npmjs.com/) repository by simply running `npm install module-name` and then `require('module-name')` in our own modules.

Our build scripts packages all our modules into a single `.js` file using [browserify](http://browserify.org/). And development builds use [watchify](https://github.com/substack/watchify) to incrementally update those builds on the fly as you change the source codes.

The backbone of our app is [Ampersand.js](https://ampersandjs.com/), which is a modern take on [Backbone.js](http://backbonejs.org/) created as a set of CommonJS modules.

All of our codes are located at `node_modules/app` directory and so all of our modules can be `required` from each other like this:

```
var BaseView = require('app/base/base-view');
```

## HTML Templates

Tempalates are all written in [Jade](http://jade-lang.com/) and packed with [templatizer](https://github.com/HenrikJoreteg/templatizer) into a single CommonJS module by the build system. The module is written to `node_modules/app/templates.js`.

## CSS

All CSS is written in [Less](http://lesscss.org/), with [autoprefixer](https://www.npmjs.com/package/autoprefixer) automatically adding all the requied vendor prefixes. So we can simply write clean Less with no prefixes in our code. 

The build system creates a single `.css` file from `node_modules/app/index.less`, which `imports` all other `.less` files into itself.


## Source Maps

Developer builds have source maps injected to them so we can see our original Javascript and Less files in browser developer tools.

## Lodash Note

Currently, all of our modules, including Ampersand ones, use version 3.x of [Lodash](https://lodash.com/) micromodules.

So to avoid including duplicates, if you need to add a new lodash module to the project, make sure to install version 3.x, e.g.:

```
npm install --save lodash-debounce@3.x
```

# Installation

Make sure you have node.js installed on your system: [https://nodejs.org](https://nodejs.org)

Next, clone the repo and `cd` to it in your terminal.

Make sure you have `gulp-cli` installed on your system:

```
npm install --global gulp-cli
```

To fetch all external dependencies and put them into `node_modules` folder, run:

```
npm install
```

Then dedupe the project like this:

```
npm dedupe
```

And lastly, navigate to `node_modules/ampersand-collection-view` in your terminal and run `npm install` once again from that location.


#### Mac Users

If you're on a Mac, you may need to have root priveleges to run `npm`:

```
sudo npm install
```


### Development Mode

Simply run the following command from the project directory:

```
gulp
```

This will create/update a devevelopment build in `build/dev` folder and run a local web server with `livereload` and source maps support. Every time you change the source files, the build is automatically updated.

You can access the site at `http://localhost:3000/dev`. If you open it, every time you update the source code the app will be automatically reloaded. Except every time you update `.less` files, they will be applied even without page reload.


### Creating Production Builds

#### Dedupe

Before creating production builds, we want to make sure all duplicate and compatible dependencies are not included more than once. For this, simply run:

```
npm dedupe
```

This will put all compatible dependencies to the top of your `node_modules` directory, only once per dependency.

#### Building

Simply run the following command from the project directory:

```
gulp production
```

This will create/update a minimized and obfuscated build and put it into the `build/production` directory. Contents of this directory can be put hosted on any HTTP server like any static web page. In fact, the local webserver from the Development section above makes this build available at `http://localhost:3000/production` (the webserver simply serves the `build` directory).

To change the store that app would work with, edit `index.html` and find the following line:

```
window.SITE_URL = 'http://demo.instaproofs.com';
```

Replace `http://demo.instaproofs.com` to URL of the desired store.

#### Configuration Options

The following options can be used on both dev and production builds.

##### Change Store URL

You can dynamically change the store URL to be used by the app through loading the app with a link like this:

```
http://localhost:3000/dev#url=http://jonathan.instaproofs.com
```

This will save the URL to local storage so it will be kept through page reloads until you either reset it to another one or clear your storage. Just make sure to open links like that in a new tab and not in the one where the app is currently running.

##### Toggle Page Transitions

To toggle animated page transitions, open your browser's console and run:

```
toggleTransitions(); 
```

The new setting will be saved to local storage and kept through page reloads.

# Linting

Javascript is linted with JSHint. 

`.jshintrc` is in the root with full descriptions of all used settings. Be sure to have a look at that, as linting must pass. A lot of conventions are followed automatically thanks to JSHint. Your code editor should support linting on the fly, which is an extremely useful feature. 

You may also run "`gulp lint`" task in your terminal to lint all javascript in the project. 

# Code Conventions

Mostly commonly accepted rules. Plenty of the followed ones are from the good old [Crockford's list](http://javascript.crockford.com/code.html). This is mainly the listing of things that not quite everyone has agreed upon.


### Line Length

All lines are kept within **80 characters long**, whether it's code or comments.
Don't use auto-wrap.
If you must have a longer line, such as in case of a long regular expression, use something like `/* jshint maxlen: 200 */` on top of the file for linting to pass.

Jade templates are the exception, as it's frequently not possible to have them with 80-character limit.


### Indentation
Code blocks are indented with **2 spaces**.
When you need to break a line to fit into the length limit, indent with 4 spaces:

```js
if (this.photoViews[i].displayed && 
    !this.photoViews[i].loaded) {        
  this.photoViews[i].loadImage();
}
```

   
Or more, when appropriate:

```js
label.textContent = val ? 'In Cart' 
                        : 'Buy Image';
```
                                                    
### Variable Declarations

Sometimes it's OK to declare a bunch in one single-line `var` statement. But most of the time variables should be declared one per line, with a comment if appropriate. Almost always all local vars should be declared on the top of the function. Same for properties of views/models - at the top with comments.

Use **separate `var` statements** for each line instead of a single multi-line one:

```js
var a = 1; // GOOD
var b = 2;
  
var c = 1, // BAD
    d = 2;
```
This way there's no need to mess with the commas - each line/variable is by itself.

### Names

All variable names are in camelCase, except the properties of models, which keep their underscores, coming from a PHP-based server.

Files containing models and collections have `-model` and `-collection` in their names to deffirentiate from similarly named views.



### Misc

It's ok to have an `if`, `for` etc. statement without curly braces if modification seems unlikely.

`++` and `--` are used.

``==`` and `!=` are *never* used.
