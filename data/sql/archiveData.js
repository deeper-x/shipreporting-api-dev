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
            INNER JOIN ( 
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
            INNER JOIN ( 
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
            INNER JOIN ( 
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
            arrival_agency.description AS arrival_agency,
            goods_mvmnt_type as operation,
            maneuv_data_arriv_prev.draft_aft as arr_prev_draft_aft,
            maneuv_data_arriv_prev.draft_fwd as arr_prev_draft_fwd,
            maneuv_data_dep.draft_aft as dep_draft_aft,
            maneuv_data_dep.draft_fwd as dep_draft_fwd,
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
            INNER JOIN (
                SELECT id_maneuvering, trips_logs.fk_state as trip_state,
                trips_logs.fk_control_unit_data as id_trip,
                draft_aft, draft_fwd
                FROM trips_logs INNER JOIN maneuverings
                ON fk_maneuvering = id_maneuvering
                WHERE trips_logs.fk_portinformer = ${idPortinformer}
                AND trips_logs.fk_state = ${arrivalPrevisionState}
                GROUP BY id_maneuvering, trip_state, id_trip, draft_aft, draft_fwd
            ) AS maneuv_data_arriv_prev
            ON maneuv_data_arriv_prev.id_trip = id_control_unit_data
            INNER JOIN (
                SELECT id_maneuvering, trips_logs.fk_state as trip_state,
                trips_logs.fk_control_unit_data as id_trip,
                draft_aft, draft_fwd
                FROM trips_logs INNER JOIN maneuverings
                ON fk_maneuvering = id_maneuvering
                WHERE trips_logs.fk_portinformer = ${idPortinformer}
                AND trips_logs.fk_state = ${departureState}
                GROUP BY id_maneuvering, trip_state, id_trip, draft_aft, draft_fwd
            ) AS maneuv_data_dep
            ON maneuv_data_dep.id_trip = id_control_unit_data
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}`;
};

let archiveData = {
    tripsArchive: tripsArchive,
    tripsArchiveMultiRows: tripsArchiveMultiRows,
};

module.exports = archiveData;
