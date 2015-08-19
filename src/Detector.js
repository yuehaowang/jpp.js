(function (exports){
	function Detector () {
		throw new ReferenceError("jpp.Detector cannot be instantiated.");
	}

	Detector.is = function (o, type) {
		if (typeof type == "function") {
			return Detector.instanceOf(o, type);
		} else if (typeof type == "string") {
			return typeof o == type;
		} else if (type === null) {
			return o === type;
		}

		return false;
	};

	Detector.isAvailable = function (o) {
		return (typeof o != "undefined" && o !== null);
	};

	Detector.instanceOf = function (o, type) {
		function loop (dataList) {
			if (Detector.is(dataList, Array)) {
				for (var k = 0, l = dataList.length; k < l; k++) {
					if (l <= 0) {
						return false;
					}

					var item = dataList[k];

					if (o instanceof item.classConstructor) {
						return true;
					} else {
						loop(item.derivedClassList);
					}
				}
			}

			return false;
		}

		var list = type._jpp_derivedClassDataList;

		if (list) {
			if (o instanceof list.classConstructor) {
				return true;
			} else {
				return loop(list.derivedClassList);
			}
		}

		return o instanceof type;
	};

	exports.Detector = Detector;
})(jpp);