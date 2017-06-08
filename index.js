module.exports = {
	sync: function (list, callback) {
		(function loop(list, callback, i, result) {
			list[i](function (err, data) {
				return list[++i] && !err ? loop(list, callback, i, data) : callback(err, data)
			}, result)
		})(list, callback, 0)
	},
	parallel: function (list, callback) {
		var listCount = list.length, lock = 1
		for (var i = list.length - 1; i >= 0; i -= 1) {
			(function (key) {
				list[key](function (err, data) {
					list[key] = data
					return (--listCount !== 0 && lock === 1 && !err) === true || --lock || callback(err, list)
				})
			})(i)
		}
	}
}
