###### Initialise project.
Run "npm create vite@latest" in terminal, which will create react project in folder. It contain multiple files, In which some them we will remove like delete public/vite.svg, src/assets/react.svg & src/App.css and empty file like, Readme.md, src/App.jsx & src/index.css.
Also we can ignore file like, .gitignore & eslint.config.js.

###### Files: use auth.slice.js, newProducts.jsx.

###### Index.html
We have imported multiple link which are of either font's or Jquery.
1st bootstrap link will provide styling through class like btn, col-md-6. 
2nd bootstrap link will provide font awesome icon like <i class="fa fa-home"></i>.
3rd link will make Amazon+Ember font available for us.
1st script will enable dropdown, modals, req. for bootstrap 4 {not required for now.} 
2nd script Adds interactive functionality to Bootstrap components, Without this, interactive Bootstrap components are just static HTML {must required for us.}
I have pasted the correct config req. for Bootstrap5 in index.html file.

###### vite.config.js
In slice we will call {axios.get("/api/v1/login")}, be default this API call will try to hit on frontend server like localhost:5173, we will do the proxy config. in vite.config.js which will automatically route API call from frontend to backend {our proxy set-up}. logging is totally optional.

###### store.js
We are configuring store using reduxjs/toolkit 3rd party package.
In this file we have to define all the reducer file with the designated reducer name.

###### main.jsx
By default main.jsx will cover App.jsx file in strict-mode. we have removed strict-mode wrapper. 
Instead of that we have wrapped it in provider {react-redux wrapper}, also define store inside of it.
Apart from App, we have define toster, which is useful for pop-up message used incase of error/success.

###### index.css
this file contain some specific set-up of html componants.

###### Logic of Slices: 
action types are provided, so that reducer can identify the individual thunk. if we are fetching multiple inputs keep them in curly bracket. Always add = {} when using params with defaults.
Use try catch method to send the API response, and modify the error message which should be useful for providing to user.
For post operation we must need to provide headers {store them into config var.} & input data {wrap them in curly bracket}
Fetch just data from triggred API response, as data is response send by server other than that we get multiple other info like status codes, response headers (tokens, pagination, etc.) which can be useful in some use case.
Also even data contain multiple fields as we send multiple field from frontend. so return just imp field. like data.user
Use catch for error, modify the errorMessage by fetching it from error.response.data.message OR from error.message

In Slice setup we have to define initialState, which can be false/null/[]/Helper function. everytime you'll refresh the page all the value in redux will go back to it's initial state, If we are storing some data like cart/any other info in local storage of browser, we can fetch it using helper function.
Also we can use helper function to store our redux data into local storage.
Normal reducer: If we have to modify some specific values in our redux store like clearErrors/resetUpdate {mostly boolean}
Extra Reducer: Here all async thunk actions are, Make sure you are keeping value as false in reject & pending state for all boolean values of our redux. also we can use normal reducer to modify the value but it is better. All the state which contain some DB data like productDetails/review/userData - ensure these values are not being modified with other thunk until/unless you want to modify.

###### Slices.
###### authSlice
## getAuth: 
Fetch email & password from input {react will provide}, add headers into config var & trigger the post operation by providing input values and config data which contain headers. then fetched the data from API response & return data.user
Then in reducer, In pending state loading will be true {usefull to show loader}, auth status false {very imp.}, In fullfilled state: loading false, auth status true, fetch userdata & store it in user, also make userLoaded true {this is very usefull to know if user fully loaded as loading is being used by multiple thunk.}, In rejected state make loading & isAuth as false and userData as null.

## createUser:
Fetch userData from Input, as it contain image as well we will use multipart in headers, trigger register user API by providing the header and Data. and then return the data. Reducer is completely similar with getAuth reducer.

## loadUser: 
Trigger get user API response to fetch currently user data, an return data.user from it. Reducer is same as getAuth.

## logoutUser:
Trigger logout API via Get Method, In fullfil condition, make userLoaded, loading, isAuth status as false. and delete user data as null. In reject condition make loading false, error as action.payload.

## allUsers:
Fetch resPerPage & currentPage data from input and send the get response and these inputs are for pagination & return data
In pending condition make usersLoading true, in fullfill condition store allusers & totalUsers value from action.payload & in keep usersLoading as false in both fulfill & reject condition. {different loading using for admin API}

## updateUser:
Fetch id, formData from input, do the put API operations, provide header and userInput to API and return data.success.
In reducer, In pending state, ensure to keep isUpdated to false, In fullfilled state, store payload in isUpdated value. also in reject state make isUpdated value to false.

