#!/bin/bash
echo "Starting deploy..."

echo "======================================================"
echo "** WARNING!!!                                       **"
echo "Dont forget to update config.prod.js if it is necessary"
echo "======================================================"

echo "Stop all workers"
npm run stop:all

echo "Get changes from git"
git pull

echo "Update packages"
npm install || (npm cache clear && npm dedupe && npm install)

echo "Start again all workers"
pm2 reload ecosystem.config.js --env production