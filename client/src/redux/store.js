import { configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    // FLUSH,
    // REHYDRATE,
    // PAUSE,
    PERSIST,
    // PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authReducer';
import requestsReducer from './fRequests'

const authPersistConfig = {
    key: 'auth',
    version: 1,
    storage,
}

const requestsPersistConfig ={
    key: 'requests',
    version: 1,
    storage,
}

const authPersistedReducer = persistReducer(authPersistConfig, authReducer);
const requestsPersistReducer = persistReducer(requestsPersistConfig,requestsReducer);

export const store = configureStore({
    reducer: {
        auth: authPersistedReducer,
        requests: requestsPersistReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [PERSIST, REGISTER],
                // ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export let persistor = persistStore(store)