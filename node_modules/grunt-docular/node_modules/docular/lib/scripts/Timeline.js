

var Timeline = function () {


    /*============ PRIVATE VARIABLES AND METHODS ============*/

    var scope = {start:0, end:0};

    var currentRealTime = 0;
    var currentScopedTime = 0;

    var getScopedTime = function (time_in) {
        return time_in - scope.start;
    };


    /*============ PUBLIC METHODS ============*/

    var self = this;

    self.setRealTime = function (time_in) {
        currentRealTime = time_in;
        currentScopedTime = getScopedTime(time_in);
    };

    self.setCurrentTime = function (time_in) {
        currentScopedTime = time_in;
        currentRealTime = time_in + scope.start;
    };

    self.setCurrentTimePercent = function (percent_in) {
        var totalTime = percent_in * self.getTotalDuration();
        self.setRealTime(totalTime + scope.start);
    };

    self.setScope = function (start_in, end_in) {
        scope.start = start_in;
        scope.end = end_in;
    };


    self.getTotalDuration = function () {
        return scope.end - scope.start;
    };

    self.getCurrentTime = function () {
        return currentScopedTime;
    };

    self.getCurrentRealTime = function () {
        return currentRealTime;
    };

    self.getCurrentTimePercent = function () {
        return (currentScopedTime / self.getTotalDuration());
    };


    self.convertRealTime = function (time_in) {
        return time_in - scope.start;
    };

};