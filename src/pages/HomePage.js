import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Fire';
import Footer from '../components/Footer';
import { addSongToQueue } from '../utils/queue';

const songData = {
  Contemporary: {
    Fast: [
      'Trading My Sorrow',
      'Bless the Lord',
      'Friend of God',
      'You Are Good',
      'How Great Is Our God',
      'Do It Again',
      'King of My Heart'
    ],
    Slow: [
      'Psalm 23',
      'Great Are You Lord',
      'Worthy Is Your Name',
      'Always on Time',
      'Champion',
      'More Than Able',
      'Reckless Love',
      'What a Beautiful Name',
      'Agnus Dei',
      'Trust in God',
      'Worthy Is the Lamb',
      'Breathe',
      'Build My Life',
      'Holy Forever'
    ]
  },
  Gospel: {
    Fast: [
      'Revelation 19',
      'Moving Forward (Not Going Back)',
      'Melodies from Heaven',
      'Love Theory',
      'He Reigns Forever',
      'He\'s Able (Exceedingly)',
      'Our God Is (Water Into Wine)',
      'Days of Elijah',
      'In Jesus\' Name (Israel)',
      'Better Is the Day',
      'You Are God Alone',
      'Faithful Is Our God'
    ],
    Slow: [
      'Alpha and Omega',
      'More Than Anything',
      'Jesus Went to Calvary (He Died)',
      'Total Praise',
      'Make Room',
      'Here I Am to Worship',
      'Made a Way',
      'You Deserve It',
      'For Your Glory'
    ]
  },
  Hymns: {
    Fast: [
      'Blessed Assurance',
      'What Can Wash Away',
      'Power in the Blood',
      'What a Fellowship',
      'When We All Get to Heaven',
      'Marching to Zion'
    ],
    Slow: [
      'Great Is Thy Faithfulness',
      'Because He Lives',
      '\'Tis So Sweet',
      'It Is Well',
      'I Have Decided',
      'Turn Your Eyes',
      'There\'s a Sweet, Sweet Spirit',
      'What a Friend We Have in Jesus',
      'Just As I Am',
      'I Surrender All'
    ]
  },
  Traditional: {
    Fast: [
      'He\'s Got the Whole World',
      'This Is the Day',
      'He Has Made Me Glad',
      'What a Mighty God We Serve',
      'Victory Is Mine',
      'In the Name of Jesus',
      'Lord, I Lift Your Name on High',
      'He Is Exalted',
      'Pray by the Riverside'
    ],
    Slow: [
      'Shout to the Lord',
      'Power of Your Love',
      'Heart of Worship',
      'As the Deer',
      'In the Garden',
      'Communion',
      'Open the Eyes of My Heart',
      'I Love You Lord',
      'We Sing Praises',
      'Draw Me Close',
      'This Is the Air I Breathe',
      'Above All'
    ]
  },
  Christmas: {
    Fast: [
      'Go Tell It On The Mountain',
      'Joy To The World',
      'Do You Hear What I Hear',
      'Oh Come All Ye Faithful',
      'Hark the Herald Angels sing',
      'Angels We have heard on high'
    ],
    Slow: [
      'Oh Holy Night',
      'The First Noel',
      'O Come O Come Emmanuel',
      'What Child Is This',
      'Silent Night',
      'Away in a Manger'
    ]
  }
};

function HomePage() {
  const [songsWithLyrics, setSongsWithLyrics] = useState(new Set());
  const [visibilityMap, setVisibilityMap] = useState({});
  const [showNav, setShowNav] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'songs'));
        const songs = new Set();
        const visibility = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const key = `${data.category}-${data.tempo}-${data.title}`;
          songs.add(key);
          visibility[key] = data.visible === undefined ? false : !!data.visible;
        });
        setSongsWithLyrics(songs);
        setVisibilityMap(visibility);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
    const authStatus = localStorage.getItem('worshipJamAdmin');
    setIsAdmin(authStatus === 'authenticated');
  }, []);

  const encodeSongName = (name) => {
    return encodeURIComponent(name);
  };

  const handleQueueAdd = async (category, tempo, title) => {
    try {
      await addSongToQueue({ title, category, tempo });
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="header">
        <div className="header-content">
          <h1 style={{ flex: 1, textAlign: 'center' }}>Song Library</h1>
        </div>
        <div className="nav-toggle-container">
          <button 
            onClick={() => setShowNav(!showNav)} 
            className="nav-toggle-button"
            aria-label={showNav ? "Hide navigation" : "Show navigation"}
          >
            {showNav ? 'Hide Index' : 'Show Index'}
          </button>
        </div>
      </header>

      <main className="container container-home">
        {showNav && (
          <nav className="category-nav">
            {Object.entries(songData).map(([category, tempos]) => (
              <div key={category} className="category-nav-group">
                <span className="category-nav-label">{category}:</span>
                <div className="category-nav-links">
                  {Object.keys(tempos).map((tempo) => (
                    <a
                      key={tempo}
                      href={`#${category.toLowerCase()}-${tempo.toLowerCase()}`}
                      className="category-nav-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowNav(false);
                        setTimeout(() => {
                          const element = document.getElementById(`${category.toLowerCase()}-${tempo.toLowerCase()}`);
                          if (element) {
                            const headerContentHeight = 60;
                            const toggleButtonHeight = 40;
                            const offset = headerContentHeight + toggleButtonHeight + 10;
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            });
                          }
                        }, 100);
                      }}
                    >
                      {tempo}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        )}
        <div className="categories" style={{ padding: '0 20px' }}>
          {Object.entries(songData).map(([category, tempos]) => {
            const filteredTempos = Object.entries(tempos)
              .map(([tempo, songs]) => {
                const visibleSongs = songs.filter(
                  (song) => visibilityMap[`${category}-${tempo}-${song}`] === true
                );
                return { tempo, songs: visibleSongs };
              })
              .filter((t) => t.songs.length > 0);

            if (filteredTempos.length === 0) {
              return null;
            }

            return (
              <div key={category} className="category-card">
                <h2 className="category-title">{category}</h2>
                {filteredTempos.map(({ tempo, songs }) => (
                  <div key={tempo} id={`${category.toLowerCase()}-${tempo.toLowerCase()}`} className="tempo-section">
                    <h3 style={{ color: '#2a2a2a', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
                      {tempo}
                    </h3>
                    <ul className="song-list">
                      {songs.map((song) => {
                        const key = `${category}-${tempo}-${song}`;
                        const hasLyrics = songsWithLyrics.has(key);
                        return (
                          <li key={song}>
                            <div className="song-row">
                              <Link
                                to={`/song/${encodeURIComponent(category)}/${encodeSongName(song)}?tempo=${tempo}`}
                                className="song-item"
                                style={hasLyrics ? { fontWeight: '600' } : {}}
                              >
                                {song}
                              </Link>
                              {isAdmin && (
                                <button
                                  className="queue-add-button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleQueueAdd(category, tempo, song);
                                  }}
                                  aria-label={`Add ${song} to queue`}
                                >
                                  Queue
                                </button>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;

