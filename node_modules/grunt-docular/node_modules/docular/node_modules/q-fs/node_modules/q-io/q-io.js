
/**
 * Q Promise IO streams for Node
 * @module
 */

var Q = require("q"); // q package

/*whatsupdoc*/

/**
 * Wraps a Node readable stream, providing an API similar
 * to a Narwhal synchronous `io` stream except returning
 * Q promises for long latency operations.
 * @param stream any Node readable stream
 * @returns {Promise * Reader} a promise for
 * the text stream reader.
 * @constructor
 */
exports.Reader = function (_stream, charset) {
    var self = Object.create(exports.Reader.prototype);

    if (charset && _stream.setEncoding) // TODO complain about inconsistency
        _stream.setEncoding(charset);

    var begin = Q.defer();
    var end = Q.defer();

    // prevent indefinite buffering; resume on demand
    //_stream.pause();

    _stream.on("error", function (reason) {
        begin.reject(reason);
    });

    var chunks = [];
    var receiver;

    _stream.on("end", function () {
        begin.resolve(self);
        end.resolve()
    });

    _stream.on("data", function (chunk) {
        begin.resolve(self);
        if (receiver) {
            receiver(chunk);
        } else {
            chunks.push(chunk);
        }
    });

    function slurp() {
        var result;
        if (charset) {
            result = chunks.join("");
        } else {
            result = join(chunks);
        }
        chunks.splice(0, chunks.length);
        return result;
    }

    /***
     * Reads all of the remaining data from the stream.
     * @returns {Promise * String} a promise for a String
     * containing the entirety the remaining stream.
     */
    self.read = function () {
        receiver = undefined;
        //_stream.resume();
        var deferred = Q.defer();
        Q.done(end.promise, function () {
            deferred.resolve(slurp());
        });
        return deferred.promise;
    };

    /***
     * Reads and writes all of the remaining data from the
     * stream in chunks.
     * @param {Function(Promise * String)} write a function
     * to be called on each chunk of input from this stream.
     * @returns {Promise * Undefined} a promise that will
     * be resolved when the input is depleted.
     */
    self.forEach = function (write) {
        //_stream.resume();
        if (chunks && chunks.length)
            write(slurp());
        receiver = write;
        return Q.when(end.promise, function () {
            receiver = undefined;
        });
    };

    self.close = function () {
        _stream.close();
    };

    return begin.promise;
};

/**
 * Wraps a Node writable stream, providing an API similar to
 * Narwhal's synchronous `io` streams, except returning and
 * accepting promises for long-latency operations.
 *
 * @param stream any Node writable stream
 * @returns {Promise * Writer} a promise for the
 * text writer.
 */
exports.Writer = function (_stream, charset) {
    var self = Object.create(exports.Writer.prototype);

    if (charset && _stream.setEncoding) // TODO complain about inconsistency
        _stream.setEncoding(charset);

    var begin = Q.defer();
    var drained = Q.defer();

    _stream.on("error", function (reason) {
        begin.reject(reason);
    });

    _stream.on("drain", function () {
        begin.resolve(self);
        drained.resolve();
        drained = Q.defer();
    });

    /***
     * Writes content to the stream.
     * @param {String} content
     * @returns {Promise * Undefined} a promise that will
     * be resolved when the buffer is empty, meaning
     * that all of the content has been sent.
     */
    self.write = function (content) {
        if (!_stream.writeable && !_stream.writable)
            return Q.reject(new Error("Can't write to non-writable (possibly closed) stream"));
        if (!_stream.write(content)) {
            return drained.promise;
        } else {
            return Q.resolve();
        }
    };

    /***
     * Waits for all data to flush on the stream.
     *
     * @returns {Promise * Undefined} a promise that will
     * be resolved when the buffer is empty
     */
    self.flush = function () {
        return drained.promise;
    };

    /***
     * Closes the stream, waiting for the internal buffer
     * to flush.
     *
     * @returns {Promise * Undefined} a promise that will
     * be resolved when the stream has finished writing,
     * flushing, and closed.
     */
    self.close = function () {
        _stream.end();
        drained.resolve(); // we will get no further drain events
        return Q.resolve(); // closing not explicitly observable
    };

    /***
     * Terminates writing on a stream, closing before
     * the internal buffer drains.
     *
     * @returns {Promise * Undefined} a promise that will
     * be resolved when the stream has finished closing.
     */
    self.destroy = function () {
        _stream.destroy();
        drained.resolve(); // we will get no further drain events
        return Q.resolve(); // destruction not explicitly observable
    };

    return Q.resolve(self); // todo returns the begin.promise
};

exports.join = join;
function join(buffers) {
    var length = 0;
    var at;
    var i;
    var ii = buffers.length;
    var buffer;
    var result;
    for (i = 0; i < ii; i++) {
        buffer = buffers[i];
        length += buffer.length;
    }
    result = new Buffer(length);
    at = 0;
    for (i = 0; i < ii; i++) {
        buffer = buffers[i];
        buffer.copy(result, at, 0);
        at += buffer.length;
    }
    buffers.splice(0, ii, result);
    return result;
}

/*
    Reads an entire forEachable stream of buffers and returns a single buffer.
*/
exports.read = read;
function read(stream, charset) {
    var chunks = [];
    stream.forEach(function (chunk) {
        chunks.push(chunk);
    });
    if (charset) {
        return chunks.join("");
    } else {
        return join(chunks);
    }
}

