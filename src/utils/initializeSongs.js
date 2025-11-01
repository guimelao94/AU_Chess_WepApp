// Utility function to initialize all songs in Firestore
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Fire';

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
  }
};

export const initializeSongs = async () => {
  try {
    const existingSongs = await getDocs(collection(db, 'songs'));
    const existingSet = new Set();
    existingSongs.forEach((doc) => {
      const data = doc.data();
      // Create a unique key for each song
      existingSet.add(`${data.category || ''}-${data.tempo || ''}-${data.title || ''}`);
    });

    const songsToAdd = [];
    for (const [category, tempos] of Object.entries(songData)) {
      for (const [tempo, songs] of Object.entries(tempos)) {
        for (const title of songs) {
          const key = `${category}-${tempo}-${title}`;
          if (!existingSet.has(key)) {
            songsToAdd.push({
              category,
              tempo,
              title,
              lyrics: '',
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }
      }
    }

    if (songsToAdd.length > 0) {
      // Add songs in batches to avoid overwhelming Firestore
      const batchSize = 10;
      for (let i = 0; i < songsToAdd.length; i += batchSize) {
        const batch = songsToAdd.slice(i, i + batchSize);
        await Promise.all(batch.map(song => addDoc(collection(db, 'songs'), song)));
      }
      return { success: true, count: songsToAdd.length };
    } else {
      return { success: true, count: 0, message: 'All songs already exist' };
    }
  } catch (error) {
    console.error('Error initializing songs:', error);
    return { success: false, error: error.message };
  }
};

