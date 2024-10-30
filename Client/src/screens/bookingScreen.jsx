import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const storedUserId = await AsyncStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);
      try {
        const response = await axios.get(
          `http://192.168.1.4:3000/booking/${storedUserId}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        Alert.alert("Error", "Failed to fetch bookings");
      }
    } else {
      Alert.alert("Error", "User ID not found");
      setUserId(null);
      setBookings([]);
    }
    setLoading(false);
  };

  const deleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://192.168.1.4:3000/booking/${bookingId}`);
      Alert.alert("Success", "Booking deleted");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      Alert.alert("Error", "Failed to delete booking");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.classData.dayOfWeek}</Text>
      <Text style={styles.details}>{item.classData.sessionId}</Text>
      <Text style={styles.details}>Teacher: {item.classData.teacherId}</Text>
      <Text style={styles.details}>
        Capacity: {item.classData.capacity} Users
      </Text>
      <Text style={styles.details}>
        Duration: {item.classData.duration} Minutes
      </Text>
      <Text style={styles.details}>
        Time: {item.classData.startTime} - {item.classData.endTime}
      </Text>
      <Text style={styles.details}>
        Price: {item.classData.pricePerClass} £
      </Text>
      <Button
        title="Delete"
        onPress={() =>
          Alert.alert(
            "Delete Booking",
            "Are you sure you want to delete this booking?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "OK", onPress: () => deleteBooking(item.bookingId) },
            ]
          )
        }
        color="#d9534f"
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userId === null ? (
        <Text style={styles.noBookingsText}>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={(item) => item.bookingId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noBookingsText: {
    textAlign: "center",
    fontSize: 18,
    color: "#555",
    marginTop: 20,
  },
});

export default BookingList;
