let tripsArchive = function (idPortinformer) {
    return `SELECT 
            id_control_unit_data AS id_trip,
            control_unit_data.is_active::text AS in_progress,
            shipping_details.ts_arrival AS arrival,
            shipping_details.ts_departure AS departure,
            ship_description AS ship,
            shipped_goods_details_loaded,
            shipped_goods_details_unloaded,
            shipped_goods_details_transit
            FROM control_unit_data INNER JOIN ships
            ON control_unit_data.fk_ship = ships.id_ship
            INNER JOIN shipping_details
            ON control_unit_data.fk_shipping_details = id_shipping_details
            LEFT JOIN ( 
                SELECT fk_control_unit_data, string_agg(goods_categories.description||' '||shipped_goods.quantity||''||shipped_goods.unit||' ['||quays.description||'-'||berths.description||']' , '<br />')
                AS shipped_goods_details_loaded
                FROM shipped_goods INNER JOIN goods_categories
                ON fk_goods_category = id_goods_category
                INNER JOIN quays
                ON shipped_goods.fk_operation_quay = id_quay
                INNER JOIN berths
                ON shipped_goods.fk_operation_berth = id_berth
                WHERE shipped_goods.goods_mvmnt_type = 'LO'
                GROUP BY fk_control_unit_data
            ) AS shipped_goods_data_loaded            
            ON shipped_goods_data_loaded.fk_control_unit_data = id_control_unit_data
            LEFT JOIN ( 
                SELECT fk_control_unit_data, string_agg(goods_categories.description||' '||shipped_goods.quantity||''||shipped_goods.unit||' ['||quays.description||'-'||berths.description||']' , '<br />')
                AS shipped_goods_details_unloaded
                FROM shipped_goods INNER JOIN goods_categories
                ON fk_goods_category = id_goods_category
                INNER JOIN quays
                ON shipped_goods.fk_operation_quay = id_quay
                INNER JOIN berths
                ON shipped_goods.fk_operation_berth = id_berth
                WHERE shipped_goods.goods_mvmnt_type = 'UN'
                GROUP BY fk_control_unit_data
            ) AS shipped_goods_data_unloaded            
            ON shipped_goods_data_unloaded.fk_control_unit_data = id_control_unit_data
            LEFT JOIN ( 
                SELECT fk_control_unit_data, string_agg(goods_categories.description||' '||shipped_goods.quantity||''||shipped_goods.unit||' ['||quays.description||'-'||berths.description||']' , '<br />')
                AS shipped_goods_details_transit
                FROM shipped_goods INNER JOIN goods_categories
                ON fk_goods_category = id_goods_category
                INNER JOIN quays
                ON shipped_goods.fk_operation_quay = id_quay
                INNER JOIN berths
                ON shipped_goods.fk_operation_berth = id_berth
                WHERE shipped_goods.goods_mvmnt_type = 'TR'
                GROUP BY fk_control_unit_data
            ) AS shipped_goods_data_transit            
            ON shipped_goods_data_transit.fk_control_unit_data = id_control_unit_data
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}`;
};