## getUser:
Fetch id from input, trigger fetch individual user from id, and return data.user. We will store this individual user data into fetchedUser. ensure to store all the different values in different state.

## deleteUser:
Fetch id from input & trigger the user deleted by admin using this id and return data.success. and store this success value in isDelete var.

###### user.slice
## updateUser:
Fetch userData from input, create multipart header, send them in put API req. to update currently loggedIn user & return data.success. In reducer pending state keep isUpdated value as false, and in fullfilled make it as action.payload, and in reject state keep it as false.

## updatePassword:
Fetch password from input, create application header, send them via API to update password and return data.success. reducer is same as update user.

## forgotPassword:
fetch email from input, create app header & send them VIA API to forgot password & return data.message. this is just a succesfully sent message, actual message will be sent over a mail. In reducer store this message in message var.

## resetPassword:
Fetch token & password from input, set application header & send those config via API to reset password & return data.success. and store the success value in success var. but it can be ignored in isDeleted.

###### cart.slice
loadCartFromStorage: We will fetch the cart data from local browser storage.
loadShippingFromStorage: We will fetch the shipping info from local browser storage.

## addItemToCart:
Fetch id & quantity from user, send Id via API to fetch the specific product data, and create custom payload of req. fields. In reducer if req. 
fulfilled store the payload into item, then create existingItem var and store all cart items into item.product {existing product}. Now using if else go through each existing product to check if newly added product is already exist if yes then update it's quantity, else push new product into cart. then
saveCartToStorage: Update the local storage with recently added product.
## Other helper function: 
removeFromCart: use filter method to remove individual cart product. also save cart in local storage.
clearCart: delete whole cart product. we should when order is succesful.
saveShippingInfo: We will provide info from frontend to store it in loca storage. {saveShippingToStorage}
clearShippingInfo: delete shipping info from local storage.

###### order.slice
## createOrder:
Fetch order input, create app header config then make API call to create new order & return data.success.
In fulfill stage store the order data into order state.

## myOrder:
Make API call to fetch my order & return data.orders. & reducer is same as createOrder.

## orderDetails:
Fetch id from input, make API call using that ID to fetch specific order details & return data.order

## allOrders:
Fetch resPerPage & currentPage from input. make Get API call to fetch only sorted orders and return them.
In fulfilled state store allOrder, totalAmount & totalOrder from action.payload.

## updateOrder:
Fetch id & orderData from input, create app header and then make Put API call to update specific order and return data.success. keep isUpdated false in pending & rejected state & in fulfilled state keep action.payload.

## deleteOrder:
Fetch id from input, Make API call to delete specific order using it's id & return data.success. keep isDeleted as false in pending & rejected state, and action.payload in fulfilled state.

###### product.slice
## getProducts: 
Fetching input params, Always add = {} when using params with defaults, we have also retry of 3 times, with delay of 1Sec. Now we are creating the link with multiple filters, and filling the params value in those filters & then make API call to fetch filtred products & return data.
If we observe an error, we will check if retry has been maxed out? if not then retry the API.
In fulfilled state, update value of products, productCount and resPerPage state.

## getAdminProducts:
Fetch resPerPage & currentPage value from frontend, if not provided use default value. then Make API call with filter to fetch specific products & then return data. In fulfilled state, update value of products, totalProducts state.

## getProductDetails:
Fetch id from input, then Make API call to fetch specific product & return data.product.
In fulfilled state update the value of productDetails state.

## newReview:
Fetch reviewData from input, create app header and sent the PUT API request to either create/update the review & return data.success. In fulfilled state update the value of success state. and keep false in reject/pending state.

## newProduct: 
Fetch productData from input, create multipart header, Make POST API call to create new product, then return data.
In pending/reject state keep success status as false, in fulfill state make it true & store payload in productDetails state.

## updateProduct:
Fetch ID and ProductData from input, create multipart header, Make PUT API call to update product details of exisiting product, and then return data.success. In pending/rejected state keep isUpdated value as false & in fulfilled state make it as action.payload.

## deleteProduct:
Fetch id from input, make the API call to delete the product using it's id, and return data.isDeleted.
In pending/rejected state keep isDeleted value as false & in fulfilled state make it as action.payload.

## productReviews:
Fetch id from input, Fetch specific review using it's id & then return data.reviews. In fulfilled state store the payload in reviews state.

## deleteReview:
Fetch productID an id from input, MakeAPI call to delete that specific review from product & return data.success. Keep isDeleted value as false in pending/rejected state, but in fulfilled state assign it as action.payload.

