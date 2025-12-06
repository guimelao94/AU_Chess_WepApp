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
  const [showFormModal, setShowFormModal] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('worshipJamAdmin');
    if (authStatus === 'authenticated') {
      setAuthenticated(true);
      loadSongs();
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
    window.location.reload();
  };

  const loadSongs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'songs'));
      const songsList = [];
      querySnapshot.forEach((doc) => {
        songsList.push({
          id: doc.id,
          ...doc.data(),
          visible: doc.data().visible ?? false
        });
      });
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
    setFormData((prev) => ({
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
        await updateDoc(doc(db, 'songs', editingSong.id), {
          category: formData.category,
          tempo: formData.tempo,
          title: formData.title.trim(),
          lyrics: formData.lyrics.trim(),
          visible: editingSong.visible ?? false,
          updatedAt: new Date()
        });
        setSuccessMessage('Song updated successfully!');
      } else {
        await addDoc(collection(db, 'songs'), {
          category: formData.category,
          tempo: formData.tempo,
          title: formData.title.trim(),
          lyrics: formData.lyrics.trim(),
          visible: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setSuccessMessage('Song added successfully!');
      }

      setFormData({
        category: 'Contemporary',
        tempo: 'Fast',
        title: '',
        lyrics: ''
      });
      setEditingSong(null);
      loadSongs();
      setShowFormModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving song:', error);
      setError('Error saving song. Please try again.');
    }
  };

  const handleEdit = (song) => {
    openEditModal(song);
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
    setShowFormModal(false);
  };

  const openAddModal = () => {
    setEditingSong(null);
    setFormData({
      category: 'Contemporary',
      tempo: 'Fast',
      title: '',
      lyrics: ''
    });
    setShowFormModal(true);
  };

  const openEditModal = (song) => {
    setEditingSong(song);
    setFormData({
      category: song.category,
      tempo: song.tempo,
      title: song.title,
      lyrics: song.lyrics
    });
    setShowFormModal(true);
  };

  const toggleVisibility = async (song) => {
    try {
      await updateDoc(doc(db, 'songs', song.id), {
        visible: !song.visible,
        updatedAt: new Date()
      });
      setSongs((prev) =>
        prev.map((s) => (s.id === song.id ? { ...s, visible: !s.visible } : s))
      );
    } catch (error) {
      console.error('Error toggling visibility:', error);
      setError('Error updating visibility');
    }
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

      <main className="container admin-container">
        <div className="admin-page admin-grid single-column">
          <div className="songs-list-admin admin-list-panel">
            <div className="admin-list-header">
              <div>
                <h2>Existing Songs</h2>
                <span className="admin-muted">{songs.length} total</span>
              </div>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={showHidden}
                  onChange={(e) => setShowHidden(e.target.checked)}
                />
                Show hidden
              </label>
            </div>
            {songs.length === 0 ? (
              <div className="empty-state">
                <p>No songs added yet. Start by adding a song.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Tempo</th>
                      <th>Visible</th>
                      <th style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs
                      .filter((song) => showHidden || song.visible)
                      .map((song) => (
                      <tr key={song.id}>
                        <td>{song.title}</td>
                        <td>{song.category}</td>
                        <td>{song.tempo}</td>
                        <td>
                          <button
                            className="button button-secondary button-small"
                            onClick={() => toggleVisibility(song)}
                          >
                            {song.visible ? 'Hide' : 'Show'}
                          </button>
                        </td>
                        <td>
                          <div className="button-group">
                            <button
                              onClick={() => openEditModal(song)}
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <button className="admin-fab" onClick={openAddModal} aria-label="Add Song">
          +
        </button>
      </main>
      {showFormModal && (
        <div className="admin-modal-backdrop" onClick={handleCancel}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-card-header">
              <h2>{editingSong ? 'Edit Song' : 'Add New Song'}</h2>
              <span className="admin-muted">{editingSong ? 'Update existing entry' : 'Create a new entry'}</span>
            </div>
            <form onSubmit={handleSubmit} className="admin-form-grid modal-form-grid">
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
                  <option value="Christmas">Christmas</option>
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

              <div className="form-group form-group-full">
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

              <div className="form-group form-group-full">
                <label htmlFor="lyrics">Lyrics</label>
                <textarea
                  id="lyrics"
                  name="lyrics"
                  value={formData.lyrics}
                  onChange={handleInputChange}
                  placeholder="Enter song lyrics (line breaks will be preserved)"
                  required
                  rows={10}
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}

              <div className="button-group">
                <button type="submit" className="button">
                  {editingSong ? 'Update Song' : 'Add Song'}
                </button>
                <button type="button" onClick={handleCancel} className="button button-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default AdminPage;

