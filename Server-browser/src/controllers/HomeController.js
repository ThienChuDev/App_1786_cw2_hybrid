const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
} = require("firebase/firestore");
const { db } = require("../config/firebase");

class HomeController {
  async index(req, res, next) {
    try {
      const colRef = collection(db, "Classes");
      const snapshot = await getDocs(colRef);
      const classesData = [];

      snapshot.forEach((doc) => {
        const classData = { id: doc.id, data: doc.data() };
        classesData.push(classData);
      });
      res.status(200).json(classesData);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error reading documents: " + error.message);
    }
  }

  async register(req, res, next) {
    const { email, name, password } = req.body;
    try {
      const usersCollection = collection(db, "Users");
      if (!email || !name || !password) {
        return res.status(400).json({ msg: "All fields are required" });
      }
      const q = query(usersCollection, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return res.status(400).send("Email already exists");
      }

      if (password.length < 6) {
        return res.status(400).send("Password must be more than 6 characters");
      }
      if (!/[A-Z]/.test(password)) {
        return res.status(400).send("must have capital letters");
      }
      const hashPassword = await bcrypt.hashSync(password, 10);

      addDoc(usersCollection, {
        email,
        name,
        password: hashPassword,
      })
        .then((docRef) => {
          if (docRef.id) {
            res.status(200).json({ msg: "success", id: docRef.id });
          } else {
            res.status(400).json({ msg: "error" });
          }
        })
        .catch((err) => {
          console.error("Error adding document: ", err);
          return res.status(500).json({ msg: "error" });
        });
    } catch (err) {
      console.error("Error adding document: ", err);
      res.status(500).send("error: " + err.message);
    }
  }
  login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Thiếu email hoặc mật khẩu" });
    }

    const usersCollection = collection(db, "Users");
    const querySnapshot = query(usersCollection, where("email", "==", email));
    let user = null;
    getDocs(querySnapshot)
      .then((snapshot) => {
        if (snapshot.empty) {
          return res.status(400).json({ msg: "Email không tồn tại" });
        }
        let userId = null;
        let user = null;
        snapshot.forEach((doc) => {
          user = doc.data();
          userId = doc.id;
        });
        bcrypt.compare(password, user.password, function (error, result) {
          if (error) {
            return res.status(500).send("Lỗi khi kiểm tra mật khẩu");
          }

          if (!result) {
            return res.status(400).send("Sai mật khẩu");
          }

          res
            .status(200)
            .json({ msg: "Đăng nhập thành công", user: userId, email: email });
        });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ msg: "Lỗi trong quá trình đăng nhập", error });
      });
  }

  async logout(req, res, next) {
    res.clearCookie("access_token");
    return res.status(200).json({ msg: "done", error: true });
  }
  async createdBooking(req, res, next) {
    const { userId, classId } = req.body;
    const bookingCollection = collection(db, "booking");
    addDoc(bookingCollection, {
      classId,
      userId,
    })
      .then((docRef) => {
        if (docRef.id) {
          res.status(200).json({ msg: "success" });
        } else {
          res.status(400).json({ msg: "error" });
        }
      })
      .catch((err) => {
        console.error("Error adding document: ", err);
        return res.status(500).json({ msg: "error" });
      });
  }
  async getBookings(req, res, next) {
    const userId = req.params.id;

    try {
      const colRef = collection(db, "booking");
      const bookingQuery = query(colRef, where("userId", "==", userId));
      const bookingSnapshot = await getDocs(bookingQuery);

      if (bookingSnapshot.empty) {
        return res.status(404).json({ message: "No bookings found" });
      }

      const bookings = [];
      for (const bookingDoc of bookingSnapshot.docs) {
        const classId = bookingDoc.data().classId;
        const classDocRef = doc(db, "Classes", classId);
        const classDocSnapshot = await getDoc(classDocRef);
        if (classDocSnapshot.exists()) {
          console.log(`Found class: ${classDocSnapshot.id}`);
          bookings.push({
            bookingId: bookingDoc.id,
            ...bookingDoc.data(),
            classData: classDocSnapshot.data(),
          });
        }
      }
      console.log("Bookings:", bookings);
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error retrieving bookings:", error);
      res.status(500).json({ error: "Failed to retrieve bookings" });
    }
  }
  async deleteBooking(req, res, next) {
    const bookingId = req.params.id;
    try {
      const bookingRef = doc(db, "booking", bookingId);
      const bookingSnapshot = await getDoc(bookingRef);

      if (!bookingSnapshot.exists()) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await deleteDoc(bookingRef);

      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ error: "Failed to delete booking" });
    }
  }
}

module.exports = new HomeController();
