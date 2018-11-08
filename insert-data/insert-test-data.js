let mongoose = require('mongoose');
let config = require('../config');
require('../models/project');
let Project = mongoose.model('Project');

const MONGO_URI = config.mongodbUri;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);

let data = prepareData();

mongoose.connection.once('connected', () => {
  Project.deleteMany({})
    .then(() => {
      return Project.insertMany(data);
    })
    .then(res => {
      console.log('well done insert!');
      mongoose.connection.close();
    })
    .catch(err => {
      console.log(err);
      console.log('ERROR insert!');
      mongoose.connection.close();
    });

  console.log('Succesfully connected to MongoDB Database');
});

/**
 * Must have
 */
function prepareData() {
  let res = [];
  let delays = [1000, 2000, 5000, 10000];
  let randomWords = 'abandon actress agency ambiguous apologize arrived attendants baggage bean bennet blob boxes brute caleb catherine cheat clasped collation completely conquest convict crash curl dear delusion detectives disapproval divided drift eat emerge entreaty excellent exterior favour finish foal forward fur germany gradual guard harness helpful homework hunter impressive ingredient intentions itself justin landlord lend loaded madam mask mercury mobile mow necessity nose off our panic peaches phase plate portions presented profitable punishment ralph recover remained resolved rim rum scan seeming sharp sideways slave software spectacle stake stopped submarine supplies tablets terminate threw tongs travelling twelve unlock vanished visit watchful whistling word';
  let urls = ['https://github.com/search?q=', 'https://www.yandex.ru/search/?text=', 'https://www.google.ru/search?q='];
  let randomWordsArr = randomWords.split(' ');

  for (let i = 0; i < 10; i++) {
    let item = {};
    item.delay = delays[getRandomInt(0, delays.length - 1)];
    item.url = urls[getRandomInt(0, urls.length - 1)];
    item.state = 'active';
    item.statusContent = -1;
    item.notifies = [ 'email' ];
    item.options = {
      status: -1,
      other: 'any'
    };
    item.needCheck = false;
    item.active = true;

    for (let j = 0; j < 3; j++) {
      item.url += randomWordsArr[getRandomInt(0, randomWordsArr.length - 1)] + '%20';
    }

    res.push(item);
  }

  return res;
}

/**
 * Must have
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
