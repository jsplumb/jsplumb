
/*============ CREATE OBJECT TO STORE ALL THE DOCSAPP MODULE CONFIGS ============*/

// this is the public api that other docular-doc-api- extensions can hook into to extend the behavior

var docsApp = {
    controller: {},
    directive: {},
    serviceFactory: {},
    filter: {}
};


/*============ CONTROLLER DIRECTIVES AND SERVICES ============*/

docsApp.directive.focused = function($timeout) {
    return function(scope, element, attrs) {
        element[0].focus();
        element.bind('focus', function() {
            scope.$apply(attrs.focused + '=true');
        });
        element.bind('blur', function() {
            // have to use $timeout, so that we close the drop-down after the user clicks,
            // otherwise when the user clicks we process the closing before we process the click.
            $timeout(function() {
                scope.$eval(attrs.focused + '=false');
            });
        });
        scope.$eval(attrs.focused + '=true');
    };
};

docsApp.directive.documentationGroupList = function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: [
            '<div class="documentation-groups">',
                '<div ng-repeat="group in docGroups" class="documentation-group" ng-show="group.visible">',
                    '<h2><i class="{{group.groupIcon}} icon-white"></i> {{group.title}} </h2>',
                    '<div class="documentation-group-info">',
                        '<ul>',
                            '<li ng-repeat="section in group.sections" class="documentation-group-section">',
                                '<a href="{{section.url}}">{{section.title}}</a>',
                            '</li>',
                        '</ul>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''),
        link: function(scope, element, attrs) {
            scope.docGroups = scope.$parent.docGroups;
        }
    };
};

docsApp.directive.documentationSectionList = function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: [
            '<div class="section-group">',
                '<div class="hero-unit" ng-show="showHeader">',
                    '<h2><i class="{{group.groupIcon}} icon-white"></i> {{group.title}} </h2>',
                '</div>',
                '<ol class="rounded-list">',
                    '<li ng-repeat="section in group.sections" class="documentation-group-section">',
                        '<a href="{{section.url}}">{{section.title}}</a>',
                    '</li>',
                '</ol>',
            '</div>'
        ].join(''),
        link: function(scope, element, attrs) {

            scope.showHeader = attrs.header === "false" ? false : true;

            var setGroup = function(newValue, oldValue){
                var groupId = newValue;
                var allGroups = scope.$parent.docGroups;
                for(var i=0; i < allGroups.length; i++) {
                    if(allGroups[i].id == groupId) {
                        scope.group = allGroups[i];
                    }
                }
            };

            if(attrs.group){
                setGroup(attrs.group);
            } else {
                scope.$parent.$watch('currentGroupId', setGroup);
            }
        }
    };
};

docsApp.directive.pageList = function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: [
            '<ol class="rounded-list">',
                '<li ng-repeat="page in sectionPages" ng-show="page.id != \'index\'"><a href="{{page.url}}">{{page.shortName}}</a></li>',
            '</ol>'
        ].join(''),
        link: function(scope, element, attrs) {
            scope.sectionPages = scope.$parent.sectionPages;
        }
    };
};

