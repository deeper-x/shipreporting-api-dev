let registerArrivals = function (idPortinformer) {
    return `SELECT ts_avvistamento, imo, ship_description, type_acronym,
    iso3, gross_tonnage, goods_categories.description AS goods_category, 
    groups_categories.description AS goods_group, 
    macro_categories.description AS macro_category, agencies.description AS agency 
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
    ON shipped_goods.fk_control_unit_data = id_control_unit_data
    INNER JOIN goods_categories
    ON id_goods_category = shipped_goods.fk_goods_category
    INNER JOIN groups_categories
    ON id_group = goods_categories.fk_group_category
    INNER JOIN macro_categories
    ON id_macro_category = groups_categories.fk_macro_category
    INNER JOIN agencies
    ON id_agency = data_avvistamento_nave.fk_agency
    WHERE control_unit_data.fk_portinformer = ${idPortinformer}
    AND ts_avvistamento BETWEEN (select current_date - 1||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})) AND (select current_date||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer}))`;
};

let registerMoored = function (idPortinformer, mooringStates) {
    return `SELECT ts_main_event_field_val, imo, ship_description AS ship, type_acronym AS ship_type,
            iso3 AS country, gross_tonnage AS GT, agencies.description AS agency
            FROM control_unit_data 
            INNER JOIN trips_logs
            ON id_control_unit_data = trips_logs.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            INNER JOIN agencies
            ON id_agency = trips_logs.fk_agency
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
    return `SELECT ts_main_event_field_val, imo, ship_description AS ship_name, type_acronym AS ship_type,
            iso3 AS country, agencies.description AS agency, gross_tonnage AS GT 
            FROM control_unit_data 
            INNER JOIN trips_logs
            ON id_control_unit_data = trips_logs.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            INNER JOIN agencies
            ON id_agency = trips_logs.fk_agency
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

let registerDepartures = function (idPortinformer, idDeparture) {
    return `SELECT ts_out_of_sight, imo, ship_description AS ship_name, type_acronym AS ship_type,
            iso3 as country, quays.description AS quay, berths.description AS berth
            FROM control_unit_data 
            INNER JOIN data_fuori_dal_porto
            ON id_control_unit_data = data_fuori_dal_porto.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            INNER JOIN trips_logs
            ON id_control_unit_data = trips_logs.fk_control_unit_data
            INNER JOIN maneuverings
            ON id_maneuvering = trips_logs.fk_maneuvering
            INNER JOIN quays
            ON quays.id_quay = maneuverings.fk_start_quay
            INNER JOIN berths
            ON berths.id_berth = maneuverings.fk_start_berth
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND trips_logs.fk_state = ${idDeparture}
            AND ts_out_of_sight BETWEEN (select current_date - 1||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})) AND (select current_date||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer}))`;
};

let registerShiftings = function (idPortinformer, shiftingStates) {
    return `SELECT ts_main_event_field_val, imo, ship_description AS ship_name, 
            type_acronym AS ship_type, iso3 AS country, 
            start_quay.description||'/'||start_berth.description as FROM_QUAY,
            stop_quay.description||'/'||stop_berth.description as TO_QUAY,
            start_anchorage.description as FROM_ANCH,
            stop_anchorage.description as TO_ANCH                 
            FROM control_unit_data 
            INNER JOIN trips_logs
            ON id_control_unit_data = trips_logs.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            INNER JOIN maneuverings
            ON id_maneuvering = trips_logs.fk_maneuvering
            INNER JOIN (
                SELECT id_quay, description 
                FROM quays 
            ) AS start_quay
            ON start_quay.id_quay = maneuverings.fk_start_quay
            INNER JOIN (
                SELECT id_quay, description 
                FROM quays 
            ) AS stop_quay
            ON stop_quay.id_quay = maneuverings.fk_stop_quay
            INNER JOIN (
                SELECT id_berth, description
                FROM berths
            ) AS start_berth
            ON start_berth.id_berth = maneuverings.fk_start_berth
            INNER JOIN (
                SELECT id_berth, description
                FROM berths
            ) AS stop_berth
            ON stop_berth.id_berth = maneuverings.fk_stop_berth
            INNER JOIN (
                SELECT id_anchorage_point, description
                FROM anchorage_points
            ) AS start_anchorage
            ON start_anchorage.id_anchorage_point = maneuverings.fk_start_anchorage_point
            INNER JOIN (
                SELECT id_anchorage_point, description
                FROM anchorage_points
            ) AS stop_anchorage
            ON stop_anchorage.id_anchorage_point = maneuverings.fk_stop_anchorage_point
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND trips_logs.fk_state IN ${shiftingStates}
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
    return `SELECT ts_arrival_prevision AS arrival_prevision, imo, ship_description AS ship_name, 
            type_acronym AS ship_type, iso3 AS country, quays.description AS quay, berths.description AS berth,
            agencies.description, gross_tonnage  
            FROM planned_arrivals
            INNER JOIN ships
            ON planned_arrivals.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            INNER JOIN quays
            ON planned_arrivals.fk_stop_quay = quays.id_quay
            INNER JOIN berths
            ON planned_arrivals.fk_stop_berth = berths.id_berth
            INNER JOIN agencies
            ON planned_arrivals.fk_agency = agencies.id_agency
            WHERE planned_arrivals.fk_portinformer = ${idPortinformer}
            AND ts_arrival_prevision BETWEEN (select current_date - 1||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})) AND (select current_date||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer}))`;
};

let registerShippedGoods = function (idPortinformer) {
    return `SELECT CASE WHEN quantity = '' THEN '0' ELSE quantity END, unit, goods_mvmnt_type, goods_categories.description AS shipped_goods, 
            imo, ship_description AS ship_name, type_acronym,
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
            AND ts_avvistamento BETWEEN (select current_date - 1||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})) AND (select current_date||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer}))`;
};

let registerTrafficList = function (idPortinformer) {
    return `SELECT imo, ship_description AS ship_name, type_acronym,
            iso3, num_container, num_passengers, num_camion, num_furgoni, num_rimorchi, num_auto,
            num_moto, num_camper, num_camper, num_bus, num_minibus, traffic_list_mvnt_type AS operation,
            tons, traffic_list_categories.description as traffic_list_category 
            FROM control_unit_data 
            INNER JOIN data_avvistamento_nave
            ON id_control_unit_data = data_avvistamento_nave.fk_control_unit_data
            INNER JOIN ships
            ON control_unit_data.fk_ship = id_ship
            INNER JOIN ship_types
            ON id_ship_type = fk_ship_type
            INNER JOIN countries
            ON ships.fk_country_flag = id_country
            INNER JOIN traffic_list
            ON traffic_list.fk_control_unit_data = id_control_unit_data
            LEFT JOIN traffic_list_categories
            ON traffic_list.fk_traffic_list_category = traffic_list.id_traffic_list
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND ts_avvistamento BETWEEN (select current_date - 1||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer})) AND (select current_date||' '||(SELECT day_start_time FROM portinformers WHERE id_portinformer = ${idPortinformer}))`;
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
