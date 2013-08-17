exports.config = {
    visible: false,
    groupTitle: 'Example Docs',
    groupId: 'example',
    groupIcon: 'icon-beer',
    showSource: true,
    sections: [
        {
            id: "globals",
            title: "Globals",
            scripts: [
                "lib/scripts/docs/example/lib/utilities.js"
            ],
            docs: [],
            rank : {}
        },
        {
            id: "doctypes",
            title: "Documentation DocTypes",
            scripts: [
                "lib/scripts/docs/example/lib/doctypes_doc.js",
                "lib/scripts/docs/example/lib/doctypes_ngdoc.js"
            ],
            docs: [],
            rank : {}
        }
    ]
};