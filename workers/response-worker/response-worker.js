/**
 * @file describe class for ResponseWorker.
 */

let BaseWorker = require('../base-worker');

/**
 * Class repesentation a ResponseWorker
 * Worker for Parse response(in future 'hard' parsing with statistics and etc)
 * Create queue for Notify
 * @class RequestWorker
 * @extends BaseWorker
 */
class ResponseWorker extends BaseWorker {
  /**
   * Create a worker.
   */
  constructor() {
    super('ResponseWorker');
  }

  /**
   * Make some work every tick
   * Parse responce result, find diff with prev result
   * @override
   * @param {object} data
   * @param {string} data._id - project ID
   * @param {string} data.url - project url
   * @param {object} data.options - old project options
   * @param {number} data.options.statusContent
   * @param {number} data.options.sizeContent
   * @param {number} data.options.delayContent
   * @param {object} data.options - new received project options
   * @param {number} data.newOptions.statusContent
   * @param {number} data.newOptions.sizeContent
   * @param {number} data.newOptions.delayContent
   * @param {Array} data.notifications - array with notifications endpoints //  @todo
   */
  operate(data) {
    console.log(data, '====');

    let item = {
      _id: data._id,
      url: data.url,
      name: data.name,
      options: data.options,
      newOptions: data.newOptions,
      notifications: data.notifications
    };
    let alarmInfo = {};
    let needAlarm = false;

    // @todo request statistic? request&parse content? other features ...

    alarmInfo.lastPing = (new Date()).toISOString(); //  @todo

    // HARDCODE
    if (item.newOptions.statusContent !== 200) {
      needAlarm = true;

      alarmInfo['statusContent'] = {
        prev: 200,
        current: item.newOptions.statusContent
      };
    }

    // // Inspect response status for changes
    // if (item.options.statusContent && item.options.statusContent != item.newOptions.statusContent) {
    //   needAlarm = true;

    //   alarmInfo['statusContent'] = {
    //     prev: item.options.statusContent,
    //     current: item.newOptions.statusContent
    //   };
    // }

    // // Inspect response size for changes
    // if (item.options.sizeContent && item.options.sizeContent != item.newOptions.sizeContent) {
    //   needAlarm = true;

    //   alarmInfo['sizeContent'] = {
    //     prev: item.options.sizeContent,
    //     current: item.newOptions.sizeContent
    //   };
    // }

    // // Inspect response delay for changes
    // if (item.options.delayContent && item.options.delayContent != item.newOptions.delayContent) {
    //   needAlarm = true;

    //   alarmInfo['delayContent'] = {
    //     prev: item.options.delayContent,
    //     current: item.newOptions.delayContent
    //   };
    // }

    // Send ping result to api(anyway)
    this.addTask('NotifyWorker', {
      type: 'api',
      data: alarmInfo
    });

    // Send notifications, if ping result has changes from prev
    if (needAlarm) {
      let message = this._generateAlarmMessge(alarmInfo, item);

      // @todo rm hardcode
      item.notifications.push({
        type: 'testhook',
        message: message
      });

      item.notifications.forEach((noty) => {
        this.addTask('NotifyWorker', {
          type: noty.type,
          // credentianls: noty, // @todo
          message: message
        });
      });
    }

    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  /**
   * Generate message for notifications
   * @param {object} alarmInfo //  @todo
   * @param {object} item - object with project data
   * @param {string} item.url - project url
   * @param {string} item.name - project name
   * @returns {string}
   */
  _generateAlarmMessge(alarmInfo, item) {
    let str = '\u203C INFO \u203c\n' + item.name + ' ' + item.url + '\n' + alarmInfo.lastPing + '\n';

    Object.keys(alarmInfo).forEach((key) => {
      if (key != 'lastPing') {
        str += 'Changed value ' + key + ' from ' + alarmInfo[key].prev + ' to ' + alarmInfo[key].current + '\n';
      }
    });

    return str;
  }
}

module.exports = ResponseWorker;