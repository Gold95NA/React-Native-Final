import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import {
  RootTabParamList,
  RootStackParamList,
  AirStackParamList,
  PlacesStackParamList,
  SavedStackParamList
} from './src/types/navigation';

import AirList from './src/screens/AirList';
import AirDetail from './src/screens/AirDetail';
import PlacesNearby from './src/screens/PlacesNearby';
import PlaceDetail from './src/screens/PlaceDetail';
import SavedList from './src/screens/SavedList';
import SavedDetail from './src/screens/SavedDetail';
import SettingsModal from './src/screens/SettingsModal';

const Tab = createBottomTabNavigator<RootTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AirStack = createNativeStackNavigator<AirStackParamList>();
const PlacesStack = createNativeStackNavigator<PlacesStackParamList>();
const SavedStack = createNativeStackNavigator<SavedStackParamList>();

function AirStackNavigator() {
  return (
    <AirStack.Navigator>
      <AirStack.Screen
        name="AirList"
        component={AirList}
        options={({ navigation }) => ({
          title: 'Air Quality',
          headerRight: () => (
            <Pressable onPress={() => navigation.getParent()?.navigate('SettingsModal')}>
              <Text style={{ fontSize: 16 }}>Settings</Text>
            </Pressable>
          ),
        })}
      />
      <AirStack.Screen name="AirDetail" component={AirDetail} options={{ title: 'Details' }} />
    </AirStack.Navigator>
  );
}

function PlacesStackNavigator() {
  return (
    <PlacesStack.Navigator>
      <PlacesStack.Screen
        name="PlacesNearby"
        component={PlacesNearby}
        options={({ navigation }) => ({
          title: 'Nearby',
          headerRight: () => (
            <Pressable onPress={() => navigation.getParent()?.navigate('SettingsModal')}>
              <Text style={{ fontSize: 16 }}>Settings</Text>
            </Pressable>
          ),
        })}
      />
      <PlacesStack.Screen name="PlaceDetail" component={PlaceDetail} options={{ title: 'Place' }} />
    </PlacesStack.Navigator>
  );
}

function SavedStackNavigator() {
  return (
    <SavedStack.Navigator>
      <SavedStack.Screen
        name="SavedList"
        component={SavedList}
        options={({ navigation }) => ({
          title: 'Saved',
          headerRight: () => (
            <Pressable onPress={() => navigation.getParent()?.navigate('SettingsModal')}>
              <Text style={{ fontSize: 16 }}>Settings</Text>
            </Pressable>
          ),
        })}
      />
      <SavedStack.Screen name="SavedDetail" component={SavedDetail} options={{ title: 'Saved Item' }} />
    </SavedStack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="AirStack" component={AirStackNavigator} options={{ title: 'Air' }} />
      <Tab.Screen name="PlacesStack" component={PlacesStackNavigator} options={{ title: 'Places' }} />
      <Tab.Screen name="SavedStack" component={SavedStackNavigator} options={{ title: 'Saved' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <RootStack.Navigator>
        <RootStack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <RootStack.Screen name="SettingsModal" component={SettingsModal} options={{ presentation: 'modal', title: 'Settings' }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