###### Logic In component:
Most of the frontend input either we will get from URL/From form, for form related input must use useState.
useState can keep single value OR multiple value which later either we can destructure or call it like user.name.
Then we will fetch multiple state values from Redux store, page rerender whenever it observed changes in store value & we have utilise this function very heavily in our frontEnd logic. It's value can change Dispatch of thunk.
Then use useEffect hook, which has the ability to rerun if it observed any changes in dependency array, which might result in changes in value of redux store and then rerender HTML page. Inside of useEffect we will check if error/isUpdated/isDeleted - If those condition satisfied we can toast the response OR dispatch the thunk which we want. Even without any if else we can dispatch thunk If we want to compulsorily fetch some data in case of any change.
Avoid adding error in dependency error, cause it can tends to crash page be toasting it infinitely.
Then we will setup onSubmit/onChange/onClick handler which can contain different piece of code all had a purpose to fulfill our usecase. We mostly prefer to create formData to submit multiple input values inside of thunk. So far we have used onChange for file upload as it is multiple files.

We have used ReactPaginate in our home.jsx page as it provide as very detailed pagination option, also in home page we are providing advance filter options, which contain some very handfull of knowledge.
We have used MUI Data grid pagination to paginate all the list pages, it just req. setup of rows & column then most of the pagination it'll cover it by himself. remember no search option in it.

###### App.jsx
Initialise dispatch & state of StripeAPIKey, Then utilise useEffect hook in it, 1st enable loading then setup timer of 2sec, after that dispatch loadUser thunk to fetch current user details, after it trigger get response to fetch stripeApIkey from backend and assign it's value to StripeAPIKey state.

In HTML code, 1st we will write <Router> which will cover whole HTML code, mandaory for React routing.
And then write header on top and footer and bottom, cause we want to render no matter what is the route.
After it we will create the wrapper of UserLayout Route, it means all the route inside of it user route not Admin.
Then start defining all the public/Unprotected route, Then create another wrapper on top of UserLayout, which is it of ProtectedRoute, inside of it, all the user Protected route will be there, once they are done close both the wrapper.
Then create Admin protected wrapper and keep all the admin only route in it, then close the wrapper.

###### Home.jsx
Define currentPage, price, category & rating in useState to set default value & allow changes in it using forms, Defined categories which was copied from frontend. Fetch keyword from URL/params. Define useDispatch useful to trigger thunk.
Then we are fetching multiple value from product store, In 1st attempt It'll be null. Now defining the useEffect which will pop-up error if it observed, if not then setLoading to true to show Loader on home screen, then fetch products by providing initial values in 1st itiration.
[dispatch, keyword, price] - This is dependency array if any changes happened in this values it'll trigger the useEffect hook, and if we fetched some different data this time It'll update the product store which will re-render the page.
We are defining multiple vars some of them are fetched from backend & some of them has been calculated here for pagination

If loading show loader, if not then start showing metaData & rest of html page. these 2 are defined in diffrent file.
Then we will check if keyword is there is url? If yes then show the multiple filter options like price slider, category selector, sort by rating. We will use onChage/onClick parameter to set these values in redux which also trigger useEffect.
Then use map function to provide each product one by one to product.jsx file.
If url dont have keyword dont show any filter, just provide all products to product.jsx file.
After this we will setup pagination, this will be available for both the condition, As we are showing multiple feild like last, first, prev, next, and other page number & other functionality all will be handled gracefully here.

###### Footer.jsx
We are just showing a copyrighted paragraph in bottom, nothing else.

###### Header.jsx
We will fetch loading & user info from auth store {everytime we refresh the page, load user triggers and provide these values.} & cartItems from local storage. Also defined logoutHandler which will be triggered if we click on logOut. It'll dispatch logOut user thunk.

Show search page {dedicated file}, logo, cartIcon with length, profile pic with userName. Also provide dropdown in userName of Profile, logOut {also set logOut onClick handler} & Dashboard if Admin, else MyOrders. Check if not loading and user is not logged In show the logIn button instead of user profile.

###### Loader.jsx
We are using bootstrap loader class, also we have defined it in separate file as we need it multiple times.

###### MetaData.jsx
We are using react Helmet component which allow us to dyanamically update the head component. Just provide the title while calling this page, it'll take care of updating it.

###### Search.jsx
define keyword in useState, useNavigate it is used to redirect user to other page. we have onSubmit searchHandler, which will check if search feild contain any keyword? If yes redirect it to that page, else keep them in root page. 
Create input html page in form & set onChange value in it. also provide search button beside it.

###### UserLayout.jsx
This is a container wrapper we are wrapping each component in it. {very important.}

