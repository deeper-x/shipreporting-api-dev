const Configuration = require('../data/configuration'); 
const QueryManager = require('./query_manager');
const url = require('url');
const sqlLiveData = require('../data/sql/liveData');

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
        this._calledURL = new URL(`${configuration.path}${this._queryString.path}`);
        this._mappedUrl = configuration.getMappedUrl(this);
 
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

    favicon (response) {
        response.statusCode = 200;
        response.end();
    }

    routeNotFound (response, params) {
        console.log('error: Resource not found!');
        response.statusCode = 404;
        response.end();
    }
}


module.exports = Router;