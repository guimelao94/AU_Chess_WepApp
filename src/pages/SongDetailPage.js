import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, limit, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../Fire';
import Footer from '../components/Footer';

function SongDetailPage() {
  const { category, songName } = useParams();
  const [searchParams] = useSearchParams();
  const tempo = searchParams.get('tempo');
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('worshipJamAdmin');
    setIsAuthenticated(authStatus === 'authenticated');

    const fetchSong = async () => {
      try {
        const decodedCategory = decodeURIComponent(category);
        const decodedSongName = decodeURIComponent(songName);
        
        const q = query(
          collection(db, 'songs'),
          where('category', '==', decodedCategory),
          where('tempo', '==', tempo),
          where('title', '==', decodedSongName),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const songData = {
            id: doc.id,
            ...doc.data()
          };
          setSong(songData);
          setEditedLyrics(songData.lyrics || '');
        } else {
          setSong({
            title: decodedSongName,
            category: decodedCategory,
            tempo: tempo,
            lyrics: null
          });
          setEditedLyrics('');
        }
      } catch (error) {
        console.error('Error fetching song:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [category, songName, tempo]);

  const handleSave = async () => {
    if (!editedLyrics.trim()) {
      setError('Lyrics cannot be empty');
      return;
    }

    try {
      setError('');
      const decodedCategory = decodeURIComponent(category);
      const decodedSongName = decodeURIComponent(songName);

      if (song?.id) {
        // Update existing song
        await updateDoc(doc(db, 'songs', song.id), {
          lyrics: editedLyrics.trim(),
          updatedAt: new Date()
        });
        setSong({ ...song, lyrics: editedLyrics.trim() });
      } else {
        // Create new song entry
        const newDoc = await addDoc(collection(db, 'songs'), {
          category: decodedCategory,
          tempo: tempo,
          title: decodedSongName,
          lyrics: editedLyrics.trim(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setSong({
          id: newDoc.id,
          title: decodedSongName,
          category: decodedCategory,
          tempo: tempo,
          lyrics: editedLyrics.trim()
        });
      }

      setSuccessMessage('Lyrics saved successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving lyrics:', error);
      setError('Error saving lyrics. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedLyrics(song?.lyrics || '');
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="back-button-inline header-button" style={{ position: 'absolute', left: '20px' }}>Go Back</Link>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', flex: 1, textAlign: 'center' }}>
            <h1>Song Library</h1>
          </Link>
        </div>
      </header>

      <main className="container">
        <div className="song-detail">
          <h1 className="song-title-centered">{song?.title}</h1>
          <p className="song-category-centered">
            {song?.category} • {song?.tempo}
          </p>

          {isAuthenticated && (
            <div style={{ marginBottom: '4px', marginTop: '2px' }}>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="button button-secondary button-small"
                >
                  {song?.lyrics ? 'Edit Lyrics' : 'Add Lyrics'}
                </button>
              ) : (
                <div style={{ marginTop: '12px' }}>
                  <div className="form-group">
                    <label htmlFor="lyrics">Lyrics</label>
                    <textarea
                      id="lyrics"
                      value={editedLyrics}
                      onChange={(e) => setEditedLyrics(e.target.value)}
                      placeholder="Enter song lyrics (line breaks will be preserved)"
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  {successMessage && <div className="success-message">{successMessage}</div>}
                  <div className="button-group">
                    <button onClick={handleSave} className="button">
                      Save
                    </button>
                    <button onClick={handleCancel} className="button button-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isEditing && (
            <>
              {song?.lyrics ? (
                <div className="lyrics">{song.lyrics}</div>
              ) : (
                <div className="empty-state">
                  <p>Lyrics not yet available for this song.</p>
                  {!isAuthenticated && (
                    <p style={{ fontSize: '14px', marginTop: '8px', color: '#999' }}>
                      Check back later or contact an administrator.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SongDetailPage;

