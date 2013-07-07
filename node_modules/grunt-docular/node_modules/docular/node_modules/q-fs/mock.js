(function (require, exports) {

var Q = require("q");
var BOOT = require("fs-boot");
var FS = require("./q-fs");
var COMMON = require("./common");

var Fs = exports.Fs = function (files) {
    var fs = Object.create(BOOT);
    var root = {};
    var now = new Date();

    function init() {
        // construct a file tree
        Object.keys(files).forEach(function (path) {
            var content = files[path];
            find(root, path).set(content);
        });
    }

    function find(at, path) {
        path = fs.absolute(path);
        if (path === "" || path === FS.ROOT) {
            return Node(function get() {
                return root;
            }, function set(content) {
                root = content;
            });
        }
        var parts = FS.split(path);
        var empty = parts.shift();
        if (empty !== "")
            throw new Error("assertion: first component of root should be empty");
        var i, ii;
        var manifest = function () {};
        for (i = 0, ii = parts.length - 1; i < ii; i++) {
            var part = parts[i];
            if (part === ".") {
                continue;
            } if (typeof at[part] !== "object") {
                manifest = (function (on, part, manifest) {
                    var created = {};
                    at = created;
                    return function () {
                        on[part] = created;
                        manifest();
                    };
                })(at, part, manifest);
            } else {
                at = at[part];
            }
        }
        var leaf = parts[i];
        return Node(function get() {
            return at[leaf];
        }, function set(content) {
            manifest();
            at[leaf] = content;
        });
    }

    fs.list = function (path) {
        path = String(path);
        return Q.when(fs.stat(path), function (stat) {
            if (!stat.isDirectory())
                throw new Error("Can't list non-directory " + path);
            var node = find(root, path).get();
            return Object.keys(node);
        });
    };

    fs.open = function (path, flags, charset, options) {
        if (typeof flags == "object") {
            options = flags;
            flags = options.flags;
            charset = options.charset;
        } else {
            options = options || {};
        }
        var node = find(root, path);
        // TODO create an actual open file object, rather
        // than this rather primitive duck
        flags = flags || "r";
        var binary = flags.indexOf("b") >= 0;
        charset = charset || "utf-8";
        if (flags.indexOf("w") === -1) {
            return fs.stat(path).post("isFile")
            .then(function (isFile) {
                if (!isFile) {
                    throw new Error("Can't open non-file " + path);
                }
                return {
                    "read": function () {
                        var content = node.get();
                        if (!binary)
                            content = content.toString(charset);
                        return content;
                    }
                };
            });
        } else {
            throw new Error("Can't open files for writing in read-only mock file system");
        }
    };

    fs.stat = function (path) {
        var stat = find(root, path);
        if (stat.get() === undefined)
            return Q.reject(new Error("No such file: " + path));
        return Q.resolve(stat);
    };

    fs.getNode = function (path) {
        path = path || "";
        return find(root, path).get();
    };

    fs.canonical = function (path) {
        return fs.normal(path);
    };

    var Node = function (get, set) {
        var self = Object.create(Node.prototype);
        self.get = get;
        self.set = set;
        return self;
    };

    Node.prototype = Object.create(GenericNode.prototype);

    Node.prototype.constructor = Node;

    Node.prototype.lastModified = function () {
        return now;
    };

    COMMON.update(fs, function () {
        return fs.ROOT;
    });

    init();

    return fs;
};

var GenericNode = function () {};

GenericNode.prototype.exists = function () {
    var node = this.get();
    return typeof node !== "undefined";
};

GenericNode.prototype.isFile = function () {
    var node = this.get();
    return typeof node !== "undefined" && (
        typeof node !== "object" ||
        node.constructor !== Object
    );
};

GenericNode.prototype.isDirectory = function () {
    var node = this.get();
    return (
        typeof node === "object" &&
        node.constructor === Object
    )
};

exports.mock = function (fs, root) {
    return Q.when(fs.listTree(root), function (list) {
        var tree = {};
        return Q.all(list.map(function (path) {
            var actual = fs.join(root, path);
            var relative = fs.relativeFromDirectory(root, actual);
            return Q.when(fs.stat(actual), function (stat) {
                if (stat.isFile()) {
                    return Q.when(fs.read(path, "rb"), function (content) {
                        tree[relative] = content;
                    });
                }
            });
        })).then(function () {
            return Fs(tree);
        });
    });
};

}).apply(null, typeof exports !== "undefined" ?
    [require, exports] :
    [
        function (id) {
            id = id.toUpperCase()
                .replace(".", "Q_FS")
                .replace("/", "$")
                .replace("-", "_");
            return window[id];
        },
        Q_FS$MOCK
    ]
)
