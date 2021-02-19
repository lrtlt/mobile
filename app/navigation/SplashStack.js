import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SplashScreen} from '../screens/';

const SplashStack = createStackNavigator();

export default () => {
  return (
    <SplashStack.Navigator headerMode="none" mode="card">
      <SplashStack.Screen name="Splash" component={SplashScreen} />
    </SplashStack.Navigator>
  );
};
