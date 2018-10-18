"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGlobalState = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};

var createGlobalState = function createGlobalState(initialState) {
  var stateItemConsumers = {};
  var stateItemUpdaters = {};

  var StateProvider = function StateProvider(_ref) {
    var children = _ref.children;
    return _react.default.createElement(_react.default.Fragment, null, children);
  };

  Object.keys(initialState).forEach(function (name) {
    var _React$createContext = _react.default.createContext({
      value: initialState[name],
      update: function update() {
        throw new Error('cannot update initial value');
      }
    }),
        Provider = _React$createContext.Provider,
        Consumer = _React$createContext.Consumer;

    stateItemConsumers[name] = function (_ref2) {
      var children = _ref2.children;
      return _react.default.createElement(Consumer, null, function (_ref3) {
        var value = _ref3.value,
            update = _ref3.update;
        return children(value, update);
      });
    };

    var InnerProvider = StateProvider;

    StateProvider =
    /*#__PURE__*/
    function (_React$PureComponent) {
      _inherits(StateProvider, _React$PureComponent);

      function StateProvider() {
        var _this;

        _classCallCheck(this, StateProvider);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(StateProvider).call(this));

        stateItemUpdaters[name] = function (func) {
          if (isFunction(func)) {
            _this.setState(function (state) {
              return Object.assign({}, state, {
                value: func(state.value)
              });
            });
          } else {
            _this.setState({
              value: func
            });
          }
        };

        _this.state = {
          value: initialState[name],
          update: stateItemUpdaters[name]
        };
        return _this;
      }

      _createClass(StateProvider, [{
        key: "render",
        value: function render() {
          var children = this.props.children;
          return _react.default.createElement(Provider, {
            value: this.state
          }, _react.default.createElement(InnerProvider, null, children));
        }
      }]);

      return StateProvider;
    }(_react.default.PureComponent);
  });

  var StateConsumer = function StateConsumer(_ref4) {
    var name = _ref4.name,
        children = _ref4.children;
    return stateItemConsumers[name]({
      children: children
    });
  };

  return {
    StateProvider: StateProvider,
    StateConsumer: StateConsumer,
    stateItemConsumers: stateItemConsumers,
    stateItemUpdaters: stateItemUpdaters
  };
};

exports.createGlobalState = createGlobalState;