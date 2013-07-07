
//we will store the index page for this section in this file
/**
 * @doc overview
 * @id index
 * @name
 * @description
 * #Documentation DocType Examples
 *
 * Click through the links in the left navigation to explore how different docTypes from both the "@doc" and "@ngdoc" plugins render.
 *
 *
 */


//just so this looks like a valid js file we should include the global namespace
var doctypes_doc = {};


/**
 * @doc module
 * @name doctypes_doc
 * @description
 * This module houses example's of docTypes for the @doc documentation plugin. These docTypes are also
 * available within the @ngdoc documentation plugin as well as any other plugin.
 */


/**
 * @doc interface
 * @name doctypes_doc.class:doc_interface
 *
 * @property {number} legs The number of legs this doggy has
 * @property {number} eyes The number of eyes this doggy has
 * @property {boolean} sheds Does this doggy shed?
 *
 * @description
 * This is an example of an interface. Note, this style is similar to the `object` docType.
 *
 */
doctypes_doc.interface = {

    /**
     * @doc method
     * @methodOf doctypes_doc.class:doc_interface
     * @name doctypes_doc.class:doc_interface#eat
     * @description This method could have @param and @returns values as well
     */
    eat : function () {},

    /**
     * @doc method
     * @methodOf doctypes_doc.class:doc_interface
     * @name doctypes_doc.class:doc_interface#run
     * @description This method could have @param and @returns values as well
     */
    run : function () {},

    /**
     * @doc method
     * @methodOf doctypes_doc.class:doc_interface
     * @name doctypes_doc.class:doc_interface#speak
     * @description This method could have @param and @returns values as well
     */
    speak : function () {},

    /**
     * @doc method
     * @methodOf doctypes_doc.class:doc_interface
     * @name doctypes_doc.class:doc_interface#rollOver
     * @description This method could have @param and @returns values as well
     */
    rollOver : function () {},

    legs : 4,
    eyes : 2,
    sheds : true
};

/**
 * @doc method
 * @name doctypes_doc.class:doc_method
 * @param  {string} param1 Cool param1
 * @param  {string} param2 Cool param2
 * @param  {string} param3 Cool param3
 * @return {number} Counts the total lenght of all the strings
 * @description
 *
 * This example method returns the length of three strings passed in.
 *
 */
doctypes_doc.method = function (param1, param2, param3) {
    return param1.length + param2.length + parame3.length;
};

/**
 * @doc function
 * @name doctypes_doc.class:doc_function
 * @param  {string} param1 Cool param1
 * @param  {string} param2 Cool param2
 * @param  {string} param3 Cool param3
 * @return {number} Counts the total lenght of all the strings
 * @description
 *
 * This example method returns the length of three strings passed in.
 *
 */
doctypes_doc.function = function (param1, param2, param3) {
    return param1.length + param2.length + parame3.length;
};


/**
 * @doc object
 * @name doctypes_doc.class:doc_object
 *
 * @property {string} prop1 Some type of property
 * @property {number} prop2 Some type of sweet number
 * @property {function} prop3 some type of sweet property
 *
 * @description
 *
 * An object basically just has properties and methods.
 *
 */
doctypes_doc.object = {
    prop1: "booyah",
    prop2: 3,
    prop3: function() {}
};

/**
 * @doc object
 * @name doctypes_doc.global:doc_global
 * @description
 *
 * This is whatever you want as a global. It could have params, it could be a primitive.
 *
 */
doctypes_doc.global = {};