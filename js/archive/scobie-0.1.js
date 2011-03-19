/**
 * Scobie - light weight html templating in JS.
 * 
 * in some html, include a script fragment like this:
 * 
 *  <script type="x-scobie-tmpl" data-name="someName.ext"></script>
 */
(function() {
	var _ajax = function(url, success, error) {
		var http = false;
		if (navigator.appName == "Microsoft Internet Explorer")
	  		http = new ActiveXObject("Microsoft.XMLHTTP");
		else
	  		http = new XMLHttpRequest();

		http.open("GET", url);
		http.onreadystatechange=function() {
	  		if(http.readyState == 4) {
				if (http.status == 200)
					success(http.responseText);  
				else error();
			}
		}
		http.send(null);
	};

	var _checkReady = function() {
		templateCount -= 1;
		if (templateCount == 0) {
			ready = true;
			window.setTimeout(function() {
				for (var i = 0; i < readyFuncs.length; i++)
					readyFuncs[i]();
			}, 200);
		}
	};

	var _finalise = function(s) {
		s.parentNode.removeChild(s);		
		_checkReady();	
	};

	var _init = function(base, s, isScript, isCss) {
		templateCount += 1;
		var fId = s.getAttribute("src"), h = s.innerHTML.trim();
		var params = h.length > 0 ? params = eval("(" + h +")") : {};
		var replace = function(html) {
			for (var i in params) {
				html = html.replace(new RegExp("\\${" + i + "}", "g"), params[i]);
			}
			return html;
		};
		var _finaliseThis = function() { _finalise(s); };
		_ajax(base + fId, function(html) {						
			var d = document.createElement(isScript ? "script" : isCss ? "style" : "div");
			if (isScript) {
				d.type = "text/javascript";
				d.text = replace(html);
				s.parentNode.insertBefore(d, s);
			} else if (isCss) {
				d.type = "text/css";
				d.innerHTML = replace(html);
				s.parentNode.insertBefore(d, s);
			} else {
				d.innerHTML = replace(html);
				for (var i = 0; i < d.childNodes.length; i++)
					s.parentNode.insertBefore(d.childNodes[i], s);
			}			
			_update();
			_finaliseThis();

		}, _finaliseThis);      //  ajax error handler. we ignore the failure to log a template. could log it or something of course.
	};

	var _update = function() {
		var tags = document.getElementsByTagName("script");		
		for (var i = 0; i < tags.length ;i++) {
			var type = tags[i].getAttribute("type"), isScript = type == "x-scobie-script", isCss = type == "x-scobie-css";
			var src = tags[i].getAttribute("src"), done = tags[i].getAttribute("done");							
			if ((type == "x-scobie-tmpl" && !done) || (isScript && !_loadedScripts[src]) || (isCss && !_loadedCss[src])) {
				tags[i].setAttribute("done", "true");				
				if (isScript) _loadedScripts[src] = true;
				if (isCss) _loadedCss[src] = true;
				_init(base, tags[i], isScript, isCss);
			}
		}
	};

	var _loadedScripts = { }, _loadedCss = { };
	var templateCount = 0;
	var base = /(.+\/)(.+\.?)/.exec(document.location)[1];
	
	var jQueryReady = jQuery.fn.ready, readyFuncs = [], ready = false;
	jQuery.fn.ready  = function(fn) {  // todo remove jQuery dependency entirely. but we want to override it dont we?
		if (!ready) readyFuncs.push(fn); 
	};

	var Scobie = window.Scobie = {
		ready : jQuery.fn.ready
	};
	
	jQueryReady(_update);
})();