###### Product.jsx
This is product html page, we are assigning all the product value which we got from home page.

###### ProductDetails.jsx:
We are creating multiple state 1st, then we have setup onClick listner to show modal{pop-up}. then Fetch Id from URL.
Fetch multiple details from productDetails state & user details from auth state, then we are using useEffect hook to trigger productDetails thunk. Also setting onClick listner to setup AddToCart button.
We are also setting increase/decrease Qty onClick listner, we are modifying UI using coreJS querySelector, also checking if added qty is under available stock? then only increase the Qty.
Then set up submit handler, fetch all input from form, then submit it for review create/update. once it's done hide model.

We have setup loading, then MetaData, then setup all onclick listner, check if product is in stock/out of stock, we are also checking if user is loggedIN or not? Also show review if they are their, else not.
For modal, when user click submit review it pop-up, if we click on submit/backdrop it'll disapper.

###### ListReviews.jsx
Fetch reviews from input, then assign the respected value in html component.

###### ProtectedRoute.jsx
We are fetching multiple value from auth state, and we are also accepting isAdmin value from input, but by default that is false.
In useEffect check if userIsAuthenticated? OR if it is Admin req. check if user is Admin. toast error if condition fails.
Show loader and text of checking auth. while checking authentication
if not authenticated, route them to login page, if admin route but user is not admin, route them root page.

###### ForgotPassword.jsx:
Fetch some value from user store, then initialize useEffect hook, check for error/message & toast them.
Setup submitHandler, create formData, include email in it and send it to forgotPassword thunk. 
Set submitHandler/MetaData & onChange modify email in HTML code.

###### Login.jsx:
Initialise navigate, location, useState & useDispatch. then fetch couple of values from auth store.
We are setting redirect var which will check if url contain redirect params in URL, if Not redirect to root.
Then use useEffect hook, in it check if user authenticated? If Yes redirect to redirect params URL/root.
SetUp SubmitHandler which will dispatch getAuth thunk with email & password.
Then inside HTML code, set SubmitHandler, onChange for Email & password also make sure other params are correct!

###### NewPassword.jsx:
Fetch token from URL, initialise navigate/useState & useDispatch. then setup useEffect which will be triggered if dispatch will happen, and will toast success/error in this Effect & navigate to login.
In submitHandler create formData & store password & forgot password in it, dispatch resetPassword with token & formData
In HTML code, setup onSubmit/onChange in it, also manage loading in it.

###### Profile.jsx:
Fetch multiple info from auth store then fill all the req. from auth store into HTML code.

###### Register.jsx:
Initialise navigate/dispatch & useState. setup multiple useState value & fetch certain value from auth store.
Then write useEffect hook, which will check if isAuth route them into root dir. else toast an Error.
Set-up SubmitHandler in which create new FormData with all provided info and then send it via createUser thunk.
We are storing name, email & password in single var, also destructuring them so that we can access them directly with their name instead of user.name. The purpose of this is we are storing onChange function, if we observed change in avatar we will assign the avatar value, but if we observed change in other value, we can use setUser and update specific value
In HTML code, set submitHandler in form & in every onChange just call this function good approach.

###### UpdatePassword.jsx:
Set-up navigate, dispatch & useState and then fetch certain data from user store. then setup useEffect hook in which if error/success based on it toast response, if success also navigate to profile page.
Then set-up SubmitHandler, in it create formData and provide oldPassword & password in it and send it updatePassword thunk
In HTML code, setup SubmitHandler in form, also set onChange value of password & oldPassword.

###### UpdateProfile.jsx:
Set-up navigate, dispatch & useState & fetch certain value from auth and user store, then utilize useEffect hook in which first check if user exist assign all the old value in redux, if success dispatch loaduser to fetch current info & route it to /me. then setup submitHandler in which create new FormData set all our values and dispatch it to updateUser.
Also created onChange function in which we are using std method to assign files to avatar & avatar preview state.
In HTML code, setup SubmitHandler in form, also set onChange value of name, avatar, avatarPreview & email.

###### Cart.jsx:
Setting up onClick listner to remove any specific product from cart using it's ID, by dispatching removeFromCart thunk.
We are increasing/decreasing qty by checking available stock, then dispatch addItemToCart thunk with updated qty.
onClick checkoutHandler will navigate to login page to check if user is Authenticated or not, then route to checkout page.
In HTML Code, using map function we will print each product, then also provide the summary by calculating unit & price.

###### CheckOutSteps.jsx:
This HTML code is just for UI interaction to show the actual step we are in while purchasing product.

