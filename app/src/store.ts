import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { apiMiddleware } from 'redux-api-middleware';
import reduxThunk from 'redux-thunk';

import { reducers } from './store/reducers';

export const history: History = createBrowserHistory();

export const initStore = (): { store: Store } => {
  const initialStore = {};

  const store: Store = createStore(
    reducers(history),
    initialStore,
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), apiMiddleware, reduxThunk)
    )
  );

  return { store };
};
