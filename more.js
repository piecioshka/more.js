/**
 * @author Piotr Kowalski <piecioshka@gmail.com>
 * @description Add links 'more' or 'less' for cell with long content
 * @license The MIT License
 * @example
 *   new More({
 *       selector: '#mytable',
 *       limit: 10,
 *       useForceSlice: false
 *   });
 */
(function (root) {
    'use strict';

    /**
     * @param {Object} options
     * @param {string} options.selector Selector for table which will be transform.
     * @param {number} [options.limit=100] Number of chars what will be inside in cell
     * @param {number} [options.useForceSlice=false] Flag enable smooth string slice
     * @constructor
     */
    function More(options) {
        /**
         * Hashmap with cells.
         *
         * @type {Object}
         */
        this.bigCells = {};

        /**
         * Main settings.
         *
         * @type {Object}
         */
        this.settings = mixin({
            selector: null,
            limit: 100,
            useForceSlice: false
        }, options);

        this.initialize();
    }

    More.prototype = {
        initialize: function () {
            // get cells with long content
            var bigCellsList = this.getBigCells();

            // check if bigCellsList is array
            if (!isArray(bigCellsList)) {
                throw new Error('more.js: bigCellsList is not an array');
            }

            // for each cell cut content and add link to show more
            forEach(bigCellsList, function (cell) {
                this.applyShorter(cell);
            }, this);
        },

        getBigCells: function () {
            var bigCells = [];
            var target = root.document.querySelector(this.settings.selector);
            var cells = target.getElementsByTagName('td');

            if (!cells) {
                throw new Error("more.js: Sorry, cells doesn't exists");
            }

            // Convert NodeList => Array
            cells = Array.prototype.slice.call(cells);

            // checking if content of cell is too long
            forEach(cells, function (cell) {
                var text = getCellContent(cell);
                if (text.length > this.settings.limit) {
                    bigCells.push(cell);
                }
            }, this);

            return bigCells;
        },

        applyShorter: function (cell, uid) {
            // use set unique value of generate them
            uid = uid || getUID();

            // if we doesn't have cache text
            if (!this.bigCells[uid]) {
                // save it on cache list
                this.bigCells[uid] = getCellContent(cell);
            }

            var cellContent = getCellContent(cell);
            var shortVersion = smoothSlice(cellContent, this.settings.limit, this.settings.useForceSlice);

            // put into cell short version
            setCellContent(cell, shortVersion);

            // add link 'more'
            cell.appendChild(buildLink('applyLonger', 'more', cell, uid));
        },

        applyLonger: function (cell, uid) {
            // puts into cell long version (default)
            setCellContent(cell, this.bigCells[uid] + ' ');

            // add link 'less'
            cell.appendChild(buildLink('applyShorter', 'less', cell, uid));
        }
    };

    // Helpers
    // ------------------------------------------------------------------------

    function getUID() {
        return Math.random().toString(16).slice(2);
    }

    function getCellContent(cell) {
        return cell.innerText || cell.textContent;
    }

    function setCellContent(cell, content) {
        if ('innerText' in cell) {
            cell.innerText = content;
        } else if ('textContent' in cell) {
            cell.textContent = content;
        } else {
            throw new Error("more.js: Sorry, I can't update this element");
        }
    }

    function buildLink(fn, label, cell, uniqueId) {
        var self = this;
        var link = root.document.createElement('a');

        link.addEventListener('click', function (e) {
            e.preventDefault();
            self[fn](cell, uniqueId);
        });
        link.setAttribute('href', '#' + uniqueId);
        setCellContent(link, label);

        return link;
    }

    // Utilities
    // ------------------------------------------------------------------------

    function trim(source) {
        return source.replace(/^\s+|\s+$/g, '');
    }

    function smoothSlice(source, length, isForce) {
        if (source.length < length) {
            return source;
        }

        var last_space;
        var text = source.slice(0, length);

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
    }

    function mixin(source, target) {
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                source[key] = target[key];
            }
        }
        return source;
    }

    function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    function forEach(value, iterator, context) {
        context = context || this;
        var len = value.length;

        for (var i = 0; i < len; i++) {
            iterator.call(context, value[i]);
        }
    }

    return (root.More = More);

}(window));
