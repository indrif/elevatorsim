var _ = require("underscore");

function Stats(options) {
    var timeline = [];
    var travelers = [];
    var self = this;

    var mean = function(samples) {
        return _.reduce(samples, function(memo, num) {
            return memo + num;
        }, 0) / samples.length;
    };

    var variance = function(samples) {
        var m = mean(samples);
        return _.reduce(samples, function(memo, num) {
            return memo + Math.pow(num - m, 2);
        }, 0) / samples.length;
    };

    var stddev = function(samples) {
        return Math.sqrt(variance(samples));
    };

    var getWaitTimes = function() {
        return _.map(travelers, function(item) {
            return item.waited;
        });
    };

    var getTravellingTimes = function() {
        return _.map(travelers, function(item) {
            return item.going;
        });
    };

    this.onTick = function(systemState) {
        timeline.push(systemState);
    };

    this.onTravelerUnloaded = function(traveler) {
        travelers.push({
            id: traveler.getId(),
            from: traveler.getFromFloor(),
            to: traveler.getToFloor(),
            waited: traveler.getWaitedTime(),
            going: traveler.getGoingTime()
        });
    };

    this.getResult = function() {
        var waitTimes = getWaitTimes();
        var travellingTimes = getTravellingTimes();
        return {
            stats: {
                waiting: {
                    min: _.min(waitTimes),
                    max: _.max(waitTimes),
                    mean: mean(waitTimes),
                    variance: variance(waitTimes),
                    stddev: stddev(waitTimes)
                },
                travelling: {
                    min: _.min(travellingTimes),
                    max: _.max(travellingTimes),
                    mean: mean(travellingTimes),
                    variance: variance(travellingTimes),
                    stddev: stddev(travellingTimes)
                }
            },
            timeline: timeline
        };
    };
}

exports = module.exports = Stats;
