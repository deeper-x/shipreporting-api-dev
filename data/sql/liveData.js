let moored = function (idPortinformer, idCurrentActivity, notOperationalStates) {
    return `SELECT RES.fk_control_unit_data as id_trip, ship_description as ship, 
        ts_main_event_field_val, quays.description as quay, berths.description as berth, 
        type_acronym as ship_type, iso3, gross_tonnage, ships.length, ships.width,
        ports.name as port, agencies.description as agency, 
        shipped_goods_data.shipped_goods_row AS shipped_goods_data,
        traffic_list_data.traffic_list_details AS traffic_list_details
        FROM (  
            SELECT fk_control_unit_data, MAX(ts_main_event_field_val) AS max_time, fk_portinformer
            FROM trips_logs
            WHERE fk_state NOT IN ${notOperationalStates}
            GROUP BY fk_control_unit_data, fk_portinformer
            ) 
        AS RES
        INNER JOIN trips_logs AS TL 
        ON RES.fk_control_unit_data = TL.fk_control_unit_data
        INNER JOIN agencies
        ON TL.fk_agency = agencies.id_agency
        INNER JOIN maneuverings
        ON TL.fk_maneuvering = maneuverings.id_maneuvering
        INNER JOIN quays
        ON maneuverings.fk_stop_quay = quays.id_quay
        INNER JOIN berths
        ON maneuverings.fk_stop_berth = berths.id_berth
        INNER JOIN control_unit_data
        ON control_unit_data.id_control_unit_data = TL.fk_control_unit_data
        INNER JOIN shipping_details
        ON shipping_details.id_shipping_details = control_unit_data.fk_shipping_details
        LEFT JOIN (
            SELECT fk_control_unit_data, string_agg(goods_mvmnt_type||'->'||goods_categories.description::TEXT||'-'||groups_categories.description, ', ') AS shipped_goods_row
            FROM shipped_goods
            INNER JOIN goods_categories
            ON goods_categories.id_goods_category = shipped_goods.fk_goods_category
            INNER JOIN groups_categories
            ON groups_categories.id_group = goods_categories.fk_group_category
            GROUP BY fk_control_unit_data        
        ) as shipped_goods_data
        ON shipped_goods_data.fk_control_unit_data = control_unit_data.id_control_unit_data
        LEFT JOIN (
                SELECT fk_control_unit_data, string_agg(traffic_list_mvnt_type||'-'||description, '-') AS traffic_list_details
                FROM traffic_list
                INNER JOIN traffic_list_categories
                ON traffic_list_categories.id_traffic_list_category = traffic_list.fk_traffic_list_category
                GROUP BY fk_control_unit_data
        ) AS traffic_list_data
        ON control_unit_data.id_control_unit_data = traffic_list_data.fk_control_unit_data
        INNER JOIN ports
        ON shipping_details.fk_port_provenance = ports.id_port 
        INNER JOIN ships
        ON control_unit_data.fk_ship = id_ship
        INNER JOIN ship_types
        ON ships.fk_ship_type = ship_types.id_ship_type
        INNER JOIN countries
        ON countries.id_country = ships.fk_country_flag 
        AND ts_main_event_field_val = max_time
        WHERE control_unit_data.fk_portinformer = ${idPortinformer}
        AND fk_ship_current_activity = ${idCurrentActivity}
        AND is_active = true
        GROUP BY id_trip, ts_main_event_field_val, ship, 
        quay, berth, ship_type, iso3, gross_tonnage, ships.length, 
        ships.width, port, agency, shipped_goods_row, traffic_list_details
        ORDER BY RES.fk_control_unit_data`;
};  

