# Code Formatting Guidelines

If you're using Atom editor, download the `atom-beautify` package.

## Rules

### General
- [ ] Beautify entire file on save

### CSS
- [x] Align assignments
- [x] Indent comments
- [x] Newline between rules

### HTML
- Brace style = collapse
- Indent size = 4
- [x] Preserve newlines

### JS
- Brace style = collapse
- Indent size = 2
- [x] Keep function indentation
- [x] Preserve newlines
- [x] Space before a conditional

Be sure that chained variables are formatted like below (there is no setting for this)

```js
var test             = require('test'),
    longVariableName = require('longVariableName'),
    testTwo          = require('testTwo');

var variableOne        = 12,
    longerVariableName = ['test', 'test', 'test'],
    short              = NULL;
```
### PHP
Follow the [WordPress PHP standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/), except for the following:

1. Do not add a space the the ends of content within parenthaces (this becomes unbelievably sloppy with nested parenthaces).
```php
// Bad
if ( eval( round( $test * ( 3 + 4 ) ) ) >= 10 ) {
    echo 'something';
}

// Good
if (eval(round($test * (3 + 4))) >= 10) {
    echo 'something';
}
```
