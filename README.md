# Shipreporting API

__List of available calls:__

## LIVE DATA SERVICES:

- __Active trips__:
```
http://<REMOTE_IP>:3000/activeTripsNow?id_portinformer=<id_portinformer>
```

- __Roadstead now__:
```
http://<REMOTE_IP>:3000/roadsteadNow?id_portinformer=<id_portinformer>&id_activity=2
```

- __Moored now__:
```
http://<REMOTE_IP>:3000/mooredNow?id_portinformer=<id_portinformer>&id_activity=5
```

- __Arrivals now__:
```
http://<REMOTE_IP>:3000/arrivalsNow?id_portinformer=<id_portinformer>
```

- __Departures now__:
```
http://<REMOTE_IP>:3000/departuresNow?id_portinformer=<id_portinformer>
```

- __Arrival previsions__:
```
http://<REMOTE_IP>:3000/arrivalPrevisionsNow?id_portinformer=<id_portinformer>
```

- __Goods: commercial operations__:
```
http://<REMOTE_IP>:3000/shippedGoodsNow?id_portinformer=<id_portinformer>
```

- __RO/RO + RO/PAX: commercial operations__:
```
http://<REMOTE_IP>:3000/trafficListNow?id_portinformer=<id_portinformer>
```

## ARCHIVE DATA SERVICES:

- __Trips archive [global recap]:__
```
http://<REMOTE_IP>:3000/tripsArchive?id_portinformer=<ID_PORTINFORMER>
```

## DAILY REGISTER SERVICES:

- __Arrivals:__
```
http://<REMOTE_IP>:3000/registerArrivals?id_portinformer=<ID_PORTINFORMER>
```

- __Moored:__
```
http://<REMOTE_IP>:3000/registerMoored?id_portinformer=<ID_PORTINFORMER>
```

- __Roadstead:__
```
http://<REMOTE_IP>:3000/registerRoadstead?id_portinformer=<ID_PORTINFORMER>
```

- __Departures:__
```
http://<REMOTE_IP>:3000/registerDepartures?id_portinformer=<ID_PORTINFORMER>
```

- __Shiftings:__
```
http://<REMOTE_IP>:3000/registerShiftings?id_portinformer=<ID_PORTINFORMER>
```

- __Arrival previsions:__
```
http://<REMOTE_IP>:3000/registerArrPrevisions?id_portinformer=<ID_PORTINFORMER>
```

- __Shipped goods:__
```
#TODO
http://<REMOTE_IP>:3000/registerShippedGoods?id_portinformer=<ID_PORTINFORMER>
```

- __Traffic list:__
```
#TODO
http://<REMOTE_IP>:3000/registerTrafficList?id_portinformer=<ID_PORTINFORMER>
```


# __Deploy, start & stop service:__

```bash
$ cat /lib/systemd/system/shipreporting.service 
[Unit]
Description=Shipreporting service middleware
Documentation=https://gitlab.com/deeper-x/shipreporting-api
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

