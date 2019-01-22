let http = require('http');
let Router = require('./utils/router');
let url = require('url');
let Configuration = require('./data/configuration');

let configuration = new Configuration();

const server = http.createServer((req, res) => {
    let router = new Router(req, res);
    let pathToCall = router.getCallback(req);
    
    let callback = router.dispatch(pathToCall);
    
    let queryString = url.parse(req.url, true);
    let calledURL = new url.URL(`${configuration.path}${queryString.path}`);

    let searchParams = calledURL.searchParams;
    
    let SQLparams = {
        'fk_portinformer': searchParams.get('id_portinformer'),
        'fk_ship_current_activity': searchParams.get('id_activity')
    };

    callback.methodToCall(res, SQLparams);
     
});


server.listen(configuration.port, configuration.host, () => {
    console.log(`running on ${configuration.path}...`);
});