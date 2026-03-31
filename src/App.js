import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import './App.css';

function App() {
  // 1. State for Form Inputs (Name, Course, Year Level)
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("1st Year");
  
  // 2. State for Displaying Records
  const [students, setStudents] = useState([]);

  // 3. Real-time Listener (Retrieves all saved records) [cite: 618]
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

  // 4. Save Function (Writes data to Firestore) [cite: 617]
  const handleSave = async (e) => {
    e.preventDefault();
    if (name.trim() !== "" && course.trim() !== "") {
      try {
        await addDoc(collection(db, "students"), {
          name: name,
          course: course,
          yearLevel: yearLevel,
          createdAt: new Date().toISOString()
        });
        // Clear fields after saving
        setName("");
        setCourse("");
        setYearLevel("1st Year");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="glass-container">
        <h1 className="gradient-text">Student Records</h1>
        <p className="subtitle">Platform Technology Lab Exercise</p>
        
        {/* --- INPUT FORM --- [cite: 613] */}
        <form onSubmit={handleSave} className="input-section">
          <div className="form-group">
            <label>Student Name</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter full name" 
              className="sleek-input"
              required 
            />
          </div>

          <div className="form-group">
            <label>Course</label>
            <input 
              value={course} 
              onChange={(e) => setCourse(e.target.value)} 
              placeholder="Enter course (e.g. BSIT)" 
              className="sleek-input"
              required 
            />
          </div>

          <div className="form-group">
            <label>Year Level</label>
            <select 
              value={yearLevel} 
              onChange={(e) => setYearLevel(e.target.value)}
              className="sleek-input"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <button type="submit" className="gradient-btn">
            Save Student Record
          </button>
        </form>

        {/* --- DISPLAY SECTION --- [cite: 618] */}
        <div className="notes-list">
          <h2 className="gradient-text" style={{fontSize: '1.5rem', marginTop: '20px'}}>Saved Records</h2>
          {students.length === 0 ? (
            <p className="empty-text">No records found. Add a student above!</p>
          ) : (
            students.map((student) => (
              <div key={student.id} className="note-card">
                <div className="note-content">
                  <p className="note-text" style={{fontWeight: 'bold'}}>{student.name}</p>
                  <p className="timestamp">{student.course} • {student.yearLevel}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// CRITICAL: The default export Vercel was looking for!
export default App;