import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './context/AppContext';
import Login from './login';
import Home from './home';
import JobDetails from './JobDetails';
import Register from './register';
import PersonalInfo from './Personal_Info';
import Save from './Save';        // Add this import
import Applied from './Applied';  // Add this import
import News from './News';        // Add this import
import Closed from './Closed';    // Add this import
import UserInfo from './userinfo'; // adjust path if needed
import AdminDashboard from './AdminDashboard';

const Stack = createNativeStackNavigator();

export default function _layout() {
  return (
    <AppProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="JobDetails" component={JobDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Personal_Information" component={PersonalInfo} options={{ headerShown: false }} />
        <Stack.Screen name="Save" component={Save} options={{ headerShown: false }} />
        <Stack.Screen name="Applied" component={Applied} options={{ headerShown: false }} />
        <Stack.Screen name="News" component={News} options={{ headerShown: false }} />
        <Stack.Screen name="Closed" component={Closed} options={{ headerShown: false }} />
        <Stack.Screen name="UserInfo" component={UserInfo} options={{ headerShown: false }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
      </Stack.Navigator>
    </AppProvider>
  );
}
