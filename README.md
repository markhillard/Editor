# Snap

Snap is an infinitely nestable 12 column fluid grid. Use it for rapid prototyping, wireframes, or fully functional websites ready for production. This simple, yet extensible grid system is focused on modern browser support, efficient code, and maintainability.

## HTML Structure

There's not much too it.

1. Create a wrapping `div` with the class of `container`.
2. Create a `div` with the class of `row`.
3. Create a few child `div`'s, each with a class of `g-n` (**n** being a number from 1 - 12).
4. Ensure that each column in a row adds up to 12.

### Nesting

To nest columns, simply create another row inside a column and add more columns inside that row (see example below).

The `g-n` class should always add up to whatever the parent column's class is. For instance, if you have a column with a class of `g-4`, each child column would have a class of `g-2` (or `g-1` + `g-3`).

## Features

### Base Styles

I've created a set of "sanitized" styles to get started with. Included is a modified CSS reset, neutral styles for typography, block &amp; inline quotations, links, lists, images, buttons, and form elements as well as other miscellaneous "helper" classes.

These are all inside a separate stylesheet, so just delete it if you'd like to start from scratch.

### Spacing &amp; Ordering

You can use the following classes to add space around columns and/or adjust their stack order if needed (**n** being a number from 1 - 11).

- Prefix Space (padding-left): `prefix-n`
- Suffix Space (padding-right): `suffix-n`
- Push Order (left): `push-n`
- Pull Order: (right) `pull-n`

**Notes:**

- If you use these classes, columns and spaces inside a **top-level** row should still add up to 12.
- It's possible, but not recommended to push or pull nested columns because of alignment issues.

### Tablet Views

You can use the following classes (in addition to `g-n`) to prevent columns from stacking when your screen gets down to tablet (portrait) size. These will also work on nested columns.

- 2 Equal Columns: `t-g-2`
- 3 Equal Columns: `t-g-3`

### Forced Equal Columns

This helps when you want 2 or 3 equal columns that can't fit inside a container (i.e. 3 equal columns inside a `div` with a class of `g-8`). Simply use the `g-1-2` or `g-1-3` classes to achieve this.

## Browser Support

Snap works in all modern web browsers and IE9+.

## Examples

**4 Columns:**
```html
<div class="container">
    <div class="row">
        <div class="g-3">
            <h3>g-3</h3>
        </div>
        <div class="g-3">
            <h3>g-3</h3>
        </div>
        <div class="g-3">
            <h3>g-3</h3>
        </div>
        <div class="g-3">
            <h3>g-3</h3>
        </div>
    </div>
</div>
```

**3 Nested Columns / 3 Column Tablet (Portrait) View:**
```html
<div class="container">
    <div class="row">
        <div class="g-4 t-g-3">
            <h3>g-4</h3>
            <div class="row">
                <div class="g-2">
                    <h3>g-2</h3>
                </div>
                <div class="g-2">
                    <h3>g-2</h3>
                </div>
            </div>
        </div>
        <div class="g-4 t-g-3">
            <h3>g-4</h3>
            <div class="row">
                <div class="g-2">
                    <h3>g-2</h3>
                </div>
                <div class="g-2">
                    <h3>g-2</h3>
                </div>
            </div>
        </div>
        <div class="g-4 t-g-3">
            <h3>g-4</h3>
            <div class="row">
                <div class="g-2">
                    <h3>g-2</h3>
                </div>
                <div class="g-2">
                    <h3>g-2</h3>
                </div>
            </div>
        </div>
    </div>
</div>
```

## Copyright

&copy; 2015 Mark Hillard

[MIT License](LICENSE.md)
