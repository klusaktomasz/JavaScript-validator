/*
 * ====================================================================================================
 * JavaScript validator
 * ====================================================================================================
 * Copyright (c) 2016 Klusak Tomasz
 * Licensed under MIT (https://github.com/klusaktomasz/JavaScript-validator/blob/master/LICENSE)
 * ====================================================================================================
*/

var validators = {};

Element.prototype.validate = function( options ) {

	// Checks if validator exists
	var validator = validators[this];
	if( validator )
	{
		validator.checkForm();
		return validator;
	}

	// Creates new Validator
	validator = new Validator(this, options);
	validators[this] = validator;

	return validator;
};

var Validator = function( form, options ){
	this.form = form;

	// Copies default settings and includes properties from argument of function
	this.settings = Validator.defaultOptions;

	if( typeof options === 'object' ){

		for(var key in options){
			if( options.hasOwnProperty(key) ) this.settings[key] = options[key];
		}

	}else if( typeof options !== 'undefined' ) console.log('The argument of the validate function must be an object!');

	this.init();
}

// Default options for validator
Validator.defaultOptions = {
	debugMode: false,
	rules: {},
	elements: {},
	errors: {},
	success: function(){
		if(this.debugMode) console.log('The validation: success');
	},
	error: function(){
		if(this.debugMode) console.log('The validation: error');
	}
};

Validator.prototype.init = function(){
	// Creates object 'rules', if it does not exists
	if( Object.keys(this.settings.rules) == false) this.getRules();

	this.getElements();

	this.checkForm();
};

// Gets each input in form and puts them into object
Validator.prototype.getRules = function(){
	// Gets inputs in a form
	var inputs = this.form.getElementsByTagName('input');
	for(var i=0;i<inputs.length;i++){
		
		// Checks if input is a submit
		if( inputs[i].getAttribute('type') == 'submit') return;

		// If element has got id, adds element to rules by id
		if( inputs[i].hasAttribute('id') ) this.settings.rules[ inputs[i].getAttribute('id') ] = {empty: true};

		// If element has got name, adds element to rules by name
		else if( inputs[i].hasAttribute('name') ) this.settings.rules[ inputs[i].getAttribute('name') ] = {empty: true};

	}
};

// Gets all elements from 'rules' and sorts them by id/name
Validator.prototype.getElements = function(){
	// Gets all rules
	for(var key in this.settings.rules)
	{
		// Checks if input with id/name exists in form
		if( this.form.querySelector('input[id='+ key +']') != null ){

			// Checks if object 'id' exists
			if(typeof this.settings.elements['id'] !== 'object') this.settings.elements['id'] = {};

			this.settings.elements['id'][key] = this.settings.rules[key];

		}
		else if( this.form.querySelector('input[name='+ key +']' ) != null ){

			// Checks if object 'name' exists
			if(typeof this.settings.elements['name'] !== 'object') this.settings.elements['name'] = {};

			this.settings.elements['name'][key] = this.settings.rules[key];

		}
		else{
			if(this.settings.debugMode) console.log(key + ' does not exists in form');
		}

	}
};

// Validates form and takes action
Validator.prototype.checkForm = function(){
	// Clears error list
	this.settings.errors = {};

	for(var type in this.settings.elements)
	{
		for(var element in this.settings.elements[type])
		{
			for(var method in this.settings.elements[type][element])
			{

				if(this.settings.elements[type][element][method] === false) break;

				// Gets the result of the validaton
				var value = this.form.querySelector('input['+ type +'='+ element +']').value;

				var result = Validator.methods[method](value, this.settings.elements[type][element][method]);

				// If result is false, puts error into an error list
				if(result === false){
					if(typeof this.settings.errors[element] !== 'object') this.settings.errors[element] = {};

					this.settings.errors[element][method] = false;
				}

			}
		}
	}

	// Checks status of the validation and takes action
	if( Object.keys(this.settings.errors) == false ) this.settings.success();
	else this.settings.error();
};

// Methods of validation
Validator.methods = {
	empty: function( value ){
		return value.length > 0;
	},
	email: function( value ){
		return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
	},
	minLength: function( value, param ){
		return value.length >= param;
	},
	maxLength: function( value, param ){
		return value.length <= param;
	}
};
