import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import refugeeApp from './reducers';

export default createStore(refugeeApp, {}, applyMiddleware(thunkMiddleware));
