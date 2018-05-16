# KOA-CAS
## CAS Authentication Middleware for Koa / Koa-router

This middleware is meant to provide authentication for Koa using ![CAS](https://apereo.github.io/cas/4.2.x/protocol/CAS-Protocol.html). It does not depend nor connect with passport.

### Usage

```javascript
var koaCas = require('koa-cas');
var Router = require('koa-router');

var router = new Router();
var cas = koaCas({
    server: "https://cas.example.com", // CAS server
    service: "https://example.com/cas/callback" // Ticket callback
})

router.get('/cas', cas.redirect);
router.get('/cas/callback', cas.callback, controller.login);
```

### Options

| Option | Type | Description |
| --- | --- | --- |
| server | <code>String</code> | Remote CAS Authentication Server |
| service | <code>String</code> | Service Callback url |

### Methods

| Method | Description |
| --- | --- |
| redirect  | Route that will redirect to CAS  |
| callback | Callback Route that will process the ticket |