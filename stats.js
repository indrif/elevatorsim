define(["underscore"], function(_) {
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
            var minWaited = _.min(_.map(travelers, function(item) {
                return item.waited;
            }));
            var maxWaited = _.max(_.map(travelers, function(item) {
                return item.waited;
            }));
            var minGoing = _.min(_.map(travelers, function(item) {
                return item.going;
            }));
            var maxGoing = _.max(_.map(travelers, function(item) {
                return item.going;
            }));
            logger.log("STATS");
            logger.log("Min wait time: " + minWaited + " Max wait time: " + maxWaited);
            logger.log("Min going time: " + minGoing + " Max going time: " + maxGoing);
            logger.log("Number of ticks: " + timeline.length);
            logger.log("");
            logger.success(JSON.stringify(timeline));
        };
    };
});
