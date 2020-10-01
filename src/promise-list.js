/****************************************************************************
    promise-list.js,

    (c) 2020, FCOO

    https://github.com/FCOO/promise-list
    https://github.com/FCOO

****************************************************************************/

(function ($, window/*, document, undefined*/) {
    "use strict";


    function PromiseList( options) {
        this.options = $.extend({
            //Default options
        }, options || {} );

        this.firstList = [];
        this.list = [];
        this.lastList = [];

    }
    window.PromiseList = PromiseList;

    //asArray(options) - convert options into []OPTIONS
    function asArray(options){
        return options ? ($.isArray(options) ? options : [options]) : [];
    }


    //Extend the prototype
    window.PromiseList.prototype = {

        //append( options )
        append: function( options, listId ){
            listId = listId || 'list';
            this[listId] = this[listId].concat( asArray(options) );
            return this;
        },
        appendFirst: function( options ){
            return this.append( options, 'firstList');
        },
        appendLast: function( options ){
            return this.append( options, 'lastList');
        },

        //prepend( options )
        prepend: function( options, listId ){
            listId = listId || 'list';
            this[listId] = asArray(options).concat( this[listId] );
            return this;
        },
        prependFirst: function( options ){
            return this.prepend( options, 'firstList');
        },
        prependLast: function( options ){
            return this.prepend( options, 'lastList');
        },


        //getAll( reject ) - get all added promises
        getAll: function( reject ){
            //Create this.allList as this.firstList, this.list, this.lastlist
            this.allList = this.firstList.concat(this.list.concat(this.lastList));

            //Create list of all the promises
            var promiseList = [];
            $.each(this.allList, function(index, options){
                var promise;
                if (options.fileName){
                    //File-name is given => use intervals.getFileName to convert filename and load it
                    var format = options.format || 'JSON',
                        fileName = window.intervals.getFileName(options.fileName);
                    switch (format.toUpperCase() ){
                        case 'JSON' : promise = window.Promise.getJSON(fileName, options.promiseOptions ); break;
                        case 'XML'  : promise = window.Promise.getXML (fileName, options.promiseOptions ); break;
                        default     : promise = window.Promise.getText(fileName, options.promiseOptions ); break;
                    }
                }
                else
                    if (options.data)
                        //Data is given => resolve them
                        promise = new Promise(function(resolve/*, reject*/) {
                            resolve(options.data);
                        });
                    else
                        return;

                promiseList.push(promise);
            });

            Promise.all( promiseList )
                .then   ( $.proxy(this._then, this) )
                .catch  ( reject || this.options.reject )
                .finally( this.options.finally );
        },

        _then: function( dataList ){
            var _this = this;
            $.each(dataList, function(index, data){
                var opt = _this.allList[index];

                //Call the resolve-function
                opt.resolve(data, opt);

                //If the file/data needs to reload with some interval => adds the resolve to windows.intervals.addInterval after the first load
                if (opt.reload)
                    window.intervals.addInterval({
                        duration: opt.reload === true ? 60 : opt.reload,
                        fileName: opt.fileName,
                        data    : opt.data,
                        resolve : opt.resolve,
                        reject  : null,
                        wait    : true
                    });
            });
            return true;
        }
    };

}(jQuery, this, document));