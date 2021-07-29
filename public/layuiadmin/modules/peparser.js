/**
 @Name：layuiAdmin 工单系统
 @Site：http://www.layui.com/admin/
 */
layui.define(['table', 'form', 'element'], function (exports) {
	var $ = layui.$
		, table = layui.table
		, form = layui.form
		, element = layui.element;

	table.render({
		elem: '#LAY-app-system-order'
		, url: layui.setter.base + 'json/peparser/demo.js' //模拟接口
		, cols: [[
			{type: 'numbers', fixed: 'left'}
			, {field: 'orderid', width: 100, title: '检测编号', align: 'center'}
			, {field: 'title', title: '文件名', width: 300, align: 'center'}
			, {field: 'progress', title: '分析进度', width: 200, align: 'center', templet: '#progressTpl'}
			, {field: 'submit', width: 100, title: '提交者', align: 'center'}
			, {field: 'state', title: '检测结果', templet: '#buttonTpl', minWidth: 80, align: 'center'}
			, {title: '操作', align: 'center', fixed: 'right', toolbar: '#table-system-order'}
		]]
		, page: false
		, limit: 10
		, limits: [10, 15, 20, 25, 30]
		, text: '对不起，加载出现异常！'
		, done: function () {
			element.render('progress')
		}
	});

	table.render({
		elem: '#classify1'
		, url: layui.setter.base + 'json/peparser/classify.js' //模拟接口
		, cols: [[
			{type: 'numbers', fixed: 'left'}
			, {field: 'orderid', width: 100, title: '检测编号', align: 'center'}
			, {field: 'title', title: '文件名', width: 300, align: 'center'}
			, {field: 'progress', title: '分析进度', width: 200, align: 'center', templet: '#progressTpl'}
			, {field: 'submit', width: 100, title: '提交者', align: 'center'}
			, {field: 'state', title: '分类结果', templet: '#buttonTpl', minWidth: 80, align: 'center'}
			, {title: '操作', align: 'center', fixed: 'right', toolbar: '#table-system-order'}
		]]
		, page: false
	});

	table.render({
		elem: '#classify2'
		, url: layui.setter.base + 'json/peparser/classify.js' //模拟接口
		, cols: [[
			{type: 'numbers', fixed: 'left'}
			, {field: 'orderid', width: 100, title: '检测编号', align: 'center'}
			, {field: 'title', title: '文件名', width: 300, align: 'center'}
			, {field: 'progress', title: '分析进度', width: 200, align: 'center', templet: '#progressTpl2'}
			, {field: 'submit', width: 100, title: '提交者', align: 'center'}
			, {field: 'state', title: '分类结果', templet: '#buttonTpl', minWidth: 80, align: 'center'}
			, {title: '操作', align: 'center', fixed: 'right', toolbar: '#table-system-order'}
		]]
		, page: false
	});

	table.render({
		elem: '#modify'
		, url: layui.setter.base + 'json/peparser/modify.js' //模拟接口
		, cols: [[
			{type: 'numbers', fixed: 'left'}
			, {field: 'orderid', width: 100, title: '检测编号', align: 'center'}
			, {field: 'title', title: '原文件名', width: 300, align: 'center'}
			, {field: 'title2', title: '生成的对抗样本', width: 300, align: 'center'}
			, {field: 'submit', width: 100, title: '提交者', align: 'center'}
			, {field: 'state', title: '对抗样本结果', templet: '#buttonTpl', minWidth: 80, align: 'center'}
			, {title: '操作', align: 'center', fixed: 'right', toolbar: '#table-system-order'}
		]]
		, page: false
	});

	table.render({
		elem: '#modify2'
		, url: layui.setter.base + 'json/peparser/modify2.js' //模拟接口
		, cols: [[
			{type: 'numbers', fixed: 'left'}
			, {field: 'orderid', width: 100, title: '检测编号', align: 'center'}
			, {field: 'title', title: '原文件名', width: 300, align: 'center'}
			, {field: 'title2', title: '生成的对抗样本', width: 300, align: 'center'}
			, {field: 'submit', width: 100, title: '提交者', align: 'center'}
			, {field: 'state', title: '对抗样本分类结果', templet: '#buttonTpl', minWidth: 80, align: 'center'}
			, {title: '操作', align: 'center', fixed: 'right', toolbar: '#table-system-order'}
		]]
		, page: false
	});

	exports('peparser', {})
});