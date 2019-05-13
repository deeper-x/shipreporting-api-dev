# Shipreporting APIs - List of services

## A - LIVE DATA SERVICES:

1. __Active trips__:
```
http://<REMOTE_IP>:3000/activeTripsNow?id_portinformer=<id_portinformer>
```

2. __Roadstead now__:
```
http://<REMOTE_IP>:3000/roadsteadNow?id_portinformer=<id_portinformer>&id_activity=2
```

3. __Moored now__:
```
http://<REMOTE_IP>:3000/mooredNow?id_portinformer=<id_portinformer>&id_activity=5
```

4. __Arrivals now__:
```
http://<REMOTE_IP>:3000/arrivalsNow?id_portinformer=<id_portinformer>
```

5. __Departures now__:
```
http://<REMOTE_IP>:3000/departuresNow?id_portinformer=<id_portinformer>
```

6. __Arrival previsions__:
```
http://<REMOTE_IP>:3000/arrivalPrevisionsNow?id_portinformer=<id_portinformer>
```

7. __Shipped goods__:
```
http://<REMOTE_IP>:3000/shippedGoodsNow?id_portinformer=<id_portinformer>
```

8. __RO/RO + RO/PAX__:
```
http://<REMOTE_IP>:3000/trafficListNow?id_portinformer=<id_portinformer>
```

9. __Shifting previsions__:
``` 
http://<REMOTE_IP>:3000/shiftingPrevisionsNow?id_portinformer=<id_portinformer>
```

10. __Departure previsions__:
``` 
http://<REMOTE_IP>:3000/departurePrevisionsNow?id_portinformer=<id_portinformer>
```

## B - ARCHIVE DATA SERVICES:

1. __Trips archive [global recap, one row per trip]__:
```
http://<REMOTE_IP>:3000/tripsArchive?id_portinformer=<ID_PORTINFORMER>
```
2. __Trips archive [global recap, one row per commercial operation]__:
```
http://<REMOTE_IP>:3000/tripsArchiveMultiRows?id_portinformer=<ID_PORTINFORMER>
```
3. __Trip data archive__ [shipreport core]:
```
http://<REMOTE_IP>:3000/shipReportList?id_portinformer=<ID_PORTINFORMER>
```

4. __Trip data archive detailed__ [shipreport]:
```   
http://<REMOTE_IP>:3000/shipReportDetails?id_portinformer=<ID_PORTINFORMER>
```

5. __Arrivals archive__:
```
http://<REMOTE_IP>:3000/arrivalsArchive?id_portinformer=<id_portinformer>
```

6. __Departures archive__:
```
http://<REMOTE_IP>:3000/departuresArchive?id_portinformer=<id_portinformer>
```
7. __Shipped goods archive__:
```
http://<REMOTE_IP>:3000/shippedGoodsArchive?id_portinformer=<id_portinformer>
```

8. __Traffic list archive__:
```
http://<REMOTE_IP>:3000/trafficListArchive?id_portinformer=<id_portinformer>
```



## C - DAILY REGISTER SERVICES:

1. __Arrivals:__
```
http://<REMOTE_IP>:3000/registerArrivals?id_portinformer=<ID_PORTINFORMER>
```
2. __Moored:__
```
http://<REMOTE_IP>:3000/registerMoored?id_portinformer=<ID_PORTINFORMER>
```
3. __Roadstead:__
```
http://<REMOTE_IP>:3000/registerRoadstead?id_portinformer=<ID_PORTINFORMER>
```

4. __Departures:__
```
http://<REMOTE_IP>:3000/registerDepartures?id_portinformer=<ID_PORTINFORMER>
```

5. __Shiftings:__
```
http://<REMOTE_IP>:3000/registerShiftings?id_portinformer=<ID_PORTINFORMER>
```

6. __Arrival previsions:__
```
http://<REMOTE_IP>:3000/registerPlannedArrivals?id_portinformer=<ID_PORTINFORMER>
```

7. __Shipped goods:__
```
http://<REMOTE_IP>:3000/registerShippedGoods?id_portinformer=<ID_PORTINFORMER>
```

8. __RO/RO + RO/PAX:__
```
http://<REMOTE_IP>:3000/registerTrafficList?id_portinformer=<ID_PORTINFORMER>
```

## D - BUSINESS INTELLIGENCE SERVICES: ##

1. __Shiftings/maneuverings [per quay/berth]:__
```
http://<REMOTE_IP>:3000/tripsManeuverings?id_portinformer=<ID_PORTINFORMER>
```

2. __Shipped goods recap:__
```
http://<REMOTE_IP>:3000/shippedGoodsRecap?id_portinformer=<ID_PORTINFORMER>
```

3. __RO/RO + RO/PAX recap:__
```
http://<REMOTE_IP>:3000/trafficListRecap?id_portinformer=<ID_PORTINFORMER>
```

## E - METEO DATA ##
1. __Meteo data archive__:
```
http://<REMOTE_IP>:3000/meteoArchive?id_portinformer=<ID_PORTINFORMER>
```


# __Deploy, start & stop server:__

```bash
$ cat /lib/systemd/system/shipreporting.service 
[Unit]
Description=Shipreporting service middleware
Documentation=https://github.com/deeper-x/shipreporting-api
After=network.target

[Service]
Environment=NODE_PORT=3000
Type=simple
User=<YOUR_USER>
WorkingDirectory=/home/<YOUR_USER>/shipreporting-api
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
Create database and set configuration data:
```bash
$ vim settings/db_auth.js 
```

Then:
```bash
$ sudo systemctl start shipreporting.service
$ sudo systemctl stop shipreporting.service
```

__Local deploy [on dev environment]:__
```bash

$ npm install
[...omissis]
$ npm start

> shipreporting-api@1.0.0 start /home/<YOUR_USER>/NodeProjects/shipreporting-api
> ./node_modules/nodemon/bin/nodemon.js index.js

[nodemon] 1.18.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node index.js`
running on http://0.0.0.0:3000...
```