let tripsArchiveMultiRows = function (idPortinformer, arrivalPrevisionState, departureState) {
    return `SELECT id_control_unit_data, ships.ship_description AS ship_name,
            ships.length AS length, ships.width AS width, ships.gross_tonnage AS gross_tonnage,
            ships.net_tonnage AS net_tonnage,
            arrival_agency.description AS agency_arrival, countries.iso3 AS ship_flag,
            goods_mvmnt_type as operation,
            ship_types.type_description AS ship_type, ship_subtypes.description AS ship_subtype,
            maneuv_data_arriv_prev.draft_aft as arr_prev_draft_aft,
            maneuv_data_arriv_prev.draft_fwd as arr_prev_draft_fwd,
            maneuv_data_dep.draft_aft as dep_draft_aft,
            maneuv_data_dep.draft_fwd as dep_draft_fwd,
            maneuv_data_arriv_prev.agency_arriv_prev,
            maneuv_data_dep.agency_dep,
            destination_data.port_name AS destination_port,
            destination_data.port_country AS destination_country,
            lpc_data.port_name AS last_port_of_call_name,
            lpc_data.port_country AS last_port_of_call_country,
            data_avvistamento_nave.ts_avvistamento AS ts_sighting,
            data_fuori_dal_porto.ts_out_of_sight AS ts_out_of_sight,  
            goods_categories.description AS shipped_goods, quantity, unit,
            quays.description AS quay, berths.description AS berth
            FROM shipped_goods
            INNER JOIN control_unit_data
            ON control_unit_data.id_control_unit_data = shipped_goods.fk_control_unit_data
            INNER JOIN goods_categories
            ON goods_categories.id_goods_category = shipped_goods.fk_goods_category
            INNER JOIN ships
            ON control_unit_data.fk_ship = ships.id_ship
            INNER JOIN ship_types
            ON ships.fk_ship_type = ship_types.id_ship_type
            INNER JOIN ship_subtypes
            ON ship_subtypes.fk_ship_type = ship_types.id_ship_type
            INNER JOIN data_avvistamento_nave
            ON control_unit_data.id_control_unit_data = data_avvistamento_nave.fk_control_unit_data
            LEFT JOIN data_fuori_dal_porto
            ON data_fuori_dal_porto.fk_control_unit_data = control_unit_data.id_control_unit_data
            INNER JOIN (
                SELECT id_agency, description
                FROM agencies
                WHERE fk_portinformer = ${idPortinformer}
            ) as arrival_agency
            ON arrival_agency.id_agency = data_avvistamento_nave.fk_agency
            INNER JOIN quays
            ON quays.id_quay = shipped_goods.fk_operation_quay
            INNER JOIN berths
            ON berths.id_berth = shipped_goods.fk_operation_berth
            LEFT JOIN countries
            ON ships.fk_country_flag = id_country 
            INNER JOIN (
                SELECT id_maneuvering, trips_logs.fk_state as trip_state,
                trips_logs.fk_control_unit_data as id_trip,
                draft_aft, draft_fwd, agencies.description AS agency_arriv_prev
                FROM trips_logs INNER JOIN maneuverings
                ON fk_maneuvering = id_maneuvering
                INNER JOIN agencies
                ON agencies.id_agency = trips_logs.fk_agency
                WHERE trips_logs.fk_portinformer = ${idPortinformer}
                AND trips_logs.fk_state = ${arrivalPrevisionState}
                GROUP BY id_maneuvering, agencies.description, trip_state, id_trip, draft_aft, draft_fwd
            ) AS maneuv_data_arriv_prev
            ON maneuv_data_arriv_prev.id_trip = id_control_unit_data
            INNER JOIN (
                SELECT id_maneuvering, trips_logs.fk_state as trip_state,
                trips_logs.fk_control_unit_data as id_trip,
                draft_aft, draft_fwd, agencies.description AS agency_dep
                FROM trips_logs INNER JOIN maneuverings
                ON fk_maneuvering = id_maneuvering
                INNER JOIN agencies
                ON agencies.id_agency = trips_logs.fk_agency
                WHERE trips_logs.fk_portinformer = ${idPortinformer}
                AND trips_logs.fk_state = ${departureState}
                GROUP BY id_maneuvering, agencies.description, trip_state, id_trip, draft_aft, draft_fwd
            ) AS maneuv_data_dep
            ON maneuv_data_dep.id_trip = id_control_unit_data
            LEFT JOIN (
                SELECT id_shipping_details, ports.name AS port_name,
                ports.country as port_country
                FROM ports 
                INNER JOIN shipping_details
                ON shipping_details.fk_port_provenance = id_port
            ) AS lpc_data
            ON lpc_data.id_shipping_details = control_unit_data.fk_shipping_details
            LEFT JOIN (
                SELECT id_shipping_details, ports.name AS port_name,
                ports.country as port_country
                FROM ports 
                INNER JOIN shipping_details
                ON shipping_details.fk_port_destination = id_port
            ) AS destination_data
            ON destination_data.id_shipping_details = control_unit_data.fk_shipping_details
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}`;
};

