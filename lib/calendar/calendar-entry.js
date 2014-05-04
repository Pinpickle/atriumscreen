var keystone = require('keystone');

var CalendarEntry = module.exports = keystone.List('CalendarEntry');

CalendarEntry.add({
    name: {
        type: String,
        initial: true
    },
    start: {
        type: keystone.Field.Types.Datetime,
        required: true,
        initial: true
    },
    end: {
        type: keystone.Field.Types.Datetime,
        required: true,
        initial: true
    },
    priority: {
        type: Number,
        required: true,
        initial: true,
        default: 0
    },
    calendar: {
        type: keystone.Field.Types.Relationship,
        ref: 'Calendar'
    },
    layout: {
        type: keystone.Field.Types.Relationship,
        ref: 'Layout'
    }
});

CalendarEntry.register();
