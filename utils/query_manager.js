const databaseConfig = require('../settings/db_auth');
const {Pool, Client} = require('pg');

const pool = new Pool(databaseConfig);

class QueryManager {
    static runSelect (query, response) {
        (() => {
            pool.connect()
                .then(
                    client => {
                        return client.query(query)
                            .then(res => {                                
                                response.end(JSON.stringify(res.rows));
                                client.release();
                            })
                            .catch(e=>{
                                client.release();
                                console.log(e.stack);
                            });
                    });
        })();
    }

}

module.exports = QueryManager;
