const Configuration = require('../settings/configuration');
const Mapper = require('../utils/Mapper.js'); 
const QueryManager = require('./query_manager');
const url = require('url');
const sqlLiveData = require('../data/sql/liveData');
const sqlArchiveData = require('../data/sql/archiveData');
const sqlRegisterData = require('../data/sql/dailyRegisterData');

class Router {
    constructor (request, response) {
        this._request = request;
        this._queryString = url.parse(request.url, true);
    }

    getCallback () {
        let configuration = new Configuration();

        this._calledURL = new url.URL(`${configuration.path}${this._queryString.path}`);
        return this._calledURL.pathname;
    }

    dispatch (inputPathName) {
        let configuration = new Configuration();
        let mapper = new Mapper();

        this._calledURL = new url.URL(`${configuration.path}${this._queryString.path}`);
        this._mappedUrl = mapper.getMappedUrl(this);
 
        if ( this._mappedUrl.hasOwnProperty(inputPathName) ) {
            return this._mappedUrl[inputPathName];
        } else {
            return this._mappedUrl['/notFound'];
        }
    }
        
    mooredNow (response, params) {
        let configuration = new Configuration();
        
        const idPortinformer = params.fk_portinformer;
        const idCurrentActivity = params.fk_ship_current_activity;
        const notOperationalStates = configuration.notOperationalStates;

        let query = sqlLiveData.moored(idPortinformer, idCurrentActivity, notOperationalStates);
         
        QueryManager.runSelect(query, response);
    }

    roadsteadNow (response, params) {
        let configuration = new Configuration();

        const idPortinformer = params.fk_portinformer;
        const idCurrentActivity = params.fk_ship_current_activity;
        const notOperationalStates = configuration.notOperationalStates;

        let query = sqlLiveData.roadstead(idPortinformer, idCurrentActivity, notOperationalStates);        
        QueryManager.runSelect(query, response);
    }

    arrivalsNow (response, params) {
        const idPortinformer = params.fk_portinformer;

        let query = sqlLiveData.arrivals(idPortinformer);
        QueryManager.runSelect(query, response);
    }

    departuresNow (response, params) {
        const idPortinformer = params.fk_portinformer;

        let query = sqlLiveData.departures(idPortinformer);
        QueryManager.runSelect(query, response);
    }

    arrivalPrevisionsNow (response, params) {
        const idPortinformer = params.fk_portinformer;
        
        let query = sqlLiveData.arrivalPrevisions(idPortinformer);
        QueryManager.runSelect(query, response);
    }

    activeTripsNow (response, params) {
        let configuration = new Configuration();

        const idPortinformer = params.fk_portinformer;
        const notOperationalStates = configuration.notOperationalStates;

        let query = sqlLiveData.activeTrips(idPortinformer, notOperationalStates);
        QueryManager.runSelect(query, response);
    }

    shippedGoodsNow (response, params) {
        const idPortinformer = params.fk_portinformer;

        let query = sqlLiveData.shippedGoods(idPortinformer);
        QueryManager.runSelect(query, response);
    }
      
    trafficListNow (response, params) {
        const idPortinformer = params.fk_portinformer;
        
        let query = sqlLiveData.trafficList(idPortinformer);
        QueryManager.runSelect(query, response);
    }

    tripsArchive (response, params) {
        const idPortinformer = params.fk_portinformer;

        let query = sqlArchiveData.tripsArchive(idPortinformer);
        QueryManager.runSelect(query, response);
    }

    tripsArchiveMultiRows (response, params) {
        const idPortinformer = params.fk_portinformer;
        const configuration = new Configuration();
        const arrivalPrevisionState = configuration.arrivalPrevisionState;
        const departureState = configuration.departureState;
        let query = sqlArchiveData.tripsArchiveMultiRows(idPortinformer, arrivalPrevisionState, departureState);
        console.log(query);
        QueryManager.runSelect(query, response);
    }

    registerArrivals (response, params) {
        const idPortinformer = params.fk_portinformer;
        
        let query = sqlRegisterData.registerArrivals(idPortinformer);
        QueryManager.runSelect(query, response);
    }

    registerMoored (response, params) {
        const idPortinformer = params.fk_portinformer;
        let configuration = new Configuration();
        let mooringStates = configuration.mooringStates;

        let query = sqlRegisterData.registerMoored(idPortinformer, mooringStates);
        QueryManager.runSelect(query, response);
    }

    registerRoadstead (response, params) {
        const idPortinformer = params.fk_portinformer;
        let configuration = new Configuration();
        let roadsteadStates = configuration.roadsteadStates;

        let query = sqlRegisterData.registerRoadstead(idPortinformer, roadsteadStates);
        QueryManager.runSelect(query, response);
    }

    registerDepartures (response, params) {
        const idPortinformer = params.fk_portinformer;
        let configuration = new Configuration();
        let departureState = configuration.departureState;

        let query = sqlRegisterData.registerDepartures(idPortinformer, departureState);
        QueryManager.runSelect(query, response);
    }

    registerShiftings (response, params) {
        const idPortinformer = params.fk_portinformer;
        let configuration = new Configuration();
        let shiftingStates = configuration.shiftingStates;

        let query = sqlRegisterData.registerShiftings(idPortinformer, shiftingStates);
        QueryManager.runSelect(query, response);
    }

    registerPlannedArrivals (response, params) {
        const idPortinformer = params.fk_portinformer;

        let query = sqlRegisterData.registerPlannedArrivals(idPortinformer);
        QueryManager.runSelect(query, response);
    }

    registerShippedGoods (response, params) {
        const idPortinformer = params.fk_portinformer;

        let query = sqlRegisterData.registerShippedGoods(idPortinformer);
        QueryManager.runSelect(query, response);
    }

    registerTrafficList (response, params) {
        const idPortinformer = params.fk_portinformer;

        let query = sqlRegisterData.registerTrafficList(idPortinformer);
        QueryManager.runSelect(query, response);
    }

    favicon (response) {
        response.statusCode = 200;
        response.end();
    }

    routeNotFound (response, params) {
        console.log('Error: Resource not found!');
        response.statusCode = 404;
        response.end();
    }
}


module.exports = Router;