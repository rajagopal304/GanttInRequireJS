
// Will load localized strings to be shown inside the gantt based on the current browser locale. You can add more localized string dictionaries if the default supported dictionaries don't suffice.
jQuery.i18n.properties({
	name: 'RQStrings',
	path: 'localeStrings/',
	mode: 'both'
});

$.ui.editor.editors =
{
	expandableTextBox: function (input, options) {
		input.width(50);
		input.ExpandableTextBox({
			Converter: nameConverter,
			ConverterBack: function (value, flexyNodeData) {

				// The grid calls this converter with flexyNodeData as a arg.
				if (flexyNodeData)
					data = flexyNodeData.Data();
					// The grid calls this converter with flexyNodeData as a datacontext.
				else
					data = this.data;

				if (data["TName"])
					data["TName"] = value;
				else if (data["RName"])
					data["RName"] = value;
				else if (data["TaskName"])
					data["TaskName"] = value;
			}
		})

		return input.data().ExpandableTextBox.widget()
	}
}

// Determine the time the timeline in the gantt should scroll to.
var anchorTime = jsonData[0].PStartTime.clone();
// The template that defines the look for the parent task bars.
var pTemplate = "<div  class='rq-gc-parentBar'><div  class='rq-taskbar-dragThumb'></div><div class='rq-taskbar-resizeThumb'></div><div class='start-resizeThumb'></div><div class='rq-gc-parentBar-leftCue'></div><div class='rq-gc-parentBar-middle'></div><div class='rq-gc-parentBar-rightCue'></div></div>";

// The template that defines the look for the task bars. "rq-gc-taskbar" is a built-in style that defines a default look for the task bars.
var tTemplate = "<div  class='rq-gc-taskbar'><div  class='rq-taskbar-dragThumb'></div><div class='rq-taskbar-resizeThumb'></div><div class='start-resizeThumb'></div></div>";
var $gantt_container = $("#gantt_container");
// Initialize the FlexyGantt widget.
$gantt_container.FlexyGantt({
	DataSource: jsonData,
	GanttTable: $("#flexyTable"),
	//the FlexyGantt is bound to  resolve the hierarchy of Team/Resources/Tasks.
	resolverFunction: function (data) {
		// If data is wrapped by KO, then data itself could be a function and so we pick the object from the function.
		if ($.isFunction(data)) {
			data = data()[0];
		}
		if (data["Resources"] != undefined) {
			if ($.isFunction(data["Resources"]))
				return data["Resources"]();
			else
				return data["Resources"];
		}
		return null;
	},
	TaskItemTemplate: "<div class='rq-gc-taskbar ui-state-default'><div id='GanttTaskBarLabel' class='rq-gc-taskbar-label'></div><div class='rq-gc-start-verticalLine' style='width:0px;'></div><div class='rq-gc-end-verticalLine' style='width:0px;'></div>",
	ParentTaskItemTemplate: "<div  class='rq-gc-parentBar'><div class='rq-gc-parentBar-leftCue'></div><div class='parentMiddleBarWithLine-style'></div><div class='rq-gc-parentBar-rightCue'><div id='GanttTaskBarLabel' class='rq-gc-taskbar-label'></div><div class='rq-gc-start-verticalLine' style='width:0px;'></div><div class='rq-gc-end-verticalLine' style='width:0px;'></div>",
	GanttChartTemplateApplied: function (sender) {
		var $GanttChart = $gantt_container.data("FlexyGantt").GetGanttChart();
		$GanttChart.GanttChart({ AnchorTime: anchorTime, TimeIndicatorLineOption: RadiantQ.Gantt.TimeIndicatorLines.Always });
	},
	TaskStartTimeProperty: "StartTime",
	ParentTaskStartTimeProperty: "PStartTime",
	GanttTableRowLoadedCallBack: templateCallBack,
	TaskItemTemplate: tTemplate,
	ParentTaskItemTemplate: pTemplate,
	TaskEndTimeProperty: "EndTime",
	ParentTaskEndTimeProperty: "PEndTime",
	TasksListProperty: "Tasks",
	TaskTooltipTemplate: $("#TaskTooltipTemplate")
});

var $table = $gantt_container.data("FlexyGantt").options.GanttTable;
$table.gridEditor({
	//Triggers when editing start.
	start: function (event, ui) {
		return false;
		/*To prevent default action, default action, set the value to the textbox base on column name*/

	},
	submit: function (event, ui) {
		// return false; to discard changes.
	}
});

// called while creating the FlexyTable row.
function templateCallBack(tr) {
	$("div.rq-grid-nameCol", tr).ExpandableTextBlock({
		Converter: nameConverter
	});
}