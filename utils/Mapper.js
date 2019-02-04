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
            '/registerMoored': {
                'methodToCall': routerObject.registerMoored,
                'params': ['fk_portinformer']
            },
            '/registerRoadstead': {
                'methodToCall': routerObject.registerRoadstead,
                'params': ['fk_portinformer']
            },
            '/registerDepartures': {
                'methodToCall': routerObject.registerDepartures,
                'params': ['fk_portinformer']
            },
            '/registerShiftings': {
                'methodToCall': routerObject.registerShiftings,
                'params': ['fk_portinformer']
            },
            '/registerPlannedArrivals': {
                'methodToCall': routerObject.registerPlannedArrivals,
                'params': ['fk_portinformer']
            },
            '/registerShippedGoods': {
                'methodToCall': routerObject.registerShippedGoods,
                'params': ['fk_portinformer']
            },
            '/favicon.ico': {
                'methodToCall': routerObject.favicon
            }
        };
    }
}

module.exports = Mapper;
