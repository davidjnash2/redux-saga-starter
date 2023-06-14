import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.jsx';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';


const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};

// saga function
// do not usually need action as an argument for get/fetch; 
// using it here so it can be logged for demonstration
function* fetchElements(action) {
    try {

        console.log('firstSaga was hit with action', action);
        // hold response from server in elementResponse
        const elementResponse = yield axios.get('/api/element');
        // after server response, then this enerator function/saga continues
        yield put({ type: 'SET_ELEMENTS', payload: elementResponse.data })
    } catch (error) {
        console.log('error fetching elements', error)
    }
}

// post generator functions need action argument
function* postElement(action) {
    try {
        // send axios post to server with payload
        yield axios.post('/api/element', action.payload);
        // trigger fetchElements saga
        yield put({ type: 'FETCH_ELEMENTS' })
    } catch (error) {
        console.log('error POSTing element', error);
    }
}

// this is the saga that will watch for actions
function* rootSaga() {
    // every time an action with type 'FETCH_ELEMENTS is 
    // dispatched, run fetchElements
    yield takeLatest('FETCH_ELEMENTS', fetchElements);
    yield takeLatest('ADD_ELEMENT', postElement);
}


const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>
);


// generator functions:

// function* myGenerator() {
//     yield true;
//     yield 100;
//     yield 'Oh, hello!';
//     yield [1, 2, 3];
// }


// function* countDownGenerator() {
//     let a = 10;
//     while (a > 0) {
//         yield `Launching in ${a}`;
//         a -= 1;
//     }
//     yield `Take off!`;
// }

// let blastOff = countDownGenerator();

// yield means pause the function and 
// wait until it is called again
// let runMyGenerator = myGenerator();
// console.log('runMyGenerator is :', runMyGenerator);
// console.log('next:', runMyGenerator.next().value);
// console.log('next:', runMyGenerator.next().value);
// console.log('next:', runMyGenerator.next().value);
// console.log('next:', runMyGenerator.next().value);
// console.log('next:', runMyGenerator.next().value);
// console.log('next:', runMyGenerator.next().value);
// console.log('next:', runMyGenerator.next().value);
// console.log('next:', runMyGenerator.next().value);
// console.log('next:', runMyGenerator.next().value);