docsApp.directive.pager = function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: [
            '<ul class="pager">',
                '<li class="previous" ng-show="prevPage.exists"><a href="{{prevPage.url}}">&lt;&lt; {{prevPage.title}}</a></li>',
                '<li class="next" ng-show="nextPage.exists"><a href="{{nextPage.url}}">{{nextPage.title}} &gt;&gt;</a></li>',
            '</ul>'
        ].join(''),
        link: function(scope, element, attrs) {

            var getPageIndex = function (pages, pageId) {
                for(var i=0; i < pages.length; i++) {
                    if(pages[i].id == pageId){
                        return i;
                    }
                }
            };

            var getNextPage = function (pages, ci) {
                if(currentIndex + 1 < pages.length && pages.length > 0){

                    if(currentIndex +1 == pages.length -1){
                        if(pages[pages.length-1].id != "index") {
                            return {exists: true, title: pages[ci+ 1].shortName, url: pages[ci+1].url};
                        } else {
                            return {exists:false, title:'', url:''};
                        }
                    }

                    return {exists:true, title: pages[ci + 1].shortName, url: pages[ci+1].url};

                } else {
                    return {exists:false, title:'', url:''};
                }
            };

            var getPrevPage = function (pages, ci) {
                if(ci !== 0){
                    return {exists: true, title: pages[ci - 1].shortName, url: pages[ci - 1].url};
                } else {
                    return {exists: false, title:'', url:''};
                }
            };

            var sectionPages = scope.$parent.sectionPages;
            var currentPageId = scope.$parent.currentPage.id;
            var currentIndex = getPageIndex(sectionPages, currentPageId);

            scope.nextPage = getNextPage(sectionPages, currentIndex);
            scope.prevPage = getPrevPage(sectionPages, currentIndex);

        }
    };
};

docsApp.directive.viewSource = function ($timeout, $compile) {
    return {
        restrict: 'E',
        replace: true,
        template: [
            '<div class="view-source" ng-show="currentSource.source">',
                '<span class="btn btn-primary"><i class="icon-spinner icon-spin"></i><i class="icon-eye-open"></i> view source</span>',
            '</div>'
        ].join(''),
        link: function(scope, element, attrs) {

            element.bind('click', function(){

                element.addClass('loading');

                scope.lastOffset = $(window).scrollTop();

                var highlight = "";
                var glue = "";
                for(var i=0; i < scope.currentSource.codeBlocks.length; i++) {
                    highlight = highlight + glue + scope.currentSource.codeBlocks[i].lineStart + '-' + scope.currentSource.codeBlocks[i].lineEnd;
                    glue = ",";
                }

                //let's determine if this is a doc file that doesn't need syntax highlighting
                var language = "";
                var contentURL = scope.currentSource.source.contentURL;
                if(contentURL.indexOf('.doc.txt') != -1 || contentURL.indexOf('.ngdoc.txt') != -1 || contentURL.indexOf('.md.txt') != -1){
                    language = "lang-doc";
                }

                $.ajax({
                    url: scope.currentSource.source.contentURL,
                    success: function (content) {
                        var sourceContent = '<pre class="prettyprint linenums '+ language +'" prettyprint-highlight="'+highlight+'">' + content.replace(/\</gi,'&lt;').replace(/\>/gi,'&gt;') + '</pre>';
                        scope.lastMode = scope.mode;
                        scope.mode = "show-source";
                        scope.currentSourceContent = $compile( sourceContent )( scope );
                        scope.$apply();
                        element.removeClass('loading');
                    },
                    error: function () {
                        element.removeClass('loading');
                    }
                });

            });
        }
    };
};

docsApp.directive.prettyprintHighlight = function ($timeout, $compile) {
    return {
        link: function(scope, element, attrs) {

            var listItems = element.find('li');

            var getBoundaries = function (bString) {

                var highlight = function (bs, be) {

                    be = Math.min(be + 1, $(listItems).length);
                    if(be < $(listItems).length -1) {
                        be--;
                    }

                    for(var j=bs; j <= be; j++) {
                        $(listItems[j-1]).addClass('highlight');
                    }
                };

                var boundaries = bString.split(',');
                for(var i=0; i < boundaries.length; i++) {

                    var thisB = boundaries[i];
                    var bParts = thisB.split('-');
                    if(bParts.length == 2){
                        highlight(parseInt(bParts[0]), parseInt(bParts[1]));
                    } else {
                        highlight(parseInt(bParts[0]), parseInt(bParts[0]));
                    }
                }
            };

            getBoundaries(attrs.prettyprintHighlight);

            setTimeout(function(){
                var first = $(element.find('li.highlight')[0]);
                first.goTo();
            },1);
        }
    };
};

