/**
 * @fileOverview Add links 'more' or 'less' for cell with long content
 * @author Piotr Kowalski <piecioshka@gmail.com>
 * @license The MIT License
 * @dependencies: underscore.js {@link http://underscorejs.org}
 * @example
 *   new More({
 *       selector: '#mytable',
 *       limit: 10,
 *       useForceSlice: false
 *   });
 */

/*jslint nomen: true, indent: 4, vars: true */
/*global document */
(function (root, factory) {
    'use strict';

    root.More = factory(root._);
}(this, function (_) {
    'use strict';

    if (_ !== Object(_)) {
        throw new Error('more.js: required underscore is not an object');
    }

    // Utilities
    // ------------------------------------------------------------------------

    var trim = function (source) {
        return source.replace(/^\s+|\s+$/g, '');
    };

    var smoothSlice = function (source, length, isForce) {
        if (source.length < length) {
            return source;
        }

        var text = source.slice(0, length), last_space;
        if (source[length] === ' ') {
            return text + '...';
        }
        if (text[length - 1] === ' ') {
            return trim(text) + '...';
        }
        if (!isForce) {
            last_space = text.lastIndexOf(' ');
            if (last_space !== -1) {
                return text.slice(0, last_space) + '...';
            }
        }
        return text + '...';
    };

    // Main
    // ------------------------------------------------------------------------

    /**
     * @param {String} options.selector Selector for table which will be transform.
     * @param {number} options.limit Number of chars what will be inside in cell
     * @param {number} [options.useForceSlice=false] Flag enable smooth string slice
     * @constructor
     */
    function More(options) {
        this.bigCells = {};
        this.settings = {
            selector: null,
            limit: 100,
            useForceSlice: false
        };

        this.settings = _.extend(this.settings, options);
        this.initialize();
    }

    More.prototype = {
        initialize: function () {
            // get cells with long content
            var bigCellsList = this.getBigCells();
            // check if bigCellsList is array
            if (!_.isArray(bigCellsList)) {
                throw new Error('more.js: bigCellsList is not an array');
            }
            // for each cell cut content and add link to show more
            _.each(bigCellsList, function (cell) {
                this.applyShorter(cell);
            }, this);
        },

        getUID: function () {
            return Math.random().toString(16).slice(2);
        },

        getCellContent: function (cell) {
            return cell.innerText || cell.textContent;
        },

        setCellContent: function (cell, content) {
            if ('innerText' in cell) {
                cell.innerText = content;
            } else if ('textContent' in cell) {
                cell.textContent = content;
            } else {
                throw new Error("more.js: Sorry, I can't update this element");
            }
        },

        getBigCells: function () {
            var bigCells = [];
            var target = document.querySelector(this.settings.selector);
            var cells = target.getElementsByTagName('td');

            if (!cells) {
                throw new Error("more.js: Sorry, cells doesn't exists");
            }

            // Convert NodeList => Array
            cells = Array.prototype.slice.call(cells);

            // checking if content of cell is too long
            _.each(cells, function (cell) {
                var text = this.getCellContent(cell);
                if (text.length > this.settings.limit) {
                    bigCells.push(cell);
                }
            }, this);
            return bigCells;
        },

        applyShorter: function (cell, uid) {
            // use set unique value of generate them
            uid = uid || this.getUID();

            // if we doesn't have cache text
            if (!this.bigCells[uid]) {
                // save it on cache list
                this.bigCells[uid] = this.getCellContent(cell);
            }

            var cellContent = this.getCellContent(cell);
            var shortVersion = smoothSlice(cellContent, this.settings.limit, this.settings.useForceSlice);

            // put into cell short version
            this.setCellContent(cell, shortVersion);

            // add link 'more'
            cell.appendChild(this.buildLink('applyLonger', 'more', cell, uid));
        },

        applyLonger: function (cell, uid) {
            // puts into cell long version (default)
            this.setCellContent(cell, this.bigCells[uid] + ' ');

            // add link 'less'
            cell.appendChild(this.buildLink('applyShorter', 'less', cell, uid));
        },

        buildLink: function (fn, label, cell, uniqueId) {
            var self = this;
            var link = document.createElement('a');
            link.addEventListener('click', function (e) {
                e.preventDefault();
                self[fn](cell, uniqueId);
            });
            link.setAttribute('href', '#' + uniqueId);
            this.setCellContent(link, label);
            return link;
        }
    };

    return More;
}));
