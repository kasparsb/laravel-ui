(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../formatDate":17,"./CssClassNames":9,"dom-helpers/src/ce":29,"dom-helpers/src/q":81,"dom-helpers/src/replaceContent":88}],12:[function(require,module,exports){
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

},{"./CssClassNames":9,"dom-helpers/src/append":28,"dom-helpers/src/ce":29,"dom-helpers/src/replaceContent":88}],13:[function(require,module,exports){
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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
  this.minDate = this.props.get('minDate');
  if (this.minDate) {
    this.minDate = (0, _formatDate.toDate)(this.minDate);
  }
  this.maxDate = this.props.get('maxDate');
  if (this.maxDate) {
    this.maxDate = (0, _formatDate.toDate)(this.maxDate);
  }

  // Infinity swipe reset timeout
  this.irt = 0;
  // Slides decorate timeout
  this.sdt = 0;
  this.events = new _calendarEvents["default"](['dateclick', 'periodselect',
  // Pogas next un prev click
  'prevclick', 'nextclick', 'datecaptionclick',
  // Ja maina mēnesi ar swipe kustību, tad izpildās tikai šis
  'slidechange',
  // Visu ielādēto slide events
  'slideschange']);
  this.cssPrefix = this.props.get('cssprefix', 'wb');
  this.state = this.props.get('state');
  this.stateUrl = this.props.get('stateUrl');
  this.defaultDateState = this.props.get('defaultDateState');
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
      var isDateDisabled = false;
      if (dateState && typeof dateState.disabled != 'undefined') {
        isDateDisabled = dateState.disabled ? true : false;
      }
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
      if (_this2.props.get('disablePrevMonthDate') && isPrevMonth) {
        isDateDisabled = true;
      }
      if (_this2.props.get('disableNextMonthDate') && isNextMonth) {
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
    var date = new Date(parseInt(dateEl.dataset.ts, 10));
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
    }
    // Single date mode
    else {
      this.events.fire('dateclick', [(0, _cloneDate["default"])(this.selectedDate)]);
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
      return _this4.setState(state);
    });
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
    this.selectedDate = (0, _cloneDate["default"])((0, _formatDate.toDate)(date));
    this.setDate((0, _cloneDate["default"])(this.selectedDate));
  },
  setSelectedPeriod: function setSelectedPeriod(period) {
    this.selectedPeriod = new _period["default"](period);
    this.refresh();
  },
  setMinDate: function setMinDate(date) {
    this.minDate = date ? (0, _formatDate.toDate)(date) : undefined;
    this.refresh();
  },
  setMaxDate: function setMaxDate(date) {
    this.maxDate = date ? (0, _formatDate.toDate)(date) : undefined;
    this.refresh();
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
  refresh: function refresh() {
    var _this6 = this;
    // Redecorate all slides
    clearTimeout(this.sdt);
    this.sdt = setTimeout(function () {
      return _this6.infty.getSlides().slides.forEach(function (slide) {
        return _this6.decorateSlideDates(slide);
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

},{"../addMonths":2,"../addWeeks":3,"../cloneDate":5,"../createPeriod":6,"../dayOfWeek":7,"../findMinMaxDates":16,"../formatDate":17,"../isHigherDateThan":18,"../isHigherMonthThan":19,"../isLowerDateThan":20,"../isLowerMonthThan":21,"../isSameDate":22,"../period":23,"../properties":25,"./CssClassNames":9,"./calendarEvents":10,"./createDateSwitchEl":11,"./createWeekDaysEl":12,"./defaultMonthDayFormatter":13,"./periodStructure":14,"dom-helpers/src/append":28,"dom-helpers/src/ce":29,"dom-helpers/src/event/clickp":37,"dom-helpers/src/http/get":57,"dom-helpers/src/qa":82,"dom-helpers/src/remove":85,"dom-helpers/src/replaceContent":88,"infinityswipe":101}],16:[function(require,module,exports){
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
exports.stringToDate = stringToDate;
exports.toDate = toDate;
exports.yF = yF;
exports.ym = ym;
exports.ymd = ymd;
function sp(s) {
  s = s + '';
  if (s.length == 1) {
    s = '0' + s;
  }
  return s;
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

},{"./hasClass":56,"./rea":84}],27:[function(require,module,exports){
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

},{"./rea":84}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _re = _interopRequireDefault(require("./re"));
var _isArrayLike = _interopRequireDefault(require("./isArrayLike"));
var _isEmpty = _interopRequireDefault(require("./isEmpty"));
var _isTextContent = _interopRequireDefault(require("./isTextContent"));
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
    var item = items[i];
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

},{"./isArrayLike":68,"./isEmpty":70,"./isTextContent":73,"./re":83}],29:[function(require,module,exports){
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

},{"./jsx":74}],30:[function(require,module,exports){
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

},{"./qa":82,"./re":83,"./setValue":91}],31:[function(require,module,exports){
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

},{"./re":83}],32:[function(require,module,exports){
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

},{"./append":28,"./setAttributes":89}],33:[function(require,module,exports){
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

},{"../other/matchesMethodName":78}],34:[function(require,module,exports){
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

},{"./addListener":33,"./parseArguments":41}],35:[function(require,module,exports){
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

},{"./addListener":33,"./parseArguments":41}],36:[function(require,module,exports){
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

},{"./addListener":33,"./parseArguments":41}],37:[function(require,module,exports){
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

},{"./addListener":33,"./parseArguments":41}],38:[function(require,module,exports){
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

},{"./parseArguments":41,"./removeListener":42}],39:[function(require,module,exports){
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

},{"./addListener":33,"./parseArguments":41}],40:[function(require,module,exports){
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

},{"./addListener":33,"./parseArguments":41}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(el, eventName, eventHandler) {
  el.removeEventListener(eventName, eventHandler);
}

},{}],43:[function(require,module,exports){
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

},{"./addListener":33,"./parseArguments":41}],44:[function(require,module,exports){
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

},{"./addListener":33,"./parseArguments":41}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{"./qa":82,"./re":83}],47:[function(require,module,exports){
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

},{"./getStyleValueAsInt":52,"./re":83}],48:[function(require,module,exports){
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
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Visi form elementi, kas ir padotajā parent
 * form.elements neizmantojam, jo tā ir neertība gadījumā,
 * kad vajag savākt lauku vērtības no parastam div elementa
 */
function _default(form) {
  form = (0, _re["default"])(form);
  var fieldValues = {};
  _toConsumableArray((0, _qa["default"])(form, 'input, select, textarea')).filter(function (formEl) {
    return formEl.name ? true : false;
  }).forEach(function (formEl) {
    var name = formEl.name;

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
  });
  var r = {};
  for (var name in fieldValues) {
    if (name.substring(name.length - 2) == '[]') {
      r[name.substring(0, name.length - 2)] = fieldValues[name];
    } else {
      // ņemam pirmo vērtību
      r[name] = fieldValues[name].length > 0 ? fieldValues[name].at(0) : '';
    }
  }
  return r;
}

},{"./isInputCheckable":72,"./qa":82,"./re":83,"./value":95}],49:[function(require,module,exports){
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

},{"./getWindowScrollLeft":54,"./getWindowScrollTop":55,"./re":83}],50:[function(require,module,exports){
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

},{"./getStyleValueAsInt":52,"./re":83}],51:[function(require,module,exports){
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

},{"./re":83}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(style, name) {
  return parseInt(style.getPropertyValue(name), 10);
}

},{}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default() {
  return window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft;
}

},{}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default() {
  return window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

},{}],56:[function(require,module,exports){
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

},{"./re":83}],57:[function(require,module,exports){
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

},{"./jsonOrText":59,"./request":62}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
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

},{"./isResponseJson":58}],60:[function(require,module,exports){
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

},{"./jsonOrText":59,"./request":62}],61:[function(require,module,exports){
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

},{"./jsonOrText":59,"./request":62}],62:[function(require,module,exports){
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

},{"./urlParams":63}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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
Object.defineProperty(exports, "findSelectOption", {
  enumerable: true,
  get: function get() {
    return _findSelectOption["default"];
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
var _submitForm = _interopRequireDefault(require("./submitForm"));
var _findSelectOption = _interopRequireDefault(require("./findSelectOption"));
var _qa = _interopRequireDefault(require("./qa"));
var _q = _interopRequireDefault(require("./q"));
var _re = _interopRequireDefault(require("./re"));
var _rea = _interopRequireDefault(require("./rea"));
var _mn = _interopRequireDefault(require("./mn"));
var _jsx = _interopRequireDefault(require("./jsx"));
var _ce = _interopRequireDefault(require("./ce"));
var _off = _interopRequireDefault(require("./event/off"));
var _onp = _interopRequireDefault(require("./event/onp"));
var _on = _interopRequireDefault(require("./event/on"));
var _click = _interopRequireDefault(require("./event/click"));
var _clickp = _interopRequireDefault(require("./event/clickp"));
var _submit = _interopRequireDefault(require("./event/submit"));
var _submitp = _interopRequireDefault(require("./event/submitp"));
var _change = _interopRequireDefault(require("./event/change"));
var _changep = _interopRequireDefault(require("./event/changep"));
var _target = _interopRequireDefault(require("./event/target"));
var _get = _interopRequireDefault(require("./http/get"));
var _post = _interopRequireDefault(require("./http/post"));
var _postRaw = _interopRequireDefault(require("./http/postRaw"));
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
  submitForm: _submitForm["default"],
  findSelectOption: _findSelectOption["default"],
  off: _off["default"],
  onp: _onp["default"],
  on: _on["default"],
  click: _click["default"],
  clickp: _clickp["default"],
  submit: _submit["default"],
  submitp: _submitp["default"],
  change: _change["default"],
  changep: _changep["default"],
  target: _target["default"],
  qa: _qa["default"],
  q: _q["default"],
  re: _re["default"],
  rea: _rea["default"],
  mn: _mn["default"],
  jsx: _jsx["default"],
  ce: _ce["default"],
  get: _get["default"],
  post: _post["default"],
  postRaw: _postRaw["default"]
};

},{"./addClass":26,"./addStyle":27,"./append":28,"./ce":29,"./clone":31,"./create":32,"./event/change":34,"./event/changep":35,"./event/click":36,"./event/clickp":37,"./event/off":38,"./event/on":39,"./event/onp":40,"./event/submit":43,"./event/submitp":44,"./event/target":45,"./findSelectOption":46,"./getDimensions":47,"./getFormData":48,"./getOffset":49,"./getOuterDimensions":50,"./getStyle":51,"./getWindowDimensions":53,"./getWindowScrollLeft":54,"./getWindowScrollTop":55,"./hasClass":56,"./http/get":57,"./http/post":60,"./http/postRaw":61,"./insertAfter":65,"./insertBefore":66,"./isChild":69,"./isInViewport":71,"./jsx":74,"./mn":75,"./nodeIndex":77,"./parent":79,"./prepend":80,"./q":81,"./qa":82,"./re":83,"./rea":84,"./remove":85,"./removeClass":86,"./replace":87,"./replaceContent":88,"./setAttributes":89,"./setFormData":90,"./setValue":91,"./setWindowScrollTop":92,"./submitForm":93,"./toggleClass":94,"./value":95,"./wrap":96}],65:[function(require,module,exports){
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

},{"./append":28,"./isArray":67,"./mn":75,"./next":76,"./parent":79,"./re":83}],66:[function(require,module,exports){
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

},{"./isArray":67,"./mn":75,"./parent":79,"./re":83}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
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

},{}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(v) {
  return typeof v === 'undefined' || v === null;
}

},{}],71:[function(require,module,exports){
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

},{"./getWindowDimensions":53,"./re":83}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function isInputCheckable(input) {
  return input.type == 'checkbox' || input.type == 'radio';
}
var _default = exports["default"] = isInputCheckable;

},{}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(c) {
  return typeof c === 'string' || typeof c === 'number' || typeof c === 'undefined' || c === null;
}

},{}],74:[function(require,module,exports){
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

},{"./append":28,"./setAttributes":89}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _isEmpty = _interopRequireDefault(require("./isEmpty"));
var _isTextContent = _interopRequireDefault(require("./isTextContent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Maybe create node if passed element is not node
 * Text is translated to textNode
 * If passed element is node, then return it
 */
function _default(el) {
  if ((0, _isTextContent["default"])(el)) {
    el = document.createTextNode((0, _isEmpty["default"])(el) ? '' : el);
  }
  return el;
}

},{"./isEmpty":70,"./isTextContent":73}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Return next node after passed node
 */
function next(el) {
  if (!el) {
    return null;
  }
  el = (0, _re["default"])(el);
  if (!el.nextSibling) {
    return null;
  }

  // Ja next node nav ELEMENT_NODE, tad skip un atgriežam nākošo
  if (el.nextSibling.nodeType !== Node.ELEMENT_NODE) {
    return next(el.nextSibling);
  }
  return el.nextSibling;
}
var _default = exports["default"] = next;

},{"./re":83}],77:[function(require,module,exports){
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

},{"./re":83}],78:[function(require,module,exports){
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

},{}],79:[function(require,module,exports){
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

},{"./other/matchesMethodName":78,"./re":83}],80:[function(require,module,exports){
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

},{"./isArray":67,"./mn":75,"./re":83}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
/**
 * querySelector
 */
function _default(p1, p2) {
  var parentNode, querySelector;
  if (typeof p1 === 'string') {
    parentNode = document;
    querySelector = p1;
  } else {
    parentNode = p1;
    querySelector = p2;
  }
  return parentNode.querySelector(querySelector);
}

},{}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
/**
 * querySelectorAll
 */
