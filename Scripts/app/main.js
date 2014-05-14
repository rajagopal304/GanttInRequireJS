
var jsonData = [];
define(["RadiantQ"], function () {
	$.ajax({
		type: "GET",
		dataType: 'json',
		url: 'FlexyGanttSkeleton.json',
		converters:
		{
			"text json": function (data) {
				return $.parseJSON(data, true /*converts date strings to date objects*/, true /*converts ISO dates to local dates*/);
			}
		},
		success: function (data) {
		    jsonData = data;
			require(["initGantt"]);
		}
	});
});