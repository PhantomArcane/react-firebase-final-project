import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import './App.css';

// --- PAGE 1: THE FORM ---
function StudentForm() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("1st Year");
  const [reason, setReason] = useState("Submitting Homework");
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "students"), {
      name, course, year, reason,
      timestamp: serverTimestamp() // Adds the exact time [cite: 544]
    });
    navigate('/records'); // Moves to the second page automatically
  };

  return (
    <div className="glass-card">
      <h1 className="moon-header">Lunar Registry</h1>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Course</label>
          <input value={course} onChange={(e) => setCourse(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Year Level</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
          </select>
        </div>
        <div className="form-group">
          <label>Reason for Submission</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option>Submitting Homework</option>
            <option>Returning Lab Equipment</option>
            <option>Consultation</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Submit to Cloud</button>
      </form>
      <Link to="/records" className="nav-link">View All Records →</Link>
    </div>
  );
}

// --- PAGE 2: THE RECORDS ---
function RecordsList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  return (
    <div className="glass-card" style={{ maxWidth: '700px' }}>
      <h1 className="moon-header">Registry Records</h1>
      {students.map((s) => (
        <div key={s.id} className="record-card">
          <h3 style={{margin: 0}}>{s.name} <span style={{fontSize: '0.8rem', color: '#6c5ce7'}}>({s.course})</span></h3>
          <p style={{margin: '10px 0', color: '#bbb'}}>{s.reason}</p>
          <span className="timestamp">
            {s.timestamp?.toDate().toLocaleString() || "Syncing..."}
          </span>
        </div>
      ))}
      <Link to="/" className="nav-link">← Back to Form</Link>
    </div>
  );
}

// --- MAIN WRAPPER ---
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<StudentForm />} />
          <Route path="/records" element={<RecordsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;