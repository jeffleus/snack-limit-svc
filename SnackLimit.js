'use strict';
var Sequelize = require('sequelize');
var Config = require('./Config')();
var sequelize = new Sequelize('FuelStation_VCU', Config.username, Config.password, {
	host: 'callsheet-mysql.cn6x6nhayn9c.us-west-2.rds.amazonaws.com',
	port: 3306,
    pool: {
        max: 10,
        min: 1,
        idle: 100
    }
});

var SnackLimit = sequelize.define('snacklimit', {
  SnackLimitID: { 
	  type: Sequelize.INTEGER, 
	  primaryKey: true, 
      autoincrement: true, 
	  field: 'SnackLimitID' 
  }, 
//  SportCode: { type: Sequelize.INTEGER, field: 'SportCodeId' },
  dayUniqueLimit: { type: Sequelize.INTEGER, INTEGER: 'DayUniqueLimit' }, 
  dayPreLimit: { type: Sequelize.INTEGER, INTEGER: 'DayPreLimit' }, 
  dayPostLimit: { type: Sequelize.INTEGER, INTEGER: 'DayPostLimit' }, 
  dayFBShakeLimit: { type: Sequelize.INTEGER, INTEGER: 'DayFBShakeLimit' }, 
  dayStaffLimit: { type: Sequelize.INTEGER, INTEGER: 'DayStaffLimit' }, 
  daySnackLimit: { type: Sequelize.INTEGER, INTEGER: 'DaySnackLimit' }, 
  monthSnackLimit: { type: Sequelize.INTEGER, field: 'MonthSnackLimit' }
}, {
	tableName: 'SnackLimits'
});

var Athlete = sequelize.define('athlete', {
  AthleteID: { 
	  type: Sequelize.INTEGER, 
	  primaryKey: true, 
	  autoincrement: true, 
	  field: 'StudentSportID' 
  }, 
  firstName: { type: Sequelize.STRING, field: 'firstname' }, 
  lastName: { type: Sequelize.STRING, field: 'lastname' }, 
  schoolid: { type: Sequelize.STRING, field: 'schoolsidnumber' },
  sportCode: { type: Sequelize.STRING, field: 'SportCodeID' }
}, {
	tableName: 'StudentSport'
});

var moduleName = "SNACKLIMIT:";

var Sport = sequelize.define('sport', {
  SportCodeID: { 
	  type: Sequelize.STRING, 
	  primaryKey: true, 
	  field: 'SportCodeID' 
  }, 
  description: { type: Sequelize.STRING, field: 'sportDescription' }, 
  inSeasonStart: { type: Sequelize.DATE, field: 'InSeasonStartDate' }, 
  inSeasonEnd: { type: Sequelize.DATE, field: 'InSeasonEndDate' },
  offSeasonStart: { type: Sequelize.DATE, field: 'OffSeasonStartDate' }, 
  offSeasonEnd: { type: Sequelize.DATE, field: 'OffSeasonEndDate' },
}, {
	tableName: 'SportCodes'
});
console.info(moduleName, ' create Sport hasMany SnackLimit association');
Sport.hasMany(SnackLimit, {as: 'SnackLimits', foreignKey: 'SportCodeID'});
SnackLimit.belongsTo(Sport, {as: 'Sport', foreignKey: 'SportCodeID'});

module.exports.get = function(id,filter) {
    if (!id) return list(filter);
//    console.log(moduleName, 'calling getSingle with id: ' + id);
//    var options = {
//        where: { SnackLimitID: id },
//        include: [ {model: Sport, as: 'Sport'} ]
//    };
//    return sequelize.sync().then(function() {
//        return SnackLimit.findOne(options).then(function(snacklimit) {
//            console.info(moduleName, 'snacklimit record found');
//            return {
//                count: (snacklimit)?1:0,
//                snacklimits: [ (snacklimit)?snacklimit.get({plain:true}):null ]
//            };
//        })
//    });
	return teamLimit(id);
}

function teamLimit(id) {
    console.log(moduleName, 'calling team lookup by sportCode');
	//first set the schoolid of the student to find
    var options = {
        where: { schoolid: id }
    };
	//then, run first query to get the athlete record
    return sequelize.sync().then(function() {
        return Athlete.findOne(options).then(function(athlete) {
			//chk to makes sure an athlete was found before proceeding
			if (!athlete) {
				throw new Error('Athlete record was not found for: ' + id);
			}
			//use the sportCode of the athlete to start a new query
            var filterOption = {
                where: {
                    SportCodeID: athlete.sportCode 
                },
                include: [ {model: Sport, as: 'Sport'} ]
            };
			//now, run the second query against the limits for the athlete's sport
			return SnackLimit.findOne(filterOption).then(function(snacklimit) {
				console.info(moduleName, 'snacklimit record found');
				return {
					count: (snacklimit)?1:0,
					snacklimits: [ (snacklimit)?snacklimit.get({plain:true}):null ]
				};
			});
		});
	});
}

function list(filter) {
    console.log(moduleName, 'calling getAll because no id provided');
	return sequelize.sync().then(function() {
        if (filter) {
            var filterOption = {
                where: {
                    SnackLimitID: filter 
                },
                include: [ {model: Sport, as: 'Sport'} ]
            };
            return SnackLimit.findAndCountAll(filterOption);
        } else return SnackLimit.findAndCountAll({ include: [ {model: Sport, as: 'Sport'} ] });
    }).then(function(result) {
        var snacklimits = [];
        result.rows.forEach(function(snacklimitRow) {
            snacklimits.push(snacklimitRow.get({plain:true}));
        });
        return {
            count: result.rows.length,
            snacklimits: snacklimits
        };
	});
}

module.exports.create = function(json) {
	var _limit = SnackLimit.build(json);

	return sequelize.sync().then(function() {
		console.info(moduleName, 'create a new snacklimit using JSON provided');
		console.error('need to add json validation to snacklimit creation');
		var snacklimitJson = json;//JSON.parse(json);
		return SnackLimit.create(json).then(function(snacklimit) {
			console.info('snacklimit successfully created');
			return snacklimit;
		});
	});
};

module.exports.update = function(json) {
	return sequelize.sync().then(function() {
		console.info(moduleName, 'update a single snacklimit using JSON provided');
		console.error('need to add json validation to snacklimit update');
		var sl = json;//JSON.parse(json);
		return SnackLimit.update(
			json,
			{ where: { SnackLimitID: json.SnackLimitID } }
		).then(function(result) {
			console.info(moduleName, 'snacklimit successfully updated');
			return result;
		});
	});
};

module.exports.delete = function(id) {
	return sequelize.sync().then(function() {
		console.info(moduleName, 'delete a sport by id');
		return SnackLimit.destroy({ where: { SnackLimitID: id } }).then(function(count) {
			console.info(moduleName, '(' + count.toString() + ') snacklimits successfully deleted');
			return count;
		});
	});
};

module.exports.close = function() {
	sequelize.close();
};