let roadstead = function (idPortinformer, idCurrentActivity, notOperationalStates) {
    return `SELECT RES.fk_control_unit_data as id_trip, ship_description as ship, 
        ts_main_event_field_val, anchorage_points.description as anchorage_point, 
        type_acronym as ship_type, iso3, gross_tonnage, ships.length, ships.width,
        ports.name as port, agencies.description as agency, 
        shipped_goods_data.shipped_goods_row AS shipped_goods_data,
        traffic_list_data.traffic_list_details AS traffic_list_details
        FROM (  
            SELECT fk_control_unit_data, MAX(ts_main_event_field_val) AS max_time, fk_portinformer
            FROM trips_logs
            WHERE fk_state NOT IN ${notOperationalStates}
            GROUP BY fk_control_unit_data, fk_portinformer
            ) 
        AS RES
        INNER JOIN trips_logs AS TL 
        ON RES.fk_control_unit_data = TL.fk_control_unit_data
        INNER JOIN agencies
        ON TL.fk_agency = agencies.id_agency
        INNER JOIN maneuverings
        ON TL.fk_maneuvering = maneuverings.id_maneuvering
        INNER JOIN anchorage_points
        ON maneuverings.fk_stop_anchorage_point = anchorage_points.id_anchorage_point
        INNER JOIN control_unit_data
        ON control_unit_data.id_control_unit_data = TL.fk_control_unit_data
        INNER JOIN shipping_details
        ON shipping_details.id_shipping_details = control_unit_data.fk_shipping_details
        LEFT JOIN (
            SELECT fk_control_unit_data, string_agg(goods_mvmnt_type||'->'||goods_categories.description::TEXT||'-'||groups_categories.description, ', ') AS shipped_goods_row
            FROM shipped_goods
            INNER JOIN goods_categories
            ON goods_categories.id_goods_category = shipped_goods.fk_goods_category
            INNER JOIN groups_categories
            ON groups_categories.id_group = goods_categories.fk_group_category
            GROUP BY fk_control_unit_data        
        ) as shipped_goods_data
        ON shipped_goods_data.fk_control_unit_data = control_unit_data.id_control_unit_data
        LEFT JOIN (
            SELECT fk_control_unit_data, string_agg(traffic_list_mvnt_type, '-') AS traffic_list_details
            FROM traffic_list
            INNER JOIN traffic_list_categories
            ON id_traffic_list_category = fk_traffic_list_category
            GROUP BY fk_control_unit_data
        ) AS traffic_list_data
        ON control_unit_data.id_control_unit_data = traffic_list_data.fk_control_unit_data
        INNER JOIN ports
        ON shipping_details.fk_port_provenance = ports.id_port 
        INNER JOIN ships
        ON control_unit_data.fk_ship = id_ship
        INNER JOIN ship_types
        ON ships.fk_ship_type = ship_types.id_ship_type
        INNER JOIN countries
        ON countries.id_country = ships.fk_country_flag 
        AND ts_main_event_field_val = max_time
        WHERE control_unit_data.fk_portinformer = ${idPortinformer}
        AND fk_ship_current_activity = ${idCurrentActivity}
        AND is_active = true
        GROUP BY id_trip, ts_main_event_field_val, ship, 
        anchorage_point, ship_type, iso3, gross_tonnage, ships.length, 
        ships.width, port, agency, shipped_goods_row, traffic_list_details
        ORDER BY RES.fk_control_unit_data`;
};


let arrivalPrevisions = function (idPortinformer) {
    return `SELECT id_planned_arrival, 
        ship_description AS ship_name,
        type_acronym as ship_type, iso3, gross_tonnage, ships.length, ships.width,
        ports.name as port, agencies.description as agency,  
        ts_arrival_prevision, planned_goods_data.shipped_goods_row,
        quays.description as quay, berths.description as berth, 
        anchorage_points.description as anchorage_point
        FROM planned_arrivals
        INNER JOIN (
            SELECT fk_planned_arrival, string_agg(goods_mvmnt_type||'->'||goods_categories.description::TEXT||'-'||groups_categories.description, ', ') AS shipped_goods_row
            FROM planned_goods
            INNER JOIN goods_categories
            ON goods_categories.id_goods_category = planned_goods.fk_goods_category
            INNER JOIN groups_categories
            ON groups_categories.id_group = goods_categories.fk_group_category
            GROUP BY fk_planned_arrival
        ) as planned_goods_data
        ON planned_goods_data.fk_planned_arrival = id_planned_arrival
        INNER JOIN quays
        ON planned_arrivals.fk_stop_quay = quays.id_quay
        INNER JOIN berths
        ON planned_arrivals.fk_stop_berth = berths.id_berth
        INNER JOIN anchorage_points
        ON planned_arrivals.fk_stop_anchorage_point = anchorage_points.id_anchorage_point
        INNER JOIN ports
        ON fk_last_port_of_call = ports.id_port 
        INNER JOIN ships
        ON planned_arrivals.fk_ship = id_ship
        INNER JOIN agencies
        ON planned_arrivals.fk_agency = agencies.id_agency
        INNER JOIN ship_types
        ON ships.fk_ship_type = ship_types.id_ship_type
        INNER JOIN countries
        ON countries.id_country = ships.fk_country_flag
        WHERE planned_arrivals.fk_portinformer = ${idPortinformer}
        AND LENGTH(ts_arrival_prevision) > 4
        AND is_active = true`;
};

