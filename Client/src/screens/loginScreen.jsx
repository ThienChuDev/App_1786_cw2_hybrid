import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ onLogin, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your login information.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://192.168.1.4:3000/login", {
        email,
        password,
      });

      if (response.status === 200) {
        console.log(response.data);

        await AsyncStorage.setItem("userId", response.data.user);
        await AsyncStorage.setItem("email", response.data.email);

        Alert.alert("Login successful", `Welcome, ${response.data.email}!`);
        onLogin();
        navigation.navigate("Home", { user: response.data });
      } else {
        Alert.alert("Error", "Invalid credentials, please try again.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to login, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  registerText: {
    marginTop: 15,
    color: "#4CAF50",
    textAlign: "center",
  },
});
