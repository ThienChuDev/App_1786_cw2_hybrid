const {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  ref,
  set,
} = require("firebase/firestore");
const { connectDatabase, db } = require("../config/firebase");

class Crud {
  async createClass(req, res, next) {
    const {
      sessionId,
      teacherId,
      dayOfWeek,
      timeStart,
      timeEnd,
      capacity,
      duration,
      pricePerClass,
      kind_of_classe,
    } = req.body;

    try {
      const docRef = await addDoc(collection(db, "Classes"), req.body);
      res.status(201).send(`Class created with ID: ${docRef.id}`);
    } catch (error) {
      console.log(error);
      return res.send("err");
    }
  }
}

module.exports = new Crud();
