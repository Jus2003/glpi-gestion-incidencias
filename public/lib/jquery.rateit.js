/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 73:
/***/ (() => {

/*! RateIt | v1.1.5 / 03/10/2021
    https://github.com/gjunge/rateit.js | Twitter: @gjunge
*/
(function ($) {
    $.rateit = {
        aria: {
            resetLabel: 'reset rating',
            ratingLabel: 'rating'
        }
    };

    $.fn.rateit = function (p1, p2) {
        //quick way out.
        var index = 1;
        var options = {}; var mode = 'init';
        var capitaliseFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.substr(1);
        };

        if (this.length === 0) { return this; }


        var tp1 = typeof p1;
        if (tp1 == 'object' || p1 === undefined || p1 === null) {
            options = $.extend({}, $.fn.rateit.defaults, p1); //wants to init new rateit plugin(s).
        }
        else if (tp1 == 'string' && p1 !== 'reset' && p2 === undefined) {
            return this.data('rateit' + capitaliseFirstLetter(p1)); //wants to get a value.
        }
        else if (tp1 == 'string') {
            mode = 'setvalue';
        }

        return this.each(function () {
            var item = $(this);


            //shorten all the item.data('rateit-XXX'), will save space in closure compiler, will be like item.data('XXX') will become x('XXX')
            var itemdata = function (key, value) {

                if (value != null) {
                    //update aria values
                    var ariakey = 'aria-value' + ((key == 'value') ? 'now' : key);
                    var range = item.find('.rateit-range');
                    if (range.attr(ariakey) != undefined) {
                        range.attr(ariakey, value);
                    }

                }

                arguments[0] = 'rateit' + capitaliseFirstLetter(key);
                return item.data.apply(item, arguments); ////Fix for WI: 523
            };

            //handle programmatic reset
            if (p1 == 'reset') {
                var setup = itemdata('init'); //get initial value
                for (var prop in setup) {
                    item.data(prop, setup[prop]);
                }

                if (itemdata('backingfld')) { //reset also backingfield
                    var fld = $(itemdata('backingfld'));
                    // If backing field is a select box with valuesrc option set to "index", reset its selectedIndex property; otherwise, reset its value.
                    if (fld[0].nodeName == 'SELECT' && fld[0].getAttribute('data-rateit-valuesrc') === 'index') {
                        fld.prop('selectedIndex', itemdata('value'));
                    }
                    else {
                        fld.val(itemdata('value'));
                    }
                    fld.trigger('change');
                    if (fld[0].min) { fld[0].min = itemdata('min'); }
                    if (fld[0].max) { fld[0].max = itemdata('max'); }
                    if (fld[0].step) { fld[0].step = itemdata('step'); }
                }
                item.trigger('reset');
            }

            //add the rate it class.
            if (!item.hasClass('rateit')) { item.addClass('rateit'); }

            var ltr = item.css('direction') != 'rtl';

            // set value mode
            if (mode == 'setvalue') {
                if (!itemdata('init')) { throw 'Can\'t set value before init'; }


                //if readonly now and it wasn't readonly, remove the eventhandlers.
                if (p1 == 'readonly' && p2 == true && !itemdata('readonly')) {
                    item.find('.rateit-range').off();
                    itemdata('wired', false);
                }
                //when we receive a null value, reset the score to its min value.
                if (p1 == 'value') {
                    p2 = (p2 == null) ? itemdata('min') : Math.max(itemdata('min'), Math.min(itemdata('max'), p2));
                }
                if (itemdata('backingfld')) {
                    //if we have a backing field, check which fields we should update.
                    //In case of input[type=range], although we did read its attributes even in browsers that don't support it (using fld.attr())
                    //we only update it in browser that support it (&& fld[0].min only works in supporting browsers), not only does it save us from checking if it is range input type, it also is unnecessary.
                    var fld = $(itemdata('backingfld'));
                    // If backing field is a select box with valuesrc option set to "index", update its selectedIndex property; otherwise, update its value.
                    if (fld[0].nodeName == 'SELECT' && fld[0].getAttribute('data-rateit-valuesrc') === 'index') {
                        if (p1 == 'value') { fld.prop('selectedIndex', p2); }
                    }
                    else {
                        if (p1 == 'value') { fld.val(p2); }
                    }
                    if (p1 == 'min' && fld[0].min) { fld[0].min = p2; }
                    if (p1 == 'max' && fld[0].max) { fld[0].max = p2;}
                    if (p1 == 'step' && fld[0].step) { fld[0].step = p2; }
                }

                itemdata(p1, p2);
            }


            //init rateit plugin
            if (!itemdata('init')) {

                //get our values, either from the data-* html5 attribute or from the options.
                itemdata('mode', itemdata('mode') || options.mode)
                itemdata('icon', itemdata('icon') || options.icon)
                itemdata('min', isNaN(itemdata('min')) ? options.min : itemdata('min'));
                itemdata('max', isNaN(itemdata('max')) ? options.max : itemdata('max'));
                itemdata('step', itemdata('step') || options.step);
                itemdata('readonly', itemdata('readonly') !== undefined ? itemdata('readonly') : options.readonly);
                itemdata('resetable', itemdata('resetable') !== undefined ? itemdata('resetable') : options.resetable);
                itemdata('backingfld', itemdata('backingfld') || options.backingfld);
                itemdata('starwidth', itemdata('starwidth') || options.starwidth);
                itemdata('starheight', itemdata('starheight') || options.starheight);
                itemdata('value', Math.max(itemdata('min'), Math.min(itemdata('max'), (!isNaN(itemdata('value')) ? itemdata('value') : (!isNaN(options.value) ? options.value : options.min)))));
                itemdata('ispreset', itemdata('ispreset') !== undefined ? itemdata('ispreset') : options.ispreset);
                //are we LTR or RTL?

                if (itemdata('backingfld')) {
                    //if we have a backing field, hide it, override defaults if range or select.
                    var fld = $(itemdata('backingfld')).hide();

                    if (fld.attr('disabled') || fld.attr('readonly')) {
                        itemdata('readonly', true); //http://rateit.codeplex.com/discussions/362055 , if a backing field is disabled or readonly at instantiation, make rateit readonly.
                    }

                    if (fld[0].nodeName == 'INPUT') {
                        if (fld[0].type == 'range' || fld[0].type == 'text') { //in browsers not support the range type, it defaults to text

                            itemdata('min', parseInt(fld.attr('min')) || itemdata('min')); //if we would have done fld[0].min it wouldn't have worked in browsers not supporting the range type.
                            itemdata('max', parseInt(fld.attr('max')) || itemdata('max'));
                            itemdata('step', parseInt(fld.attr('step')) || itemdata('step'));
                        }
                    }
                    if (fld[0].nodeName == 'SELECT' && fld[0].options.length > 1) {
                        // If backing field is a select box with valuesrc option set to "index", use the indexes of its options; otherwise, use the values.
                        if (fld[0].getAttribute('data-rateit-valuesrc') === 'index') {
                            itemdata('min', (!isNaN(itemdata('min')) ? itemdata('min') : Number(fld[0].options[0].index)));
                            itemdata('max', Number(fld[0].options[fld[0].length - 1].index));
                            itemdata('step', Number(fld[0].options[1].index) - Number(fld[0].options[0].index));
                        }
                        else {
                            itemdata('min', (!isNaN(itemdata('min')) ? itemdata('min') : Number(fld[0].options[0].value)));
                            itemdata('max', Number(fld[0].options[fld[0].length - 1].value));
                            itemdata('step', Number(fld[0].options[1].value) - Number(fld[0].options[0].value));
                        }
                        //see if we have a option that as explicity been selected
                        var selectedOption = fld.find('option[selected]');
                        if (selectedOption.length == 1) {
                            // If backing field is a select box with valuesrc option set to "index", use the index of selected option; otherwise, use the value.
                            if (fld[0].getAttribute('data-rateit-valuesrc') === 'index') {
                                itemdata('value', selectedOption[0].index);
                            }
                            else {
                                itemdata('value', selectedOption.val());
                            }
                        }
                    }
                    else {
                        //if it is not a select box, we can get's it's value using the val function.
                        //If it is a selectbox, we always get a value (the first one of the list), even if it was not explicity set.
                        itemdata('value', fld.val());
                    }


                }



                //Create the necessary tags. For ARIA purposes we need to give the items an ID. So we use an internal index to create unique ids
                var element = item[0].nodeName == 'DIV' ? 'div' : 'span';
                index++;

                // tabindex="0" gets only added in readonly mode. When keyboard tabbing, no focus is needed in readonly mode.
                var html = '<button id="rateit-reset-{{index}}" type="button" data-role="none" class="rateit-reset" aria-label="' + $.rateit.aria.resetLabel + '" aria-controls="rateit-range-{{index}}"><span></span></button><{{element}} id="rateit-range-{{index}}" class="rateit-range"' + (itemdata('readonly') == true ? '' : ' tabindex="0"') + ' role="slider" aria-label="' + $.rateit.aria.ratingLabel + '" aria-owns="rateit-reset-{{index}}" aria-valuemin="' + itemdata('min') + '" aria-valuemax="' + itemdata('max') + '" aria-valuenow="' + itemdata('value') + '"><{{element}} class="rateit-empty"></{{element}}><{{element}} class="rateit-selected"></{{element}}><{{element}} class="rateit-hover"></{{element}}></{{element}}>';
                item.append(html.replace(/{{index}}/gi, index).replace(/{{element}}/gi, element));

                //if we are in RTL mode, we have to change the float of the "reset button"
                if (!ltr) {
                    item.find('.rateit-reset').css('float', 'right');
                    item.find('.rateit-selected').addClass('rateit-selected-rtl');
                    item.find('.rateit-hover').addClass('rateit-hover-rtl');
                }

                if (itemdata('mode') == 'font') {
                    item.addClass('rateit-font').removeClass('rateit-bg');
                }
                else {
                    item.addClass('rateit-bg').removeClass('rateit-font');
                }

                itemdata('init', JSON.parse(JSON.stringify(item.data()))); //cheap way to create a clone
            }

            var isfont = itemdata('mode') == 'font';




            //resize the height of all elements,
            if (!isfont) {
                item.find('.rateit-selected, .rateit-hover').height(itemdata('starheight'));
            }


            var range = item.find('.rateit-range');
            if (isfont) {
                //fill the ranges with the icons
                var icon = itemdata('icon');
                var stars = itemdata('max') - itemdata('min');

                var txt = '';
                for(var i = 0; i< stars; i++){
                    txt += icon;
                }

                range.find('> *').text(txt);


                itemdata('starwidth', range.width() / (itemdata('max') - itemdata('min')))
            }
            else {
                //set the range element to fit all the stars.
                range.width(itemdata('starwidth') * (itemdata('max') - itemdata('min'))).height(itemdata('starheight'));
            }


            //add/remove the preset class
            var presetclass = 'rateit-preset' + ((ltr) ? '' : '-rtl');
            if (itemdata('ispreset')) {
                item.find('.rateit-selected').addClass(presetclass);
            }
            else {
                item.find('.rateit-selected').removeClass(presetclass);
            }

            //set the value if we have it.
            if (itemdata('value') != null) {
                var score = (itemdata('value') - itemdata('min')) * itemdata('starwidth');
                item.find('.rateit-selected').width(score);
            }

            //setup the reset button
            var resetbtn = item.find('.rateit-reset');
            if (resetbtn.data('wired') !== true) {
                resetbtn.on('click', function (e) {
                    e.preventDefault();

                    resetbtn.trigger('blur');

                    var event = $.Event('beforereset');
                    item.trigger(event);
                    if (event.isDefaultPrevented()) {
                        return false;
                    }

                    item.rateit('value', null);
                    item.trigger('reset');
                }).data('wired', true);

            }

            //this function calculates the score based on the current position of the mouse.
            var calcRawScore = function (element, event) {
                var pageX = (event.changedTouches) ? event.changedTouches[0].pageX : event.pageX;

                var offsetx = pageX - $(element).offset().left;
                if (!ltr) { offsetx = range.width() - offsetx };
                if (offsetx > range.width()) { offsetx = range.width(); }
                if (offsetx < 0) { offsetx = 0; }

                return score = Math.ceil(offsetx / itemdata('starwidth') * (1 / itemdata('step')));
            };

            //sets the hover element based on the score.
            var setHover = function (score) {
                var w = score * itemdata('starwidth') * itemdata('step');
                var h = range.find('.rateit-hover');
                if (h.data('width') != w) {
                    range.find('.rateit-selected').hide();
                    h.width(w).show().data('width', w);
                    var data = [(score * itemdata('step')) + itemdata('min')];
                    item.trigger('hover', data).trigger('over', data);
                }
            };

            var setSelection = function (value) {
                var event = $.Event('beforerated');
                item.trigger(event, [value]);
                if (event.isDefaultPrevented()) {
                    return false;
                }

                itemdata('value', value);
                if (itemdata('backingfld')) {
                    // If backing field is a select box with valuesrc option set to "index", update its selectedIndex property; otherwise, update its value.
                    if (fld[0].nodeName == 'SELECT' && fld[0].getAttribute('data-rateit-valuesrc') === 'index') {
                        $(itemdata('backingfld')).prop('selectedIndex', value).trigger('change');
                    }
                    else {
                        $(itemdata('backingfld')).val(value).trigger('change');
                    }
                }
                if (itemdata('ispreset')) { //if it was a preset value, unset that.
                    range.find('.rateit-selected').removeClass(presetclass);
                    itemdata('ispreset', false);
                }
                range.find('.rateit-hover').hide();
                range.find('.rateit-selected').width(value * itemdata('starwidth') - (itemdata('min') * itemdata('starwidth'))).show();
                item.trigger('hover', [null]).trigger('over', [null]).trigger('rated', [value]);
                return true;
            };

            if (!itemdata('readonly')) {
                //if we are not read only, add all the events

                //if we have a reset button, set the event handler.
                if (!itemdata('resetable')) {
                    resetbtn.hide();
                }

                //when the mouse goes over the range element, we set the "hover" stars.
                if (!itemdata('wired')) {
                    range.on('touchmove touchend', touchHandler); //bind touch events
                    range.on('mousemove', function (e) {
                        var score = calcRawScore(this, e);
                        setHover(score);
                    });
                    //when the mouse leaves the range, we have to hide the hover stars, and show the current value.
                    range.on('mouseleave', function (e) {
                        range.find('.rateit-hover').hide().width(0).data('width', '');
                        item.trigger('hover', [null]).trigger('over', [null]);
                        range.find('.rateit-selected').show();
                    });
                    //when we click on the range, we have to set the value, hide the hover.
                    range.on('mouseup', function (e) {
                        var score = calcRawScore(this, e);
                        var value = (score * itemdata('step')) + itemdata('min');
                        setSelection(value);
                        range.trigger('blur');
                    });

                    //support key nav
                    range.on('keyup', function (e) {
                        if (e.which == 38 || e.which == (ltr ? 39 : 37)) {
                            setSelection(Math.min(itemdata('value') + itemdata('step'), itemdata('max')));
                        }
                        if (e.which == 40 || e.which == (ltr ? 37 : 39)) {
                            setSelection(Math.max(itemdata('value') - itemdata('step'), itemdata('min')));
                        }
                    });

                    itemdata('wired', true);
                }
                if (itemdata('resetable')) {
                    resetbtn.show();
                }
            }
            else {
                resetbtn.hide();
            }

            range.attr('aria-readonly', itemdata('readonly'));
        });
    };

    //touch converter http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
    function touchHandler(event) {

        var touches = event.originalEvent.changedTouches,
                first = touches[0],
                type = "";
        switch (event.type) {
            case "touchmove": type = "mousemove"; break;
            case "touchend": type = "mouseup"; break;
            default: return;
        }

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false,
                              false, false, false, 0/*left*/, null);

        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    };

    //some default values.
    $.fn.rateit.defaults = { min: 0, max: 5, step: 0.5, mode: 'bg', icon: '★', starwidth: 16, starheight: 16, readonly: false, resetable: true, ispreset: false };

    //invoke it on all .rateit elements. This could be removed if not wanted.
    $(function () { $('div.rateit, span.rateit').rateit(); });

})(jQuery);


/***/ }),

/***/ 74:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/**
 * ---------------------------------------------------------------------
 *
 * GLPI - Gestionnaire Libre de Parc Informatique
 *
 * http://glpi-project.org
 *
 * @copyright 2015-2025 Teclib' and contributors.
 * @copyright 2003-2014 by the INDEPNET Development Team.
 * @licence   https://www.gnu.org/licenses/gpl-3.0.html
 *
 * ---------------------------------------------------------------------
 *
 * LICENSE
 *
 * This file is part of GLPI.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * ---------------------------------------------------------------------
 */

// RateIt jQuery plugin
__webpack_require__(73);
__webpack_require__(74);

})();

/******/ })()
;
//# sourceMappingURL=jquery.rateit.js.map