###### ConfirmOrder.jsx:
Fetch multiple info from multiple store. Then calculate multiple price as we have to provide whole price info.
Setup onClick listner proceedToPayment, we are data var in which we are storing all the values, and then we are storing this data in session storage, means it can survice page refresh, but it'll not be avble in other tab of browser.
In HTML code, fill all these info fetch from multiple store & also setup onCLick listner.

###### ListOrder.jsx:
Fetch multiple info from order store, then utilise useEffect hook to dispatch myOrder thunk, we are also checking order is an array before mapping.
then we are setting rows and column in which we are filling all the req. data we can, these info are to utilise MUI builtIN pagination. In HTML code do the setup of it by providing all these values.

###### OrderDetails.jsx:
Fetch certain details from order store & id from URL, then we are destructuring multiple feild from order redux state. utilise useEffect to dispatch orderDetails thunk by providing id.
In HTML code we are filling all these info some info has been modified before putting into it.

###### OrderSuccess.jsx:
If Order is succesful, it'll print this page.

###### Shipping.jsx:
We are using 3rd party module to fetch countries list, fetch shippingInfo from cart store, then destructure it and assign it's component value to different useState redux components.
Then setup submitHandler in which create shippingInfo var. and dispatch saveShippingInfo thunk with this var.
In HTML code fill all those destructured shipping Info component
Initialise stripe component like stripe & elements also other components. fetch multiple info from cart, order, auth.
Then utilise useEffect to check if any error observed, if yes then toast that error.
Setup important vars like order, orderInfo {assign some other value with this} & paymentData.
Then setting up submitHandler in which we are post API req to backend by providing all these info & then waiting for clientSecret which stripe send as part of confirm payment. If we observed an error toast it, else create paymentinfo and dispatch createOrder thunk with order info.
There is nothing much in HTML code as most of the HTML code was provided by Stripe.

###### Dashboard.jsx:
Fetch values from order, auth & order store, then calculate how many product are outOfStock? then utilize useeffect to dispatch getAdminProducts, allOrders & allUsers thunk. 
In HTML code just fill all the fetched values from store.

###### NewProduct.jsx:
create newState for all the required parameter of product, fetch some value from productDetails store, then initialise useEffect in which check if error/success, if success route them to /admin/products url.
Setup submitHandler, in it create formData & add all field including multiple img & then dispatch newProduct with formData
Also we have create onChange specifically for image, as we need to manage multiple images.
In HTML code, setup submitHandler/onChange and submit button.

###### OrderList.jsx:
Fetch multiple values from order store, then setup state for paginationModel. In useEffect hook we are creating currentPage & resPerPage using paginationModel & then dispatch allOrders thunk by providing these values. also check if any error, if isDeleted? Is yes then dispatch deleteOrderReset thunk. we are also setting onClick listner for deleteOrderHandler which will dispatch deleteOrder thunk using it's id.
In HTML code, 1st setup rows & column and then do the pagination setup of 3rd party package MUI datagrid.

###### ProductsList.jsx: Can refer OrderList.jsx
###### UserList.jsx: Can refer OrderList.jsx

###### ProcessOrder.jsx:
Fetch multiple values from order store, then destructure order components & fetch id from URL.
Initialise useEffect in it, dispatch orderDetails using id, check for an error/isUpdated, if isUpdated? then dispatch updateOrderReset thunk. setup submitHandler in it, dispatch updateOrder with id & orderStatus as input.
In HTML code, fill all the req. info including shippingDetails & isPaid which we modified.

###### ProductReviews.jsx:
Fetch certain values from productDetails store, then with useEffect check if productId is not empty then dispatch productReviews with productId. Also check if isDeleted? then dispatch resetDeleteProduct. onCLick deleteReviewHandler, which will dispatch deleteReview thunk with productId & id as input & submitHandler, it'll dispatch productReviews thunk.
Then in HTML code setup rows & column & fill all the required info in HTML to initialise pagination.

###### Sidebar.jsx:
It is a HTML code which contain all the admin related link and ICON

###### UpdateProduct.jsx:
Create newState for all the req product parameter, then fetch values from productDetails store & id from URL.
In useEffect, we will check if productDetails has fetched? if then dispatch getProductDetails & provide id else set all the individual details of product. also check for an error/isUpdated? if isUpdated then route it to /admin/products.
Setup submitHandler & onChange similar to newProduct.jsx, but in this dispatch updateProduct by providing id as additional
In HTML code, fill all the req. details from above parameter.

###### UpdateUser.jsx: Kind off similar to UpdateProduct, except here we dont need onChange function.
