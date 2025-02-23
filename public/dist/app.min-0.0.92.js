(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.webit || (g.webit = {})).ui = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _cloneDate = _interopRequireDefault(require("./cloneDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Atgriežam jaunu datuma objektu, kuram pielikts norādītais skaits dienu
 * @param object Datums
 * @param number Dienu skaits ko pielikts. Ja neg, tad atņemt
 */
function addDays(date, daysCount) {
  var d = (0, _cloneDate["default"])(date);
  d.setDate(d.getDate() + daysCount);
  return d;
}
var _default = exports["default"] = addDays;

},{"./cloneDate":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _cloneDate = _interopRequireDefault(require("./cloneDate"));
var _daysInMonth = _interopRequireDefault(require("./daysInMonth"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function addMonths(date, monthsCount) {
  var d = (0, _cloneDate["default"])(date);

  // Nolasām current date
  var n = d.getDate();

  // Uzliekam mēneša pirmo dienu. Lai nebūtu problēmu ar februāra mēnesi
  d.setDate(1);
  d.setMonth(d.getMonth() + monthsCount);

  // Mēģinām uzstādīt atpakaļ iepriekšējo datumu
  // Ja iepriekšējais datums ir lielāks nekā esošajā mēnesī,
  // tad uzstādām pēdējo iespējamo lielāko
  d.setDate(Math.min(n, (0, _daysInMonth["default"])(d.getFullYear(), d.getMonth() + 1)));
  return d;
}
var _default = exports["default"] = addMonths;

},{"./cloneDate":5,"./daysInMonth":8}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _addDays = _interopRequireDefault(require("./addDays"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function addWeeks(date, weeksCount) {
  return (0, _addDays["default"])(date, weeksCount * 7);
  return d;
}
var _default = exports["default"] = addWeeks;

},{"./addDays":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _render = _interopRequireDefault(require("./dom/render"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  dom: _render["default"]
};

},{"./dom/render":15}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function cloneDate(date) {
  return new Date(date.getTime());
}
var _default = exports["default"] = cloneDate;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.month = month;
exports.monthWithFullWeeks = monthWithFullWeeks;
exports.week = week;
var _daysInMonth = _interopRequireDefault(require("./daysInMonth"));
var _cloneDate = _interopRequireDefault(require("./cloneDate"));
var _dayOfWeek = _interopRequireDefault(require("./dayOfWeek"));
var _addDays = _interopRequireDefault(require("./addDays"));
var _periodDaysCount = _interopRequireDefault(require("./periodDaysCount"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Notice par Period
 *
 * Period ir objekts ar prop
 *     from
 *     till
 *
 * perioda till netike ieskaitīts
 * Nedēļas ietvaros till būs nākošās nedēļas sākuma datums
 * Tas pats arī attiecas uz mēnesi. Till būs nākošā mēneša
 * sākuma datums.
 */

/**
 * Return start of and end of week of provided date
 *
 * @param count cik nedēļas pievienot
 */
function week(date, count) {
  if (typeof count == 'undefined') {
    count = 1;
  }
  var from = (0, _addDays["default"])(date, -((0, _dayOfWeek["default"])(date) - 1));
  var till = (0, _addDays["default"])(date, 7 * count + 1 - (0, _dayOfWeek["default"])(date));
  return {
    from: from,
    till: till
  };
}

/**
 *
 * @param count cik mēnešus pievienot
 */
function month(date, count) {
  if (typeof count == 'undefined') {
    count = 1;
  }
  var monthDay = date.getDate();
  var from = (0, _addDays["default"])(date, -(monthDay - 1));
  var till = (0, _cloneDate["default"])(from);
  till.setMonth(till.getMonth() + 1 * count);
  return {
    from: from,
    till: till
  };
}

/**
 * Perioda sākums vienmēr būs
 * nedēļas sākums, kurā sākas mēnesis
 * Beigas, nedēļas beigas, kurā beidzas mēnesis
 */
function monthWithFullWeeks(date, count) {
  var period = month(date, count);
  period.from = (0, _addDays["default"])(period.from, -((0, _dayOfWeek["default"])(period.from) - 1));
  var d = (0, _dayOfWeek["default"])(period.till);
  // pirmdienu neaiztiekam, jo tad beigas ir pilna nedēļa
  if (d > 1) {
    period.till = (0, _addDays["default"])(period.till, 7 - d + 1);
  }

  // Nodrošinām, lai vienmēr būtu 6 nedēļas
  if ((0, _periodDaysCount["default"])(period.from, period.till) < 42) {
    // piemetam vēl vienu nedēļu
    period.till = (0, _addDays["default"])(period.till, 7);
  }
  return period;
}

},{"./addDays":1,"./cloneDate":5,"./dayOfWeek":7,"./daysInMonth":8,"./periodDaysCount":24}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * Nedēļas diena ir not zero based
 * Pirmdiena ir 1
 * Svētdiena ir 7
 */
function dayOfWeek(date) {
  if (typeof date == 'undefined') {
    date = new Date();
  }
  var r = date.getDay();
  // Svētdiena
  if (r == 0) {
    r = 7;
  }
  return r;
}
var _default = exports["default"] = dayOfWeek;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * Month jāpadod NEzero based
 * 1 - janvāris
 * 12 - decembris
 */
function daysInMonth(date) {
  var year;
  var month;
  if (arguments.length > 1) {
    year = date;
    month = arguments[1];
  }
  // Padots date
  else {
    year = date.getFullYear();
    month = date.getMonth() + 1;
  }
  return new Date(year, month, 0).getDate();
}
var _default = exports["default"] = daysInMonth;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClassesList = ClassesList;
exports.classNames = classNames;
function ClassesList(prefix, classesMap) {
  this.prefix = prefix;
  this.classesMap = classesMap;
}
ClassesList.prototype = {
  yes: function yes(name) {
    this.classesMap[name] = true;
  },
  no: function no(name) {
    this.classesMap[name] = false;
  },
  className: function className() {
    var r = [];
    for (var className in this.classesMap) {
      if (this.classesMap[className]) {
        r.push(this.prefix + className);
      }
    }
    return r.join(' ');
  }
};

/**
 * Funkcija, kuru izsaucot visi padotie argumenti tiek prefixoti
 */
function classNames(prefix) {
  return function () {
    return Array.prototype.slice.call(arguments).map(function (cl) {
      return prefix + cl;
    }).join(' ');
  };
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function CalendarEvents(eventNames) {
  this.events = this.prepareEvents(eventNames);
}
CalendarEvents.prototype = {
  prepareEvents: function prepareEvents(eventNames) {
    var r = {};
    for (var i in eventNames) {
      r[eventNames[i]] = [];
    }
    return r;
  },
  on: function on(eventName, cb) {
    if (typeof this.events[eventName] != 'undefined') {
      this.events[eventName].push(cb);
    }
    return this;
  },
  fire: function fire(eventName, args) {
    for (var i in this.events[eventName]) {
      this.events[eventName][i].apply(this, args);
    }
  }
};
var _default = exports["default"] = CalendarEvents;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ce = _interopRequireDefault(require("dom-helpers/src/ce"));
var _q = _interopRequireDefault(require("dom-helpers/src/q"));
var _replaceContent = _interopRequireDefault(require("dom-helpers/src/replaceContent"));
var _formatDate = require("../formatDate");
var _CssClassNames = require("./CssClassNames");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function defaultNavPrevFormatter() {
  return '<';
}
function defaultNavNextFormatter() {
  return '>';
}
function defaultDateCaptionFormatter(date) {
  return (0, _formatDate.Fy)(date);
}
function createDateSwitchEl(date, props, cssPrefix) {
  var cs = (0, _CssClassNames.classNames)(cssPrefix);
  var navPrevFormatter = props.get('navPrevFormatter', defaultNavPrevFormatter);
  var navNextFormatter = props.get('navNextFormatter', defaultNavNextFormatter);
  var dateCaptionFormatter = props.get('dateCaptionFormatter', defaultDateCaptionFormatter);

  /**
   * <div class="calendar-switch">
   *     <a data-navprev class="calendar-nav calendar-navprev"></a>
   *     <a data-datecaption class="calendar-datecaption"></a>
   *     <a data-navnext class="calendar-nav calendar-navnext"></a>
   * </div>
   */
  var el = (0, _ce["default"])('div', {
    "class": cs('calendar-switch')
  }, (0, _ce["default"])('a', {
    "class": cs('calendar-nav', 'calendar-navprev'),
    data: {
      navprev: ''
    }
  }), (0, _ce["default"])('a', {
    "class": cs('calendar-nav', 'calendar-datecaption'),
    data: {
      datecaption: ''
    }
  }), (0, _ce["default"])('a', {
    "class": cs('calendar-nav', 'calendar-navnext'),
    data: {
      navnext: ''
    }
  }));
  (0, _replaceContent["default"])((0, _q["default"])(el, '[data-navprev]'), navPrevFormatter());
  (0, _replaceContent["default"])((0, _q["default"])(el, '[data-datecaption]'), dateCaptionFormatter(date));
  (0, _replaceContent["default"])((0, _q["default"])(el, '[data-navnext]'), navNextFormatter());
  return {
    getEl: function getEl() {
      return el;
    },
    setDate: function setDate(date) {
      (0, _replaceContent["default"])((0, _q["default"])(el, '[data-datecaption]'), dateCaptionFormatter(date));
    }
  };
}
var _default = exports["default"] = createDateSwitchEl;

},{"../formatDate":17,"./CssClassNames":9,"dom-helpers/src/ce":29,"dom-helpers/src/q":91,"dom-helpers/src/replaceContent":100}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ce = _interopRequireDefault(require("dom-helpers/src/ce"));
var _append = _interopRequireDefault(require("dom-helpers/src/append"));
var _replaceContent = _interopRequireDefault(require("dom-helpers/src/replaceContent"));
var _CssClassNames = require("./CssClassNames");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var abr = ['', 'M', 'T', 'W', 'Th', 'F', 'S', 'Sn'];
var weekdayToTextFormatter;
function defaultWeekDayToText(dayIndex) {
  return abr[dayIndex];
}
function defaultWeekDayFormatter(dayIndex, currentEl) {
  if (!currentEl) {
    currentEl = document.createTextNode(weekdayToTextFormatter(dayIndex));
    return currentEl;
  }
  currentEl.nodeValue = weekdayToTextFormatter(day);
  return null;
}
function createWeekDaysEl(props, cssPrefix) {
  var cs = (0, _CssClassNames.classNames)(cssPrefix);
  weekdayToTextFormatter = props.get('weekDayToText', defaultWeekDayToText);
  var weekdayFormatter = props.get('weekDayFormatter', defaultWeekDayFormatter);
  var el = (0, _ce["default"])('div', {
    "class": cs('calendar-grid', 'calendar-weekdays')
  });
  for (var dayIndex = 1; dayIndex <= 7; dayIndex++) {
    var wdEl = (0, _append["default"])(el, (0, _ce["default"])('div', {
      "class": cs('calendar-weekday', 'calendar--wd-' + dayIndex)
    }));
    var wdContent = weekdayFormatter(dayIndex);
    if (wdContent) {
      (0, _replaceContent["default"])(wdEl, wdContent);
    }
  }
  return el;
}
var _default = exports["default"] = createWeekDaysEl;

},{"./CssClassNames":9,"dom-helpers/src/append":28,"dom-helpers/src/ce":29,"dom-helpers/src/replaceContent":100}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * Create date cell content
 * On first call currentEl will be null, because date cell
 * is empty.
 * Create currentEl and return it. It will be appended to date cell
 * on next calls currentEl will previously created element
 * Update element here and return null
 * If function returns element it will be reappended in date cell
 * If function return null no append will be made
 */
function defaultMonthDayFormatter(date, currentEl) {
  // Create new because first call
  if (!currentEl) {
    return document.createTextNode(date.getDate());
  }

  // Update existing element
  currentEl.nodeValue = date.getDate();
  return null;
}
var _default = exports["default"] = defaultMonthDayFormatter;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _addDays = _interopRequireDefault(require("../addDays"));
var _cloneDate = _interopRequireDefault(require("../cloneDate"));
var _ce = _interopRequireDefault(require("dom-helpers/src/ce"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function periodStructure(period) {
  var r = [];
  var date = (0, _cloneDate["default"])(period.from);
  while (date.getTime() < period.till.getTime()) {
    r.push((0, _ce["default"])('div', {
      data: {
        ts: date.getTime()
      }
    }));
    date = (0, _addDays["default"])(date, 1);
  }
  return r;
}
var _default = exports["default"] = periodStructure;

},{"../addDays":1,"../cloneDate":5,"dom-helpers/src/ce":29}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _cloneDate = _interopRequireDefault(require("../cloneDate"));
var _infinityswipe = _interopRequireDefault(require("infinityswipe"));
var _properties = _interopRequireDefault(require("../properties"));
var _addWeeks = _interopRequireDefault(require("../addWeeks"));
var _addMonths = _interopRequireDefault(require("../addMonths"));
var _dayOfWeek = _interopRequireDefault(require("../dayOfWeek"));
var _isHigherMonthThan = _interopRequireDefault(require("../isHigherMonthThan"));
var _isHigherDateThan = _interopRequireDefault(require("../isHigherDateThan"));
var _isLowerMonthThan = _interopRequireDefault(require("../isLowerMonthThan"));
var _isLowerDateThan = _interopRequireDefault(require("../isLowerDateThan"));
var _isSameDate = _interopRequireDefault(require("../isSameDate"));
var _findMinMaxDates = _interopRequireDefault(require("../findMinMaxDates"));
var _period = _interopRequireDefault(require("../period"));
var _ce = _interopRequireDefault(require("dom-helpers/src/ce"));
var _qa = _interopRequireDefault(require("dom-helpers/src/qa"));
var _remove = _interopRequireDefault(require("dom-helpers/src/remove"));
var _append = _interopRequireDefault(require("dom-helpers/src/append"));
var _get = _interopRequireDefault(require("dom-helpers/src/http/get"));
var _replaceContent = _interopRequireDefault(require("dom-helpers/src/replaceContent"));
var _clickp = _interopRequireDefault(require("dom-helpers/src/event/clickp"));
var _periodStructure = _interopRequireDefault(require("./periodStructure"));
var _calendarEvents = _interopRequireDefault(require("./calendarEvents"));
var _defaultMonthDayFormatter = _interopRequireDefault(require("./defaultMonthDayFormatter"));
var _createWeekDaysEl = _interopRequireDefault(require("./createWeekDaysEl"));
var _createDateSwitchEl = _interopRequireDefault(require("./createDateSwitchEl"));
var _formatDate = require("../formatDate");
var _CssClassNames = require("./CssClassNames");
var _createPeriod = require("../createPeriod");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function isDateStateDisabled(dateState) {
  // Pēc noklusējuma datums nav disabled
  var isDisabled = false;
  if (dateState && typeof dateState.disabled != 'undefined') {
    isDisabled = dateState.disabled ? true : false;
  }
  return isDisabled;
}

/**
 * Atgriež Date objektu no kalendāra date dom elementa
 */
function getDateElDate(dateEl) {
  return new Date(parseInt(dateEl.dataset.ts, 10));
}
function render(baseDate, props) {
  this.props = new _properties["default"](props);

  /**
   * fullDateFormatter ir pārsaukts par dateCaptionFormatter
   * metam paziņojumu consolē
   */
  if (this.props.get('fullDateFormatter')) {
    console.warn('Calendar: fullDateFormatter is renamed to dateCaptionFormatter');
  }

  // Mazākais datums, kurš nav disabled
  this.setMinDate(this.props.get('minDate'), true);
  this.setMaxDate(this.props.get('maxDate'), true);

  // Infinity swipe reset timeout
  this.irt = 0;
  // Slides decorate timeout
  this.sdt = 0;
  this.events = new _calendarEvents["default"](['change', 'dateclick',
  // TODO vajag jaunu event, date change. Date click, lai ir, ja tieši ir bijis user click
  'periodselect',
  // Pogas next un prev click
  'prevclick', 'nextclick', 'datecaptionclick',
  // Ja maina mēnesi ar swipe kustību, tad izpildās tikai šis
  'slidechange',
  // Visu ielādēto slide events
  'slideschange',
  // State ielādēts pirmo reizi (izpildās tikai vienu reizi)
  'firststateloaded',
  // Ielādēts state no stateUrl
  'stateloaded']);
  this.cssPrefix = this.props.get('cssprefix', 'wb');

  // vai state ielādēts pirmo reizi. vajadzīgs priekš firststateloaded event
  this.isStateLoadedFirstTime = false;
  this.state = this.props.get('state');
  this.stateUrl = this.props.get('stateUrl');
  this.defaultDateState = this.props.get('defaultDateState');

  /**
   * Vienā slide, kurā ir current month
   * vai disable nākošā un iepriekšējā mēneša datumus
   * Tā, lai iespējami paliek tikai viena mēneša datumi
   */
  this.disablePrevMonthDates = this.props.get('disablePrevMonthDates', false);
  this.disableNextMonthDates = this.props.get('disableNextMonthDates', false);
  var cs = (0, _CssClassNames.classNames)(this.cssPrefix);

  // Calendar dom elements
  this.el = (0, _ce["default"])('div', {
    "class": cs('calendar')
  });
  // Date switch el
  this.dateSwitch = null;
  if (this.props.get('showDateSwitch', true)) {
    this.dateSwitch = (0, _createDateSwitchEl["default"])((0, _cloneDate["default"])(baseDate), this.props, this.cssPrefix);
    (0, _append["default"])(this.el, this.dateSwitch.getEl());
  }
  // Weekdays
  if (this.props.get('showWeekdays', true)) {
    (0, _append["default"])(this.el, (0, _createWeekDaysEl["default"])(this.props, this.cssPrefix));
  }
  this.slidesEl = (0, _append["default"])(this.el, (0, _ce["default"])('div', {
    "class": cs('calendar-slides')
  }));
  this.slideEls = (0, _append["default"])(this.slidesEl, Array(this.props.get('slidesCount', 5)).fill().map(function () {
    return (0, _ce["default"])('div', {
      "class": cs('calendar-slide')
    });
  }));

  /**
   * Šis datums tiks izmantots, lai uzstādītu slaidos datumu
   * Slaidiem ir offset no pirmā slide. Šim datuma tiks likts klāt
   * slaida offset kā mēnesis un tādā veidā zināšu
   * kādu mēnesi renderēt attiecīgajā slaidā.
   * Šim datumam nekad nevajadzētu mainīties gadam un mēnesim.
   */
  this.baseDate = (0, _cloneDate["default"])(baseDate);

  /**
   * Apmēram datums, kurš ir kalendārā.
   * Pat ja nav selected tad šis date būs
   * tas mēnesis, kurš ir redzams kalendārā
   */
  this.date = (0, _cloneDate["default"])(baseDate);

  // Vai atzīmēt šodienas datumu
  this.showToday = this.props.get('showToday', false);
  this.today = new Date();
  this.showSelectedDate = this.props.get('showSelectedDate', true);
  this.selectedDate = null;

  /**
   * Pazīme, ka klikšķinot uz datumiem tiek veidots period
   */
  this.selectPeriod = this.props.get('selectPeriod', false);
  if (this.selectPeriod) {
    this.showSelectedDate = false;
  }
  // Vai atļaut periodu ar tikai vienu datumu. Vajadzīgs, ja vajag periodu, bet tajā pašā laikā arī single date
  this.partialPeriod = this.props.get('partialPeriod', false);
  this.selectedPeriod = new _period["default"](this.props.get('selectedPeriod', null));

  // Have user provided custom date formatter
  this.isCustomDateFormatter = true;
  // Calendar month date formatter
  this.dateFormatter = this.props.get('monthDayFormatter');
  if (!this.dateFormatter) {
    this.isCustomDateFormatter = false;
    this.dateFormatter = _defaultMonthDayFormatter["default"];
  }
  this.initInfinitySwipe();
  this.setEvents();
}
render.prototype = {
  setEvents: function setEvents() {
    var _this = this;
    this.infty.onSlideAdd(function (index, el, slide) {
      return _this.handleSlideAdd(index, el, slide);
    });
    this.infty.onChange(function () {
      return _this.handleSlideChange();
    });
    this.infty.onSlidesChange(function (slides) {
      return _this.handleSlidesChange(slides);
    });

    // Event listeners are by data attributes. To be independant of class names
    (0, _clickp["default"])(this.el, '[data-ts]', function (ev, el) {
      return _this.handleDateClick(el);
    });
    (0, _clickp["default"])(this.el, '[data-navprev]', function () {
      return _this.handleDateSwitchPrevClick();
    });
    (0, _clickp["default"])(this.el, '[data-navnext]', function () {
      return _this.handleDateSwitchNextClick();
    });
    (0, _clickp["default"])(this.el, '[data-datecaption]', function () {
      return _this.handleDateSwitchCaptionClick();
    });
  },
  initInfinitySwipe: function initInfinitySwipe() {
    this.infty = new _infinityswipe["default"](this.slidesEl, this.slideEls, {
      positionItems: this.props.get('positionSlides', true),
      slidesPadding: this.props.get('slidesPadding', 0)
    });
  },
  handleSlideAdd: function handleSlideAdd(slideIndex, slideEl, slide) {
    (0, _replaceContent["default"])(slideEl, '');
    var view = this.props.get('view', 'month');
    var count = this.props.get('count', 1);
    var slideDate = this.calcIndexDateByView(view, count, slideIndex);
    slide.setData('date', (0, _cloneDate["default"])(slideDate));
    var cs = (0, _CssClassNames.classNames)(this.cssPrefix);
    var grid = (0, _append["default"])(slideEl, (0, _ce["default"])('div', {
      "class": cs('calendar-grid', 'calendar-dates')
    }));
    (0, _append["default"])(grid, (0, _periodStructure["default"])(this.createDatesPeriodByView(view, count, slideDate)));
    this.decorateSlideDates(slide);
  },
  decorateSlideDates: function decorateSlideDates(slide) {
    var _this2 = this;
    var slideDate = slide.getData('date');
    (0, _qa["default"])(slide.el, '[data-ts]').forEach(function (el) {
      var date = new Date(parseInt(el.dataset.ts, 10));

      /**
       * State vai nu no stateUrl vai custom set caur setState
       *
       * Te ir daži state parametri, kurus kalendārs ņems vērā
       *     disabled - vai datums ir pieejams
       *     html - month date cell html, šis tiks ielikts šūnā
       */
      var dateState = _this2.getDateState(date);
      var isPrevMonth = (0, _isLowerMonthThan["default"])(date, slideDate);
      var isNextMonth = (0, _isHigherMonthThan["default"])(date, slideDate);

      // Pēc noklusējuma datums nav disabled
      var isDateDisabled = isDateStateDisabled(dateState);
      if (_this2.minDate) {
        if ((0, _isLowerDateThan["default"])(date, _this2.minDate)) {
          isDateDisabled = true;
        }
      }
      if (_this2.maxDate) {
        if ((0, _isHigherDateThan["default"])(date, _this2.maxDate)) {
          isDateDisabled = true;
        }
      }

      // Prev/next month date disable
      if (_this2.disablePrevMonthDates && isPrevMonth) {
        isDateDisabled = true;
      }
      if (_this2.disableNextMonthDates && isNextMonth) {
        isDateDisabled = true;
      }

      // Novācam pazīmes prevmonth, nextmonth, currmonth
      delete el.dataset.prevmonth;
      delete el.dataset.nextmonth;
      delete el.dataset.currmonth;
      delete el.dataset.today;
      delete el.dataset.disabled;

      // All available modifiers
      var classes = new _CssClassNames.ClassesList(_this2.cssPrefix, {
        'calendar-date': true,
        'calendar--date-disabled': false,
        'calendar--wd-1': false,
        'calendar--wd-2': false,
        'calendar--wd-3': false,
        'calendar--wd-4': false,
        'calendar--wd-5': false,
        'calendar--wd-6': false,
        'calendar--wd-7': false,
        'calendar--nextmonth': false,
        'calendar--prevmonth': false,
        'calendar--today': false,
        'calendar--selected': false,
        'calendar--period-start': false,
        'calendar--period-end': false,
        'calendar--period-in': false
      });

      // Custom css class name
      if (dateState && typeof dateState.cssClass != 'undefined') {
        dateState.cssClass.split(' ').forEach(function (className) {
          return classes.yes(className);
        });
      }
      classes.yes('calendar--wd-' + (0, _dayOfWeek["default"])(date));
      if (isDateDisabled) {
        classes.yes('calendar--date-disabled');
        el.dataset.disabled = 'disabled';
      }
      if (isPrevMonth) {
        classes.yes('calendar--prevmonth');
        el.dataset.prevmonth = true;
      }
      if (isNextMonth) {
        classes.yes('calendar--nextmonth');
        el.dataset.nextmonth = true;
      }
      if (_this2.showToday) {
        if ((0, _isSameDate["default"])(date, _this2.today)) {
          classes.yes('calendar--today');
          el.dataset.today = true;
        }
      }
      if (_this2.showSelectedDate) {
        if (_this2.selectedDate && (0, _isSameDate["default"])(date, _this2.selectedDate)) {
          classes.yes('calendar--selected');
        }
      }

      // Selected period
      if (_this2.selectedPeriod.isStart(date)) {
        classes.yes('calendar--period-start');
      }
      if (_this2.selectedPeriod.isEnd(date)) {
        classes.yes('calendar--period-end');
      }
      if (_this2.selectedPeriod.isIn(date)) {
        classes.yes('calendar--period-in');
      }
      var contentEl = el.childNodes.length > 0 ? el.childNodes[0] : null;
      var isStateHtml = false;
      if (dateState && typeof dateState.html != 'undefined') {
        isStateHtml = true;
      }
      var newContentEl;
      // Ja ir user definēts formatter, tad tas ir galvenais
      if (_this2.isCustomDateFormatter || !isStateHtml) {
        // Ja bija custom html un tagad vairs nav html, tad padoda null, lai dateFormatter izveido jaunu content
        if (el.dataset.isHtml) {
          newContentEl = _this2.dateFormatter((0, _cloneDate["default"])(date), null, dateState);
        } else {
          newContentEl = _this2.dateFormatter((0, _cloneDate["default"])(date), contentEl, dateState);
        }
        if (newContentEl) {
          (0, _replaceContent["default"])(el, newContentEl);
        }
        delete el.dataset.isHtml;
      } else {
        el.dataset.isHtml = 'yes';
        el.innerHTML = dateState.html;
      }
      el.className = classes.className();
    });
  },
  handleDateSwitchPrevClick: function handleDateSwitchPrevClick() {
    this.infty.prevSlide();
    this.events.fire('prevclick', []);
  },
  handleDateSwitchNextClick: function handleDateSwitchNextClick() {
    this.infty.nextSlide();
    this.events.fire('nextclick', []);
  },
  handleDateSwitchCaptionClick: function handleDateSwitchCaptionClick() {
    this.events.fire('datecaptionclick', []);
  },
  handleDateClick: function handleDateClick(dateEl) {
    var _this3 = this;
    // Vai ir disabled
    if (dateEl.dataset.disabled == 'disabled') {
      return;
    }
    var date = getDateElDate(dateEl);
    if (this.selectPeriod) {
      if (this.selectedPeriod.hasFullPeriod()) {
        this.selectedPeriod.from = date;
        this.selectedPeriod.till = null;
      } else if (!this.selectedPeriod.hasPeriodFrom()) {
        this.selectedPeriod.from = date;
      } else if (!this.selectedPeriod.hasPeriodTill()) {
        this.selectedPeriod.till = date;
      }
      this.selectedPeriod.swapIfMissOrdered();
    } else {
      this.selectedDate = date;
      this.date = (0, _cloneDate["default"])(this.selectedDate);
    }

    /**
     * Ja uzklišķināts uz prev/next
     * mēneša datuma, tad vajag pārslēgt
     * uz attiecīgo mēnesi. Šo darām tikai view=month
     */
    var changeSlide = false;
    if (this.props.get('view') == 'month') {
      changeSlide = true;
    }
    if (changeSlide) {
      // Pārbaudām vai vajag pārslēgties uz prev/next mēnesi
      if (dateEl.dataset.prevmonth) {
        setTimeout(function () {
          return _this3.infty.prevSlide();
        }, 2);
      } else if (dateEl.dataset.nextmonth) {
        setTimeout(function () {
          return _this3.infty.nextSlide();
        }, 2);
      }
    }
    this.refresh();

    // Period mode
    if (this.selectPeriod) {
      if (this.selectedPeriod.hasFullPeriod()) {
        this.events.fire('periodselect', [this.selectedPeriod.toObj()]);
      }
      // Daļējs period
      else if (this.partialPeriod) {
        this.events.fire('periodselect', [this.selectedPeriod.toObj()]);
      }
    }
    // Single date mode
    else {
      this.events.fire('dateclick', [(0, _cloneDate["default"])(this.selectedDate)]);
      this.events.fire('change', [(0, _cloneDate["default"])(this.selectedDate)]);
    }
  },
  handleSlideChange: function handleSlideChange() {
    var slide = this.infty.getCurrent();
    this.date = (0, _cloneDate["default"])(slide.getData('date'));
    if (this.dateSwitch) {
      this.dateSwitch.setDate((0, _cloneDate["default"])(slide.getData('date')));
    }
    this.events.fire('slidechange', [(0, _cloneDate["default"])(slide.getData('date'))]);
  },
  /**
   * Tad, kad ir noformēti visi ielādētie kalendāru slides, tad
   * palaižam event un tajā padodam visus ielādēto kalendāru mēnešus
   */
  handleSlidesChange: function handleSlidesChange(slides) {
    var dates = slides.map(function (slide) {
      return slide.getData('date');
    });
    if (this.stateUrl) {
      this.loadStateFromUrl(dates);
    }
    this.events.fire('slideschange', [dates]);
  },
  getDateState: function getDateState(date) {
    if (!this.state) {
      if (this.defaultDateState) {
        return this.defaultDateState;
      }
      return undefined;
    }
    var dateState = this.state[(0, _formatDate.ymd)(date)];
    if (dateState) {
      return dateState;
    }
    if (this.defaultDateState) {
      return this.defaultDateState;
    }
    return undefined;
  },
  /**
   * Ja ir uzlikts stateUrl, tad ielādējam datumu statusu no šī url
   */
  loadStateFromUrl: function loadStateFromUrl(dates) {
    var _this4 = this;
    var period = (0, _findMinMaxDates["default"])(dates);
    (0, _get["default"])(this.stateUrl, {
      from: (0, _formatDate.ymd)(period.min),
      till: (0, _formatDate.ymd)(period.max)
    }).then(function (state) {
      _this4.setState(state);
      if (!_this4.isStateLoadedFirstTime) {
        _this4.isStateLoadedFirstTime = true;
        _this4.events.fire('firststateloaded', [null]);
      }
      _this4.events.fire('stateloaded', [null]);
    });
  },
  /**
   * Meklējam pirmo datumu, kurš nav disabled
   */
  getFirstNotDisabledDateFromState: function getFirstNotDisabledDateFromState() {
    for (var date in this.state) {
      if (!isDateStateDisabled(this.state[date])) {
        return (0, _formatDate.stringToDate)(date);
      }
    }
    return null;
  },
  /**
   * Aprēķinām datumu pēc padotā slide index
   * Ņemam base date un liekam klāt datumu pēc padotā slideIndex
   */
  calcIndexDateByView: function calcIndexDateByView(view, count, slideIndex) {
    switch (view) {
      case 'week':
        return (0, _addWeeks["default"])(this.baseDate, count * slideIndex);
      case 'month':
        return (0, _addMonths["default"])(this.baseDate, count * slideIndex);
    }
  },
  createDatesPeriodByView: function createDatesPeriodByView(view, count, baseDate) {
    // Period creator
    switch (view) {
      case 'week':
        return (0, _createPeriod.week)(baseDate, count);
      case 'month':
        /**
         * ja ir mēnesis, tad pirmo un pēdējo
         * nedēļu vajag papildināt ar iepriekšējā un
         * nākošā mēneša dienām, lai izveidojas pilnas nedēļas
         */
        return (0, _createPeriod.monthWithFullWeeks)(baseDate, count);
    }
  },
  getEl: function getEl() {
    return this.el;
  },
  on: function on(eventName, cb) {
    this.events.on(eventName, cb);
  },
  /**
   * Uzstāda datuma state
   * State ir key => value objekts, kur key ir datums Y-m-d
   * value varbūt jebkas. Value tiks padots uz monthDayFormatter
   * Pats calendar value neizmanto
   */
  setState: function setState(state) {
    this.state = state;
    this.refresh();
  },
  setDateState: function setDateState(date, state) {
    var k = _typeof(date) == 'object' ? (0, _formatDate.ymd)(date) : date;
    if (!this.state) {
      this.state = {};
    }
    this.state[k] = state;
  },
  setDefaultDateState: function setDefaultDateState(defaultDateState) {
    this.defaultDateState = defaultDateState;
  },
  /**
   * Uzstāda state url
   * Vai arī noņem, ja padots tukšums
   */
  setStateUrl: function setStateUrl(stateUrl) {
    if (this.stateUrl == stateUrl) {
      return;
    }
    this.stateUrl = stateUrl;

    // Notīrām state
    this.state = null;
    if (this.stateUrl) {
      this.loadStateFromUrl(this.infty.getSlides().slides.map(function (slide) {
        return slide.getData('date');
      }));
    } else {
      this.refresh();
    }
  },
  setDate: function setDate(date) {
    var _this5 = this;
    this.date = (0, _cloneDate["default"])((0, _formatDate.toDate)(date));
    if (this.dateSwitch) {
      this.dateSwitch.setDate((0, _cloneDate["default"])(this.date));
    }
    this.baseDate = (0, _cloneDate["default"])(this.date);

    /**
     * Ja izsauc uzreiz pēc calendar instances izveidošanas, tad vēl
     * nav pieejams infinity.slides un ir error
     * Tagad domāju, ka varbūt vispār vajag uzlikt throttle uz restart.
     * Ja nu notiek ciklā izsaukšanas setDate, tad uz katru tiks izsaukts restart
     */
    clearTimeout(this.irt);
    this.irt = setTimeout(function () {
      return _this5.infty.restart();
    }, 10);
  },
  setSelectedDate: function setSelectedDate(date) {
    if (date) {
      this.selectedDate = (0, _cloneDate["default"])((0, _formatDate.toDate)(date));
      this.setDate((0, _cloneDate["default"])(this.selectedDate));
      this.events.fire('change', [(0, _cloneDate["default"])(this.selectedDate)]);
    }
    // Ja padots null, tad novācam selected date
    else {
      this.unselectSelectedDate();
    }
  },
  /**
   * Nemainām kalendāru, bet novācam atzīmēto datumu
   */
  unselectSelectedDate: function unselectSelectedDate() {
    this.selectedDate = null;
    this.refresh();
    this.events.fire('change', [null]);
  },
  /**
   * TODO uztaisīt atsevišķu metodi, kura validēt selectedDate,
   * lai tas nav lielāks vai mazāks par min max Date
   * ja ir, tad izmainīt un fire dateclick
   *
   * setSelectedPeriod, setMinDate, setMaxDate
   */
  setSelectedPeriod: function setSelectedPeriod(period) {
    this.selectedPeriod = new _period["default"](period);
    this.refresh();
  },
  setMinDate: function setMinDate(date, skipRefresh) {
    this.minDate = date ? (0, _formatDate.toDate)(date) : undefined;
    if (!skipRefresh) {
      this.refresh();
    }
  },
  setMaxDate: function setMaxDate(date, skipRefresh) {
    this.maxDate = date ? (0, _formatDate.toDate)(date) : undefined;
    if (!skipRefresh) {
      this.refresh();
    }
  },
  /**
   * Period select režīms
   *     true - būs period select režīms
   *     false - nebūs period select režīms
   */
  setSelectPeriod: function setSelectPeriod(state) {
    this.selectPeriod = state;
    if (this.selectPeriod) {
      this.showSelectedDate = false;
    } else {
      this.showSelectedDate = true;
      this.selectedPeriod = new _period["default"](null);
    }
    this.refresh();
  },
  getDate: function getDate() {
    return (0, _cloneDate["default"])(this.date);
  },
  getSelectedDate: function getSelectedDate() {
    return this.selectedDate ? (0, _cloneDate["default"])(this.selectedDate) : null;
  },
  getSelectedPeriod: function getSelectedPeriod() {
    return this.selectedPeriod.toObj();
  },
  getMinDate: function getMinDate() {
    return this.minDate;
  },
  getMaxDate: function getMaxDate() {
    return this.maxDate;
  },
  /**
   * Ja kalendārā ir disabled dates, piemēram, ar setState uzlikts
   * vai ar min max date.
   * Tad atveram pirmo tuvāko datumu, kurš nav disabled
   */
  scrollFirstAvailableDateIntoViewport: function scrollFirstAvailableDateIntoViewport() {
    var _this6 = this;
    /**
     * Timeout tāpēc, lai infinityswipe var izdarīt savu darbu,
     * jo pēc infinityswipe redzamā slide tiks noteikts, vai
     * datums ir redzams viewportā
     */
    setTimeout(function () {
      // Kalendārā ir redzams datums, kurš nav disabled. Bail
      if (_this6.isNotDisabledDateInViewport()) {
        return;
      }
      var firstNotDisabledDate = _this6.getFirstNotDisabledDateFromState();
      if (firstNotDisabledDate && _this6.minDate) {
        // Min date pārraksta DateState
        if (firstNotDisabledDate < _this6.minDate) {
          firstNotDisabledDate = (0, _cloneDate["default"])(_this6.minDate);
        }
      } else if (_this6.minDate) {
        firstNotDisabledDate = (0, _cloneDate["default"])(_this6.minDate);
      }
      if (firstNotDisabledDate) {
        if (!_this6.isDateInViewport(firstNotDisabledDate)) {
          _this6.setDate(firstNotDisabledDate);
        }
      }
    }, 10);
  },
  /**
   * Vai padotais datums ir redzams viewport
   */
  isDateInViewport: function isDateInViewport(date) {
    var currentSlide = this.infty.getCurrent();
    if (!currentSlide) {
      return false;
    }
    if (date instanceof Date) {
      date = (0, _formatDate.ymd)(date);
    }

    // Redzamajā slide meklējam vai tur ir dateToShow
    return _toConsumableArray((0, _qa["default"])(currentSlide.el, '[data-ts]')) // Ignorējam next un prev month
    .filter(function (dateEl) {
      return !dateEl.dataset.nextmonth;
    }).filter(function (dateEl) {
      return !dateEl.dataset.prevmonth;
    }).map(function (dateEl) {
      return (0, _formatDate.ymd)(getDateElDate(dateEl));
    }).includes(date);
  },
  /**
   * Vai ir redzams datums, kurš nav disabled
   */
  isNotDisabledDateInViewport: function isNotDisabledDateInViewport() {
    var currentSlide = this.infty.getCurrent();
    if (!currentSlide) {
      return false;
    }
    return _toConsumableArray((0, _qa["default"])(currentSlide.el, '[data-ts]')).filter(function (dateEl) {
      return !dateEl.dataset.disabled;
    }).length > 0;
  },
  refresh: function refresh() {
    var _this7 = this;
    // Redecorate all slides
    clearTimeout(this.sdt);
    this.sdt = setTimeout(function () {
      return _this7.infty.getSlides().slides.forEach(function (slide) {
        return _this7.decorateSlideDates(slide);
      });
    }, 10);
  },
  destroy: function destroy() {
    // remove all event listenrs
    //this.setEvents('remove');

    if (this.el) {
      (0, _remove["default"])(this.el);
      delete this.el;
    }
  }
};
var _default = exports["default"] = render;

},{"../addMonths":2,"../addWeeks":3,"../cloneDate":5,"../createPeriod":6,"../dayOfWeek":7,"../findMinMaxDates":16,"../formatDate":17,"../isHigherDateThan":18,"../isHigherMonthThan":19,"../isLowerDateThan":20,"../isLowerMonthThan":21,"../isSameDate":22,"../period":23,"../properties":25,"./CssClassNames":9,"./calendarEvents":10,"./createDateSwitchEl":11,"./createWeekDaysEl":12,"./defaultMonthDayFormatter":13,"./periodStructure":14,"dom-helpers/src/append":28,"dom-helpers/src/ce":29,"dom-helpers/src/event/clickp":37,"dom-helpers/src/http/get":62,"dom-helpers/src/qa":92,"dom-helpers/src/remove":97,"dom-helpers/src/replaceContent":100,"infinityswipe":113}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _cloneDate = _interopRequireDefault(require("./cloneDate"));
var _daysInMonth = _interopRequireDefault(require("./daysInMonth"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function findMinMaxDates(dates) {
  var min, max;
  dates.forEach(function (date) {
    date = (0, _cloneDate["default"])(date);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setMilliseconds(0);
    if (!min) {
      min = (0, _cloneDate["default"])(date);
    } else if (min.getTime() > date.getTime()) {
      min = (0, _cloneDate["default"])(date);
    }
    date.setDate((0, _daysInMonth["default"])(date));
    if (!max) {
      max = (0, _cloneDate["default"])(date);
    } else if (max.getTime() < date.getTime()) {
      max = (0, _cloneDate["default"])(date);
    }
  });
  return {
    min: min,
    max: max
  };
}
var _default = exports["default"] = findMinMaxDates;

},{"./cloneDate":5,"./daysInMonth":8}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fy = Fy;
exports.sameYm = sameYm;
exports.sameYmd = sameYmd;
exports.stringToDate = stringToDate;
exports.toDate = toDate;
exports.yF = yF;
exports.ym = ym;
exports.ymd = ymd;
exports.ymdhis = ymdhis;
function sp(s) {
  s = s + '';
  if (s.length == 1) {
    s = '0' + s;
  }
  return s;
}
function his(date) {
  return sp(date.getHours()) + ':' + sp(date.getMinutes()) + ':' + sp(date.getSeconds());
}
function ymdhis(date) {
  return ymd(date) + ' ' + his(date);
}
function ymd(date) {
  return date.getFullYear() + '-' + sp(date.getMonth() + 1) + '-' + sp(date.getDate());
}
function ym(date) {
  return date.getFullYear() + '-' + sp(date.getMonth() + 1);
}
function yF(date) {
  return date.getFullYear() + ' ' + date.toLocaleString('default', {
    month: 'long'
  });
}
function Fy(date) {
  return date.toLocaleString('default', {
    month: 'long'
  }) + ' ' + date.getFullYear();
}
function sameYear(d1, d2) {
  return d1.getFullYear() === d2.getFullYear();
}
function sameMonth(d1, d2) {
  return d1.getMonth() === d2.getMonth();
}
function sameDate(d1, d2) {
  return d1.getDate() === d2.getDate();
}
function sameYmd(d1, d2) {
  return sameYear(d1, d2) && sameMonth(d1, d2) && sameDate(d1, d2);
}
function sameYm(d1, d2) {
  return sameYear(d1, d2) && sameMonth(d1, d2);
}
function stringToDate(dateString) {
  // Sadalam pa datumu un laiku
  var dp = dateString.split(' ');

  // gads, mēnesis, diena
  var date = dp[0].split('-');
  // stundas, minūtes, sekundes
  var time = [0, 0, 0];
  if (dp.length > 1) {
    time = dp[1].split(':');
  }
  if (date.length != 3 || time.length != 3) {
    return new Date();
  }
  return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
}

/**
 * String or Date, always return Date
 */
function toDate(stringOrDate) {
  if (typeof stringOrDate == 'string' || stringOrDate instanceof String) {
    return stringToDate(stringOrDate);
  } else {
    return new Date(stringOrDate.getTime());
  }
}

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function isHigherDateThan(date1, date2) {
  if (date1.getFullYear() > date2.getFullYear()) {
    return true;
  } else if (date1.getFullYear() == date2.getFullYear()) {
    if (date1.getMonth() > date2.getMonth()) {
      return true;
    } else if (date1.getMonth() == date2.getMonth()) {
      if (date1.getDate() > date2.getDate()) {
        return true;
      }
    }
  }
  return false;
}
var _default = exports["default"] = isHigherDateThan;

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function isHigherMonthThan(date1, date2) {
  if (date1.getFullYear() > date2.getFullYear()) {
    return true;
  } else if (date1.getFullYear() == date2.getFullYear()) {
    if (date1.getMonth() > date2.getMonth()) {
      return true;
    }
  }
  return false;
}
var _default = exports["default"] = isHigherMonthThan;

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function isLowerDateThan(date1, date2) {
  if (date1.getFullYear() < date2.getFullYear()) {
    return true;
  } else if (date1.getFullYear() == date2.getFullYear()) {
    if (date1.getMonth() < date2.getMonth()) {
      return true;
    } else if (date1.getMonth() == date2.getMonth()) {
      if (date1.getDate() < date2.getDate()) {
        return true;
      }
    }
  }
  return false;
}
var _default = exports["default"] = isLowerDateThan;

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function isLowerMonthThan(date1, date2) {
  if (date1.getFullYear() < date2.getFullYear()) {
    return true;
  } else if (date1.getFullYear() == date2.getFullYear()) {
    if (date1.getMonth() < date2.getMonth()) {
      return true;
    }
  }
  return false;
}
var _default = exports["default"] = isLowerMonthThan;

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function isSameDate(date1, date2) {
  if (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()) {
    return true;
  }
  return false;
}
var _default = exports["default"] = isSameDate;

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _cloneDate = _interopRequireDefault(require("./cloneDate"));
var _isSameDate = _interopRequireDefault(require("./isSameDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function Period(period) {
  this.from = period && period.from ? period.from : null;
  this.till = period && period.till ? period.till : null;
}
Period.prototype = {
  isEmpty: function isEmpty() {
    if (this.from) {
      return false;
    }
    if (this.till) {
      return false;
    }
    return true;
  },
  hasFullPeriod: function hasFullPeriod() {
    if (this.from && this.till) {
      return true;
    }
    return false;
  },
  hasPeriodFrom: function hasPeriodFrom() {
    if (this.from) {
      return true;
    }
    return false;
  },
  hasPeriodTill: function hasPeriodTill() {
    if (this.till) {
      return true;
    }
    return false;
  },
  isStart: function isStart(date) {
    if (this.isEmpty()) {
      return false;
    }
    if (!this.from) {
      return false;
    }
    return (0, _isSameDate["default"])(date, this.from);
  },
  isEnd: function isEnd(date) {
    if (this.isEmpty()) {
      return false;
    }
    if (!this.till) {
      return false;
    }
    return (0, _isSameDate["default"])(date, this.till);
  },
  isIn: function isIn(date) {
    if (this.isEmpty()) {
      return false;
    }
    if (date >= this.from && date <= this.till) {
      return true;
    }
    return false;
  },
  swap: function swap() {
    var tmp = this.from;
    this.from = this.till;
    this.till = tmp;
  },
  swapIfMissOrdered: function swapIfMissOrdered() {
    if (this.hasFullPeriod()) {
      if (this.till < this.from) {
        this.swap();
      }
    }
  },
  toObj: function toObj() {
    if (this.isEmpty()) {
      return null;
    }
    return {
      from: this.from ? (0, _cloneDate["default"])(this.from) : null,
      till: this.till ? (0, _cloneDate["default"])(this.till) : null
    };
  }
};
var _default = exports["default"] = Period;

},{"./cloneDate":5,"./isSameDate":22}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var day24h = 1000 * 60 * 60 * 24;
function periodDaysCount(from, till) {
  return Math.round((till - from) / day24h);
}
var _default = exports["default"] = periodDaysCount;

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Properties(props) {
  this.props = typeof props == 'undefined' ? {} : props;
}
Properties.prototype = {
  get: function get(propName, defaultValue) {
    if (typeof this.props[propName] == 'undefined') {
      return defaultValue;
    }
    return this.props[propName];
  }
};
var _default = exports["default"] = Properties;

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _hasClass = _interopRequireDefault(require("./hasClass"));
var _rea = _interopRequireDefault(require("./rea"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(els, className) {
  (0, _rea["default"])(els).forEach(function (el) {
    if (!(0, _hasClass["default"])(el, className)) {
      if (typeof el.classList != 'undefined') {
        el.classList.add(className);
      } else {
        el.className += ' ' + className;
      }
    }
  });
}

},{"./hasClass":59,"./rea":96}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _rea = _interopRequireDefault(require("./rea"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(els, props) {
  (0, _rea["default"])(els).forEach(function (el) {
    for (var name in props) {
      if (!props.hasOwnProperty(name)) {
        continue;
      }
      el.style[name] = props[name];
    }
  });
}

},{"./rea":96}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _re = _interopRequireDefault(require("./re"));
var _isArrayLike = _interopRequireDefault(require("./isArrayLike"));
var _isEmpty = _interopRequireDefault(require("./isEmpty"));
var _isTextContent = _interopRequireDefault(require("./isTextContent"));
var _pe = _interopRequireDefault(require("./pe"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * @param string|DOM node Selector or DOM node
 */
function append(el, childs) {
  // Resolve element
  el = (0, _re["default"])(el);

  /**
   * Array vai NodeList
   *
   * form elementam ir .length
   * Tāpēc, ja skatās pēc iterator, tad form būs kā array
   */
  var items = (0, _isArrayLike["default"])(childs) ? childs : [childs];
  for (var i = 0; i < items.length; i++) {
    var item = (0, _pe["default"])(items[i]);
    if ((0, _isArrayLike["default"])(item)) {
      append(el, item);
    } else {
      if ((0, _isTextContent["default"])(item)) {
        item = document.createTextNode((0, _isEmpty["default"])(item) ? '' : item);
      }
      el.appendChild(item);
    }
  }
  return childs;
}
var _default = exports["default"] = append;

},{"./isArrayLike":75,"./isEmpty":77,"./isTextContent":81,"./pe":88,"./re":95}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _jsx = _interopRequireDefault(require("./jsx"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Wrapper priekš jsx.h
 */
function _default() {
  return _jsx["default"].h.apply(_jsx["default"], Array.prototype.slice.call(arguments));
}

},{"./jsx":82}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _qa = _interopRequireDefault(require("./qa"));
var _re = _interopRequireDefault(require("./re"));
var _setValue = _interopRequireDefault(require("./setValue"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _default(form) {
  form = (0, _re["default"])(form);
  _toConsumableArray((0, _qa["default"])(form, 'input, select, textarea')).forEach(function (field) {
    return (0, _setValue["default"])(field, null);
  });
  return form;
}

},{"./qa":92,"./re":95,"./setValue":103}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el, afterCb) {
  // Resolve element
  el = (0, _re["default"])(el);
  var r = el.cloneNode(true);

  // After clone actions on new node
  if (afterCb) {
    afterCb(r);
  }
  return r;
}

},{"./re":95}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _setAttributes = _interopRequireDefault(require("./setAttributes"));
var _append = _interopRequireDefault(require("./append"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(elementName, attributes) {
  var el = document.createElement(elementName);
  if (attributes) {
    (0, _setAttributes["default"])(el, attributes);
  }
  for (var _len = arguments.length, childs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    childs[_key - 2] = arguments[_key];
  }
  (0, _append["default"])(el, childs);
  return el;
}

},{"./append":28,"./setAttributes":101}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _matchesMethodName = _interopRequireDefault(require("../other/matchesMethodName"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Pievieno event listener.
 * Iekšējai izmantošanai
 * @param args event funkcijas argument (el, eventName, querySelector, cb)
 */
function _default(args, preventDefault) {
  var el = args.el,
    eventName = args.eventName,
    querySelector = args.querySelector,
    cb = args.cb;

  // Atgriežam event handler, lai to var remove
  var eventHandler = function eventHandler(ev) {
    var matchedEl = ev.target;
    if (querySelector) {
      while (matchedEl && matchedEl !== el) {
        if (matchedEl[_matchesMethodName["default"]](querySelector)) {
          // Auto Prevent event
          if (preventDefault) {
            ev.preventDefault();
          }
          if (cb) {
            cb(ev, matchedEl);
          }
          return;
        }
        matchedEl = matchedEl.parentNode;
      }
    } else {
      // Auto Prevent event
      if (preventDefault) {
        ev.preventDefault();
      }
      if (cb) {
        cb(ev, matchedEl);
      }
    }
  };
  el.addEventListener(eventName, eventHandler);
  return eventHandler;
}

},{"../other/matchesMethodName":86}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _parseArguments = _interopRequireDefault(require("./parseArguments"));
var _addListener = _interopRequireDefault(require("./addListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  return (0, _addListener["default"])((0, _parseArguments["default"])(arguments, 'change'), false);
}

},{"./addListener":33,"./parseArguments":43}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _parseArguments = _interopRequireDefault(require("./parseArguments"));
var _addListener = _interopRequireDefault(require("./addListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  return (0, _addListener["default"])((0, _parseArguments["default"])(arguments, 'change'), true);
}

},{"./addListener":33,"./parseArguments":43}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _parseArguments = _interopRequireDefault(require("./parseArguments"));
var _addListener = _interopRequireDefault(require("./addListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  return (0, _addListener["default"])((0, _parseArguments["default"])(arguments, 'click'), false);
}

},{"./addListener":33,"./parseArguments":43}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _parseArguments = _interopRequireDefault(require("./parseArguments"));
var _addListener = _interopRequireDefault(require("./addListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  return (0, _addListener["default"])((0, _parseArguments["default"])(arguments, 'click'), true);
}

},{"./addListener":33,"./parseArguments":43}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _re = _interopRequireDefault(require("../re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function dispatchEvent(el, eventName) {
  el = (0, _re["default"])(el);
  el.dispatchEvent(new Event(eventName, {
    bubbles: true
  }));
}
var _default = exports["default"] = dispatchEvent;

},{"../re":95}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _parseArguments2 = _interopRequireDefault(require("./parseArguments"));
var _removeListener = _interopRequireDefault(require("./removeListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  var _parseArguments = (0, _parseArguments2["default"])(arguments),
    el = _parseArguments.el,
    eventName = _parseArguments.eventName,
    querySelector = _parseArguments.querySelector,
    cb = _parseArguments.cb;
  (0, _removeListener["default"])(el, eventName, cb);
}

},{"./parseArguments":43,"./removeListener":44}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _parseArguments = _interopRequireDefault(require("./parseArguments"));
var _addListener = _interopRequireDefault(require("./addListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  return (0, _addListener["default"])((0, _parseArguments["default"])(arguments), false);
}

},{"./addListener":33,"./parseArguments":43}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _on = _interopRequireDefault(require("./on"));
var _pe = _interopRequireDefault(require("../pe"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Lai mouseover un mouseout izpildās tikai vienu reizi, kad
 * ieiet elementā un ieiziet no elementa
 * ir mouseleve un mouseneter, bet tie does not bubble
 * attiecīgi nevar uztaisīt delegated (jāliek pa tiešo uz dom elementa)
 */
function _default(p1, p2, p3) {
  var parentNode, querySelector, callbacks;
  if (typeof p1 === 'string') {
    parentNode = document;
    querySelector = p1;
    callbacks = p2;
  } else {
    parentNode = (0, _pe["default"])(p1);
    querySelector = p2;
    callbacks = p3;
  }
  var mt = 0;
  var mr = 0;
  var wasMouseOver = false;
  var wasMouseOut = false;
  (0, _on["default"])(parentNode, 'mouseover', querySelector, function (ev, el) {
    clearTimeout(mt);
    mr = setTimeout(function () {
      if (!wasMouseOver) {
        if (callbacks.mouseover) {
          callbacks.mouseover(ev, el);
        }
      }
      wasMouseOver = true;
      wasMouseOut = false;
    }, 5);
  });
  (0, _on["default"])(parentNode, 'mouseout', querySelector, function (ev, el) {
    clearTimeout(mr);
    mt = setTimeout(function () {
      if (!wasMouseOut) {
        if (callbacks.mouseout) {
          callbacks.mouseout(ev, el);
        }
      }
      wasMouseOut = true;
      wasMouseOver = false;
    }, 5);
  });
}

},{"../pe":88,"./on":40}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _parseArguments = _interopRequireDefault(require("./parseArguments"));
var _addListener = _interopRequireDefault(require("./addListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  return (0, _addListener["default"])((0, _parseArguments["default"])(arguments), true);
}

},{"./addListener":33,"./parseArguments":43}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function a(args, index) {
  return index < args.length ? args[index] : undefined;
}
function astring(args, index) {
  return typeof a(args, index) === 'string';
}
function afunction(args, index) {
  return typeof a(args, index) === 'function';
}

/**
 * Parse arguments
 *
 * These are possible signatures
 *
 * First case is when argument definedEventName is undefined
 *
 * 1.1 on(domNode, 'click', '.selector', function(){})
 * 1.2 on(domNode, 'click', function(){})
 * 1.3 on('click', '.selectr', function(){})
 * 1.4 on('click', function(){})
 *
 * Signatures when argument definedEventName is defined
 * In this case asume, that there is no eventName in arguments signature
 *
 * 2.1 click(domNode, '.selector', function(){})
 * 2.2 click(domNode, function(){})
 * 2.3 click('.selector', function(){})
 * 2.4 click(function(){})
 */

function _default(args, definedEventName) {
  var r = {
    el: undefined,
    eventName: undefined,
    querySelector: undefined,
    cb: undefined
  };

  // 2.4
  // Ir padots definedEventName un args ir tikai callback
  if (afunction(args, 0) && definedEventName) {
    r.el = document;
    r.cb = a(args, 0);
    r.eventName = definedEventName;
    return r;
  }
  var i = 0;

  // DOM elements
  // 1.3, 1.4, 2.3
  if (astring(args, i)) {
    r.el = document;
  }
  // 1.1, 1.2, 2.1, 2.2
  else {
    r.el = a(args, i);
    i = i + 1;
  }

  // Event
  if (definedEventName) {
    r.eventName = definedEventName;
  } else {
    r.eventName = a(args, i);
    i = i + 1;
  }

  // Selector un Callback ir pēdējie 1 vai 2 argumenti
  if (astring(args, i)) {
    r.querySelector = a(args, i);
    r.cb = a(args, i + 1);
  } else {
    r.cb = a(args, i);
  }
  return r;
}

},{}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(el, eventName, eventHandler) {
  el.removeEventListener(eventName, eventHandler);
}

},{}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _parseArguments = _interopRequireDefault(require("./parseArguments"));
var _addListener = _interopRequireDefault(require("./addListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  return (0, _addListener["default"])((0, _parseArguments["default"])(arguments, 'submit'), false);
}

},{"./addListener":33,"./parseArguments":43}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _parseArguments = _interopRequireDefault(require("./parseArguments"));
var _addListener = _interopRequireDefault(require("./addListener"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  return (0, _addListener["default"])((0, _parseArguments["default"])(arguments, 'submit'), true);
}

},{"./addListener":33,"./parseArguments":43}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(ev) {
  var el;
  if (ev.target) {
    el = ev.target;
  } else if (ev.srcElement) {
    el = ev.srcElement;
  }

  // Safari bug. Selected text returns text
  if (el.nodeType == 3) {
    el = el.parentNode;
  }
  return el;
}

},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _qa = _interopRequireDefault(require("./qa"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _default(selectEl, value) {
  return _toConsumableArray((0, _qa["default"])((0, _re["default"])(selectEl), 'option')).find(
  // Atgriežam find cb atkarībā no padotā/nepadotā value
  function () {
    return typeof value == 'undefined'
    // Ja nav padots value, tad atgriežam cb, kurš meklē selected
    ? function (el) {
      return el.selected;
    }
    // pretējā gadījumā cb, kurš meklē pēc value
    : function (el) {
      return el.value == value;
    };
  }());
}

},{"./qa":92,"./re":95}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _qa = _interopRequireDefault(require("./qa"));
var _q = _interopRequireDefault(require("./q"));
var _getFormData = _interopRequireDefault(require("./getFormData"));
var _isInputCheckable = _interopRequireDefault(require("./isInputCheckable"));
var _setValue = _interopRequireDefault(require("./setValue"));
var _isArray = _interopRequireDefault(require("./isArray"));
var _clearFormData = _interopRequireDefault(require("./clearFormData"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Interaktīvs form objekts
 * atgriež form lauka vērtību pēc name
 * ja set property ar lauka name, tad vērtība tiek ielikta laukā
 *
 * Nav obligāti padot formu. Jebkurš form lauks, kurš ir padotajā el
 *
 * @nameAttributeName string iespēja norādīt custom name attribute
 * default gadījumā tiek izmantots lauka name attribute, bet
 * ar šo var norādīt citu atribūtu kurš būs name
 * Piemēram, ja name ir sarežģīts name=products[2][price]
 * tad īso name var noradīt data-name=price
 */
function _default(formEl, nameAttributeName) {
  if (typeof nameAttributeName == 'undefined') {
    nameAttributeName = 'name';
  }
  formEl = (0, _re["default"])(formEl);
  return new Proxy((0, _getFormData["default"])(formEl, nameAttributeName), {
    get: function get(target, fieldName, receiver) {
      // Reset form fields
      if (fieldName == 'reset') {
        return function () {
          (0, _clearFormData["default"])(formEl);
        };
      }
      return target[fieldName];
    },
    set: function set(obj, fieldName, value) {
      if ((0, _isArray["default"])(value)) {
        var elements = (0, _qa["default"])(formEl, "[".concat(nameAttributeName, "=\"").concat(fieldName, "[]\"]"));
        for (var i = 0; i < elements.length; i++) {
          if ((0, _isInputCheckable["default"])(elements[i])) {
            // vai elementa value ir masīvā
            (0, _setValue["default"])(elements[i], value.includes(elements[i].value));
          } else {
            (0, _setValue["default"])(elements[i], value[i]);
          }
        }
      } else {
        var fieldEl = (0, _q["default"])(formEl, "[".concat(nameAttributeName, "=\"").concat(fieldName, "\"]"));
        if (fieldEl.type == 'radio') {
          // Atlasām visus radio buttons ar norādīto name
          (0, _qa["default"])(formEl, "[".concat(nameAttributeName, "=\"").concat(fieldName, "\"]")).forEach(function (radioFieldEl) {
            (0, _setValue["default"])(radioFieldEl, value);
          });
        } else {
          (0, _setValue["default"])(fieldEl, value);
        }
      }
      obj[fieldName] = value;

      // paziņo, ka ir ok
      return true;
    }
  });
}

},{"./clearFormData":30,"./getFormData":51,"./isArray":74,"./isInputCheckable":79,"./q":91,"./qa":92,"./re":95,"./setValue":103}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _getStyleValueAsInt = _interopRequireDefault(require("./getStyleValueAsInt"));
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el) {
  el = (0, _re["default"])(el);
  var s = getComputedStyle(el);

  // Noņemam border width
  var borderHorizontal = (0, _getStyleValueAsInt["default"])(s, 'border-left-width') + (0, _getStyleValueAsInt["default"])(s, 'border-right-width');
  var borderVertical = (0, _getStyleValueAsInt["default"])(s, 'border-top-width') + (0, _getStyleValueAsInt["default"])(s, 'border-bottom-width');

  // Noņemam padding width
  var paddingHorizontal = (0, _getStyleValueAsInt["default"])(s, 'padding-left') + (0, _getStyleValueAsInt["default"])(s, 'padding-right');
  var paddingVertical = (0, _getStyleValueAsInt["default"])(s, 'padding-top') + (0, _getStyleValueAsInt["default"])(s, 'padding-bottom');
  if (typeof el.getBoundingClientRect != 'undefined') {
    if (typeof el.getBoundingClientRect().width != 'undefined' && typeof el.getBoundingClientRect().height != 'undefined') {
      return {
        width: el.getBoundingClientRect().width - borderHorizontal - paddingHorizontal,
        height: el.getBoundingClientRect().height - borderVertical - paddingVertical
      };
    }
  }
  return {
    width: el.offsetWidth - borderHorizontal - paddingHorizontal,
    height: el.offsetHeight - borderVertical - paddingVertical
  };
}

},{"./getStyleValueAsInt":55,"./re":95}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _qa = _interopRequireDefault(require("./qa"));
var _re = _interopRequireDefault(require("./re"));
var _value = _interopRequireDefault(require("./value"));
var _isInputCheckable = _interopRequireDefault(require("./isInputCheckable"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Visi form elementi, kas ir padotajā parent
 * form.elements neizmantojam, jo tā ir neertība gadījumā,
 * kad vajag savākt lauku vērtības no parastam div elementa
 *
 * @nameAttributeName string iespēja norādīt custom name attribute
 * default gadījumā tiek izmantots lauka name attribute, bet
 * ar šo var norādīt citu atribūtu kurš būs name
 * Piemēram, ja name ir sarežģīts name=products[2][price]
 * tad īso name var noradīt data-name=price
 */
function _default(form, nameAttributeName) {
  if (typeof nameAttributeName == 'undefined') {
    nameAttributeName = 'name';
  }
  form = (0, _re["default"])(form);
  var fieldValues = {};
  var fields = (0, _qa["default"])(form, 'input[' + nameAttributeName + '], ' + 'select[' + nameAttributeName + '], ' + 'textarea[' + nameAttributeName + '], ' + 'button[' + nameAttributeName + ']');
  for (var i = 0; i < fields.length; i++) {
    var formEl = fields[i];

    // Skip disabled
    if (formEl.disabled) {
      continue;
    }

    // šādi, lai darbotos arī data-* atribūti
    var name = formEl.attributes.getNamedItem(nameAttributeName).value;

    /**
     * Visus laukus pirmajā piegājienā uzskatām par
     * array. Šeit vēl nepārbaudām vai name beidzas ar []
     * Tas ir ar domu, ja ir vairāki lauki ar vienādiem name
     */
    if (typeof fieldValues[name] == 'undefined') {
      fieldValues[name] = [];
    }
    if ((0, _isInputCheckable["default"])(formEl)) {
      if (formEl.checked) {
        fieldValues[name].push((0, _value["default"])(formEl));
      }
    } else {
      fieldValues[name].push((0, _value["default"])(formEl));
    }
  }
  var r = {};
  for (var _name in fieldValues) {
    if (_name.substring(_name.length - 2) == '[]') {
      r[_name.substring(0, _name.length - 2)] = fieldValues[_name];
    } else {
      // ņemam pirmo vērtību
      r[_name] = fieldValues[_name].length > 0 ? fieldValues[_name][0] : '';
    }
  }
  return r;
}

},{"./isInputCheckable":79,"./qa":92,"./re":95,"./value":107}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _getWindowScrollTop = _interopRequireDefault(require("./getWindowScrollTop"));
var _getWindowScrollLeft = _interopRequireDefault(require("./getWindowScrollLeft"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el) {
  el = (0, _re["default"])(el);
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top + (0, _getWindowScrollTop["default"])(),
    left: rect.left + (0, _getWindowScrollLeft["default"])()
  };
}

},{"./getWindowScrollLeft":57,"./getWindowScrollTop":58,"./re":95}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _getStyleValueAsInt = _interopRequireDefault(require("./getStyleValueAsInt"));
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el, includeMargin) {
  el = (0, _re["default"])(el);
  includeMargin = typeof includeMargin == 'undefined' ? false : includeMargin;
  var s = getComputedStyle(el);
  var marginHorizontal = 0;
  var marginVertical = 0;
  if (includeMargin) {
    marginHorizontal = (0, _getStyleValueAsInt["default"])(s, 'margin-left') + (0, _getStyleValueAsInt["default"])(s, 'margin-right');
    marginVertical = (0, _getStyleValueAsInt["default"])(s, 'margin-top') + (0, _getStyleValueAsInt["default"])(s, 'margin-bottom');
  }
  if (typeof el.getBoundingClientRect != 'undefined') {
    if (typeof el.getBoundingClientRect().width != 'undefined' && typeof el.getBoundingClientRect().height != 'undefined') {
      return {
        width: el.getBoundingClientRect().width + marginHorizontal,
        height: el.getBoundingClientRect().height + marginVertical,
        marginH: marginHorizontal,
        marginV: marginVertical
      };
    }
  }
  return {
    width: el.offsetWidth + marginHorizontal,
    height: el.offsetHeight + marginVertical,
    marginH: marginHorizontal,
    marginV: marginVertical
  };
}

},{"./getStyleValueAsInt":55,"./re":95}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el, name) {
  el = (0, _re["default"])(el);
  var s = getComputedStyle(el);
  if (!s) {
    return undefined;
  }
  return s.getPropertyValue(name);
}

},{"./re":95}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(style, name) {
  return parseInt(style.getPropertyValue(name), 10);
}

},{}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default() {
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0];
  return {
    width: w.innerWidth || e.clientWidth || g.clientWidth,
    height: w.innerHeight || e.clientHeight || g.clientHeight
  };
}

},{}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default() {
  return window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft;
}

},{}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default() {
  return window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

},{}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el, className) {
  el = (0, _re["default"])(el);
  if (typeof el.classList != 'undefined') {
    return el.classList.contains(className);
  } else {
    return el.className.match(new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'ig')) ? true : false;
  }
}

},{"./re":95}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _next = _interopRequireDefault(require("./next"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(html) {
  // Šis veido DOM document
  var newEl = new DOMParser().parseFromString(html, 'text/html');

  /**
   * Ņemam tikai pirmo child no body
   * bet jāskatās, lai tas nav textNode
   * ir jāmeklē pirmā īstā node
   *
   * TODO bet vai tomēr nevajag arī ar textNode korekti strādāt?
   * problēma tā, ka ar textNode nevar strādāt kā ar domNode
   */
  var firstNode = newEl.body.firstChild;
  if (firstNode.nodeType !== Node.ELEMENT_NODE) {
    firstNode = (0, _next["default"])(firstNode);
  }
  return firstNode;
}

},{"./next":84}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _jsonOrText = _interopRequireDefault(require("./jsonOrText"));
var _request = _interopRequireDefault(require("./request"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(url, data) {
  return (0, _request["default"])('DELETE', url, data).then(_jsonOrText["default"]);
}

},{"./jsonOrText":64,"./request":67}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _jsonOrText = _interopRequireDefault(require("./jsonOrText"));
var _request = _interopRequireDefault(require("./request"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(url, data) {
  return (0, _request["default"])('GET', url, data).then(_jsonOrText["default"]);
}

},{"./jsonOrText":64,"./request":67}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
/**
 * Is fetch response json
 * Check only headers. Even if there is json header
 * response could be invalid json
 */
function _default(response) {
  if (!response.headers) {
    return false;
  }
  var ct = response.headers.get('content-type');
  return ct && ct.indexOf('application/json') >= 0;
}

},{}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _isResponseJson = _interopRequireDefault(require("./isResponseJson"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Check respone content type and parse response
 * If content type is json then parse json response
 * otherwise return text response
 */
function _default(response) {
  if ((0, _isResponseJson["default"])(response)) {
    return response.json();
  } else {
    return response.text();
  }
}

},{"./isResponseJson":63}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _jsonOrText = _interopRequireDefault(require("./jsonOrText"));
var _request = _interopRequireDefault(require("./request"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(url, data) {
  return (0, _request["default"])('POST', url, data).then(_jsonOrText["default"]);
}

},{"./jsonOrText":64,"./request":67}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _jsonOrText = _interopRequireDefault(require("./jsonOrText"));
var _request = _interopRequireDefault(require("./request"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(url, data) {
  return (0, _request["default"])('POST', url, data, true).then(_jsonOrText["default"]);
}

},{"./jsonOrText":64,"./request":67}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _urlParams = _interopRequireDefault(require("./urlParams"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(method, url, data, postDataAsIs) {
  // Vai sūtīt post body tādu kāds padots
  if (typeof postDataAsIs == 'undefined') {
    postDataAsIs = false;
  }
  var params = {
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    method: method
  };
  if (typeof data != 'undefined') {
    if (method.toUpperCase() == 'GET') {
      // Vai url jau ir uzlikti search params ?
      url = url.split('?');
      var q = (0, _urlParams["default"])(data,
      // Padodam search params no url
      new URLSearchParams(url.length > 1 ? url[1] : '')).toString();
      url = url[0] + (q ? '?' + q : '');
    } else {
      if (postDataAsIs) {
        params.body = data;
      } else {
        params.body = (0, _urlParams["default"])(data);
      }
    }
  }
  return fetch(url, params);
}

},{"./urlParams":69}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _urlParams = _interopRequireDefault(require("./urlParams"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * XHR atšķiras veids kā nolasa headers un response
 * tāpēc te nevar izmantot jsonOnText, kurš tiek izmanots priekš fetch
 */
function isResponseJson(xhr) {
  var ct = xhr.getResponseHeader('content-type');
  return ct && ct.indexOf('application/json') >= 0;
}
function upload(url, file, data, progressCb) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    var request = new XMLHttpRequest();
    request.upload.addEventListener('progress', function (ev) {
      if (ev.lengthComputable && progressCb) {
        progressCb(Math.round(ev.loaded * 100 / ev.total));
      }
    }, false);
    request.onreadystatechange = function () {
      // In local files, status is 0 upon success in Mozilla Firefox
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          if (isResponseJson(request)) {
            return resolve(JSON.parse(request.responseText));
          } else {
            resolve(request.responseText);
          }
        } else {
          if (request.status == 413) {
            return reject({
              code: request.status,
              message: 'Content too large'
            });
          } else {
            if (isResponseJson(request)) {
              return reject({
                code: request.status,
                message: JSON.parse(request.responseText)
              });
            } else {
              reject({
                code: request.status,
                message: request.responseText
              });
            }
          }
        }
      }
    };

    /**
     * Papildus data liekam kā URL params
     * Sākumā pārbaudām vai url jau ir uzlikti search params ?
     */
    url = url.split('?');
    var q = (0, _urlParams["default"])(data,
    // Padodam search params no url
    new URLSearchParams(url.length > 1 ? url[1] : '')).toString();
    url = url[0] + (q ? '?' + q : '');
    request.open('POST', url);
    var fd = new FormData();
    fd.append('file', file);
    request.send(fd);
  });
}
var _default = exports["default"] = upload;

},{"./urlParams":69}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function formatUrlParamKey(path) {
  var r = '';
  for (var i = 0; i < path.length; i++) {
    if (i == 0) {
      r += path[i];
    } else {
      r += '[' + path[i] + ']';
    }
  }
  return r;
}
function qp(data, path, pairs) {
  if (typeof path == 'undefined') {
    path = [];
  }
  if (typeof pairs == 'undefined') {
    pairs = [];
  }
  for (var field in data) {
    var keys = Array.from(path);
    keys.push(field);
    if (_typeof(data[field]) === 'object') {
      pairs = qp(data[field], keys, pairs);
    } else {
      pairs.push([keys, data[field]]);
    }
  }
  return pairs;
}
function _default(data, urlParams) {
  var pairs = qp(data);

  /**
   * Padodam iekšā jau gatavu url search params objektu
   * tas ir gadījumie, kad ir padots url ar jau uzliktiem
   * get parametriem. Tādā gadījumā tos parametrus papildinām
   * ar padotajiem data paramatriem
   */
  if (typeof urlParams == 'undefined') {
    urlParams = new URLSearchParams();
  }
  for (var i = 0; i < pairs.length; i++) {
    urlParams.set(formatUrlParamKey(pairs[i][0]), pairs[i][1]);
  }
  return urlParams;
}

},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "addClass", {
  enumerable: true,
  get: function get() {
    return _addClass["default"];
  }
});
Object.defineProperty(exports, "addStyle", {
  enumerable: true,
  get: function get() {
    return _addStyle["default"];
  }
});
Object.defineProperty(exports, "append", {
  enumerable: true,
  get: function get() {
    return _append["default"];
  }
});
Object.defineProperty(exports, "ce", {
  enumerable: true,
  get: function get() {
    return _ce["default"];
  }
});
Object.defineProperty(exports, "change", {
  enumerable: true,
  get: function get() {
    return _change["default"];
  }
});
Object.defineProperty(exports, "changep", {
  enumerable: true,
  get: function get() {
    return _changep["default"];
  }
});
Object.defineProperty(exports, "clearFormData", {
  enumerable: true,
  get: function get() {
    return _clearFormData["default"];
  }
});
Object.defineProperty(exports, "click", {
  enumerable: true,
  get: function get() {
    return _click["default"];
  }
});
Object.defineProperty(exports, "clickp", {
  enumerable: true,
  get: function get() {
    return _clickp["default"];
  }
});
Object.defineProperty(exports, "clone", {
  enumerable: true,
  get: function get() {
    return _clone["default"];
  }
});
Object.defineProperty(exports, "create", {
  enumerable: true,
  get: function get() {
    return _create["default"];
  }
});
exports["default"] = void 0;
Object.defineProperty(exports, "del", {
  enumerable: true,
  get: function get() {
    return _del["default"];
  }
});
Object.defineProperty(exports, "dispatchEvent", {
  enumerable: true,
  get: function get() {
    return _dispatchEvent["default"];
  }
});
Object.defineProperty(exports, "findSelectOption", {
  enumerable: true,
  get: function get() {
    return _findSelectOption["default"];
  }
});
Object.defineProperty(exports, "form", {
  enumerable: true,
  get: function get() {
    return _form["default"];
  }
});
Object.defineProperty(exports, "get", {
  enumerable: true,
  get: function get() {
    return _get["default"];
  }
});
Object.defineProperty(exports, "getDimensions", {
  enumerable: true,
  get: function get() {
    return _getDimensions["default"];
  }
});
Object.defineProperty(exports, "getFormData", {
  enumerable: true,
  get: function get() {
    return _getFormData["default"];
  }
});
Object.defineProperty(exports, "getOffset", {
  enumerable: true,
  get: function get() {
    return _getOffset["default"];
  }
});
Object.defineProperty(exports, "getOuterDimensions", {
  enumerable: true,
  get: function get() {
    return _getOuterDimensions["default"];
  }
});
Object.defineProperty(exports, "getStyle", {
  enumerable: true,
  get: function get() {
    return _getStyle["default"];
  }
});
Object.defineProperty(exports, "getWindowDimensions", {
  enumerable: true,
  get: function get() {
    return _getWindowDimensions["default"];
  }
});
Object.defineProperty(exports, "getWindowScrollLeft", {
  enumerable: true,
  get: function get() {
    return _getWindowScrollLeft["default"];
  }
});
Object.defineProperty(exports, "getWindowScrollTop", {
  enumerable: true,
  get: function get() {
    return _getWindowScrollTop["default"];
  }
});
Object.defineProperty(exports, "hasClass", {
  enumerable: true,
  get: function get() {
    return _hasClass["default"];
  }
});
Object.defineProperty(exports, "htmlToDomEl", {
  enumerable: true,
  get: function get() {
    return _htmlToDomEl["default"];
  }
});
Object.defineProperty(exports, "insertAfter", {
  enumerable: true,
  get: function get() {
    return _insertAfter["default"];
  }
});
Object.defineProperty(exports, "insertBefore", {
  enumerable: true,
  get: function get() {
    return _insertBefore["default"];
  }
});
Object.defineProperty(exports, "is", {
  enumerable: true,
  get: function get() {
    return _is["default"];
  }
});
Object.defineProperty(exports, "isChild", {
  enumerable: true,
  get: function get() {
    return _isChild["default"];
  }
});
Object.defineProperty(exports, "isInViewport", {
  enumerable: true,
  get: function get() {
    return _isInViewport["default"];
  }
});
Object.defineProperty(exports, "isPromise", {
  enumerable: true,
  get: function get() {
    return _isPromise["default"];
  }
});
Object.defineProperty(exports, "jsx", {
  enumerable: true,
  get: function get() {
    return _jsx["default"];
  }
});
Object.defineProperty(exports, "mn", {
  enumerable: true,
  get: function get() {
    return _mn["default"];
  }
});
Object.defineProperty(exports, "next", {
  enumerable: true,
  get: function get() {
    return _next["default"];
  }
});
Object.defineProperty(exports, "nodeIndex", {
  enumerable: true,
  get: function get() {
    return _nodeIndex["default"];
  }
});
Object.defineProperty(exports, "off", {
  enumerable: true,
  get: function get() {
    return _off["default"];
  }
});
Object.defineProperty(exports, "on", {
  enumerable: true,
  get: function get() {
    return _on["default"];
  }
});
Object.defineProperty(exports, "onMouseOverOut", {
  enumerable: true,
  get: function get() {
    return _onMouseOverOut["default"];
  }
});
Object.defineProperty(exports, "onp", {
  enumerable: true,
  get: function get() {
    return _onp["default"];
  }
});
Object.defineProperty(exports, "parent", {
  enumerable: true,
  get: function get() {
    return _parent["default"];
  }
});
Object.defineProperty(exports, "pe", {
  enumerable: true,
  get: function get() {
    return _pe["default"];
  }
});
Object.defineProperty(exports, "post", {
  enumerable: true,
  get: function get() {
    return _post["default"];
  }
});
Object.defineProperty(exports, "postRaw", {
  enumerable: true,
  get: function get() {
    return _postRaw["default"];
  }
});
Object.defineProperty(exports, "prepend", {
  enumerable: true,
  get: function get() {
    return _prepend["default"];
  }
});
Object.defineProperty(exports, "prev", {
  enumerable: true,
  get: function get() {
    return _prev["default"];
  }
});
Object.defineProperty(exports, "q", {
  enumerable: true,
  get: function get() {
    return _q["default"];
  }
});
Object.defineProperty(exports, "qa", {
  enumerable: true,
  get: function get() {
    return _qa["default"];
  }
});
Object.defineProperty(exports, "qr", {
  enumerable: true,
  get: function get() {
    return _qr["default"];
  }
});
Object.defineProperty(exports, "r", {
  enumerable: true,
  get: function get() {
    return _r["default"];
  }
});
Object.defineProperty(exports, "re", {
  enumerable: true,
  get: function get() {
    return _re["default"];
  }
});
Object.defineProperty(exports, "rea", {
  enumerable: true,
  get: function get() {
    return _rea["default"];
  }
});
Object.defineProperty(exports, "remove", {
  enumerable: true,
  get: function get() {
    return _remove["default"];
  }
});
Object.defineProperty(exports, "removeClass", {
  enumerable: true,
  get: function get() {
    return _removeClass["default"];
  }
});
Object.defineProperty(exports, "replace", {
  enumerable: true,
  get: function get() {
    return _replace["default"];
  }
});
Object.defineProperty(exports, "replaceContent", {
  enumerable: true,
  get: function get() {
    return _replaceContent["default"];
  }
});
Object.defineProperty(exports, "request", {
  enumerable: true,
  get: function get() {
    return _request["default"];
  }
});
Object.defineProperty(exports, "setAttributes", {
  enumerable: true,
  get: function get() {
    return _setAttributes["default"];
  }
});
Object.defineProperty(exports, "setFormData", {
  enumerable: true,
  get: function get() {
    return _setFormData["default"];
  }
});
Object.defineProperty(exports, "setValue", {
  enumerable: true,
  get: function get() {
    return _setValue["default"];
  }
});
Object.defineProperty(exports, "setWindowScrollTop", {
  enumerable: true,
  get: function get() {
    return _setWindowScrollTop["default"];
  }
});
Object.defineProperty(exports, "submit", {
  enumerable: true,
  get: function get() {
    return _submit["default"];
  }
});
Object.defineProperty(exports, "submitForm", {
  enumerable: true,
  get: function get() {
    return _submitForm["default"];
  }
});
Object.defineProperty(exports, "submitp", {
  enumerable: true,
  get: function get() {
    return _submitp["default"];
  }
});
Object.defineProperty(exports, "target", {
  enumerable: true,
  get: function get() {
    return _target["default"];
  }
});
Object.defineProperty(exports, "toggleClass", {
  enumerable: true,
  get: function get() {
    return _toggleClass["default"];
  }
});
Object.defineProperty(exports, "upload", {
  enumerable: true,
  get: function get() {
    return _upload["default"];
  }
});
Object.defineProperty(exports, "urlParams", {
  enumerable: true,
  get: function get() {
    return _urlParams["default"];
  }
});
Object.defineProperty(exports, "value", {
  enumerable: true,
  get: function get() {
    return _value["default"];
  }
});
Object.defineProperty(exports, "wrap", {
  enumerable: true,
  get: function get() {
    return _wrap["default"];
  }
});
var _getOuterDimensions = _interopRequireDefault(require("./getOuterDimensions"));
var _getWindowDimensions = _interopRequireDefault(require("./getWindowDimensions"));
var _getWindowScrollTop = _interopRequireDefault(require("./getWindowScrollTop"));
var _getWindowScrollLeft = _interopRequireDefault(require("./getWindowScrollLeft"));
var _setWindowScrollTop = _interopRequireDefault(require("./setWindowScrollTop"));
var _replaceContent = _interopRequireDefault(require("./replaceContent"));
var _replace = _interopRequireDefault(require("./replace"));
var _setAttributes = _interopRequireDefault(require("./setAttributes"));
var _getDimensions = _interopRequireDefault(require("./getDimensions"));
var _isInViewport = _interopRequireDefault(require("./isInViewport"));
var _removeClass = _interopRequireDefault(require("./removeClass"));
var _getOffset = _interopRequireDefault(require("./getOffset"));
var _nodeIndex = _interopRequireDefault(require("./nodeIndex"));
var _toggleClass = _interopRequireDefault(require("./toggleClass"));
var _addClass = _interopRequireDefault(require("./addClass"));
var _hasClass = _interopRequireDefault(require("./hasClass"));
var _addStyle = _interopRequireDefault(require("./addStyle"));
var _getStyle = _interopRequireDefault(require("./getStyle"));
var _parent = _interopRequireDefault(require("./parent"));
var _isChild = _interopRequireDefault(require("./isChild"));
var _remove = _interopRequireDefault(require("./remove"));
var _create = _interopRequireDefault(require("./create"));
var _append = _interopRequireDefault(require("./append"));
var _prepend = _interopRequireDefault(require("./prepend"));
var _insertBefore = _interopRequireDefault(require("./insertBefore"));
var _insertAfter = _interopRequireDefault(require("./insertAfter"));
var _clone = _interopRequireDefault(require("./clone"));
var _wrap = _interopRequireDefault(require("./wrap"));
var _value = _interopRequireDefault(require("./value"));
var _setValue = _interopRequireDefault(require("./setValue"));
var _getFormData = _interopRequireDefault(require("./getFormData"));
var _setFormData = _interopRequireDefault(require("./setFormData"));
var _clearFormData = _interopRequireDefault(require("./clearFormData"));
var _submitForm = _interopRequireDefault(require("./submitForm"));
var _form = _interopRequireDefault(require("./form"));
var _findSelectOption = _interopRequireDefault(require("./findSelectOption"));
var _next = _interopRequireDefault(require("./next"));
var _prev = _interopRequireDefault(require("./prev"));
var _qa = _interopRequireDefault(require("./qa"));
var _q = _interopRequireDefault(require("./q"));
var _qr = _interopRequireDefault(require("./qr"));
var _r = _interopRequireDefault(require("./r"));
var _re = _interopRequireDefault(require("./re"));
var _rea = _interopRequireDefault(require("./rea"));
var _pe = _interopRequireDefault(require("./pe"));
var _mn = _interopRequireDefault(require("./mn"));
var _jsx = _interopRequireDefault(require("./jsx"));
var _ce = _interopRequireDefault(require("./ce"));
var _htmlToDomEl = _interopRequireDefault(require("./htmlToDomEl"));
var _is = _interopRequireDefault(require("./is"));
var _isPromise = _interopRequireDefault(require("./isPromise"));
var _off = _interopRequireDefault(require("./event/off"));
var _onp = _interopRequireDefault(require("./event/onp"));
var _on = _interopRequireDefault(require("./event/on"));
var _click = _interopRequireDefault(require("./event/click"));
var _clickp = _interopRequireDefault(require("./event/clickp"));
var _submit = _interopRequireDefault(require("./event/submit"));
var _submitp = _interopRequireDefault(require("./event/submitp"));
var _change = _interopRequireDefault(require("./event/change"));
var _changep = _interopRequireDefault(require("./event/changep"));
var _onMouseOverOut = _interopRequireDefault(require("./event/onMouseOverOut"));
var _target = _interopRequireDefault(require("./event/target"));
var _dispatchEvent = _interopRequireDefault(require("./event/dispatchEvent"));
var _get = _interopRequireDefault(require("./http/get"));
var _post = _interopRequireDefault(require("./http/post"));
var _del = _interopRequireDefault(require("./http/del"));
var _postRaw = _interopRequireDefault(require("./http/postRaw"));
var _upload = _interopRequireDefault(require("./http/upload"));
var _request = _interopRequireDefault(require("./http/request"));
var _urlParams = _interopRequireDefault(require("./http/urlParams"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  getOuterDimensions: _getOuterDimensions["default"],
  getWindowDimensions: _getWindowDimensions["default"],
  getWindowScrollTop: _getWindowScrollTop["default"],
  getWindowScrollLeft: _getWindowScrollLeft["default"],
  setWindowScrollTop: _setWindowScrollTop["default"],
  replaceContent: _replaceContent["default"],
  replace: _replace["default"],
  setAttributes: _setAttributes["default"],
  getDimensions: _getDimensions["default"],
  isInViewport: _isInViewport["default"],
  removeClass: _removeClass["default"],
  getOffset: _getOffset["default"],
  nodeIndex: _nodeIndex["default"],
  toggleClass: _toggleClass["default"],
  addClass: _addClass["default"],
  hasClass: _hasClass["default"],
  addStyle: _addStyle["default"],
  getStyle: _getStyle["default"],
  parent: _parent["default"],
  isChild: _isChild["default"],
  remove: _remove["default"],
  create: _create["default"],
  append: _append["default"],
  prepend: _prepend["default"],
  insertBefore: _insertBefore["default"],
  insertAfter: _insertAfter["default"],
  clone: _clone["default"],
  wrap: _wrap["default"],
  value: _value["default"],
  setValue: _setValue["default"],
  getFormData: _getFormData["default"],
  setFormData: _setFormData["default"],
  clearFormData: _clearFormData["default"],
  submitForm: _submitForm["default"],
  form: _form["default"],
  findSelectOption: _findSelectOption["default"],
  next: _next["default"],
  prev: _prev["default"],
  off: _off["default"],
  onp: _onp["default"],
  on: _on["default"],
  click: _click["default"],
  clickp: _clickp["default"],
  submit: _submit["default"],
  submitp: _submitp["default"],
  change: _change["default"],
  changep: _changep["default"],
  onMouseOverOut: _onMouseOverOut["default"],
  target: _target["default"],
  dispatchEvent: _dispatchEvent["default"],
  qa: _qa["default"],
  q: _q["default"],
  qr: _qr["default"],
  r: _r["default"],
  re: _re["default"],
  rea: _rea["default"],
  pe: _pe["default"],
  mn: _mn["default"],
  jsx: _jsx["default"],
  ce: _ce["default"],
  htmlToDomEl: _htmlToDomEl["default"],
  is: _is["default"],
  isPromise: _isPromise["default"],
  get: _get["default"],
  post: _post["default"],
  del: _del["default"],
  postRaw: _postRaw["default"],
  upload: _upload["default"],
  request: _request["default"],
  urlParams: _urlParams["default"]
};

},{"./addClass":26,"./addStyle":27,"./append":28,"./ce":29,"./clearFormData":30,"./clone":31,"./create":32,"./event/change":34,"./event/changep":35,"./event/click":36,"./event/clickp":37,"./event/dispatchEvent":38,"./event/off":39,"./event/on":40,"./event/onMouseOverOut":41,"./event/onp":42,"./event/submit":45,"./event/submitp":46,"./event/target":47,"./findSelectOption":48,"./form":49,"./getDimensions":50,"./getFormData":51,"./getOffset":52,"./getOuterDimensions":53,"./getStyle":54,"./getWindowDimensions":56,"./getWindowScrollLeft":57,"./getWindowScrollTop":58,"./hasClass":59,"./htmlToDomEl":60,"./http/del":61,"./http/get":62,"./http/post":65,"./http/postRaw":66,"./http/request":67,"./http/upload":68,"./http/urlParams":69,"./insertAfter":71,"./insertBefore":72,"./is":73,"./isChild":76,"./isInViewport":78,"./isPromise":80,"./jsx":82,"./mn":83,"./next":84,"./nodeIndex":85,"./parent":87,"./pe":88,"./prepend":89,"./prev":90,"./q":91,"./qa":92,"./qr":93,"./r":94,"./re":95,"./rea":96,"./remove":97,"./removeClass":98,"./replace":99,"./replaceContent":100,"./setAttributes":101,"./setFormData":102,"./setValue":103,"./setWindowScrollTop":104,"./submitForm":105,"./toggleClass":106,"./value":107,"./wrap":108}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _mn = _interopRequireDefault(require("./mn"));
var _parent = _interopRequireDefault(require("./parent"));
var _next = _interopRequireDefault(require("./next"));
var _append = _interopRequireDefault(require("./append"));
var _isArray = _interopRequireDefault(require("./isArray"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * @param string|DOM node Selector or DOM node
 */
function _default(el, nodes) {
  // Resolve element
  el = (0, _re["default"])(el);
  var parentEl = (0, _parent["default"])(el);
  var items = (0, _isArray["default"])(nodes) ? nodes : [nodes];
  var nextEl = (0, _next["default"])(el);
  for (var i = items.length - 1; i >= 0; i--) {
    // Atrodam nākošo node, lai varētu uztaisīt insertBefore
    if (nextEl) {
      el = parentEl.insertBefore((0, _mn["default"])(items[i]), nextEl);
    } else {
      el = (0, _append["default"])(parentEl, (0, _mn["default"])(items[i]));
    }
  }
  return nodes;
}

},{"./append":28,"./isArray":74,"./mn":83,"./next":84,"./parent":87,"./re":95}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _mn = _interopRequireDefault(require("./mn"));
var _parent = _interopRequireDefault(require("./parent"));
var _isArray = _interopRequireDefault(require("./isArray"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * @param string|DOM node Selector or DOM node
 */
function _default(el, nodes) {
  // Resolve element
  el = (0, _re["default"])(el);
  var parentEl = (0, _parent["default"])(el);
  var items = (0, _isArray["default"])(nodes) ? nodes : [nodes];

  // Liekam backward secībā, lai būt ielikti tādā pašā secībā kā padoti
  for (var i = items.length - 1; i >= 0; i--) {
    el = parentEl.insertBefore((0, _mn["default"])(items[i]), el);
  }
  return nodes;
}

},{"./isArray":74,"./mn":83,"./parent":87,"./re":95}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _matchesMethodName = _interopRequireDefault(require("./other/matchesMethodName"));
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Vai padotais elements atbilst padotajam querySelector
 */
function _default(el, querySelector) {
  el = (0, _re["default"])(el);
  if (el) {
    if (el[_matchesMethodName["default"]]) {
      return el[_matchesMethodName["default"]](querySelector);
    }
  }
  return false;
}

},{"./other/matchesMethodName":86,"./re":95}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(value) {
  if (typeof Array.isArray != 'undefined') {
    return Array.isArray(value);
  }
  return Object.prototype.toString.call(value) === '[object Array]';
}

},{}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
/**
 * Array un NodeList būs kā array
 *
 * Nevar skatīties pēs .length un iterator, jo .length ir arī form elementam
 */
function _default(value) {
  return Object.prototype.toString.call(value) === '[object Array]' || Object.prototype.toString.call(value) === '[object NodeList]';
}

},{}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(target, element) {
  var n = target.parentNode;
  while (n) {
    if (n == element) {
      return true;
    }
    n = n.parentNode;
  }
  return false;
}

},{}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(v) {
  return typeof v === 'undefined' || v === null;
}

},{}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _getWindowDimensions = _interopRequireDefault(require("./getWindowDimensions"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el) {
  el = (0, _re["default"])(el);
  var rect = el.getBoundingClientRect();
  var wd = (0, _getWindowDimensions["default"])();
  return isOverlap(rect.top, rect.top + rect.height, 0, wd.height) && isOverlap(rect.left, rect.left + rect.width, 0, wd.width);
}
function isOverlap(from1, till1, from2, till2) {
  return from1 >= from2 && from1 < till2 || from2 >= from1 && till1 > from2;
}

},{"./getWindowDimensions":56,"./re":95}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function isInputCheckable(input) {
  return input.type == 'checkbox' || input.type == 'radio';
}
var _default = exports["default"] = isInputCheckable;

},{}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _default(value) {
  if (!value) {
    return false;
  }
  if (_typeof(value) != 'object') {
    return false;
  }
  if (typeof value.then !== 'function') {
    return false;
  }
  return true;
}

},{}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(c) {
  return typeof c === 'string' || typeof c === 'number' || typeof c === 'undefined' || c === null;
}

},{}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _setAttributes = _interopRequireDefault(require("./setAttributes"));
var _append = _interopRequireDefault(require("./append"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Helpers for using jsx syntax to create dom elements
 * use babel pragma to set custom handler for creating dom elements
 */
var _default = exports["default"] = {
  Fragment: 'fragment',
  h: function h(elementName, attributes) {
    var el;
    if (elementName === this.Fragment) {
      el = new DocumentFragment();
    } else if (typeof elementName == 'function') {
      el = elementName(attributes);
    } else {
      el = document.createElement(elementName);
      if (attributes) {
        (0, _setAttributes["default"])(el, attributes);
      }
    }
    if (el) {
      for (var _len = arguments.length, childs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        childs[_key - 2] = arguments[_key];
      }
      (0, _append["default"])(el, childs);
    }
    return el;
  }
};

},{"./append":28,"./setAttributes":101}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _isEmpty = _interopRequireDefault(require("./isEmpty"));
var _isTextContent = _interopRequireDefault(require("./isTextContent"));
var _pe = _interopRequireDefault(require("./pe"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Maybe create node if passed element is not node
 * Text is translated to textNode
 * If passed element is node, then return it
 */
function _default(el) {
  el = (0, _pe["default"])(el);
  if ((0, _isTextContent["default"])(el)) {
    el = document.createTextNode((0, _isEmpty["default"])(el) ? '' : el);
  }
  return el;
}

},{"./isEmpty":77,"./isTextContent":81,"./pe":88}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _matchesMethodName = _interopRequireDefault(require("./other/matchesMethodName"));
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Return next node after passed node
 */
function next(el, querySelectorMatch) {
  if (!el) {
    return null;
  }
  el = (0, _re["default"])(el);
  if (!el.nextElementSibling) {
    return null;
  }

  // Ja next node nav ELEMENT_NODE, tad skip un atgriežam nākošo
  if (el.nextElementSibling.nodeType !== Node.ELEMENT_NODE) {
    return next(el.nextElementSibling);
  }

  // Ja ir padots querySelector kuram ir jāatbilst atrastajai next nodei
  if (querySelectorMatch && el.nextElementSibling[_matchesMethodName["default"]]) {
    if (!el.nextElementSibling[_matchesMethodName["default"]](querySelectorMatch)) {
      return next(el.nextElementSibling, querySelectorMatch);
    }
  }
  return el.nextElementSibling;
}
var _default = exports["default"] = next;

},{"./other/matchesMethodName":86,"./re":95}],85:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Find element index in its parent
 * For example what is index of li item in ul
 */
function _default(el) {
  el = (0, _re["default"])(el);
  if (!el) {
    return;
  }

  // Table row, has attribute rowIndex
  switch (el.tagName.toUpperCase()) {
    case 'TR':
      return el.rowIndex;
  }
  if (!el.parentNode) {
    return;
  }
  var child,
    index = 0;
  // Search amongs parent childNodes
  for (var i = 0; i < el.parentNode.childNodes.length; i++) {
    child = el.parentNode.childNodes[i];

    // Accept only element nodes. Exclude nodes like text and so on
    if (child.nodeType != Node.ELEMENT_NODE) {
      continue;
    }
    if (child === el) {
      return index;
    }
    index++;
  }
}

},{"./re":95}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * Store matches method name
 * Internet explorer 11 uses msMatchesSelector
 * Modern browsers - matches
 *
 * Element.prototype.matches = Element.prototype.msMatchesSelector;
 */
var n = 'matches';
if (typeof Element.prototype.msMatchesSelector != 'undefined') {
  n = 'msMatchesSelector';
}
var _default = exports["default"] = n;

},{}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _matchesMethodName = _interopRequireDefault(require("./other/matchesMethodName"));
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Find elements parent node matching querySelector
 * or return el if it matches querySelector
 *
 * @param stopQuerySelecot querySelector at which to stop looking for parent. Use full
 * whene you know your most parent
 */
function _default(el, querySelector, stopQuerySelecot) {
  el = (0, _re["default"])(el);

  // If no query selector, than return direct parent
  if (!querySelector) {
    return el.parentNode;
  }

  // Also check if elements has "method" matches. nodeType=9 (Node.DOCUMENT_NODE) does not have matches method
  while (el && el[_matchesMethodName["default"]]) {
    if (el[_matchesMethodName["default"]](querySelector)) {
      return el;
    }

    // Check for stop query selector
    if (stopQuerySelecot && el[_matchesMethodName["default"]](stopQuerySelecot)) {
      return null;
    }
    el = el.parentNode;
  }
  return null;
}

},{"./other/matchesMethodName":86,"./re":95}],88:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
/**
 * Resolve proxy element
 * Ja ir proxy, tad atgriež original elementu,
 * ja nav proxy, tad atgriež to pašu
 */
function _default(el) {
  if (el && el['__isproxy__']) {
    return el['__self__'];
  }
  return el;
}

},{}],89:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _mn = _interopRequireDefault(require("./mn"));
var _isArray = _interopRequireDefault(require("./isArray"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * @param string|DOM node Selector or DOM node
 */
function _default(parent, childs) {
  // Resolve element
  parent = (0, _re["default"])(parent);
  var firstNode = parent.hasChildNodes() ? parent.childNodes[0] : null;
  var items = (0, _isArray["default"])(childs) ? childs : [childs];

  // Liekam backward secībā, lai parentā būt ielikti tādā pašā secībā kā padoti
  for (var i = items.length - 1; i >= 0; i--) {
    if (firstNode) {
      firstNode = parent.insertBefore((0, _mn["default"])(items[i]), firstNode);
    } else {
      firstNode = parent.appendChild((0, _mn["default"])(items[i]));
    }
  }
  return childs;
}

},{"./isArray":74,"./mn":83,"./re":95}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _matchesMethodName = _interopRequireDefault(require("./other/matchesMethodName"));
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Return prev node before passed node
 */
function prev(el, querySelectorMatch) {
  if (!el) {
    return null;
  }
  el = (0, _re["default"])(el);
  if (!el.previousElementSibling) {
    return null;
  }

  // Ja next node nav ELEMENT_NODE, tad skip un atgriežam nākošo
  if (el.previousElementSibling.nodeType !== Node.ELEMENT_NODE) {
    return prev(el.previousElementSibling);
  }

  // Ja ir padots querySelector kuram ir jāatbilst atrastajai next nodei
  if (querySelectorMatch && el.previousElementSibling[_matchesMethodName["default"]]) {
    if (!el.previousElementSibling[_matchesMethodName["default"]](querySelectorMatch)) {
      return prev(el.previousElementSibling, querySelectorMatch);
    }
  }
  return el.previousElementSibling;
}
var _default = exports["default"] = prev;

},{"./other/matchesMethodName":86,"./re":95}],91:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _pe = _interopRequireDefault(require("./pe"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * querySelector
 */
function _default(p1, p2) {
  var parentNode, querySelector;
  if (typeof p1 === 'string') {
    parentNode = document;
    querySelector = p1;
  } else {
    parentNode = (0, _pe["default"])(p1);
    querySelector = p2;
  }
  return parentNode.querySelector(querySelector);
}

},{"./pe":88}],92:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _pe = _interopRequireDefault(require("./pe"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * querySelectorAll
 */
function _default(p1, p2) {
  var parentNode, querySelector;
  if (typeof p1 === 'string') {
    parentNode = document;
    querySelector = p1;
  } else {
    parentNode = (0, _pe["default"])(p1);
    querySelector = p2;
  }
  return parentNode.querySelectorAll(querySelector);
}

},{"./pe":88}],93:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _q = _interopRequireDefault(require("./q"));
var _parent = _interopRequireDefault(require("./parent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Relative querySelector. Run querySelector relative to el
 * if querySelector starts with "parent:" then run upwards
 * if querySelector starts with "child:" then run downwards
 * if none, than run on document
 */
function _default(el, querySelector) {
  el = (0, _re["default"])(el);
  var p = querySelector.indexOf(':');
  if (p >= 0) {
    // Query daļa, bez direction daļas (īstais query)
    var relativeQuery = querySelector.substring(p + 1);

    /**
     * Kurā virzienā meklēt pēc querySelector (parent|child)
     *
     * switch nostrādās tikai, ja direction ir parent vai child
     * pretējā gadījumā nostrādās pēdējais return
     * ar visu padoto querySelector
     */
    switch (querySelector.substring(0, p)) {
      case 'parent':
        return (0, _parent["default"])(el, relativeQuery);
      case 'child':
        return (0, _q["default"])(el, relativeQuery);
    }
  }

  // Uz visu document
  return (0, _q["default"])(querySelector);
}

},{"./parent":87,"./q":91,"./re":95}],94:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _q = _interopRequireDefault(require("./q"));
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Ref elements
 * Give dom element. Child elements should have data atrribute ref
 * then returned Proxy object will return direct dom element by ref
 */
function createProxy(el) {
  if (!el) {
    return null;
  }
  return new Proxy(el, {
    get: function get(target, prop, receiver) {
      /**
       * Helper metodes, lai varētu ātri iegūt original el
       * un noteikt vai elements ir proxy
       */
      if (prop == '__self__') {
        return target;
      }
      if (prop == '__isproxy__') {
        return true;
      }

      // Pārbaudām vai prasītais prop ir pašam objektam
      if (prop in target) {
        // Vai ir callable
        if (typeof target[prop] === 'function') {
          return target[prop].bind(target);
        }
        return target[prop];
      }

      // Pašās beigās meklējam pēc relation un atgriežām kā r objektu
      return createProxy((0, _q["default"])(target, "[data-r=".concat(prop, "]")));
    },
    set: function set(obj, prop, newValue) {
      obj[prop] = newValue;
      return true;
    }
  });
}
function r(el) {
  el = (0, _re["default"])(el);
  return createProxy(el);
}
var _default = exports["default"] = r;

},{"./q":91,"./re":95}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _q = _interopRequireDefault(require("./q"));
var _pe = _interopRequireDefault(require("./pe"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Resolve dom element.
 * First check if el is string representing selector, then
 * find element matching selector using document.querySelector function
 * Otherwise return el
 */
function _default(el) {
  if (typeof el === 'string') {
    return (0, _q["default"])(el);
  }
  return (0, _pe["default"])(el);
}

},{"./pe":88,"./q":91}],96:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _qa = _interopRequireDefault(require("./qa"));
var _pe = _interopRequireDefault(require("./pe"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Resolve dom element.
 * First check if el is string representing selector, then
 * find element matching selector using document.querySelectorAll function
 * Always return NodeList or array, even if els is single Dom Node
 */
function _default(els) {
  if (typeof els === 'string') {
    return (0, _qa["default"])(els);
  }

  // If single dom node
  if (_typeof(els) == 'object' && typeof els.tagName != 'undefined') {
    return [(0, _pe["default"])(els)];
  }
  return _toConsumableArray(els).map(function (el) {
    return (0, _pe["default"])(el);
  });
}

},{"./pe":88,"./qa":92}],97:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _rea = _interopRequireDefault(require("./rea"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el) {
  (0, _rea["default"])(el).forEach(function (el) {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
}

},{"./rea":96}],98:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _rea = _interopRequireDefault(require("./rea"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(els, className) {
  (0, _rea["default"])(els).forEach(function (el) {
    if (typeof el.classList != 'undefined') {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'ig'), '');
    }
  });
}

},{"./rea":96}],99:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _isPromise = _interopRequireDefault(require("./isPromise"));
var _htmlToDomEl = _interopRequireDefault(require("./htmlToDomEl"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _replace(oldEl, newEl) {
  if (typeof newEl === 'string') {
    // ja string, tad parsējam par Node
    newEl = (0, _htmlToDomEl["default"])(newEl);
  }
  oldEl.parentNode.replaceChild(newEl, oldEl);
  return newEl;
}

/**
 * Replace element with new element
 * New element can be dom node or html
 */
function _default(el, newEl) {
  el = (0, _re["default"])(el);
  if (el && el.parentNode && newEl) {
    if ((0, _isPromise["default"])(newEl)) {
      // Promise gadījumā atgriežam arī promise
      return new Promise(function (resolve, reject) {
        newEl.then(function (newHtml) {
          resolve(_replace(el, newHtml));
        });
      });
    } else {
      return _replace(el, newEl);
    }
  }

  // Vienmēr atgriežam jauno el, ja arī padotais el non existing
  return newEl;
}

},{"./htmlToDomEl":60,"./isPromise":80,"./re":95}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _q = _interopRequireDefault(require("./q"));
var _append = _interopRequireDefault(require("./append"));
var _isTextContent = _interopRequireDefault(require("./isTextContent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * replace element childs with new dom element
 * Signatures
 * replaceContent(domNode, selector, newContent)
 * replaceContent(domNode, newContent)
 * replaceContent(selector, newContent)
 */
function _default(a1, a2, a3) {
  var el, newContent;

  // First element is querySelector
  if (typeof a1 === 'string') {
    newContent = a2;
    el = (0, _q["default"])(document, a1);
  }
  // First element is domNode
  else {
    // Second is string and third argument is defined
    if (typeof a2 === 'string' && typeof a3 != 'undefined') {
      newContent = a3;
      el = (0, _q["default"])(a1, a2);
    }
    // Second argument is newContent
    else {
      el = a1;
      newContent = a2;
    }
  }
  if (!el) {
    return newContent;
  }
  if ((0, _isTextContent["default"])(newContent)) {
    el.innerHTML = newContent;
    // return first child
    return el.firstChild;
  } else {
    el.innerHTML = '';
    return (0, _append["default"])(el, newContent);
  }
}

},{"./append":28,"./isTextContent":81,"./q":91}],101:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _isEmpty = _interopRequireDefault(require("./isEmpty"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el, attributes) {
  el = (0, _re["default"])(el);
  var tagName = el.tagName.toUpperCase();
  var value;
  for (var key in attributes) {
    if (!attributes.hasOwnProperty(key)) {
      continue;
    }
    value = attributes[key];
    if (key == 'className') {
      key = 'class';
    }
    if (key.substring(0, 5) == 'data-') {
      el.dataset[key.substring(5)] = value;
    } else if (key == 'data') {
      for (var k in value) {
        el.dataset[k] = value[k];
      }
    } else if (key == 'style') {
      for (var _k in value) {
        el.style[_k] = value[_k];
      }
    } else if (key == 'checked' && tagName == 'INPUT') {
      el.checked = value ? true : false;
    } else {
      el.setAttribute(key, (0, _isEmpty["default"])(value) ? '' : value);
    }
  }
}

},{"./isEmpty":77,"./re":95}],102:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _qa = _interopRequireDefault(require("./qa"));
var _re = _interopRequireDefault(require("./re"));
var _setValue = _interopRequireDefault(require("./setValue"));
var _isArray = _interopRequireDefault(require("./isArray"));
var _clearFormData = _interopRequireDefault(require("./clearFormData"));
var _isInputCheckable = _interopRequireDefault(require("./isInputCheckable"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _default(form, data) {
  form = (0, _re["default"])(form);

  // Notīrām formas laukus
  (0, _clearFormData["default"])(form);
  var formElements = _toConsumableArray((0, _qa["default"])(form, 'input, select, textarea'));
  var _loop = function _loop(name) {
    var elements = [];
    if ((0, _isArray["default"])(data[name])) {
      elements = formElements.filter(function (el) {
        return el.name == name + '[]';
      });
    } else {
      elements = formElements.filter(function (el) {
        return el.name == name;
      });
    }
    if ((0, _isArray["default"])(data[name])) {
      for (var i = 0; i < elements.length; i++) {
        if ((0, _isInputCheckable["default"])(elements[i])) {
          // vai elementa value ir masīvā
          (0, _setValue["default"])(elements[i], data[name].includes(elements[i].value));
        } else {
          (0, _setValue["default"])(elements[i], data[name][i]);
        }
      }
    } else {
      if (elements.length > 0) {
        // Vairāki checkable elementi ar vienādu vārdu
        if ((0, _isInputCheckable["default"])(elements[0])) {
          // check to, kuram value ir tāds kā padots data[name]
          if (typeof data[name] != 'boolean') {
            var foundByValue = elements.find(function (el) {
              return el.value == data[name];
            });
            if (foundByValue) {
              (0, _setValue["default"])(foundByValue, data[name]);
            }
          } else {
            // Check pirmo, kuram nav uzstādīts value
            var foundWithoutValue = elements.find(function (el) {
              if (!el.value) {
                return true;
              }
              if (el.value == 'on') {
                return true;
              }
              return false;
            });
            if (foundWithoutValue) {
              (0, _setValue["default"])(foundWithoutValue, data[name]);
            }
          }
        } else {
          (0, _setValue["default"])(elements[0], data[name]);
        }
      }
    }
  };
  for (var name in data) {
    _loop(name);
  }
  return form;
}

},{"./clearFormData":30,"./isArray":74,"./isInputCheckable":79,"./qa":92,"./re":95,"./setValue":103}],103:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _q = _interopRequireDefault(require("./q"));
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(p1, p2, p3) {
  var field;
  var value;

  // Ja padots trešais arguments, tad pirmais būs form un
  // otrais arguments ir field name
  if (typeof p3 != 'undefined') {
    var form = (0, _re["default"])(p1);
    if (form) {
      //field = form.elements[p2];
      // aizstājam ar q, jo padotais var nebūt form, bet jebkurš dom elements
      field = (0, _q["default"])(form, "[name=".concat(p2, "]"));
    }
    value = p3;
  } else {
    field = (0, _re["default"])(p1);
    value = p2;
  }
  if (typeof value == 'undefined') {
    value = null;
  }
  if (!field) {
    return '';
  }
  if (field.type == 'checkbox') {
    return field.checked = value ? true : false;
  } else if (field.type == 'radio') {
    return field.checked = value == field.value;
  } else {
    return field.value = value;
  }
  return field.value;
}

},{"./q":91,"./re":95}],104:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(top) {
  window.scrollTo(0, top);
}

},{}],105:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
var _request = _interopRequireDefault(require("./http/request"));
var _jsonOrText = _interopRequireDefault(require("./http/jsonOrText"));
var _getFormData = _interopRequireDefault(require("./getFormData"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * TODO vajag veidu, kā dot iespēju pielabot formData pirms submit
 */
function _default(form, url, method) {
  form = (0, _re["default"])(form);
  if (typeof url == 'undefined') {
    url = form.action;
  }
  if (typeof method == 'undefined') {
    method = form.method;
  }
  return (0, _request["default"])(method, url, (0, _getFormData["default"])(form)).then(_jsonOrText["default"]);
}

},{"./getFormData":51,"./http/jsonOrText":64,"./http/request":67,"./re":95}],106:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _rea = _interopRequireDefault(require("./rea"));
var _hasClass = _interopRequireDefault(require("./hasClass"));
var _addClass = _interopRequireDefault(require("./addClass"));
var _removeClass = _interopRequireDefault(require("./removeClass"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * @param addOrRemove boolean|undefined. If true, than addClass. If false - removeClass
 */
function _default(els, className, addOrRemove) {
  (0, _rea["default"])(els).forEach(function (el) {
    if (typeof addOrRemove != 'undefined') {
      if (addOrRemove) {
        (0, _addClass["default"])(el, className);
      } else {
        (0, _removeClass["default"])(el, className);
      }
    } else {
      // Toggle
      if ((0, _hasClass["default"])(el, className)) {
        (0, _removeClass["default"])(el, className);
      } else {
        (0, _addClass["default"])(el, className);
      }
    }
  });
}

},{"./addClass":26,"./hasClass":59,"./rea":96,"./removeClass":98}],107:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _q = _interopRequireDefault(require("./q"));
var _re = _interopRequireDefault(require("./re"));
var _isInputCheckable = _interopRequireDefault(require("./isInputCheckable"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(p1, p2) {
  var field;

  // Ja padots otrais arguments, tad pirmais būs form un
  // otrais arguments ir form field name
  if (typeof p2 != 'undefined') {
    var form = (0, _re["default"])(p1);
    if (form) {
      field = (0, _q["default"])(form, '[name="' + p2 + '"]');
    }
  } else {
    field = (0, _re["default"])(p1);
  }
  if (!field) {
    return '';
  }
  if ((0, _isInputCheckable["default"])(field)) {
    if (field.value == 'on') {
      return field.checked ? true : false;
    } else {
      return field.checked ? field.value : '';
    }
  }
  return field.value;
}

},{"./isInputCheckable":79,"./q":91,"./re":95}],108:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el, wrapEl) {
  el = (0, _re["default"])(el);
  var parent = el.parentNode;
  if (!parent) {
    return null;
  }

  // Ja ir padots tag name
  if (typeof wrapEl == 'string') {
    wrapEl = document.createElement(wrapEl);
  }
  wrapEl.appendChild(parent.replaceChild(wrapEl, el));
  return wrapEl;
}

},{"./re":95}],109:[function(require,module,exports){
module.exports = function(sourceEl, parent) {
    let r = sourceEl.cloneNode(true);
    parent.appendChild(r);
    return r;
}
},{}],110:[function(require,module,exports){
var cloneAndAppend = require('./cloneAndAppend');

function isjQuery(obj) {
    // Pārbaudām vai ir globālais jQuery objekts
    if (typeof jQuery != 'undefined') {
        return obj instanceof jQuery;
    }

    if (obj && typeof obj.jquery != 'undefined') {
        return true;
    }

    return false;
}

/**
 * jQuery, DOM or array items collection
 */
function elementsCollection(items, minLength) {
    var mthis = this;

    this.items = [];

    if (isjQuery(items)) {
        items.each(function(i){
            mthis.items.push(this)
        });
    }
    else {
        // Pārtaisām par vienkārši masīvu. Ari nodeList tiek pārtaisīts par masīvu
        for (var i = 0; i < items.length; i++) {
            mthis.items.push(items[i])
        }
    }

    // Clone elements so list is at least minLength
}

elementsCollection.prototype = {
    each: function(cb) {
        for (var i = 0; i < this.items.length; i++) {
            cb(this.items[i], i);
        }
    },
    clone: function(minLength) {
        if (this.items.length <= 0) {
            return;
        }
        if (this.items.length >= minLength) {
            return;
        }

        let len = this.items.length;
        let parentNode = this.items[0].parentNode;
        // Dublējam visu elementu kopu kamēr kopējais elementus skaits nav lielāks par minLength
        while (this.items.length < minLength) {
            // klonējam tikai pirmos oriģinālos elementus
            for (var i = 0; i < len; i++) {
                this.items.push(cloneAndAppend(this.items[i], parentNode))
            }
        }
    }
}

module.exports = elementsCollection
},{"./cloneAndAppend":109}],111:[function(require,module,exports){
function getStyleDimensions(style, name) {
    return parseInt(style.getPropertyValue(name), 10);
}

function getElementDimensions(el) {
    var s = getComputedStyle(el);

    // Noņemam border width
    var borderHorizontal = getStyleDimensions(s, 'border-left-width') + getStyleDimensions(s, 'border-right-width');
    var borderVertical = getStyleDimensions(s, 'border-top-width') + getStyleDimensions(s, 'border-bottom-width');

    // Noņemam padding width
    var paddingHorizontal = getStyleDimensions(s, 'padding-left') + getStyleDimensions(s, 'padding-right');
    var paddingVertical = getStyleDimensions(s, 'padding-top') + getStyleDimensions(s, 'padding-bottom');

    if (typeof el.getBoundingClientRect != 'undefined') {
        var rect = el.getBoundingClientRect();
        if (typeof rect.width != 'undefined' && typeof rect.height != 'undefined') {
            return {
                width: rect.width - borderHorizontal - paddingHorizontal,
                height: rect.height - borderVertical - paddingVertical
            }
        }
    }

    return {
        width: el.offsetWidth - borderHorizontal - paddingHorizontal,
        height: el.offsetHeight - borderVertical - paddingVertical
    }
}

module.exports = getElementDimensions;
},{}],112:[function(require,module,exports){
function getStyleDimensions(style, name) {
    return parseInt(style.getPropertyValue(name), 10);
}

function getElementOuterDimensions(el, includeMargin) {
    includeMargin = typeof includeMargin == 'undefined' ? false : includeMargin;

    var s = getComputedStyle(el);

    var marginHorizontal = 0;
    var marginVertical = 0;
    if (includeMargin) {
        marginHorizontal = getStyleDimensions(s, 'margin-left') + getStyleDimensions(s, 'margin-right');
        marginVertical = getStyleDimensions(s, 'margin-top') + getStyleDimensions(s, 'margin-bottom');    
    }

    if (typeof el.getBoundingClientRect != 'undefined') {
        var rect = el.getBoundingClientRect();
        if (typeof rect.width != 'undefined' && typeof rect.height != 'undefined') {
            return {
                width: rect.width + marginHorizontal,
                height: rect.height + marginVertical,

                marginH: marginHorizontal,
                marginV: marginVertical
            }
        }
    }

    return {
        width: el.offsetWidth + marginHorizontal,
        height: el.offsetHeight + marginVertical,

        marginH: marginHorizontal,
        marginV: marginVertical
    }
}

module.exports = getElementOuterDimensions;
},{}],113:[function(require,module,exports){
var Swipe = require('swipe');
var Stepper = require('stepper');
var Slides = require('./slides');
var getElementDimensions = require('./getElementDimensions');
var replaceContent = require('./replaceContent');

function createSwipe(el, $slides, conf) {
    var slideAddCb, changeCb, slidesChangeCb, pagesCountCb, slideMoveCb = function(){}, slideMoveStartCb = function(){}, slideClickCb = function(){};
    var slides, stepper, viewportWidth = 0, startMoveSlide;
    var startPos = 0, offsetX = 0, isMoveStarted = false;
    var stepperCurve = [0,0,.12,1];
    var stepperDuration = 300;

    var swipeConfig = {
        'direction': 'horizontal',
        'fireMoveOnRequestAnimationFrame': true
    }

    var rotateItems = getRotateItems();

    // Pēc noklusējuma viss ir enbabled, bet ir iespēja uz mirkli atslēgt touch eventus
    var isEnabled = true;

    function initSwipe() {
        new Swipe(getSwipeTarget(), swipeConfig)
            .on('start', startMove)
            .on('move', handleMove)
            .on('tap', handleClick)
            .on('end', endMove)
    }

    function initSlides() {
        slides = new Slides($slides, viewportWidth, {
            onSlideAdd: handleSlideAdd,
            onSlidesChange: handleSlidesChange,
            onPagesCount: handlePagesCount,

            /**
             * Lai nopizicionētus slides atbilstoši custom uzstādītajam snapPosition.x
             *
             * callback tiks padots slides instance, jo mirklī kas tiks izpildīts callback
             * šeit esošā slides instance vēl nebūs uzstādīta (skat augstāk slides = new Slides)
             */
            onAfterPrepareSlides: setCustomSnapPosition,

            slidesPadding: getSlidesPadding,
            positionItems: getPositionItems(),
            rotateItems: getRotateItems(),
            boxOffset: {
                left: getSnapPosition().x
            }
        });
    }

    function initStepper() {
        stepper = new Stepper({
            bezierCurve: stepperCurve
        });
    }

    /**
     * Nopozicionējam sākuma stāvoklī
     * Ja ir uzlikts custom snapPosition.x
     * Tuvākais slide pie snapPosition.x nopozicionēsies tajā vietā
     *
     * Funkcija saņem slides instanci kā argumentu. Tāpēc šeit netiek izmantota "globālā" slides instance
     */
    function setCustomSnapPosition(slides) {
        var x = getSnapPosition().x;
        if (x != 0) {
            var target = getSnapTarget(slides.findClosestToX(x));

            slides.start();
            slides.setXOffset(target.to.x - target.slide.getX());
        }
    }

    function handleClick(ev) {
        slideClickCb(slides.findByDomElement(ev.touchedElement));
    }

    function startMove(d) {
        if (!isEnabled) {
            return;
        }

        if (stepper.isRunning()) {
            stepper.stop();
        }

        // Pieglabājam current slide, no kura tika sākta kustība
        startMoveSlide = getCurrent();

        slides.start();
        isMoveStarted = true;

        slideMoveStartCb(d.touchedElement ? true : false);
    }

    function handleMove(d) {
        if (!isEnabled) {
            return;
        }

        if (stepper.isRunning()) {
            return;
        }

        if (!isMoveStarted) {
            return;
        }

        slideMoveCb(Math.abs(d.offset.x) / viewportWidth, d.direction, d.touchedElement ? true : false, getVisible());

        /**
         * Ja nav jārotē items, tad jāčeko vai ir pienācis
         * laiks apstādināt items pārvietošanos un jāsāk bremzēšana
         * Tipa elastic scroll
         *
         * slides.getLast().getX() + getLast().width - ja šis ir mazāks par view[port width
         * slides.getFirst().getX() - lielāks par nulli
         */
        if (!rotateItems) {
            slides.setXOffset(
                // Aprēķinām kāds ir slide out platums un to bremzējam
                // lai iegūtu elastic swipe efektu
                // bremzējam tikai slide out vērtību
                d.offset.x - getSlideOutXWidth(d.offset.x)*0.75
            );
        }
        else {
            slides.setXOffset(d.offset.x);
        }
    }

    function endMove(d) {
        if (!isEnabled) {
            return;
        }

        if (!isMoveStarted) {
            return;
        }

        isMoveStarted = false;

        /**
         * Pārbaudām vai ir offset. Ja ir bijis tikai click, tad
         * offset nebūs. Šādu endMove ignorējam
         */
        if (!d.offset) {
            return;
        }

        snapSlide(
            // Šeit ņemam vērā isSwipe, lai saprastu uz kuru slide snapot
            getSnapTarget(getSlideToSnapByEndMove(d)),

            d.isSwipe,
            d.touchedElement ? true : false,

            // Kāda ir manualMove distance
            // kādas ir virziens
            {
                offset: Math.abs(d.offset.x),
                direction: d.direction
            }
        );
    }

    function getSlideOutXWidth(offsetX) {
        var f = getFirstSlideOutWidth(offsetX);
        var l = getLastSlideOutWidth(offsetX);

        if (f > 0) {
            return f;
        }

        if (l > 0) {
            return -l;
        }

        return 0;
    }

    /**
     * Tiek izmantota tikai no rotate gadījumā
     * Vai pirmais slide tiek skrollēts pāri
     * savām robežām
     */
    function isFirstSlideOut(offsetX) {
        return getFirstSlideOutWidth(offsetX) > 0
    }
    function getFirstSlideOutWidth(offsetX) {

        var x = slides.first().getX();
        if (typeof offsetX != 'undefined') {
            x = slides.first().getXWithoutOffset() + offsetX;
        }

        if (x > 0) {
            return x;
        }
        return 0;
    }

    function isLastSlideOut(offsetX) {
        return getLastSlideOutWidth(offsetX) > 0
    }
    function getLastSlideOutWidth(offsetX) {
        var r = slides.last();

        var x = r.getX() + r.width;
        if (typeof offsetX != 'undefined') {
            x = r.getXWithoutOffset() + r.width + offsetX;
        }

        if (x <  viewportWidth) {
            return viewportWidth - x;
        }
        return 0;
    }

    function getSlideToSnapByEndMove(d) {
        // Rotēšana atslēgta
        if (!rotateItems) {
            /**
             * Snap uz to slide, kurš ir ārpus zonas
             *
             * Ja neviens slide nav ārpus zonas, tad
             * izpildīsies parastais scenārijs pēc
             * swipe kustības
             */
            if (isFirstSlideOut()) {
                return slides.first();
            }
            else if (isLastSlideOut()) {
                return slides.last();
            }
        }


        /**
         * Kāda daļa no pārbīdāmā slide jau ir pārbīdīta
         * Tas vajadzīgs, lai gadījumā ja tikai nedaudz pabīdīts, tad
         * atliktu atpakaļ, tas ir, lietotājs nemaz negribēja pārbīdīt
         * Ja ratio lielāks par 0.333, tad lietotājs gribēja bīdīt
         * Kaut gan šeit mazākiem slaidiem varbūt 0.33 ir maz???
         */
        var moveRatio = Math.abs(d.offset.x / startMoveSlide.width)

        // Ja direction left, tad tuvāko slide labajai malai
        if (d.direction == 'left') {
            if (d.isSwipe || moveRatio > 0.33333) {
                return slides.findClosestToXFromRight(getSnapPosition().x)
            }
            else {
                return slides.findClosestToXFromLeft(getSnapPosition().x)
            }
        }
        else {
            if (d.isSwipe || moveRatio > 0.33333) {
                return slides.findClosestToXFromLeft(getSnapPosition().x)
            }
            else {
                return slides.findClosestToXFromRight(getSnapPosition().x)
            }
        }
    }

    /**
     * Atgriež x, y pozīciju uz kuru snapot
     * padoto slide. Ja slide vajag snapot pret:
     * labo malu, tad snap target būs 0 @todo šis ir konfigurējam
     * Ja vajag pret kreiso malu, tad viewportWidth - slide.width @todo šis ir konfigurējam
     *
     * Te tiek ņemta vērā rotateItems pazīme, pēc tās tiek noteiks
     * vai snapot uz kreiso vai labo pusi
     *
     * Jāņem vērā vai snap uz norādīto target neuztaisīs slideOut
     * gadījumu. Ja tā ir, tad vajag piekoriģēt snapTarget, lai tā
     * nenotiku
     */
    function getSlideSnapPosition(slideToSnap) {
        /**
         * By default snapojam slide kreiso malu
         * pie viewport kreisās malas
         *
         * @todo Uztaisīt, lai var nodefinēt pret kuru
         * malu snapot slide
         */
        if (rotateItems) {
            return getSnapPosition()
        }

        /**
         * Slides netiek rotēti, šeit jāsāk pārbaudīt
         * gadījumi, kad pirmais vai pēdējais slide iet
         * ārpus viewport dimensijām
         */
        if (isLastSlideOut()) {
            // Pēdējā slide labajai malai ir jānostājas līdz ar viewport labo malu
            return {
                x: viewportWidth - slides.last().width,
                y: undefined
            }
        }

        if (isFirstSlideOut()) {
            // Pirmā slide kreisā mala pret viewport kreiso malu
            return {
                x: 0,
                y: undefined
            }
        }

        /**
         * Jāpārbauda vai pēc slide snap netiks uztaisīt
         * slide out situācija
         *
         * Šādi parasti notiek ar pēdējo slide
         * @todod bet vajag uztaisīt check arī uz pirmo slide
         */

        // Pēc noklusējuma snapojam slide uz 0 pozīciju
        var d = (slides.last().getX() + slides.last().width) - viewportWidth;

        return {
            x: Math.max(0, slideToSnap.getX() - d),
            y: undefined
        }
    }

    function getSnapTarget(slide) {
        return {
            slide: slide,
            to: getSlideSnapPosition(slide)
        }
    }

    /**
     * Nofiksējam target.slide pret norādīto target.to.x pozīciju
     */
    function snapSlide(target, isSwipe, isTouch, manualMove) {

        if (typeof isSwipe == 'undefined') {
            isSwipe = false;
        }
        if (typeof isTouch == 'undefined') {
            isTouch = false;
        }

        /**
         * Aprēķinām kādu vajag offset, lai pārvietotos no getX uz target.to.x
         * Kad progress ir 0, tad offset atteicīgi arī ir 0
         * Kad progress ir 1, tad tas offset ir attālums starp target.slide.getX un target.to.x
         */
        var targetOffset = target.to.x - target.slide.getX();

        // Ja targetOffset 0, tad bail, neko nedarām, nekāda kustība nenotiks
        if (targetOffset === 0) {
            return;
        }

        var targetDirection = targetOffset > 0 ? 'right' : 'left';

        var startProgress = 0;
        var pv = 0;
        var slideMoveProgress = 0;

        slides.start();

        stepper.runFrom(startProgress, {
            duration: stepperDuration,
            onStep: function(progress){

                pv = progressToValue(progress, 0, targetOffset);

                slides.setXOffset(pv);

                /**
                 * Ja snap slides notiek tajā pašā virzienā, kā bija move kustība, tad
                 * progresēja uz 1
                 * Ja snap slides notiek atpakaļ, tad progresējam uz 0
                 * SlideMoveCb vienmēr dodam progress turpinājumu
                 * Tas progress, kad ir te ir cits - tas ir progress no 0 līdz vietai, kura vajag snap slide
                 * Tāpēc šeit savādāk rēķinām progresus
                 * Šeit ņemam to abs(offset) kādu veica lietotājs un liekam klāt to offset kādu vajag, lai
                 * slaidi uztaisīt snap savā vietā
                 * Ja virzieni sakrīt (lietotāja move un slidesnap), tad progresējam
                 * Ja nē, tad regresējam atpakaļ uz sākumu
                 */
                if (manualMove) {
                    // Turpinām progresu, lai tas uzaug līdz 1, jo snap turpina tajā pašā virzienā
                    if (manualMove.direction == targetDirection) {
                        slideMoveProgress = manualMove.offset + Math.abs(pv)
                    }
                    // Ejam atpakaļ uz izejas pozīciju, regresējam
                    else {
                        slideMoveProgress = manualMove.offset + (-Math.abs(pv))
                    }
                    // Progress ir pārvietojums pret viewport platumu
                    slideMoveProgress = slideMoveProgress / viewportWidth;
                }
                // Kustība notiek bez manuāli iesāktas kustības
                else {
                    slideMoveProgress = progress
                }

                slideMoveCb(slideMoveProgress, targetDirection, false, getVisible());

            },
            onDone: function() {
                slideSnapTransitionDone({
                    isSwipe: isSwipe,
                    isTouch: isTouch
                });
            }
        })
    }

    function progressToValue(progress, fromValue, toValue) {
        var w = fromValue - toValue;
        return fromValue - (w * progress);
    }

    function validateProgress(p) {
        if (p < 0) {
            p = 0;
        }
        if (p > 1) {
            p = 1;
        }
        return p;
    }

    function slideSnapTransitionDone(params) {
        if (typeof changeCb != 'undefined') {
            changeCb(params);
        }
    }

    /**
     * Atgriež viewportā redzamos slides
     */
    function getVisible() {
        return slides.findVisibleBetweenX(getSnapPosition().x, viewportWidth)
    }

    function getCurrent() {
        return slides.findFirstBetweenX(getSnapPosition().x-1, viewportWidth);
    }

    function getNext() {
        return slides.findClosestToXFromRight(getCurrent().getX()+1);
    }

    function getPrev() {
        return slides.findClosestToXFromLeft(getCurrent().getX() - 1);
    }

    function getSwipeTarget() {
        if (conf && conf.swipeTarget) {
            return conf.swipeTarget;
        }
        return el;
    }

    function getSlidesPadding() {
        if (conf && typeof conf.slidesPadding != 'undefined') {
            if (typeof conf.slidesPadding == 'function') {
                return conf.slidesPadding();
            }
            else {
                return conf.slidesPadding;
            }
        }

        return 0;
    }

    function getPositionItems() {
        if (conf && typeof conf.positionItems != 'undefined') {
            return conf.positionItems;
        }
        return false;
    }

    /**
     * Config params vai slaidus vajag rotēt
     * Pēc noklusējuma vajag rotēt
     *
     * @todo Varbūt tomēr nevajag rotēt pēc noklusējuma
     *
     */
    function getRotateItems() {
        if (conf && typeof conf.rotate != 'undefined') {
            return conf.rotate;
        }
        return true;
    }

    function getSnapPosition() {
        if (conf && typeof conf.snapPosition != 'undefined') {
            return conf.snapPosition;
        }
        return {
            x: 0,
            y: undefined
        };
    }

    /**
     * Uzstāda jaunu snapPostion
     */
    function setSnapPosition(p) {
        conf.snapPosition = p;

        slides.setBoxOffset({
            left: getSnapPosition().x
        })

        /**
         * @todo pārtaisīt, lai šeit netiktu izsaukts setCustomSnapPosition
         * To pēc idejas vajadzētu darīt pašam slides
         * bet atkal slides nenodarbojas ar pozicionēšanas animēšanu
         * Kaut kas jāizdomā
         */
        setCustomSnapPosition(slides);
    }

    function handleSlideAdd(index, el, slide) {
        if (slideAddCb) {
            var newContent = slideAddCb(index, el, slide);
            if (typeof newContent != 'undefined') {
                replaceContent(el, newContent)
            }
        }
    }

    function handleSlidesChange(slides) {
        if (slidesChangeCb) {
            slidesChangeCb(slides)
        }
    }

    function handlePagesCount(c) {
        if (pagesCountCb) {
            pagesCountCb(c)
        }
    }

    function setIsEnabled(s) {
        isEnabled = s;
    }

    function setSlidesViewportWidth() {
        viewportWidth = getElementDimensions(el).width;

        slides.setViewportWidth(viewportWidth);
        slides.reset();
    }

    // Liekam timeout, lai izpildās nākamajā scope
    // Vajag, lai izsaucošais kods var uzlikt onSlideAdd pirms tam
    setTimeout(function(){
        initSwipe();
        initSlides();
        initStepper();

        setSlidesViewportWidth();
    });

    return {
        onSlideAdd: function(cb) {
            slideAddCb = cb;
        },
        onSlidesChange: function(cb){
            slidesChangeCb = cb;
        },
        onChange: function(cb) {
            changeCb = cb;
        },
        onPagesCount: function(cb) {
            pagesCountCb = cb;
        },
        onSlideMoveStart: function(cb) {
            slideMoveStartCb = cb
        },
        /**
         * Slide kustība. Lai var slide kustību sinhronizēt
         * ar kādu citu elementu
         */
        onSlideMove: function(cb) {
            slideMoveCb = cb
        },
        onClick: function(cb) {
            slideClickCb = cb;
        },
        nextSlide: function() {
            slideMoveStartCb(false);

            if (getNext()) {
                snapSlide(getSnapTarget(getNext()));
            }
        },
        prevSlide: function() {
            slideMoveStartCb(false);

            if (getPrev()) {
                snapSlide(getSnapTarget(getPrev()));
            }
        },
        nextPage: function() {

        },
        prevPage: function() {

        },
        showSlide: function(index) {
            slides.showByIndex(index);

            /**
             * @todo slideSnapTransitionDone ir jāpārtaisa par kaut ko loģiskāku
             * Jo vajag izsaukt onChange eventu
             */
            slideSnapTransitionDone({
                isSwipe: false,
                isTouch: false
            });
        },
        getCurrent: getCurrent,
        getNext: getNext,
        getPrev: getPrev,
        setSnapPosition: setSnapPosition,
        getSlides: function() {
            return slides;
        },
        disable: function() {
            setIsEnabled(false);
        },
        enable: function() {
            setIsEnabled(true);
        },
        restart: function() {
            slides.reset();
        },
        resize: function() {
            let current = getCurrent();
            setSlidesViewportWidth();
            if (current) {
                slides.showByIndex(current.index);
            }
        }
    }
}

module.exports = function(el, $slides, conf) {
    return createSwipe(el, $slides, conf);
}
},{"./getElementDimensions":111,"./replaceContent":114,"./slides":116,"stepper":118,"swipe":119}],114:[function(require,module,exports){
function replaceContent(el, content) {
    el.innerHTML = '';

    if (typeof content === 'string' || typeof content === 'number' || typeof content === 'undefined' || content === null) {
        el.appendChild(document.createTextNode((typeof content === 'undefined' || content === null) ? '' : content));
    }
    else {
        el.appendChild(content);
    }
}

module.exports = replaceContent
},{}],115:[function(require,module,exports){
var getElementOuterDimensions = require('./getElementOuterDimensions');

function gv(obj, name, dv) {
    return typeof obj[name] == 'undefined' ? dv : obj[name]
}

function slide(el, index, xs) {
    // X pozīcijas
    if (typeof xs == 'undefined') {
        xs = {}
    }

    this.el = el;
    this.width = this.getWidth();
    /**
     * Šis ir reālais slide indekss. Ir ierobežots skaits ar slaidiem
     */
    this.indexReal = index;
    /**
     * Šis ir indekss, kad notiek bezgalīgā swaipošana. Slaidi tiek pārlikti viens aiz otra
     * Līdz ar to indekss bezgalīgi palielinās. Jo tas slaids, kas bija pats pirmais vienā
     * mirklī tiek pārvietos uz pašām beigām un šajā mirklī mainās slaida indekss
     */
    this.index = index;

    this.pageReal = 0;
    this.page = 0;

    // Reālā x pozīcija parent elementā
    this.xReal = gv(xs, 'xReal', 0);

    // Uzstādītā x nobīde. Tad, kad vajag pārvietot citā vietā
    this.x = gv(xs, 'x', 0);

    // Handle move offseti
    this.xOffset = gv(xs, 'xOffset', 0);

    // Custom data
    this.customData = {};
}

slide.prototype = {
    getWidth: function() {
        return getElementOuterDimensions(this.el, true).width;
    },
    updateWidth: function() {
        this.width = this.getWidth();
    },
    /**
     * Pozicionējam elementu
     * x pozīcija veidojas no tekošās x nobīdes + uzstādītā X nobīde
     */
    updateCss: function() {
        this.el.style.transform = 'translate3d('+(this.x + this.xOffset)+'px,0,0)'
    },
    setXOffset: function(v) {
        this.xOffset = v
    },
    /**
     * Atgriežam reālo X pozīciju. Ņemot vērā fizisko novietoju
     * un ņemot vērā offset nobīdījumu
     */
    getX: function() {
        return this.xReal + this.x + this.xOffset;
    },
    /**
     * Tas pats, kas getX, tikai bez move offset
     * Tā ir x pozīcija pirms notika slide move darbība
     * Kamēr notiek move kūstība tiek mainīts offsetX un tas
     * tiek pielikts pie slide x pozīcijas.
     * Šis x ir tāds, ja kustība nebūtu bijusi
     */
    getXWithoutOffset: function() {
        return this.xReal + this.x;
    },
    start: function() {
        // Nofiksējam rēalo x nobīdi
        this.x = this.x + this.xOffset;

        // Temp x offsetu nonullējam
        this.xOffset = 0;
    },

    resetData: function() {
        this.customData = {}
    },
    setData: function(propName, value) {
        this.customData[propName] = value
    },
    getData: function(propName, defaultValue) {
        if (typeof this.customData[propName] == 'undefined') {
            return defaultValue
        }
        return this.customData[propName]
    }
}

module.exports = slide
},{"./getElementOuterDimensions":112}],116:[function(require,module,exports){
var getElementOuterDimensions = require('./getElementOuterDimensions');
var elementsCollection = require('./elementsCollection');
var slide = require('./slide');

var Slides = function(slides, viewportWidth, conf) {
    this.viewport = {}

    // Nākošā slide X pozīcija
    this.slidesCount = 0;

    this.slides = [];

    this.conf = conf;

    this.pagesCountCallback = conf.onPagesCount;

    this.slideAddCallbacks = [];
    if (this.conf && this.conf.onSlideAdd) {
        this.slideAddCallbacks.push(this.conf.onSlideAdd)
    }

    this.changeCallbacks = [];
    if (this.conf && this.conf.onSlidesChange) {
        this.changeCallbacks.push(this.conf.onSlidesChange)
    }

    this.afterPrepareSlidesCallbacks = [];
    if (this.conf && this.conf.onAfterPrepareSlides) {
        this.afterPrepareSlidesCallbacks.push(this.conf.onAfterPrepareSlides)
    }

    /**
     * Rāmja nobīdes no parent elementa, kurā pozicionēt slides
     * Pēc noklusējuma slides tiek pozicionēti pret parent kreiso malu, kas ir 0
     * Šo parametru jāvar mainīt
     * @todo Pašlaik tiek izmanots tikai left mala, bet jāvar norādīt arī right
     */
    this.boxOffset = {
        left: 0,
        right: 0
    }
    if (this.conf && this.conf.boxOffset && this.conf.boxOffset.left) {
        this.boxOffset.left = this.conf.boxOffset.left;
    }
    if (this.conf && this.conf.boxOffset && this.conf.boxOffset.right) {
        this.boxOffset.right = this.conf.boxOffset.right;
    }


    this.slidesElements = new elementsCollection(slides);
    // Ja ir this.conf.rotateItems, tad noklonējam slides elementus, lai iegūtu vajadzīgo min skaitu
    if (this.conf.rotateItems) {
        this.slidesElements.clone(5)
    }

    // šīs darbības izdarīs infty
    // this.setViewportWidth(viewportWidth);
    // this.prepareSlides(this.slidesElements);
}

Slides.prototype = {

    prepareSlides: function(slides) {
        var mthis = this;

        /**
         * Ja ir absolūti pozicionēti elementi, visi viens virs
         * otra, tad šeit nopozicionējam vienu aiz otra
         */
        if (this.conf.positionItems) {
            this.positionItems();
        }

        slides.each(function(slide){

            mthis.push(slide)
        })

        this.addPageNumbers();

        this.balanceSlides();

        this.pagesCountCallback(this.getMaxPage());
        this.executeChangeCallbacks(this.slides);

        this.executeAfterPrepareSlidesCallbacks(this);
    },

    reset: function() {
        this.slides = [];
        this.prepareSlides(this.slidesElements);
    },

    /**
     * @todo šito vajag uztaisīt
     * Izkārtojam absolūti pozicionētos elementus vienu aiz otra
     */
    positionItems: function() {
        var mthis = this;
        var x = 0;
        this.slidesElements.each(function(el){
            el.style.left = x+'px';

            x = x + getElementOuterDimensions(el).width + mthis.getSlidesPadding();
        })
    },

    setViewportWidth: function(width) {
        this.viewport.width = width;
    },

    setBoxOffset: function(offset) {
        this.boxOffset = offset;
    },

    /**
     * Rādām slide ar padoto index
     * tākā šis ir infinity slide, tad attiecīgi index var būt jebkāds
     * padotais index tiek pārrēķināts uz reālo slide index. Jo slides
     * skaits ir ierobežots un tie tiek reused
     *
     * Fiziski pārvietojam padoto index uz sākumu.
     * Visus pārējs slides pakārtojam padotajam slide index
     */
    showByIndex: function(index) {
        // Sagatvojas slide priekš pārvietošanas
        this.start();

        // Pēc padotā index atrodam reālo slide index
        var realIndex = index % this.slidesCount;

        // Ja negatīvs, tad jāņem no beigām
        if (realIndex < 0) {
            realIndex = this.slidesCount + realIndex;
        }

        /**
         * Tagad meklējam slide, kuram atbilst realIndex un
         * pieglabājam slide indeksu masīvā
         */
        var fi;
        for (var i = 0; i < this.slidesCount; i++) {
            if (this.slides[i].indexReal == realIndex) {
                fi = i;
                break;
            }
        }

        /**
         * Norādīto slide liekam kā pašu pirmo vizuāli.
         * Visus slides, kas ir aiz tā izkārtojam secīgi
         */
        var xOffset = this.boxOffset.left;
        for (var i = 0; i < this.slidesCount; i++) {
            this.slides[fi].x = (-this.slides[fi].xReal) + xOffset;
            this.slides[fi].index = index;

            // Palielinām par slide platumu + padding
            xOffset += this.slides[fi].width + this.getSlidesPadding();

            // Atjaunojam css un izpildām callabacks
            this.slides[fi].updateCss();
            this.executeSlideAddCallbacks(this.slides[fi].index, this.slides[fi].el, this.slides[fi]);

            // Visiem slaidiem pielabojam indekss secīgi
            index++;

            /**
             * Pārejam pie nākošā slide. Kad sasniegtas masīva beigas, tad
             * metam ripā un sākam no masīva sākuma
             */
            fi++;
            if (fi == this.slidesCount) {
                fi = 0;
            }
        }

        var mthis = this;

        this.balanceSlides(function(){
            mthis.executeChangeCallbacks(mthis.slides);
        });
    },

    /**
     * Atgriežam slide pēc kārtas numura redzamājā daļā
     */
    getByIndex: function(index) {
        for (var i = 0; i < this.slidesCount; i++) {
            if (this.slides[i].index === index) {
                return this.slides[i];
            }
        }

        return false;
    },

    /**
     * Pieeja pirmajam slide
     */
    first: function() {
        return this.slides[0];
    },

    /**
     * Pieeja pēdējam slide
     */
    last: function() {
        if (this.slidesCount > 0) {
            return this.slides[this.slidesCount-1];
        }

        return false;
    },

    /**
     * Atgriežam slide, kurš vizuāli ir pats pēdējais
     * Vizuāli pret viewport
     */
    visualLast: function() {
        var r = 0;
        for (var i = 0; i < this.slidesCount; i++) {
            if (this.slides[r].getX() < this.slides[i].getX()) {
                r = i;
            }
        }
        return this.slides[r];
    },

    /**
     * Atgriežam slide, kurš vizuāli ir pats pirmais
     */
    visualFirst: function() {
        var r;
        for (var i = 0; i < this.slidesCount; i++) {
            if (typeof r == 'undefined' || this.slides[r].getX() > this.slides[i].getX()) {
                r = i;
            }
        }
        return this.slides[r];
    },

    nextIndex: function() {
        if (this.last()) {
            return this.last().index + 1;
        }

        return 0;
    },

    nextXReal: function() {
        if (this.last()) {
            return this.last().xReal + this.last().width + this.getSlidesPadding();
        }

        return 0;
    },

    /**
     * Saskaitām cik elementu ir ārpus viewport no labās puses
     */
    slidesCountAfterViewport: function() {
        var r = 0;
        for (var i = 0; i < this.slidesCount; i++) {
            if (this.slides[i].getX() > this.viewport.width) {
                r++;
            }
        }

        return r;
    },

    /**
     * Saskaitām cik elementu ir ārpus viewport no labās puses
     */
    slidesCountBeforeViewport: function() {
        var r = 0;
        for (var i = 0; i < this.slidesCount; i++) {
            if (this.slides[i].getX() + this.slides[i].width < 0) {
                r++;
            }
        }

        return r;
    },

    /**
     * Pievienojam elementu masīva beigās
     */
    push: function(el) {
        this.pushWithIndex(el, this.nextIndex());
    },

    pushWithIndex: function(el, index) {
        var s = new slide(el, index, {
            // Saglabājam reālo x pozīciju
            xReal: this.nextXReal()
        })

        this.slidesCount = this.slides.push(s);

        s.updateCss();

        this.executeSlideAddCallbacks(this.last().index, this.last().el, this.last());
    },

    /**
     * Uzsākot kustību pieglabājam katra slide startX
     */
    start: function() {
        this.slides.map(function(s){
            s.start();
        })
    },

    /**
     * Katram slide ir savs x
     * Uzliekam x offset, bet pašu x nemainām
     */
    setXOffset: function(offset) {

        for (var i = 0; i < this.slidesCount; i++) {
            this.slides[i].setXOffset(offset);
            this.slides[i].updateCss();
        }


        /**
         * @todo Nevajag balansēt slides, ja notiek move
         * to jādara pēc move beigšanas
         */
        var mthis = this;
        this.balanceSlides(function(){
            mthis.executeChangeCallbacks(mthis.slides);
        });
    },

    /**
     * Pārvietojam pēdējo slaidu rindā uz rindas sākumu
     */
    moveLastToFirst: function() {
        var slide = this.visualLast();

        var firstSlide = this.visualFirst();

        var w = slide.width + this.getSlidesPadding();

        // Samazinām index. Reālo indekss neaiztiekam
        slide.index = firstSlide.index - 1;

        slide.x = (firstSlide.xReal - (slide.xReal + w)) + firstSlide.x

        slide.updateCss();

        this.executeSlideAddCallbacks(slide.index, slide.el, slide);
    },

    /**
     * Vizuāli pārvietojam pirmo slaid uz beigām
     */
    moveFirstToLast: function() {
        var slide = this.visualFirst();

        var lastSlide = this.visualLast();

        var w = lastSlide.width + this.getSlidesPadding();

        // Palielinām index. Reālo indekss neaiztiekam
        slide.index = lastSlide.index + 1;

        slide.x = ((lastSlide.xReal + w) - slide.xReal) + lastSlide.x;

        slide.updateCss();

        this.executeSlideAddCallbacks(slide.index, slide.el, slide);
    },

    balanceSlides: function(onChangeCb) {
        if (!this.conf.rotateItems) {
            return;
        }

        // Balansējam tikai, ja viewport.width > 0
        if (this.viewport.width <= 0) {
            return;
        }

        var hasChanged = false;
        // Balansējam 4 reizes. Normālā gadījumā jāpietiek ar vienu reizi
        for (var t = 0; t < 4; t++) {
            if (this.balanceOnce()) {
                hasChanged = true;
            }
        }

        // Paziņojam tikai, ja ir bijušas izmaiņas
        if (hasChanged && onChangeCb) {
            onChangeCb();
        }
    },

    /**
     * Balansējam vienu reizi, overflow elementus sadalot vienādi pa left un right pusēm
     *
     * @todo Šādi īsti nav optimāli. Jo nobalansējot joprojām paliek situācija, kad
     * vienā pusē trūkst, bet otrā ir par daudz.
     * Ar šo metodi darīsim vēlreiz kamēr abās pusēs būs vienādies
     * Vajag kaut kā gudrāk, lai uzreiz pārvieto uz to pusi kurai trūks
     * Sarežģijums rodas, tad, kad slides ir dažāda platuma
     *
     * @param int Max balancēšanas piegājienu skaits
     */
    balanceOnce: function() {
        var b = this.slidesCountBeforeViewport();
        var a = this.slidesCountAfterViewport();

        /**
         * Aprēķinām starpību starp items pirms un pēc. Dala ar divi
         * Apaļojam uz leju
         * Atkarībā no tā vai d > 0 vai d < 0 noteiksim virzienu, kurā pārvietot slaidus
         */
        var d = Math.floor((a - b) / 2);

        // Ja nav neviena slaida, ko pārvietot, tad bail
        if (Math.abs(d) < 1) {
            return false;
        }

        /**
         * Ja d < 0, tad pārvietojam no beigām uz sākumu
         * Ja d > 0, tad pārvietojam no sākuma uz beigām
         */
        var method = d < 0 ? 'moveFirstToLast' : 'moveLastToFirst';

        d = Math.abs(d);
        for (var i = 0; i < d; i++) {
            this[method]();
        }

        // Atgriežam true, ja ir kaut viens slide balansēts
        return d > 0;
    },

    executeSlideAddCallbacks: function() {
        for (var i = 0; i < this.slideAddCallbacks.length; i++) {
            this.slideAddCallbacks[i].apply(this, arguments);
        }
    },

    executeChangeCallbacks: function() {
        for (var i = 0; i < this.changeCallbacks.length; i++) {
            this.changeCallbacks[i].apply(this, arguments);
        }
    },

    /**
     * After execution of this.prepareSlides
     */
    executeAfterPrepareSlidesCallbacks: function() {
        for (var i = 0; i < this.afterPrepareSlidesCallbacks.length; i++) {
            this.afterPrepareSlidesCallbacks[i].apply(this, arguments);
        }
    },

    getSlidesPadding: function() {
        return this.conf.slidesPadding();
    },

    /**
     * Sakārtojam slaides pēc vizuālā izkārtojuma
     */
    getSortedVisual: function(direction) {
        var r = [];
        for (var i = 0; i < this.slidesCount; i++) {
            r.push(this.slides[i]);
        }

        return r.sort(function(a, b){
            if (a.getX() < b.getX()) {
                return direction == 'asc' ? -1 : 1;
            }
            else if (a.getX() > b.getX()) {
                return 0;
            }
            else if (a.getX() > b.getX()) {
                return direction == 'asc' ? 1 : -1;
            }
        })
    },

    isBetweenX: function(slide, x1, x2) {
        if (slide.getX() > x1 && slide.getX() < x2) {
            return true;
        }
    },

    /**
     * Find slide by dom element
     */
    findByDomElement: function(el) {
        for (var i = 0; i < this.slidesCount; i++) {
            if (this.slides[i].el === el || this.slides[i].el.contains(el)) {
                return this.slides[i];
            }
        }
        return false;
    },

    /**
     * Meklējam pirmo slide starp padotajām x koordinātēm
     * @searchDirection meklēšanas virziens ASC vai DESC
     */
    findBetweenX: function(x1, x2, searchDirection) {

        // Meklējam pēc sakārtotiem pēc vizuālā izkārtojuma
        var r = this.getSortedVisual(searchDirection);

        for (var i = 0; i < r.length; i++) {
            if (this.isBetweenX(r[i], x1, x2)) {
                // Atgriežam slide instanci no īstā slides masīva
                return this.slides[r[i].indexReal];
            }
        }

        return undefined;
    },

    /**
     * Atrodam slide, kura getX ir viss tuvāk x no kreisās puses
     */
    findClosestToX: function(x) {
        var r;
        for (var i = 0; i < this.slidesCount; i++) {
            if (typeof r == 'undefined') {
                r = i;
                continue;
            }

            var d1 =  Math.abs(x - this.slides[i].getX());
            var d2 =  Math.abs(x - this.slides[r].getX());

            // Izlaižam visus, kas ir lielāki par x
            if (d1 < d2) {
                r = i;
            }
        }
        return this.slides[r];
    },

    /**
     * Atrodam slide, kura getX ir viss tuvāk x no kreisās puses
     */
    findClosestToXFromLeft: function(x) {
        var r;
        for (var i = 0; i < this.slidesCount; i++) {
            // Izlaižam visus, kas ir lielāki par x
            if (this.slides[i].getX() > x) {
                continue;
            }
            if (typeof r == 'undefined' || this.slides[r].getX() < this.slides[i].getX()) {
                r = i;
            }
        }
        return this.slides[r];
    },

    /**
     * Atrodam nākošo offsetX aiz norādītā x
     */
    findClosestToXFromRight: function(x) {
        var r;
        for (var i = 0; i < this.slidesCount; i++) {
            // Izlaižam visus, kas ir lielāki par x
            if (this.slides[i].getX() < x) {
                continue;
            }
            if (typeof r == 'undefined' || this.slides[r].getX() > this.slides[i].getX()) {
                r = i;
            }
        }
        return this.slides[r];
    },

    findFirstBetweenX: function(x1, x2) {
        return this.findBetweenX(x1, x2, 'asc');
    },

    findLastBetweenX: function(x1, x2) {
        return this.findBetweenX(x1, x2, 'desc');
    },

    /**
     * Atgriežam redzamos slides starp x1 un x2 koordinātēm
     * Arī, ja ir redzama tikai maza daļa no slide, tas skaitās visible
     */
    findVisibleBetweenX: function(x1, x2) {
        var r = [];
        for (var i = 0; i < this.slidesCount; i++) {
            let slide = this.slides[i];
            let sx = slide.getX();
            let sxw = sx + slide.width;

            let sxBetween = (sx > x1 && sx < x2);
            let sxwBetween = (sxw > x1 && sxw < x2);

            if (sxBetween || sxwBetween) {
                // Redzamā daļa
                var v = sxBetween ? x2 - sx : sxw - x1;
                // Ierobežojam redzamo daļu, lai nav lielāka par width
                v = v > slide.width ? slide.width : v;
                r.push({slide: slide, visibleRatio: v / slide.width});
            }
        }
        return r;
    },

    /**
     * Pievienojam katram slaid lapas numuru, kurā tas iekrīt
     */
    addPageNumbers: function() {
        var page = 1, t = 0;

        for (var i = 0; i < this.slidesCount; i++) {

            this.slides[i].pageReal = page;
            this.slides[i].page = page;

            t += (this.slides[i].width + this.getSlidesPadding());

            // Nedaudz smaziām viewport platumu, lai lapā netiktu ieskaitīts
            // slide, kuram tikai daži pikseļi ir lapā
            if (t >= this.viewport.width - 4) {
                page++;
                t = 0;
            }
        }
    },

    /**
     * Saskaitām cik lapās var sadalīt visus slaidus
     * Lapa ir tad, kad to piepilda vairāki slaidi
     * Lapā var būt 1 vai vairāki slaidi
     */
    getMaxPage: function() {
        var r = 1;

        for (var i = 0; i < this.slidesCount; i++) {
            if (this.slides[i].pageReal > r) {
                r = this.slides[i].pageReal;
            }
        }

        return r;
    }
}

module.exports = Slides;
},{"./elementsCollection":110,"./getElementOuterDimensions":112,"./slide":115}],117:[function(require,module,exports){
var b = function(p1x, p1y, p2x, p2y) {
    // Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
    var cx = 3.0 * p1x;
    var bx = 3.0 * (p2x - p1x) - cx;
    var ax = 1.0 - cx -bx;
         
    var cy = 3.0 * p1y;
    var by = 3.0 * (p2y - p1y) - cy;
    var ay = 1.0 - cy - by;

    var epsilon = 0.00001;

    function sampleCurveDerivativeX(t) {
        return (3.0 * ax * t + 2.0 * bx) * t + cx;
    }

    function sampleCurveX(t) {
        // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
        return ((ax * t + bx) * t + cx) * t;
    }

    function sampleCurveY(t) {
        return ((ay * t + by) * t + cy) * t;
    }

    // Given an x value, find a parametric value it came from.
    function solveCurveX(x)
    {
        var t0, t1, t2, x2, d2, i;

        // First try a few iterations of Newton's method -- normally very fast.
        for (t2 = x, i = 0; i < 8; i++) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < epsilon) {
                return t2;
            }
            d2 = sampleCurveDerivativeX(t2);
            if (Math.abs(d2) < 1e-6) {
                break;
            }
            t2 = t2 - x2 / d2;
        }

        // Fall back to the bisection method for reliability.
        t0 = 0.0;
        t1 = 1.0;
        t2 = x;

        if (t2 < t0) {
            return t0;
        }
        if (t2 > t1) {
            return t1;
        }

        while (t0 < t1) {
            x2 = sampleCurveX(t2);
            if (Math.abs(x2 - x) < epsilon) {
                return t2;
            }
            if (x > x2) {
                t0 = t2;
            }
            else {
                t1 = t2;
            }
            t2 = (t1 - t0) * .5 + t0;
        }

        // Failure.
        return t2;
    }

    this.get = function(x) {
        return sampleCurveY(solveCurveX(x));
    }
}

module.exports = b;
},{}],118:[function(require,module,exports){
//var Bezier = require('./bezier1.js');
/**
 * See https://easings.net
 */
var Bezier = require('./bezier2.js');

var Stepper = function(config) {
    this.defaultBezierCurve = [0,0,1,1];
    this.precision = 10000000;
    this.progress = 0;
    this.current = 0;
    this.requestId = 0;
    this.inProgress = false;
    /**
     * Vērtība, kuru transformēt atbilstoši progress vērtībai
     * @param object object with props: from, to
     */
    this.value = undefined;

    this.config = config;

    this.setConfig();
}

Stepper.prototype = {
    setConfig: function(overrideConfig) {
        this.duration = this.getConfig('duration', overrideConfig);
        this.easing = this.getConfig('bezierCurve', overrideConfig);
        this.value = this.getConfig('value', overrideConfig);
        

        this.stepCallback = this.getConfig('onStep', overrideConfig);
        this.doneCallback = this.getConfig('onDone', overrideConfig);
        this.forceStopCallback = this.getConfig('onForceStop', overrideConfig);
    },

    run: function(overrideConfig) {
        this.setConfig(overrideConfig);

        this.current = 0;

        this.start();
        this.step();
    },

    /**
     * Run from given progress
     */
    runFrom: function(progress, overrideConfig) {
        this.setConfig(overrideConfig);

        /**
         * Šeit ir svarīgs moments
         * Padotais progress ir tāds, kādu gribam
         * bet easing aprēķinātais progress esošajā progress ir savādāk, jo 
         * tas ir curve un tas nav lineārs
         * Tāpēc šeit atrodam kādam ir jābūt progresam pēc easing
         *
         * Update pēc kāda laika lietošanas
         * Tomēr škiet, ka to nemaz nevajag darīt, jo ja es gribu sākt no
         * 0.9 progresa un duration ir 1000ms, tad es gribu, lai animācija
         * ir 100ms gara. Ja pārrēķina progresu, tad animācijas garums ir 
         * garāks vai īsāks
         */
        //progress = this.findStartProgress(progress, 0.1, 0, 1);
        
        this.startTime = +new Date();
        // Simulējam startTime, tā lai tas būtu sācies pirms norādītā progress
        this.startTime -= (this.duration * progress);
        // Turpinām no padotā progress
        this.progress = progress;

        this.inProgress = true;

        this.step();
    },

    /**
     * Meklējam kādam ir jābūt progress, lai pēc easing.get tas būt tāds pats kā progress
     */
    // findStartProgress: function(progress, step, from, to, inceptionLevel) {

    //     if (typeof inceptionLevel == 'undefined') {
    //         inceptionLevel = 0;
    //     }
        
    //     var d = from, prevR = 0, prevD;

    //     while (d < to) {
    //         // Lai ir lielāka precizitāte
    //         if (inceptionLevel++ > 100) {
    //             return d;
    //         }

    //         r = this.easing.get(d);

    //         if (Math.round(progress*this.precision) == Math.round(r*this.precision)) {
    //             return d;
    //         }

    //         if (this.isBetween(progress, prevR, r)) {
    //             return this.findStartProgress(progress, step/10, prevD, d, inceptionLevel);
    //         }

    //         prevD = d;
    //         prevR = r;
    //         d += step;
    //     }

    //     return d;
    // },

    /**
     * Is a between x1 and x2
     */
    // isBetween: function(a, x1, x2) {
    //     if (x2 > x1) {
    //         return a > x1 && a < x2;
    //     }
    //     return a > x2 && a < x1;
    // },

    isRunning: function() {
        return this.inProgress;
    },

    /**
     * Piefiksējam sākuma laiku
     */
    start: function() {
        this.inProgress = true;
        this.startTime = +new Date();
        this.progress = 0;
    },

    /**
     * Pārtraucam stepping
     */
    stop: function() {
        cancelAnimationFrame(this.requestId);
        this.done();
    },

    /**
     * Pārtraucam animāciju un neizpildām done callback
     */
    forceStop: function() {
        cancelAnimationFrame(this.requestId);
        this.inProgress = false;
        if (this.forceStopCallback) {
            this.forceStopCallback();
        }
    },

    done: function() {
        this.inProgress = false;
        if (this.doneCallback) {
            this.doneCallback();
        }
    },

    step: function() {
        var mthis = this;

        mthis.trackProgress();

        if (this.current < this.startTime + this.duration) {

            this.runStepCallback(this.progress);

            this.requestId = requestAnimationFrame(function(){
                mthis.step()
            });
        }
        else {
            this.runStepCallback(1);

            this.done();
        }
    },

    trackProgress: function() {
        // Current time
        this.current = +new Date();

        var delta = this.current - this.startTime;

        // Animation progress in precents
        this.progress = this.easing.get(delta / this.duration);

        //this.progress = Math.round(this.progress*this.precision)/this.precision;
    },

    runStepCallback: function(progress) {
        // Ja ir jāaprēķina vērtība atkarībā no progress
        if (this.value) {
            this.stepCallback(progress, this.calcValueFromProgress(progress, this.value.from, this.value.to))
        }
        else {
            this.stepCallback(progress)
        }
    },

    calcValueFromProgress: function(progress, from, to) {
        return from + ((to - from) * progress);
    },

    getEasing: function(bezierCurve) {
        if (!(bezierCurve && bezierCurve.length && bezierCurve.length == 4)) {
            bezierCurve = this.defaultBezierCurve;
        }
        return new Bezier(bezierCurve[0], bezierCurve[1], bezierCurve[2], bezierCurve[3]);
    },

    /**
     * Atgriežam config vērtību.
     * Katrai vērtībai pēc tās name tiek veiktas pārbaudes vai papildus apstrāde
     * @param secondaryConfig object Alternate override config vērtības
     */
    getConfig: function(name, secondaryConfig) {
        var r = this.getConfigValue(name, secondaryConfig);
        switch (name) {
            case 'bezierCurve':
                r = this.getEasing(r);
                break;
            case 'duration':
                r = parseInt(r, 10);
                r = isNaN(r) ? 200 : r;
                break;
            case 'onStep':
            case 'onDone':
            case 'onForceStop':
                r = typeof r == 'function' ? r : function(){}
                break;
            case 'value':
                if (!(r && typeof r == 'object' && typeof r['from'] != 'unefined' && r['to'] != 'undefined')) {
                    r = undefined;
                }
                break;
        }
        
        return r;
    },

    getConfigValue: function(name, secondaryConfig) {
        // Pirmo meklējam sekundārajā konfigā
        if (secondaryConfig && typeof secondaryConfig[name] != 'undefined') {
            return secondaryConfig[name];
        }

        // Meklējam bāzes konfigā
        if (this.config && typeof this.config[name] != 'undefined') {
            return this.config[name];
        }

        return undefined;
    }
}

module.exports = Stepper;
},{"./bezier2.js":117}],119:[function(require,module,exports){
(function(root, factory){

    if (typeof exports === 'object') {
        module.exports = factory();
    }
    else {
        if (typeof root.webit == 'undefined') {
            root.webit = {}
        }
        root.webit.swipe = factory();
    }

})(this, function(){

    var instances = 0;

    var List = function(items) {
        this.items = items;
    }
    List.prototype = {
        first: function() {
            if (this.items.length > 0) {
                return this.items[0];
            }
            return false;
        },
        second: function() {
            if (this.items.length > 1) {
                return this.items[1];
            }
            return false;
        }
    }

    var Swipe = function(el, config) {
        this.instanceId = instances++;
        // Pazīme vai ir uzlikts move requestAnimationFrame
        this.raf = undefined;


        // Touch/mouse events will be attaches to body
        this.swipeEl = document.getElementsByTagName('body')[0];

        this.el = el;

        this.events = this.prepareEvents([
            'swipe', 'move', 'start', 'end', 
            'pinchstart', 'pinchend', 'pinchmove', 
            'touchend', 'touchmove',
            'tap', 'doubletap'
        ]);

        // Apply configuration
        this.config(config);

        this.setTouchAction(this._config.direction);

        // Visi reģistrētie touchi, pēc to identifikatoriem
        this.touches = {};
        // Piereģistrēto touch skaits
        this.touchesCount = 0;
        // Slope factor to distinguise vertical swipe from horizontal
        this.slopeFactor = 1;
        // First touch when touch start occures
        this.startTouches = false;
        // First touch when first move event triggered
        this.firstMoveTouches = false;
        // Current touch, when swipe is in process
        this.currentTouches = false;

        // Move x, y offset values
        this.offset;
        // Swipe width
        this.width;
        // Swipe height
        this.height;
        // Swipe duration
        this.duration;
        // In case of directional swipe, this will be initial swipe direction (horizontal or vertical)
        this.moveDirection = null;

        // Cik pēdējās swipe kustības uzkrāt, lai noteiktu vai ir bijis swipe
        this.swipeLogStackMaxLength = 4;

        this.swipeLog = {
            stack: [],
            duration: 0,
            width: 0,
            height: 0
        };

        /**
         * Taps logs. Katram touch eventam piereģistrējam sākuma un beigu laiku
         * Pēc tam analizējam taps ilgumu un meklējam starp tiem tap vai double Tap
         * 
         * Reģistrējot pārbaudam vai events ar norādīt id ir reģistrēts. Ja nav tad liekam iekšā
         * un piereģistrējam ienākšanas laiku
         * 
         * Atreģistrējot meklējam eventu, kuram nav endTime
         */
        this.tapsLog = {};
        this.waitForDoubleTap = false;
        this.tapsLogExecuteTimeout = 0;

        /**
         * Is touch events supported
         * This will be determined when first touchstart event fires
         */
        this.isTouchEvents = false;

        /**
         * Is touch started on this.el
         */
        this.isTouchedValidElement = false;

        // Mouse down event
        this.isMouseDown = undefined;

        this.handleEvents('add');

        return this;
    }

    Swipe.prototype = {
        prepareEvents: function(eventNames) {
            var r = {};
            for ( var i in eventNames ) {
                r[eventNames[i]] = [];
            }
            return r;
        },

        handleEvents: function(method) {
            var mthis = this;

            var start = function(ev) {
                // Reģistrēti tiek tikai tie touchi, kuri nāk no iekonfigurētā elementa
                mthis.registerTouches(ev, true);

                mthis.isTouchedValidElement = mthis.touchesCount > 0;
                if (mthis.isTouchedValidElement) {
                    mthis._start(ev);
                }
            }
            
            var end = function(ev) {
                if (mthis.isTouchedValidElement) {
                    mthis._end(ev);
                    mthis.isTouchedValidElement = false;
                }

                mthis.unregisterTouches(ev);

                // Pārbaudām vai var palaist tap vai double tap eventus
                mthis.maybeFireTapping();
            }

            /**
             * @param touchedElement is used only on case of mouse
             * it provides custom element, not the one from current touch
             */
            var move = function(ev) {
                mthis.registerTouches(ev);

                if (mthis.isTouchedValidElement) {
                    mthis._move(ev);
                }
            }

            
            // Ja izpildīsies touchstart, tad mouse eventus vairāk neklausāmies
            var touchStart = function(ev) {
                mthis.isTouchEvents = true;
                start(ev);
            }

            var touchEnd = function(ev) {
                end(ev);
            }

            var touchMove = function(ev) {
                move(ev)
            }


            // Ja ir toucheventi, tad mouse eventus neizpildām
            var _mouseMove;

            var isMouseMove = function(startEv, moveEv) {
                if (startEv.x != moveEv.x) {
                    return true;
                }

                if (startEv.y != moveEv.y) {
                    return true;
                }

                return false;
            }

            var mouseStart = function(ev) {
                /**
                 * Right mouse button causes to fire mouseStart but no 
                 * mouseEnd because of context menu which is fired on
                 * right mouse click and mouseEnd event is not catched
                 * So only react to left mouse click
                 */
                if (!mthis.isMainMouseButton(ev)) {
                    return;
                }

                mthis.isMouseDown = mthis.formatTouch(ev);

                if (!mthis.isTouchEvents) {
                    start(ev)   
                }
            }

            var mouseEnd = function(ev) {
                if (!mthis.isTouchEvents) {
                    end(ev) 
                }
                mthis.isMouseDown = undefined;
            }

            var mouseMove = function(ev) {
                if (!mthis.isTouchEvents) {
                    if (mthis.isMouseDown) {
                        if (isMouseMove(mthis.isMouseDown, mthis.formatTouch(ev))) {
                            move(ev)
                        }
                    }
                }
            }

            var eventMethod = method == 'add' ? 'addEvent' : 'removeEvent';

            this[eventMethod](this.swipeEl, 'touchstart', touchStart);
            this[eventMethod](this.swipeEl, 'touchmove', touchMove, {passive: false});
            this[eventMethod](this.swipeEl, 'touchend', touchEnd);
        
            this[eventMethod](this.swipeEl, 'mousedown', mouseStart);
            this[eventMethod](this.swipeEl, 'mousemove', mouseMove);
            this[eventMethod](this.swipeEl, 'mouseup', mouseEnd);
        },

        /**
         * Touch start. When touch starts or when mouse down
         */
        _start: function(ev) {

            if (this._config.alwaysPreventTouchStart) {
                this.preventEvent(ev);
            }

            // Touch stāvoklis pašā sākumā
            this.startTouches = this.getTouches();

            // Touch stāvoklis, kad notika pirmais touchMove
            this.firstMoveTouches = false;

            this.validMove = false;
            this.moveDirection = null;
            this.swipeLog.stack = [];

            this.fire('start', [this.startTouches.first()]);

            // retranslate pinch
            this.maybeFirePinchStart();
        },

        /**
         * Touch ends
         */
        _end: function(ev) {
            this.currentTouches = this.getTouches();

            this.trackDuration();
            this.trackSwipe();

            var movement = this.formatMovement();

            // Liekam swipe statusu
            movement._swipeLog = {
                duration: this.swipeLog.duration,
                width: this.swipeLog.width,
                height: this.swipeLog.height,
                stackLength: this.swipeLog.stack.lenght,
                isSwipe: false
            };
            
            /**
             * Šeit pēc duration, width un height nosakām vai tā varēja
             * būt swipe kustība. Varbūt atkarībā no iekārtas varētu šo 
             * parametrus piekoriģēt???
             */
            if (this.swipeLog.duration < 80) {
                if (this.swipeLog.width > 7 || this.swipeLog.height > 7) {
                    movement._swipeLog.isSwipe = true;
                }
            }

            // Pazīme, vai bija swipe kustība
            movement.isSwipe = movement._swipeLog.isSwipe;


            this.startTouches = false;
            this.firstMoveTouches = false;

            this.currentTouches = false;

            // Notīrām move vērtības
            this.duration = undefined;
            this.offset = undefined;
            this.width = undefined;
            this.height = undefined;

            if (this.validMove) {
                this.fire("end", [movement]);
             }

            // Vienmēr izpildām touchend eventu
            this.fire("touchend", [movement]);

            // retranslate pinch
            this.maybeFirePinchEnd();
        },

        /**
         * Touch is moving. Moving when mouse down
         */
        _move: function(ev) {

            var mthis = this;

            if (this.startTouches) {

                // If configured to disable pinch to zoom
                this.maybePreventPinch(ev);

                if (!this.firstMoveTouches) {
                    this.firstMoveTouches = this.getTouches();
                }

                this.currentTouches = this.getTouches();

                this.clearTapLog();
                this.trackDuration();
                this.trackSwipe();
                this.trackMovment();

                // Always retranslate touchmove if there was move
                this.fireTouchMove();


                if (this.isValidMove()) {
                    this.preventEvent(ev);
                    this.validMove = true;
                }
                else {
                    this.validMove = false;   
                }
                
                if (this.validMove) {
                    /**
                     * Vajag iespēju palaist move caur requestAnimationFrame
                     * Ja pa tiešo pie move ir pieslēgts vizuālā elementa pārvietošana,
                     * tad pārzimēt elementu uz katru move ir par daudz
                     */
                    if (this._config.fireMoveOnRequestAnimationFrame) {
                        if (!this.raf) {
                            this.raf = window.requestAnimationFrame(function(r){

                                // Pārbaudām vai vēl esam move stāvoklī. Iespējams, ka mirklī
                                // kad izpildās cb vairs nav touch events
                                if (mthis.startTouches) {
                                    mthis.fire('move', [mthis.formatMovement()])
                                }

                                mthis.raf = undefined;
                            })
                        }
                    }
                    else {
                        this.fire('move', [this.formatMovement()])
                    }
                }

                // retranslate pinch
                this.maybeFirePinchMove();
            }
        },

        /**
         * Pārbaudām vai var palaist tap vai doubletap eventus
         */
        maybeFireTapping: function() {
            clearTimeout(this.tapsLogExecuteTimeout);

            if (this.isEventsRegistered('doubletap')) {
                this.maybeFireDoubleTap(this.getValidTapRegistered());
            }
            else {
                this.maybeFireSingleTap(this.getValidTapRegistered());
            }

            this.clearTapLog();            
        },

        maybeFireDoubleTap: function(tap) {
            if (!tap) {
                return;
            }

            var mthis = this;

            if (this.waitForDoubleTap) {
                this.fire('doubletap', [tap.touch])
                this.waitForDoubleTap = false;
            }
            else {
                // Gaidām nākošo tap
                this.waitForDoubleTap = true;
                this.tapsLogExecuteTimeout = setTimeout((function(touch){
                    
                    return function() {
                        mthis.waitForDoubleTap = false;

                        mthis.fire('tap', [touch])
                    }

                })(tap.touch), this._config.doubletapWaitTimeout)


                /**
                 * @todo Te vajadzētu kaut kādu pseido little bit before tap, jo
                 * uz ios doubletapWaitTimeout ir tāds pats kā šeit iekonfigurēts
                 * bet single tap tomēr izpildās drusku ātrāk. Tas tāpēc, lai interfeiss
                 * justos atsaucīgāks. Savukārt ļoti īsu doubletapWaitTimeout nevar taisīt,
                 * jo kādam, kuram nav veikli pirksti būs grūti uztaisīt doubleTap
                 */
            }
        },

        maybeFireSingleTap: function(tap) {
            if (!tap) {
                return;
            }

            this.fire('tap', [tap.touch])
        },

        maybePreventPinch: function(ev) {
            if (this._config.disablePinch && this.touchesCount >= 2) {
                ev.preventDefault();
            }
        },

        maybeFirePinchStart: function() {
            if (this.touchesCount < 2) {
                return;
            }

            this.fire('pinchstart', [this.formatPinch(
                this.startTouches.first().x,
                this.startTouches.second().x,
                this.startTouches.first().y,
                this.startTouches.second().y
            )]);
        },

        maybeFirePinchEnd: function() {
            if (this.touchesCount < 2) {
                this.fire('pinchend', []);
            }
        },

        maybeFirePinchMove: function() {
            if (this.touchesCount < 2) {
                return;
            }

            // Pinch gadījumā interesē tikai 2 currentTouches
            this.fire('pinchmove', [{
                first: this.formatPinch(
                    this.firstMoveTouches.first().x,
                    this.firstMoveTouches.second().x,
                    this.firstMoveTouches.first().y,
                    this.firstMoveTouches.second().y
                ),
                current: this.formatPinch(
                    this.currentTouches.first().x,
                    this.currentTouches.second().x,
                    this.currentTouches.first().y,
                    this.currentTouches.second().y
                )
            }])
        },

        formatPinch: function(x1, x2, y1, y2) {
            return {
                // Pirmais touch punkts
                x1: x1,
                y1: y1,

                // Otrais touch punkts
                x2: x2,
                y2: y2,

                width: Math.abs(x1-x2),
                height: Math.abs(y1-y2),

                // Atālums starp touchiem. Hipotenūza, kur width un height ir taisnleņķa katetes
                // Aprēķinām pēc pitagora teorēmas distance = sqrt(pow(width, 2) + pow(height, 2))
                distance: Math.sqrt(Math.pow(Math.abs(x1-x2), 2) + Math.pow(Math.abs(y1-y2), 2)),

                // Pinch centrs
                center: {
                    x: this.calcMid(x1, x2),
                    y: this.calcMid(y1, y2)
                }
            }
        },

        calcMid: function(p1, p2) {
            return p1 < p2 ? (p2-p1)/2+p1 : (p1-p2)/2+p2;
        },

        formatMovement: function() {
            return {
                // Padodam konfigurācijai atbilstošu direction. Ja ir iekonfigurēts horizontal, tad padodam left or right
                direction: this.getFormattedDirection(),
                offset: this.offset,
                duration: this.duration,
                width: this.width,
                height: this.height,
                x: this.currentTouches.first().x,
                y: this.currentTouches.first().y,
                touchedElement: this.currentTouches.first().touchedElement,

                speed: isNaN(this.width / this.duration) ? 0 : this.width / this.duration,
                realDirection: this.direction
            }
        },

        getFormattedDirection: function() {
            if (this.isDirection(this._config.direction, 'horizontal') || this.isDirection(this._config.direction, 'vertical')) {
                return this.getDirection();
            }
            else if (this.isDirection(this._config.direction, 'horizontal')) {
                return this.getHorizontalDirection();
            }
            else if (this.isDirection(this._config.direction, 'vertical')) {
                return this.getHorizontalDirection();
            }
        },

        /** 
         * There we can filter if current move is valid
         * For, example, if we track only horizontal move, then ignore
         * vertical move.
         * There also can be checked, if user is scrolling page
         */
        isValidMove: function() {
            // Ja swipeLog nav pilns, tad nevaram vēl validēt move un uzskatām, ka tas ir valid
            if (this.swipeLog.stack.length < 2) {
                return false;
            }

            /**
             * Ja ir directional swipe, tad ja ir nodetektēts direction
             * atbilstošs swipe, vairāk to nepārtraucam. Jo swipe laikā
             * var mainīties direction, no left kļūt par top
             */
            
            // Swipe direction
            if (this._config.direction.length > 0) {
                
                // Uzstādām pirmo detektēto swipe virzienu
                if (!this.moveDirection) {
                    this.moveDirection = this.getMoveDirection();
                }

                if (!this.isDirection(this._config.direction, this.moveDirection)) {
                    return false;
                }
            }

            var minMaping = {minWidth: 'width', minHeight: 'height', minDuration: 'duration'};
            var maxMaping = {maxWidth: 'width', maxHeight: 'height', maxDuration: 'duration'};

            for (var p in minMaping) {
                if (this._config[p]) {
                    if (this[minMaping[p]] < this._config[p]) {
                        return false;
                    }    
                }
                
            }

            for (var p in maxMaping) {
                if (this._config[p]) {
                    if (this[maxMaping[p]] > this._config[p]) {
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Track swipe progress. Calculates swipe width, height and duration
         */
        trackMovment: function() {
            this.offset = {
                x: this.currentTouches.first().x - this.firstMoveTouches.first().x,
                y: this.currentTouches.first().y - this.firstMoveTouches.first().y
            };
            this.width = Math.abs(this.offset.x);
            this.height = Math.abs(this.offset.y);
            
            this.direction = this.getDirection();
        },

        trackDuration: function() {
            this.duration = this.currentTouches.first().t - this.startTouches.first().t;
        },

        trackSwipe: function() {
            // Uzkrājam pēdējās this.swipeLogStackMaxLength move kustības. No tām tiks noteikts vai ir bijis swipe
            this.swipeLog.stack.push({
                x: this.currentTouches.first().x,
                y: this.currentTouches.first().y,
                duration: this.duration
            });

            if (this.swipeLog.stack.length > this.swipeLogStackMaxLength) {
                this.swipeLog.stack.shift();
            }

            // Time between first and last logged movement
            this.swipeLog.duration = this.swipeLog.stack[this.swipeLog.stack.length-1].duration - this.swipeLog.stack[0].duration;
            this.swipeLog.width = Math.abs(this.swipeLog.stack[this.swipeLog.stack.length-1].x - this.swipeLog.stack[0].x);
            this.swipeLog.height = Math.abs(this.swipeLog.stack[this.swipeLog.stack.length-1].y - this.swipeLog.stack[0].y);
        },

        /**
         * Atgriežam virzienu vienalga kādā virzienā. Vai horizontal vai vertical.
         * Pirmo pārbaudām vertikālo virzienu. Ja tā nav, tad horizontālo
         */
        getDirection: function() {
            if (this.getVerticalDirection()) {
                return this.getVerticalDirection();
            }
            else if (this.getHorizontalDirection()) {
                return this.getHorizontalDirection();
            }
        },

        /**
         * Atgriežam tikai horizontālo virzienu: left or right
         */
        getHorizontalDirection: function() {
            if (this.currentTouches.first().x > this.startTouches.first().x) {
                return "right";
            }
            else if (this.currentTouches.first().x < this.startTouches.first().x) {
                return "left";
            }

            return false;
        },

        /**
         * Atgriežam tikai vertikālo virzienu: up or down
         */
        getVerticalDirection: function() {
            /**
             * Horizontal swipe elevation
             * When swiping left right there van be slight elveation, but this
             * does not mean user is swiping up or down
             */
            if (this.offset) {
                var e = this.offset.y / this.offset.x;

                if (e > this.slopeFactor) {
                    return "up";
                }
                else if (e < -this.slopeFactor) {
                    return "down";
                }
            }

            return false;
        },

        getMoveDirection: function() {
            if (this.isHorizontalDirection()) {
                return 'horizontal';
            }
            
            if (this.isVerticalDirection()) {
                return 'vertical';
            }

            return '';
        },

        isHorizontalDirection: function() {
            return (this.direction == "left" || this.direction == "right");
        },

        isVerticalDirection: function() {
            return (this.direction == "up" || this.direction == "down");
        },

        /**
         * Apstrādājam touch registered notikumu
         */
        handleTouchRegistered: function(touch) {
            this.touchesCount++;

            // Ja ir viens touch, tad reģistrējam kā tap
            if (this.touchesCount == 1) {
                // Reģistrējam tap
                this.registerTapLog(this.touches[touch.identifier]);
            }
        },

        handleTouchUnregistered: function(identifier) {
            this.touchesCount--;

            // Atreģistrējam tap
            this.unregisterTapLog(identifier);
        },

        /**
         * @param validateTouchedElement Reģistrējam tikai tos touch, kuri nāk no iekonfigurētā elementa
         * Tas ir vajadzīgs, lai swipe sāktos tikai uz iekofigurēto elementu
         * Pēc tam, kad notiek move, tad neskatamies uz touched elementu
         *
         * changedTouches nesatur to elementu uz kura tagad touch atrodas
         * elements vienmēr būs tas no kura sākās touch events
         * Elements, kurš pašlaik ir zem touch jānosaka ar pageX pageY vai kaut kā savādāk
         */
        registerTouches: function(ev, validateTouchedElement) {
            if (ev.changedTouches) {
                for (var i = 0; i < ev.changedTouches.length; i++) {
                    this.registerTouch(this.formatTouch(ev.changedTouches[i]), this.eventTarget(ev.changedTouches[i]), validateTouchedElement);
                }
            }
            else {
                this.registerTouch(this.formatTouch(ev), this.eventTarget(ev), validateTouchedElement);
            }
        },

        unregisterTouches: function(ev) {
            if (ev.changedTouches) {
                for (var i = 0; i < ev.changedTouches.length; i++) {
                    this.unregisterTouch(ev.changedTouches[i].identifier)
                }
            }
            else {
                this.unregisterTouch('_faketouch')
            }
        },

        registerTouch: function(touch, touchedElement, validateTouchedElement) {

            if (validateTouchedElement) {
                if (!this.isTheElement(touchedElement)) {
                    return false;
                }
            }
            
            // Update
            if (this.isTouchRegistered(touch)) {
                this.touches[touch.identifier] = touch;
                this.touches[touch.identifier].touchedElement = touchedElement;

                return false;
            }

            // Insert new
            this.touches[touch.identifier] = touch;
            this.touches[touch.identifier].touchedElement = touchedElement;

            // Touch ir piereģistrēts
            this.handleTouchRegistered(this.touches[touch.identifier]);
        },

        unregisterTouch: function(identifier) {

            if (typeof this.touches[identifier] != 'undefined') {
                delete this.touches[identifier];

                // Paziņojam, ka touch ir atreģistrēts
                this.handleTouchUnregistered(identifier);
            }
        },

        isTouchRegistered: function(touch) {
            return (typeof this.touches[touch.identifier] != 'undefined');
        },

        /**
         * Get touch object from event
         * We need only x, y coordinates and time of touch
         */
        // getTouch: function(ev) {
        //     var t = false;
        //     var changedTouches = ev.changedTouches;
            
        //     if (changedTouches) {
        //         t = changedTouches[0];
        //     }
        //     else {
        //         t = ev;
        //     }
            
        //     t = t ? this.formatTouch(t) : false;

        //     if (t) {
        //         // Pieglabājam elementu, uz kura notika touch
        //         t.touchedElement = this.eventTarget(ev);
        //     }

        //     return t;
        // },

        /**
         * Atgriežam touches kopiju uz doto mirkli
         */
        getTouches: function() {
            var mthis = this;
            return new List(this.map(this.touches, function(touch){
                return mthis.clone(touch);
            }))
        },

        formatTouch: function(ev) {
            return {
                identifier: (typeof ev.identifier == 'undefined' ? '_faketouch' : ev.identifier),
                x: typeof ev.pageX == 'undefined' ? ev.x : ev.pageX,
                y: typeof ev.pageY == 'undefined' ? ev.y : ev.pageY,
                t: new Date().getTime()
            }
        },

        /**
         * Reģistrējam tap logu. Piereģistrējam touch pēc tā id un piereģistrējam tā sākuma laiku
         * @param string Touch identifikators
         */
        registerTapLog: function(touch) {
            this.tapsLog[touch.identifier] = {
                touch: this.clone(touch),
                startTime: new Date().getTime(),
                endTime: undefined,
                duration: undefined,
                executed: false
            };
        },

        /**
         * Atgreģistrējam tap. Uzliekam tap end laiku pēc touch id
         * Tā lai varam pēc tam izrēķināt cik ilgs ir bijis touch
         */
        unregisterTapLog: function(identifier) {
            if (typeof this.tapsLog[identifier] != 'undefined') {
                this.registerTapEnd(this.tapsLog[identifier])
            }
        },

        clearTapLog: function() {
            this.tapsLog = {}
        },

        registerTapEnd: function(tap) {
            if (!tap.endTime) {
                tap.endTime = new Date().getTime();
                    
                // Tap ilgums
                tap.duration = tap.endTime - tap.startTime;
            }
        },

        /**
         * Atgriež pēdējo valīdo tap no tapLog
         */
        getValidTapRegistered: function() {
            var validTap = false, mthis = this;

            this.each(this.tapsLog, function(tap){
                
                if (mthis.validateTap(tap)) {
                    validTap = tap;
                }

            })

            return validTap;
        },

        validateTap: function(tap) {
            if (tap.duration > this._config.tapMinDuration && tap.duration < this._config.tapMaxDuration) {
                if (this.isTheElement(tap.touch.touchedElement)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Fire events attached callbacks
         */
        fire: function(eventName, args) {
            for (var i in this.events[eventName]) {
                this.events[eventName][i].apply(this, args);
            }
        },

        /**
         * Always retranslate touch move event
         * Check if swipe width or height is greater then 0
         */
        fireTouchMove: function() {
            var t = this.formatMovement();
            if (t.width > 0 || t.height > 0) {
                this.fire("touchmove", [t]);
            }
        },

        /**
         * Check if target is same as this.el or target is child of this.el
         */
        isTheElement: function(target) {
            return (target == this.el || this.isChild(target, this.el));
        },

        isChild: function(target, element) {
            var n = target.parentNode;
            while (n) {
                if (n == element) {
                    return true;
                }
                n = n.parentNode;
            }
            return false;
        },

        addEvent: function(obj, type, fn, params) {
            params = (typeof params == 'undefined' ? false : params);
            if ( obj.attachEvent ) {
                obj['e'+type+fn] = fn;
                obj[type+fn] = function(){obj['e'+type+fn](window.event)}
                obj.attachEvent('on'+type, obj[type+fn]);
            }
            else {
                obj.addEventListener(type, fn, params);
            }
        },

        removeEvent: function(obj, type, fn, params) {
            params = (typeof params == 'undefined' ? false : params);
            if ( obj.detachEvent ) {
                obj.detachEvent( 'on'+type, obj[type+fn] );
                obj[type+fn] = null;
            }
            else {
                obj.removeEventListener(type, fn, params);
            }
        },

        isEventCancelable: function(ev) {
            if (typeof ev.cancelable != 'undefined') {
                return ev.cancelable;
            }

            return true;
        },

        preventEvent: function(ev) {
            if (this.isEventCancelable(ev)) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                }
                else {
                    ev.returnValue = false;
                }
            }
        },

        /**
         * Normalize event.target
         */
        eventTarget: function(ev) {
            var el;

            if (ev.target) {
                el = ev.target;
            }
            else if (ev.srcElement) {
                el = ev.srcElement
            }
            
            // Safari bug. Selected text returns text
            if (el.nodeType == 3) {
                el = el.parentNode
            }

            return el;
        },

        /**
         * Add event listener
         */
        on: function(eventName, cb) {
            if (typeof this.events[eventName] != 'undefined') {
                this.events[eventName].push(cb);
            }

            return this;
        },

        isEventsRegistered: function(eventName) {
            return (typeof this.events[eventName] != 'undefined' && this.events[eventName].length > 0);
        },

        /**
         * Set configuration parameters
         */
        config: function(config) {
            if (typeof config == 'undefined') {
                config = {};
            }

            function formatByType(value, type) {
                switch (type) {
                    case 'int': return parseInt(value, 10);
                    case 'boolean': return (value ? true : false);
                    default: return value
                }
            }
            
            function formatValue(value, config) {
                if (typeof config.multiple == 'undefined') {
                    config.multiple = false;
                }

                if (config.multiple) {
                    value = value.split(' ');
                    for (var i = 0; i < value.length; i++) {
                        value[i] = formatByType(value[i], config.type);
                    }
                }
                else {
                    value = formatByType(value, config.type)
                }

                return value;
            }

            var defConfig = {
                // Directions var būt vairāki (vertical horizontal)
                direction:  {value: ['horizontal', 'vertical'], type: 'string', multiple: true},

                minWidth: {value: false, type: 'int'},
                minHeight: {value: false, type: 'int'},
                minDuration: {value: false, type: 'int'},

                maxWidth: {value: false, type: 'int'},
                maxHeight: {value: false, type: 'int'},
                maxDuration: {value: false, type: 'int'},

                disablePinch: {value: false, type: 'boolean'},

                /**
                 * Prevent any movement. Šis notiek touchstart eventā
                 * Šis palīdz iOS gadījumā, kad neskatoties uz prevent move
                 * lapa tā pat dabū skrolēties ar elastic
                 */
                alwaysPreventTouchStart: {value: false, type: 'boolean'},

                /**
                 * Move events tiek izpildīts caur requestAnimationFrame nevis uz katru move
                 */
                fireMoveOnRequestAnimationFrame: {value: false, type: 'boolean'},

                doubletapWaitTimeout: {value: 530, type: 'int'},
                tapMaxDuration: {value: 600, type: 'int'},
                tapMinDuration: {value: 5, type: 'int'}
            }

            // Init empty config
            this._config = {};

            // Append defaults
            for (var p in defConfig) {
                this._config[p] = typeof config[p] == 'undefined' ? defConfig[p].value : formatValue(config[p], defConfig[p]);
            }
        },

        setTouchAction: function(direction) {
            var c = [];

            if (this.isDirection(direction, 'vertical')) {
                c.push('pan-x');
            }

            if (this.isDirection(direction, 'horizontal')) {
                c.push('pan-y');
            }
            
            // Pievienojam touch-action
            if (c.length > 0) {
                this.el.style.touchAction = c.join(' ');    
            }
            else {
                this.el.style.touchAction = 'none';
            }
        },

        isDirection: function(directionsArray, direction) {
            for (var i = 0; i < directionsArray.length; i++) {
                if (directionsArray[i] == direction) {
                    return true
                }
            }
            return false;
        },

        /**
         * Detect if main (left) button is pressed
         */
        isMainMouseButton: function(ev) {
            if (typeof ev['which'] != 'undefined') {
                return ev.which == 1; 
            }
            else if (typeof ec['button'] != 'undefined') {
                return ev.button == 0;
            }
            else {
                return true;
            }
        },

        /**
         * Destroy swipe monitoring
         */
        destroy: function() {
            // Remove all event listeners
            this.handleEvents('remove');
            this.events = [];
        },

        objProps: function(obj) {
            var r = [];
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    r.push(name);
                }
            }
            return r;
        },

        map: function(obj, cb) {
            var r = [];
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    r.push(cb(obj[name], obj));
                }
            }
            return r;
        },

        each: function(obj, cb) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    cb(obj[name], name);
                }
            }
        },

        clone: function(obj) {
            var r = {};
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    r[name] = obj[name];
                }
            }
            return r;
        }
    }

    return Swipe;
});

},{}],120:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function calcPaddingBottom(ratio) {
  // Padota malu attiecība kā number
  if (!isNaN(ratio)) {
    return "".concat(ratio * 100, "%");
  }
  var ar = validateAspectRatio(ratio);
  if (ar) {
    return "".concat(ar.y / ar.x * 100, "%");
  }
}
function validateAspectRatio(ratio) {
  var delimiters = [':', '/', 'x', '*'];
  for (var _i = 0, _delimiters = delimiters; _i < _delimiters.length; _i++) {
    var delimiter = _delimiters[_i];
    var parts = ratio.split(delimiter);
    if (parts.length > 1) {
      return {
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1])
      };
    }
  }
}
var _default = exports["default"] = {
  init: function init() {},
  setRatio: function setRatio(aspectRatioEl, ratio) {
    var ar = validateAspectRatio(ratio);
    aspectRatioEl.style.aspectRatio = ar ? ar.x + '/' + ar.y : '';
  },
  setRatioFromDimensions: function setRatioFromDimensions(aspectRatioEl, _ref) {
    var width = _ref.width,
      height = _ref.height;
    aspectRatioEl.style.aspectRatio = width + '/' + height;
  }
};

},{}],121:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _Table = _interopRequireDefault(require("./Table"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.clickp)('[data-button-add]', function (ev, el) {
      if (el.dataset.table) {
        _Table["default"].addRow(el.dataset.table);
      }
    });
  },
  /**
   * Pārbauda vai padotais el ir post button
   */
  isButtonAdd: function isButtonAdd(el) {
    if ('buttonAdd' in el.dataset) {
      return true;
    }
    return false;
  }
};

},{"./Table":144,"dom-helpers":70}],122:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _FieldDate = _interopRequireDefault(require("./FieldDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.clickp)('[data-button-clear]', function (ev, buttonEl) {
      /**
       * TODO šis vēl izstrādē
       * pašlaik uztaisīt, tikai, lai darbotos uz field-date
       *
       * el.dataset.buttonClear būtu query selector, lai atrastu lauku kuru notīrīt
       */

      var fieldDateEl = (0, _domHelpers.parent)(buttonEl, '.field-date');
      if (fieldDateEl) {
        _FieldDate["default"].clear(fieldDateEl);
      }
    });
  },
  isButtonClear: function isButtonClear(el) {
    if ('buttonClear' in el.dataset) {
      return true;
    }
    return false;
  }
};

},{"./FieldDate":131,"dom-helpers":70}],123:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function isInputField(el) {
  switch (el.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      return true;
  }
  return false;
}
function copyToClipboard(el) {
  if (!el) {
    return;
  }
  if (!('clipboard' in navigator)) {
    console.error('Could not copy text: clipboard.navigator not available. Probaly your site is not served over https');
    return;
  }
  var elText = '';
  if (isInputField(el)) {
    // šis ir gadījumam, ja nav pieejams navigator.clipboard
    //el.select();
    //el.setSelectionRange(0, 99999); // For mobile devices
    //document.execCommand("copy");

    elText = el.value;
  } else {
    elText = el.innerHTML;
  }

  // Copy the text inside the text field
  navigator.clipboard.writeText(elText)["catch"](function (err) {
    console.error('Could not copy text: ', err);
  });
}
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.clickp)('[data-button-copy]', function (ev, el) {
      // Atrodam elementu, kurā veikt copy
      var copySourceEl = (0, _domHelpers.qr)(el, el.dataset.buttonCopy);
      if (copySourceEl) {
        copyToClipboard(copySourceEl);
      }
    });
  },
  isButtonCopy: function isButtonCopy(el) {
    if ('buttonCopy' in el.dataset) {
      return true;
    }
    return false;
  }
};

},{"dom-helpers":70}],124:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _ButtonLoading = _interopRequireDefault(require("./ButtonLoading"));
var _Table = _interopRequireDefault(require("./Table"));
var _DropdownMenu = _interopRequireDefault(require("./DropdownMenu"));
var _ReplaceElWithNewHtmlIfNecessary = _interopRequireDefault(require("./helpers/ReplaceElWithNewHtmlIfNecessary"));
var _handleDropdownMenuHideFromEl = _interopRequireDefault(require("./helpers/handleDropdownMenuHideFromEl"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.clickp)('[data-button-delete]', function (ev, buttonEl) {
      ev.preventDefault();

      // Tabulas rindas dzēšana
      if (buttonEl.dataset.buttonDelete == 'tableRow') {
        if (buttonEl.dataset.role == 'menuitem') {
          // Dzēšam
          _Table["default"].deleteRow(
          // Atrodam tabula row
          (0, _domHelpers.parent)(
          // Atrodam menu open trigger elementu. Tā būs poga tabulas šūnā
          _DropdownMenu["default"].getOpenTriggerByChild(buttonEl), 'tr'));
          _DropdownMenu["default"].close();
        } else {
          // Dzēšam to rindu, kurā atrodas delete poga
          _Table["default"].deleteRow((0, _domHelpers.parent)(buttonEl, 'tr'));
        }
      } else if (buttonEl.dataset.url) {
        _ButtonLoading["default"].maybeLoading(buttonEl, 'delete');
        var elReplacer = new _ReplaceElWithNewHtmlIfNecessary["default"](buttonEl);

        /**
         * Nevar likt pirms ReplaceElWithNewHtmlIfNecessary, jo tad
         * dropdownmenu ir aizvēries un vairs nevar atrast openTriggerEl
         */
        (0, _handleDropdownMenuHideFromEl["default"])(buttonEl, 'onsubmit');
        (0, _domHelpers.del)(buttonEl.dataset.url).then(function (r) {
          if (buttonEl.dataset.redirect) {
            window.location.href = buttonEl.dataset.redirect;
          } else {
            elReplacer.replace(r);
            _ButtonLoading["default"].idle(buttonEl);
            (0, _handleDropdownMenuHideFromEl["default"])(buttonEl, 'aftersubmit');
          }
        });
      }
    });
  },
  /**
   * Pārbauda vai padotais el ir delete button
   */
  isButtonDelete: function isButtonDelete(buttonEl) {
    if ('buttonDelete' in buttonEl.dataset) {
      return true;
    }
    return false;
  }
};

},{"./ButtonLoading":126,"./DropdownMenu":130,"./Table":144,"./helpers/ReplaceElWithNewHtmlIfNecessary":161,"./helpers/handleDropdownMenuHideFromEl":164,"dom-helpers":70}],125:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _ButtonLoading = _interopRequireDefault(require("./ButtonLoading"));
var _ReplaceElWithNewHtmlIfNecessary = _interopRequireDefault(require("./helpers/ReplaceElWithNewHtmlIfNecessary"));
var _handleDropdownMenuHideFromEl = _interopRequireDefault(require("./helpers/handleDropdownMenuHideFromEl"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.clickp)('[data-button-get]', function (ev, buttonEl) {
      if (buttonEl.dataset.url) {
        _ButtonLoading["default"].maybeLoading(buttonEl, 'get');
        var elReplacer = new _ReplaceElWithNewHtmlIfNecessary["default"](buttonEl);

        /**
         * Nevar likt pirms ReplaceElWithNewHtmlIfNecessary, jo tad
         * dropdownmenu ir aizvēries un vairs nevar atrast openTriggerEl
         */
        (0, _handleDropdownMenuHideFromEl["default"])(buttonEl, 'onsubmit');
        (0, _domHelpers.get)(buttonEl.dataset.url).then(function (r) {
          if (buttonEl.dataset.redirect) {
            window.location.href = buttonEl.dataset.redirect;
          } else {
            elReplacer.replace(r);
            _ButtonLoading["default"].idle(buttonEl);
            (0, _handleDropdownMenuHideFromEl["default"])(buttonEl, 'aftersubmit');
          }
        });
      }
    });
  },
  /**
   * Pārbauda vai padotais el ir post button
   */
  isButtonget: function isButtonget(buttonEl) {
    if ('buttonGet' in buttonEl.dataset) {
      return true;
    }
    return false;
  }
};

},{"./ButtonLoading":126,"./helpers/ReplaceElWithNewHtmlIfNecessary":161,"./helpers/handleDropdownMenuHideFromEl":164,"dom-helpers":70}],126:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function _loading(el) {
  // previous loading state
  el.dataset.pl = el.dataset.loading ? el.dataset.loading : '';
  el.dataset.loading = 'loading';

  // previous disabled state
  //el.dataset.pd = el.disabled ? 'disabled' : '';

  /**
   * Ja nav timeout, tad submit nenotiek, jo acīmredzot disabled pogas nesubmitējas,
   * ja arī bija not disabled
   *
   * Ja poga ir Dropdown, tad uz disable poga zaudē fokusu un Dropdown menu
   * nostrādā focusout un Dropdown menu aizveras, tad kad to nevajag darīt
   *
   * Disabled, tagad ir radījis divas problēmas. Varbūt labāk netaisīt disable,
   * bet readonly vai kaut kādu fake disabled???
   */
  //setTimeout(() => el.disabled = true, 1);
}
function _idle(el) {
  if (el.dataset.pl) {
    el.dataset.loading = el.dataset.pl;
  }
  delete el.dataset.pl;

  //el.disabled = el.dataset.pd == 'disabled';
  //delete el.dataset.pd;
}
function _toggle(el) {
  if (el.dataset.loading == 'loading') {
    _idle(el);
  } else {
    _loading(el);
  }
}
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.click)('button[data-loading="onclick"],a[data-loading="onclick"]', function (ev, el) {
      _loading(el);
    });
  },
  toggle: function toggle(el) {
    _toggle(el);
  },
  loading: function loading(el) {
    _loading(el);
  },
  idle: function idle(el) {
    _idle(el);
  },
  maybeLoading: function maybeLoading(el, eventName) {
    if (el.dataset.loading == 'on' + eventName) {
      _loading(el);
    }
  }
};

},{"dom-helpers":70}],127:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _ButtonLoading = _interopRequireDefault(require("./ButtonLoading"));
var _ReplaceElWithNewHtmlIfNecessary = _interopRequireDefault(require("./helpers/ReplaceElWithNewHtmlIfNecessary"));
var _handleDropdownMenuHideFromEl = _interopRequireDefault(require("./helpers/handleDropdownMenuHideFromEl"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.clickp)('[data-button-post]', function (ev, buttonEl) {
      if (buttonEl.dataset.url) {
        _ButtonLoading["default"].maybeLoading(buttonEl, 'post');
        var elReplacer = new _ReplaceElWithNewHtmlIfNecessary["default"](buttonEl);

        /**
         * Nevar likt pirms ReplaceElWithNewHtmlIfNecessary, jo tad
         * dropdownmenu ir aizvēries un vairs nevar atrast openTriggerEl
         */
        (0, _handleDropdownMenuHideFromEl["default"])(buttonEl, 'onsubmit');
        (0, _domHelpers.post)(buttonEl.dataset.url).then(function (r) {
          if (buttonEl.dataset.redirect) {
            window.location.href = buttonEl.dataset.redirect;
          } else {
            elReplacer.replace(r);
            _ButtonLoading["default"].idle(buttonEl);
            (0, _handleDropdownMenuHideFromEl["default"])(buttonEl, 'aftersubmit');
          }
        });
      }
    });
  },
  /**
   * Pārbauda vai padotais el ir post button
   */
  isButtonPost: function isButtonPost(buttonEl) {
    if ('buttonPost' in buttonEl.dataset) {
      return true;
    }
    return false;
  }
};

},{"./ButtonLoading":126,"./helpers/ReplaceElWithNewHtmlIfNecessary":161,"./helpers/handleDropdownMenuHideFromEl":164,"dom-helpers":70}],128:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _calendar = _interopRequireDefault(require("calendar"));
var _weekDayToText = _interopRequireDefault(require("./calendar/weekDayToText"));
var _stringToDate = _interopRequireDefault(require("./calendar/stringToDate"));
var _formatDate = _interopRequireDefault(require("./calendar/formatDate"));
var _dateCaptionFormatter = _interopRequireDefault(require("./calendar/dateCaptionFormatter"));
var _navPrevFormatter = _interopRequireDefault(require("./calendar/navPrevFormatter"));
var _navNextFormatter = _interopRequireDefault(require("./calendar/navNextFormatter"));
var _monthDayFormatter = _interopRequireDefault(require("./calendar/monthDayFormatter"));
var _getJsonFromHtml = _interopRequireDefault(require("./helpers/getJsonFromHtml"));
var _Listeners = _interopRequireDefault(require("./helpers/Listeners"));
var _getDateFromReference = _interopRequireDefault(require("./calendar/getDateFromReference"));
var _clampDate = _interopRequireDefault(require("./calendar/clampDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function CalendarWrapper(containerEl) {
  var _this = this;
  this.containerEl = containerEl;

  // Vai ir period select
  this.isPeriod = containerEl.dataset.period == 'yes';
  this.actionOnDateSelect = containerEl.dataset.onDateSelect;

  /**
   * Šie lauki ir vienmēr. By default bez name. Ja padots name, tad ar name
   */
  // Single date lauks
  this.dateInputField = (0, _domHelpers.q)(this.containerEl, 'input[data-role="date"]');
  // Period lauki
  this.fromInputField = (0, _domHelpers.q)(this.containerEl, 'input[data-role="from"]');
  this.tillInputField = (0, _domHelpers.q)(this.containerEl, 'input[data-role="till"]');
  var firstDate = new Date();

  // Nolasām firstData no input laukie, ja tajos ir vērtības
  if (this.isPeriod) {
    if (this.fromInputField.value) {
      firstDate = (0, _stringToDate["default"])(this.fromInputField.value);
    }
  } else {
    if (this.dateInputField.value) {
      firstDate = (0, _stringToDate["default"])(this.dateInputField.value);
    }
  }
  var calendarProps = {
    //cssprefix: '',
    view: 'month',
    count: 1,
    showWeekdays: true,
    showDateSwitch: true,
    showToday: true,
    showSelectedDate: true,
    selectPeriod: this.isPeriod,
    // Vai ļaut klikšķināt uz prev/next month datumiem
    disablePrevMonthDate: true,
    disableNextMonthDate: true,
    monthDayFormatter: _monthDayFormatter["default"],
    weekDayToText: _weekDayToText["default"],
    dateCaptionFormatter: _dateCaptionFormatter["default"],
    navPrevFormatter: _navPrevFormatter["default"],
    navNextFormatter: _navNextFormatter["default"]
  };

  // State
  var state = (0, _getJsonFromHtml["default"])(this.containerEl, 'state');
  if (state) {
    calendarProps.state = state;
  }

  // Default date state
  var defaultDateState = (0, _getJsonFromHtml["default"])(this.containerEl, 'default-date-state');
  if (defaultDateState) {
    calendarProps.defaultDateState = defaultDateState;
  }
  if (containerEl.dataset.stateUrl) {
    calendarProps.stateUrl = containerEl.dataset.stateUrl;
  }
  calendarProps.minDate = (0, _getDateFromReference["default"])(containerEl.dataset.minDate, function (minDate) {
    _this.calendar.setMinDate(minDate);
    validateSelectedDate(_this);
  });
  calendarProps.maxDate = (0, _getDateFromReference["default"])(containerEl.dataset.maxDate, function (maxDate) {
    _this.calendar.setMaxDate(maxDate);
    validateSelectedDate(_this);
  });
  this.calendar = new _calendar["default"].dom(firstDate, calendarProps);
  if (this.isPeriod) {
    if (this.fromInputField.value && this.tillInputField.value) {
      this.calendar.setSelectedPeriod({
        from: (0, _stringToDate["default"])(this.fromInputField.value),
        till: (0, _stringToDate["default"])(this.tillInputField.value)
      });
    }
  } else {
    if (this.dateInputField.value) {
      this.calendar.setSelectedDate(firstDate);
    }
  }

  // Ja ir date input field, tad uz dateclick ieliksim to datumu laukā
  if (this.dateInputField) {
    /**
     * kad datums mainās nevis lietotājs taisa click
     * jo datums var izmainīties arī bez lietotāja click
     */
    this.calendar.on('change', function (date) {
      _this.dateInputField.value = _formatDate["default"].ymd(date);
      if (_this.actionOnDateSelect == 'submit') {
        // Atrodam parent formu un submit
        var form = (0, _domHelpers.parent)(_this.containerEl, 'form');
        if (form) {
          form.submit();
        }
      }
    });
  }
  if (this.fromInputField || this.tillInputField) {
    this.calendar.on('periodselect', function (period) {
      if (_this.fromInputField) {
        _this.fromInputField.value = _formatDate["default"].ymd(period.from);
      }
      if (_this.tillInputField) {
        _this.tillInputField.value = _formatDate["default"].ymd(period.till);
      }
    });
  }

  // Append, jo containerEl var būt iekšā date input field
  (0, _domHelpers.append)(this.containerEl, this.calendar.getEl());
}
function validateSelectedDate(calendarWrapper) {
  if (!calendarWrapper.calendar.getSelectedDate()) {
    return;
  }
  var clampedDate = (0, _clampDate["default"])(calendarWrapper.calendar.getSelectedDate(), calendarWrapper.calendar.getMinDate(), calendarWrapper.calendar.getMaxDate());
  if (!_formatDate["default"].sameYmd(clampedDate, calendarWrapper.calendar.getSelectedDate())) {
    calendarWrapper.calendar.setSelectedDate(clampedDate);
  }
}

/**
 * Nolasām un klausāmies datumu no kalendāra pēc tā vārda
 */
function watchDateFromCalendarByName(watchCalendarName, cb) {
  onChangeListeners.listen(function (calendarName, date) {
    if (watchCalendarName != calendarName) {
      return;
    }
    cb(date);
  });
  var calendar = findCalendarByName(watchCalendarName);
  if (calendar) {
    return calendar.getDate();
  }
}
function findCalendarByName(calendarName) {
  var instance = instances.find(function (instance) {
    return instance.name == calendarName;
  });
  return instance ? instance.calendarWrapper.calendar : null;
}
var instances = [];
var onChangeListeners = new _Listeners["default"]();
var _default = exports["default"] = {
  init: function init() {
    _toConsumableArray((0, _domHelpers.qa)('.calendar')).forEach(function (calendarEl) {
      // Ja ir FieldData calendar elements
      if ('fieldDateCalendarContainer' in calendarEl.dataset) {
        return;
      }
      var calendarWrapper = new CalendarWrapper(calendarEl);
      var newLength = instances.push({
        name: calendarEl.dataset.name,
        calendarWrapper: calendarWrapper
      });
      calendarEl.dataset.calid = newLength - 1;
      calendarWrapper.calendar.on('dateclick', function (date) {
        onChangeListeners.trigger([calendarEl.dataset.name, date]);
      });
      onChangeListeners.trigger([calendarEl.dataset.name, calendarWrapper.calendar.getDate()]);
    });

    // Register method to get calendar instance by name
    window.uiGetCalendarByName = function (name) {
      return findCalendarByName(name);
    };
  },
  getByName: function getByName(calendarName) {
    return findCalendarByName(calendarName);
  },
  onDateChange: function onDateChange(cb) {
    onChangeListeners.listen(cb);
  }
};

},{"./calendar/clampDate":147,"./calendar/dateCaptionFormatter":148,"./calendar/formatDate":150,"./calendar/getDateFromReference":151,"./calendar/monthDayFormatter":153,"./calendar/navNextFormatter":154,"./calendar/navPrevFormatter":155,"./calendar/stringToDate":156,"./calendar/weekDayToText":157,"./helpers/Listeners":160,"./helpers/getJsonFromHtml":163,"calendar":4,"dom-helpers":70}],129:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function _loading(el) {
  // previous loading state
  el.dataset.pl = el.dataset.loading ? el.dataset.loading : '';
  el.dataset.loading = 'loading';
}
function _idle(el) {
  if (el.dataset.pl) {
    el.dataset.loading = el.dataset.pl;
  }
  delete el.dataset.pl;
}
function _toggle(el) {
  if (el.dataset.loading == 'loading') {
    _idle(el);
  } else {
    _loading(el);
  }
}
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.click)('button[data-loading="onclick"],a[data-loading="onclick"]', function (ev, el) {
      _loading(el);
    });
  },
  toggle: function toggle(el) {
    _toggle(el);
  },
  loading: function loading(el) {
    _loading(el);
  },
  idle: function idle(el) {
    _idle(el);
  },
  maybeLoading: function maybeLoading(el, eventName) {
    if (el.dataset.loading == 'on' + eventName) {
      _loading(el);
    }
  }
};

},{"dom-helpers":70}],130:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _ButtonDelete = _interopRequireDefault(require("./ButtonDelete"));
var _ButtonPost = _interopRequireDefault(require("./ButtonPost"));
var _SingletonPanel = _interopRequireDefault(require("./SingletonPanel"));
var _Listeners = _interopRequireDefault(require("./helpers/Listeners"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var dropDownMenuHideTimeout = 0;
var onOpenListeners = {};
var onCloseListeners = {};

// timeouts by panelIndex
var focusoutTimeout = {};

/**
 * Menu sastaiste ar trigger elementu, kurš atvēra menu
 * menu name -> triggerEl
 */
var menuOpenTriggers = {};
var menuNameCounter = 0;
function findRelativeEl(el, querySelector) {
  var p = querySelector.indexOf(':');

  // Kurā virzienā meklēt pēc querySelector (parent|child)
  var searchDirection = querySelector.substring(0, p);
  var query = querySelector.substring(p + 1);
  if (searchDirection == 'parent') {
    return (0, _domHelpers.parent)(el, query);
  }

  // child
  return (0, _domHelpers.q)(el, query);
}
function findFirstFocusable(el) {
  var candidates = (0, _domHelpers.qa)(el, 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  for (var i = 0; i < candidates.length; i++) {
    // Jāpārbauda vai tabindex ir -1
    if (candidates[i].tabIndex < 0) {
      continue;
    }

    // Skip focus trap
    if ('dropdownMenuFocusTrap' in candidates[i].dataset) {
      continue;
    }
    return candidates[i];
  }
}

/**
 * Pirmo fokusējam pirmo pieejamo focusable elementu,
 * ja tā nav, tad fokusējam pašu menu
 */
function focusMenu(menuEl, whatToFocus) {
  var focusableEl;

  // querySelector priekš focus elementa
  if (whatToFocus) {
    focusableEl = (0, _domHelpers.q)(menuEl, whatToFocus);
  }
  if (!focusableEl) {
    focusableEl = findFirstFocusable(menuEl);
  }
  if (!focusableEl) {
    // Fokusējam contentEl
    focusableEl = (0, _domHelpers.q)(menuEl, '[data-dropdown-menu-content-el]');
  }
  focusableEl.focus();
  return focusableEl;
}
function findDropdownMenuEl(triggerEl) {
  // nākošais sibling no triggerEl
  if (triggerEl.dataset.dropdownMenuTrigger == 'dom.nextSibling') {
    return (0, _domHelpers.next)(triggerEl, '[data-dropdown-menu-name]');
  } else {
    return findDropdownMenuByName(triggerEl.dataset.dropdownMenuTrigger);
  }
}
function findDropdownMenuByName(name) {
  return (0, _domHelpers.q)('[data-dropdown-menu-name="' + name + '"]');
}
function findDropdownMenuByChild(childEl) {
  return (0, _domHelpers.parent)(childEl, '[data-dropdown-menu-name]');
}

/**
 * Šeit arī tiks pārbaudīts vai triggerEl ir izveidots menu name
 */
function findDropdown(triggerEl) {
  var menuEl = findDropdownMenuEl(triggerEl);
  if (menuEl) {
    // Ģenerējam unikālu name
    if (!menuEl.dataset.dropdownMenuName) {
      menuEl.dataset.dropdownMenuName = 'dropdown-menu-' + menuNameCounter++;
      triggerEl.dataset.dropdownMenuTrigger = menuEl.dataset.dropdownMenuName;
    }
  }
  return menuEl;
}
function triggerMenuOpenListeners(menuEl, menuOpenTriggerEl) {
  var menuName = menuEl.dataset.dropdownMenuName;
  if (onOpenListeners[menuName]) {
    onOpenListeners[menuName].trigger([menuEl, menuOpenTriggerEl]);
  }
  // Any menus listener
  if (onOpenListeners['__any__']) {
    onOpenListeners['__any__'].trigger([menuEl, menuOpenTriggerEl]);
  }
}
function triggerMenuCloseListeners(menuEl, menuOpenTriggerEl) {
  var menuName = menuEl.dataset.dropdownMenuName;
  if (onCloseListeners[menuName]) {
    onCloseListeners[menuName].trigger([menuEl, menuOpenTriggerEl]);
  }
  // Any menus listener
  if (onCloseListeners['__any__']) {
    onCloseListeners['__any__'].trigger([menuEl, menuOpenTriggerEl]);
  }
}

/**
 * Vai padotais dropdown menu ir atvērts
 */
function isDropdownMenuOpen(menuEl) {
  if ('dropdownMenuPanelIndex' in menuEl.dataset) {
    return true;
  }
  return false;
}
function _getOpenTrigger(menuEl) {
  if (isDropdownMenuOpen(menuEl)) {
    return menuOpenTriggers[menuEl.dataset.dropdownMenuName];
  }
}
var menuMouseEvents = {
  mouseover: function mouseover() {},
  mouseout: function mouseout() {}
};
var menuMouseEventHandlers = {};
function setMouseEvents(menuEl) {
  menuMouseEventHandlers[menuEl.dataset.dropdownMenuName] = {
    mouseover: (0, _domHelpers.on)(menuEl, 'mouseenter', function (ev, menuEl) {
      menuMouseEvents.mouseover(menuEl);
    }),
    mouseout: (0, _domHelpers.on)(menuEl, 'mouseleave', function (ev, menuEl) {
      menuMouseEvents.mouseout(menuEl);
    })
  };
}
function unsetMouseEvents(menuEl) {
  (0, _domHelpers.off)(menuEl, 'mouseenter', menuMouseEventHandlers[menuEl.dataset.dropdownMenuName].mouseover);
  (0, _domHelpers.off)(menuEl, 'mouseleave', menuMouseEventHandlers[menuEl.dataset.dropdownMenuName].mouseout);
}
function open(triggerEl, menuEl) {
  // Notīrām hide timeout
  clearTimeout(dropDownMenuHideTimeout);
  var positionX = menuEl.dataset.positionX;
  var positionY = menuEl.dataset.positionY;
  var positionDir = menuEl.dataset.positionDir;
  var positionXOffset = menuEl.dataset.positionXOffset;
  var positionYOffset = menuEl.dataset.positionYOffset;

  // Skatamies vai triggerEl override
  if ('dropdownMenuPositionX' in triggerEl.dataset) {
    positionX = triggerEl.dataset.dropdownMenuPositionX;
  }
  if ('dropdownMenuPositionY' in triggerEl.dataset) {
    positionY = triggerEl.dataset.dropdownMenuPositionY;
  }
  if ('dropdownMenuPositionDir' in triggerEl.dataset) {
    positionDir = triggerEl.dataset.dropdownMenuPositionDir;
  }
  if ('dropdownMenuPositionXOffset' in triggerEl.dataset) {
    positionXOffset = triggerEl.dataset.dropdownMenuPositionXOffset;
  }
  if ('dropdownMenuPositionYOffset' in triggerEl.dataset) {
    positionYOffset = triggerEl.dataset.dropdownMenuPositionYOffset;
  }

  // Pēc noklusējuma nav pozicionēšanas elementa
  var positionEl = null;
  var positionElDir = menuEl.dataset.positionAtDir;
  if (menuEl.dataset.positionAt) {
    /**
     * TODO laikam menuEl.dataset.positionAt jāuzskata kā querySelector
     *
     * Special keyword ir viewport
     */
    if (menuEl.dataset.positionAt == 'viewport') {
      positionEl = menuEl.dataset.positionAt;
    } else {
      positionEl = (0, _domHelpers.q)(menuEl.dataset.positionAt);
    }
  }

  // Skatamies vai triggerEl override
  if ('dropdownMenuPositionAt' in triggerEl.dataset) {
    if (triggerEl.dataset.dropdownMenuPositionAt == 'viewport') {
      positionEl = triggerEl.dataset.dropdownMenuPositionAt;
    } else {
      if (triggerEl.dataset.dropdownMenuPositionAt) {
        positionEl = findRelativeEl(triggerEl, triggerEl.dataset.dropdownMenuPositionAt);
      } else {
        // ja nav norādīts konkrēts selector, tad pats triggerEl
        positionEl = triggerEl;
      }
    }
  }
  if ('dropdownMenuPositionAtDir' in triggerEl.dataset) {
    positionElDir = triggerEl.dataset.dropdownMenuPositionAtDir;
  }
  _SingletonPanel["default"].open(menuEl, {
    /**
     * Kādā scenārijā vērt ciet menu
     * Ja nav nodefinēts, tad menu netiek vērts ciet
     **/
    hide: 'dropdownMenuHide' in triggerEl.dataset ? triggerEl.dataset.dropdownMenuHide : false,
    positionEl: positionEl,
    positionElDir: positionElDir,
    x: positionX,
    y: positionY,
    xOffset: positionXOffset,
    yOffset: positionYOffset,
    dir: positionDir,
    onOpen: function onOpen(menuEl, panelIndex) {
      // Dropdown menu hide vērtību replicējam pie menuEl
      // tikai, ja tā ir uzlikta. Ja nav uzlikta, tad drošības pēc dzēšam no menuEl
      if ('dropdownMenuHide' in triggerEl.dataset) {
        menuEl.dataset.dropdownMenuHide = triggerEl.dataset.dropdownMenuHide;
      } else {
        delete menuEl.dataset.dropdownMenuHide;
      }
      menuEl.dataset.dropdownMenuPanelIndex = panelIndex;
      // Uzliekam tabIndex
      menuEl.tabIndex = 0;
      menuEl.hidden = false;

      // Set mouseenter, mouseleave events
      setMouseEvents(menuEl);

      /**
       * Pazīmi, ka menu atvērts liekam uz triggerEl, jo
       * dažādi trigger el var atvērt vienu un to pašu menu
       */
      triggerEl.dataset.dropdownMenuOpen = '1';

      // Pārbaudām vai šim menu jau nav piesaistīts triggerEl
      if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
        // Iepriekšējam triggerEl novācam pazīmi, ka uz tā ir atvērts menu
        delete menuOpenTriggers[menuEl.dataset.dropdownMenuName].dataset.dropdownMenuOpen;
      }

      // Menu name sasaiste ar open trigger
      menuOpenTriggers[menuEl.dataset.dropdownMenuName] = triggerEl;

      /**
       * Menu iefokusēšana
       */
      if ('dropdownMenuFocus' in triggerEl.dataset) {
        // šo izmantos, lai ignorētu triggerEl focusout
        triggerEl.dataset.dropdownIgnoreFocusout = '';

        /**
         * TODO šito vajag pāŗtaisit, lai fokuss notiek ātrāk
         * bez setTimeout, jo uz telefoniem šitā neies cauri, nevarēs iefokusēt
         *
         * Ja fokusē pirms ir nopzicionēts, tad scrollTop mainās
         *
         * varbūt vajag initial focus, kad noliek apmēram vietā
         * tad notiek focuss
         * tad notiek menu parādīšana, lai var nolasīt dimensions
         * tad notiek precīza pozicionēšana
         * tad overlay-panel tiek noņemts hidden
         */
        setTimeout(function () {
          focusMenu(menuEl, triggerEl.dataset.dropdownMenuFocus);
        }, 10);
      }

      /**
       * Tas elements, kuru padots uz Dropdown menu kā to
       * elementu, kurā var ielikt vērtību. Ja dropdown panel
       * ir tāda vajadzība
       */
      var targetEl = triggerEl;
      if (triggerEl.dataset.dropdownMenuTargetEl) {
        targetEl = findRelativeEl(triggerEl, triggerEl.dataset.dropdownMenuTargetEl);
      }
      triggerMenuOpenListeners(menuEl, targetEl);
    },
    onContentElRemove: function onContentElRemove(menuEl) {
      delete menuEl.dataset.dropdownMenuHide;

      // novācam tab index
      menuEl.tabIndex = -1;
      menuEl.hidden = true;
      unsetMouseEvents(menuEl);
      delete menuEl.dataset.dropdownMenuPanelIndex;
      var menuOpenTriggerEl;
      // Atrodam click trigger un novācam pazīmi, ka menu ir atvērts
      if (typeof menuOpenTriggers[menuEl.dataset.dropdownMenuName] != 'undefined') {
        menuOpenTriggerEl = menuOpenTriggers[menuEl.dataset.dropdownMenuName];
        delete menuOpenTriggers[menuEl.dataset.dropdownMenuName].dataset.dropdownMenuOpen;
        delete menuOpenTriggers[menuEl.dataset.dropdownMenuName];
      }

      // append back to body, jo var būt vairāki menu un tos meklēs body
      (0, _domHelpers.append)((0, _domHelpers.q)('body'), menuEl);

      /**
       * Tas elements, kuru padots uz Dropdown menu kā to
       * elementu, kurā var ielikt vērtību. Ja dropdown panel
       * ir tāda vajadzība
       */
      var targetEl = menuOpenTriggerEl;
      if (menuOpenTriggerEl.dataset.dropdownMenuTargetEl) {
        targetEl = findRelativeEl(menuOpenTriggerEl, menuOpenTriggerEl.dataset.dropdownMenuTargetEl);
      }
      triggerMenuCloseListeners(menuEl, targetEl);
    }
  });

  // Reset form
  if ('dropdownMenuResetForm' in triggerEl.dataset) {
    (0, _domHelpers.clearFormData)(menuEl);
  }
}

/**
 * Nolasām no openTriggerEl atribūtus vērtības un uzlieka uz targetEl
 *
 * no opentriggerEl tiek nolasīta atribūta sourceAttrName vērtība un
 * uzlikta uz targetEl atribūtā attrName
 */
function setSourceAttributesFromOpenTrigger(openTriggerEl, targetEl, attributesMap) {
  for (var attrName in attributesMap) {
    var sourceAttrName = targetEl.getAttribute(attributesMap[attrName]);
    if (sourceAttrName) {
      targetEl.setAttribute(attrName, openTriggerEl.getAttribute(sourceAttrName));
    }
  }
}
function setOverrideFromOpenTriggerEl(openTriggerEl, menuEl) {
  /**
   * Attributes priekš menu item un button
   *
   * TODO varbūt button arī uzlikt role nevis vienkārši pēc button?
   */
  (0, _domHelpers.qa)(menuEl, '[data-role="menuitem"], button').forEach(function (menuItemEl) {
    if (menuItemEl.dataset.linkSource) {
      if (_ButtonDelete["default"].isButtonDelete(menuItemEl) || _ButtonPost["default"].isButtonPost(menuItemEl)) {
        menuItemEl.setAttribute('data-url', openTriggerEl.getAttribute(menuItemEl.dataset.linkSource));
      } else {
        menuItemEl.setAttribute(menuItemEl.tagName.toLowerCase() == 'a' ? 'href' : 'data-url', openTriggerEl.getAttribute(menuItemEl.dataset.linkSource));
      }
    }
    if (menuItemEl.dataset.redirectSource) {
      menuItemEl.setAttribute('data-redirect', openTriggerEl.getAttribute(menuItemEl.dataset.redirectSource));
    }
  });

  /**
   * Form attributes
   *
   * visām formām saliekam data-action-source un data-method-source
   */
  (0, _domHelpers.qa)(menuEl, 'form').forEach(function (formEl) {
    setSourceAttributesFromOpenTrigger(openTriggerEl, formEl, {
      'action': 'data-action-source',
      'method': 'data-method-source'
    });
  });
  (0, _domHelpers.qa)(menuEl, '[data-form-substitute]').forEach(function (substituteFormEl) {
    setSourceAttributesFromOpenTrigger(openTriggerEl, substituteFormEl, {
      'data-action': 'data-action-source',
      'data-method': 'data-method-source'
    });
  });
}

/**
 * Menu open trigger apstrādē (click vai hover)
 */
function handleMenuOpenTrigger(triggerEl) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    toggle = _ref.toggle;
  if (typeof toggle == 'undefined') {
    toggle = true;
  }
  var menuEl = findDropdown(triggerEl);
  if (!menuEl) {
    return;
  }

  /**
   * Menu focusout close timeout
   * Skatīties šeit izskaidrojumu on('focusout', '[data-dropdown-menu-name]'
   */
  clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
  if (toggle) {
    if ('dropdownMenuOpen' in triggerEl.dataset) {
      _SingletonPanel["default"].close(menuEl.dataset.dropdownMenuPanelIndex);
    } else {
      setOverrideFromOpenTriggerEl(triggerEl, menuEl);
      open(triggerEl, menuEl);
    }
  } else {
    // Tikai ja nav jau atvērts
    if (!('dropdownMenuOpen' in triggerEl.dataset)) {
      setOverrideFromOpenTriggerEl(triggerEl, menuEl);
      open(triggerEl, menuEl);
    }
  }
}
function closeAllInactive() {
  var panelsStack = _SingletonPanel["default"].getStack();
  var lastInactivePanelIndex;
  for (var i = panelsStack.length - 1; i >= 0; i--) {
    if ('dropdownMenuIsActive' in panelsStack[i].contentEl.dataset) {
      // Tikko atrasta pirmā aktīvā menu
      break;
    }

    // pēdējais nekatīvais panelIndex, tas tiks aizvērts un līdz ar to visi tā childs
    lastInactivePanelIndex = panelsStack[i].panelIndex;
  }
  if (typeof lastInactivePanelIndex != 'undefined') {
    if (!panelsStack[lastInactivePanelIndex].hide) {
      return;
    }
    _SingletonPanel["default"].close(lastInactivePanelIndex);
  }
}
var _default = exports["default"] = {
  init: function init() {
    var _this = this;
    /**
     * Open
     */
    // Click triggeri, kuri atvērs menu
    (0, _domHelpers.click)('[data-dropdown-menu-trigger]', function (ev, triggerEl) {
      //console.log('-    OP click [data-dropdown-menu-trigger]', triggerEl.dataset.dropdownMenuShow);

      /**
       * menu open uzlikts uz visu elementu
       * bet ir gadījumi, kad vajag, lai uz kādu no child elementiem tomēr menu netatvereas
       * tad te ir workaround.
       * Uz to child elementu, kuram vajag ignorēt menu open uzliek data-dropdown-menu-trigger-ignore
       */
      if ('dropdownMenuTriggerIgnore' in ev.target.dataset) {
        return;
      }
      if ('dropdownMenuWasKeydownEnter' in triggerEl.dataset) {
        delete triggerEl.dataset.dropdownMenuWasKeydownEnter;
        return;
      }
      switch (triggerEl.dataset.dropdownMenuShow) {
        case 'onclick':
        case 'onfocusin':
          handleMenuOpenTrigger(triggerEl);
          break;
      }
    });

    /**
     * Menu hide pogas
     * _container - aizvērs to menu kurā poga ielikta
     * {menu_name} - aizvērs named menu
     */
    (0, _domHelpers.click)('[data-dropdown-menu-hide]', function (ev, buttonEl) {
      //console.log('-    CL click [data-dropdown-menu-hide] tikai, ja _container');

      if (buttonEl.dataset.dropdownMenuHide != '_container') {
        return;
      }
      var menuEl = findDropdownMenuByChild(buttonEl);
      if (menuEl) {
        // Atrkārtoti iefokusējam triggerEl
        if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
          menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
        }
        _SingletonPanel["default"].close(menuEl.dataset.dropdownMenuPanelIndex);
      }
    });

    // Focusout uz trigger el
    // ---- CLOSE menu
    (0, _domHelpers.on)('focusout', '[data-dropdown-menu-trigger]', function (ev, triggerEl) {
      //console.log('-    CL focusout [data-dropdown-menu-trigger]');

      // Ignorējam focusout
      if ('dropdownIgnoreFocusout' in triggerEl.dataset) {
        delete triggerEl.dataset.dropdownIgnoreFocusout;
        return;
      }

      // Ja nav atvērt menu, tad skip
      if (!('dropdownMenuOpen' in triggerEl.dataset)) {
        return;
      }
      var menuEl = findDropdown(triggerEl);
      if (!('dropdownMenuHide' in menuEl.dataset)) {
        return;
      }
      if (menuEl) {
        clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
        focusoutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(function (menuEl) {
          return function () {
            delete menuEl.dataset.dropdownMenuIsActive;
            _SingletonPanel["default"].close(menuEl.dataset.dropdownMenuPanelIndex);
          };
        }(menuEl), 5);
      }
    });
    (0, _domHelpers.on)('focusin', '[data-dropdown-menu-trigger]', function (ev, triggerEl) {
      //console.log('-    NA focusin [data-dropdown-menu-trigger]');

      // Tikai, ja uzlikts menuShow="onfocusin"
      if (triggerEl.dataset.dropdownMenuShow == 'onfocusin') {
        /**
         *
         * TODO salabot, lai ir arī focusin
         *
         */
        //console.log('focusin uz trigger, atver menu uz focusin');
        //handleMenuOpenTrigger(triggerEl)
      }
    });
    (0, _domHelpers.on)('keydown', '[data-dropdown-menu-trigger]', function (ev, triggerEl) {
      //console.log('-    keydown [data-dropdown-menu-trigger]');

      switch (ev.key) {
        case 'Enter':
          // Lai nav form submit
          ev.preventDefault();
          triggerEl.dataset.dropdownMenuWasKeydownEnter = '';
          handleMenuOpenTrigger(triggerEl);
          break;
        case 'Tab':
          if ('dropdownMenuOpen' in triggerEl.dataset) {
            ev.preventDefault();
            triggerEl.dataset.dropdownIgnoreFocusout = '';
            focusMenu(findDropdown(triggerEl), triggerEl.dataset.dropdownMenuFocus);
          }
          break;
      }
    });

    // Esc uz Menu
    (0, _domHelpers.on)('keydown', '[data-dropdown-menu-name]', function (ev, menuEl) {
      //console.log('-    CL keydown [data-dropdown-menu-name]', ev.key);

      switch (ev.key) {
        case 'Escape':
          // Ja event notika uz open trigger, tad skip
          if ((0, _domHelpers.parent)(ev.target, '[data-dropdown-menu-trigger]')) {
            break;
          }

          // Atrkārtoti iefokusējam triggerEl
          if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
            menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
          }
          _SingletonPanel["default"].close(menuEl.dataset.dropdownMenuPanelIndex);
          break;
      }
    });

    /**
     * Esc uz menu Trigger
     *
     * Esc nevar noķert uz input el. tur vajag izmantot focusout
     */
    // ---- CLOSE menu
    (0, _domHelpers.on)('keydown', '[data-dropdown-menu-trigger]', function (ev, triggerEl) {
      //console.log('-    CL keydown [data-dropdown-menu-trigger]', ev.key, triggerEl);

      var menuEl;
      switch (ev.key) {
        case 'Escape':
          // Ja menu ir atvērts, tad aizveram menu
          if ('dropdownMenuOpen' in triggerEl.dataset) {
            menuEl = findDropdown(triggerEl);
            _SingletonPanel["default"].close(menuEl.dataset.dropdownMenuPanelIndex);
          } else {
            // Aizveram to menu, kurā ir Trigger
            menuEl = findDropdownMenuByChild(triggerEl);
            if (menuEl) {
              // Atrkārtoti iefokusējam triggerEl
              if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
                menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
              }
              _SingletonPanel["default"].close(menuEl.dataset.dropdownMenuPanelIndex);
            }
          }
          break;
      }
    });

    // Focusout uz menu
    // ---- CLOSE menu
    (0, _domHelpers.on)('focusout', '[data-dropdown-menu-name]', function (ev, menuEl) {
      //console.log('-    CL focusout [data-dropdown-menu-name]');

      // Ignorējam focusout
      if ('dropdownIgnoreFocusoutOnce' in menuEl.dataset) {
        delete menuEl.dataset.dropdownIgnoreFocusoutOnce;
        return;
      }
      if ('dropdownMenuFocusTrap' in ev.target.dataset) {
        return;
      }
      clearTimeout(outsideMousedownTimeout);

      // Ms pēc kurām aizvēr menu, ja vien kāds nepārtrauks šo timeout
      var closeDealyMs = 5;
      var triggerEl = _getOpenTrigger(menuEl);
      if (triggerEl && 'dropdownMenuIsMousedown' in triggerEl.dataset) {
        /**
         * Ja notiek click uz menuEl triggerEl, tad uzreiz neveram ciet, bet dodam ilgu, laiku
         * lai notiek click. Varbūt 5s ir par daudz, nav ne jausmas
         * doma tāda, ka šo timeout pārtrauks click uz triggerEl
         */
        closeDealyMs = 5000;
      }
      clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
      focusoutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(function (menuEl) {
        return function () {
          delete menuEl.dataset.dropdownMenuIsActive;
          closeAllInactive();
        };
      }(menuEl), closeDealyMs);
    });
    (0, _domHelpers.on)('focusin', '[data-dropdown-menu-name]', function (ev, menuEl) {
      //console.log('-    focusin [data-dropdown-menu-name]');

      if ('dropdownMenuFocusTrap' in ev.target.dataset) {
        return;
      }
      clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
      menuEl.dataset.dropdownMenuIsActive = '';
    });

    /**
     * Lai apietu focusout, kad tas notiek uz menuEl open trigger click
     * Click notiek vēlāk nekā focusout. Uz focusout menu jau būs aizvērts, bet uz click atkal atvērts
     * notiek flicker
     * mousedown piefiskē, kurš triggerEl, tas bija un uzliek pazīmi. Vispārējs mouseup notīra pazīmi
     */
    var mousedownTriggerEl;
    (0, _domHelpers.on)('mousedown', '[data-dropdown-menu-trigger][data-dropdown-menu-show="onclick"]', function (ev, triggerEl) {
      //console.log('-    mousedown [data-dropdown-menu-trigger][data-dropdown-menu-show="onclick"]');

      // Liekam pazīmi, ka notiek click uz open trigger un tagad is mousedown fāze
      triggerEl.dataset.dropdownMenuIsMousedown = '';
      mousedownTriggerEl = triggerEl;
    });
    // Vispārējs mouseup. Reaģēja tikai, ja bija mousedown uz triggerEl
    (0, _domHelpers.on)('mouseup', function () {
      //console.log('-    mouseup html');

      if (mousedownTriggerEl) {
        // Notīrām menu hide timeout
        var menuEl = findDropdown(mousedownTriggerEl);
        if (menuEl) {
          clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
        }

        // Notīrām pazīmi, ka bija mousedown
        delete mousedownTriggerEl.dataset.dropdownMenuIsMousedown;
        mousedownTriggerEl = undefined;
      }
    });

    /**
     * Fokuss trap dos zināt, ka ir sasniegts pēdējais elements menu
     * 1. aizveram menu un iefokusējam triggerEl
     * 2. iefokusējam pirmo el un taisam cycle pa visiem laukiem
     */
    var focusCycle = true;
    (0, _domHelpers.on)('focusin', '[data-dropdown-menu-name] [data-dropdown-menu-focus-trap]', function (ev, focusTrapEl) {
      //console.log('-    CL focusin [data-dropdown-menu-name] [data-dropdown-menu-focus-trap]');

      var menuEl = findDropdownMenuByChild(focusTrapEl);
      clearTimeout(focusoutTimeout[menuEl.dataset.dropdownMenuName]);
      if (focusCycle) {
        // Cycle
        var firstFocusable = findFirstFocusable(menuEl);
        if (firstFocusable) {
          firstFocusable.focus();
        }
      } else {
        // Atrkārtoti iefokusējam triggerEl
        if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
          menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
        }
        _SingletonPanel["default"].close(menuEl.dataset.dropdownMenuPanelIndex);
      }
    });
    (0, _domHelpers.onMouseOverOut)('[data-dropdown-menu-trigger][data-dropdown-menu-show="onhover"]', {
      mouseover: function mouseover(ev, triggerEl) {
        //console.log('-    OP mouseover [data-dropdown-menu-trigger][data-dropdown-menu-show="onhover"]');

        var menuEl = findDropdown(triggerEl);
        if (menuEl) {
          clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
        }
        handleMenuOpenTrigger(triggerEl, {
          toggle: false
        });
      }
    });

    // ---- CLOSE menu
    /**
     * Reaģējam tikai, ja uz triggerEl ir atvērts menu
     */
    (0, _domHelpers.onMouseOverOut)('[data-dropdown-menu-trigger][data-dropdown-menu-hide="onmouseout"]', {
      mouseover: function mouseover(ev, triggerEl) {
        //console.log('-    mouseover [data-dropdown-menu-trigger][data-dropdown-menu-hide="onmouseout"]');

        if (!('dropdownMenuOpen' in triggerEl.dataset)) {
          return;
        }

        // šitas nav vajadzīgs, jo ja atver uz click, tad moseout un mousover vairs nenostrādā un menu aizveras
        // if ('dropdownMenuOpen' in triggerEl.dataset) {
        //     return;
        // }

        var menuEl = findDropdown(triggerEl);
        if (menuEl) {
          clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
        }
      },
      mouseout: function mouseout(ev, triggerEl) {
        //console.log('-    CL mouseout [data-dropdown-menu-trigger][data-dropdown-menu-hide="onmouseout"]');

        /**
         * Ja dažādiem triggerEl ir viens un tas pats menuEl (by name)
         * tad uz tā otrā triggerEl mouseout nostrādās menu slēpšana
         *
         * tāpēc te vajag pārbaudīt vai vispār šim triggerEl ir atvērts menu
         */
        if (!('dropdownMenuOpen' in triggerEl.dataset)) {
          return;
        }
        var menuEl = findDropdown(triggerEl);
        if (menuEl) {
          clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
          menuMouseOutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(function (menuEl) {
            return function () {
              delete menuEl.dataset.dropdownMenuIsActive;
              _SingletonPanel["default"].close(menuEl.dataset.dropdownMenuPanelIndex);
            };
          }(menuEl), 500);
        }
      }
    });

    // Mouse over un out eventi tikai uz tām menu, kurā menuHide="onmouseout"
    var menuMouseOutTimeout = {};
    // ---- CLOSE menu
    menuMouseEvents = {
      mouseout: function mouseout(menuEl) {
        //console.log('-    CL mouseout PANEL');

        if (menuEl.dataset.dropdownMenuHide != 'onmouseout') {
          return;
        }
        clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
        menuMouseOutTimeout[menuEl.dataset.dropdownMenuName] = setTimeout(function (menuEl) {
          return function () {
            delete menuEl.dataset.dropdownMenuIsActive;
            console.log('closeAllInactive 1');
            closeAllInactive();
          };
        }(menuEl), 500);
      },
      mouseover: function mouseover(menuEl) {
        //console.log('-    mouseover PANEL');

        clearTimeout(menuMouseOutTimeout[menuEl.dataset.dropdownMenuName]);
        menuEl.dataset.dropdownMenuIsActive = '';
      }
    };

    // Menu item click
    // ---- CLOSE menu
    (0, _domHelpers.on)('click', '[data-dropdown-menu-name] .menu-item', function (ev, menuItemEl) {
      // Ja ir jāatver cits menu, tad ignore close
      if ('dropdownMenuTrigger' in menuItemEl.dataset) {
        return;
      }

      /**
       * Lai paspēj izpildīties uz menu-item uzliktiem eventi
       * ja aizver pārāk ātri, tad pēc menuItemEl nevarēs
       * atrast open triggerEl
       * 50ms, vizuāli nevar pamanīt, ka ir aizture uz aizvēršanu
       * un šķiet, ka visi arī kaut kādi novēlotie eventi paspēs izpildīties
       */
      setTimeout(function () {
        var menuEl = findDropdownMenuByChild(menuItemEl);
        if (menuEl) {
          var triggerEl = menuOpenTriggers[menuEl.dataset.dropdownMenuName];
          if (!('dropdownMenuHide' in triggerEl.dataset)) {
            return;
          }

          // Aizveram visu menu stack
          var closeStack = true;
          // Vai ir closeStack override
          if ('dropdownMenuCloseStack' in menuItemEl.dataset) {
            if (menuItemEl.dataset.dropdownMenuCloseStack == 'false') {
              closeStack = false;
            }
          }

          // Aizvera visas
          if (closeStack) {
            _SingletonPanel["default"].closeAll();
          }
          // aizver tikai sevi
          else {
            _this.close(menuEl);
          }
        }
      }, 50);
    });

    /**
     * Close on outside click
     * šis ir timeout, šo novāks focusout eventi
     * Sis ir tikai, ka lai aizvērtu tās menu, kuras nav aktīvas
     */
    var outsideMousedownTimeout;
    // Click outside menu. Close all panels stack
    // ---- CLOSE menu
    (0, _domHelpers.on)('mousedown', 'html', function (ev) {
      //console.log('-    CL mousedown html');

      // Ja nav atvērtu panels, tad neko nedarām
      if (_SingletonPanel["default"].getStack().length == 0) {
        return;
      }

      // Click ir menu elementā
      if ((0, _domHelpers.parent)(ev.target, '[data-dropdown-menu-name]')) {
        var menuEl = findDropdownMenuByChild(ev.target);
        /**
         * Aizveram visus menu virs tā, kurā notika click
         * te timeout nevajag, jo click notiek menu un te nostrādās arī focusout, gan uzreiz focusin
         * tas ir menu kurā notiek click neaizvērsies. Aizvērsies visi virs tā
         * savukārt ja notiek click uz html, tad menuEl saņems focusout
         */
        //console.log('SingletonPanel.closeAllAboveIndex', menuEl.dataset.dropdownMenuPanelIndex);
        _SingletonPanel["default"].closeAllAboveIndex(menuEl.dataset.dropdownMenuPanelIndex);
        return;
      }

      // Click ir open trigger elementā
      if ((0, _domHelpers.parent)(ev.target, '[data-dropdown-menu-trigger]')) {
        return;
      }
      outsideMousedownTimeout = setTimeout(function () {
        // aizveram visas atvērtās menu
        _SingletonPanel["default"].closeAll();
      }, 5);
    });

    // Set mouse events on not hidden menus
    (0, _domHelpers.qa)('[data-dropdown-menu-name]:not([hidden])').forEach(function (menuEl) {
      setMouseEvents(menuEl);
    });
  },
  /**
   * Aizveram DropdownMenu
   */
  close: function close(menuEl) {
    if (menuEl) {
      if (isDropdownMenuOpen(menuEl)) {
        // Atrkārtoti iefokusējam triggerEl
        if (menuOpenTriggers[menuEl.dataset.dropdownMenuName]) {
          menuOpenTriggers[menuEl.dataset.dropdownMenuName].focus();
        }
        _SingletonPanel["default"].close(menuEl.dataset.dropdownMenuPanelIndex);
      }
    }
  },
  closeByName: function closeByName(menuName) {
    this.close(findDropdownMenuByName(menuName));
  },
  closeByOpenTrigger: function closeByOpenTrigger(triggerEl) {
    for (var _i = 0, _Object$entries = Object.entries(menuOpenTriggers); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        menuName = _Object$entries$_i[0],
        openTriggerEl = _Object$entries$_i[1];
      if (openTriggerEl === triggerEl) {
        this.close(findDropdownMenuByName(menuName));
      }
    }
  },
  /**
   * Pēc padotā element atrodam dropdown menu, kurā tas atrodas
   */
  getByChild: function getByChild(childEl) {
    return findDropdownMenuByChild(childEl);
  },
  getByName: function getByName(name) {
    return findDropdownMenuByName(name);
  },
  getMenuEl: function getMenuEl(triggerEl) {
    return findDropdownMenuEl(triggerEl);
  },
  getOpenTrigger: function getOpenTrigger(menuEl) {
    return _getOpenTrigger(menuEl);
  },
  getOpenTriggerByChild: function getOpenTriggerByChild(childEl) {
    var dropdownMenuEl = findDropdownMenuByChild(childEl);
    if (dropdownMenuEl && isDropdownMenuOpen(dropdownMenuEl)) {
      return menuOpenTriggers[dropdownMenuEl.dataset.dropdownMenuName];
    }
  },
  ignoreFocusoutOnce: function ignoreFocusoutOnce(menuEl) {
    menuEl.dataset.dropdownIgnoreFocusoutOnce = '';
  },
  onOpen: function onOpen(menuName, cb) {
    if (typeof onOpenListeners[menuName] == 'undefined') {
      onOpenListeners[menuName] = new _Listeners["default"]();
    }
    onOpenListeners[menuName].listen(cb);
  },
  onClose: function onClose(menuName, cb) {
    if (typeof onCloseListeners[menuName] == 'undefined') {
      onCloseListeners[menuName] = new _Listeners["default"]();
    }
    onCloseListeners[menuName].listen(cb);
  },
  onOpenAny: function onOpenAny(cb) {
    if (typeof onOpenListeners['__any__'] == 'undefined') {
      onOpenListeners['__any__'] = new _Listeners["default"]();
    }
    onOpenListeners['__any__'].listen(cb);
  },
  onCloseAny: function onCloseAny(cb) {
    if (typeof onCloseListeners['__any__'] == 'undefined') {
      onCloseListeners['__any__'] = new _Listeners["default"]();
    }
    onCloseListeners['__any__'].listen(cb);
  }
};

},{"./ButtonDelete":124,"./ButtonPost":127,"./SingletonPanel":143,"./helpers/Listeners":160,"dom-helpers":70}],131:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _calendar = _interopRequireDefault(require("calendar"));
var _weekDayToText = _interopRequireDefault(require("./calendar/weekDayToText"));
var _dateCaptionFormatter = _interopRequireDefault(require("./calendar/dateCaptionFormatter"));
var _navPrevFormatter = _interopRequireDefault(require("./calendar/navPrevFormatter"));
var _navNextFormatter = _interopRequireDefault(require("./calendar/navNextFormatter"));
var _monthDayFormatter = _interopRequireDefault(require("./calendar/monthDayFormatter"));
var _getDateFromReference = _interopRequireDefault(require("./calendar/getDateFromReference"));
var _getJsonFromHtml = _interopRequireDefault(require("./helpers/getJsonFromHtml"));
var _clampDate = _interopRequireDefault(require("./calendar/clampDate"));
var _formatDate = _interopRequireDefault(require("./calendar/formatDate"));
var _DropdownMenu = _interopRequireDefault(require("./DropdownMenu"));
var _InputValuePreview = _interopRequireDefault(require("./InputValuePreview"));
var _stringToDate = _interopRequireDefault(require("./calendar/stringToDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var calendar;
var container;
var activeField;
var activeMenu;
function createCalendar(date) {
  return new _calendar["default"].dom(date, {
    //cssprefix: '',
    view: 'month',
    count: 1,
    showWeekdays: true,
    showDateSwitch: true,
    showToday: true,
    // Vai ļaut klikšķināt uz prev/next month datumiem
    disablePrevMonthDate: true,
    disableNextMonthDate: true,
    // pazīme, ka jāļauj atzīmēt period
    // selectPeriod: true,
    // selectedPeriod: {
    //     from: new Date('2023-05-10 00:00:00'),
    //     till: new Date('2023-05-22 23:59:59')
    // },
    monthDayFormatter: _monthDayFormatter["default"],
    weekDayToText: _weekDayToText["default"],
    dateCaptionFormatter: _dateCaptionFormatter["default"],
    navPrevFormatter: _navPrevFormatter["default"],
    navNextFormatter: _navNextFormatter["default"]
  });
}

/**
 * Ja nav izveidoti container un calendar, tad tos izveido
 */
function maybeCreateContainerAndCalendar() {
  if (!container) {
    container = (0, _domHelpers.q)('[data-field-date-calendar-container]');
  }
  if (!calendar) {
    calendar = createCalendar(new Date());
    /**
     * Tieši, kad lietotājs izvēlējies datumu
     * tāpēc te nav change, bet ir dateclick
     */
    calendar.on('dateclick', dateSelected);
    (0, _domHelpers.replaceContent)(container, calendar.getEl());
  }
}
function dateSelected(date) {
  if (!activeField) {
    return;
  }
  setDate(activeField, date);
  setPlaceholder(activeField, date);
  _DropdownMenu["default"].close(activeMenu);
}
function setupCalendar(field) {
  maybeCreateContainerAndCalendar();

  // timeout vajadzīgs, jo kalendārs vēl nav paspējis pilnībā izveidoties un setStateUrl būs error
  setTimeout(function () {
    // Default date state
    calendar.setDefaultDateState((0, _getJsonFromHtml["default"])((0, _domHelpers.parent)(activeField, '.field-date'), 'default-date-state'));
    // State
    calendar.setState((0, _getJsonFromHtml["default"])((0, _domHelpers.parent)(activeField, '.field-date'), 'state'));

    // State url
    calendar.setStateUrl(field.dataset.stateUrl ? field.dataset.stateUrl : '');
    calendar.setDate(new Date());

    // Min max date
    calendar.setMinDate(field.dataset.minDate);
    calendar.setMaxDate(field.dataset.maxDate);

    // Current date
    calendar.setSelectedDate(activeField.value);
    calendar.scrollFirstAvailableDateIntoViewport();
  }, 10);
}
function validateFieldValue(inputFieldEl) {
  // ja nav vērtības ko validēt, tad bail
  if (!inputFieldEl.value) {
    return;
  }
  var clampedDate = (0, _clampDate["default"])(inputFieldEl.value, inputFieldEl.dataset.minDate, inputFieldEl.dataset.maxDate);
  if (_formatDate["default"].ymd(clampedDate) != inputFieldEl.value) {
    setDate(inputFieldEl, clampedDate);
  }
}
function setDate(inputFieldEl, date) {
  inputFieldEl.value = _formatDate["default"].ymd(date);
  (0, _domHelpers.dispatchEvent)(inputFieldEl, 'change');
}
function setPlaceholder(inputFieldEl, date) {
  _InputValuePreview["default"].setPlaceholder(inputFieldEl,
  // Formatēta date value
  date ? _formatDate["default"].Mdy(date) : '');
}
var _default = exports["default"] = {
  init: function init() {
    _DropdownMenu["default"].onOpen('field-date-calendar', function (menuEl, triggerEl) {
      setupCalendar(triggerEl);
      activeField = triggerEl;
      activeMenu = menuEl;
    });
    _DropdownMenu["default"].onClose('field-date-calendar', function (menuEl, triggerEl) {
      activeField = null;
      activeMenu = null;
    });

    /**
     * Visiem field-date uzstādām min|max date no
     * reference lauka. Klausāmies uz reference lauka izmaiņām,
     * lai uzsetotu atjaunoto min|max date
     * Validējam, lai lauka vērtība atbilstu min|max date
     *
     * Kad tiek atvērts kalendārs, tad min|max vērtības tiek
     * ņemtas no input lauka
     */
    (0, _domHelpers.qa)('.field-date').forEach(function (fieldDateEl) {
      var inputEl = (0, _domHelpers.q)(fieldDateEl, 'input');

      // Liekam data atribūtu min|max Date. Nolasām no related lauka
      inputEl.dataset.minDate = (0, _getDateFromReference["default"])(inputEl.dataset.minDate, function (minDate) {
        inputEl.dataset.minDate = minDate;
        validateFieldValue(inputEl);
      });
      inputEl.dataset.maxDate = (0, _getDateFromReference["default"])(inputEl.dataset.maxDate, function (maxDate) {
        inputEl.dataset.maxDate = maxDate;
        validateFieldValue(inputEl);
      });
      setPlaceholder(fieldDateEl, inputEl.value ? (0, _stringToDate["default"])(inputEl.value) : null);
    });
  },
  /**
   * TODO Varbūt vajag klausīties uz input lauka change
   * tad varētu tikai norītī lauku un pārējais viss tiktu izdarīts eventā
   */
  clear: function clear(fieldDateEl) {
    var inputEl = (0, _domHelpers.q)(fieldDateEl, 'input');
    inputEl.value = '';
    setPlaceholder(fieldDateEl, null);
  }
};

},{"./DropdownMenu":130,"./InputValuePreview":138,"./calendar/clampDate":147,"./calendar/dateCaptionFormatter":148,"./calendar/formatDate":150,"./calendar/getDateFromReference":151,"./calendar/monthDayFormatter":153,"./calendar/navNextFormatter":154,"./calendar/navPrevFormatter":155,"./calendar/stringToDate":156,"./calendar/weekDayToText":157,"./helpers/getJsonFromHtml":163,"calendar":4,"dom-helpers":70}],132:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _DropdownMenu = _interopRequireDefault(require("./DropdownMenu"));
var _FieldHoursMinutes = _interopRequireDefault(require("./FieldHoursMinutes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function hoursMinutes(timeString) {
  return timeString.split(':').slice(0, 2).join(':');
}
function fieldDate(fieldEl) {
  return (0, _domHelpers.q)(fieldEl, '.field-date input');
}
function fieldTime(fieldEl) {
  return (0, _domHelpers.q)(fieldEl, '.field-increment input');
}
function fieldValue(fieldEl) {
  /**
   * Jāņem tieši tas input, kurš domāts priekš date-time vērtības
   * jo var būt arī citi input laiki. Piemēram, field-date
   */
  return (0, _domHelpers.q)(fieldEl, '[data-field-date-time-input]');
}
function updateValue(fieldEl, value) {
  if (typeof value == 'undefined') {
    value = fieldDate(fieldEl).value;
    var timeValue = fieldTime(fieldEl).value;
    if (!timeValue) {
      if (fieldEl.dataset.defaultTime) {
        timeValue = fieldEl.dataset.defaultTime;

        // Update time value
        fieldTime(fieldEl).value = timeValue;
      }
    }
    if (timeValue) {
      value += ' ' + fieldTime(fieldEl).value + ':00';
    }
  }
  fieldValue(fieldEl).value = value.trim();
  (0, _domHelpers.dispatchEvent)(fieldValue(fieldEl), 'change');
}
function displayValue(fieldEl) {
  var value = fieldValue(fieldEl).value;
  if (!value) {
    value = '';
  }
  var p = value.split(' ');
  fieldDate(fieldEl).value = p.length > 0 ? p[0] : '';
  fieldTime(fieldEl).value = p.length > 1 ? hoursMinutes(p[1]) : '';
}
var _default = exports["default"] = {
  init: function init() {
    // Date change
    (0, _domHelpers.change)('.field-date-time .field-date input', function (ev, el) {
      updateValue((0, _domHelpers.parent)(el, '.field-date-time'));
    });
    // Time change
    (0, _domHelpers.change)('.field-date-time .field-increment input', function (ev, el) {
      updateValue((0, _domHelpers.parent)(el, '.field-date-time'));
    });

    /**
     * Time picker panel eventi
     */
    // Atverot time picker paneli ieliek tajā time lauka vērtību
    _DropdownMenu["default"].onOpen('ui:timepicker-menu', function (menuEl, timeInputEl) {
      _FieldHoursMinutes["default"].setValue((0, _domHelpers.r)(menuEl).hoursMinutes, timeInputEl.value);
    });

    // Time picker apply poga
    (0, _domHelpers.click)('[data-timepicker-menu] [data-r="apply"]', function (ev, buttonEl) {
      var menuEl = _DropdownMenu["default"].getByChild(buttonEl);
      // time field no kura tika atvērts panelis
      var inputEl = _DropdownMenu["default"].getOpenTriggerByChild(buttonEl);
      inputEl.value = (0, _domHelpers.r)(menuEl).hoursMinutes.value;
      (0, _domHelpers.dispatchEvent)(inputEl, 'change');
      _DropdownMenu["default"].close(menuEl);
    });

    // Click on predefined hours
    (0, _domHelpers.click)('[data-timepicker-menu] [data-r="predefinedhour"]', function (ev, predefinedHourEl) {
      var menuEl = _DropdownMenu["default"].getByChild(predefinedHourEl);
      // time field no kura tika atvērts panelis
      var inputEl = _DropdownMenu["default"].getOpenTrigger(menuEl);
      inputEl.value = predefinedHourEl.dataset.value;
      (0, _domHelpers.dispatchEvent)(inputEl, 'change');
      _DropdownMenu["default"].close(menuEl);
      //FieldHoursMinutes.setValue(r(menuEl).hoursMinutes, predefinedHourEl.dataset.value)
    });
  },
  setValue: function setValue(fieldElOrInputEl, value) {
    var fieldEl = (0, _domHelpers.parent)(fieldElOrInputEl, '.field-date-time');
    updateValue(fieldEl, value);
    displayValue(fieldEl);
  },
  /**
   * Visiem date time laukiem atjaunojam display vērtības,
   * jo ir mainījušās hidden lauka vērtība
   */
  updateAll: function updateAll() {
    (0, _domHelpers.qa)('.field-date-time').forEach(function (fieldEl) {
      return displayValue(fieldEl);
    });
  }
};

},{"./DropdownMenu":130,"./FieldHoursMinutes":133,"dom-helpers":70}],133:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function updateValue(fieldEl, value) {
  if (typeof value == 'undefined') {
    var incrementFields = _toConsumableArray((0, _domHelpers.qa)(fieldEl, '.field-increment input'));
    value = incrementFields.at(0).value + ':' + incrementFields.at(1).value;
  }
  (0, _domHelpers.q)(fieldEl, 'input[type=hidden]').value = value;
}
function displayValue(fieldEl) {
  var value = (0, _domHelpers.q)(fieldEl, 'input[type=hidden]').value;
  if (!value) {
    value = '';
  }
  var p = value.split(':');
  var incrementFields = _toConsumableArray((0, _domHelpers.qa)(fieldEl, '.field-increment input'));
  if (p.length > 0) {
    incrementFields.at(0).value = p[0];
  }
  if (p.length > 1) {
    incrementFields.at(1).value = p[1];
  }
}
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.change)('.field-hours-minutes .field-increment input', function (ev, el) {
      updateValue((0, _domHelpers.parent)(el, '.field-hours-minutes'));
    });
    var t = 0;
    (0, _domHelpers.on)('keyup', '.field-hours-minutes .field-increment input', function (ev, el) {
      clearTimeout(t);
      t = setTimeout(function () {
        updateValue((0, _domHelpers.parent)(el, '.field-hours-minutes'));
      }, 200);
    });
  },
  setValue: function setValue(fieldElOrInputEl, value) {
    var fieldEl = (0, _domHelpers.parent)(fieldElOrInputEl, '.field-hours-minutes');
    updateValue(fieldEl, value);
    displayValue(fieldEl);
  }
};

},{"dom-helpers":70}],134:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function sp(s) {
  var padString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';
  var padLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  s = s + '';
  while (s.length < padLength) {
    s = padString + s;
  }
  return s;
}
function toInt(value) {
  var num = parseInt(value, 10);
  return isNaN(num) ? 0 : num;
}
function timeToInt(timeString) {
  var p = timeString.split(':');
  if (p.length > 1) {
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  var r = parseInt(timeString, 10);
  return isNaN(r) ? 0 : r;
}
function toTimeString(value) {
  var hours = Math.floor(value / 60);
  var minutes = value - hours * 60;
  return sp(hours) + ':' + sp(minutes);
}
function inc(fieldEl) {
  var c = getConfig(fieldEl);
  setValue(fieldEl, getValue(fieldEl) + c.step);
}
function dec(fieldEl) {
  var c = getConfig(fieldEl);
  setValue(fieldEl, getValue(fieldEl) - c.step);
}
function setValue(fieldEl, value) {
  var c = getConfig(fieldEl);

  // Validējam
  if (c.isMin && value < c.min) {
    value = c.min;
  }
  if (c.isMax && value > c.max) {
    value = c.max;
  }
  if (c.format == 'time') {
    (0, _domHelpers.q)(fieldEl, 'input').value = toTimeString(value);
  } else {
    if (c.padLeft) {
      value = sp(value, c.padLeft, c.padLeftLength);
    }
    (0, _domHelpers.q)(fieldEl, 'input').value = value;
  }
  (0, _domHelpers.dispatchEvent)((0, _domHelpers.q)(fieldEl, 'input'), 'change');
}
function getValue(fieldEl) {
  var c = getConfig(fieldEl);
  if (c.format == 'time') {
    return timeToInt((0, _domHelpers.q)(fieldEl, 'input').value);
  } else {
    return toInt((0, _domHelpers.q)(fieldEl, 'input').value);
  }
}
function getConfig(fieldEl) {
  var r = {
    format: fieldEl.dataset.format,
    isMin: 'min' in fieldEl.dataset,
    isMax: 'max' in fieldEl.dataset,
    min: '',
    max: '',
    step: parseInt(fieldEl.dataset.step, 10),
    padLeft: 'padLeft' in fieldEl.dataset ? fieldEl.dataset.padLeft : false,
    padLeftLength: 'padLeftLength' in fieldEl.dataset ? fieldEl.dataset.padLeftLength : false
  };
  if (r.isMin) {
    if (r.format == 'time') {
      r.min = timeToInt(fieldEl.dataset.min);
    } else {
      r.min = parseInt(fieldEl.dataset.min, 10);
    }
  }
  if (r.isMax) {
    if (r.format == 'time') {
      r.max = timeToInt(fieldEl.dataset.max);
    } else {
      r.max = parseInt(fieldEl.dataset.max, 10);
    }
  }
  return r;
}
var _default = exports["default"] = {
  init: function init() {
    var it = 0;
    (0, _domHelpers.clickp)('.field-increment [data-r="inc"]', function (ev, el) {
      clearInterval(it);
      inc((0, _domHelpers.parent)(el, '[data-is-container]'));
    });
    (0, _domHelpers.clickp)('.field-increment [data-r="dec"]', function (ev, el) {
      clearInterval(it);
      dec((0, _domHelpers.parent)(el, '[data-is-container]'));
    });
    (0, _domHelpers.on)('mousedown', '.field-increment [data-r="inc"]', function (ev, el) {
      var fieldEl = (0, _domHelpers.parent)(el, '[data-is-container]');
      it = setTimeout(function () {
        it = setInterval(function () {
          inc(fieldEl);
        }, 100);
      }, 450);
    });
    (0, _domHelpers.on)('mousedown', '.field-increment [data-r="dec"]', function (ev, el) {
      var fieldEl = (0, _domHelpers.parent)(el, '[data-is-container]');
      it = setTimeout(function () {
        it = setInterval(function () {
          dec(fieldEl);
        }, 100);
      }, 450);
    });
    (0, _domHelpers.on)('keydown', '.field-increment', function (ev, el) {
      // Prevent, lai kursors nelēkā
      switch (ev.key) {
        case 'ArrowUp':
          ev.preventDefault();
          inc((0, _domHelpers.parent)(el, '[data-is-container]'));
          break;
        case 'ArrowDown':
          ev.preventDefault();
          dec((0, _domHelpers.parent)(el, '[data-is-container]'));
          break;
      }
    });
  },
  getValue: function getValue(fieldElOrInputEl) {
    return (0, _domHelpers.q)((0, _domHelpers.parent)(fieldElOrInputEl, '.field-increment'), 'input').value;
  },
  setValue: function setValue(fieldElOrInputEl, value) {
    var fieldEl = (0, _domHelpers.parent)(fieldElOrInputEl, '.field-increment');
    (0, _domHelpers.q)(fieldEl, 'input').value = value;
  }
};

},{"dom-helpers":70}],135:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _OptionsPanel = _interopRequireDefault(require("./OptionsPanel"));
var _DropdownMenu = _interopRequireDefault(require("./DropdownMenu"));
var _InputValuePreview = _interopRequireDefault(require("./InputValuePreview"));
var _Form = _interopRequireDefault(require("./Form"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Field select uzliek izvēlēto option vizuālo vērtību
 */
function setOption(fieldEl, checkedOptionEl) {
  _InputValuePreview["default"].setPlaceholder(fieldEl,
  // Formatēta date value
  checkedOptionEl && checkedOptionEl.dataset.value ? checkedOptionEl.innerHTML : '');
}

/**
 * Ja ir norādīts options list id, tad meklējam pēc list id
 * ja nav, tad meklējam options elementu, kurš ir ielikts fieldEl
 */
function getOptionsEl(fieldEl) {
  return (0, _domHelpers.q)(_DropdownMenu["default"].getMenuEl((0, _domHelpers.q)(fieldEl, '[data-dropdown-menu-trigger]')), '.options');
}
function handleFieldValueChange(fieldEl) {
  var checkedOptionEl = _OptionsPanel["default"].findOptionByValue(getOptionsEl(fieldEl), (0, _domHelpers.q)(fieldEl, 'input').value);
  setOption(fieldEl, checkedOptionEl, {
    event: false
  });
}

/**
 * Taisto click uz form [type=submit] pogas, kad
 * notiek submit pazūd fokuss. Šajā mirklī aizvērsies
 * DropdownMenu, kurā ir forma. Tāpēc, ja forma ir
 * FieldSelect Dropdown menu, tad lieka, lai ignore focousOut
 */
function handleBeforeSubmit(formEl) {
  // Ja ir empty state elementā, tad skip
  if (!(0, _domHelpers.parent)(formEl, '[data-field-select-empty-state]')) {
    return;
  }
  _DropdownMenu["default"].ignoreFocusoutOnce(_DropdownMenu["default"].getByChild(formEl));
}

/**
 * Kad forma ir nosubmitota
 * tad vajag kaut kur iegūt value un valueVisual
 * value būs formā, laikā id (šitas konfigurējams)
 * valueVisual būs jāpieprasa no url
 */
function handleAfterSubmit(formEl, response) {
  // Ja ir empty state elementā, tad skip
  if (!(0, _domHelpers.parent)(formEl, '[data-field-select-empty-state]')) {
    return;
  }
  var openTriggerEl = _DropdownMenu["default"].getOpenTriggerByChild(formEl);
  var fieldEl = (0, _domHelpers.parent)(openTriggerEl, '.field-select');
  var valueFieldName = 'id';
  var value;

  /**
   * Šis ir gadījumā, ja ir noticis formEl replace
   * un ir ienākusi jauna form html, kurā ir id lauks
   */
  var valueFieldEl = (0, _domHelpers.q)(formEl, "[name=".concat(valueFieldName, "]"));
  if (valueFieldEl) {
    value = valueFieldEl.value;
  } else if (response && typeof response[valueFieldName] != 'undefined') {
    value = response[valueFieldName];
  }
  var inputEl = (0, _domHelpers.q)(fieldEl, 'input');
  inputEl.value = value;
  (0, _domHelpers.dispatchEvent)(inputEl, 'change');

  // ielādējam valueVisual html
  if ('valueVisualUrl' in fieldEl.dataset && value) {
    (0, _domHelpers.get)(fieldEl.dataset.valueVisualUrl, {
      value: value
    }).then(function (valueVisualHtml) {
      _InputValuePreview["default"].setPlaceholder(fieldEl,
      // Formatēta date value
      valueVisualHtml);

      // Liekam mazu delay, lai var redzēt success message, ja tāds ir
      setTimeout(function () {
        _DropdownMenu["default"].closeByOpenTrigger(openTriggerEl);
        _Form["default"].reset(formEl);
      }, 700);
    });
    return;
  }
  _DropdownMenu["default"].closeByOpenTrigger(openTriggerEl);
  _Form["default"].reset(formEl);
}
var _default = exports["default"] = {
  init: function init() {
    // Klausāmies uz From submit
    _Form["default"].onBeforeSubmit(function (formEl) {
      return handleBeforeSubmit(formEl);
    });
    _Form["default"].onAfterSubmit(handleAfterSubmit);

    // Kad nomainās input value, tad uzliekam atbilstošo vizuālo value
    (0, _domHelpers.on)('change', '.field-select input', function (ev, inputEl) {
      handleFieldValueChange((0, _domHelpers.parent)(inputEl, '.field-select'));
    });
    (0, _domHelpers.on)('keydown', '.field-select', function (ev, fieldEl) {
      var inputEl;
      switch (ev.key) {
        case 'Home':
          var firstOption = _OptionsPanel["default"].firstOption(getOptionsEl((0, _domHelpers.parent)(fieldEl, '.field-select')));
          inputEl = (0, _domHelpers.q)(fieldEl, 'input');
          inputEl.value = firstOption ? firstOption.dataset.value : '';
          (0, _domHelpers.dispatchEvent)(inputEl, 'change');
          break;
        case 'End':
          var lastOption = _OptionsPanel["default"].lastOption(getOptionsEl((0, _domHelpers.parent)(fieldEl, '.field-select')));
          inputEl = (0, _domHelpers.q)(fieldEl, 'input');
          inputEl.value = lastOption ? lastOption.dataset.value : '';
          (0, _domHelpers.dispatchEvent)(inputEl, 'change');
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          var nextOption = _OptionsPanel["default"].nextOption(getOptionsEl((0, _domHelpers.parent)(fieldEl, '.field-select')));
          inputEl = (0, _domHelpers.q)(fieldEl, 'input');
          inputEl.value = nextOption ? nextOption.dataset.value : '';
          (0, _domHelpers.dispatchEvent)(inputEl, 'change');
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          var prevOption = _OptionsPanel["default"].prevOption(getOptionsEl((0, _domHelpers.parent)(fieldEl, '.field-select')));
          inputEl = (0, _domHelpers.q)(fieldEl, 'input');
          inputEl.value = prevOption ? prevOption.dataset.value : '';
          (0, _domHelpers.dispatchEvent)(inputEl, 'change');
      }
    });

    // Field start values ielikšana
    (0, _domHelpers.qa)('.field-select').forEach(function (fieldEl) {
      // Ja ir manuāli uzstādīts value visual vērtība, tad skip
      if ('hasVisualValue' in fieldEl.dataset) {
        return;
      }
      handleFieldValueChange(fieldEl);
    });
  }
};

},{"./DropdownMenu":130,"./Form":137,"./InputValuePreview":138,"./OptionsPanel":140,"dom-helpers":70}],136:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _createVideoFromFile = _interopRequireDefault(require("./createVideoFromFile"));
var _createImageFromFile = _interopRequireDefault(require("./createImageFromFile"));
var _AspectRatio = _interopRequireDefault(require("./AspectRatio"));
var _Form = _interopRequireDefault(require("./Form"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function humanFileSize(size) {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return +(size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}
function getExtension(file) {
  var p = file.name.split('.');
  return p[p.length - 1];
}
function getFileType(file) {
  /**
   * Šis jātur sync ar Modles\File file_type attribute
   */
  switch (getExtension(file)) {
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'png':
    case 'svg':
    case 'tif':
    case 'tiff':
    case 'webp':
      return 'image';
    case 'zip':
    case 'bzip':
    case 'rar':
    case '7z':
    case 'gz':
    case 'tar':
    case 'bz2':
    case 'lz':
    case 'lz4':
      return 'archive';
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'odt':
    case 'ods':
    case 'ots':
    case 'fods':
    case 'htm':
    case 'html':
      return 'document';
    case 'mp3':
    case 'm4a':
    case 'wav':
    case 'falc':
      return 'audio';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'flv':
    case 'avchd':
      return 'video';
    default:
      return 'document';
  }
}
function isImage(file) {
  if (file.type.substring(0, 6) === 'image/') {
    return true;
  }
}
function isVideo(file) {
  if (file.type.substring(0, 6) === 'video/') {
    return true;
  }
}
function isVisualMedia(file) {
  return isImage(file) || isVideo(file);
}

/**
 * Vizuāli izvadām input[type=file] izvēlētos failus
 */
function outputSelectedFiles(fileUploadEl) {
  fileUploadEl = (0, _domHelpers.r)(fileUploadEl);
  var uploadPromises = [];

  // Izvēlētie faili
  for (var i = 0; i < fileUploadEl.inputFile.files.length; i++) {
    var file = fileUploadEl.inputFile.files[i];

    // Klonēja single file template
    var fileEl = (0, _domHelpers.r)((0, _domHelpers.clone)(fileUploadEl.singleFileTemplate));
    delete fileEl.dataset.r;

    /**
     * Input fails, kurā glabāsies file value tiks enabled,
     * tad, kad tas ir veiksmīgi uploaded. Arī, ja pievieno
     * un to nevar ielādēt, tad input el paliek disabled, lai
     * nepostējas tukša vērtība
     *
     * Tas tiek darīt, kad visas upload promises ir resolved
     */
    //fileEl.input.disabled = false;

    fileEl.dataset.fileType = getFileType(file);
    fileEl.dataset.state = 'ready';
    fileEl.fileName.innerHTML = file.name;
    fileEl.fileDescription.innerHTML = humanFileSize(file.size);
    (0, _domHelpers.append)(fileUploadEl.files, fileEl);
    uploadPromises.push(startFileUpload(fileEl, file, {
      delay: 400,
      uploadLink: fileUploadEl.dataset.link,
      valueField: fileUploadEl.dataset.valueField
    }));
  }
  if (uploadPromises.length > 0) {
    if ('setFromBusyWhileUploading' in fileUploadEl.dataset) {
      _Form["default"].setBusy((0, _domHelpers.parent)(fileUploadEl, 'form'));
      Promise.allSettled(uploadPromises).then(function (uploadPromises) {
        // Enable filename field, lai tas postējas
        uploadPromises.forEach(function (uploadPromise) {
          if (uploadPromise.status == 'fulfilled') {
            // value ir fileEl
            uploadPromise.value.input.disabled = false;
          }
        });
        _Form["default"].setNotBusy((0, _domHelpers.parent)(fileUploadEl, 'form'));
      });
    }
  }

  // Notīrām upload lauka vērtību, jo īstais upload glabājas katrā fileEl atseviški
  fileUploadEl.inputFile.value = '';
  // Tikko faili salikti noņemam state=empty
  fileUploadEl.dataset.state = '';
}
function removeFile(fileEl) {
  var fileUploadEl = (0, _domHelpers.r)((0, _domHelpers.parent)(fileEl, '[data-container="file-upload"]'));
  if ('previewImage' in fileEl.dataset) {
    fileEl.dataset.previewImage = '';
  }

  // Novācam file el
  (0, _domHelpers.remove)(fileEl);

  // Pārbaudām vai ir kāds single file
  if (!(0, _domHelpers.q)(fileUploadEl.files, '.file-upload-single-file')) {
    fileUploadEl.dataset.state = 'empty';
  }
}
function startFileUpload(fileEl, file, _ref) {
  var delay = _ref.delay,
    uploadLink = _ref.uploadLink,
    valueField = _ref.valueField;
  var preview = ('preview' in fileEl.dataset);
  if (preview) {
    fileEl.dataset.preview = 'ready';
    _AspectRatio["default"].setRatio(fileEl.preview, isVisualMedia(file) ? fileEl.dataset.previewAspectRatioDefaultVisualMedia : fileEl.dataset.previewAspectRatioDefault);
    if (isImage(file)) {
      // ieliekam preview no local bildes
      (0, _domHelpers.replaceContent)(fileEl.preview, (0, _createImageFromFile["default"])(file, {
        data: {
          r: 'image'
        }
      }));
    } else if (isVideo(file)) {
      // ieliekam preview no local bildes
      (0, _domHelpers.replaceContent)(fileEl.preview, (0, _createVideoFromFile["default"])(file, {
        data: {
          r: 'video'
        }
      }));
    } else {
      (0, _domHelpers.replaceContent)(fileEl.preview, getFileType(file) + ' (.' + getExtension(file) + ')');
    }
  }

  /**
   * Upload
   */
  fileEl = (0, _domHelpers.r)(fileEl);
  fileEl.dataset.state = 'uploading';
  var params = {
    value_field: valueField
  };
  if (preview && isVisualMedia(file)) {
    params.return_url = true;
  }
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      (0, _domHelpers.upload)(uploadLink, file, params,
      // Progress callback
      function (progress) {
        fileEl.indicator.style.width = progress + '%';
        fileEl.progress.innerHTML = progress + '%';
      }).then(function (response) {
        console.log('success');
        fileEl.input.value = response.value;
        fileEl.dataset.state = 'completed';
        if (preview) {
          if (isImage(file)) {
            console.log(fileEl.preview);
            fileEl.preview.image.src = response.url;
          }
        }
        resolve(fileEl);
      })["catch"](function (response) {
        console.log('error');
        fileEl.dataset.state = 'failed';
        fileEl.failedMessage.innerHTML = response.message;
        reject(fileEl);
      });
    }, delay);
  });
}
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.change)('.file-upload [type=file]', function (ev, el) {
      outputSelectedFiles((0, _domHelpers.parent)(el, '[data-container]'));
    });
    (0, _domHelpers.click)('.file-upload [data-r="button-remove"]', function (ev, el) {
      removeFile((0, _domHelpers.parent)(el, '[data-container]'));
    });
  }
};

},{"./AspectRatio":120,"./Form":137,"./createImageFromFile":158,"./createVideoFromFile":159,"dom-helpers":70}],137:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _Listeners = _interopRequireDefault(require("./helpers/Listeners"));
var _ButtonLoading = _interopRequireDefault(require("./ButtonLoading"));
var _ReplaceElWithNewHtmlIfNecessary = _interopRequireDefault(require("./helpers/ReplaceElWithNewHtmlIfNecessary"));
var _handleDropdownMenuHideFromEl = _interopRequireDefault(require("./helpers/handleDropdownMenuHideFromEl"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var onBeforeSubmitListeners = {};
var onAfterSubmitListeners = {};
var originalEl = [];

/**
 * Vai ir form aizvietotājs. Parasts div elements, kura jādarbojas līdzīgi kā form
 */
function isFormSubstitute(formEl) {
  if (!formEl.dataset) {
    return false;
  }
  return 'formSubstitute' in formEl.dataset;
}
function submitForm(formEl, url, method) {
  if (typeof url == 'undefined') {
    url = isFormSubstitute(formEl) ? formEl.dataset.action : formEl.action;
  }
  if (typeof method == 'undefined') {
    method = isFormSubstitute(formEl) ? formEl.dataset.method : formEl.method;
  }
  var formData = (0, _domHelpers.getFormData)(formEl);
  if ('clickedSubmitButtonName' in formEl.dataset) {
    formData[formEl.dataset.clickedSubmitButtonName] = formEl.dataset.clickedSubmitButtonValue;
  }

  /**
   * Jāpieliek error handling. Un te ir jāatgriež jauna Promise
   */
  return (0, _domHelpers.request)(method, url, formData).then(function (response) {
    return response.text();
  });
}

/**
 * Uzliek loading pogām loading, ja tām ir onsumit
 */
function setButtonLoadingOnSubmit(formEl) {
  (0, _domHelpers.qa)(formEl, 'button[data-loading="onsubmit"]').forEach(function (buttonEl) {
    _ButtonLoading["default"].loading(buttonEl);
  });
}
function setButtonIdleAfterSubmit(formEl) {
  (0, _domHelpers.qa)(formEl, 'button[data-loading="loading"]').forEach(function (buttonEl) {
    _ButtonLoading["default"].idle(buttonEl);
  });
}
function handleSubmit(formEl) {
  if ('isSubmitting' in formEl.dataset) {
    // Formā jau notiek submit
    return;
  }
  formEl.dataset.isSubmitting = '';

  /**
   * Šitas dublējas ar submit('form')
   * bet šo vajag, ja notiek form submit caur API
   * Pa lielam nekas, ja divreiz uzliks pogai loading.
   * Vienkrāši fetchSubmit gadījumā dublēsies
   */
  setButtonLoadingOnSubmit(formEl);
  if (onBeforeSubmitListeners['__any__']) {
    onBeforeSubmitListeners['__any__'].trigger([formEl]);
  }
  var elReplacer = new _ReplaceElWithNewHtmlIfNecessary["default"](formEl);

  /**
   * Nevar likt pirms ReplaceElWithNewHtmlIfNecessary, jo tad
   * dropdownmenu ir aizvēries un vairs nevar atrast openTriggerEl
   */
  (0, _handleDropdownMenuHideFromEl["default"])(formEl, 'onsubmit');
  return new Promise(function (resolve, reject) {
    submitForm(formEl).then(function (r) {
      var originalElId = formEl.dataset.originalElId;
      var newFormEl = elReplacer.replace(r);
      if (newFormEl) {
        if (typeof newFormEl.dataset != 'undefined') {
          newFormEl.dataset.originalElId = originalElId;
        }
        formEl = newFormEl;
      }
      setButtonIdleAfterSubmit(formEl);
      if (onAfterSubmitListeners['__any__']) {
        onAfterSubmitListeners['__any__'].trigger([formEl, r]);
      }
      delete formEl.dataset.isSubmitting;
      (0, _handleDropdownMenuHideFromEl["default"])(formEl, 'aftersubmit');
      if ('resetFormAfterSubmit' in formEl.dataset) {
        _reset(formEl);
      }

      // Ja ir ienākušas jaunas formas, kurām vajag uzstādīt setTimeout
      setTimeoutsForFormsWithSubmitAfterMs();
      resolve();
    });
  });
}
function saveOriginalEl(formEl) {
  if ('originalElId' in formEl.dataset) {
    return;
  }
  var clonedFormEl = (0, _domHelpers.clone)(formEl);
  var i = originalEl.push(clonedFormEl);
  clonedFormEl.dataset.originalElId = i - 1;
  formEl.dataset.originalElId = i - 1;
  return formEl.dataset.originalElId;
}
function _reset(formEl) {
  if (!('originalElId' in formEl.dataset)) {
    return;
  }
  formEl = (0, _domHelpers.replace)(formEl, (0, _domHelpers.clone)(originalEl[formEl.dataset.originalElId]));
  var buttonEl = (0, _domHelpers.q)(formEl, '[type=submit]');
  if (buttonEl) {
    _ButtonLoading["default"].idle(buttonEl);
  }
  return formEl;
}
function _setBusy(formEl) {
  var buttonEl = (0, _domHelpers.q)(formEl, '[type=submit]');
  if (buttonEl) {
    _ButtonLoading["default"].loading(buttonEl);
  }
}
function _setNotBusy(formEl) {
  var buttonEl = (0, _domHelpers.q)(formEl, '[type=submit]');
  if (buttonEl) {
    _ButtonLoading["default"].idle(buttonEl);
  }
}

/**
 * Atrodam formas, kuras vajag submit pēc norādītā laika
 */
function setTimeoutsForFormsWithSubmitAfterMs() {
  (0, _domHelpers.qa)('[data-submit-form-after-ms]').forEach(function (formEl) {
    // Ja ir jau uzlikts timeout, tad skip
    if ('submitTimeoutSet' in formEl.dataset) {
      return;
    }
    var timeoutMs = parseInt(formEl.dataset.submitFormAfterMs, 10);
    if (timeoutMs) {
      // Pazīme, ka timeout jau ir uzlikts
      formEl.dataset.submitTimeoutSet = '';
      // Pieglabājam timeout, lai var atcelt
      formEl.dataset.submitFormAfterTimeout = setTimeout(function () {
        handleSubmit(formEl);
        delete formEl.dataset.submitFormAfterTimeout;
      }, timeoutMs);
    }
  });
}
function handleDropdownMenuHide(formEl, eventName) {
  if (!('menuHide' in formEl.dataset)) {
    return;
  }
  if (formEl.dataset.menuHide == eventName) {
    var menuEl = DropdownMenu.getByChild(formEl);
    if (menuEl) {
      DropdownMenu.close(menuEl);
    }
  }
}
var _default = exports["default"] = {
  init: function init() {
    // Tikai priekš button[data-loading="submit"]
    (0, _domHelpers.submit)('form', function (ev, formEl) {
      return setButtonLoadingOnSubmit(formEl);
    });

    /**
     * Submit buttons with name
     * Ja ir vairākas submit pogas ar vienādiem name,
     * tad vajag submitot to button value, kura tika click
     */
    (0, _domHelpers.click)('form[data-fetch-submit] [type=submit][name]', function (ev, buttonSubmitEl) {
      var formEl = (0, _domHelpers.parent)(buttonSubmitEl, 'form');
      delete formEl.dataset.clickedSubmitButtonName;
      delete formEl.dataset.clickedSubmitButtonValue;

      // Uzliekam formai, nospiestās submit pogas name un value
      if (buttonSubmitEl.name) {
        formEl.dataset.clickedSubmitButtonName = buttonSubmitEl.name;
        formEl.dataset.clickedSubmitButtonValue = buttonSubmitEl.value;
      }
    });
    (0, _domHelpers.submitp)('form[data-fetch-submit]', function (ev, formEl) {
      handleSubmit(formEl);
    });

    // Save orginal content el
    (0, _domHelpers.qa)('form[data-fetch-submit][data-replace-html], form[data-reset-form-after-submit]').forEach(function (formEl) {
      saveOriginalEl(formEl);
    });
    setTimeoutsForFormsWithSubmitAfterMs();
  },
  submit: function submit(formEl) {
    return handleSubmit(formEl);
  },
  onBeforeSubmit: function onBeforeSubmit(cb) {
    if (typeof onBeforeSubmitListeners['__any__'] == 'undefined') {
      onBeforeSubmitListeners['__any__'] = new _Listeners["default"]();
    }
    onBeforeSubmitListeners['__any__'].listen(cb);
  },
  onAfterSubmit: function onAfterSubmit(cb) {
    if (typeof onAfterSubmitListeners['__any__'] == 'undefined') {
      onAfterSubmitListeners['__any__'] = new _Listeners["default"]();
    }
    onAfterSubmitListeners['__any__'].listen(cb);
  },
  /**
   * Atjauno formu atpakaļ uz sākuma stāvokli
   */
  reset: function reset(formEl) {
    if (!formEl) {
      return;
    }
    _reset(formEl);
  },
  /**
   * Uzstāda, ka form ir aizņemt un to nevar submitot
   */
  setBusy: function setBusy(formEl) {
    if (!formEl) {
      return;
    }
    _setBusy(formEl);
  },
  setNotBusy: function setNotBusy(formEl) {
    if (!formEl) {
      return;
    }
    _setNotBusy(formEl);
  }
};

},{"./ButtonLoading":126,"./helpers/Listeners":160,"./helpers/ReplaceElWithNewHtmlIfNecessary":161,"./helpers/handleDropdownMenuHideFromEl":164,"dom-helpers":70}],138:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
/**
 * Padot var vai nu .input-value-preview vai arī kādu no child elementiem
 */
function _setPlaceholder(childOrfieldEl, placeholder) {
  var fieldEl = (0, _domHelpers.parent)(childOrfieldEl, '.input-value-preview');
  var isEmpty = placeholder.trim() ? false : true;

  // vajadzīgs priekš css, lai var nostilot tukšo vērtību (placeholder)
  if (isEmpty) {
    fieldEl.dataset.isEmpty = '';
    placeholder = fieldEl.dataset.placeholder;
  } else {
    delete fieldEl.dataset.isEmpty;
  }
  (0, _domHelpers.q)(fieldEl, '[data-input-value-preview-placeholder]').innerHTML = placeholder;
}
var _default = exports["default"] = {
  setPlaceholder: function setPlaceholder(childOrfieldEl, placeholder) {
    _setPlaceholder(childOrfieldEl, placeholder);
  }
};

},{"dom-helpers":70}],139:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.clickp)('.layout [data-expand-menu]', function (ev, el) {
      (0, _domHelpers.parent)(el, '.layout').dataset.sidebarExpanded = '';
    });
    (0, _domHelpers.clickp)('.layout [data-contract-menu]', function (ev, el) {
      delete (0, _domHelpers.parent)(el, '.layout').dataset.sidebarExpanded;
    });
  }
};

},{"dom-helpers":70}],140:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _fuzzysearch = _interopRequireDefault(require("./helpers/fuzzysearch"));
var _DropdownMenu = _interopRequireDefault(require("./DropdownMenu"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function first(nodeList) {
  return nodeList.length > 0 ? nodeList[0] : null;
}
function last(nodeList) {
  return nodeList.length > 0 ? nodeList[nodeList.length - 1] : null;
}
function check(el) {
  if (el) {
    el.dataset.checked = '';
  }
  return el;
}
function uncheck(el) {
  if (el) {
    delete el.dataset.checked;
  }
  return el;
}
function getChecked(optionsEl) {
  return (0, _domHelpers.q)(optionsEl, '[data-options-list-option][data-checked]');
}
function _findOptionByValue(optionsEl, value) {
  return (0, _domHelpers.q)(optionsEl, "[data-options-list-option][data-value=\"".concat(value, "\"]"));
}
function _firstOption(optionsEl) {
  var currentOptionEl = getChecked(optionsEl, {
    ignoreHiden: true
  });
  var options = (0, _domHelpers.qa)(optionsEl, '[data-options-list-option]:not([hidden])');
  if (options.length > 0) {
    var firstEl = options[0];
    if (currentOptionEl) {
      uncheck(currentOptionEl);
    }
    var r = check(firstEl);
    scrollCheckedIntoViewport(optionsEl);
    return r;
  }
}
function _lastOption(optionsEl) {
  var currentOptionEl = getChecked(optionsEl, {
    ignoreHiden: true
  });
  var options = (0, _domHelpers.qa)(optionsEl, '[data-options-list-option]:not([hidden])');
  if (options.length > 0) {
    var lastEl = options[options.length - 1];
    if (currentOptionEl) {
      uncheck(currentOptionEl);
    }
    var r = check(lastEl);
    scrollCheckedIntoViewport(optionsEl);
    return r;
  }
}
function _nextOption(optionsEl) {
  var currentOptionEl = getChecked(optionsEl, {
    ignoreHiden: true
  });

  // Ja ir izfiltrēts
  if (currentOptionEl && currentOptionEl.hidden) {
    // uncheck
    uncheck(currentOptionEl);
    // un uzskatās, ka nav atrasts
    currentOptionEl = null;
  }
  if (currentOptionEl) {
    var nextEl = (0, _domHelpers.next)(currentOptionEl, '[data-options-list-option]:not([hidden])');
    if (nextEl) {
      uncheck(currentOptionEl);
      var r = check(nextEl);
      scrollCheckedIntoViewport(optionsEl);
      return r;
    } else {
      return currentOptionEl;
    }
  } else {
    var _r = check(first((0, _domHelpers.qa)(optionsEl, '[data-options-list-option]:not([hidden])')), optionsEl);
    scrollCheckedIntoViewport(optionsEl);
    return _r;
  }
}
function _prevOption(optionsEl) {
  var currentOptionEl = getChecked(optionsEl, {
    ignoreHiden: true
  });
  // Ja ir izfiltrēts
  if (currentOptionEl && currentOptionEl.hidden) {
    // uncheck
    uncheck(currentOptionEl);
    // un uzskatās, ka nav atrasts
    currentOptionEl = null;
  }
  if (currentOptionEl) {
    var prevEl = (0, _domHelpers.prev)(currentOptionEl, '[data-options-list-option]:not([hidden])');
    if (prevEl) {
      uncheck(currentOptionEl);
      var r = check(prevEl);
      scrollCheckedIntoViewport(optionsEl);
      return r;
    } else {
      return currentOptionEl;
    }
  } else {
    var _r2 = check(last((0, _domHelpers.qa)(optionsEl, '[data-options-list-option]:not([hidden])')));
    scrollCheckedIntoViewport(optionsEl);
    return _r2;
  }
}
function scrollCheckedIntoViewport(optionsEl) {
  var checkedEl = getChecked(optionsEl, {
    ignoreHiden: true
  });
  if (!checkedEl) {
    return;
  }
  var padding = 4;
  var listEl = (0, _domHelpers.q)(optionsEl, '[data-field-select-options-container]');
  var checkedElOffset = (0, _domHelpers.getOffset)(checkedEl);
  var checkedElDimensions = (0, _domHelpers.getOuterDimensions)(checkedEl);
  var listElOffset = (0, _domHelpers.getOffset)(listEl);
  var listElDimensions = (0, _domHelpers.getOuterDimensions)(listEl);
  var checkedElTopOffset = checkedElOffset.top - listElOffset.top;
  var checkedElBottomOffset = checkedElTopOffset + checkedElDimensions.height;

  // Iet ārpuse viewport uz augšu
  if (checkedElTopOffset < 0) {
    scrollViewportTo(optionsEl, listEl.scrollTop + checkedElTopOffset - padding);
  }
  // Iet ārpuse viewport uz leju
  else if (checkedElBottomOffset > listElDimensions.height) {
    scrollViewportTo(optionsEl, listEl.scrollTop + (checkedElBottomOffset - listElDimensions.height) + padding);
  }
}
function scrollViewportTo(optionsEl, top) {
  var listEl = (0, _domHelpers.q)(optionsEl, '[data-field-select-options-container]');
  listEl.scrollTo(0, top);
}
function filterOptionsByValue(optionsEl, value) {
  value = value.toLowerCase();

  // Ja ir sourceUrl
  if (optionsEl.dataset.sourceUrl) {
    loadOptionsFromUrl(optionsEl, optionsEl.dataset.sourceUrl, value);
  } else {
    (0, _domHelpers.qa)(optionsEl, '[data-options-list-option]').forEach(function (optionEl) {
      if (value) {
        if ((0, _fuzzysearch["default"])(value, optionEl.innerText.toLowerCase())) {
          optionEl.hidden = false;
        } else {
          optionEl.hidden = true;
        }
      } else {
        optionEl.hidden = false;
      }
    });
    // Set scroll top uz 0
    (0, _domHelpers.q)(optionsEl, '[role=list]').scrollTo(0, 0);
    updateState(optionsEl);
  }
}

/**
 * Kad options list atrodas Dropdown menu, tad
 * atrodam to un tā openTriggerEl
 * openTriggerEl būs tas, kurā ielikt izvēlēto options
 */
function findFieldValue(optionsEl) {
  return (0, _domHelpers.q)(_DropdownMenu["default"].getOpenTriggerByChild(optionsEl), 'input');
}
function setFieldValue(optionsEl, selectedOptionEl) {
  var fieldValue = findFieldValue(optionsEl);
  fieldValue.value = selectedOptionEl.dataset.value;
  (0, _domHelpers.dispatchEvent)(fieldValue, 'change');
}
function cleanUp(optionsEl, fieldValue) {
  var searchInputEl = (0, _domHelpers.q)(optionsEl, '[data-field-select-search-field]');
  if (searchInputEl) {
    searchInputEl.value = '';
    filterOptionsByValue(optionsEl, searchInputEl.value);
  }

  // Uncheck all
  (0, _domHelpers.qa)(optionsEl, '[data-options-list-option]').forEach(function (optionEl) {
    uncheck(optionEl);
  });

  // check by field value
  check(_findOptionByValue(optionsEl, (0, _domHelpers.q)(fieldValue, 'input').value));
}
function updateState(optionsEl) {
  // Pārbaudām vai ir options
  var state = '';

  // Notiek datu ielāde
  if ('isLoading' in optionsEl.dataset) {
    state = 'loading';
  } else if (!(0, _domHelpers.q)(optionsEl, '[data-options-list-option]:not([hidden])')) {
    state = 'empty';
  }
  optionsEl.dataset.state = state;
}
function loadOptionsFromUrl(optionsEl, url, searchQuery) {
  if (!url) {
    return;
  }

  // Scroll to top
  scrollViewportTo(optionsEl, 0);
  optionsEl.dataset.isLoading = '';
  updateState(optionsEl);
  var params = {};
  if (searchQuery) {
    params.q = searchQuery;
  }
  (0, _domHelpers.get)(url, params).then(function (html) {
    (0, _domHelpers.q)(optionsEl, '[role="list"]').innerHTML = html;
    // Set scroll top uz 0
    (0, _domHelpers.q)(optionsEl, '[role=list]').scrollTo(0, 0);

    // Meklējam vai ir pieejams pagination tieši priekš options list
    var paginationEl = (0, _domHelpers.q)(optionsEl, '[role="list"] [data-options-pagination]');
    if (paginationEl) {
      optionsEl.dataset.hasPagination = '';
      var paginationContainerEl = (0, _domHelpers.q)(optionsEl, '[data-field-select-pagination]');

      /**
       * Pagination bija fokusā. Kad notiek paginationEl replace, tad fokuss pazūd
       * un Dropdown menu gadījumā dropdown menu aizveras ciet, jo notika focusout
       * !šitas it kaut kāds fakaps, kuru īsti nesaprotu kā parezi būtu risināt
       * būtu, labi, ja fokusā paliku tas pats page, kurš bija pirms replace
       *
       * Pateiksim DropdownMenu, lai ignorē focusout
       */

      // Vai esam DropdownMenu
      var menuEl = _DropdownMenu["default"].getByChild(optionsEl);
      if (menuEl) {
        _DropdownMenu["default"].ignoreFocusoutOnce(menuEl);
      }

      /**
       * Vajag saprast, kurš no pagination linkiem ir fokusā,
       * lai var atjaunot fokusu tam pašam linkam
       * pēc tam, kad ir nomainīts paginationEl
       */
      var lastPaginationButtonName;
      if (document.activeElement && document.activeElement.dataset.paginationButtonName) {
        lastPaginationButtonName = document.activeElement.dataset.paginationButtonName;
      }
      (0, _domHelpers.replaceContent)(paginationContainerEl, paginationEl);

      // Atjaunojam fokusu
      if (lastPaginationButtonName) {
        var newPaginationButtonEl = (0, _domHelpers.q)(paginationEl, "[data-pagination-button-name=".concat(lastPaginationButtonName, "]"));
        if (newPaginationButtonEl) {
          newPaginationButtonEl.dataset.disableColorTransition = '';
          newPaginationButtonEl.focus();
          delete newPaginationButtonEl.dataset.disableColorTransition;
        }
      }
    } else {
      delete optionsEl.dataset.hasPagination;
    }
    delete optionsEl.dataset.isLoading;
    updateState(optionsEl);
    optionsEl.dataset.optionsLoaded = '';
  });
}
var _default = exports["default"] = {
  init: function init() {
    // Uzliek sākuma state
    (0, _domHelpers.qa)('.field-select .options').forEach(function (optionsEl) {
      // Ja ir datasource url un nav ielādēti, tad state liekam kā loading
      if ('sourceUrl' in optionsEl.dataset) {
        if (!('optionsIsLoaded' in optionsEl.dataset)) {
          optionsEl.dataset.isLoading = '';
        }
      }
      updateState(optionsEl);
    });

    /**
     * TODO Dropdown uz atvēršanu focus first input
     * tas lai search lauks tiktu uzreiz iefokusēts
     */

    /**
     * Klausāmies uz visiem dropdown menu close
     * apstrādājam tikai Options menu
     */
    _DropdownMenu["default"].onCloseAny(function (menuEl, fieldValue) {
      /**
       * TODO pārtaisīt Dropdown menu, lai visi properties ir
       * uz contentEl nevis floating-container
       * Tāpēc šeit ir quickfix, lai iegūtu īsto menu el
       */
      var contentEl = (0, _domHelpers.q)(menuEl, '[data-dropdown-menu-content-el]');
      if (!('fieldSelectOptionsMenu' in contentEl.dataset)) {
        return;
      }

      /**
       * Varbūt cleanup vajag izsaukt nevis uzreiz kad aizver, bet nedaudz vēlāk
       * Piemēram ir garš lapojam saraksts, kurā izvēlies vērtību. Saproti, ka
       * nepareizā, atver un saraksts ir notīrīts. Vajag atkal skrollēt un meklēt
       */
      cleanUp((0, _domHelpers.q)(contentEl, '.options'), fieldValue);
    });
    _DropdownMenu["default"].onOpenAny(function (menuEl, fieldValue) {
      /**
       * TODO pārtaisīt Dropdown menu, lai visi properties ir
       * uz contentEl nevis floating-container
       * Tāpēc šeit ir quickfix, lai iegūtu īsto menu el
       */
      var contentEl = (0, _domHelpers.q)(menuEl, '[data-dropdown-menu-content-el]');
      if (!('fieldSelectOptionsMenu' in contentEl.dataset)) {
        return;
      }
      var optionsEl = (0, _domHelpers.q)(contentEl, '.options');
      if (!optionsEl.dataset.sourceUrl) {
        return;
      }
      if ('optionsLoaded' in optionsEl.dataset) {
        return;
      }

      // Load items from sourceUrl
      loadOptionsFromUrl(optionsEl, optionsEl.dataset.sourceUrl);
    });
    (0, _domHelpers.on)('keydown', '.options', function (ev, optionsEl) {
      switch (ev.key) {
        case 'Enter':
          /**
           * TODO jāpārtaisa, lai Enter events nāktu tieši no Option
           * tas nozīmē, ka vajag options taisīt fokusējamus
           * pašlaik tie nav fokusējami. Aktīvais un nākošais/prev tiek
           * noteikts pēc css klases
           */

          // Ja ir search field, tad neveram ciet
          if ('fieldSelectSearchField' in ev.target.dataset) {
            return;
          }

          // Ja ir [data-field-select-pagination] neveram ciet
          if ((0, _domHelpers.parent)(ev.target, '[data-field-select-pagination]')) {
            return;
          }

          // Ja ir empty state elementā, tad skip
          if ((0, _domHelpers.parent)(ev.target, '[data-field-select-empty-state]')) {
            return;
          }
          _DropdownMenu["default"].close(_DropdownMenu["default"].getByChild(optionsEl));
          break;
        /**
         * TODO jauca ar search field home un end
         */
        case 'Home':
          if ('fieldSelectSearchField' in ev.target.dataset) {
            return;
          }
          ev.preventDefault();
          setFieldValue(optionsEl, _firstOption(optionsEl));
          break;
        case 'End':
          if ('fieldSelectSearchField' in ev.target.dataset) {
            return;
          }
          ev.preventDefault();
          setFieldValue(optionsEl, _lastOption(optionsEl));
          break;
        case 'ArrowDown':
          ev.preventDefault();
          (0, _domHelpers.q)(optionsEl, '[role=list]').focus();
          setFieldValue(optionsEl, _nextOption(optionsEl));
          break;
        case 'ArrowUp':
          ev.preventDefault();
          (0, _domHelpers.q)(optionsEl, '[role=list]').focus();
          setFieldValue(optionsEl, _prevOption(optionsEl));
          break;
      }

      /**
       * Novācam foksus no pagination pogas
       */
      switch (ev.key) {
        case 'Home':
        case 'End':
        case 'ArrowDown':
        case 'ArrowUp':
          if (document.activeElement) {
            /**
             * TODO tagad nevar iefokusēt .options, var tikai search field
             * varbūt, ka ir search field, tad to fokusēt
             * sanāk, ka tad, kad pāriet uz options list, tad no pagination
             * pazūd fokuss tas aiziet uz options kontrolēšanu (search + up down arrows)
             */
            // if (parent(document.activeElement, '[data-field-select-pagination]')) {
            //     optionsEl.focus();
            // }
          }
      }
    });

    // Filtrēšana
    var prevSearchFieldValue = '';
    (0, _domHelpers.on)('keyup', '.options [data-field-select-search-field]', function (ev, inputEl) {
      // Ignorējam
      switch (ev.key) {
        case 'Enter':
        case 'ArrowUp':
        case 'ArrowDown':
          return;
      }
      var optionsEl = (0, _domHelpers.parent)(inputEl, '.options');
      if ('ignoreFirstKeyup' in optionsEl.dataset) {
        delete optionsEl.dataset.ignoreFirstKeyup;
      } else {
        if (prevSearchFieldValue != inputEl.value) {
          prevSearchFieldValue = inputEl.value;
          filterOptionsByValue(optionsEl, inputEl.value);
        }
      }
    });

    // Pagination
    (0, _domHelpers.clickp)('.options [data-field-select-pagination] a', function (ev, linkEl) {
      var optionsEl = (0, _domHelpers.parent)(linkEl, '.options');
      loadOptionsFromUrl(optionsEl, linkEl.href);
    });

    // Options click
    (0, _domHelpers.clickp)('.options [data-options-list-option]', function (ev, optionEl) {
      var optionsEl = (0, _domHelpers.parent)(optionEl, '.options');
      var currentOptionEl = getChecked(optionsEl);
      uncheck(currentOptionEl);
      check(optionEl);
      setFieldValue(optionsEl, optionEl);

      // aizvērsies, jo options ir kā menu-item un Dropdown tādus uz click aizver
    });
  },
  findOptionByValue: function findOptionByValue(optionsEl, value) {
    return _findOptionByValue(optionsEl, value);
  },
  nextOption: function nextOption(optionsEl) {
    return _nextOption(optionsEl);
  },
  prevOption: function prevOption(optionsEl) {
    return _prevOption(optionsEl);
  },
  firstOption: function firstOption(optionsEl) {
    return _firstOption(optionsEl);
  },
  lastOption: function lastOption(optionsEl) {
    return _lastOption(optionsEl);
  }
};

},{"./DropdownMenu":130,"./helpers/fuzzysearch":162,"dom-helpers":70}],141:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function setValue(progressBarEl, progress) {
  progressBarEl = (0, _domHelpers.r)(progressBarEl);
  (0, _domHelpers.addStyle)(progressBarEl.indicator, {
    width: progress + '%'
  });
}
var _default = exports["default"] = {
  init: function init() {},
  setValue: setValue
};

},{"dom-helpers":70}],142:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function isButtonSelected(radioButtonEl) {
  return (0, _domHelpers.q)(radioButtonEl, 'input').checked;
}

/**
 * Saliekam css klases pēc button state
 */
function setCheckedAndUnchecked(radioButtonsEl) {
  (0, _domHelpers.qa)(radioButtonsEl, '[data-role="radio-button"]').forEach(function (el) {
    if (isButtonSelected(el)) {
      (0, _domHelpers.removeClass)(el, el.dataset["class"]);
      (0, _domHelpers.addClass)(el, el.dataset.classSelected);
    } else {
      (0, _domHelpers.removeClass)(el, el.dataset.classSelected);
      (0, _domHelpers.addClass)(el, el.dataset["class"]);
    }
  });
}
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.change)('.radio-buttons [type="radio"]', function (ev, inputEl) {
      setCheckedAndUnchecked((0, _domHelpers.parent)(inputEl, '[data-is-container]'));
    });
  },
  update: function update(inputRadioElOrRadioButtonsEl) {
    setCheckedAndUnchecked((0, _domHelpers.parent)(inputRadioElOrRadioButtonsEl, '.radio-buttons'));
  }
};

},{"dom-helpers":70}],143:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
/**
 * Vairāki containers pēc hierarhijas
 * pirmai atvērtais būs 0, otrais 1 utt
 */
var containers = [];

/**
 * Var tik atvērti stacked paneļi
 * no viena panel var atvērt nākošo
 * Piemēram, dropdown, kurā ir date lauks
 * data atvērs jaunu paneli, kurā būs kalendārs
 */
/**
 * onContentElRemoveCb
 * Callback, kuru izsauc, kad iepriekšējais contentEl tiek
 * izvākts no container. Tas notiek, kad tiek ielikts cits
 * contentEl
 */
var panelsStack = [
  // {
  //     contentEl
  //     onContentElRemoveCb
  //     closeTimeout - timeout kuru uzliek aizvēršana, lai to var atcelt uz mouseover vai focusin
  //     mouseoutCloseDelay - delay pēc kāda close, ja ir mouseout
  //     focusoutCloseDelay
  // }
];
function parseDirection(dir) {
  if (!dir) {
    dir = 'right bottom';
  }
  var dirParts = dir.split(' ');
  return {
    x: dirParts[0],
    y: dirParts[1]
  };
}

/**
 * Main goal ir pozicionēt neizmantojot panelī
 * ieliktā elementa (getContentEl(panelIndex)) dimensions
 */
function positionByEl(panelIndex, positionEl, positionElDir, x, y, dir, xOffset, yOffset) {
  var windowDimensions = (0, _domHelpers.getWindowDimensions)();
  xOffset = parseInt(xOffset, 10);
  if (isNaN(xOffset)) {
    xOffset = 0;
  }
  yOffset = parseInt(yOffset, 10);
  if (isNaN(yOffset)) {
    yOffset = 0;
  }
  var pos = {
    x: x ? x : 0,
    y: y ? y : 0
  };

  // Elements pret kuru noteikt pos.x un pos.y
  // šis overraid padotos x un y
  if (positionEl) {
    var positionElPosition;
    var positionElDimensions;
    if (positionEl == 'viewport') {
      positionElPosition = {
        top: 0,
        left: 0
      };
      positionElDimensions = {
        width: windowDimensions.width,
        height: windowDimensions.height
      };
    } else {
      positionElPosition = (0, _domHelpers.getOffset)(positionEl);
      positionElDimensions = (0, _domHelpers.getOuterDimensions)(positionEl);
    }
    pos.x = positionElPosition.left;
    pos.y = positionElPosition.top;

    // Position el stūris pēc kura noteikt pos.x un pos.y
    positionElDir = parseDirection(positionElDir);
    if (positionElDir.x == 'right') {
      pos.x += positionElDimensions.width;
    }
    if (positionElDir.y == 'bottom') {
      pos.y += positionElDimensions.height;
    }
  }

  // Pieliekam offset
  pos.x += xOffset;
  pos.y += yOffset;

  /**
   * Atkarībā no direction vajag konvertēt pos.x un pos.y uz
   * css top left bottom right
   *
   * Ja x virziens ir left, tad pos.x ir jākonvertē uz css right
   * Ja y virziens ir top, tad pos.y ir jākonvertē uz css bottom
   */
  dir = parseDirection(dir);
  if (dir.x == 'left') {
    pos.x = windowDimensions.width - pos.x;
  }
  if (dir.y == 'top') {
    pos.y = windowDimensions.height - pos.y;
  }
  var css = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  if (dir.x == 'left') {
    css.right = pos.x + 'px';
  }
  if (dir.x == 'right') {
    css.left = pos.x + 'px';
  }
  if (dir.y == 'top') {
    css.bottom = pos.y + 'px';
  }
  if (dir.y == 'bottom') {
    css.top = pos.y + 'px';
  }
  containers[panelIndex].dataset.dir = dir.x + dir.y;
  (0, _domHelpers.addStyle)(containers[panelIndex], css);
}

/**
 * Hierarhiski containers
 * index nāk no panelsStack masīva indeksa
 */
function createContainer(panelIndex) {
  if (typeof containers[panelIndex] == 'undefined') {
    containers[panelIndex] = _domHelpers.jsx.h("div", {
      "class": "overlay-container",
      hidden: true
    });
    (0, _domHelpers.append)('body', containers[panelIndex]);
  }
}
function removeContentEl(panelIndex) {
  var contentEl = getContentEl(panelIndex);
  if (!contentEl) {
    return;
  }
  if (!panelsStack[panelIndex].onContentElRemoveCb) {
    return;
  }
  panelsStack[panelIndex].onContentElRemoveCb(contentEl);
}

/**
 * Get panel content element
 */
function getContentEl(panelIndex) {
  return containers[panelIndex].firstChild;
}
function close(panel) {
  // console.log('PANEL CLOSE');
  // console.trace();

  containers[panel.panelIndex].hidden = true;
  removeContentEl(panel.panelIndex);
}
function closeByIndex(panelIndex) {
  /**
   * Šo nevar likt setTimeout,
   * jo tad uz jauna menu atvēršanu no esoša menu
   * sākumā nostrādā closeAllByIndex (visus virs menu)
   * un tad open. Bet tā kā šeit ir setTimeout, tad
   * open atvērs un šis uzreiz aizvērs
   */

  // visus sākot ar pirmo atrasto aizveram
  panelsStack.slice(panelIndex).forEach(function (panel) {
    close(panel);
  });

  // atstājam visus līdz pirmajam atrastajam
  panelsStack.splice(panelIndex);
}
var _default = exports["default"] = {
  /**
   * Show single instance panel
   */
  open: function open(contentEl) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      hide = _ref.hide,
      onContentElRemove = _ref.onContentElRemove,
      onOpen = _ref.onOpen,
      positionEl = _ref.positionEl,
      positionElDir = _ref.positionElDir,
      x = _ref.x,
      y = _ref.y,
      dir = _ref.dir,
      xOffset = _ref.xOffset,
      yOffset = _ref.yOffset;
    var panelIndex = panelsStack.push({
      hide: hide,
      contentEl: contentEl,
      onContentElRemoveCb: onContentElRemove,
      closeTimeout: 0,
      mouseoutCloseDelay: 400,
      focusoutCloseDelay: 50
    }) - 1;
    panelsStack[panelIndex].panelIndex = panelIndex;
    createContainer(panelIndex);
    removeContentEl(panelIndex);
    (0, _domHelpers.replaceContent)(containers[panelIndex], contentEl);

    // Ja nav timeout, tad var nepaspēt nolasīt content el dimensions
    setTimeout(function () {
      positionByEl(panelIndex, positionEl, positionElDir, x, y, dir, xOffset, yOffset);

      // Padaram redzamu
      containers[panelIndex].hidden = false;

      /**
       * Pārcēlu open callback šeit, lai tiešām ir tad, kad
       * menu ir atvērts.
       * Bija problēma, ka onOpen uzlika mouseover|out eventus uz menu
       * un tie nostrādāja, jo menu uz mirkli bija visā ekrāna platumā
       * un kursors tieši bija virs menu
       * Kad nopozicionējas, tad menu jau vairs nav zem kursors
       * Tagad eventi uzliekas, kad menu jau ir nopozicionēts
       */
      if (onOpen) {
        onOpen(contentEl, panelIndex);
      }
    });
    return panelIndex;
  },
  close: function close(panelIndex) {
    if (typeof panelIndex != 'undefined') {
      closeByIndex(panelIndex);
    }
  },
  closeAllAboveIndex: function closeAllAboveIndex(panelIndex) {
    panelIndex = parseInt(panelIndex, 10);
    closeByIndex(panelIndex + 1);
  },
  /**
   * Close all panels stack
   */
  closeAll: function closeAll() {
    if (panelsStack.length == 0) {
      return;
    }

    /**
     * Atrodam pēdējo panel, kuru nevar aizvērt
     *
     * sāks aizvērt visu no tā panel, kuri ir virs
     * panel, kuru nevar aizvērt
     */
    var indexOfPanelToClose = null;
    for (var i = panelsStack.length - 1; i >= 0; i--) {
      // Atrasts panel, kuru nevar aizvērt
      if (!panelsStack[i].hide) {
        break;
      }
      indexOfPanelToClose = i;
    }
    if (indexOfPanelToClose !== null) {
      closeByIndex(indexOfPanelToClose);
    }
  },
  hasChild: function hasChild(panelIndex) {
    panelIndex = parseInt(panelIndex, 10);
    var i = panelsStack.findIndex(function (panel) {
      return panel.panelIndex == panelIndex;
    });
    return i + 1 < panelsStack.length;
  },
  getParent: function getParent(panelIndex) {
    var i = panelsStack.findIndex(function (panel) {
      return panel.panelIndex == panelIndex;
    });
    if (i > 0) {
      return panelsStack[i - 1];
    }
    return null;
  },
  getStack: function getStack() {
    return panelsStack;
  }
};

},{"dom-helpers":70}],144:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function _addRow(tableEl) {
  // Klonējam pēdējo row
  var lastTrEl = (0, _domHelpers.q)(tableEl, 'tbody tr:last-child');

  // Ja tabulā nav datu, tad nebūs nevienas īstās row ko klonēt
  // tāpēc tukšā tabulā vienmēr būs hidden tukša rinda, to tad šajā
  // mirklī padaram redzamu
  if ('tableBlankRow' in lastTrEl.dataset) {
    lastTrEl.hidden = false;
    delete lastTrEl.dataset.tableBlankRow;
    return lastTrEl;
  }
  var newRow = (0, _domHelpers.clone)(lastTrEl);

  // clean up values in input fields
  (0, _domHelpers.clearFormData)(newRow);

  /**
   * Clear select field placeholders
   * TODO kaut kā vajag, lai automātiski notīrās
   */
  (0, _domHelpers.qa)(newRow, '.select-placeholder span').forEach(function (selectPlaceholderEl) {
    return selectPlaceholderEl.innerHTML = '';
  });
  newRow = (0, _domHelpers.append)((0, _domHelpers.q)(tableEl, 'tbody'), newRow);
  setRowInputFieldsNames(tableEl, newRow);
  syncCheckAllRowsCheckbox(tableEl);
  return newRow;
}

/**
 * Rindas input elementiem uzstāda atbilstošo name, lai tiktu
 * ņemts vērā tabla name un sectionRowIndex
 *
 * šāda struktūra name
 * tablename[sectionRowIndex][columnname]
 *
 * doma tāda, lai postējot servera pusē var nolasīt lauku pēc
 * table name un serera pusē būtu masīvs ar visām tabulas rindām
 */
function setRowInputFieldsNames(tableEl, trEl) {
  // sectionRowIndex jo tas ir relatīvs pret tbody
  var rowIndex = trEl.sectionRowIndex;
  (0, _domHelpers.qa)(trEl, 'td').forEach(function (tdEl) {
    // Dēļ trackDeleted vienā td var būt vairāki input elementi
    (0, _domHelpers.qa)(tdEl, 'input, select, textarea').forEach(function (inputEl) {
      // Speciāls gadījums. Deleted rows tracking field
      if ('trackDeleted' in inputEl.dataset) {
        // tam kā name izmanotjam inputEl.dataset.trackDeleted
        inputEl.name = tableEl.dataset.name + '[' + rowIndex + '][' + inputEl.dataset.trackDeleted + ']';
      } else {
        inputEl.name = tableEl.dataset.name + '[' + rowIndex + '][' + tdEl.dataset.name + ']';
      }
    });
  });
}
function _deleteRow(trEl) {
  var tableEl = (0, _domHelpers.parent)(trEl, '.table');
  var idFieldName = tableEl.dataset.name + '[' + trEl.sectionRowIndex + '][id]';

  // Track deleted darbojas tikai kopā ar id
  if ('trackDeleted' in tableEl.dataset && (0, _domHelpers.value)(trEl, idFieldName)) {
    trEl.hidden = true;
    (0, _domHelpers.append)(
    // Liekam id kolonnā, jo tā vienmēr tiks ielikta
    // ja automātiski, tad tā būs hidden
    (0, _domHelpers.q)(trEl, 'td[data-name=id]'), (0, _domHelpers.ce)('input', {
      type: 'hidden',
      // hvz vai vajag value, jo null vērtība arī submitojas. Varbūt vienkāršāk servera pusē būs pārbaudīt
      value: tableEl.dataset.trackDeleted,
      data: {
        trackDeleted: tableEl.dataset.trackDeleted
      }
    }));
  } else {
    (0, _domHelpers.remove)(trEl);
  }

  // dzēšot row vajag visām rindā atjaunot input names, lai ir secīgi pēc ar rindu index
  (0, _domHelpers.qa)('tbody tr').forEach(function (trEl) {
    return setRowInputFieldsNames(tableEl, trEl);
  });
}
function _setRowsChecked(tableEl, checked) {
  (0, _domHelpers.qa)(tableEl, '[data-r="tableRowCheck"]').forEach(function (checkboxEl) {
    checkboxEl.checked = checked;
  });
}
function _getCheckedValues(tableEl) {
  var r = [];
  (0, _domHelpers.qa)(tableEl, '[data-r="tableRowCheck"]:checked').forEach(function (checkboxEl) {
    r.push(checkboxEl.value);
  });
  return r;
}
function syncCheckAllRowsCheckbox(tableEl) {
  var checkAllRowsCheckbox = (0, _domHelpers.q)(tableEl, 'thead [data-r="tableRowCheck"]');
  if (!checkAllRowsCheckbox) {
    return;
  }
  var allChecked = false;
  var rowCheckboxes = (0, _domHelpers.qa)(tableEl, 'tbody [data-r="tableRowCheck"]');
  if (rowCheckboxes.length > 0) {
    allChecked = true;
    for (var i = 0; i < rowCheckboxes.length; i++) {
      if (!rowCheckboxes[i].checked) {
        allChecked = false;
        break;
      }
    }
  }
  checkAllRowsCheckbox.checked = allChecked;
}
function focusFirstInput(trEl) {
  var inputEls = (0, _domHelpers.qa)(trEl, 'input, select, button');
  for (var i = 0; i < inputEls.length; i++) {
    if (inputEls[i].hidden) {
      continue;
    }
    if (inputEls[i].type == 'hidden') {
      continue;
    }
    // Skip row select checkbox
    if ((0, _domHelpers.parent)(inputEls[i], '[data-r="tableRowCheck"]', 'td')) {
      continue;
    }

    // focus first input
    inputEls[i].focus();
    return;
  }
}
function createLastFocusinEl() {
  return (0, _domHelpers.ce)('div', {
    data: {
      r: 'lastfocusouttrapdiv'
    },
    style: {
      width: '0px',
      height: '0px',
      overflow: 'hidden'
    }
  }, [(0, _domHelpers.ce)('input', {
    data: {
      r: 'lastfocusouttrap'
    }
  })]);
}
function addLastFocusinTrap(tableEl) {
  (0, _domHelpers.append)(tableEl, createLastFocusinEl());
}
var _default = exports["default"] = {
  init: function init() {
    /**
     * If last input element is being focused out, then add new row
     * and focus first input element in row
     *
     * * focusout eventā ir par vēlu likt jauno rindu un meģināt to fokusēt,
     * * jo ja table rindā tas ir pēdējais elements lapā, tad uz focusout
     * * fokuss aiziet kaut kur ārpus lapas un pēc tam vairs nevar dabūt
     * * fokusu atpakaļ uz jaunizveidoto rindu
     * * jauno rindu vajag ielikt laicīgi un noslēpt
     *
     * * taisam focusin trap input lauku, kurš kaut kā jāpadara neredzams un tam
     * * ir jābūt pašam pēdējām tabulā
     * * tikko, tas dabūt focusin, tā taisam jaunu rindu un foksuēja pirmo input
     *
     */
    (0, _domHelpers.on)('focusin', '.table [data-r="lastfocusouttrap"]', function (ev, el) {
      focusFirstInput(_addRow((0, _domHelpers.parent)(el, '.table')));
    });

    // Checkbox check/uncheck all table rows
    (0, _domHelpers.change)('.table thead [data-r="tableRowCheck"]', function (ev, el) {
      var tableEl = (0, _domHelpers.parent)(el, 'table');
      if (tableEl) {
        _setRowsChecked(tableEl, el.checked);
      }
    });
    (0, _domHelpers.change)('.table tbody [data-r="tableRowCheck"]', function (ev, el) {
      var tableEl = (0, _domHelpers.parent)(el, '.table');
      if (tableEl) {
        syncCheckAllRowsCheckbox(tableEl);
      }
    });
    (0, _domHelpers.qa)('.table').forEach(function (tableEl) {
      return addLastFocusinTrap(tableEl);
    });
  },
  /**
   * Add new row to table
   */
  addRow: function addRow(tableNameOrEl) {
    if (typeof tableNameOrEl == 'string') {
      tableNameOrEl = (0, _domHelpers.q)(".table[data-name=\"".concat(tableNameOrEl, "\"]"));
    }
    _addRow(tableNameOrEl);
  },
  deleteRow: function deleteRow(trEl) {
    _deleteRow(trEl);
  },
  setRowsChecked: function setRowsChecked(tableEl, checked) {
    _setRowsChecked(tableEl, checked);
  },
  getCheckedValues: function getCheckedValues(tableEl) {
    return _getCheckedValues(tableEl);
  }
};

},{"dom-helpers":70}],145:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _Listeners = _interopRequireDefault(require("./helpers/Listeners"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var onChangeListeners = {};
function enableTabContent(tabContentEl) {
  if (!tabContentEl) {
    return;
  }
  tabContentEl.dataset.selected = '';
  setInputsDisabled(tabContentEl, false);
}
function disableTabContent(tabContentEl) {
  if (!tabContentEl) {
    return;
  }
  delete tabContentEl.dataset.selected;
  setInputsDisabled(tabContentEl, true);
}
function setInputsDisabled(tabContentEl, isDisabled) {
  if ('disableInputs' in tabContentEl.dataset) {
    (0, _domHelpers.qa)(tabContentEl, 'input, select, textarea').forEach(function (inputEl) {
      if (isDisabled) {
        inputEl.disabled = true;
      } else {
        // Liekam initial disabled state
        inputEl.disabled = inputEl.dataset.initialDisabledState == 'disabled';
      }
    });
  }
}
function changeTab(tabsEl, newTabName) {
  tabsEl.dataset.selected = newTabName;
  var selectedTabEl = null;
  // Meklējam visus tab-content, jo tab var arī nebūt. Tab var parslēgt caur api vai ar field-select
  (0, _domHelpers.qa)(tabsEl, '[data-role=tab-content]').forEach(function (tabContentEl) {
    var tabEl = (0, _domHelpers.q)(tabsEl, "[data-role=tab][data-tab-name=\"".concat(tabContentEl.dataset.tabName, "\"]"));
    if (tabContentEl.dataset.tabName == newTabName) {
      enableTabContent(tabContentEl);
      if (tabEl) {
        tabEl.dataset.selected = '';
        selectedTabEl = tabEl;
      }
    } else {
      disableTabContent(tabContentEl);
      if (tabEl) {
        delete tabEl.dataset.selected;
      }
    }
  });
  if ('name' in tabsEl.dataset) {
    if (typeof onChangeListeners[tabsEl.dataset.name] != 'undefined') {
      onChangeListeners[tabsEl.dataset.name].trigger([tabsEl.dataset.selected, selectedTabEl, tabsEl]);
    }
  }
}
var Tabs = {
  init: function init() {
    // Tabs switching by any control, which has data-tabs-switch attribute
    (0, _domHelpers.change)('[data-tabs-switch]', function (ev, fieldEl) {
      if (fieldEl.dataset.tabsSwitch) {
        changeTab((0, _domHelpers.q)(".tabs[data-name=".concat(fieldEl.dataset.tabsSwitch, "]")), fieldEl.value);
      } else {
        /**
         * TODO Jāapstrādā gadījums, kad lauks ir tabs elementā
         */
        return;
      }
    });
    // Tabs switching by tabs control
    (0, _domHelpers.click)('.tabs .tab', function (ev, selectedTabEl) {
      changeTab((0, _domHelpers.parent)(selectedTabEl, '.tabs'), selectedTabEl.dataset.tabName);
    });

    // Uzliekam input laukiem initial disabled state
    (0, _domHelpers.qa)('[data-role=tab-content][data-disable-inputs]').forEach(function (tabContentEl) {
      (0, _domHelpers.qa)(tabContentEl, 'input').forEach(function (inputEl) {
        inputEl.dataset.initialDisabledState = inputEl.disabled ? 'disabled' : 'enabled';
      });
    });

    // Disable inactive tabs
    (0, _domHelpers.qa)('[data-role=tab-content][data-disable-inputs]').forEach(function (tabContentEl) {
      if ('selected' in tabContentEl.dataset) {
        enableTabContent(tabContentEl);
      } else {
        disableTabContent(tabContentEl);
      }
    });
  },
  onChange: function onChange(tabsName, cb) {
    if (typeof onChangeListeners[tabsName] == 'undefined') {
      onChangeListeners[tabsName] = new _Listeners["default"]();
    }
    onChangeListeners[tabsName].listen(cb);
  }
};
var _default = exports["default"] = Tabs;

},{"./helpers/Listeners":160,"dom-helpers":70}],146:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AspectRatio", {
  enumerable: true,
  get: function get() {
    return _AspectRatio["default"];
  }
});
Object.defineProperty(exports, "ButtonAdd", {
  enumerable: true,
  get: function get() {
    return _ButtonAdd["default"];
  }
});
Object.defineProperty(exports, "ButtonClear", {
  enumerable: true,
  get: function get() {
    return _ButtonClear["default"];
  }
});
Object.defineProperty(exports, "ButtonCopy", {
  enumerable: true,
  get: function get() {
    return _ButtonCopy["default"];
  }
});
Object.defineProperty(exports, "ButtonDelete", {
  enumerable: true,
  get: function get() {
    return _ButtonDelete["default"];
  }
});
Object.defineProperty(exports, "ButtonGet", {
  enumerable: true,
  get: function get() {
    return _ButtonGet["default"];
  }
});
Object.defineProperty(exports, "ButtonLoading", {
  enumerable: true,
  get: function get() {
    return _ButtonLoading["default"];
  }
});
Object.defineProperty(exports, "ButtonPost", {
  enumerable: true,
  get: function get() {
    return _ButtonPost["default"];
  }
});
Object.defineProperty(exports, "Calendar", {
  enumerable: true,
  get: function get() {
    return _Calendar["default"];
  }
});
Object.defineProperty(exports, "Container", {
  enumerable: true,
  get: function get() {
    return _Container["default"];
  }
});
Object.defineProperty(exports, "DropdownMenu", {
  enumerable: true,
  get: function get() {
    return _DropdownMenu["default"];
  }
});
Object.defineProperty(exports, "FieldDate", {
  enumerable: true,
  get: function get() {
    return _FieldDate["default"];
  }
});
Object.defineProperty(exports, "FieldDateTime", {
  enumerable: true,
  get: function get() {
    return _FieldDateTime["default"];
  }
});
Object.defineProperty(exports, "FieldHoursMinutes", {
  enumerable: true,
  get: function get() {
    return _FieldHoursMinutes["default"];
  }
});
Object.defineProperty(exports, "FieldIncrement", {
  enumerable: true,
  get: function get() {
    return _FieldIncrement["default"];
  }
});
Object.defineProperty(exports, "FieldSelect", {
  enumerable: true,
  get: function get() {
    return _FieldSelect["default"];
  }
});
Object.defineProperty(exports, "FileUpload", {
  enumerable: true,
  get: function get() {
    return _FileUpload["default"];
  }
});
Object.defineProperty(exports, "Form", {
  enumerable: true,
  get: function get() {
    return _Form["default"];
  }
});
Object.defineProperty(exports, "Layout", {
  enumerable: true,
  get: function get() {
    return _Layout["default"];
  }
});
Object.defineProperty(exports, "OptionsPanel", {
  enumerable: true,
  get: function get() {
    return _OptionsPanel["default"];
  }
});
Object.defineProperty(exports, "ProgressBar", {
  enumerable: true,
  get: function get() {
    return _ProgressBar["default"];
  }
});
Object.defineProperty(exports, "RadioButtons", {
  enumerable: true,
  get: function get() {
    return _RadioButtons["default"];
  }
});
Object.defineProperty(exports, "Table", {
  enumerable: true,
  get: function get() {
    return _Table["default"];
  }
});
Object.defineProperty(exports, "Tabs", {
  enumerable: true,
  get: function get() {
    return _Tabs["default"];
  }
});
exports["default"] = void 0;
var _Layout = _interopRequireDefault(require("./Layout"));
var _Container = _interopRequireDefault(require("./Container"));
var _ButtonLoading = _interopRequireDefault(require("./ButtonLoading"));
var _ButtonDelete = _interopRequireDefault(require("./ButtonDelete"));
var _ButtonPost = _interopRequireDefault(require("./ButtonPost"));
var _ButtonGet = _interopRequireDefault(require("./ButtonGet"));
var _ButtonAdd = _interopRequireDefault(require("./ButtonAdd"));
var _ButtonCopy = _interopRequireDefault(require("./ButtonCopy"));
var _ButtonClear = _interopRequireDefault(require("./ButtonClear"));
var _DropdownMenu = _interopRequireDefault(require("./DropdownMenu"));
var _FieldDate = _interopRequireDefault(require("./FieldDate"));
var _Calendar = _interopRequireDefault(require("./Calendar"));
var _Table = _interopRequireDefault(require("./Table"));
var _FileUpload = _interopRequireDefault(require("./FileUpload"));
var _Tabs = _interopRequireDefault(require("./Tabs"));
var _RadioButtons = _interopRequireDefault(require("./RadioButtons"));
var _OptionsPanel = _interopRequireDefault(require("./OptionsPanel"));
var _FieldSelect = _interopRequireDefault(require("./FieldSelect"));
var _FieldIncrement = _interopRequireDefault(require("./FieldIncrement"));
var _FieldHoursMinutes = _interopRequireDefault(require("./FieldHoursMinutes"));
var _FieldDateTime = _interopRequireDefault(require("./FieldDateTime"));
var _Form = _interopRequireDefault(require("./Form"));
var _ProgressBar = _interopRequireDefault(require("./ProgressBar"));
var _AspectRatio = _interopRequireDefault(require("./AspectRatio"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_Layout["default"].init();
_OptionsPanel["default"].init();
_Container["default"].init();
_ButtonLoading["default"].init();
_ButtonDelete["default"].init();
_ButtonPost["default"].init();
_ButtonGet["default"].init();
_ButtonAdd["default"].init();
_ButtonCopy["default"].init();
_ButtonClear["default"].init();
_DropdownMenu["default"].init();
_FieldDate["default"].init();
_Calendar["default"].init();
_Table["default"].init();
_FileUpload["default"].init();
_Tabs["default"].init();
_RadioButtons["default"].init();
_FieldSelect["default"].init();
_FieldIncrement["default"].init();
_FieldHoursMinutes["default"].init();
_FieldDateTime["default"].init();
_Form["default"].init();
_ProgressBar["default"].init();
_AspectRatio["default"].init();
var _default = exports["default"] = {
  Layout: _Layout["default"],
  OptionsPanel: _OptionsPanel["default"],
  Container: _Container["default"],
  ButtonLoading: _ButtonLoading["default"],
  ButtonDelete: _ButtonDelete["default"],
  ButtonPost: _ButtonPost["default"],
  ButtonGet: _ButtonGet["default"],
  ButtonAdd: _ButtonAdd["default"],
  ButtonCopy: _ButtonCopy["default"],
  ButtonClear: _ButtonClear["default"],
  DropdownMenu: _DropdownMenu["default"],
  FieldSelect: _FieldSelect["default"],
  FieldDate: _FieldDate["default"],
  Calendar: _Calendar["default"],
  Table: _Table["default"],
  FileUpload: _FileUpload["default"],
  Tabs: _Tabs["default"],
  RadioButtons: _RadioButtons["default"],
  FieldIncrement: _FieldIncrement["default"],
  FieldHoursMinutes: _FieldHoursMinutes["default"],
  FieldDateTime: _FieldDateTime["default"],
  Form: _Form["default"],
  ProgressBar: _ProgressBar["default"],
  AspectRatio: _AspectRatio["default"]
};

},{"./AspectRatio":120,"./ButtonAdd":121,"./ButtonClear":122,"./ButtonCopy":123,"./ButtonDelete":124,"./ButtonGet":125,"./ButtonLoading":126,"./ButtonPost":127,"./Calendar":128,"./Container":129,"./DropdownMenu":130,"./FieldDate":131,"./FieldDateTime":132,"./FieldHoursMinutes":133,"./FieldIncrement":134,"./FieldSelect":135,"./FileUpload":136,"./Form":137,"./Layout":139,"./OptionsPanel":140,"./ProgressBar":141,"./RadioButtons":142,"./Table":144,"./Tabs":145}],147:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _stringToDate = _interopRequireDefault(require("./stringToDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Validējam, lai date būt starp min un max Dates
 * atgriež koriģēto datumu
 */
function clampDate(date, minDate, maxDate) {
  date = (0, _stringToDate["default"])(date);
  if (minDate && maxDate) {
    minDate = (0, _stringToDate["default"])(minDate);
    maxDate = (0, _stringToDate["default"])(maxDate);
    if (date < minDate && date < maxDate) {
      return minDate;
    } else if (date > minDate && date > maxDate) {
      return maxDate;
    }
  } else if (minDate) {
    minDate = (0, _stringToDate["default"])(minDate);
    if (date < minDate) {
      return minDate;
    }
  } else if (maxDate) {
    maxDate = (0, _stringToDate["default"])(maxDate);
    if (date > maxDate) {
      return maxDate;
    }
  }
  return date;
}
var _default = exports["default"] = clampDate;

},{"./stringToDate":156}],148:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _formatDate = _interopRequireDefault(require("./formatDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function dateCaptionFormatter(date) {
  return _domHelpers.jsx.h("div", null, _domHelpers.jsx.h("span", {
    "class": "month"
  }, _formatDate["default"].F(date)), _domHelpers.jsx.h("span", {
    "class": "year"
  }, _formatDate["default"].y(date)));
}
var _default = exports["default"] = dateCaptionFormatter;

},{"./formatDate":150,"dom-helpers":70}],149:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
//import __ from '../translations';
var _default = exports["default"] = {
  full: function full(i) {
    daysInWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i + 1];
    //return __('week-days.'+(i+1)+'_full')
  },
  "short": function short(i) {
    daysInWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i + 1];
    //return __('week-days.'+(i+1)+'_short')
  }
};

},{}],150:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _monthCaption = _interopRequireDefault(require("./monthCaption"));
var _dayCaption = _interopRequireDefault(require("./dayCaption"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function sp(s) {
  s = s + '';
  if (s.length == 1) {
    s = '0' + s;
  }
  return s;
}
function sameYear(d1, d2) {
  return d1.getFullYear() === d2.getFullYear();
}
function sameMonth(d1, d2) {
  return d1.getMonth() === d2.getMonth();
}
function sameDate(d1, d2) {
  return d1.getDate() === d2.getDate();
}
function sameYmd(d1, d2) {
  return sameYear(d1, d2) && sameMonth(d1, d2) && sameDate(d1, d2);
}
function monthShort(month) {
  return _monthCaption["default"]["short"](month - 1);
}
function dayShort(day) {
  return _dayCaption["default"]["short"](day);
}
function ymd(date) {
  return date.getFullYear() + '-' + sp(date.getMonth() + 1) + '-' + sp(date.getDate());
}
function Mmy(date) {
  return _monthCaption["default"]["short"](date.getMonth()) + ' ' + date.getFullYear();
}
function Mdy(date) {
  return _monthCaption["default"].full(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear();
}
function My(date) {
  return _monthCaption["default"].full(date.getMonth()) + ', ' + date.getFullYear();
}
function dmy(date) {
  return date.getDate() + ' ' + _monthCaption["default"]["short"](date.getMonth()) + ', ' + date.getFullYear();
}
function h(date) {
  return sp(date.getHours());
}
function pih(date) {
  return parseInt(sp(date.getHours()), 10);
}
function hi(date) {
  return sp(date.getHours()) + ':' + sp(date.getMinutes());
}
function his(date) {
  return sp(date.getHours()) + ':' + sp(date.getMinutes()) + ':' + sp(date.getSeconds());
}
function ymdhis(date) {
  return ymd(date) + ' ' + his(date);
}
function ymdhi(date) {
  return ymd(date) + ' ' + hi(date);
}
function y(date) {
  return date.getFullYear();
}
function F(date) {
  return _monthCaption["default"].full(date.getMonth());
}
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
function daysInMonthByDate(date) {
  return daysInMonth(date.getFullYear(), date.getMonth() + 1);
}
function dayOfYear(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var r = 0;
  for (var m = 1; m < month; m++) {
    r += daysInMonth(year, m);
  }
  return r + date.getDate();
}

/**
 * perioda formatēšana šādā veidā
 * 10 - 20 okt, 2019
 * 10 okt - 20 dec, 2019
 * 10 okt, 2019 - 20 jan, 2020
 */
function datePeriodHR(from, till) {
  if (!(from && till)) {
    return '';
  }
  var sy = sameYear(from, till);
  var sm = sameMonth(from, till);
  var sd = sameDate(from, till);
  if (sy && sm && sd) {
    return till.getDate() + ' ' + _monthCaption["default"]["short"](till.getMonth()) + ', ' + till.getFullYear();
  } else if (sy && sm) {
    return from.getDate() + ' - ' + till.getDate() + ' ' + _monthCaption["default"]["short"](till.getMonth()) + ', ' + till.getFullYear();
  } else if (sy) {
    return from.getDate() + ' ' + _monthCaption["default"]["short"](from.getMonth()) + ' - ' + till.getDate() + ' ' + _monthCaption["default"]["short"](till.getMonth()) + ', ' + till.getFullYear();
  } else {
    return from.getDate() + ' ' + _monthCaption["default"]["short"](from.getMonth()) + ', ' + from.getFullYear() + ' - ' + till.getDate() + ' ' + _monthCaption["default"]["short"](till.getMonth()) + ', ' + till.getFullYear();
  }
}
function timePeriodHR(from, till, baseDate) {
  if (!(from && till)) {
    return '';
  }
  var fsy = sameYear(from, baseDate);
  var fsm = sameMonth(from, baseDate);
  var fsd = sameDate(from, baseDate);
  var tsy = sameYear(till, baseDate);
  var tsm = sameMonth(till, baseDate);
  var tsd = sameDate(till, baseDate);
  var stringFrom = '';
  var stringTill = '';
  if (fsy && fsm && fsd) {
    stringFrom = hi(from);
  } else if (fsy && fsm) {
    stringFrom = hi(from) + ', ' + from.getDate() + ' ' + _monthCaption["default"]["short"](from.getMonth());
  } else if (fsy) {
    stringFrom = hi(from) + ', ' + from.getDate() + ' ' + _monthCaption["default"]["short"](from.getMonth());
  } else {
    stringFrom = hi(from) + ', ' + from.getDate() + ' ' + _monthCaption["default"]["short"](from.getMonth()) + ', ' + from.getFullYear();
  }
  if (tsy && tsm && tsd) {
    stringTill = hi(till);
  } else if (tsy && tsm) {
    stringTill = hi(till) + ', ' + till.getDate() + ' ' + _monthCaption["default"]["short"](till.getMonth());
  } else if (tsy) {
    stringTill = hi(till) + ', ' + till.getDate() + ' ' + _monthCaption["default"]["short"](till.getMonth());
  } else {
    stringTill = hi(till) + ', ' + till.getDate() + ' ' + _monthCaption["default"]["short"](till.getMonth()) + ', ' + till.getFullYear();
  }
  return stringFrom + ' - ' + stringTill;
}
function timeToMinutes(time) {
  time = time.split(':');
  return parseInt(time[0], 10) * 60 + parseInt(time[1], 10);
}

/**
 * Diff in ms transalted to minutes:seconds
 */
function diffToMinutes(diff) {
  // seconds
  diff = diff / 1000;
  var minutes = Math.floor(diff / 60);
  var seconds = Math.floor(diff - minutes * 60);
  return sp(minutes) + ':' + sp(seconds);
}
var _default = exports["default"] = {
  sp: sp,
  Mmy: Mmy,
  ymd: ymd,
  Mdy: Mdy,
  My: My,
  dmy: dmy,
  h: h,
  y: y,
  F: F,
  pih: pih,
  hi: hi,
  his: his,
  ymdhis: ymdhis,
  ymdhi: ymdhi,
  dayShort: dayShort,
  daysInMonth: daysInMonth,
  daysInMonthByDate: daysInMonthByDate,
  dayOfYear: dayOfYear,
  monthShort: monthShort,
  datePeriodHR: datePeriodHR,
  timePeriodHR: timePeriodHR,
  sameYmd: sameYmd,
  timeToMinutes: timeToMinutes,
  diffToMinutes: diffToMinutes
};

},{"./dayCaption":149,"./monthCaption":152}],151:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _Calendar = _interopRequireDefault(require("../Calendar"));
var _formatDate = _interopRequireDefault(require("./formatDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function getDateFromReference(referenceOrDate, onChangeCb) {
  if (!referenceOrDate) {
    return '';
  }
  if (!referenceOrDate.startsWith('calendar:')) {
    return referenceOrDate;
  }

  // reference uz citu date/calendar lauku
  var fieldName = referenceOrDate.substring(9);
  var fieldEl = (0, _domHelpers.q)("[name=".concat(fieldName, "]"));
  if (!fieldEl) {
    return '';
  }

  // ja ir calendar lauks
  if ((0, _domHelpers.parent)(fieldEl, '[data-is-calendar]')) {
    // Klausāmies change pēc calendar name
    _Calendar["default"].onDateChange(function (calendarName, date) {
      if (calendarName == fieldName) {
        /**
         * To string, lai būtu tā pat, kā ar input laukiem
         * input lauks vienmēr būs string
         */
        onChangeCb(_formatDate["default"].ymd(date));
      }
    });
    var c = _Calendar["default"].getByName(fieldName);
    if (c) {
      /**
       * To string, lai būtu tā pat, kā ar input laukiem
       * input lauks vienmēr būs string
       */
      return _formatDate["default"].ymd(c.getDate());
    }
  } else {
    (0, _domHelpers.change)("[name=".concat(fieldName, "]"), function (ev, el) {
      return onChangeCb(el.value);
    });
    return fieldEl.value;
  }
}
var _default = exports["default"] = getDateFromReference;

},{"../Calendar":128,"./formatDate":150,"dom-helpers":70}],152:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
//import __ from '../translations';
var _default = exports["default"] = {
  full: function full(i) {
    return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][i];
    //return __('months.'+(i+1)+'_full')
  },
  "short": function short(i) {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i];
    //return __('months.'+(i+1)+'_short')
  }
};

},{}],153:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function monthDayFormatter(date, currentEl) {
  // Create new because first call
  if (!currentEl) {
    /**
     * span: šo izmantos, lai uzstādītu selected, period-in utt stāvokļus
     *
     * date elementam varēs uzlikt fona krāsu un tā netraucēs selected, period-in stilam
     * tas būs default krāsā ar opacity, lai custom fona krāsa lien ārā
     */

    return _domHelpers.jsx.h("span", null, date.getDate());
  }

  // Update existing element
  currentEl.innerHTML = date.getDate();
  return null;
}
var _default = exports["default"] = monthDayFormatter;

},{"dom-helpers":70}],154:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function navNextFormatter() {
  return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
}
var _default = exports["default"] = navNextFormatter;

},{"dom-helpers":70}],155:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function navPrevFormatter() {
  return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
}
var _default = exports["default"] = navPrevFormatter;

},{"dom-helpers":70}],156:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function stringToDate(dateString) {
  if (dateString instanceof Date) {
    return new Date(dateString.getTime());
  }

  // Sadalam pa datumu un laiku
  var dp = dateString.split(' ');

  // gads, mēnesis, diena
  var date = dp[0].split('-');
  // stundas, minūtes, sekundes
  var time = [0, 0, 0];
  if (dp.length > 1) {
    time = dp[1].split(':');
  }
  if (date.length != 3 || time.length != 3) {
    return new Date();
  }
  return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
}
var _default = exports["default"] = stringToDate;

},{}],157:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function weekDayToText(dayIndex) {
  return ['', 'P', 'O', 'T', 'C', 'Pk', 'S', 'Sv'][dayIndex];
}
var _default = exports["default"] = weekDayToText;

},{}],158:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function createImageFromFile(file, attrs) {
  if (typeof attrs == 'undefined') {
    attrs = {};
  }
  attrs.src = URL.createObjectURL(file);
  return (0, _domHelpers.ce)('img', attrs);
}
var _default = exports["default"] = createImageFromFile;

},{"dom-helpers":70}],159:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
function createVideoFromFile(file, attrs) {
  if (typeof attrs == 'undefined') {
    attrs = {};
  }
  attrs.controls = '';
  attrs.src = URL.createObjectURL(file);
  return (0, _domHelpers.ce)('video', attrs);
}
var _default = exports["default"] = createVideoFromFile;

},{"dom-helpers":70}],160:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function Listener() {
  this.listeners = [];
}
Listener.prototype = {
  listen: function listen(callback) {
    this.listeners.push(callback);
  },
  trigger: function trigger(args) {
    var _this = this;
    this.listeners.forEach(function (cb) {
      return cb.apply(_this, args);
    });
  }
};
var _default = exports["default"] = Listener;

},{}],161:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _DropdownMenu = _interopRequireDefault(require("../DropdownMenu"));
var _Container = _interopRequireDefault(require("../Container"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Ja elementam ir nodrādīts data-replace-html, tad aizvietosim
 * šo elementu ar padoto html
 * ja data-replace-html ir vertība, tad tas ir relative querySelector
 * Pēc tā tiks atlasīts elements, kuru repleisot
 */
function ReplaceElWithNewHtmlIfNecessary(originalEl) {
  // Elementu nav paredzēts replaceicot ar jaunu html
  if (!('replaceHtml' in originalEl.dataset)) {
    return;
  }
  this.shouldReplace = true;
  this.originalEl = originalEl;

  /**
   * Elements, kuru replace. Normālā gadījumā, tas ir elements, kurš padots
   */
  this.elToReplace = originalEl;

  /**
   * Vai replace elements ir tas, kas oriģināli padots?
   */
  this.shouldReplaceOriginalEl = true;

  /**
   * Ja ir norādīts replaceHtml target. Tas ir cits elements, uz kuru
   * veikt replaceHtml darbību
   */
  if ('replaceHtmlTarget' in this.originalEl.dataset) {
    if (this.originalEl.dataset.replaceHtmlTarget == 'dropdownMenuOpenTrigger') {
      this.shouldReplaceOriginalEl = false;
      this.elToReplace = _DropdownMenu["default"].getOpenTriggerByChild(this.originalEl);
    }
  }

  // Ir norādīts relative querySelector ar kuru atlasīt elementu, kuru replace
  if (this.originalEl.dataset.replaceHtml) {
    this.shouldReplaceOriginalEl = false;
    this.elToReplace = (0, _domHelpers.qr)(this.elToReplace, this.originalEl.dataset.replaceHtml);
  }
  if (this.elToReplace) {
    _Container["default"].maybeLoading(this.elToReplace, 'replace');
  } else {
    console.error('UI.Form el to replace not defined');
  }
}
ReplaceElWithNewHtmlIfNecessary.prototype = {
  replace: function replace(newHtml) {
    if (!this.shouldReplace) {
      return false;
    }
    if (!this.elToReplace) {
      return false;
    }
    this.elToReplace = (0, _domHelpers.replace)(this.elToReplace, newHtml);
    _Container["default"].idle(this.elToReplace);

    // Svarīgi atgriez to pašu elementu, kurš tika padots
    return this.shouldReplaceOriginalEl ? this.elToReplace : this.originalEl;
  }
};
var _default = exports["default"] = ReplaceElWithNewHtmlIfNecessary;

},{"../Container":129,"../DropdownMenu":130,"dom-helpers":70}],162:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function fuzzysearch(needle, haystack) {
  var hlen = haystack.length;
  var nlen = needle.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
var _default = exports["default"] = fuzzysearch;

},{}],163:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
/**
 * ContainerEl elementā ir script tags ar type=application/json
 * tajā ir json encoded dati
 * Script tagam ir data-role atribūte
 * pēc šī atribūta atlasām vajadzīgo script tag un paņemam innerHTML
 * to parse uz objektu
 */
function getJsonFromHtml(containerEl, role) {
  var s = (0, _domHelpers.q)(containerEl, 'script[data-role="' + role + '"]');
  if (s) {
    try {
      return JSON.parse(s.innerHTML);
    } catch (e) {}
  }
  return;
}
var _default = exports["default"] = getJsonFromHtml;

},{"dom-helpers":70}],164:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _DropdownMenu = _interopRequireDefault(require("../DropdownMenu"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Pārbauda vai uz el ir data-menu-hide atribūts
 * salīdzina ar padoto event, ja data-menu-hide sakrīt ar event
 * tad aizvert to DropdownMenu, kurā atrodas el
 *
 * šo izmanto Form, ButtonPost, ButtonGet, ButtonDelete
 * lai varētu aizvērt DropdownMenu, pirms vai pēc request veikšanas
 */
function handleDropdownMenuHideFromEl(el, eventName) {
  if (!('dropdownMenuHide' in el.dataset)) {
    return;
  }
  if (el.dataset.dropdownMenuHide == eventName) {
    var menuEl = _DropdownMenu["default"].getByChild(el);
    if (menuEl) {
      _DropdownMenu["default"].close(menuEl);
    }
  }
}
var _default = exports["default"] = handleDropdownMenuHideFromEl;

},{"../DropdownMenu":130}]},{},[146])(146)
});
