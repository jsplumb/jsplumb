(function (require, exports) {

var Q = require("q");
var FS_BOOT = require("fs-boot");
var ROOT = require("./root");
var MOCK = require("./mock");

// TODO patternToRegExp
// TODO glob
// TODO match
// TODO copyTree

var concat = function (arrays) {
    return Array.prototype.concat.apply([], arrays);
};

exports.update = function (exports, workingDirectory) {

    for (var name in FS_BOOT)
        exports[name] = FS_BOOT[name];

    /**
     * @param {String} path
     * @param {Object} options
     * @returns {Promise * (String || Buffer)}
     */
    exports.read = function (path, flags, charset, options) {
        if (typeof flags == "object") {
            options = flags;
        } else {
            options = options || {};
            options.flags = flags;
            options.carset = charset;
        }
        options.flags = "r" + (options.flags || "").replace(/r/g, "");
        return Q.when(this.open(path, options), function (stream) {
            return stream.read();
        }, function (reason) {
            var error = new Error("Can't read " + path + " because " + reason.message);
            error.path = path;
            error.flags = flags;
            error.charset = charset;
            error.cause = reason;
            throw error;
        });
    };

    /**
     * @param {String} path
     * @param {String || Buffer} content
     * @param {Object} options
     * @returns {Promise * Undefined} a promise that resolves
     * when the writing is complete.
     */
    exports.write = function (path, content, flags, charset, options) {
        var self = this;
        if (typeof flags == "object") {
            options = flags;
        } else {
            options = options || {};
            options.flags = flags;
            options.carset = charset;
        }
        options.flags = "w" + (options.flags || "").replace(/w/g, "");
        return Q.when(self.open(path, options), function (stream) {
            return Q.when(stream.write(content), function () {
                return stream.close();
            });
        });
    };

    exports.append = function (path, content, flags, charset, options) {
        var self = this;
        if (typeof flags == "object") {
            options = flags;
        } else {
            options = options || {};
            options.flags = flags;
            options.carset = charset;
        }
        options.flags = "w+" + (options.flags || "").replace(/[w\+]/g, "");
        return Q.when(self.open(path, options), function (stream) {
            return Q.when(stream.write(content), function () {
                return stream.close();
            });
        });
    };

    exports.copy = function (source, target) {
        var self = this;
        return Q.spread([
            self.open(source, {flags: "rb"}),
            self.open(target, {flags: "wb"})
        ], function (reader, writer) {
            return Q.when(reader.forEach(function (block) {
                return writer.write(block);
            }), function () {
                return Q.all([
                    reader.close && reader.close(), // TODO fix q-io
                    writer.close()
                ]);
            });
        });
    };

    exports.copyTree = function (source, target) {
        var self = this;
        return Q.when(exports.stat(source), function (stat) {
            if (stat.isFile()) {
                return exports.copy(source, target);
            } else if (stat.isDirectory()) {
                return Q.when(exports.makeDirectory(target), function () {
                    return Q.when(exports.list(source), function (list) {
                        return Q.all(list.map(function (child) {
                            return exports.copyTree(
                                exports.join(source, child),
                                exports.join(target, child)
                            );
                        }));
                    });
                });
            } else if (stat.isSymbolicLink()) {
                return exports.symbolicCopy(source, target);
            }
        });
    };

    exports.listTree = function (basePath, guard) {
        var self = this;
        basePath = String(basePath || '');
        if (!basePath)
            basePath = ".";
        guard = guard || function () {
            return true;
        };
        var stat = self.stat(basePath);
        return Q.when(stat, function (stat) {
            var paths = [];
            var mode; // true:include, false:exclude, null:no-recur
            try {
                var include = guard(basePath, stat);
            } catch (exception) {
                return Q.reject(exception);
            }
            return Q.when(include, function (include) {
                if (include) {
                    paths.push([basePath]);
                }
                if (include !== null && stat.isDirectory()) {
                    return Q.when(self.list(basePath), function (children) {
                        paths.push.apply(paths, children.map(function (child) {
                            var path = self.join(basePath, child);
                            return self.listTree(path, guard);
                        }));
                        return paths;
                    });
                } else {
                    return paths;
                }
            });
        }, function noSuchFile(reason) {
            return [];
        }).then(Q.all).then(concat);
    };

    exports.listDirectoryTree = function (path) {
        return this.listTree(path, function (path, stat) {
            return stat.isDirectory();
        });
    };

    exports.makeTree = function (path, mode) {
        var self = this;
        var parts = self.split(path);
        var at = [];
        if (self.isAbsolute(path))
            at.push(self.ROOT);
        return parts.reduce(function (parent, part) {
            return Q.when(parent, function () {
                at.push(part);
                var parts = self.join(at);
                var made = self.makeDirectory(parts, mode);
                return Q.when(made, null, function rejected(reason) {
                    // throw away errors for already made directories
                    if (reason.code == "EEXIST" || reason.code == "EISDIR") {
                        return;
                    } else {
                        return Q.reject(reason);
                    }
                });
            });
        }, undefined);
    };

    exports.removeTree = function (path) {
        var self = this;
        return Q.when(self.stat(path), function (stat) {
            if (stat.isLink()) {
                return self.remove(path);
            } else if (stat.isDirectory()) {
                var list = self.list(path);
                return Q.when(list, function (list) {
                    // asynchronously remove every subtree
                    var done = list.reduce(function (prev, name) {
                        var child = self.join(path, name);
                        var next = self.removeTree(child);
                        // join next and prev
                        return Q.when(prev, function () {
                            return next;
                        });
                    });
                    return Q.when(done, function () {
                        self.removeDirectory(path);
                    });
                });
            } else {
                return self.remove(path);
            }
        });
    };

    exports.exists = function (path) {
        return Q.when(this.stat(path), function () {
            return true;
        }, function () {
            return false;
        });
    };

    exports.isFile = function (path) {
        return Q.when(this.stat(path), function (stat) {
            return stat.isFile();
        }, function (reason) {
            return false;
        });
    };

    exports.isDirectory = function (path) {
        return Q.when(this.stat(path), function (stat) {
            return stat.isDirectory();
        }, function (reason) {
            return false;
        });
    };

    exports.absolute = function (path) {
        if (this.isAbsolute(path))
            return path;
        return this.join(workingDirectory(), path);
    };

    exports.relative = function (source, target) {
        var self = this;
        return Q.when(this.isDirectory(source), function (isDirectory) {
            if (isDirectory) {
                return self.relativeFromDirectory(source, target);
            } else {
                return self.relativeFromFile(source, target);
            }
        });
    };

    exports.relativeFromFile = function (source, target) {
        var self = this;
        source = self.absolute(source);
        target = self.absolute(target);
        source = source.split(self.SEPARATORS_RE());
        target = target.split(self.SEPARATORS_RE());
        source.pop();
        while (
            source.length &&
            target.length &&
            target[0] == source[0]
        ) {
            source.shift();
            target.shift();
        }
        while (source.length) {
            source.shift();
            target.unshift("..");
        }
        return target.join(self.SEPARATOR);
    };

    exports.relativeFromDirectory = function (source, target) {
        if (!target) {
            target = source;
            source = workingDirectory();
        }
        source = this.absolute(source);
        target = this.absolute(target);
        source = source.split(this.SEPARATORS_RE());
        target = target.split(this.SEPARATORS_RE());
        if (source.length === 2 && source[1] === "")
            source.pop();
        while (
            source.length &&
            target.length &&
            target[0] == source[0]
        ) {
            source.shift();
            target.shift();
        }
        while (source.length) {
            source.shift();
            target.unshift("..");
        }
        return target.join(this.SEPARATOR);
    };

    exports.contains = function (parent, child) {
        var i, ii;
        parent = this.absolute(parent);
        child = this.absolute(child);
        parent = parent.split(this.SEPARATORS_RE());
        child = child.split(this.SEPARATORS_RE());
        if (parent.length === 2 && parent[1] === "")
            parent.pop();
        if (parent.length > child.length)
            return false;
        for (i = 0, ii = parent.length; i < ii; i++) {
            if (parent[i] !== child[i])
                break;
        }
        return i == ii;
    };

    exports.reroot = reroot;
    function reroot(path) {
        var self = this;
        path = path || this.ROOT;
        return Q.when(this.list(path), function (list) {
            if (list.length !== 1)
                return ROOT.Fs(self, path);
            var nextPath = self.join(path, list[0]);
            return Q.when(self.stat(nextPath), function (stat) {
                if (stat.isDirectory()) {
                    return reroot(nextPath);
                } else {
                    return ROOT.Fs(self, path);
                }
            });
        });
    }

    exports.toObject = function (path) {
        var self = this;
        var list = self.listTree(path || "", function (path, stat) {
            return stat.isFile();
        });
        return Q.when(list, function (list) {
            var tree = {};
            return Q.all(list.map(function (path) {
                return Q.when(self.read(path, "rb"), function (content) {
                    tree[path] = content;
                });
            })).then(function () {
                return tree;
            });
        });
    };

    exports.merge = function (fss) {
        var tree = {};
        var done;
        fss.forEach(function (fs) {
            done = Q.when(done, function () {
                return fs.listTree("", function (path, stat) {
                    return stat.isFile();
                })
                .then(function (list) {
                    return Q.all(list.map(function (path) {
                        return Q.when(fs.read(path, "rb"), function (content) {
                            tree[path] = content;
                        });
                    }));
                });
            });
        })
        return Q.when(done, function () {
            return MOCK.Fs(tree);
        });
    };

    var Stats = exports.Stats = function (nodeStat) {
        this.node = nodeStat;
    };

    var stats = [
        "isDirectory",
        "isFile",
        "isBlockDevice",
        "isCharacterDevice",
        "isSymbolicLink",
        "isFIFO",
        "isSocket"
    ];

    stats.forEach(function (name) {
        Stats.prototype[name] = function () {
            return this.node[name]();
        };
    });

    Stats.prototype.lastModified = function () {
        return Date.parse(this.node.mtime);
    };

    Stats.prototype.lastAccessed = function () {
        return Date.parse(this.node.atime);
    };

}

}).apply(null, typeof exports !== "undefined" ?
    [require, exports] :
    [
        function (id) {
            id = id.toUpperCase()
                .replace(".", "Q_FS")
                .replace("/", "$")
                .replace("-", "_");
            return window[id] = window[id] || {};
        },
        Q_FS$COMMON = {}
    ]
)
