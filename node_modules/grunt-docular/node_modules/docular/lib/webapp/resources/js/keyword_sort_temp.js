
var KEYWORD_PRIORITY = {
  '.index': 1,
  '.overview': 1,
  '.module':1,
  '.bootstrap': 2,
  '.mvc': 3,
  '.scopes': 4,
  '.compiler': 5,
  '.templates': 6,
  '.services': 7,
  '.di': 8,
  '.unit-testing': 9,
  '.dev_guide': 9,
  '.dev_guide.overview': 1,
  '.dev_guide.bootstrap': 2,
  '.dev_guide.bootstrap.auto_bootstrap': 1,
  '.dev_guide.bootstrap.manual_bootstrap': 2,
  '.dev_guide.mvc': 3,
  '.dev_guide.mvc.understanding_model': 1,
  '.dev_guide.mvc.understanding_controller': 2,
  '.dev_guide.mvc.understanding_view': 3,
  '.dev_guide.scopes': 4,
  '.dev_guide.scopes.understanding_scopes': 1,
  '.dev_guide.scopes.internals': 2,
  '.dev_guide.compiler': 5,
  '.dev_guide.templates': 6,
  '.dev_guide.services': 7,
  '.dev_guide.di': 8,
  '.dev_guide.unit-testing': 9
};

var sort = function (a, b){
    function mangleName(doc) {
        var path = doc.id.split(/\./);
        var mangled = [];
        var partialName = '';
        path.forEach(function(name){
            partialName += '.' + name;
            mangled.push(KEYWORD_PRIORITY[partialName] || 5);
            mangled.push(name);
        });
        return (doc.section + '/' + mangled.join('.')).toLowerCase();
    }
    var nameA = mangleName(a);
    var nameB = mangleName(b);
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
};