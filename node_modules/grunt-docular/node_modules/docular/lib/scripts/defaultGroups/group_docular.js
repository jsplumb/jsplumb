exports.config = {
    groupTitle: 'Docular', //this is what will show up in the UI for this group
    groupId: 'docular', //to determine what directory these docs will go into and used as an identifier
    groupIcon: 'icon-edit', //icon to use when relevant and within this group of documentation
    descr: 'Description', //@todo figure out how to use this?
    showSource: true,
    sections: [
        {
            id: "docularinstall",
            title: "Install Docular",
            docs: [
                "lib/scripts/docs/install"
            ],
            rank: {'installnode':1, 'installgrunt':2, 'installdocular':3}
        },
        {
            id: "docularconfigure",
            title: "Docular Configurations",
            docs: [
                "lib/scripts/docs/configure"
            ],
            rank: {'show':1, 'groups':2, 'sections':3, 'discussions':4, 'analytics':5, 'partials':6, 'ui':7}
        },
        {
            id: "docularcreate",
            title: "Documentation Groups and Sections",
            docs: [
                "lib/scripts/docs/create"
            ],
            rank: {'configuregroup':1, 'configuresection':2, 'firstdoc':3}
        },
        {
            id: "embed",
            title: "Embedding Documentation",
            docs: [
                "lib/scripts/docs/embed"
            ],
            rank: {'blockdef_js':1, 'blockdef_doc':2}
        },
        {
            id: 'basics',
            title: 'Documentation Basics',
            docs: [
                "lib/scripts/docs/basics"
            ],
            rank : {'identifier':1, 'naming':2, 'fields':3, 'modules':4, 'sections':5, 'types':6, 'types_doc':7, 'types_ngdoc':8, 'children':9, 'links':10}
        },
        {
            id: "doctypes",
            title: 'Documentation Types (DocTypes)',
            docs: [
                "lib/scripts/docs/doctypes/doctypes.doc"
            ],
            rank : {'types_doc':2, 'types_ngdoc':3}
        },
        {
            id: "docularext",
            title:"Docular Extensions",
            scripts: [],
            docs: [
                "lib/scripts/docs/extensions"
            ]
        },
        {
            id: "docular",
            title:"Docular Source",
            scripts: [
                "lib/scripts/gen-docs.js",
                "lib/scripts/reader.js",
                "lib/scripts/writer.js",
                "lib/scripts/Doc.js"
            ],
            docs : [
                "lib/scripts/docs/node",
                "README.md"
            ]
        },
        {
            id: "docularfaq",
            title:"FAQs",
            scripts: [],
            docs: [
                "lib/scripts/docs/faq"
            ]
        }
    ]
};