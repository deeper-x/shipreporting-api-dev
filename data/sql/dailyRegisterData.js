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

let registerDepartures = function (idPortinformer) {
    return `SELECT ts_out_of_sight, imo, ship_description, type_acronym,
            iso3 
            FROM control_unit_data 
            INNER JOIN data_fuori_dal_porto
            ON id_control_unit_data = data_fuori_dal_porto.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND ts_out_of_sight BETWEEN (select current_date - 1||' (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})') AND (select current_date||' (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})')`;
};

let registerShiftings = function (idPortinformer, shiftingStates) {
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
            AND fk_state IN ${shiftingStates}
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

let registerPlannedArrivals = function (idPortinformer) {
    return `SELECT ts_arrival_prevision, imo, ship_description, type_acronym,
            iso3 
            FROM planned_arrivals
            INNER JOIN ships
            ON planned_arrivals.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            WHERE planned_arrivals.fk_portinformer = ${idPortinformer}
            AND ts_arrival_prevision BETWEEN (select current_date - 1||' (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})') AND (select current_date||' (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})')`;
};

let registerShippedGoods = function (idPortinformer) {
    return `SELECT quantity, unit, goods_mvmnt_type, goods_categories.description AS shipped_goods, imo, ship_description AS ship_name, type_acronym,
            iso3, quays.description AS quay, berths.description AS berth 
            FROM control_unit_data 
            INNER JOIN data_avvistamento_nave
            ON id_control_unit_data = data_avvistamento_nave.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            INNER JOIN shipped_goods
            ON id_control_unit_data = shipped_goods.fk_control_unit_data
            INNER JOIN goods_categories
            ON fk_goods_category = id_goods_category
            INNER JOIN quays
            ON fk_operation_quay = id_quay
            INNER JOIN berths
            ON fk_operation_berth = id_berth
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND ts_avvistamento BETWEEN (select current_date - 1||' (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})') AND (select current_date||' (SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})')`;
};

let registerTrafficList = function (idPortinformer) {
    return `SELECT imo, ship_description AS ship_name, type_acronym,
            iso3, num_container, num_passengers, num_camion, num_furgoni, num_rimorchi, num_auto,
            num_moto, num_camper, num_camper, num_bus, num_minibus, traffic_list_mvnt_type AS operation 
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


let dailyRegisterData = {
    registerArrivals: registerArrivals,
    registerMoored: registerMoored,
    registerRoadstead: registerRoadstead,
    registerDepartures: registerDepartures,
    registerShiftings: registerShiftings,
    registerPlannedArrivals: registerPlannedArrivals,
    registerShippedGoods: registerShippedGoods,
    registerTrafficList: registerTrafficList,
};

module.exports = dailyRegisterData;
