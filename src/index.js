import React from 'react';

const isFunction = fn => (typeof fn === 'function');

export const createGlobalState = (initialState) => {
  const consumers = {};
  const updaters = {};
  let StateProvider = ({ children }) => <React.Fragment>{children}</React.Fragment>;
  Object.keys(initialState).forEach((name) => {
    const { Provider, Consumer } = React.createContext(initialState[name]);
    consumers[name] = Consumer;
    const InnerProvider = StateProvider;
    StateProvider = class extends React.Component {
      constructor() {
        super();
        updaters[name] = (func) => {
          if (isFunction(func)) {
            this.setState(state => Object.assign(state, { value: func(state.value) }));
          } else {
            this.setState({ value: func });
          }
        };
        this.state = { value: initialState[name], update: updaters[name] };
      }

      render() {
        const { children } = this.props;
        return (
          <Provider value={this.state}>
            <InnerProvider>
              {children}
            </InnerProvider>
          </Provider>
        );
      }
    };
  });
  const StateConsumer = ({ name, children }) => {
    const Consumer = consumers[name];
    return (
      <Consumer>
        {({ value, update }) => children(value, update)}
      </Consumer>
    );
  };
  const getUpdater = name => updaters[name];
  return { StateProvider, StateConsumer, getUpdater };
};