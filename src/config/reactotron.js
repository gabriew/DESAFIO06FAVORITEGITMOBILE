import ReactoTron from 'reactotron-react-native';

if (__DEV__) {
    const tron = ReactoTron.configure()
        .useReactNative()
        .connect();
    console.tron = tron;
    tron.clear();
}