let tripsManeuverings = function (idPortinformer) {
    return `(SELECT control_unit_data.id_control_unit_data AS id_trip, ships.ship_description AS ship_name, 
                ts_fine_ormeggio AS ormeggio, ts_avvistamento AS avvistamento, quays.description AS quay, 
                berths.description AS berth, state_name AS state, goods_categories.description as shipped_goods, 
                CASE WHEN quantity = '' THEN '0' ELSE quantity END AS quantity, 
                unit, goods_mvmnt_type
                FROM data_ormeggio_nave
                INNER JOIN control_unit_data
                ON data_ormeggio_nave.fk_control_unit_data = id_control_unit_data
                INNER JOIN trips_logs
                ON data_table_id::INTEGER = id_data_ormeggio_nave
                INNER JOIN maneuverings
                ON trips_logs.fk_maneuvering = id_maneuvering
                INNER JOIN quays
                ON maneuverings.fk_stop_quay = quays.id_quay
                INNER JOIN berths
                ON maneuverings.fk_stop_berth = berths.id_berth
                INNER JOIN ships
                ON control_unit_data.fk_ship = ships.id_ship
                INNER JOIN data_avvistamento_nave
                ON control_unit_data.id_control_unit_data = data_avvistamento_nave.fk_control_unit_data
                INNER JOIN states
                ON states.id_state = trips_logs.fk_state
                LEFT JOIN shipped_goods
                ON shipped_goods.fk_control_unit_data = control_unit_data.id_control_unit_data
                AND shipped_goods.fk_operation_quay = maneuverings.fk_stop_quay
                INNER JOIN goods_categories
                ON shipped_goods.fk_goods_category = goods_categories.id_goods_category
                WHERE trips_logs.fk_portinformer = ${idPortinformer}
                AND trips_logs.fk_state = 17) 
            UNION 
            (SELECT control_unit_data.id_control_unit_data AS id_trip, ships.ship_description AS ship_name, 
                ts_fine_ormeggio AS ormeggio, ts_avvistamento AS avvistamento, quays.description AS quay, 
                berths.description AS berth, state_name AS state, goods_categories.description as shipped_goods, 
                CASE WHEN quantity = '' THEN '0' ELSE quantity END AS quantity, 
                unit, goods_mvmnt_type
                FROM data_da_ormeggio_a_ormeggio
                INNER JOIN control_unit_data
                ON data_da_ormeggio_a_ormeggio.fk_control_unit_data = id_control_unit_data
                INNER JOIN trips_logs
                ON data_table_id::INTEGER = id_data_da_ormeggio_a_ormeggio
                INNER JOIN maneuverings
                ON trips_logs.fk_maneuvering = id_maneuvering
                INNER JOIN quays
                ON maneuverings.fk_stop_quay = quays.id_quay
                INNER JOIN berths
                ON maneuverings.fk_stop_berth = berths.id_berth
                INNER JOIN ships
                ON control_unit_data.fk_ship = ships.id_ship
                INNER JOIN data_avvistamento_nave
                ON control_unit_data.id_control_unit_data = data_avvistamento_nave.fk_control_unit_data
                INNER JOIN states
                ON states.id_state = trips_logs.fk_state
                LEFT JOIN shipped_goods
                ON shipped_goods.fk_control_unit_data = control_unit_data.id_control_unit_data
                INNER JOIN goods_categories
                ON shipped_goods.fk_goods_category = goods_categories.id_goods_category
                AND shipped_goods.fk_operation_quay = maneuverings.fk_stop_quay
                WHERE trips_logs.fk_portinformer = ${idPortinformer}
                AND trips_logs.fk_state = 18)
            UNION
            (SELECT control_unit_data.id_control_unit_data AS id_trip, ships.ship_description AS ship_name, 
                ts_fine_ormeggio AS ormeggio, ts_avvistamento AS avvistamento, quays.description AS quay, 
                berths.description AS berth, state_name AS state, goods_categories.description as shipped_goods, 
                CASE WHEN quantity = '' THEN '0' ELSE quantity END AS quantity, 
                unit, goods_mvmnt_type
                FROM data_da_rada_a_ormeggio
                INNER JOIN control_unit_data
                ON data_da_rada_a_ormeggio.fk_control_unit_data = id_control_unit_data
                INNER JOIN trips_logs
                ON data_table_id::INTEGER = id_data_da_rada_a_ormeggio
                INNER JOIN maneuverings
                ON trips_logs.fk_maneuvering = id_maneuvering
                INNER JOIN quays
                ON maneuverings.fk_stop_quay = quays.id_quay
                INNER JOIN berths
                ON maneuverings.fk_stop_berth = berths.id_berth
                INNER JOIN ships
                ON control_unit_data.fk_ship = ships.id_ship
                INNER JOIN data_avvistamento_nave
                ON control_unit_data.id_control_unit_data = data_avvistamento_nave.fk_control_unit_data
                INNER JOIN states
                ON states.id_state = trips_logs.fk_state
                LEFT JOIN shipped_goods
                ON shipped_goods.fk_control_unit_data = control_unit_data.id_control_unit_data
                AND shipped_goods.fk_operation_quay = maneuverings.fk_stop_quay
                INNER JOIN goods_categories
                ON shipped_goods.fk_goods_category = goods_categories.id_goods_category
                WHERE trips_logs.fk_portinformer = ${idPortinformer}
                AND trips_logs.fk_state = 20)
            ORDER BY ormeggio`;
};