docsApp.directive.hideSource = function ($timeout, $compile) {
    return {
        restrict: 'E',
        replace: true,
        template: [
            '<div class="view-source hide-source">',
                '<span class="btn source-file">',
                    '<i class="icon-file"></i> <span class="source-url">{{currentSource.source.filename}}</span>',
                    '<span class="btn btn-primary hide-source-btn" style="margin-left: 10px;"><i class="icon-eye-close"></i> hide source</span>',
                '</span>',
            '</div>'
        ].join(''),
        link: function(scope, element, attrs) {

            element.find('.hide-source-btn').bind('click', function(){
                scope.mode = scope.lastMode;
                scope.$apply();
                setTimeout(function(){
                    $('html, body').animate({
                        scrollTop: scope.lastOffset + 'px'
                    }, 500);
                },1);
            });
        }
    };
};

docsApp.directive.code = function() {
  return { restrict:'E', terminal: true };
};

docsApp.serviceFactory.angularUrls = function($document) {
  var urls = {};

  angular.forEach($document.find('script'), function(script) {
    var match = script.src.match(/^.*\/(angular[^\/]*\.js)$/);
    if (match) {
      urls[match[1].replace(/(\-\d.*)?(\.min)?\.js$/, '.js')] = match[0];
    }
  });

  return urls;
};

docsApp.serviceFactory.formPostData = function($document) {
  return function(url, fields) {
    var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
    angular.forEach(fields, function(value, name) {
      var input = angular.element('<input type="hidden" name="' +  name + '">');
      input.attr('value', value);
      form.append(input);
    });
    $document.find('body').append(form);
    form[0].submit();
    form.remove();
  };
};

docsApp.serviceFactory.sections = function sections() {

    var sections = {
        pages : {},
        groupMap : {},
        getPage: function(groupId, sectionId, partialId) {

            if(sectionId && partialId){

                var pages = sections.pages[groupId][sectionId];
                for (var i = 0, ii = pages.length; i < ii; i++) {
                    if (pages[i].id == partialId) {
                        return pages[i];
                    }
                }

            } else {

                var pages = sections.pages[groupId][sectionId];
                for (var i = 0, ii = pages.length; i < ii; i++) {
                    if (pages[i].id == 'index') {
                        return pages[i];
                    }
                }

            }

            return null;
        },
        getGroups : function () {

            sections.groupMap = {};

            var groups = [];
            for(var j=0; j < GROUP_DATA.length; j++){

                var group = GROUP_DATA[j];
                sections.groupMap[group.groupId] = {groupTitle:group.groupTitle, sections:{}, groupIcon:group.groupIcon, visible: group.visible};

                var sects = group.sections;
                for(var k=0; k < sects.length; k++) {
                    sects[k].url = 'documentation/' + group.groupId + '/' + sects[k].id + '/index';
                    sections.groupMap[group.groupId].sections[sects[k].id] = sects[k];
                }

                groups.push({
                    id: group.groupId,
                    title: group.groupTitle,
                    groupIcon: group.groupIcon || 'icon-book',
                    sections: sects,
                    visible: group.visible
                });
            }
            return groups;
        }
    };

    angular.forEach(DOC_DATA, function(page) {

        page.url = "documentation/" + page.group + "/" + page.section + '/' +  page.id;
        page.partialUrl = 'documentation/partials/' + page.group + '/' + page.section + '/' +  page.id + '.html';

        //make sure the group is defined
        if(!sections.pages[page.group]){
            sections.pages[page.group] = [];
        }

        if(!sections.pages[page.group][page.section]){
            sections.pages[page.group][page.section] = [];
        }
        sections.pages[page.group][page.section].push(page);
    });

    return sections;
};


/*=========== THIS IS THE MAIN CONTROLLER FOR THE DOCUMENTATION RENDERING WORKFLOW ============*/

