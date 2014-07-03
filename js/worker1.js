this.onmessage = function(e) {
	switch (e.data.state) {
		case "waiting":
			if ((e.data.travelersOutside.length > 0 && e.data.travelersOutside[0] == e.data.floor) || 
				(e.data.travelersInside.length > 0 && e.data.travelersInside[0] == e.data.floor)) {
				openClose();
				return;
			}
			console.log("Anyone in queue?");
			if (e.data.travelersInside.length > 0) {
				gotoFloor(e.data.travelersInside[0]);
				return;
			}
			break;
	}
}

function gotoFloor(floor) {
	postMessage({
		action: "goto",
		floor: floor
	});
}

function openClose() {
	postMessage({
		action: "openclose"
	});
}
