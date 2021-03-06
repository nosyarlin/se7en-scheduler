var db = require("../utils/dbconnection"); //reference to db connection

var TABLE_NAME = "users";
var COLUMN_ID = "id";
var COLUMN_NAME = "name";
var COLUMN_EMAIL = "email";
var COLUMN_PHONE = "phone";
var COLUMN_PASSWORD_HASH = "passwordHash";
var COLUMN_SALT = "salt";
var COLUMN_ADMIN = "pillar";
var COLUMN_SCHEDULES = "schedules";
var COLUMN_COURSES = "courses";

var User = {
	getAllUsers:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME, callback);
	},

	getUserByEmail:function(email, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_EMAIL +
						" =?", [email], callback);
	},

	getUserById:function(id, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_ID +
						" =?", [id], callback);
	},

	getUsersByIDs:function(ids, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_ID + 
						" IN " + ids, [], callback);
	},

	getUsersByPillar:function(pillar, callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_ADMIN +
						" =?", [pillar], callback);
	},

	getInstructors:function(callback) {
		return db.query("SELECT * FROM " + TABLE_NAME + " WHERE NOT " + COLUMN_ADMIN +
						" =?", ["Administrator"], callback);
	},

	createUser:function(name, email, phone, passwordHash, salt, admin, callback) {
		return db.query("INSERT INTO " + 
			TABLE_NAME + "(`" + 
			COLUMN_NAME + "`,`" +
			COLUMN_EMAIL + "`,`" +
			COLUMN_PHONE + "`,`" + 
			COLUMN_PASSWORD_HASH + "`,`" +
			COLUMN_SALT + "`,`" + 
			COLUMN_ADMIN + "`)" +  
			" VALUES(?,?,?,?,?,?)", 
			[name, email, phone, passwordHash, salt, admin],
			callback);
	},

	updatePassword:function(id, passwordHash, salt, callback){
		return db.query("UPDATE " + TABLE_NAME +
						" SET `" + COLUMN_PASSWORD_HASH +
						"` =?, `" + COLUMN_SALT +
						"` =? WHERE `" + COLUMN_ID +
						"` =?",
						[passwordHash, salt, id],
						callback);
	},

	addUserSchedule:function(instructors, schedule_id, course_id, callback) {
		var schedules;
		var courses;
		var row;

		var uniqueInstructors = new Set(instructors.split(/\D/));
		var ids = "(" + [...uniqueInstructors].toString() + ")";
		this.getUsersByIDs(ids, function(err, rows) {
			for (index in rows) {
				row = rows[index];

				// add new schedule to string of schedules
				if (row.schedules) {
					schedules = row.schedules.concat(",",schedule_id);
				} else {
					schedules = schedule_id;
				}
				
				// add new course to string of courses
				if (row.courses) {
					courses = row.courses.concat(",",course_id);
				} else {
					courses = course_id;
				}

				// schedules id should be unique
				var uniqueSchedules = new Set(schedules.split(/\D/));
				schedules = [...uniqueSchedules].join();

				// update database
				db.query("UPDATE " + TABLE_NAME +
						" SET `" + COLUMN_SCHEDULES +
						"` =?, `" + COLUMN_COURSES +
						"` =? WHERE `" + COLUMN_ID +
						"` =?",
						[schedules, courses, row.id],
						function(row_err, row_rows){
							if (row_err) {
								console.log(row_err);
							}
						});
			}
			callback(err, rows);
		});
	},

	deleteUserCourse:function(instructors, course_id, callback) {
		var indexToRemove;

		var uniqueInstructors = new Set(instructors.split(/\D/));
		var ids = "(" + [...uniqueInstructors].toString() + ")";
		this.getUsersByIDs(ids, function(err, rows) {
			for (index in rows) {
				row = rows[index];

				// remove course id
				if (row.courses) {
					courses = row.courses.split(/\D/);
					indexToRemove = courses.indexOf(course_id);
					courses.splice(indexToRemove, 1);
				}

				var newCourses = courses.join();

				// update database
				db.query("UPDATE " + TABLE_NAME + 
						 " SET `" + COLUMN_COURSES +
						 "` =? WHERE `" + COLUMN_ID +
						 "` =?",
						 [newCourses, row.id],
						 function(row_err, row_rows){
						 	if (row_err) {
						 		console.log(row_err);
						 	}
						 });
			}
			callback(err, rows);
		});
	}
};

module.exports=User;