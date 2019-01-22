# shipreporting-api

__Start & Stop service:__

```bash
$ sudo systemctl start shipreporting.service
$ sudo systemctl stop shipreporting.service
```

__Local deploy:__
```bash

$ npm install
[...omissis]
$ npm start

> shipreporting-api@1.0.0 start /home/deeper-x/NodeProjects/shipreporting-api
> ./node_modules/nodemon/bin/nodemon.js index.js

[nodemon] 1.18.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node index.js`
running on http://0.0.0.0:3000...
```

__Roadstead now__:
```
http://80.88.88.162:3000/roadsteadNow?id_portinformer=<id_portinformer>&id_activity=2
```

__Moored now__:
```
http://80.88.88.162:3000/mooredNow?id_portinformer=<id_portinformer>&id_activity=5
```

__Arrivals now__:
```
http://80.88.88.162:3000/arrivalsNow?id_portinformer=<id_portinformer>
```

__Departures now__:
```
http://80.88.88.162:3000/departuresNow?id_portinformer=<id_portinformer>
```

__Arrival previsions__:
```
http://80.88.88.162:3000/arrivalPrevisionsNow?id_portinformer=<id_portinformer>
```

__Goods: commercial operations__:
```
http://80.88.88.162:3000/shippedGoodsNow?id_portinformer=<id_portinformer>
```

__RO/RO + RO/PAX: commercial operations__:
```
http://80.88.88.162:3000/trafficListNow?id_portinformer=<id_portinformer>
```