let shippedGoodsRecap = function (idPortinformer) {
    return `SELECT goods_categories.description AS shipped_goods,  
    goods_details_UN.tot AS TOT_UN,
    goods_details_UN.qty AS QTY_UN,
    goods_details_LO.tot AS TOT_LO,
    goods_details_LO.qty AS QTY_LO,
    goods_details_TR.tot AS TOT_TR,
    goods_details_TR.qty AS QTY_TR,
    goods_details_TF.tot AS TOT_TF,
    goods_details_TF.qty AS QTY_TF
    FROM goods_categories
    FULL OUTER JOIN 
        (SELECT id_goods_category, goods_categories.description as gc_description, COUNT(*) as tot, 
               SUM(CASE WHEN quantity = '' THEN '0' ELSE quantity::FLOAT END) AS qty, goods_mvmnt_type
               FROM shipped_goods
               INNER JOIN goods_categories 
               ON id_goods_category = fk_goods_category 
               INNER JOIN control_unit_data
               ON shipped_goods.fk_control_unit_data = control_unit_data.id_control_unit_data
               GROUP BY id_goods_category, control_unit_data.fk_portinformer, fk_goods_category, goods_categories.description, goods_mvmnt_type
               HAVING control_unit_data.fk_portinformer = ${idPortinformer}
               AND goods_mvmnt_type = 'UN'
               ORDER BY fk_goods_category) AS goods_details_UN
    ON goods_categories.id_goods_category = goods_details_UN.id_goods_category
    FULL OUTER JOIN 
    (SELECT id_goods_category, goods_categories.description as gc_description, COUNT(*) as tot, 
               SUM(CASE WHEN quantity = '' THEN '0' ELSE quantity::FLOAT END) AS qty, goods_mvmnt_type
               FROM shipped_goods
               INNER JOIN goods_categories 
               ON id_goods_category = fk_goods_category 
               INNER JOIN control_unit_data
               ON shipped_goods.fk_control_unit_data = control_unit_data.id_control_unit_data
               GROUP BY id_goods_category, control_unit_data.fk_portinformer, fk_goods_category, goods_categories.description, goods_mvmnt_type
               HAVING control_unit_data.fk_portinformer = ${idPortinformer}
               AND goods_mvmnt_type = 'LO'
               ORDER BY fk_goods_category) AS goods_details_LO
    ON goods_categories.id_goods_category = goods_details_LO.id_goods_category
    FULL OUTER JOIN 
    (SELECT id_goods_category, goods_categories.description as gc_description, COUNT(*) as tot, 
               SUM(CASE WHEN quantity = '' THEN '0' ELSE quantity::FLOAT END) AS qty, goods_mvmnt_type
               FROM shipped_goods
               INNER JOIN goods_categories 
               ON id_goods_category = fk_goods_category 
               INNER JOIN control_unit_data
               ON shipped_goods.fk_control_unit_data = control_unit_data.id_control_unit_data
               GROUP BY id_goods_category, control_unit_data.fk_portinformer, fk_goods_category, goods_categories.description, goods_mvmnt_type
               HAVING control_unit_data.fk_portinformer = ${idPortinformer}
               AND goods_mvmnt_type = 'TR'
               ORDER BY fk_goods_category) AS goods_details_TR
    ON goods_categories.id_goods_category = goods_details_TR.id_goods_category
    FULL OUTER JOIN 
    (SELECT id_goods_category, goods_categories.description as gc_description, COUNT(*) as tot, 
               SUM(CASE WHEN quantity = '' THEN '0' ELSE REPLACE(quantity,',','.')::FLOAT END) AS qty, goods_mvmnt_type
               FROM shipped_goods
               INNER JOIN goods_categories 
               ON id_goods_category = fk_goods_category 
               INNER JOIN control_unit_data
               ON shipped_goods.fk_control_unit_data = control_unit_data.id_control_unit_data
               GROUP BY id_goods_category, control_unit_data.fk_portinformer, fk_goods_category, goods_categories.description, goods_mvmnt_type
               HAVING control_unit_data.fk_portinformer = ${idPortinformer}
               AND goods_mvmnt_type = 'TF'
               ORDER BY fk_goods_category) AS goods_details_TF
    ON goods_categories.id_goods_category = goods_details_TF.id_goods_category
    ORDER BY QTY_UN, QTY_LO, QTY_TR, QTY_TF`;
};

