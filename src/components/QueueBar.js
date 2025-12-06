import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Fire';
import { removeFromQueue } from '../utils/queue';
import { Link } from 'react-router-dom';

function QueueBar() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('worshipJamAdmin');
      setIsAuthenticated(authStatus === 'authenticated');
    };
    checkAuth();
    const authInterval = setInterval(checkAuth, 1000);

    const q = query(collection(db, 'queue'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQueue(items);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to queue:', err);
        setLoading(false);
      }
    );

    return () => {
      unsub();
      clearInterval(authInterval);
    };
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromQueue(id);
    } catch (error) {
      console.error('Error removing from queue:', error);
    }
  };

  return (
    <div className="queue-bar">
      <div className="queue-bar-header">
        <span className="queue-bar-title">Queue</span>
        {loading && <span className="queue-bar-subtle">Loading...</span>}
        {!loading && queue.length === 0 && <span className="queue-bar-subtle">Empty</span>}
      </div>
      <div className="queue-items" role="list">
        {queue.map((item) => (
          <div key={item.id} className="queue-pill" role="listitem">
            <Link
              to={`/song/${encodeURIComponent(item.category || '')}/${encodeURIComponent(item.title || '')}?tempo=${item.tempo || ''}`}
              className="queue-pill-link"
            >
              <span className="queue-pill-title">{item.title || 'Untitled'}</span>
            </Link>
            {isAuthenticated && (
              <button
                className="queue-remove-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(item.id);
                }}
                aria-label={`Remove ${item.title} from queue`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QueueBar;
