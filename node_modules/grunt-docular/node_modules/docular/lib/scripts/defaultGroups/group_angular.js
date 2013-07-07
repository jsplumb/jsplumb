exports.config = {
    groupTitle: 'Angular', //this is what will show up in the UI for this group
    groupId: 'angular', //to determine what directory these docs will go into and used as an identifier
    groupIcon: 'icon-book', //icon to use when relevant and within this group of documentation
    descr: 'Description', //@todo figure out how to use this?
    sections: [
        {
            id: "api",
            title:"Angular API",
            scripts: ["lib/angular/js"],
            docs: ["lib/angular/ngdocs/api"]
        },
        {
            id: "guide",
            title: "Developers Guide",
            docs: ["lib/angular/ngdocs/guide"]
        },
        {
            id: "tutorial",
            title: "Tutorial",
            docs: ["lib/angular/ngdocs/tutorial"]
        },
        {
            id: "misc",
            title: "Overview",
            docs: ["lib/angular/ngdocs/misc"]
        }
    ]
};