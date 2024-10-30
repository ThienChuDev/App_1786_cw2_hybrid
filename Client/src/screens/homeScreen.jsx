import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const [classes, setClasses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchClasses = async () => {
        setLoading(true);
        try {
          const response = await axios.get("http://192.168.1.4:3000/");
          const formattedData = response.data.map((item) => ({
            id: item.id,
            ...item.data,
          }));
          setClasses(formattedData);
        } catch (error) {
          console.error("Error fetching classes:", error);
          Alert.alert("Error", "Failed to fetch classes");
        } finally {
          setLoading(false);
        }
      };

      const fetchUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem("userId");
          const storedEmail = await AsyncStorage.getItem("email");
          if (storedUserId) setUserId(storedUserId);
          if (storedEmail) setEmail(storedEmail);
        } catch (error) {
          console.error("Failed to retrieve user data:", error);
        }
      };

      fetchClasses();
      fetchUserData();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.classItem}>
      <Text style={styles.classText}>Session: {item.sessionId}</Text>
      <Text style={styles.classText}>Teacher: {item.teacherId}</Text>
      <Text style={styles.classText}>Day: {item.dayOfWeek}</Text>
      <Text style={styles.classText}>
        Time: {item.startTime} - {item.endTime}
      </Text>
      <Text style={styles.classText}>Duration: {item.duration} mins</Text>
      <Text style={styles.classText}>Price: {item.pricePerClass} £</Text>
      <Text style={styles.classText}>Capacity: {item.capacity}</Text>
      <Button title="Booking Now" onPress={() => handleBooking(item)} />
    </View>
  );

  const handleBooking = (classItem) => {
    Alert.alert(
      "Confirm Booking",
      `Are you sure you want to book the class: ${classItem.sessionId}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reserve",
          onPress: () => makeBooking(classItem),
        },
      ],
      { cancelable: false }
    );
  };

  const makeBooking = (classItem) => {
    axios
      .post("http://192.168.1.4:3000/booking", {
        classId: classItem.id,
        userId: userId,
      })
      .then((response) => {
        if (response.status === 200) {
          Alert.alert("Booking Successful");
        } else {
          Alert.alert("Booking Failed", "Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Booking error:", error);
        Alert.alert("Error", "Booking failed. Please try again later.");
      });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {email}</Text>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  classItem: {
    width: "100%",
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  classText: {
    marginBottom: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
