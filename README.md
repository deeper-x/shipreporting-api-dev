# shipreporting-api

__Deploy, start & stop service [on production environment] :__

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

__List of available calls:__

__Roadstead now__:
```
http://<REMOTE_IP>:3000/roadsteadNow?id_portinformer=<id_portinformer>&id_activity=2
```

__Moored now__:
```
http://<REMOTE_IP>:3000/mooredNow?id_portinformer=<id_portinformer>&id_activity=5
```

__Arrivals now__:
```
http://<REMOTE_IP>:3000/arrivalsNow?id_portinformer=<id_portinformer>
```

__Departures now__:
```
http://<REMOTE_IP>:3000/departuresNow?id_portinformer=<id_portinformer>
```

__Arrival previsions__:
```
http://<REMOTE_IP>:3000/arrivalPrevisionsNow?id_portinformer=<id_portinformer>
```

__Goods: commercial operations__:
```
http://<REMOTE_IP>:3000/shippedGoodsNow?id_portinformer=<id_portinformer>
```

__RO/RO + RO/PAX: commercial operations__:
```
http://<REMOTE_IP>:3000/trafficListNow?id_portinformer=<id_portinformer>
```
__Trips archive (general info):__
```
http://<REMOTE_IP>:3000/tripsArchive?id_portinformer=<ID_PORTINFORMER>
```