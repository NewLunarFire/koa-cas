const superagent = require('superagent');
const xml2js = require("xml-js").xml2js;

module.exports = function(options) {
    return {
        'redirect': async function(ctx, next) {
            ctx.response.status = 302;
            ctx.response.set('Location', options.server + '/login?service=' + encodeURIComponent(options.service));
        },
        'callback': async function(ctx, next) {
            if(!ctx.request.query.ticket)
                throw new Error("Error: Missing ticket");

            const uri = options.server + '/serviceValidate?ticket=' + ctx.request.query.ticket + '&service=' + encodeURIComponent(options.service);
            
            const res = await superagent
                .post(uri)
                .set("Accept-Language", 'en-us');
            
            const casResponse = xml2js(res.text, {compact: true});
        
            if(casResponse["cas:serviceResponse"] && casResponse["cas:serviceResponse"]["cas:authenticationSuccess"]) {
                ctx.cas = { user: {} };
                const attributes = casResponse["cas:serviceResponse"]["cas:authenticationSuccess"]["cas:attributes"];
                
                Object
                    .keys(attributes)
                    .forEach((key) => ctx.cas.user[key.substr(4)] = attributes[key]["_text"]);
                
                await next();
            } else {
                throw new Error("Error: Authentication failed");
            }
        }
    }
}