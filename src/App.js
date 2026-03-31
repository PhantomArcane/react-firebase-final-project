import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Ensure your firebase.js exports 'db'
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

function App() {
  // 1. State for Form Inputs
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("1");
  
  // 2. State for Displaying Records
  const [students, setStudents] = useState([]);

  // 3. Effect to Retrieve Records from Firestore in Real-time
  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentArr = [];
      querySnapshot.forEach((doc) => {
        studentArr.push({ ...doc.data(), id: doc.id });
      });
      setStudents(studentArr);
    });
    return () => unsubscribe();
  }, []);

  // 4. Function to Save Data to Firestore
  const handleSave = async (e) => {
    e.preventDefault();
    if (name !== "" && course !== "") {
      await addDoc(collection(db, "students"), {
        name: name,
        course: course,
        yearLevel: yearLevel,
      });
      // Clear fields after saving
      setName("");
      setCourse("");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Student Record Form</h1>
      
      {/* --- INPUT FORM --- */}
      <form onSubmit={handleSave} style={{ marginBottom: '30px' }}>
        <div>
          <label>Name: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
        </div>
        <br />
        <div>
          <label>Course: </label>
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course Name" required />
        </div>
        <br />
        <div>
          <label>Year Level: </label>
          <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <br />
        <button type="submit">Save Student</button>
      </form>

      {/* --- DISPLAY SECTION --- */}
      <hr />
      <h2>Saved Records</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <strong>{student.name}</strong> - {student.course} (Year {student.yearLevel})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;