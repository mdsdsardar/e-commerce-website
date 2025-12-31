**************************** server.js ****************************
Very fist hadle uncaught exception first.
Then, Import dotenv and dotenv.config in your root file, coz once we did this we don't have to import it anywhere else.
Import cloudinary config file, as we need it in all the routes.
Then Import all the routes and DB. then start the server.
In last Handle unhandled promise rejections.

**************************** app.js ****************************
We will initilize express, then express.json to convert json req. into JS Object, limit to avoid large payload attack. url encoded to parse form into js object, query parser to control gte and lte, cookie parse to store cookie in req, use fileupload to store media upload in req.file.

After importing all the routes, check if env is prod, if yes then use the prebuild frontend. but for dev it is better to run both individually for ease in development.

******************* error/errorHandler/catchAsyncErrors.js *******************
catchAsyncErrors: It is wrapper use to wrap function, It'll prevent app from crashing with unhadled rejections in function. {Unexpected}
ErrorHandler: very useful to send expected error of 4xx and 5xx. just provide statuscode & message and it'll capture stack trace by itself. {Expected} Both send data to global error MW
error: Global error handler to capture all kind of error, and we will send these error to frontend differently depends on dev/prod env. initialise it on app.js file.
