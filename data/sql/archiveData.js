let tripsArchive = function (idPortinformer) {
    return `SELECT 
            id_control_unit_data AS id_trip,
            control_unit_data.is_active AS in_progress,
            shipping_details.ts_arrival AS arrival,
            shipping_details.ts_departure AS departure,
            ship_description AS ship,
            shipped_goods_details,
            quays.description||'-'||berths.description AS commercial_quay_berth
            FROM control_unit_data INNER JOIN ships
            ON control_unit_data.fk_ship = ships.id_ship
            INNER JOIN shipping_details
            ON control_unit_data.fk_shipping_details = id_shipping_details
            INNER JOIN ( 
                SELECT fk_control_unit_data, fk_operation_quay, fk_operation_berth, string_agg(shipped_goods.goods_mvmnt_type||' '||goods_categories.description||' '||shipped_goods.quantity||' '||shipped_goods.unit||',', '-')
                AS shipped_goods_details
                FROM shipped_goods INNER JOIN goods_categories
                ON fk_goods_category = id_goods_category
                GROUP BY fk_control_unit_data, fk_operation_quay, fk_operation_berth
            ) AS shipped_goods_data
            INNER JOIN quays
            ON shipped_goods_data.fk_operation_quay = id_quay
            INNER JOIN berths
            ON shipped_goods_data.fk_operation_berth = id_berth
            ON shipped_goods_data.fk_control_unit_data = id_control_unit_data
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}`;
};

let archiveData = {
    tripsArchive: tripsArchive,
};

module.exports = archiveData;
