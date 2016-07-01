// contains some utility functions of the project

function getHeightIncrement(num_input, num_output, height, default_interval)
{
	var left_side_interval = height / num_input;
	var right_side_interval = height / num_output;
	if(left_side_interval < default_interval)
	{
		return (num_input+1) * default_interval;
	}
	else if(right_side_interval < default_interval)
	{
		return (num_output+1) * default_interval;
	}
	else
	{
		return height;
	}
}

var inclueJQuery = "<script type='text/javascript' src='js/jquery.min.js'><\/script>";
var scriptOpenning = "<script>";
var JQueryFunctionOpenning = ";(function() {";
var JQueryFunctionClosing = "});()";
var scriptClosing = "<\/script>";

function addFunctionOpenning(id, fn)
{
	return "$('#" + id + "')." + fn + "(function(){";
}

var addFunctionClosing = "});";