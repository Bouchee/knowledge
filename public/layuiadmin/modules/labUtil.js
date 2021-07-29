/**

 @Name：实验室自己定义的工具集
 @Author：fangzhiyang

 */

layui.define('jquery', function (exports) {
	"use strict";

	var $ = layui.$

		//外部接口
		, labUtil = {
			trim: function (s) {
				if (s == null) return null;
				return s.replace(/^[ \t\n\xA0]+/, "").replace(/[ \t\n\xA0]+$/, "");
			}

			, getParams: function (key) {
				var args = {}; //声明一个空对象 
				var query = window.location.search.substring(1); // 取查询字符串，如从 http://www.snowpeak.org/testjs.htm?a1=v1&a2=&a3=v3#anchor 中截出 a1=v1&a2=&a3=v3。 
				var pairs = query.split("&"); // 以 & 符分开成数组 
				for (var i = 0; i < pairs.length; i++) {
					var pos = pairs[i].indexOf('='); // 查找 "name=value" 对 
					if (pos == -1) continue; // 若不成对，则跳出循环继续下一对 
					var argname = pairs[i].substring(0, pos); // 取参数名
					var value = pairs[i].substring(pos + 1); // 取参数值
					value = decodeURI(value); // 若需要，则解码，对应encodeURI的编码，中文通过URL传递时应先通过encodeURI("中文")编码
					args[argname] = value; // 存成对象的一个属性 
				}

				if (key) {
                    return args[key] || null; // 返回此对象
				} else {
					return args;
				}
			}

			/**
			 * 加载下拉框
			 * @param select 下拉框控件
			 * @param items 数据
			 * @param firstOptionText 下拉框控件的第一个option的text
			 */
			, loadSelectOption: function (select, items, firstOptionText) {
				dwr.util.removeAllOptions(select);
				if (null != firstOptionText && "" !== firstOptionText)
					dwr.util.addOptions(select, [{id: -1, name: firstOptionText}], "id", "name");
				dwr.util.addOptions(select, items, "id", "name");
			}

			/**
			 * 通过operation加载下拉框
			 * @param select 下拉框控件
			 * @param operation 操作名称
			 * @param firstOptionText 下拉框控件的第一个option的text
			 * @param loadFinishFunction 加载完成后需要执行的函数
			 */
			, loadSelect: function (select, operation, firstOptionText, loadFinishFunction) {
				var callback = function (result) {
					var items = result.data;
					labUtil.loadSelectOption(select, items, firstOptionText);

					if (typeof(loadFinishFunction) === "function") loadFinishFunction();
				};

				operation.execute(callback);
			}

			/**
			 * 向指定的下拉框控件中加载指定类型名称的数据字典
			 * @param select 下拉框控件
			 * @param typeName 数据字典类型
			 * @param firstOptionText 下拉框控件的第一个option的text
			 * @param loadFinishFunction 加载完成后需要执行的函数
			 */
			, loadDictionaryByTypeName: function (select, typeName, firstOptionText, loadFinishFunction) {
				var operation = new Operation("系统.数据字典.按类别名称列数据字典");
				operation.typeName = typeName;

				labUtil.loadSelect(select, operation, firstOptionText, loadFinishFunction);
			}

			, loadDictionaryByTypeNamePublic: function (select, typeName, firstOptionText, loadFinishFunction) {
				var operation = new Operation("公用.按类别名称列数据字典");
				operation.typeName = typeName;

				labUtil.loadSelect(select, operation, firstOptionText, loadFinishFunction);
			}
		};

	// 前台日期str到后端Date的转换函数
	labUtil.parse = {
		date: function (s) {
			if (null == s || '' == s) {
				return "";
				// return new Date(2000, 0, 1, 0, 0, 0, 0).getTime();
			}

			var pattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

			var d = s.match(pattern);
			if (d == null) return null;

			var date = new Date(parseInt(d[1], 10), parseInt(d[2], 10) - 1, parseInt(d[3], 10), 0, 0, 0, 0);
			return date.getTime();
		}
		, month: function (s) {
			var pattern = /^(\d{4})-(\d{1,2})$/;

			var d = s.match(pattern);
			if (d == null) return null;

			var date = new Date(parseInt(d[1], 10), parseInt(d[2], 10) - 1, 1, 0, 0, 0, 0);

			return date.getTime();
		}
		, timestamp: function (s) {
			var pattern = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/;

			var d = s.match(pattern);
			if (d == null) return null;

			var date = new Date(parseInt(d[1], 10), parseInt(d[2], 10) - 1, parseInt(d[3], 10), parseInt(d[4], 10), parseInt(d[5], 10), 0, 0);

			return date.getTime();
		}
		, time: function (s) {
			var pattern = /^(\d{1,2}):(\d{1,2})$/;

			var d = s.match(pattern);
			if (d == null) return null;

			var date = new Date(2000, 0, 1, parseInt(d[1], 10), parseInt(d[2], 10), 0, 0);

			return date.getTime();
		}
	};

	// 后端Date到前台日期str的转换函数
	labUtil.format = {
		/**根据Date类型显示时间，仅显示年月日*/
		date: function (date) {
			if (null == date || 1970 == date.getFullYear()) return "";

			if (typeof(date) == "number") date = new Date(date);

			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();

			var s = "";
			s += year;

			s += "-";
			if (month < 10) s += "0";
			s += month;

			s += "-";
			if (day < 10) s += "0";
			s += day;

			return s;
		}

		/**根据Date类型显示时间，仅显示年月*/
		, month: function (date) {
			if (date == null) return "N/A";

			if (typeof(date) == "number") date = new Date(date);

			var year = date.getFullYear();
			var month = date.getMonth() + 1;

			var s = "";
			s += year;

			s += "-";
			if (month < 10) s += "0";
			s += month;

			return s;
		}


		, timestamp: function (date) {
			if (date == null) return "N/A";

			if (typeof(date) == "number") date = new Date(date);

			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();

			var s = "";
			s += year;

			s += "-";
			if (month < 10) s += "0";
			s += month;

			s += "-";
			if (day < 10) s += "0";
			s += day;

			s += " "
			if (hour < 10) s += "0";
			s += hour;

			s += ":"
			if (minute < 10) s += "0";
			s += minute;

			return s;
		}

		//只显示时间点
		, time: function (date) {
			if (date == null) return "N/A";

			if (typeof(date) == "number") date = new Date(date);

			var hour = date.getHours();
			var minute = date.getMinutes();

			var s = "";

			if (hour < 10) s += "0";
			s += hour;

			s += ":"
			if (minute < 10) s += "0";
			s += minute;

			return s;
		}

		// 显示到秒
		, second: function (date) {
			if (date == null) return "N/A";

			if (typeof(date) == "number") date = new Date(date);

			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();

			var s = "";
			s += year;

			s += "年";
			if (month < 10) s += "0";
			s += month;

			s += "月";
			if (day < 10) s += "0";
			s += day;

			s += "日 "
			if (hour < 10) s += "0";
			s += hour;

			s += ":"
			if (minute < 10) s += "0";
			s += minute;

			s += ":"
			if (second < 10) s += "0";
			s += second;

			return s;
		}
	};

	//暴露接口
	exports('labUtil', labUtil);
});
