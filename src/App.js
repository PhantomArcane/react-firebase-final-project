// ... (imports at the top)
import './App.css';

function App() {
  // ... (keep all your state and logic from before)

  return (
    <div className="container">
      <h1>🎓 Student Records</h1>
      
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" required />
        </div>

        <div className="form-group">
          <label>Course</label>
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. BSIT" required />
        </div>

        <div className="form-group">
          <label>Year Level</label>
          <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        <button type="submit">➕ Save Record</button>
      </form>

      <hr style={{ margin: '30px 0', opacity: '0.2' }} />
      
      <h2>📋 Saved Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id} className="record-item">
            <strong>{student.name}</strong><br />
            <span style={{ color: '#777' }}>{student.course} • Year {student.yearLevel}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;