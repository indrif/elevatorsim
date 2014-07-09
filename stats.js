define(["underscore"], function(_) {
    function mean(samples) {
        return _.reduce(samples, function(memo, num) {
            return memo + num;
        }, 0) / samples.length;
    }

    function variance(samples) {
        var m = mean(samples);
        return _.reduce(samples, function(memo, num) {
            return memo + Math.pow(num - m, 2);
        }, 0) / samples.length;
    }

    function stddev(samples) {
        return Math.sqrt(variance(samples));
    }

    return function(logger, options) {
        var timeline = [];
        var travelers = [];
        var self = this;

        logger.log("Stats collection enabled");

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

        this.onEnd = function() {
            //console.info(JSON.stringify(timeline));
            var waited = _.map(travelers, function(item) {
                return item.waited;
            });
            var going = _.map(travelers, function(item) {
                return item.going;
            });
            logger.log("");
            logger.log("Wait time");
            logger.log("=========");
            logger.log("Min: " + _.min(waited) + ", max: " + _.max(waited));
            logger.log("Mean: " + mean(waited) + ", variance: " + variance(waited) + ", stddev: " + stddev(waited));
            logger.log("");
            logger.log("Going time");
            logger.log("=========");
            logger.log("Min: " + _.min(going) + ", max: " + _.max(going));
            logger.log("Mean: " + mean(going) + ", variance: " + variance(going) + ", stddev: " + stddev(going));
            logger.log("");
            logger.log("Number of ticks: " + timeline.length);
            logger.log("");
            logger.success(JSON.stringify(timeline));
        };
    };
});
