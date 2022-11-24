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

        _createAllList: function(){
            var _this = this;
            this.allList = [];
            $.each([this.firstList, this.list, this.lastList], function(index, list){
                $.each(list, function(index, item){
                    _this.allList.push(item);
                });
            });
        },

        //promiseAll = same as getAll
        promiseAll: function(){
            return this.getAll.apply(this, arguments);
        },

        //getAll( reject ) - get all added promises
        getAll: function( reject ){
            var _this = this;

            //Create this.allList as this.firstList, this.list, this.lastlist
            this._createAllList();

            if (this.options.prePromiseAll){
//                this.allList = this.options.prePromiseAll(this.allList, this) || this.allList;
                var prePromiseAllList = $.isArray(this.options.prePromiseAll) ? this.options.prePromiseAll : [this.options.prePromiseAll];
                prePromiseAllList.forEach( function( prePromise ){
                    _this.allList = prePromise(_this.allList, _this) || _this.allList;
                });
            }

            //Create list of all remaining promises and options
            this.promiseList = [];
            this.optionsList = [];

            $.each(this.allList, function(index, options){
                //Skip allready resolved promise
                if (options.isResolved)
                    return true;

                var promise;
                if (options.fileName){
                    var get;
                    options.format = options.format ? options.format.toUpperCase() : 'JSON';
                    switch (options.format){
                        case 'JSON' : get = window.Promise.getJSON; break;
                        case 'XML'  : get = window.Promise.getXML; break;
                        default     : get = window.Promise.getText; break;
                    }

                    if ($.isArray(options.fileName))
                        promise = Promise.all(
                            options.fileName.map( function(fName){
                                return get( window.intervals.getFileName(fName), options.promiseOptions);
                            })
                        );
                    else
                        //File-name is given => use intervals.getFileName to convert filename and load it
                        promise = get( window.intervals.getFileName(options.fileName), options.promiseOptions );
                }
                else
                    if (options.data)
                        //Data is given => resolve them
                        promise = new Promise(function(resolve/*, reject*/) {
                            resolve(options.data);
                        });
                    else
                        return;

                _this.promiseList.push(promise);
                _this.optionsList.push(options);

                //Set as resolved to prevent loop if reject
                options.isResolved = true;

                //If the promise must wait before loading the rest => exit
                if (options.wait)
                    return false;
            });

            Promise.all( this.promiseList )
                .then   ( $.proxy(this._then, this) )
                .catch  ( reject || this.options.reject || function(){} )
                .finally( $.proxy(this._finally, this) );
        },

        _then: function( dataList ){
            var _this = this;
            $.each(dataList, function(index, data){
                var opt = _this.optionsList[index];

                //Call the resolve-function
                opt.resolve(data, opt, _this);

                opt.isResolved = true;

                //If the file/data needs to reload with some interval => adds the resolve to windows.intervals.addInterval after the first load
                if (opt.reload)
                    window.intervals.addInterval({
                        duration        : opt.reload === true ? 60 : opt.reload,
                        fileName        : opt.fileName,
                        data            : opt.data,
                        resolve         : opt.resolve,
                        resolveArguments: [opt, _this],
                        reject          : null,
                        wait            : true
                    });
            });
            return true;
        },

        _finally: function(){
            //Check if there are still promise(s) not resolved
            var notResolvedFound = false;
            this._createAllList();
            $.each(this.allList, function(index, options){
                notResolvedFound = notResolvedFound || !options.isResolved;
            });

            //Check if there are more promises in the list
            if (notResolvedFound)
                this.getAll();
            else {
                this._callFuncList('finally');
                this._callFuncList('finish');
            }
        },

        _callFuncList: function( optionsName ){
            var _this = this,
                funcList = this.options[optionsName];
            if (funcList){
                funcList = $.isArray(funcList) ? funcList : [funcList];
                funcList.forEach( function( func ){
                    func(_this);
                });
            }
        }
    };

}(jQuery, this, document));