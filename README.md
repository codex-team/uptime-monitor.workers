
# uptime-monitor.workers

## How to run 

Need:
- NodeJS >= 10

### Start in production:

Create prod config, use relevat values

    cp ./config/config.local.js ./config/config.prod.js
Run

    ./deploy.sh

When deploying:

    git pull
    npm run stop:all
    npm install
    npm run start:all

View logs

    tail -f ~/.forever/logfile.log

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

    node ./workers/init-worker
    node ./workers/prerequest-worker
    ...
Run single worker with `forever` out in `~/.forever/logfile.log`

    ./node_modules/.bin/forever start --spinSleepTime 10000 -a -l logfile.log ./workers/init-worker
OR

    npm run worker -- ./workers/init-worker

OR 

    npm run initw
    npm run prerequestw
    ...