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

    //Extend the prototype
    window.PromiseList.prototype = {

        //_getList(options) - Convert options = {} or []{} into []{promise, resolve}
        _getList: function(options){
            if (!options) return [];

            options = $.isArray(options) ? options : [options];
            var result = [];
            $.each(options, function(index, opt){
                var promise;
                if (opt.fileName){
                    //File-name is given => use intervals.getFileName to convert filename and load it
                    var format = opt.format || 'JSON',
                        fileName = window.intervals.getFileName(opt.fileName);
                    switch (format.toUpperCase() ){
                        case 'JSON' : promise = window.Promise.getJSON(fileName, opt.promiseOptions ); break;
                        case 'XML'  : promise = window.Promise.getXML (fileName, opt.promiseOptions ); break;
                        default     : promise = window.Promise.getText(fileName, opt.promiseOptions ); break;
                    }
                }
                else
                    if (opt.data)
                        //Data is given => resolve them
                        promise = new Promise(function(resolve/*, reject*/) {
                            resolve(opt.data);
                        });
                    else
                        return;

                result.push({
                    promise: promise,
                    options: opt
                });
            });
            return result;
        },


        //append( options )
        append: function( options, listId ){
            listId = listId || 'list';
            this[listId] = this[listId].concat( this._getList(options) );
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
            this[listId] = this._getList(options).concat( this[listId] );
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

            var promiseList = [];
            $.each(this.allList, function(index, options){ promiseList.push(options.promise); });

            Promise.all( promiseList )
                .then   ( $.proxy(this._then, this) )
                .catch  ( reject || this.options.reject )
                .finally( this.options.finally );
        },

        _then: function( dataList ){
            var _this = this;
            $.each(dataList, function(index, data){
                var opt = _this.allList[index].options;

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