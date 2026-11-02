const  {Router}=require("express")
const callback=require("../controllers/route_countrollers")

const route=Router()


//initial login step
route.get("/form",callback.form)


//creating the user account 
route.post("/signup",callback.signup)


//user getting in
route.get("/signin",callback.signin)

//finding the user using the email
route.post("/findemail",callback.findemail)

//serving login page
route.get("/login",callback.login)

route.get("/errorpage",callback.errorpage)

route.post("/form/resetpassword",callback.resetpassword)

route.get("/checkingvalidity/:token",callback.checkingvalidity)

route.post("/verification",callback.verification)


//reset password routes
route.post("/resetpassword",callback.resetpassword)
route.get("/resetpasswordpage",callback.resetpasswordpage)
route.post("/hashresetpassword/:token",callback.hashresetpassword)

//after password update
route.get("/success",callback.success)

module.exports=route





// What express.json() does
// By default, Express does not know how 
// to read a JSON body — req.body would be
//  undefined without this middleware. Adding 
//  it tells Express: "whenever a request comes 
//  in with Content-Type: application/json, parse that
//  body and put the result in req.body."


// https://yoursite.com/verify-token/abc123  this complete is the url
//    ↑         ↑            ↑        ↑
// protocol   domain       path    token


// ┌───────────────────────────────────────┐
// │ URL:  /verify-token/abc123             │  ← one separate piece
// └───────────────────────────────────────┘

// ┌───────────────────────────────────────┐
// │ BODY: {"password":"newpass123"}        │  ← a completely different, separate piece
// └───────────────────────────────────────┘


// ┌─────────────────────────────────────────┐
// │         HTTP REQUEST                      │  ← this whole thing is called
// │                                            │     "the HTTP request"
// │  POST /verify-token/abc123 HTTP/1.1      │
// │  Host: yoursite.com                       │
// │  Content-Type: application/json          │
// │                                            │
// │  {"password":"newpass123"}                │
// │                                            │
// └─────────────────────────────────────────┘




// Key difference: GET vs POST
// 	Typing a URL / clicking a link	Your fetch() with method: "POST"
// Method	GET (default)	POST (you set it explicitly)
// Body	Usually none	Yes — you attach one
// Purpose	"Give me this page"	"Here's data, do something with it"



// 1. Query String (?token=abc123)
// How it's created (client side)

// You build the URL by appending ?key=value directly to it:

// javascript
// // Option A: manually
// fetch("/verify-token?token=abc123")

// // Option B: build it dynamically
// const token = "abc123"
// fetch("/verify-token?token=" + token)

// // Option C: using URLSearchParams to build it safely (handles special characters)
// const params = new URLSearchParams({ token: "abc123" })
// fetch("/verify-token?" + params.toString())
// // same result: /verify-token?token=abc123

// You can also add multiple values:

// javascript
// fetch("/verify-token?token=abc123&debug=true")
// How it's used (server side — Express)

// No special route setup needed — req.query always works automatically:

// javascript
// app.post("/verify-token", (req, res) => {
//     const token = req.query.token   // "abc123"
//     const debug = req.query.debug   // "true" (as a string, not boolean!)
//     console.log(token)
// })
// When to use this style
// Good for optional, non-sensitive values (filters, pagination, search terms)
// Visible in browser history/logs — avoid for sensitive data like passwords
// 2. Route Param (/verify-token/abc123)
// How it's created (client side)

// You literally build the token into the path string:

// javascript
// const token = "abc123"
// fetch("/verify-token/" + token)
// // sends request to: /verify-token/abc123
// How it's used (server side — Express)

// This one requires special route setup — you must add a :placeholder in your route path:

// javascript
// // Notice the ":token" in the route path — this tells Express "capture this part"
// app.post("/verify-token/:token", (req, res) => {
//     const token = req.params.token   // "abc123"
//     console.log(token)
// })

// If you forget the :token in the route definition, this won't work — Express won't know to capture that piece of the URL.

// You can even have multiple route params:

// javascript
// app.post("/user/:userId/reset/:token", (req, res) => {
//     const userId = req.params.userId
//     const token = req.params.token
// })

// For URL: /user/42/reset/abc123

// When to use this style
// Good for identifying a specific resource in a clean, readable way (e.g. /users/42, /posts/99)
// Common in REST APIs
// Still visible in browser history/logs — not ideal for secrets
// 3. Body (POST) — token hidden inside the request body
// How it's created (client side)

// The URL stays plain — the token goes inside body:, not the URL:

// javascript
// const token = "abc123"

// fetch("/verify-token", {
//     method: "POST",
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify({ token: token })
// })
// How it's used (server side — Express)

// Requires the JSON-parsing middleware first:

// javascript
// app.use(express.json())   // ← REQUIRED, or req.body will be undefined

// app.post("/verify-token", (req, res) => {
//     const token = req.body.token   // "abc123"
//     console.log(token)
// })

// No special route path setup needed here (unlike route params) — just a plain route:

// javascript
// app.post("/verify-token", ...)   // no ":token" needed
// When to use this style
// Best for sensitive data (passwords, tokens, personal info) — not stored in browser history or most server logs
// Only works with methods that support a body: POST, PUT, PATCH (not GET)