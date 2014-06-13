var keystone = require('keystone');







exports.register = function(atriumscreen) {
    var Calendar = keystone.List('Calendar');
    Calendar.add({
        name: {
            type: String,
            initial: true
        },
        defaultLayout: {
            type: keystone.Field.Types.Relationship,
            ref: 'Layout',
            initial: true
        }
    });

    Calendar.register();
    var CalendarEntry = Calendar.CalendarEntry = require('./calendar-entry');


    atriumscreen.Calendar = Calendar;
    atriumscreen.register('deciderController', 'calendar', {
        settings: { },
        middleware: function(req, res, next) {
            if (req.currentSettings.calendar) {
                //Make sure settings have been set right
                var now = new Date();
                CalendarEntry.model.findOne({
                    start: {'$lt': now},
                    end: {'$gt': now},
                    calendar: req.currentSettings.calendar
                }).sort({ priority: -1 }).exec(function(err, calendarEntry) {
                    if ((err) || (!calendarEntry) || (!calendarEntry.layout)) {
                        //If we couldn't get a layout, at least check if the calendar has a default layout
                        Calendar.model.findById(req.currentSettings.calendar).exec(function(err, calendar) {
                            if ((err) || (!calendar) || (!calendar.defaultLayout)) {
                                next();
                                return;
                            }
                            res.layout = calendar.defaultLayout;
                            next();
                            return;
                        });
                        return;
                    }

                    res.layout = calendarEntry.layout;
                    next();
                });
            } else {
                next();
            }
        }
    });
};
