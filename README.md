# JavaScript validator [pure JS]

# Example
```js
var form = document.getElementById('form');
form.validate({
	rules: {
		'email': {
			empty: true,
			email: true
		},
		'password': {
			empty: true,
			minLength: 4,
			maxLength: 18
		}
	},
	success: function(){
		console.log('Success!');
	},
	error: function(){
		console.log('Error!');
	}
});
```

# Getting started

## The basics

The `validation()` method is the primary API. The method executes **instantly**. You  can use `validation()` on all object of the Element class.

```js
var form = document.getElementById('form');

form.validate();
```

The method without arguments checks all inputs in the form, whether they are empty. If they are and debugMode [default disabled] is on, logs message to the console.

## Configuration

### Configuration object
The configuration object is a first argument of the method.
```js
var form = document.getElementById('form');
form.validate({
    // config
});
```

### The validation rules

The basic validation rule is check all inputs in form, whether they are empty. If you want to add custom rules, you can use `rules: {}` The key of the object is `id/name` attribute of the input. The value is an object with [methods](#methods).

```js
var form = document.getElementById('form');
form.validate({
    rules: {
        'email': {
            empty: true,
            // We can also use only email, because email must not be an empty value
            email: true
        }
    }
});
```

### Success method

The method, which executes after a successful validation is `success`. You can change this method by passing `success: function(){}` to the configuration object. You can pass `this.form`, whenever you want to get form.

```js
var form = document.getElementById('form');
form.validate({
    success: function(){
        this.form.getElementById('message').innerHTML = 'The validation completed successfully';
    }
});
```

### Error method

The method, which executes after a failed validation is `error`. You can change this method by passing `error: function(){}` to the configuration object. You can get errors object by passing `this.errors`

Example errors object:
```js
this.errors = {
    'email': {
        empty: false
    },
    'password': {
        minLength: false
    }
}
```

Example code:
```js
var form = document.getElementById('form');
form.validate({
    error: function(){
        for(var error in this.errors){
            this.form.getElementById('message').innerHTML = error + ': Validation failed<br>';
        }
    }
});
```

### Debug mode

To turn on debug mode, pass `debugMode: true` in configuration object.
```js
var form = document.getElementById('form');
form.validate({
    debugMode: true
});
```

## Methods

- `empty: <bool>` Checks if input value is empty
- `email: <bool>` Checks if input value is an email
- `minLength: <int>` Checks if text length of input value is at least <int>
- `maxLength: <int>` Checks if text length of input value is a maximum of <int>

# License

JavaScript/jQuery validator is available under the [MIT license](https://github.com/klusaktomasz/JavaScript-validator/blob/master/LICENSE)
