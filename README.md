# AtriumScreen

Presenting information to the masses

##Heh?

AtriumScreen is a framework designed to display digital signage through web technologies. So many physical places have access to screens and use them to display information but hardly any of them make good use of them. Screens are a way to interact with people and static screens are boring screens. Web technologies are easy, powerful and look awesome so they are perfect for remedying this problem. It just helps to have a bit of a helping hand, and that's where AtriumScreen comes in.

##The Important Philosophy

Developers need to love to use this but so do people who can't code. Think of how frameworks like Wordpress empower the content creator, the designer and the developer. Making one the core focuse without the other is simple - utilising both without compromise is what's difficult.

##The Core Concepts

###Screens

You set up screens as endpoints of your app. Usually, each screen can represent a physical screen in reality but you can have more than one attached to the same endpoint.

###Layouts

This is the end result, a layout is synonymous with a view, pretty much. Layouts are powerful in that they're designed to take in a whole bunch of information to make them extremely extendible. Make a layout for a clock that takes in information such as timezone, colours, layouts. Still not extensive enough? Have another layout that displays some information, and has a slot for another layout embedded in it - in it goes the clock. The concept of a widget could have been introduced, but now everything visual has been abstracted into a single idea.

###Middleware

You can't have an Express app without middleware. The job of the middleware is to link each screen with a layout and populate any information that may be required of the layout. Any screen can have any number of middleware associated with it, one after the other. Middleware "stacks" will be able to be saved into groups for easy reuse.

###Calendar

Screens change over time and it ought to be automated. Create calendars to set variables or layouts for other screens over time. Combine multiple calendars in middleware stacks and who knows what will happen?

##Backend

The backend of AtriumScreen is powered by the amazing [Keystone](https://github.com/JedWatson/keystone/). At this stage, it makes it really easy for rapid development of AtriumScreen. But for the backend to become truly intuitive and easy. Here are some desired features that are already being discussed:

* **Custom rendering of model lists** For example, the calendar would look great if it wasn't a list of events but an actual calendar [#268](https://github.com/JedWatson/keystone/issues/268).
* **Custom fields** There are some slightly more complex fields in AtriumScreen that would work well if we could decide how they were edited [#218](https://github.com/JedWatson/keystone/pull/218)
* **Full use of MongoDB power** It's frustrating that we can't use arrays and ambiguous mixed objects in the admin UI. Every layout, screen and decider will be able to have settings tied to it and these settings could contain any manner of entries - There's not much need for a schema here as this information is interpreted on a case by case basis through the controller [#153](https://github.com/JedWatson/keystone/issues/153).
