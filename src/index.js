import React from 'react';
import './config/reactotron';
import {StatusBar} from 'react-native';

import Routes from './routes';

export default function App() {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#23292E" />
            <Routes />
        </>
    );
}
