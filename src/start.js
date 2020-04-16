import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
//REDUX
import reducer from "./reducer";
import { init } from "./sockets";

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;

if (location.pathname === "/welcome") {
  component = <Welcome />;
} else {
  init(store);
  component = (
    <Provider store={store}>
      <App />;
    </Provider>
  );
}

ReactDOM.render(component, document.querySelector("main"));
