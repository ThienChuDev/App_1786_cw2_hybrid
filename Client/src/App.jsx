import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import HomeScreen from "./screens/homeScreen";
import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/registerScreen";
import bookingScreen from "./screens/bookingScreen";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = async (navigation) => {
    try {
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("email");
      const userId = await AsyncStorage.getItem("userId");
      const email = await AsyncStorage.getItem("email");
      console.log("UserId after logout:", userId);
      console.log("Email after logout:", email);
      setIsLoggedIn(false);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {isLoggedIn && (
          <DrawerItem
            label="Logout"
            onPress={() => handleLogout(props.navigation)}
          />
        )}
      </DrawerContentScrollView>
    );
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4CAF50",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Yoga Class Booking" }}
        />
        <Drawer.Screen name="Booking" component={bookingScreen} />
        {!isLoggedIn && (
          <>
            <Drawer.Screen
              name="Login"
              options={{
                title: "Login",
                headerShown: false,
              }}
            >
              {(props) => (
                <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />
              )}
            </Drawer.Screen>
            <Drawer.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
