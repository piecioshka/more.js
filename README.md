# more.js

If you have a table with long text in cells, attach this lib, and enjoy a better appearance.<br />
More about that tool on: http://piecioshka.pl/blog/2014/01/30/more-js-z-czym-to-sie-je.html

## Example

1. Before use:<br />
![Before use](http://piecioshka.pl/blog/images/posts/more-js-normal.png "Before use")
2. After use or after 'less' link clicked:<br >
![Before use](http://piecioshka.pl/blog/images/posts/more-js-collapse.png "After use")
3. After use and click 'more' link:<br />
![Before use](http://piecioshka.pl/blog/images/posts/more-js-expand.png "Before use and click")

Ths line is responsible for that effect. Run after table was rendered:
```js
new More({
    selector: 'table#my_table',
    limit: 20
});
```

## Demo

If you are interested how table look like after transformation, check
this http://piecioshka.pl/projects/more.js/demo

## License

[The MIT License][0]

[0]: http://piecioshka.mit-license.org
