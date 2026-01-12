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

###### App.jsx - Pending.
We will cover it in last.

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