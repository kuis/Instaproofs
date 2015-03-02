# Linting

Javascript is linted with JSHint. `.jshintrc` is in the root with full descriptions of all used settings. Be sure to have a look at that, as linting must pass. A lot of conventions are followed automatically thanks to JSHint. Your code editor should support linting on the fly, which is an extremely useful feature. 
`gulp lint` task should also be used before pushing any significant commit to the repo. 

# Code Conventions

Mostly commonly accepted rules. Plenty of the followed ones are from the good old [Crockford's list](http://javascript.crockford.com/code.html). This is mainly the listing of things that not quite everyone has agreed upon.


### Line Length

All lines are kept within **80 characters long**, whether it's code or comments.
Don't use auto-wrap.
If you must have a longer line, such as in case of a long regular expression, use something like `/* jshint maxlen: 200 */` on top of the file for linting to pass.


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
label.innerHTML = val ? 'In Cart' 
                      : 'Buy Image';
```
                                                    
### Variable Declarations

Sometimes it's OK to declare a bunch in one single-line `var` statement. But most of the time variables should be declared one per line, with a comment if appropriate. Almost always all local vars should be declared on the top of the function. Same for properties of views/models - at the top with comments.

Use **separate `var` statements** for each line instead of a single multi-line one:

```js
var a = 1; // GOOD
var b = 2;
  
var c = 1, // BAD
  d = 2';
```
This way there's no need to mess with the commas - each line/variable is by itself.

### Names

All variable names are in camelCase, except the properties of models, which keep their underscores, coming from a PHP-based server.

Files containing models and collections have `-model` and `-collection` in their names to deffirentiate from similarly named views.



### Misc

It's ok to have an `if`, `for` etc. statement without curly braces if modification seems unlikely.

`++` and `--` are used.

``==`` and `!=` are *never* used.
