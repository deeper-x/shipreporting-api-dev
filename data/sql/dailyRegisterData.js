let registerArrivals = function (idPortinformer) {
    return `SELECT ts_avvistamento, imo, ship_description, type_acronym,
            iso3 
            FROM control_unit_data 
            INNER JOIN data_avvistamento_nave
            ON id_control_unit_data = data_avvistamento_nave.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND ts_avvistamento BETWEEN (select current_date - 1||' (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})') AND (select current_date||' (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})')`;
};

let registerMoored = function (idPortinformer, mooringStates) {
    return `SELECT ts_main_event_field_val, imo, ship_description, type_acronym,
            iso3 
            FROM control_unit_data 
            INNER JOIN trips_logs
            ON id_control_unit_data = trips_logs.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND fk_state IN ${mooringStates}
            AND ts_main_event_field_val 
            BETWEEN 
            (select current_date - 1||' 
                                        (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})
                                      ') 
            AND 
            (select current_date||' 
                                   (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer}
                                  ')
            ORDER BY ts_main_event_field_val DESC LIMIT 1`;
};

let registerRoadstead = function (idPortinformer, roadsteadStates) {
    return `SELECT ts_main_event_field_val, imo, ship_description, type_acronym,
            iso3 
            FROM control_unit_data 
            INNER JOIN trips_logs
            ON id_control_unit_data = trips_logs.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND fk_state IN ${roadsteadStates}
            AND ts_main_event_field_val 
            BETWEEN 
            (select current_date - 1||' 
                                        (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})
                                    ') 
            AND 
            (select current_date||' 
                                (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer}
                                ')
            ORDER BY ts_main_event_field_val DESC LIMIT 1`;
};

let dailyRegisterData = {
    registerArrivals: registerArrivals,
    registerMoored: registerMoored,
    registerRoadstead: registerRoadstead,
};

module.exports = dailyRegisterData;
