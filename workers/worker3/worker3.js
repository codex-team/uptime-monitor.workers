/**
 * @file describe class for Worker 3.
 */

let BaseWorker = require('../base-worker');

/**
 * Class repesentation a ResponseWorker
 * Worker 3, Parse response(in future 'hard' parsing with statistics and etc)
 * Create queue for Notify
 * @class RequestWorker
 * @extends BaseWorker
 */
class ResponseWorker extends BaseWorker {
  /**
   * Create a worker 3.
   */
  constructor() {
    super('ResponseWorker', 3);
  }

  /**
   * @override
   */
  operate(data) {
    let item = {
      _id: data._id,
      url: data.url,
      options: data.options,
      newOptions: data.newOptions,
      notify: data.notify
    };
    let alarmInfo = {};
    let needAlarm = false;

    // TODO request statistic? request&parse content? other fitures ...

    alarmInfo.lastPing = (new Date()).toISOString(); // TODO

    if (item.options.statusContent != item.newOptions.statusContent) {
      needAlarm = true;

      alarmInfo['statusContent'] = {
        prev: item.options.statusContent,
        current: item.newOptions.statusContent
      };
    }

    if (item.options.sizeContent != item.newOptions.sizeContent) {
      needAlarm = true;

      alarmInfo['sizeContent'] = {
        prev: item.options.sizeContent,
        current: item.newOptions.sizeContent
      };
    }

    if (item.options.delayContent != item.newOptions.delayContent) {
      needAlarm = true;

      alarmInfo['delayContent'] = {
        prev: item.options.delayContent,
        current: item.newOptions.delayContent
      };
    }

    this.addTask(this.index + 1, {
      type: 'api',
      data: alarmInfo
    });

    if (needAlarm) {
      let message = this._generateAlarmMessge(alarmInfo);

      item.notify.forEach((noty) => {
        this.addTask(this.index + 1, {
          type: noty.type,
          credentianls: noty, // TODO
          message: message
        });
      });
    }

    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  /**
   * Generate message for notify
   * @param {object} alarmInfo // TODO
   * @returns {string}
   */
  _generateAlarmMessge(alarmInfo) {
    let str = 'INFO\n' + alarmInfo.lastPing + '\n';

    Object.keys(alarmInfo).forEach((key) => {
      if (key != 'lastPing') {
        str += 'Changed value ' + key + ' from ' + alarmInfo[key].prev + ' to ' + alarmInfo[key].current + '\n';
      }
    });

    return str;
  }
}

module.exports = ResponseWorker;