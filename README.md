# promise-list



## Description
Manage list of Promise

## Installation
### bower
`bower install https://github.com/FCOO/promise-list.git --save`

## Demo
http://FCOO.github.io/promise-list/demo/ 

## Usage
	var myPromiseList = new PromiseList( OPTIONS );
	OPTIONS = {
		reject: function(error) (optional) - reject/error-function
		finally: function() (optional) - finally-function
		prePromiseAll: function(list: []PROMISE_OPTIONS, promiseList:PROMISELIST) (optional) - Called before getAll calls Promise.all. 
	}
	myPromiseList.getAll( /* reject-function */ )
	//or
	myPromiseList.promiseAll( /* reject-function */ )
	

### Methods
To add a `Promise` use
 
    .append( PROMISE_OPTIONS OR []PROMISE_OPTIONS )
    .appendFirst( PROMISE_OPTIONS OR []PROMISE_OPTIONS )
    .appendLast( PROMISE_OPTIONS OR []PROMISE_OPTIONS )
    .prepend( PROMISE_OPTIONS OR []PROMISE_OPTIONS )
    .prependFirst( PROMISE_OPTIONS OR []PROMISE_OPTIONS )
    ..prependLast( PROMISE_OPTIONS OR []PROMISE_OPTIONS )

	PROMISE_OPTIONS = {
		format        : STRING //"JSON", XML" or "TEXT" Defalut = "JSON"
		fileName      : STRING or OBJECT	//File name. Using window.Intervals.getFileName to convert file-name OR
		fileName	  : []STRING|OBJECT 	//Same as single fileName
		data          : OBJECT,
		resolve       : FUNCTION(data, options) //Function to handle the loaded data, OR
		resolve       : FUNCTION([]data, options) //Function to handle the loaded data (multi)
		promiseOptions: OBJECT //Individual options for Promise.getTYPE
		wait		  : BOOLEAN. If true the rest of the added promises will be loaded after resolve is called. 
						Makes if possible for resolve to add new files or data to the list 
		reload        : NUMBER OR BOOLEAN //If given the file will be reloaded every reload minutes (reload = true => 60 minutes)
	}

Each `PROMISE_OPTIONS` must contain `fileName` or `data`

## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/promise-list/LICENSE).

Copyright (c) 2020 [FCOO](https://github.com/FCOO)

## Contact information

Niels Holt nho@fcoo.dk