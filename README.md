# more.js

If you have a table with long text in cells, attach this lib, and enjoy a better appearance.<br />
More about that tool on: [http://blog.piecioshka.pl/2014/01/30/more-js-z-czym-to-sie-je/][2]

## Example:

1. Before use:<br />
![Before use](http://blog.piecioshka.pl/wp-content/uploads/2014/01/normal.png "Before use")
2. After use or after 'less' link clicked:<br >
![Before use](http://blog.piecioshka.pl/wp-content/uploads/2014/01/collapse.png "Before use")
3. After use and click 'more' link:<br />
![Before use](http://blog.piecioshka.pl/wp-content/uploads/2014/01/expand.png "Before use")

Ths line is responsible for that effect. Run after table was rendered:
```js
new More('table#my_table', 20);
```

# Demo

If you are interested how table look like after transformation, check
this [http://jsninja.pl/more.js/example/][1]

## License

[The MIT License][0]

[0]: http://piecioshka.mit-license.org
[1]: http://jsninja.pl/more.js/example/
[2]: http://blog.piecioshka.pl/2014/01/30/more-js-z-czym-to-sie-je/