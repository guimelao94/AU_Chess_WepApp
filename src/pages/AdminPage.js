import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../Fire';
import Footer from '../components/Footer';
import { initializeSongs } from '../utils/initializeSongs';

const SECRET_CODE = 'wsnov1'; // Change this to your desired secret code

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    category: 'Contemporary',
    tempo: 'Fast',
    title: '',
    lyrics: ''
  });

  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if already authenticated (stored in localStorage)
    const authStatus = localStorage.getItem('worshipJamAdmin');
    if (authStatus === 'authenticated') {
      setAuthenticated(true);
      loadSongs();
      // Initialize all songs if they don't exist
      initializeSongs().then((result) => {
        if (result.success && result.count > 0) {
          setSuccessMessage(`Initialized ${result.count} songs!`);
          setTimeout(() => {
            setSuccessMessage('');
            loadSongs();
          }, 2000);
        } else if (result.success) {
          loadSongs();
        }
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (code === SECRET_CODE) {
      setAuthenticated(true);
      setError('');
      localStorage.setItem('worshipJamAdmin', 'authenticated');
      // Initialize all songs if they don't exist
      const result = await initializeSongs();
      if (result.success && result.count > 0) {
        setSuccessMessage(`Initialized ${result.count} songs!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
      loadSongs();
    } else {
      setError('Invalid code. Please try again.');
      setCode('');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('worshipJamAdmin');
    setCode('');
    setFormData({
      category: 'Contemporary',
      tempo: 'Fast',
      title: '',
      lyrics: ''
    });
    setEditingSong(null);
    setSongs([]);
    window.location.reload(); // Refresh to clear authenticated state across all pages
  };

  const loadSongs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'songs'));
      const songsList = [];
      querySnapshot.forEach((doc) => {
        songsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      // Sort by category then title in memory
      songsList.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.title.localeCompare(b.title);
      });
      setSongs(songsList);
    } catch (error) {
      console.error('Error loading songs:', error);
      setError('Error loading songs');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.title.trim() || !formData.lyrics.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      if (editingSong) {
        // Update existing song
        await updateDoc(doc(db, 'songs', editingSong.id), {
          category: formData.category,
          tempo: formData.tempo,
          title: formData.title.trim(),
          lyrics: formData.lyrics.trim(),
          updatedAt: new Date()
        });
        setSuccessMessage('Song updated successfully!');
      } else {
        // Add new song
        await addDoc(collection(db, 'songs'), {
          category: formData.category,
          tempo: formData.tempo,
          title: formData.title.trim(),
          lyrics: formData.lyrics.trim(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setSuccessMessage('Song added successfully!');
      }

      // Reset form
      setFormData({
        category: 'Contemporary',
        tempo: 'Fast',
        title: '',
        lyrics: ''
      });
      setEditingSong(null);
      loadSongs();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving song:', error);
      setError('Error saving song. Please try again.');
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setFormData({
      category: song.category,
      tempo: song.tempo,
      title: song.title,
      lyrics: song.lyrics
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (songId) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        await deleteDoc(doc(db, 'songs', songId));
        setSuccessMessage('Song deleted successfully!');
        loadSongs();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting song:', error);
        setError('Error deleting song. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setEditingSong(null);
    setFormData({
      category: 'Contemporary',
      tempo: 'Fast',
      title: '',
      lyrics: ''
    });
    setError('');
    setSuccessMessage('');
  };

  if (!authenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header className="header">
          <div className="header-content">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', flex: 1, textAlign: 'center' }}>
              <h1>Song Library</h1>
            </Link>
          </div>
        </header>

        <main className="container">
          <div className="admin-page">
            <div className="auth-form">
              <h2>Admin Login</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="code">Secret Code</label>
                  <input
                    type="password"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter secret code"
                    required
                    autoFocus
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="button">Login</button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="header">
        <div className="header-content">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', flex: 1, textAlign: 'center' }}>
            <h1>Song Library - Admin</h1>
          </Link>
          <button onClick={handleLogout} className="button button-secondary button-small" style={{ marginLeft: 'auto' }}>
            Logout
          </button>
        </div>
      </header>

      <main className="container">
        <div className="admin-page">
          <div className="auth-form">
            <h2>{editingSong ? 'Edit Song' : 'Add New Song'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Contemporary">Contemporary</option>
                  <option value="Gospel">Gospel</option>
                  <option value="Hymns">Hymns</option>
                  <option value="Traditional">Traditional</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tempo">Tempo</label>
                <select
                  id="tempo"
                  name="tempo"
                  value={formData.tempo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Fast">Fast</option>
                  <option value="Slow">Slow</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="title">Song Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter song title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lyrics">Lyrics</label>
                <textarea
                  id="lyrics"
                  name="lyrics"
                  value={formData.lyrics}
                  onChange={handleInputChange}
                  placeholder="Enter song lyrics (line breaks will be preserved)"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}

              <div className="button-group">
                <button type="submit" className="button">
                  {editingSong ? 'Update Song' : 'Add Song'}
                </button>
                {editingSong && (
                  <button type="button" onClick={handleCancel} className="button button-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="songs-list-admin">
            <h2 style={{ color: '#0d4a47', marginBottom: '24px' }}>
              Existing Songs ({songs.length})
            </h2>
            {songs.length === 0 ? (
              <div className="empty-state">
                <p>No songs added yet. Start by adding a song above.</p>
              </div>
            ) : (
              songs.map((song) => (
                <div key={song.id} className="song-item-admin">
                  <h3>{song.title}</h3>
                  <p>
                    <strong>Category:</strong> {song.category} • <strong>Tempo:</strong> {song.tempo}
                  </p>
                  <div className="button-group">
                    <button
                      onClick={() => handleEdit(song)}
                      className="button button-secondary button-small"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(song.id)}
                      className="button button-danger button-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminPage;

