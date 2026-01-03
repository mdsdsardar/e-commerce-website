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

********************** user.js/userController.js **********************
===> userRouter.route("/register").post(registerUser)
Fetch name, email & password from body, check if all feilds are filled, email is new or not.
Everytime pass. is changed it will be encrypted before saving it into DB, as per our model design.
We will fetch the image from body, upload it into avatar folder and store the result in result var
Then we will fetch public ID and secure url from result var, and store it in avatar section in DB.
Then create user and send the user, statusCode and res to jwtToken utils file.
********************** utils/jwtToken.js **********************
get token from user.getJwtToken(), which will sign token with id, fetch expirydate from env file.
Then setup options for cookie with httpOnly and samesite config for protection.
Then we will send the json response to frontend also save the cookies into the browser.

===> userRouter.route("/login").post(loginUser)
Check if email & pass are written then find the email and enable select option for password.
use comparepassword which will use bcrypt to compare our input password with hashed pass of DB.
Then again use sendToken() function to generate JWT token & store it in Browser.

===> userRouter.route("/password/forgot").post(forgotPassword)
Fetch email from body and then check if user exists?
then, call get reset password token, 1st we will generate reset token which we will sent to user, then hash this token and stored in DB, also set expiry time of token.
We will create reset URL, by fetching protocol & host dynamically and then sent it via message.
********************** sendEmail.js **********************
We are using nodeMailer to send mail, 1st we will do initial setup, then generate the mail template like from, to, subject and text using provided input, then sent it via nodemailer.
If mail sent failed, make token and expiry as undefined.

===> userRouter.route("/password/reset/:token").put(resetPassword)
Fetch password token from params, create hash as we did for token in forget password, then check if password token is correct & not expired, then update the password, and remove the token expire value. and call send token function which will let user loggedIn.

===> userRouter.route("/me").get(isAuthenticatedUser, getUserProfile)
********************** auth.js/isAuthenticatedUser **********************
fetch token from req.cookie {cookie parser store cookie in req}. We will decode the token which provide user ID, find the user info in DB using ID & store it in req.user
Send the userinfo of req.user via JSON.

===> userRouter.route("/password/update").put(isAuthenticatedUser, updatePassword)
Fetch userInfo and enable select option of password, then first check old password is correct, then update the current password in DB, also send the token which will loggedIn user.

===> userRouter.route("/me/update").put(isAuthenticatedUser, updateProfile)
Fetch the updated field like name & email, then use req.user.id and update them in DB.
Check if avatar is uploaded, If yes then fetch user Info,delete the old avatar by using public_id.
then upload the recent avatar, add the public_id & secure_url data in new userData.

===> userRouter.route("/logout").get(logOut)
We will modify the token from cookie of response. modify expiry date to now.

===> userRouter.route("/admin/users").get(isAuthenticatedUser, authorizedRole("admin"), allUsers)
********************** authorizedRole("admin") **********************
We will accept multiple roles from function input using spread operator & using if operator we will check if req. contains authorised user?
If authorised, find all the user.

===> userRouter.route("/admin/user/:id").get(isAuthenticatedUser, authorizedRole("admin"), getUserDetails)
Fetch if the id from url and search it in DB.

===> userRouter.route("/admin/user/:id").put(isAuthenticatedUser, authorizedRole("admin"), updateUserProfile)
Fetch the latest name, email & role from body and modify it by fetching id from url

===> userRouter.route("/admin/user/:id").delete(isAuthenticatedUser, authorizedRole("admin"), deleteUser)
Fetch public_id from user info, then delete it from cloudinary.
Find user by id and delete it from DB.


********************** product.js/productController.js **********************
===> productRouter.route("/product/new").post(isAuthenticatedUser, authorizedRole("admin"), newProduct);
We will check if image is single or multiple? If single it'll be an string directly push it into array, if it is multiple no need to push just assign it.
Now upload all the image one by one in cloudinary & capture it's public_id & secure_url and paste it in imagesLink, which will be uploaded into DB. DO this ops for all the images using for loop.
Fetch all the info from body, then update userId in body from req.user.id. and then create the product from the req.body.