let trafficListRecap = function (idPortinformer) {
    return `SELECT 
            SUM(CASE WHEN num_container = '' THEN '0' ELSE num_container::NUMERIC END) AS tot_container,
                SUM(CASE WHEN num_passengers = '' THEN '0' ELSE num_passengers::NUMERIC END) AS tot_passengers,
                SUM(CASE WHEN num_camion = '' THEN '0' ELSE num_camion::NUMERIC END) AS tot_camion,
                SUM(CASE WHEN num_furgoni = '' THEN '0' ELSE num_furgoni::NUMERIC END ) AS tot_furgoni,
                SUM(CASE WHEN num_rimorchi = '' THEN '0' ELSE num_rimorchi::NUMERIC END) AS tot_rimorchi,
                SUM(CASE WHEN num_auto = '' THEN '0' ELSE num_auto::NUMERIC END) AS tot_auto,
                SUM(CASE WHEN num_moto = '' THEN '0' ELSE num_moto::NUMERIC END) AS tot_moto,
                SUM(CASE WHEN num_camper = '' THEN '0' ELSE num_camper::NUMERIC END) AS tot_camper,
                SUM(CASE WHEN num_bus = '' THEN '0' ELSE num_bus::NUMERIC END) AS tot_bus,
                SUM(CASE WHEN num_minibus = '' THEN '0' ELSE num_minibus::NUMERIC END) AS tot_minibus
        FROM traffic_list
        INNER JOIN control_unit_data
        ON traffic_list.fk_control_unit_data = control_unit_data.id_control_unit_data
        WHERE control_unit_data.fk_portinformer =  ${idPortinformer}`;
};

let shipReportList = function (idPortinformer) {
    return `SELECT 
            id_control_unit_data AS id_trip, ships.ship_description AS ship_name, 
            start_quay.description AS start_quay,
            start_berth.description AS start_berth,
            start_anchorage_point.description AS start_anchorage_point,
            stop_quay.description AS stop_quay, 
            stop_berth.description AS stop_berth, 
            stop_anchorage_point.description AS stop_anchorage_point,
            ts_main_event_field_val AS ts_operation,
            states.main_event_field AS operation_type,
            states.state_name
            FROM trips_logs
            LEFT JOIN maneuverings
            ON trips_logs.fk_maneuvering = maneuverings.id_maneuvering
            LEFT JOIN (
                SELECT id_quay, description
                FROM quays
            ) AS start_quay
            ON maneuverings.fk_start_quay = start_quay.id_quay
            LEFT JOIN (
                SELECT id_berth, description
                FROM berths
            ) AS start_berth
            ON maneuverings.fk_start_berth = start_berth.id_berth
            LEFT JOIN (
                SELECT id_anchorage_point, description
                FROM anchorage_points
            ) AS start_anchorage_point
            ON maneuverings.fk_start_anchorage_point = start_anchorage_point.id_anchorage_point
            LEFT JOIN (
                SELECT id_quay, description
                FROM quays
            ) AS stop_quay
            ON maneuverings.fk_stop_quay = stop_quay.id_quay
            LEFT JOIN (
                SELECT id_berth, description
                FROM berths
            ) AS stop_berth
            ON maneuverings.fk_stop_berth = stop_berth.id_berth
            LEFT JOIN (
                SELECT id_anchorage_point, description
                FROM anchorage_points
            ) AS stop_anchorage_point
            ON maneuverings.fk_stop_anchorage_point = stop_anchorage_point.id_anchorage_point
            INNER JOIN control_unit_data
            ON trips_logs.fk_control_unit_data = control_unit_data.id_control_unit_data
            INNER JOIN states
            ON trips_logs.fk_state = states.id_state
            INNER JOIN ships
            ON control_unit_data.fk_ship = ships.id_ship
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            ORDER BY id_trip`;
};

