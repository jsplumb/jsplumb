/**
 * An asynchronous local file system API, based on a subset
 * of the `narwhal/fs` API and the `narwhal/promise` API,
 * such that the method names are the same but some return
 * values are promises instead of fully resolved values.
 * @module
 */

/*whatsupdoc*/

var FS = require("fs"); // node
var Q = require("q");
var IO = require("q-io");
var COMMON = require("./common");
var MOCK = require("./mock");
var ROOT = require("./root");

COMMON.update(exports, process.cwd);
exports.Mock = MOCK.Fs;
exports.mock = MOCK.mock;
exports.Root = ROOT.Fs;

// facilitates AIMD (additive increase, multiplicative decrease) for backing off
var backOffDelay = 0;
var backOffFactor = 1.0001;
function dampen(wrapped, thisp) {
    var retry = function () {
        var args = arguments;
        var ready = backOffDelay ? Q.delay(backOffDelay) : Q.resolve();
        return ready.then(function () {
            return Q.when(wrapped.apply(thisp, args), function (stream) {
                backOffDelay = Math.max(0, backOffDelay - 1);
                return stream;
            }, function (error) {
                if (error.code === "EMFILE") {
                    backOffDelay = (backOffDelay + 1) * backOffFactor;
                    return retry.apply(null, args);
                } else {
                    throw error;
                }
            });
        });
    };
    return retry;
}

/**
 * @param {String} path
 * @param {Object} options (flags, mode, bufferSize, charset, begin, end)
 * @returns {Promise * Stream} a stream from the `q-io` module.
 */
exports.open = dampen(function (path, flags, charset, options) {
    var self = this;
    if (typeof flags == "object") {
        options = flags;
        flags = options.flags;
        charset = options.charset;
    }
    options = options || {};
    flags = flags || "r";
    var nodeOptions = {
        "flags": flags.replace(/b/g, "")
    };
    if ("bufferSize" in options) {
        nodeOptions.bufferSize = options.bufferSize;
    }
    if ("mode" in options) {
        nodeOptions.mode = options.mode;
    }
    if ("begin" in options) {
        nodeOptions.start = options.begin;
        nodeOptions.end = options.end - 1;
    }
    if (flags.indexOf("b") >= 0) {
        if (charset) {
            throw new Error("Can't open a binary file with a charset: " + charset);
        }
    }
    if (flags.indexOf("w") >= 0) {
        var stream = FS.createWriteStream(String(path), nodeOptions);
        return IO.Writer(stream, charset);
    } else {
        var stream = FS.createReadStream(String(path), nodeOptions);
        return IO.Reader(stream, charset);
    }
});

exports.remove = function (path) {
    path = String(path);
    var done = Q.defer();
    FS.unlink(path, function (error) {
        if (error) {
            error.message = "Can't remove " + JSON.stringify(path) + ": " + error.message;
            done.reject(error);
        } else {
            done.resolve();
        }
    });
    return done.promise;
};

exports.makeDirectory = function (path, mode) {
    path = String(path);
    var done = Q.defer();
    mode = mode === undefined ? parseInt('755', 8) : mode;
    FS.mkdir(path, mode, function (error) {
        if (error) {
            error.message = "Can't makeDirectory " + JSON.stringify(path) + " with mode " + mode + ": " + error.message;
            done.reject(error);
        } else {
            done.resolve();
        }
    });
    return done.promise;
};

exports.removeDirectory = function (path) {
    path = String(path);
    var done = Q.defer();
    FS.rmdir(path, function (error) {
        if (error) {
            error.message = "Can't removeDirectory " + JSON.stringify(path) + ": " + error.message;
            done.reject(error);
        } else {
            done.resolve();
        }
    });
    return done.promise;
};

/**
 */
exports.list = dampen(function (path) {
    path = String(path);
    var result = Q.defer();
    FS.readdir(path, function (error, list) {
        if (error) {
            error.message = "Can't list " + JSON.stringify(path) + ": " + error.message;
            return result.reject(error);
        } else {
            result.resolve(list);
        }
    });
    return result.promise;
});

/**
 * @param {String} path
 * @returns {Promise * Stat}
 */
