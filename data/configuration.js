class Configuration {
    constructor () {
        this._host = '0.0.0.0';
        this._port = 3000;
        this._mooringStates = '(17, 18, 19, 20, 21, 22)';
        this._roadsteadStates = '(16, 19, 25)';
        this._notOperationalStates = '(10, 11, 12)';
    }
    
    get path () {
        return `http://${this._host}:${this._port}`;
    }
    
    get host () {
        return this._host;
    }

    get port () {
        return this._port;
    }

    get mooringStates () {
        return this._mooringStates;
    }

    get roadsteadStates () {
        return this._roadsteadStates;
    }
    
    get notOperationalStates () {
        return this._notOperationalStates;
    }

    getMappedUrl (routerObject) {
        return {
            '/mooredNow': {
                'methodToCall': routerObject.mooredNow,
                'params': [
                    'fk_portinformer', 'fk_ship_current_activity'
                ]
            },
            '/roadsteadNow': {
                'methodToCall': routerObject.roadsteadNow,
                'params': [
                    'fk_portinformer', 'fk_ship_current_activity'
                ],
            },
            '/arrivalsNow': {
                'methodToCall': routerObject.arrivalsNow,
                'params': [
                    'fk_portinformer', 'fk_ship_current_activity'
                ],
            },
            '/departuresNow': {
                'methodToCall': routerObject.departuresNow,
                'params': [
                    'fk_portinformer', 'fk_ship_current_activity'
                ],
            },
            '/arrivalPrevisionsNow': {
                'methodToCall': routerObject.arrivalPrevisionsNow,
                'params': [
                    'fk_portinformer', 'fk_ship_current_activity'
                ],
            },
            '/activeTripsNow': {
                'methodToCall': routerObject.activeTripsNow,
                'params': [
                    'fk_portinformer'
                ],
            },
            '/shippedGoodsNow': {
                'methodToCall': routerObject.shippedGoodsNow,
                'params': [
                    'fk_portinformer'
                ],
            },
            '/trafficListNow': {
                'methodToCall': routerObject.trafficListNow,
                'params': [
                    'fk_portinformer'
                ],
            },
            '/tripsArchive':{
                'methodToCall': routerObject.tripsArchive,
                'params': [
                    'fk_portinformer'
                ]
            },
            '/notFound': {
                'methodToCall': routerObject.routeNotFound,
                'params': []
            },
            '/registerArrivals': {
                'methodToCall': routerObject.registerArrivals,
                'params': ['startTS', 'stopTS']
            },
            '/favicon.ico': {
                'methodToCall': routerObject.favicon
            }
        };
    }
}


module.exports = Configuration;