let arrivals = function (idPortinformer, idArrivalPrevision) {
    return `SELECT id_control_unit_data AS id_trip, 
    ships.ship_description AS ship_name, 
    ship_types.type_acronym AS ship_type,  
    data_avvistamento_nave.ts_avvistamento AS ts_sighting, 
    countries.iso3 AS ship_flag,
    ships.width AS ship_width,
    ships.length AS ship_length,
    ships.gross_tonnage AS gross_tonnage,
    ships.net_tonnage AS net_tonnage,
    maneuverings.draft_aft AS draft_aft,
    maneuverings.draft_fwd AS draft_fwd,
    agencies.description AS agency,
    last_port_of_call.port_name||'('||last_port_of_call.port_country||')' AS last_port_of_call,
    port_destination.port_name||'('||port_destination.port_country||')' AS port_destination,
    quays.description AS destination_quay_berth
    FROM control_unit_data
    INNER JOIN data_avvistamento_nave
    ON data_avvistamento_nave.fk_control_unit_data = id_control_unit_data
    INNER JOIN ships
    ON control_unit_data.fk_ship = ships.id_ship
    INNER JOIN ship_types
    ON ships.fk_ship_type = ship_types.id_ship_type
    INNER JOIN countries
    ON ships.fk_country_flag = countries.id_country
    INNER JOIN maneuverings
    ON maneuverings.fk_control_unit_data = control_unit_data.id_control_unit_data
    AND maneuverings.fk_state = ${idArrivalPrevision}
    INNER JOIN agencies
    ON data_avvistamento_nave.fk_agency = agencies.id_agency
    INNER JOIN shipping_details
    ON control_unit_data.fk_shipping_details = shipping_details.id_shipping_details
    INNER JOIN (
        SELECT id_port, ports.name AS port_name, ports.country AS port_country
        FROM ports
    ) AS last_port_of_call
    ON shipping_details.fk_port_provenance = last_port_of_call.id_port
    INNER JOIN (
        SELECT id_port, ports.name AS port_name, ports.country AS port_country
        FROM ports
    ) AS port_destination
    ON shipping_details.fk_port_destination = port_destination.id_port
    LEFT JOIN quays
    ON maneuverings.fk_stop_quay = quays.id_quay
    AND maneuverings.fk_state = ${idArrivalPrevision}
    LEFT JOIN berths
    ON maneuverings.fk_stop_berth = berths.id_berth
    AND maneuverings.fk_state = ${idArrivalPrevision}
    WHERE control_unit_data.fk_portinformer = ${idPortinformer}
    AND LENGTH(ts_avvistamento) > 0
        AND ts_avvistamento::DATE = current_date`;
};

let departures = function (idPortinformer, idDepartureState) {
    return `SELECT id_control_unit_data AS id_trip, 
                ships.ship_description AS ship_name, 
                ship_types.type_acronym AS ship_type,  
                data_fuori_dal_porto.ts_out_of_sight AS ts_out_of_sight, 
                countries.iso3 AS ship_flag,
                ships.width AS ship_width,
                ships.length AS ship_length,
                ships.gross_tonnage AS gross_tonnage,
                ships.net_tonnage AS net_tonnage,
                maneuverings.draft_aft AS draft_aft,
                maneuverings.draft_fwd AS draft_fwd,
                agencies.description AS agency,
                last_port_of_call.port_name||'('||last_port_of_call.port_country||')' AS last_port_of_call,
                port_destination.port_name||'('||port_destination.port_country||')' AS port_destination
                FROM control_unit_data
                INNER JOIN data_fuori_dal_porto
                ON data_fuori_dal_porto.fk_control_unit_data = id_control_unit_data
                INNER JOIN ships
                ON control_unit_data.fk_ship = ships.id_ship
                INNER JOIN ship_types
                ON ships.fk_ship_type = ship_types.id_ship_type
                INNER JOIN countries
                ON ships.fk_country_flag = countries.id_country
                INNER JOIN maneuverings
                ON maneuverings.fk_control_unit_data = control_unit_data.id_control_unit_data
                AND maneuverings.fk_state = ${idDepartureState}
                INNER JOIN agencies
                ON data_fuori_dal_porto.fk_agency = agencies.id_agency
                INNER JOIN shipping_details
                ON control_unit_data.fk_shipping_details = shipping_details.id_shipping_details
                INNER JOIN (
                        SELECT id_port, ports.name AS port_name, ports.country AS port_country
                        FROM ports
                ) AS last_port_of_call
                ON shipping_details.fk_port_provenance = last_port_of_call.id_port
                INNER JOIN (
                        SELECT id_port, ports.name AS port_name, ports.country AS port_country
                        FROM ports
                ) AS port_destination
                ON shipping_details.fk_port_destination = port_destination.id_port
                WHERE control_unit_data.fk_portinformer = ${idPortinformer}
                AND ts_out_of_sight IS NOT NULL
                AND ts_out_of_sight != 'None'
                AND LENGTH(ts_out_of_sight) > 0
        AND ts_out_of_sight::DATE = current_date`;
};

