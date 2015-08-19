var jpp = {};

(function (exports) {
	function extendClass (derivedClass, baseClass, arg) {
		var k = null, proto = derivedClass.constructor.prototype, emptyObject = {};

		if (typeof arg == "undefined" || !arg) {
			arg = [];
		}
		
		for (k in proto) {
			emptyObject[k] = 1;
		}

		for (k in baseClass.prototype) {
			if (!emptyObject[k] && !isInArray(baseClass._jpp_privateList, k)) {
				proto[k] = baseClass.prototype[k];
			}
		}

		derivedClass.constructor._jpp_privateList = baseClass._jpp_privateList;
		derivedClass.constructor._jpp_protectedList = baseClass._jpp_protectedList;
		derivedClass.constructor._jpp_publicList = baseClass._jpp_publicList;
		
		baseClass._jpp_isOnExtendClass = true;
		baseClass.apply(derivedClass, arg);
		baseClass._jpp_isOnExtendClass = false;
	}

	function isInArray (array, what) {
		if (typeof array == "undefined" || !array) {
			return false;
		}

		for (var i = 0, l = array.length; i < l; i++) {
			if (array[i] == what) {
				return true;
			}
		}

		return false;
	}

	function forEach (array, func) {
		for (var i = 0, l = array.length; i < l; i++) {
			func(array[i]);
		}
	}

	function createClass (list) {
		function Class () {
			var s = this,
			k = null,
			ext = list["extends"],
			pri = list["private"],
			pro = list["protected"],
			pub = list["public"],
			sta = list["static"],
			propertiesAndMethodsList = [];

			if (ext) {
				if (ext.arguments == exports.ARGUMENTS) {
					ext.arguments = arguments;
				}

				extendClass(s, ext.baseClass, ext.arguments);
			}

			if (typeof Class._jpp_privateList == "undefined" || !Class._jpp_privateList) {
				Class._jpp_privateList = new Array();
			}
			if (typeof Class._jpp_protectedList == "undefined" || !Class._jpp_protectedList) {
				Class._jpp_protectedList = new Array();
			}
			if (typeof Class._jpp_publicList == "undefined" || !Class._jpp_publicList) {
				Class._jpp_publicList = new Array();
			}

			if (pri) {
				for (k in pri) {
					Class._jpp_privateList.push(k);
					propertiesAndMethodsList.push({name : k, content : pri[k], isPrivate : true});
				}
			}
			if (pro) {
				for (k in pro) {
					Class._jpp_protectedList.push(k);
					propertiesAndMethodsList.push({name : k, content : pro[k], isProtected : true});
				}
			}
			if (pub) {
				for (k in pub) {
					var n = k;

					if (k == "constructor") {
						n = "_jpp_constructor";
					}

					Class._jpp_publicList.push(n);

					propertiesAndMethodsList.push({name : n, content : pub[k]});
				}
			}
			if (sta) {
				for (k in sta) {
					Class[k] = sta[k];
				}
			}

			if (typeof s._jpp_propertyAndMethodStorage == "undefined" || !s._jpp_propertyAndMethodStorage) {
				s._jpp_propertyAndMethodStorage = {};
			}

			forEach(propertiesAndMethodsList, function (o) {
				var name, content;

				if (o.isPrivate && Class._jpp_isOnExtendClass) {
					return;
				}

				name = o.name, content = o.content;

				if (typeof content != "function") {
					s[name] = content;
				} else {
					var func = function () {
						s._jpp_isCalledInClass = true;

						var result = content.apply(s, arguments);

						s._jpp_isCalledInClass = false;

						return result;
					}

					s.constructor.prototype[name] = func;
				}

				s._jpp_propertyAndMethodStorage[name] = content;

				if (o.isPrivate || o.isProtected) {
					var flag = o.isProtected ? "protected" : "private";

					Object.defineProperty(s, o.name, {
						get : function () {
							if (typeof s._jpp_isCalledInClass == "undefined" || !s._jpp_isCalledInClass) {
								throw new RangeError(name + " is " + flag + ", you cannot get it out of the class.");
							}

							return s._jpp_propertyAndMethodStorage[name];
						},

						set : function (v) {
							if (typeof s._jpp_isCalledInClass == "undefined" || !s._jpp_isCalledInClass) {
								throw new RangeError(name + " is " + flag + ", you cannot set it out of the class.");
							}

							o.name = v;
							s._jpp_propertyAndMethodStorage[name] = v;
						}
					});
				}
			});

			s._jpp_constructor.apply(s, arguments);
		}

		return Class;
	};

	exports.class = createClass;
})(jpp);


(function (exports) {
	exports.ARGUMENTS = "_jpp_arguments";
})(jpp);
