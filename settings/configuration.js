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
}


module.exports = Configuration;

