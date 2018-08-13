"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RefreshReact = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var RefreshReact =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(RefreshReact, _Component);

  function RefreshReact() {
    (0, _classCallCheck2.default)(this, RefreshReact);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RefreshReact).apply(this, arguments));
  }

  (0, _createClass2.default)(RefreshReact, [{
    key: "render",
    value: function render() {
      return _react.default.createElement("div", null, "123F");
    }
  }]);
  return RefreshReact;
}(_react.Component);

exports.RefreshReact = RefreshReact;
var _default = RefreshReact;
exports.default = _default;