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
            //Give ourselves a namespace
            if (!res.calendar) res.calendar = { };

            if (req.currentSettings.calendar) {
                //Make sure settings have been set right
                var now = new Date();

                //To find the refresh point
                var refresh = null;
                var findRefresh = function() {
                    var query = {
                        start: {'$gt': now},
                        calendar: req.currentSettings.calendar
                    };
                    if (res.calendar.entry) {
                        //If we're in an entry (not using default)
                        //There are some things we need to do
                        var entry = res.calendar.entry;

                        query.priority = {priority: {$gte: entry.priority}};
                        query.start['$lt'] = entry.end;

                        if ((!res.clientData.as.refresh) || ((res.calendar.refresh) && (res.calendar.refresh.priority <= entry.priority)) || (entry.end.getTime() < res.calendar.refresh.start.getTime())) {
                            //If there is no refresh time OR
                            //If there is a refresh entry and it's priority is appropriately low OR
                            //If the current entry ends before the saved refresh time
                            res.clientData.as.refresh = entry.end;
                        }
                    }
                    CalendarEntry.model.findOne(query).sort({priority: -1, start: 1}).exec(function(err, calendarEntry) {
                        if (!calendarEntry) {
                            return next();
                        }

                        if ((!res.clientData.as.refresh) || (res.clientData.as.refresh.getTime() > calendarEntry.start.getTime())) {
                            //If we haven't already determined a refresh value already
                            //Or the current refresh value is later than the start of this event
                            //Make this event the refresh time
                            res.calendar.refresh = calendarEntry;
                            res.clientData.as.refresh = calendarEntry.start;
                        }
                        next();
                    });
                };
                var query = {
                    start: {'$lt': now},
                    end: {'$gt': now},
                    calendar: req.currentSettings.calendar
                };
                if (res.calendar.entry) {
                    //If there is already a calendar entry, check that the one we're finding has a high enough priority
                    query.priority = { $gte: res.calendar.entry.priority };
                }
                CalendarEntry.model.findOne(query).sort({ priority: -1 }).exec(function(err, calendarEntry) {
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
                    res.calendar.entry = calendarEntry;
                    res.layout = calendarEntry.layout;
                    findRefresh();
                });
            } else {
                next();
            }
        }
    });
};
