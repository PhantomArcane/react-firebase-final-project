import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import './App.css';

// --- PAGE 1: THE FORM (Stays the same) ---
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
      timestamp: serverTimestamp()
    });
    navigate('/records');
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
          <label>Reason</label>
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

// --- PAGE 2: THE RECORDS (Now with Delete & Edit!) ---
function RecordsList() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  const deleteRecord = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteDoc(doc(db, "students", id));
    }
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditName(student.name);
  };

  const saveEdit = async (id) => {
    const studentDoc = doc(db, "students", id);
    await updateDoc(studentDoc, { name: editName });
    setEditingId(null);
  };

  return (
    <div className="glass-card" style={{ maxWidth: '700px' }}>
      <h1 className="moon-header">Registry Records</h1>
      {students.map((s) => (
        <div key={s.id} className="record-card">
          {editingId === s.id ? (
            <div className="edit-section">
              <input 
                className="sleek-input" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                autoFocus
              />
              <button onClick={() => saveEdit(s.id)} className="submit-btn" style={{marginTop: '10px', padding: '8px'}}>Save</button>
              <button onClick={() => setEditingId(null)} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Cancel</button>
            </div>
          ) : (
            <>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <h3 style={{margin: 0}}>{s.name} <span style={{fontSize: '0.8rem', color: '#6c5ce7'}}>({s.course})</span></h3>
                  <p style={{margin: '10px 0', color: '#bbb'}}>{s.reason} • {s.year}</p>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button onClick={() => startEdit(s)} style={{background: 'none', border: 'none', color: '#a29bfe', cursor: 'pointer'}}>Edit</button>
                  <button onClick={() => deleteRecord(s.id)} style={{background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer'}}>Delete</button>
                </div>
              </div>
              <span className="timestamp">
                {s.timestamp?.toDate().toLocaleString() || "Syncing..."}
              </span>
            </>
          )}
        </div>
      ))}
      <Link to="/" className="nav-link">← Back to Form</Link>
    </div>
  );
}

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
