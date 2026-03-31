import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  
  const notesCollection = collection(db, "notes");

  const addNote = async () => {
    if (note.trim() === "") return;
    await addDoc(notesCollection, {
      text: note,
      createdAt: new Date().toISOString() 
    });
    setNote("");
    fetchNotes(); 
  };

  const fetchNotes = async () => {
    const data = await getDocs(notesCollection);
    const fetchedNotes = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setNotes(fetchedNotes);
  };

  const saveEdit = async (id) => {
    const noteDoc = doc(db, "notes", id);
    await updateDoc(noteDoc, { text: editText });
    setEditingId(null); 
    fetchNotes(); 
  };

  const deleteNote = async (id) => {
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
    fetchNotes(); 
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="app-wrapper">
      <div className="glass-container">
        <h1 className="gradient-text">Cloud Notes</h1>
        <p className="subtitle">Sync your thoughts instantly.</p>
        
        <div className="input-section">
          <input
            type="text"
            placeholder="Type a new note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="sleek-input"
          />
          <button onClick={addNote} className="gradient-btn">
            Save Note
          </button>
        </div>

        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="empty-text">No notes yet. Start typing!</p>
          ) : (
            notes.map((n) => (
              <div className="note-card" key={n.id}>
                {editingId === n.id ? (
                  <div className="edit-section">
                    <input 
                      type="text" 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)} 
                      className="sleek-input edit-input"
                      autoFocus
                    />
                    <button onClick={() => saveEdit(n.id)} className="save-edit-btn">Save</button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="note-content">
                      <p className="note-text">{n.text}</p>
                      <span className="timestamp">{formatDate(n.createdAt)}</span>
                    </div>
                    <div className="action-buttons">
                      <button 
                        onClick={() => {
                          setEditingId(n.id);
                          setEditText(n.text);
                        }} 
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteNote(n.id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;