"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _refresh = _interopRequireDefault(require("./refresh"));

var RefreshReact =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(RefreshReact, _Component);

  function RefreshReact() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, RefreshReact);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(RefreshReact)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "state", {
      status: ''
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "refresh", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "container", _react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onRefresh", function () {
      return _this.props.onRefresh();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "refreshInit", function () {
      var _this$props = _this.props,
          direction = _this$props.direction,
          loadFull = _this$props.loadFull,
          autoLoading = _this$props.autoLoading;
      _this.refresh = (0, _refresh.default)(_this.container.current, {
        direction: direction,
        callback: _this.onRefresh,
        loadFull: loadFull,
        statusChange: function statusChange(status) {
          _this.setState({
            status: status
          });
        },
        autoLoading: autoLoading
      });

      _this.refresh.init();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "resetScroll", function () {
      _this.refresh.resetScroll();
    });
    return _this;
  }

  (0, _createClass2.default)(RefreshReact, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.disable !== prevProps.disable) {
        if (!this.props.disable) {
          this.refreshInit();
        } else {
          this.refresh.destory();
        }
      }

      if (this.props.lock !== prevProps.lock) {
        this.refresh.lockScroll(this.props.lock);
      }

      if (this.props.loading !== prevProps.loading) {
        if (this.props.loading) {
          this.refresh.showLoading();
        } else {
          this.refresh.endSuccess();
        }
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.disable) {
        this.refreshInit();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.refresh && this.refresh.destory();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          className = _this$props2.className,
          indicator = _this$props2.indicator,
          direction = _this$props2.direction;
      var cls = (0, _classnames.default)(className, 'godz-hardware');
      var isUp = direction === 'both' || direction === 'up';
      var isDown = direction === 'both' || direction === 'down';
      return _react.default.createElement("div", {
        className: cls,
        ref: this.container
      }, isDown && _react.default.createElement("div", {
        className: "godz-pr-down"
      }, _react.default.createElement("div", {
        className: "godz-pr-indicator"
      }, _react.default.createElement("div", {
        className: "godz-pr-box"
      }, _react.default.createElement("div", {
        className: "godz-pr-text"
      }, indicator.down(this.state.status))))), this.props.children, isUp && _react.default.createElement("div", {
        className: "godz-pr-up"
      }, _react.default.createElement("div", {
        className: "godz-pr-box"
      }, _react.default.createElement("div", {
        className: "godz-pr-text"
      }, indicator.up()))));
    }
  }]);
  return RefreshReact;
}(_react.Component);

(0, _defineProperty2.default)(RefreshReact, "defaultProps", {
  onRefresh: function onRefresh() {},
  loading: false,
  indicator: {
    up: function up() {
      return '加载中...';
    },
    down: function down(status) {
      switch (status) {
        case 'deactivate':
          return '下拉刷新';

        case 'activate':
          return '释放加载';

        case 'release':
          return 'loading';

        case 'finish':
          return '加载完成';
      }
    }
  },
  disable: false,
  lock: false,
  loadFull: {
    enable: false
  },
  direction: 'up',
  autoLoading: false
});
var _default = RefreshReact;
exports.default = _default;