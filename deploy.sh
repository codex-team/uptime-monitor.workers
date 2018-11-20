#!/bin/bash
echo "Starting deploy..."

echo "Stop all workers"
npm run stop:all

echo "Get changes from git"
git pull

npm install

echo "Start again all workers"
npm run start:all