let shipReportDetails = function (idPortinformer) {
    return `SELECT id_control_unit_data,
            ships.ship_description AS ship_name,
            ships.mmsi AS mmsi,
            ships.imo AS imo,
            ships.length AS length,
            ships.width AS width,
            ships.gross_tonnage AS gross_tonnage,
            ship_types.type_description AS ship_type,
            ts_previsione_arrivo, 
            ts_avvistamento, 
            data_nave_all_ingresso.ts_harbour_entrance, 
            data_arrivo_in_rada.ts_anchor_drop, 
            'prontezza:'||data_ormeggio_nave.ts_prontezza||' ormeggio:'||data_ormeggio_nave.ts_fine_ormeggio AS ormeggio,
            'disormeggio:'||data_da_ormeggio_a_ormeggio.ts_disormeggio||' ormeggio:'||data_da_ormeggio_a_ormeggio.ts_fine_ormeggio AS da_ormeggio_a_ormeggio, 
            'disormeggio:'||data_da_ormeggio_a_rada.ts_disormeggio||' out of break water:'||data_da_ormeggio_a_rada.ts_out_of_break_water||' anchor drop:'||data_da_ormeggio_a_rada.ts_anchor_drop AS da_orm_a_rada, 
            'disancoraggio:'||data_da_rada_a_ormeggio.ts_disancoraggio||' harbour entrance:'||data_da_rada_a_ormeggio.ts_harbour_entrance||' ormeggio:'||data_da_rada_a_ormeggio.ts_fine_ormeggio AS da_rada_a_orm,
            'disormeggio:'||data_rotazione.ts_disormeggio||' ormeggio:'||data_rotazione.ts_fine_ormeggio AS rotazione,
            data_partenza_da_banchina.ts_disormeggio AS partenza_da_banchina,
            data_partenza_da_rada.ts_disancoraggio AS partenza_da_rada,
            data_fuori_dal_porto.ts_out_of_sight AS fuori_vista,
            data_tug_services.tug_service_interv as tug_service,
            maneuverings_data.data,
            data_shipped_goods.details
            FROM control_unit_data 
            LEFT JOIN data_previsione_arrivo_nave
            ON control_unit_data.id_control_unit_data = data_previsione_arrivo_nave.fk_control_unit_data
            LEFT JOIN data_avvistamento_nave
            ON control_unit_data.id_control_unit_data = data_avvistamento_nave.fk_control_unit_data
            LEFT JOIN data_arrivo_in_rada
            ON control_unit_data.id_control_unit_data = data_arrivo_in_rada.fk_control_unit_data
            LEFT JOIN data_nave_all_ingresso
            ON control_unit_data.id_control_unit_data = data_nave_all_ingresso.fk_control_unit_data
            LEFT JOIN data_ormeggio_nave
            ON control_unit_data.id_control_unit_data = data_ormeggio_nave.fk_control_unit_data
            LEFT JOIN data_da_ormeggio_a_ormeggio
            ON control_unit_data.id_control_unit_data = data_da_ormeggio_a_ormeggio.fk_control_unit_data
            LEFT JOIN data_da_ormeggio_a_rada
            ON control_unit_data.id_control_unit_data = data_da_ormeggio_a_rada.fk_control_unit_data
            LEFT JOIN data_da_rada_a_ormeggio
            ON control_unit_data.id_control_unit_data = data_da_rada_a_ormeggio.fk_control_unit_data
            LEFT JOIN data_rotazione
            ON control_unit_data.id_control_unit_data = data_rotazione.fk_control_unit_data
            LEFT JOIN data_partenza_da_banchina
            ON control_unit_data.id_control_unit_data = data_partenza_da_banchina.fk_control_unit_data
            LEFT JOIN data_partenza_da_rada
            ON control_unit_data.id_control_unit_data = data_partenza_da_rada.fk_control_unit_data
            LEFT JOIN data_fuori_dal_porto
            ON control_unit_data.id_control_unit_data = data_fuori_dal_porto.fk_control_unit_data
            LEFT JOIN (
                SELECT fk_control_unit_data, string_agg(ts_start_service||'->'||ts_stop_service, ',') AS tug_service_interv
                FROM tug_services
                group by fk_control_unit_data
            ) as data_tug_services
            ON data_tug_services.fk_control_unit_data = control_unit_data.id_control_unit_data
            LEFT JOIN (
                SELECT fk_control_unit_data, string_agg(goods_categories.description||' '||quantity||' '||unit, ',') AS details
                FROM shipped_goods
                INNER JOIN 
                goods_categories
                ON fk_goods_category = id_goods_category
                group by fk_control_unit_data
            ) as data_shipped_goods
            ON data_shipped_goods.fk_control_unit_data = control_unit_data.id_control_unit_data
            LEFT JOIN (
            SELECT
                fk_control_unit_data,
                string_agg(
                CASE WHEN start_quay.id_quay != 0 THEN start_quay.description ELSE '' END||''||
                CASE WHEN start_berth.id_berth != 0 THEN start_berth.description ELSE '' END||''||
                CASE WHEN start_anchorage_point.id_anchorage_point != 0 THEN start_anchorage_point.description ELSE '' END||''||
                CASE WHEN stop_quay.id_quay != 0 THEN stop_quay.description ELSE '' END||''||
                CASE WHEN stop_berth.id_berth != 0 THEN stop_berth.description ELSE '' END||''||
                CASE WHEN stop_anchorage_point.id_anchorage_point != 0 THEN stop_anchorage_point.description ELSE '' END, '>') AS data
                FROM maneuverings
                    LEFT JOIN (
                    SELECT id_quay, description
                    FROM quays
                    ) AS start_quay
                    ON maneuverings.fk_start_quay = start_quay.id_quay
                    LEFT JOIN (
                    SELECT id_berth, description
                    FROM berths
                    ) AS start_berth
                    ON maneuverings.fk_start_berth = start_berth.id_berth
                    LEFT JOIN (
                    SELECT id_anchorage_point, description
                    FROM anchorage_points
                    ) AS start_anchorage_point
                    ON maneuverings.fk_start_anchorage_point = start_anchorage_point.id_anchorage_point
                    LEFT JOIN (
                    SELECT id_quay, description
                    FROM quays
                    ) AS stop_quay
                    ON maneuverings.fk_stop_quay = stop_quay.id_quay
                    LEFT JOIN (
                    SELECT id_berth, description
                    FROM berths
                    ) AS stop_berth
                    ON maneuverings.fk_stop_berth = stop_berth.id_berth
                    LEFT JOIN (
                    SELECT id_anchorage_point, description
                    FROM anchorage_points
                    ) AS stop_anchorage_point
                    ON maneuverings.fk_stop_anchorage_point = stop_anchorage_point.id_anchorage_point
                GROUP BY 1
            ) AS maneuverings_data
            ON maneuverings_data.fk_control_unit_data = control_unit_data.id_control_unit_data
        INNER JOIN ships
        ON control_unit_data.fk_ship = ships.id_ship
        INNER JOIN ship_types
        ON ships.fk_ship_type = ship_types.id_ship_type
        WHERE control_unit_data.fk_portinformer = 28
        ORDER BY id_control_unit_data;`;
};

let archiveData = {
    tripsArchive: tripsArchive,
    tripsArchiveMultiRows: tripsArchiveMultiRows,
    tripsManeuverings: tripsManeuverings,
    shippedGoodsRecap: shippedGoodsRecap,
    trafficListRecap: trafficListRecap,
    shipReportList: shipReportList,
    shipReportDetails: shipReportDetails, 
};

module.exports = archiveData;
