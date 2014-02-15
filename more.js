/**
 * @fileOverview Add links 'more' or 'less' for cell with long content
 * @author Piotr Kowalski <piecioshka@gmail.com>
 * @license The MIT License
 * @example
 *   new More('#mytable', 10);
 */
/*jslint nomen: true, indent: 4, vars: true */
/*global document, More */
(function (global) {
    'use strict';

    /**
     * @param {String} selector Selector for table which will be transform.
     * @param {number} charsLimit Number of chars what will be inside in cell
     * @constructor
     */
    function More(selector, charsLimit) {
        this.settings = {
            selector: selector,
            limit: charsLimit
        };
        this.bigCells = {};
        this.initialize();
    }

    More.prototype.initialize = function () {
        var self = this;
        // get cells with long content
        var bigCells = this.getBigCells();
        // for each cell cut content and add link to show more
        bigCells.forEach(function (cell) {
            self.applyShorter(cell);
        });
    };

    More.prototype.getUID = function () {
        return Math.random().toString(16).slice(2);
    };

    More.prototype.getCellContent = function (cell) {
        return cell.innerText || cell.textContent;
    };

    More.prototype.setCellContent = function (cell, content) {
        if ('innerText' in cell) {
            cell.innerText = content;
        } else if ('textContent' in cell) {
            cell.textContent = content;
        } else {
            throw new Error("Sorry, I can't update this element");
        }
    };

    More.prototype.getBigCells = function () {
        var self = this;
        var bigCells = [];
        var target = document.querySelector(this.settings.selector);
        var cells = target.getElementsByTagName('td');

        if (!cells) {
            throw new Error("Sorry, cells doesn't exists");
        }

        // NodeList => Array
        cells = Array.prototype.slice.call(cells);

        // checking if content of cell is too long
        cells.forEach(function (cell) {
            var text = self.getCellContent(cell);
            if (text.length > self.settings.limit) {
                bigCells.push(cell);
            }
        });
        return bigCells;
    };

    More.prototype.applyShorter = function (cell, uid) {
        // use set unique value of generate them
        uid = uid || this.getUID();

        // if we doesn't have cache text
        if (!this.bigCells[uid]) {
            // save it on cache list
            this.bigCells[uid] = this.getCellContent(cell);
        }

        // put into cell short version
        this.setCellContent(cell, this.getCellContent(cell).substring(0, this.settings.limit) + ' ');

        // add link 'more'
        cell.appendChild(this.buildLink('applyLonger', 'more', cell, uid));
    };

    More.prototype.applyLonger = function (cell, uid) {
        // puts into cell long version (default)
        this.setCellContent(cell, this.bigCells[uid] + ' ');

        // add link 'less'
        cell.appendChild(this.buildLink('applyShorter', 'less', cell, uid));
    };

    More.prototype.buildLink = function (fn, label, cell, uniqueId) {
        var self = this;
        var link = document.createElement('a');
        link.addEventListener('click', function (e) {
            e.preventDefault();
            self[fn](cell, uniqueId);
        });
        link.setAttribute('href', '#' + uniqueId);
        this.setCellContent(link, label);
        return link;
    };

    // exports
    global.More = More;

}(this));
