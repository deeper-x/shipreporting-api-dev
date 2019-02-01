class Mapper {
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
                'params': ['fk_portinformer']
            },
            '/favicon.ico': {
                'methodToCall': routerObject.favicon
            }
        };
    }
}

module.exports = Mapper;
