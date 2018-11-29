
# uptime-monitor.workers

## How to run 

Need:
- NodeJS >= 10
- pm2

    npm install -g pm2

### Start in production:

Create prod config, use relevat values

    cp ./config/config.local.js ./config/config.prod.js
Run

    ./deploy.sh

View logs

    tail -f ./pm2-logfile.log

### Run in development
Up deps
    
    npm install
Linter

    npm run lint
Nodemon + lint

    npm run dev

Run static stub server(for api and\or registry)

    npm run static

Run single worker with stdout

    node ./workers/prerequest-worker
    node ./workers/request-worker
    ...
Run single worker with `pm2` out in `./pm2-logfile.log`

    pm2 start -l pm2-logfile.log ./workers/prerequest-worker
OR

    npm run worker -- ./workers/prerequest-worker

OR 

    npm run prew
    npm run requestw
    ...