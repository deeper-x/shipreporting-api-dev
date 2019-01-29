let tripsArchive = function (idPortinformer) {
    return `SELECT 
            id_control_unit_data AS id_trip,
            control_unit_data.is_active AS in_progress,
            shipping_details.ts_arrival AS arrival,
            shipping_details.ts_departure AS departure,
            ship_description AS ship
            FROM control_unit_data INNER JOIN ships
            ON control_unit_data.fk_ship = ships.id_ship
            INNER JOIN shipping_details
            ON control_unit_data.fk_shipping_details = id_shipping_details
            WHERE control_unit_data.fk_portinformer = ${idPortinformer} `;
};

let archiveData = {
    tripsArchive: tripsArchive,
};

module.exports = archiveData;
