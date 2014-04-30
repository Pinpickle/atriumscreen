# AtriumScreen

Presenting information to the masses

##Heh?

AtriumScreen is a framework designed to display digital signage through web technologies. So many physical places have access to screens and use them to display information but hardly any of them make good use of them. Screens are a way to interact with people and static screens are boring screens. Web technologies are easy, powerful and look awesome so they are perfect for remedying this problem. It just helps to have a bit of a helping hand, and that's where AtriumScreen comes in.

##The Core Concepts

###Screens

You set up screens as endpoints of your app. Usually, each screen can represent a physical screen in reality but you can have more than one attached to the same endpoint.

###Layouts

This is the end result, a layout is synonymous with a view, pretty much. Layouts are powerful in that they're designed to take in a whole bunch of information to make them extremely extendible. Make a layout for a clock that takes in information such as timezone, colours, layouts. Still not extensive enough? Have another layout that displays some information, and has a slot for another layout embedded in it - in it goes the clock. The concept of a widget could have been introduced, but now everything visual has been abstracted into a single idea.

###Middleware

You can't have an Express app without middleware. The job of the middleware is to link each screen with a layout and populate any information that may be required of the layout. Any screen can have any number of middleware associated with it, one after the other. Middleware "stacks" will be able to be saved into groups for easy reuse.

###Calendar

Screens change over time and it ought to be automated. Create calendars to set variables or layouts for other screens over time. Combine multiple calendars in middleware stacks and who knows what will happen?
