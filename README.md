# jpp.js
--------

## What's jpp.js
Jpp.js is a library to extend some useful functions such as create a powerful `class` (with `private` & `protected` & `public` & `static` properties and methods) for JavaScript. The meaning of jpp is JavaScript plus plus. 

## How to use jpp.js
First, you need to get jpp.js.

**With Git:**

```
$ git clone git@github.com:yuehaowang/jpp.js.git
```

**Without Git:**

The url to download the library is: [https://github.com/.../master.zip](https://github.com/yuehaowang/jpp.js/archive/master.zip)

Second, copy jpp-a.b.c.js to your project directory and import the js file, then you can use jpp. It's so easy, isn't it?

## A live example
The example below is to show how to create a powerful `class` which is enabled to define `private`, `protected` and `public` properties and methods:
```javascript
var People = jpp.class({
	extends : null,
	private : {
		id : null,
		hobby : null
	},
	protected : {
		money : null,
		phoneNumber : null
	},
	public : {
		firstName : null,
		lastName : null,
		age : null,
		birthday : null,
		occupation : null,
		
		constructor : function (name, id) {
			if (name) {
				var nameArray = name.split(" ");

				this.firstName = nameArray[0];
				this.lastName = nameArray[1];
			}

			if (id) {
				this.id = id;
			}
		},

		setBirthday : function (date) {
			if (date) {
				this.birthday = date;
			}
		},

		getBirthday : function () {
			return this.birthday;
		},

		askForId : function () {
			return this.id;
		},

		findHobby : function () {
			return this.hobby;
		}
	},
	static : {
		OCCUPATION_PROGRAMMER : "programmer",
		OCCUPATION_ARTIST : "artist",
		OCCUPATION_MUSICIAN : "musician",
		OCCUPATION_STUDENT : "student"
	}
});

var peter = new People("Peter Wong", 543232123565);
peter.occupation = People.OCCUPATION_PROGRAMMER;

peter.setBirthday("19980727");

// result: Peter
alert(peter.firstName);
// result: 19990727
alert(peter.getBirthday());
// result: 51092028
alert(peter.askForId());
// result: null
alert(peter.findHobby());
// result: programmer
alert(peter.occupation);
// error
alert(peter.id);
```

## Browser compatibility
As `Object.defineProperty` is used in jpp.js, so there are some problems about compatibility. Here is the table to tell you the compatibility situation:

***Desktop***

| Firefox | Google Chrome | Internet Explorer | Opera | Safari |
| ------- | ------------- | ----------------- | ----- | ------ |
| 4.0     | 5             | 9                 | 11.6  | 5.1    |

***Mobile***

| Firefox Mobile | Android | IE Mobile | Opera Mobile | Safari Mobile |
| -------------- | ------- | --------- | ------------ | ------------- |
| 4.0            | Yes     | 9         | 11.5         | Yes           |

***From:*** [https://developer.mozilla.org/.../defineProperty#Browser_compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Browser_compatibility)

## Documentation
The documentation will be released when the formal version is released. Stay tuned!~

## Support
If you find the library has some bugs or you have any questions or advice, please let me know:

> **My email:** wangyuehao1999@gmail.com
> 
> **My twitter:** [twitter.com/yuehaowang](twitter.com/yuehaowang)

## Changelog

### version 0.3.1
1. Bugfix: `private` & `protected` properties and methods cannot be used in inner methods of the class.
2. Bugfix: when a overloaded function A is called, if A accepts less arguments than a former overloaded function B whose first few arguments' type are similar to A's , the former function B will be called instead of A.

### version 0.3.0
1. Bugfix: `private` & `protected` are invalid because of the wrong condition in `if () {...}`.
2. Added: `jpp.overload` function to create a function which is enabled to execute different codes in a function because of different arguments.

### version 0.2.0
1. Added `jpp.Detector` function to determine if a object is available or if a object is a instance of the class or a object's type is one of basic type (`string`, `object`, `function`, `number`, `boolean`, etc).
2. Added `super` method for classes which are created by `jpp.class`. Using this method will call base class' constructor.
3. Improvement: `extends` property is used to be a `Object` containing `baseClass` property and `arguments` property but now this property is given the base class.

### version 0.1.1
1. Added `static` property for `jpp.class` to add static properties or methods to classes.
3. Improvement: throw `RangeError` when you get/set `private` or `protected` properties and methods out of the class instead of no-type error.

### version 0.1.0
1. Added `jpp.class` function to create powerful classes with `private` & `protected` properties and methods. And you can use `extends` property for inheritance.
