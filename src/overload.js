(function (exports) {
	var detector = exports.Detector;

	function overload (argTypeList, func) {
		function overloadFunc () {
			var list = overloadFunc._jpp_argTypeAndFuncList, l = arguments.length;

			for (var j = 0, s = list.length; j < s; j++) {
				var item = list[j], match = 0;

				if (l != item.argTypeList.length) {
					continue;
				}

				for (var i = 0; i < l; i++) {
					var o = arguments[i];

					if (detector.is(o, item.argTypeList[i])) {
						match++;
					}
				}

				if (match == l) {
					return item.func.apply(this, arguments);
				}
			}

			throw new TypeError("do not match any functions by arguments to be called.");
		}

		overloadFunc._jpp_argTypeAndFuncList = [];

		overloadFunc.overload = function (argTypeList, func) {
			overloadFunc._jpp_argTypeAndFuncList.push({
				argTypeList : argTypeList,
				func : func
			});

			return overloadFunc;
		};

		overloadFunc.overload(argTypeList, func);

		return overloadFunc;
	}

	exports.overload = overload;
})(jpp);