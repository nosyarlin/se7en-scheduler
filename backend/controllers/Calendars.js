var express = require("express");
var Calendar = require("../models/Calendar");
var utils = require("../utils/utilities");
var router = express.Router();

// defining create event route
router.post('/', function(req, res, next) {
	// Check if necessary keys are there
	if (utils.compareJSONKeys(req.body, Calendar.createStructure)) {
		// Create event
		Calendar.createEvent(req.body, function(err, count) {
			utils.basicPostCallback(res, err, count);
		});
	} else {
		res.json({"success":false, "message":"post params incomplete"});
	}
});

// defining get event by schedule id route
router.get('/:id(\\d+)', function(req, res, next) {
	if (req.params.id) {
		Calendar.getEventsByScheduleId(req.params.id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining get event by prof_id route
router.get('/Prof/:id(\\d+)/:prof_id(\\d+)', function(req, res, next) {
	if (req.params.id && req.params.prof_id) {
		Calendar.getEventsByProfId(req.params.id, req.params.prof_id, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining get event by pillar route
router.get('/Pillar/:id(\\d+)/:pillar([A-Z]+)', function(req, res, next) {
	if (req.params.id && req.params.pillar) {
		Calendar.getEventsByPillar(req.params.id, req.params.pillar, function(err, rows) {
			utils.basicGetCallback(res, err, rows, null);
		});
	}
});

// defining filter route
router.get('/Filter/?:day(\\d)?/?:sDate(\\d{4}-\\d{2}-\\d{2})?/?:eDate(\\d{4}-\\d{2}-\\d{2})?/?:sTime(\\d{1,2})?/?:eTime(\\d{1,2})?', function(req, res, next) {
	console.log(req.params);
	Calendar.filterTimeSlots(req.params, function(err, rows) {
		if (err) {
			err.success = false;
			res.json(err);
		} else {
			var todaysDate = new Date();
			var todaysDay = todaysDate.getDay()%6;
			var num_weeks = 5;

			// create five weeks of possible timings
			var available = []
			for (var week = 0; week < num_weeks; week++) {
				// creating a week of possible timings
				var weekdays = [];
				for (var day = 0; day < 5; day++) {
					var hours = [];
					for (var hour = 1; hour < 20; hour++) {
						hours.push(hour);
					}
					weekdays.push(hours);
				}
				available.push(weekdays);
			}

			// remove unavailable timings
			for (var i = 0; i < rows.length; i++) {
				var j = rows[i].start
				while (j < rows[i].end) {
					// go through week by week
					for (var week = 0; week < num_weeks; week++) {
						var index = available[week][rows[i].day-1].indexOf(j);	
						if (index != -1) {
							available[week][rows[i].day-1].splice(index, 1);
						}
					}	
					j++;
				}
			}

			// remove based on today's day
			available[0].splice(0,todaysDay);

			res.json(available);
		}
	});
})

module.exports = router;