docsApp.controller.DocsController = function($scope, $location, $window, $cookies, sections) {

    var OFFLINE_COOKIE_NAME = 'ng-offline';
    var DOCS_PATH = /^\/(documentation)/;
    var HOME_PATH = /^\/$/;
    var INDEX_PATH = /^(\/|\/index[^\.]*.html)$/;
    var GLOBALS = /^angular\.([^\.]+)$/;
    var MODULE = /^((?:(?!^angular\.)[^\.])+)$/;
    var MODULE_MOCK = /^angular\.mock\.([^\.]+)$/;
    var MODULE_DIRECTIVE = /^((?:(?!^angular\.)[^\.])+)\.directive:([^\.]+)$/;
    var MODULE_DIRECTIVE_INPUT = /^((?:(?!^angular\.)[^\.])+)\.directive:input\.([^\.]+)$/;
    var MODULE_FILTER = /^((?:(?!^angular\.)[^\.])+)\.filter:([^\.]+)$/;
    var MODULE_SERVICE = /^((?:(?!^angular\.)[^\.])+)\.([^\.]+?)(Provider)?$/;
    var MODULE_TYPE = /^((?:(?!^angular\.)[^\.])+)\..+\.([A-Z][^\.]+)$/;

    var URL = {
        module: 'guide/module',
        directive: 'guide/directive',
        input: 'documentation/angular/api/ng.directive:input',
        filter: 'guide/dev_guide.templates.filters',
        service: 'guide/dev_guide.services',
        type: 'guide/types'
    };

    var pageMatches = function (p1, p2) {
        return p1 && p2 && (p1.section == p2.section && p1.group == p2.group && p1.id == p2.id);
    };

    /*=========== PUBLIC METHODS =============*/

    $scope.navClass = function(page) {
        return {
            last: this.$last,
            active: page && pageMatches(this.currentPage, page)
        };
    };

    $scope.iconClass = function(module) {
        return {
            'icon-plus': module.visible === "hidden",
            'icon-minus': module.visible !== "hidden"
        };
    };

    $scope.visibilityClass = function(module) {
        return {
            'hidden': module.visible === "hidden",
            'btn-primary': module.selected && module.visible === "hidden"
        };
    };

    $scope.toggleVisible = function () {

        var visibilityCookie = this.module.placement.group + "-" + this.module.placement.section + "-" + this.module.placement.module + ".visible";
        this.module.visible = (this.module.visible === "visible") ? "hidden" : "visible";

        $.cookie(
            visibilityCookie,
            this.module.visible
        );
    };

    $scope.submitForm = function() {
        $scope.bestMatch && $location.path($scope.bestMatch.page.url);
    };

    $scope.afterPartialLoaded = function() {
        var currentPageId = $location.path();
        $scope.partialTitle = $scope.currentPage.shortName;
        $window._gaq.push(['_trackPageview', currentPageId]);
    };

    /** stores a cookie that is used by apache to decide which manifest ot send */
    $scope.enableOffline = function() {
        //The cookie will be good for one year!
        var date = new Date();
        date.setTime(date.getTime()+(365*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
        var value = angular.version.full;
        document.cookie = OFFLINE_COOKIE_NAME + "="+value+expires+"; path=" + $location.path;

        //force the page to reload so server can serve new manifest file
        window.location.reload(true);
    };

    //get all possible document groups
    $scope.docGroups = sections.getGroups();

    //the default mode
    $scope.mode = "home";

    /*============ WATCHES ============*/

    $scope.$watch(function docsPathWatch() {return $location.path(); }, function docsPathWatchAction(path) {

        //reset a view variables
        $scope.currentSource = false;

        // if we are looking at a documentation partial
        if (DOCS_PATH.test(path)) {

            var parts = path.split('/'),
                groupId = parts[2],
                sectionId = parts[3],
                partialId = parts[4];

            var isGroupIndexPage = groupId && (sectionId == "index") && !partialId;

            if(isGroupIndexPage){

                //change the mode
                $scope.mode = "groupindex";
                $scope.currentGroupId = groupId;

                //update analytics
                $window._gaq.push(['_trackPageview', '/' + groupId + '/index']);

            } else {

                //change the mode
                $scope.mode = "documentation";

                var page = sections.getPage(groupId, sectionId, partialId);
                var groupTitle = groupId ? sections.groupMap[groupId].groupTitle : "";
                var sectionName = sectionId ? sections.groupMap[groupId].sections[sectionId].title : "";

                $scope.currentPage = page;

                $scope.currentSource = {
                    source: $scope.currentPage.source,
                    codeBlocks: $scope.currentPage.codeBlocks
                };

                if (!$scope.currentPage) {
                    $scope.partialTitle = 'Error: Page Not Found!';
                } else {

                    //lets expose additional data into the $scope so extensions can take advanatage of it
                    $scope.sectionInfo = sections.groupMap[groupId].sections[sectionId];
                    var pageOrder = $scope.sectionInfo.rank || {};
                    $scope.sectionPages = sortPages(sections.pages[groupId][sectionId], pageOrder);

                }

                var currentPageId = $location.path();
                if($scope.discussionsEnabled){
                    loadDisqus(currentPageId);
                }

                updateSearch();

                // Update breadcrumbs
                var breadcrumb = $scope.breadcrumb = [],
                    match;

                if (partialId) {

                    breadcrumb.push({ name: groupTitle, url:'documentation/' + groupId + '/index'});

                    if(partialId != 'index') {
                        breadcrumb.push({ name: sectionName, url: 'documentation/' + groupId + '/' + sectionId });
                    } else {
                        breadcrumb.push({ name: sectionName });
                    }

                    if(page && page.module && page.docType != "overview" && partialId != 'index'){

                        if(page.moduleItem){

                            breadcrumb.push({ name: page.module, url: 'documentation/' + groupId + '/' + sectionId + '/' + page.module});

                            if(page.moduleSubItem){

                                breadcrumb.push({ name: page.moduleItem, url: 'documentation/' + groupId + '/' + sectionId + '/' + page.module + '.' + page.moduleSection + ':' + page.moduleItem});
                                breadcrumb.push({ name: page.moduleSubItem});

                            } else {

                                breadcrumb.push({ name: page.moduleItem});
                            }
                        } else {

                            breadcrumb.push({ name: page.module});
                        }
                    } else if (partialId != 'index'){

                        if(page) {
                            breadcrumb.push({ name: page.shortName });
                        }
                    }

                } else if (sectionId) {

                    breadcrumb.push({ name: groupTitle, url:'documentation/' + groupId + '/index'});
                    breadcrumb.push({ name: sectionName });

                } else if (groupId) {

                    breadcrumb.push({ name: groupTitle, url:'documentation/' + groupId + '/index'});

                }
            }

        } else if (HOME_PATH.test(path)) {

            $scope.mode = "home";
            $window._gaq.push(['_trackPageview', '/']);
        }
    });

    $scope.$watch('search', updateSearch);


    /*=========== INITIALIZE ===========*/

    $scope.versionNumber = angular.version.full;
    $scope.version = angular.version.full + "  " + angular.version.codeName;
    $scope.subpage = false;
    $scope.offlineEnabled = ($cookies[OFFLINE_COOKIE_NAME] == angular.version.full);
    $scope.futurePartialTitle = null;
    $scope.loading = 0;
    $scope.URL = URL;
    $scope.$cookies = $cookies;
    $scope.discussionsEnabled = discussionConfigs.active;

    $cookies.platformPreference = $cookies.platformPreference || 'gitUnix';

    if (!$location.path() || INDEX_PATH.test($location.path())) {
        $location.path('/').replace();
    }
    // bind escape to hash reset callback
    angular.element(window).bind('keydown', function(e) {
        if (e.keyCode === 27) {
            $scope.$apply(function() {
                $scope.subpage = false;
            });
        }
    });

    var moduleSectionInfoMap = {};
    for(var m=0; m < GROUP_DATA.length; m++){

        var thisGroup = GROUP_DATA[m];
        var group = thisGroup.groupId;

        moduleSectionInfoMap[group] = {};

        for(var l=0; l < thisGroup.sections.length; l++){

            var thisSection = thisGroup.sections[l];
            var thisDocAPI = thisSection['doc_api'];

            //if there are no docs for this section then the doc_api value will be empty and this is pointless
            if(thisDocAPI){
                moduleSectionInfoMap[group][thisSection.id] = {};

                //first check for a link to the definition of "module"
                moduleSectionInfoMap[group][thisSection.id]["module"] = {link:LAYOUT_DATA[thisDocAPI].layout.module.link || "#"};

                //next look for links for the definition of each "section" (they can be absoulte or relative to the root of the webapp)
                for(var modSection in LAYOUT_DATA[thisDocAPI].layout.sections){
                    moduleSectionInfoMap[group][thisSection.id][modSection] = {};
                    moduleSectionInfoMap[group][thisSection.id][modSection].link = LAYOUT_DATA[thisDocAPI].layout.sections[modSection].link || "#";
                    moduleSectionInfoMap[group][thisSection.id][modSection].order = LAYOUT_DATA[thisDocAPI].layout.sections[modSection].order || 99999999;
                }
            }

        }
    }


    /*========== PRIVATE METHODS ============*/

    window.moduleSectionInfoMap = moduleSectionInfoMap;

    function sortPages (pages, pageOrder) {

        pageOrder = pageOrder || {};

        var PAGE_SORT = function (p1, p2) {

            if(p1.id == "index") {
                return 1;
            }

            if(p2.id == "index") {
                return -1;
            }

            var p1_rank = pageOrder[p1.id];
            var p2_rank = pageOrder[p2.id];

            if( (p1_rank && !p2_rank) || (p1_rank && p1_rank < p2_rank) ){
                return -1;
            } else if ( (p2_rank && !p1_rank) || (p2_rank && p2_rank < p1_rank) ) {
                return 1;
            } else if (p1_rank && p2_rank){

                if(p1_rank < p2_rank) {
                    return -1;
                } else if (p2_rank < p1_rank) {
                    return 1;
                } else {
                    return 0;
                }

            } else {

                if(p1.shortName < p2.shortName) {
                    return -1;
                } else if (p2.shortName < p1.shortName) {
                    return 1;
                } else {
                    return 0;
                }

            }
        };

        return pages.sort(PAGE_SORT);
    }

    function getModuleSectionLink(page, modSection) {
        return moduleSectionInfoMap[page.group][page.section][modSection].link;
    }
    function getModuleSectionOrder(page, modSection) {
        return moduleSectionInfoMap[page.group][page.section][modSection].order;
    }

    function getVisibility(pGroup, pSection, pModule) {

        //first determine if it is visible
        var visibleCookie = pGroup + "-" + pSection + "-" + pModule + ".visible";

        var visible = $.cookie(visibleCookie);
        if(!visible){
            visible = 'visible';
            $.cookie(visibleCookie, "visible");
        }

        var selected = false;
        if($scope.currentPage){
            //then determine if this module is the one who's item is selected
            var currentVis = $scope.currentPage.group + "-" + $scope.currentPage.section + "-" + $scope.currentPage.module;
            if(currentVis === pGroup + "-" + pSection + "-" + pModule){
                selected = true;
            }
        }

        return {visible:visible, selected:selected};
    }

    function updateSearch() {

        if($scope.mode != "documentation"){return;}

        var parts = $location.path().split('/');
        var modules = $scope.modules = [],
        otherPages = $scope.pages = [],
        search = $scope.search,
        bestMatch = {page: null, rank:0};

        if(!parts[3]){
            return;
        }

        var MODULE_SORT = function (a, b) {
            if(a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        };

        var pageOrder = sections.groupMap[parts[2]].sections[parts[3]].rank || {};

        var cache = {};
        var pages = sortPages(sections.pages[parts[2]][parts[3]], pageOrder);

        angular.forEach(pages, function(page) {
            var match,
            id = page.id;

            if (!(match = rank(page, search))) return;

            if (match.rank > bestMatch.rank) {
                bestMatch = match;
            }


            /*============ HERE WE GENERATE NEW MODULES AND PUSH PAGES INTO DIFFERENT SECTIONS OF EACH MODULE ===========*/

            //if this docType is "overview", then it doesn't go in a module
            if (page.docType == 'overview' && page.id != 'index') {

                otherPages.push(page);

            //otherwise, everything else should be in a module except for index.html files which match to the section description
            } else if( page.id != 'index') {

                //if there is no module section, then it's a module definition
                if(!page.moduleSection){
                    module(page.module, page).definition = page;
                } else {
                    module(page.module, page).section(page);
                }
            }

        });

        //sort the modules
        modules.sort(MODULE_SORT);

        //set the best match
        $scope.bestMatch = bestMatch;


        //============= HELPER METHODS

        function module(name, page) {
            var module = cache[name];
            if (!module) {
                var visibility = getVisibility(page.group, page.section, page.module);

                module = cache[name] = {
                    name: name,
                    placement: {group: page.group, section: page.section, module: page.module},
                    visible: visibility.visible,
                    selected: visibility.selected,
                    guideURL: getModuleSectionLink(page, 'module'),
                    codeURL: 'documentation/' + page.group + '/' + page.section + '/' + page.module,
                    definition: false,
                    sections: [],
                    sectionsMap: {},
                    section: function(page) {
                        if(this.sectionsMap[page.moduleSection] === undefined){
                            this.sectionsMap[page.moduleSection] = this.sections.length;
                            this.sections.push({
                                order: getModuleSectionOrder(page, page.moduleSection),
                                name: page.moduleSection,
                                link: getModuleSectionLink(page, page.moduleSection),
                                pages: []
                            });
                        }
                        this.sections[this.sectionsMap[page.moduleSection]].pages.push(page);
                    },
                    parseService: function(name) {
                        var service =  cache[this.name + ':' + name];
                        if (!service) {
                            service = {name: name};
                            cache[this.name + ':' + name] = service;
                            this.service.push(service);
                        }
                        return service;
                    }
                };
                modules.push(module);
            }
            return module;
        }

        function rank(page, terms) {
            var ranking = {page: page, rank:0},
            keywords = page.keywords,
            title = page.shortName.toLowerCase();

            terms && angular.forEach(terms.toLowerCase().split(' '), function(term) {
                var index;

                if (ranking) {
                    if (keywords.indexOf(term) == -1) {
                        ranking = null;
                    } else {
                        ranking.rank ++; // one point for each term found
                        if ((index = title.indexOf(term)) != -1) {
                        ranking.rank += 20 - index; // ten points if you match title
                        }
                    }
                }
            });
            return ranking;
        }
    }

    function unLoadDisqus () {
        angular.element(document.getElementById('disqus_thread')).html('');
    }

    function loadDisqus(currentPageId) {

        // http://docs.disqus.com/help/2/
        window.disqus_shortname = discussionConfigs.shortName;
        window.disqus_identifier = currentPageId;
        window.disqus_url = discussionConfigs.url + currentPageId;

        if ($location.host() == 'localhost' || discussionConfigs.dev) {
            window.disqus_developer = 1;
        }

        // http://docs.disqus.com/developers/universal/
        (function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = 'http://angularjs.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] ||
            document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();

        unLoadDisqus();
    }

}; //end : controller definition