function _default(p1, p2) {
  var parentNode, querySelector;
  if (typeof p1 === 'string') {
    parentNode = document;
    querySelector = p1;
  } else {
    parentNode = p1;
    querySelector = p2;
  }
  return parentNode.querySelectorAll(querySelector);
}

},{}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _q = _interopRequireDefault(require("./q"));
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
  return el;
}

},{"./q":81}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _qa = _interopRequireDefault(require("./qa"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
    return [els];
  }
  return els;
}

},{"./qa":82}],85:[function(require,module,exports){
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

},{"./rea":84}],86:[function(require,module,exports){
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

},{"./rea":84}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _re = _interopRequireDefault(require("./re"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default(el, newEl) {
  el = (0, _re["default"])(el);
  if (el && el.parentNode && newEl) {
    // ja string, tad parsējam par Node

    if (typeof newEl === 'string') {
      // Šis veido DOM document
      newEl = new DOMParser().parseFromString(newEl, 'text/html');
      // Ņemam tikai pirmo child no body
      newEl = newEl.body.firstChild;
    }
    el.parentNode.replaceChild(newEl, el);
  }

  // Vienmēr atgriežam jauno el, ja arī padotais el non existing
  return newEl;
}

},{"./re":83}],88:[function(require,module,exports){
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

},{"./append":28,"./isTextContent":73,"./q":81}],89:[function(require,module,exports){
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

},{"./isEmpty":70,"./re":83}],90:[function(require,module,exports){
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

},{"./clearFormData":30,"./isArray":67,"./isInputCheckable":72,"./qa":82,"./re":83,"./setValue":91}],91:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
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
      field = form.elements[p2];
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
  if (field.type == 'checkbox' || field.type == 'radio') {
    return field.checked = value ? true : false;
  } else {
    return field.value = value;
  }
  return field.value;
}

},{"./re":83}],92:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default(top) {
  window.scrollTo(0, top);
}

},{}],93:[function(require,module,exports){
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

},{"./getFormData":48,"./http/jsonOrText":59,"./http/request":62,"./re":83}],94:[function(require,module,exports){
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

},{"./addClass":26,"./hasClass":56,"./rea":84,"./removeClass":86}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
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
      field = q(form, '[name=' + p2 + ']');
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

},{"./isInputCheckable":72,"./re":83}],96:[function(require,module,exports){
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

},{"./re":83}],97:[function(require,module,exports){
module.exports = function(sourceEl, parent) {
    let r = sourceEl.cloneNode(true);
    parent.appendChild(r);
    return r;
}
},{}],98:[function(require,module,exports){
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
},{"./cloneAndAppend":97}],99:[function(require,module,exports){
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
},{}],100:[function(require,module,exports){
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
},{}],101:[function(require,module,exports){
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
},{"./getElementDimensions":99,"./replaceContent":102,"./slides":104,"stepper":106,"swipe":107}],102:[function(require,module,exports){
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
},{}],103:[function(require,module,exports){
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
},{"./getElementOuterDimensions":100}],104:[function(require,module,exports){
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
},{"./elementsCollection":98,"./getElementOuterDimensions":100,"./slide":103}],105:[function(require,module,exports){
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
},{}],106:[function(require,module,exports){
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
},{"./bezier2.js":105}],107:[function(require,module,exports){
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

},{}],108:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _request = _interopRequireDefault(require("dom-helpers/src/http/request"));
var _clickp = _interopRequireDefault(require("dom-helpers/src/event/clickp"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  init: function init() {
    (0, _clickp["default"])('[data-buttondelete]', function (ev, el) {
      ev.preventDefault();
      if (el.dataset.url) {
        (0, _request["default"])('DELETE', el.dataset.url).then(function (r) {
          if (el.dataset.redirect) {
            window.location.href = el.dataset.redirect;
          }
        });
      }
    });
  },
  /**
   * Pārbauda vai padotais el ir delete button
   */
  isButtonDelete: function isButtonDelete(el) {
    if ('buttondelete' in el.dataset) {
      return true;
    }
    return false;
  }
};

},{"dom-helpers/src/event/clickp":37,"dom-helpers/src/http/request":62}],109:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _post = _interopRequireDefault(require("dom-helpers/src/http/post"));
var _clickp = _interopRequireDefault(require("dom-helpers/src/event/clickp"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  init: function init() {
    (0, _clickp["default"])('[data-buttonpost]', function (ev, el) {
      console.log('asdad post', el.dataset.url);
      ev.preventDefault();
      if (el.dataset.url) {
        (0, _post["default"])(el.dataset.url).then(function (r) {
          if (el.dataset.redirect) {
            window.location.href = el.dataset.redirect;
          }
        });
      }
    });
  },
  /**
   * Pārbauda vai padotais el ir post button
   */
  isButtonPost: function isButtonPost(el) {
    if ('buttonpost' in el.dataset) {
      return true;
    }
    return false;
  }
};

},{"dom-helpers/src/event/clickp":37,"dom-helpers/src/http/post":60}],110:[function(require,module,exports){
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function Calendar(containerEl) {
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
  if (containerEl.dataset.minDate) {
    calendarProps.minDate = containerEl.dataset.minDate;
  }
  if (containerEl.dataset.maxDate) {
    calendarProps.maxDate = containerEl.dataset.maxDate;
  }
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
    this.calendar.on('dateclick', function (date) {
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
var instances = [];
var _default = exports["default"] = {
  init: function init() {
    _toConsumableArray((0, _domHelpers.qa)('.calendar')).forEach(function (calendarEl) {
      var newLength = instances.push({
        name: calendarEl.dataset.name,
        calendar: new Calendar(calendarEl)
      });
      calendarEl.dataset.calid = newLength - 1;
    });

    // Register method to get calendar instance by name
    window.uiGetCalendarByName = function (name) {
      var instance = instances.find(function (instance) {
        return instance.name == name;
      });
      return instance ? instance.calendar.calendar : null;
    };
  }
};

},{"./calendar/dateCaptionFormatter":116,"./calendar/formatDate":118,"./calendar/monthDayFormatter":120,"./calendar/navNextFormatter":121,"./calendar/navPrevFormatter":122,"./calendar/stringToDate":123,"./calendar/weekDayToText":124,"./helpers/getJsonFromHtml":125,"calendar":4,"dom-helpers":64}],111:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _ButtonDelete = _interopRequireDefault(require("./ButtonDelete"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var container;
var activeClickTriggerEl;
var isOpen = false;

/**
 * Ja nav izveidoti container un calendar, tad tos izveido
 */
function maybeCreateContainerAndCalendar(menuEl) {
  if (!container) {
    container = _domHelpers.jsx.h("div", {
      "class": "overlay-container"
    });
    (0, _domHelpers.append)('body', container);
  }

  // previous menu izņemam ārā un ieliek body, lai nepazūd
  var previousMenuEl = (0, _domHelpers.q)(container, '[data-dropdown-menu-name]');
  if (previousMenuEl) {
    (0, _domHelpers.append)((0, _domHelpers.q)('body'), previousMenuEl);
  }
  (0, _domHelpers.replaceContent)(container, menuEl);
}
function findDropdownMenu(name) {
  return (0, _domHelpers.q)('[data-dropdown-menu-name="' + name + '"]');
}
function close() {
  // Uzliekam hidden klasi uz dropdown menu
  (0, _domHelpers.addClass)((0, _domHelpers.q)(container, '[data-dropdown-menu-name]'), 'hidden');
  container.dataset.visible = '';
  isOpen = false;
  activeClickTriggerEl = undefined;
}
function open(clickTriggerEl, menuEl) {
  activeClickTriggerEl = clickTriggerEl;
  maybeCreateContainerAndCalendar(menuEl);
  isOpen = true;

  // Novācam hidden klasi no dropdown menu
  (0, _domHelpers.removeClass)((0, _domHelpers.q)(container, '[data-dropdown-menu-name]'), 'hidden');
  var side = menuEl.dataset.side;
  var align = menuEl.dataset.align;

  // Pozicionē container pret input lauku
  var p = (0, _domHelpers.getOffset)(clickTriggerEl);
  var triggerDimensions = (0, _domHelpers.getOuterDimensions)(clickTriggerEl);
  var menuDimensions = (0, _domHelpers.getOuterDimensions)(menuEl);
  var gap = 4;
  var css = {};
  if (side == 'bottom' || side == 'top') {
    if (side == 'bottom') {
      css.top = p.top + triggerDimensions.height + gap;
    } else {
      css.top = p.top - menuDimensions.height - gap;
    }

    /**
     * ! css.right apzīmē kādas būs menu labās puses koordinātes
     * tas vajadzīgs, lai noteiktu, vai menu būs ārpus window robežām
     */

    if (align == 'left') {
      css.left = p.left;
      css.right = p.left + menuDimensions.width;
    } else if (align == 'right') {
      css.left = p.left + triggerDimensions.width - menuDimensions.width;
      css.right = css.left;
    } else if (align == 'center') {
      css.left = p.left + triggerDimensions.width / 2 - menuDimensions.width / 2;
      css.right = css.left + menuDimensions.width / 2;
    }
  }

  // Ierobežojam left, ja tas ir novieto menu ārpus window robežām
  var windowDimensions = (0, _domHelpers.getWindowDimensions)();
  // Atņemam scrollbar width
  windowDimensions.width = windowDimensions.width - 20;
  if (css.right > windowDimensions.width) {
    css.left = css.left - (css.right - windowDimensions.width) - gap;
  } else if (css.left < gap) {
    css.left = gap;
  }
  (0, _domHelpers.addStyle)(container, {
    top: css.top + 'px',
    left: css.left + 'px'
  });
  container.dataset.visible = 'yes';
}
function setOverrideFromClickTriggerEl(clickTriggerEl, menuEl) {
  (0, _domHelpers.qa)(menuEl, '[data-role="menuitem"]').forEach(function (menuItemEl) {
    if (menuItemEl.dataset.linkSource) {
      menuItemEl.setAttribute('href', clickTriggerEl.getAttribute(menuItemEl.dataset.linkSource));
      if (_ButtonDelete["default"].isButtonDelete(menuItemEl)) {
        menuItemEl.setAttribute('data-url', clickTriggerEl.getAttribute(menuItemEl.dataset.linkSource));
      }
    }
    if (menuItemEl.dataset.redirectSource) {
      menuItemEl.setAttribute('data-redirect', clickTriggerEl.getAttribute(menuItemEl.dataset.redirectSource));
    }
  });
}
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.click)('html', function (ev, el) {
      if (isOpen) {
        var clickTriggerEl = (0, _domHelpers.parent)(ev.target, '[data-dropdown-menu]');

        // Ja nospiests jau uz nospiestā click trigger
        if (clickTriggerEl && activeClickTriggerEl === clickTriggerEl) {}
        // Ja el nav container, tad aizveram container
        else if ((0, _domHelpers.isChild)(ev.target, container)) {} else {
          close();
        }
      }
    });

    // Click triggeri, kuri atvērs menu
    (0, _domHelpers.click)('[data-dropdown-menu]', function (ev, clickTriggerEl) {
      if (clickTriggerEl.dataset.dropdownMenu) {
        var menuEl = findDropdownMenu(clickTriggerEl.dataset.dropdownMenu);
        if (menuEl) {
          if (isOpen) {
            close();
          } else {
            setOverrideFromClickTriggerEl(clickTriggerEl, menuEl);
            open(clickTriggerEl, menuEl);
          }
        }
      }
    });
  }
};

},{"./ButtonDelete":108,"dom-helpers":64}],112:[function(require,module,exports){
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
var _getJsonFromHtml = _interopRequireDefault(require("./helpers/getJsonFromHtml"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function sp(s) {
  s = s + '';
  if (s.length == 1) {
    s = '0' + s;
  }
  return s;
}
function ymd(date) {
  return date.getFullYear() + '-' + sp(date.getMonth() + 1) + '-' + sp(date.getDate());
}
var calendar;
var container;
var activeField;
var isOpen = false;
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
function triggerEvent(el, eventName) {
  var event = new Event(eventName, {
    bubbles: true
  });
  // Dispatch it.
  el.dispatchEvent(event);
  return;
}

/**
 * Ja nav izveidoti container un calendar, tad tos izveido
 */
function maybeCreateContainerAndCalendar() {
  if (!container) {
    container = _domHelpers.jsx.h("div", {
      "class": "overlay-container"
    }, _domHelpers.jsx.h("div", {
      "class": "card is-overlay compact"
    }, _domHelpers.jsx.h("div", {
      "class": "card-content"
    }, _domHelpers.jsx.h("div", {
      "class": "calendar size-8",
      "data-calendarcontainer": "yes"
    }))));
    (0, _domHelpers.append)('body', container);
  }
  if (!calendar) {
    calendar = createCalendar(new Date());
    calendar.on('dateclick', dateSelected);
    (0, _domHelpers.replaceContent)((0, _domHelpers.q)(container, '[data-calendarcontainer]'), calendar.getEl());
  }
}
function dateSelected(date) {
  if (!activeField) {
    return;
  }
  activeField.value = ymd(date);

  /**
   * @todo šo vēl vajag kārtīgi pārbaudīt
   * tieši event trigerošanu, lai nostrādā visi
   * citi change eventi
   */
  triggerEvent(activeField, 'change');
  close();
}
function close() {
  activeField = null;
  container.dataset.visible = '';
  isOpen = false;
}
function open(field) {
  maybeCreateContainerAndCalendar();
  activeField = field;

  // Calendar props specific to current input field
  setTimeout(function () {
    // Default date state
    calendar.setDefaultDateState((0, _getJsonFromHtml["default"])((0, _domHelpers.parent)(activeField, '.field-date'), 'default-date-state'));
    // State
    calendar.setState((0, _getJsonFromHtml["default"])((0, _domHelpers.parent)(activeField, '.field-date'), 'state'));

    // State url
    calendar.setStateUrl(field.dataset.stateUrl ? field.dataset.stateUrl : '');
    // Min max date
    calendar.setMinDate(field.dataset.minDate ? field.dataset.minDate : '');
    calendar.setMaxDate(field.dataset.maxDate ? field.dataset.maxDate : '');

    // Current date
    calendar.setSelectedDate(activeField.value);

    // Show
    //setTimeout(() => {
    container.dataset.visible = 'yes';
    isOpen = true;
    //}, 10)
  }, 10);

  // Pozicionē container pret input lauku
  var p = (0, _domHelpers.getOffset)(field);
  (0, _domHelpers.addStyle)(container, {
    top: p.top + 40 + 'px',
    left: p.left + 'px'
  });
}
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.click)('html', function (ev, el) {
      if (isOpen) {
        // Ja el nav date pickerī, tad aizveram kalendāru
        if (!(0, _domHelpers.isChild)(ev.target, container)) {
          close();
        }
      }
    });
    (0, _domHelpers.click)('.field-date input', function (ev, el) {
      open(el);
    });
  }
};

},{"./calendar/dateCaptionFormatter":116,"./calendar/monthDayFormatter":120,"./calendar/navNextFormatter":121,"./calendar/navPrevFormatter":122,"./calendar/weekDayToText":124,"./helpers/getJsonFromHtml":125,"calendar":4,"dom-helpers":64}],113:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var FieldSelect = {
  onChangeValue: function onChangeValue(selectEl) {
    var container = (0, _domHelpers.parent)(selectEl, '[data-is-container]');
    if (container) {
      (0, _domHelpers.q)(container, '[data-value-text]').innerHTML = (0, _domHelpers.q)(selectEl, 'option:checked').innerHTML;
    }
  },
  setEvents: function setEvents() {
    var _this = this;
    (0, _domHelpers.on)('change', '.field-select select', function (ev, selectEl) {
      _this.onChangeValue(selectEl);
    });
  },
  init: function init() {
    // Select
    (0, _domHelpers.qa)('.field-select').forEach(function (el) {
      return FieldSelect.onChangeValue((0, _domHelpers.q)(el, 'select'));
    });
    this.setEvents();
  }
};
var _default = exports["default"] = FieldSelect;

},{"dom-helpers":64}],114:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _domHelpers = require("dom-helpers");
var _default = exports["default"] = {
  init: function init() {
    (0, _domHelpers.on)('focusout', 'input', function (ev, el) {
      var data = (0, _domHelpers.getFormData)((0, _domHelpers.parent)(el, 'tr'));
      var link = '';
      if (data.id) {
        link = (0, _domHelpers.parent)(el, '.table').dataset.linkUpdate;

        /**
         * TODO vajag kaut kā dabūt link, lai te nekas nav jārepleico
         */
        link = link.replace('#id#', data.id);
      } else {
        link = (0, _domHelpers.parent)(el, '.table').dataset.linkCreate;
      }
      (0, _domHelpers.post)(link, data).then(function (r) {
        return console.log(r);
      });
    });
  }
};

},{"dom-helpers":64}],115:[function(require,module,exports){
"use strict";

var _ButtonDelete = _interopRequireDefault(require("./ButtonDelete"));
var _ButtonPost = _interopRequireDefault(require("./ButtonPost"));
var _DropdownMenu = _interopRequireDefault(require("./DropdownMenu"));
var _FieldSelect = _interopRequireDefault(require("./FieldSelect"));
var _FieldDate = _interopRequireDefault(require("./FieldDate"));
var _Calendar = _interopRequireDefault(require("./Calendar"));
var _Table = _interopRequireDefault(require("./Table"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_ButtonDelete["default"].init();
_ButtonPost["default"].init();
_DropdownMenu["default"].init();
_FieldSelect["default"].init();
_FieldDate["default"].init();
_Calendar["default"].init();
_Table["default"].init();

},{"./ButtonDelete":108,"./ButtonPost":109,"./Calendar":110,"./DropdownMenu":111,"./FieldDate":112,"./FieldSelect":113,"./Table":114}],116:[function(require,module,exports){
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

},{"./formatDate":118,"dom-helpers":64}],117:[function(require,module,exports){
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

},{}],118:[function(require,module,exports){
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

},{"./dayCaption":117,"./monthCaption":119}],119:[function(require,module,exports){
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

},{}],120:[function(require,module,exports){
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

},{"dom-helpers":64}],121:[function(require,module,exports){
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

},{"dom-helpers":64}],122:[function(require,module,exports){
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

},{"dom-helpers":64}],123:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
var _default = exports["default"] = stringToDate;

},{}],124:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function weekDayToText(dayIndex) {
  return ['', 'P', 'O', 'T', 'C', 'Pk', 'S', 'Sv'][dayIndex];
}
var _default = exports["default"] = weekDayToText;

},{}],125:[function(require,module,exports){
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

},{"dom-helpers":64}]},{},[115]);
