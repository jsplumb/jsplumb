# jsPlumb

If you're new to jsPlumb, please do take the time to read the [documentation](https://docs.jsplumbtoolkit.com/community/). 
There are a few integration issues that you should be aware of: z-index needs special attention, for example.

This project is the 'Community Edition' of jsPlumb. The 'Toolkit Edition' is a commercially-licensed wrapper around this. 

**This project is not the correct place to report issues for the Toolkit edition**. The Toolkit is not a public project. Issues reported for the Toolkit edition in this issue tracker will be deleted.

This is version 6.x of the jsPlumb Community Edition.


## Packages

In 6.x we have dispensed with the multiple packages from 5.x and we now ship a single package. If you're using a bundler with tree shaking, as the vast majority of people are nowadays, you'll get a smaller bundle size with 6.x than you did with 5.x as it is more compatible with tree shaking.

The single import for 6.x is:

```json
{
  "@jsplumb/browser-ui":"^6.0,0"
}
``` 

### What if I'm not using a package manager?

If you're not using a package manager at all then you can use the UMD that ships in the jsPlumb package.

```html
<script src="node_modules/@jsplumb/browser-ui/js/jsplumb-browser-ui.umd.js"></script>
```

---

## Documentation

For the Community edition the documentation for version 6.x is here:

[https://docs.jsplumbtoolkit.com/community/](https://docs.jsplumbtoolkit.com/community/)

For the previous versions of jsPlumb, docs are here:

[https://docs.jsplumbtoolkit.com/community/5.x](https://docs.jsplumbtoolkit.com/community/5.x)

and

[https://docs.jsplumbtoolkit.com/community/2.x](https://docs.jsplumbtoolkit.com/community/2.x)


## Issues

jsPlumb uses GitHub's issue tracker for enhancements and bugs

## Requirements

No external dependencies.

## jsPlumb in action

Links to various Community Edition demonstrations can be found [here](https://community.jsplumbtoolkit.com).

## Tests

There is a full suite of unit tests checked in to the `test` and `dist/test` directories.

## Twitter

Please don't.

## License

All 1.x.x, 2.x.x, 4.x.x, 5.x.x and 6.x.x versions of jsPlumb Community edition are dual-licensed under both MIT and GPLv2. 
