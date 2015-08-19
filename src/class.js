(function (exports) {
	var detector = exports.Detector;

	function extendClass (derivedClass, baseClass) {
		var k = null,
		dc = derivedClass.constructor,
		proto = dc.prototype,
		emptyObject = {};
		
		for (k in proto) {
			emptyObject[k] = 1;
		}

		if (!detector.isAvailable(baseClass._jpp_derivedClassDataList)) {
			baseClass._jpp_derivedClassDataList = {
				classConstructor : baseClass,
				derivedClassList : new Array()
			};
		}

		if (!detector.isAvailable(dc._jpp_derivedClassDataList)) {
			dc._jpp_derivedClassDataList = {
				classConstructor : dc,
				derivedClassList : new Array()
			};
		}

		baseClass._jpp_derivedClassDataList.derivedClassList.push(dc._jpp_derivedClassDataList);

		for (k in baseClass.prototype) {
			if (!emptyObject[k] && !isInArray(baseClass._jpp_privateList, k)) {
				proto[k] = baseClass.prototype[k];
			}
		}

		dc._jpp_privateList = baseClass._jpp_privateList;
		dc._jpp_protectedList = baseClass._jpp_protectedList;
		dc._jpp_publicList = baseClass._jpp_publicList;
		
		baseClass._jpp_isOnExtendClass = true;
		baseClass._jpp_currentDerivedClass = derivedClass;
		baseClass.apply(derivedClass, []);
		baseClass._jpp_currentDerivedClass = null;
		baseClass._jpp_isOnExtendClass = false;
	}

	function isInArray (array, what) {
		if (!detector.isAvailable(array)) {
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
				extendClass(s, ext);
			}

			if (!detector.isAvailable(Class._jpp_privateList)) {
				Class._jpp_privateList = new Array();
			}
			if (!detector.isAvailable(Class._jpp_protectedList)) {
				Class._jpp_protectedList = new Array();
			}
			if (!detector.isAvailable(Class._jpp_publicList)) {
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

			if (!detector.isAvailable(s._jpp_propertyAndMethodStorage)) {
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
							if (!detector.isAvailable(s._jpp_isCalledInClass)) {
								throw new RangeError(name + " is " + flag + ", you cannot get it out of the class.");
							}

							return s._jpp_propertyAndMethodStorage[name];
						},

						set : function (v) {
							if (!detector.isAvailable(s._jpp_isCalledInClass)) {
								throw new RangeError(name + " is " + flag + ", you cannot set it out of the class.");
							}

							o.name = v;
							s._jpp_propertyAndMethodStorage[name] = v;
						}
					});
				}
			});

			if (detector.is(s._jpp_constructor, "function")) {
				if (!Class._jpp_isOnExtendClass) {
					s._jpp_constructor.apply(s, arguments);
				} else {
					Class._jpp_currentDerivedClass.super = s._jpp_constructor;
				}
			}
		}

		return Class;
	};

	exports.class = createClass;
})(jpp);