let activeTrips = function (idPortinformer, notOperationalStates) {
    return `SELECT ships.ship_description AS ship_name,
        ship_types.type_description||'('||ship_types.type_acronym||')' AS ship_type,
        ships.length AS length, ships.width AS width, ships.gross_tonnage AS gross_tonnage,
        ships.net_tonnage AS net_tonnage,
        ship_current_activities.description||': '||last_trip_ts AS details 
        FROM control_unit_data INNER JOIN ships
        ON fk_ship = id_ship
        INNER JOIN ship_current_activities
        ON fk_ship_current_activity = id_activity
        INNER JOIN (
            SELECT fk_control_unit_data, MAX(ts_main_event_field_val) AS last_trip_ts
            FROM trips_logs INNER JOIN control_unit_data
            ON id_control_unit_data = fk_control_unit_data
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND fk_state NOT IN ${notOperationalStates}
            GROUP BY fk_control_unit_data
        ) as last_trip_log
        ON last_trip_log.fk_control_unit_data = id_control_unit_data
        INNER JOIN ship_types
        ON ships.fk_ship_type = ship_types.id_ship_type
        WHERE is_active  = true
        and fk_portinformer = ${idPortinformer}`;
};


let shippedGoods = function (idPortinformer) {
    return `SELECT ships.ship_description AS ship_name, 
        quantity, 
        unit, 
        goods_categories.description AS goods_category,
        ship_types.type_acronym AS ship_type,  
        countries.iso3 AS ship_flag,
        ships.width AS ship_width,
        ships.length AS ship_length,
        ships.gross_tonnage AS gross_tonnage,
        ships.net_tonnage AS net_tonnage,
        groups_categories.description AS group_category                 
        FROM shipped_goods INNER JOIN control_unit_data
        ON fk_control_unit_data = id_control_unit_data
        INNER JOIN goods_categories
        ON fk_goods_category = id_goods_category
        INNER JOIN ships
        ON control_unit_data.fk_ship = id_ship
        INNER JOIN countries
        ON ships.fk_country_flag = id_country
        INNER JOIN ship_types
        ON ships.fk_ship_type = ship_types.id_ship_type
        INNER JOIN groups_categories
        ON goods_categories.fk_group_category = groups_categories.id_group
        WHERE control_unit_data.fk_portinformer = ${idPortinformer}
        AND control_unit_data.is_active = true`;
};

let trafficList = function (idPortinformer) {
    return `SELECT ships.ship_description, num_container, num_passengers, num_camion, 
                num_furgoni, num_rimorchi, num_auto, num_moto, num_camper, tons,
                num_bus, num_minibus, traffic_list_mvnt_type, traffic_list_categories.description,
                quays.description AS quay
                FROM traffic_list INNER JOIN control_unit_data
                ON fk_control_unit_data = id_control_unit_data
                INNER JOIN traffic_list_categories
                ON fk_traffic_list_category = id_traffic_list_category
                INNER JOIN ships
                ON control_unit_data.fk_ship = id_ship
                INNER JOIN maneuverings
                ON maneuverings.fk_control_unit_data = control_unit_data.id_control_unit_data
                AND maneuverings.fk_state = 17
                INNER JOIN quays
                ON maneuverings.fk_stop_quay = quays.id_quay
                WHERE control_unit_data.fk_portinformer = ${idPortinformer}
                AND control_unit_data.is_active = true`;
};

let liveData = {
    moored: moored,
    roadstead: roadstead,
    arrivals: arrivals,
    departures: departures,
    arrivalPrevisions: arrivalPrevisions,
    activeTrips: activeTrips,
    shippedGoods: shippedGoods,
    trafficList: trafficList
};


module.exports = liveData;