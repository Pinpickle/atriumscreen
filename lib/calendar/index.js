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
                var now = new Date(),
                    currentEntry

                //To find the refresh point
                var refresh = null;
                findRefresh = function() {
                    var query = {
                        start: {'$gt': now},
                        calendar: req.currentSettings.calendar
                    };
                    if (currentEntry) {
                        //If we're in an entry (not using default)
                        //There are some things we need to do
                        query.priority = {priority: {$gte: currentEntry.priority}};
                        query.start['$lt'] = currentEntry.end;
                        res.clientData.as.refresh = currentEntry.end;
                    }
                    CalendarEntry.model.findOne(query).sort({priority: -1, start: 1}).exec(function(err, calendarEntry) {
                        if (!calendarEntry) {
                            return next();
                        }

                        if ((!res.clientData.as.refresh) || (res.clientData.as.refresh.getTime() > calendarEntry.start.getTime())) {
                            //If we haven't already determined a refresh value already
                            //Or the current refresh value is later than the start of this event
                            //Make this event the refresh time
                            res.clientData.as.refresh = calendarEntry.start;
                        }
                        next();
                    });
                };

                CalendarEntry.model.findOne({
                    start: {'$lt': now},
                    end: {'$gt': now},
                    calendar: req.currentSettings.calendar
                }).sort({ priority: -1 }).exec(function(err, calendarEntry) {
                    if ((err) || (!calendarEntry) || (!calendarEntry.layout)) {
                        //If we couldn't get a layout, at least check if the calendar has a default layout
                        Calendar.model.findById(req.currentSettings.calendar).exec(function(err, calendar) {
                            if ((err) || (!calendar) || (!calendar.defaultLayout)) {
                                findRefresh();
                                return;
                            }
                            res.layout = calendar.defaultLayout;
                            findRefresh();
                            return;
                        });
                        return;
                    }
                    currentEntry = calendarEntry;
                    res.layout = calendarEntry.layout;
                    findRefresh();
                });
            } else {
                next();
            }
        }
    });
};
