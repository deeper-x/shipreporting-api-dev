class Configuration {
    constructor () {
        this._host = '0.0.0.0';
        this._port = 3000;
        this._mooringStates = '(17, 18, 19, 20, 21, 22)';
        this._roadsteadStates = '(16, 19, 25)';
        this._notOperationalStates = '(10, 11, 12)';
        this._shiftingStates = '(18, 19, 20, 21, 22)';
        this._departureState = '26';
        this._arrivalPrevisionState = '10';
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

    get shiftingStates () {
        return this._shiftingStates;
    }
    
    get roadsteadStates () {
        return this._roadsteadStates;
    }

    get departureState () {
        return this._departureState;
    }

    get arrivalPrevisionState () {
        return this._arrivalPrevisionState;
    }
    
    get notOperationalStates () {
        return this._notOperationalStates;
    }
}


module.exports = Configuration;