===> productRouter.route("/products").get(getProducts)
********************** apiFeatures.js **********************
We are creating class which accepts 2 parameter DB query, query fetched from url by using query parser.
Search: Fetch keyword from url query, then search the keyword in name feild of product, _conditions: { name: { '$regex': 'hp', '$options': 'i' } },
Filter: It'll create clone of url query and remove field like keyword, page and limit. then it'll modify the query string this way, price: { '$gte': '100', '$lte': '500' }
Then use Get query to fetch total counts of product.
Pagination: fetch current page from queryStr, decide skip using resperpage and current page, then modify the query with skip and limit of resPerPage.
Then run the final modified query query. and sent resPerPage, product & productCount in response.

===> productRouter.route("/product/:id").get(getSingleProduct)
Fetch single product details from DB using url ID and send it through a response.

===> productRouter.route("/product/update/:id").put(isAuthenticatedUser, authorizedRole("admin"), updateProduct)
Fetch the current product details from DB, and check if product is found or not,
We will check if the images are uploaded? If yes delete all the old images and upload the new images and create new array of imageLinks and fill them with recently uploaded url
Fetch the updated field from body and modify it on DB using url ID.

===> productRouter.route("/product/delete/:id").delete(isAuthenticatedUser, authorizedRole("admin"), deleteProduct)
Find and delete product from DB using provided ID, delete the images just like update method.

===> productRouter.route("/review").put(isAuthenticatedUser, createProductReview)
We are fetching productID, comment, rating from body, although we dont need to type prodID from UI
Create review object using user, name, rating and comment. also fetch product details from DB.
Check if user already reviewed, by comparing req.user._id with already reviewed people ID.
If yes, then we will go through each review and modify the right review with latest comment/rating
Else push the review normally and also refresh the numOfReviews.
Also calculate avg. rating of product and update it in DB.

===> productRouter.route("/review?id=<Review_ID>").get(isAuthenticatedUser, getProductReviews)
Fetch all the review of specific product using it's ID which is provided through query.

===> productRouter.route("/review?id=<Review_ID>").delete(isAuthenticatedUser, deleteReview)
Fetch product details using ID provided through query, then use filter method to remove specific review out of all. then refresh current review value and recalculate rating. then modify the latest values of review, numOfReviews & rating

===> productRouter.route("/admin/products").get(getAdminProducts)
Just fetch all product without any additional query/filter.

********************** order.js/orderController.js **********************
===> orderRouter.route("/order/new").post(isAuthenticatedUser, newOrder)
Fetch all the req info from body and create the order with user info additionally added.

===> orderRouter.route("/order/:id").get(isAuthenticatedUser, getSingleOrder)
Fetch single order by using URL ID.

===> orderRouter.route("/orders/me").get(isAuthenticatedUser, myOrders)
Fetch my order using req.user.id, which we got from authenticator.

===> orderRouter.route("/admin/orders").get(isAuthenticatedUser, authorizedRole("admin"), allOrders)
Fetch all order from DB, then calculate total amount by adding all orders total price.

===> orderRouter.route("/admin/orders/:id").put(isAuthenticatedUser, authorizedRole("admin"), updateOrders)
Fetch order using URL ID, Then when we will check if the order is delivered or not. 
If not then, Whenever we will update the stock, doesn't matter if it fail/pass it'll update the quantity. Also we have to add logic like check if the body the delivered then update it.

===> orderRouter.route("/admin/orders/:id").delete(isAuthenticatedUser, authorizedRole("admin"), deleteOrder)
Fetch the ID from URL and delete the order.

********************** order.js/orderController.js **********************
===> paymentRouter.route("/payment/process").post(isAuthenticatedUser, processPayment)
Create stripe payment intents using amount fetched from body and other config.
Then we are sending client secret {Frontend temporary token (client_secret)} to process payment.

===> paymentRouter.route("/stripeapi").get(isAuthenticatedUser, sendStripeApi)
Send stripe API key to FrontEnd. with these 2 methods frontend with complete the payment.









*********************** Pending ************************
I need to send our custom backend error in frontend.