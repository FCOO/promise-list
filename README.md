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
		fileName      : STRING or OBJECT	//File name. Using window.Intervals.getFileName to convert file-name
		data          : OBJECT,
		resolve       : FUNCTION(data, options) //Function to handle the loaded data
		promiseOptions: OBJECT //Individual options for Promise.getTYPE
		reload        : NUMBER OR BOOLEAN //If given the file will be reloaded every reload minutes (reload = true => 60 minutes)
	}

Each `PROMISE_OPTIONS` must contain `fileName` or `data`

## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/promise-list/LICENSE).

Copyright (c) 2020 [FCOO](https://github.com/FCOO)

## Contact information

Niels Holt nho@fcoo.dk