exports.stat = function (path) {
    var self = this;
    path = String(path);
    var done = Q.defer();
    try {
        FS.stat(path, function (error, stat) {
            if (error) {
                error.message = "Can't stat " + JSON.stringify(path) + ": " + error;
                done.reject(error);
            } else {
                done.resolve(new self.Stats(stat));
            }
        });
    } catch (error) {
        done.reject(error);
    }
    return done.promise;
};

exports.statLink = function (path) {
    path = String(path);
    var done = Q.defer();
    try {
        FS.lstat(path, function (error, stat) {
            if (error) {
                error.message = "Can't statLink " + JSON.stringify(path) + ": " + error.message;
                done.reject(error);
            } else {
                done.resolve(stat);
            }
        });
    } catch (error) {
        done.reject(error);
    }
    return done.promise;
};

exports.statFd = function (fd) {
    fd = Number(fd);
    var done = Q.defer();
    try {
        FS.fstat(fd, function (error, stat) {
            if (error) {
                error.message = "Can't statFd file descriptor " + JSON.stringify(fd) + ": " + error.message;
                done.reject(error);
            } else {
                done.resolve(stat);
            }
        });
    } catch (error) {
        done.reject(error);
    }
    return done.promise;
};

exports.link = function (source, target) {
    source = String(source);
    target = String(target);
    var done = Q.defer();
    try {
        FS.link(source, target, function (error) {
            if (error) {
                error.message = "Can't link " + JSON.stringify(source) + " to " + JSON.stringify(target) + ": " + error.message;
                done.reject(error);
            } else {
                done.resolve();
            }
        });
    } catch (error) {
        done.reject(error);
    }
    return done.promise;
};

exports.symbolicLink = function (target, relative, type) {
    type = type || 'file';
    if (type === 'directory') {
        type = 'dir';
    }
    target = String(target);
    relative = String(relative);
    var done = Q.defer();
    try {
        FS.symlink(relative, target, type || 'file', function (error) {
            if (error) {
                error.message = "Can't create symbolicLink " + JSON.stringify(target) + " to relative location " + JSON.stringify(relative) + ": " + error.message;
                done.reject(error);
            } else {
                done.resolve();
            }
        });
    } catch (error) {
        done.reject(error);
    }
    return done.promise;
};

exports.symbolicCopy = function (source, target) {
    return Q.when(exports.relative(target, source), function (relative) {
        return exports.symbolicLink(target, relative, "file");
    });
};

exports.chown = function (path, uid, gid) {
    path = String(path);
    var done = Q.defer();
    try {
        FS.chown(path, uid, gid, function (error) {
            if (error) {
                error.message = "Can't chown (change owner) of " + JSON.stringify(path) + " to user " + JSON.stringify(uid) + " and group " + JSON.stringify(gid) + ": " + error.message;
                done.reject(error);
            } else {
                done.resolve();
            }
        });
    } catch (error) {
        done.reject(error);
    }
    return done.promise;
};

exports.chmod = function (path, mode) {
    path = String(path);
    mode = String(mode);
    var done = Q.defer();
    try {
        FS.chmod(path, mode, function (error) {
            if (error) {
                error.message = "Can't chmod (change permissions mode) of " + JSON.stringify(path) + " to (octal number) " + mode.toString(8) + ": " + error.message;
                done.reject(error);
            } else {
                done.resolve();
            }
        });
    } catch (error) {
        done.reject(error);
    }
    return done.promise;
};

exports.lastModified = function (path) {
    return exports.stat(path).get('mtime').then(Date.parse);
};

exports.lastAccessed = function (path) {
    return exports.stat(path).get('atime').then(Date.parse);
};

exports.canonical = function (path) {
    var result = Q.defer();
    FS.realpath(path, function (error, canonicalPath) {
        if (error) {
            error.message = "Can't get canonical path of " + JSON.stringify(path) + " by way of C realpath: " + error.message;
            result.reject(error);
        } else {
            result.resolve(canonicalPath);
        }
    });
    return result.promise;
};

exports.readLink = function (path) {
    var result = Q.defer();
    FS.readlink(path, function (error, path) {
        if (error) {
            error.message = "Can't get link from " + JSON.stringify(path) + " by way of C readlink: " + error.message;
            result.reject(error);
        } else {
            result.resolve(path);
        }
    });
    return result.promise;
};

