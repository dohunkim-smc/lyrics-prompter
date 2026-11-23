/**
 * Default Duet Setlist Data
 *
 * Each line item supports:
 * - type: 'cue' | 'solo' | 'split'
 * - time: start time in seconds (can be live-recorded using Tap-to-Sync!)
 * - section: optional section label for quick-jump pills & dividers
 * - part: (for 'solo') 'A' | 'B' | 'both'
 * - text / sub: (for 'cue' and 'solo')
 * - left / right: (for 'split') { text, sub } -> Part A on left, Part B on right
 */
export const DEFAULT_SONGS = [
  {
    id: 'night-of-silence',
    title: 'Night of Silence',
    subtitle: 'Daniel Kantor · 90 BPM 음원 정밀 싱크 (4:11 · 1절 Bekah · 2절 Don · 3~4절 스플릿)',
    youtubeId: '9mahJfv6dN4',
    duration: 251,
    parts: {
      A: 'Bekah',
      B: 'Don',
      both: '함께 (Bekah & Don)'
    },
    lines: [
      {
        type: 'cue',
        section: '전주',
        time: 0,
        text: '전주 (Intro · 4마디) — Bekah 준비',
        sub: '0:01.2 피아노 시작 → 0:09.2 첫 소절 진입'
      },
      // ==================== VERSE 1 — Bekah (24 bars: +0, +8, +16, +24, +32, +42s) ====================
      {
        type: 'solo',
        section: '1절 (Bekah)',
        part: 'A',
        time: 8.9,
        text: 'Cold are the people, winter of life',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 16.9,
        text: 'We tremble in shadows this cold endless night',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 24.9,
        text: 'Frozen in the snow lie roses sleeping',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 32.9,
        text: 'Flowers that will echo the sunrise',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 40.9,
        text: 'Fire of hope is our only warmth',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 50.9,
        text: 'Weary, its flame will be dying soon',
        sub: ''
      },
      {
        type: 'cue',
        time: 56.9,
        text: '간주 (4마디) — Don 준비 (1:05 진입)',
        sub: ''
      },
      // ==================== VERSE 2 — Don (Downbeat 1:05.2, +56.0s exact) ====================
      {
        type: 'solo',
        section: '2절 (Don)',
        part: 'B',
        time: 64.9,
        text: 'Voice in the distance, call in the night',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 72.9,
        text: 'On wind you enfold us, you speak of the light',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 80.9,
        text: 'Gentle on the ear you whisper softly',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 88.9,
        text: 'Rumors of a dawn so embracing',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 96.9,
        text: 'Breathless love awaits darkened souls',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 106.9,
        text: 'Soon will we know of the morning',
        sub: ''
      },
      {
        type: 'cue',
        time: 112.9,
        text: '간주 (4마디) — 3절 스플릿 준비 (2:01 진입)',
        sub: ''
      },
      // ==================== VERSE 3 — Split Duet (Downbeat 2:01.2, +112.0s exact) ====================
      {
        type: 'split',
        section: '3절 (스플릿)',
        time: 120.9,
        left: {
          text: 'Spirit among us, shine like the star',
          sub: ''
        },
        right: {
          text: 'Silent night, holy night',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 128.9,
        left: {
          text: 'Your light that guides shepherds and kings from afar',
          sub: ''
        },
        right: {
          text: 'All is calm, all is bright',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 136.9,
        left: {
          text: 'Shimmer in the sky so empty, lonely',
          sub: ''
        },
        right: {
          text: 'Round yon Virgin Mother and Child',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 144.9,
        left: {
          text: 'Rising in the warmth of your Son\'s love',
          sub: ''
        },
        right: {
          text: 'Holy Infant so tender and mild',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 152.9,
        left: {
          text: 'Star unknowing of night and day',
          sub: ''
        },
        right: {
          text: 'Sleep in heavenly peace,',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 162.9,
        left: {
          text: 'Spirit we wait for your loving Son',
          sub: ''
        },
        right: {
          text: 'Sleep in heavenly peace.',
          sub: ''
        }
      },
      {
        type: 'cue',
        time: 168.9,
        text: '간주 (4마디) — 4절 스플릿 준비 (2:57 진입)',
        sub: ''
      },
      // ==================== VERSE 4 — Split Duet (Downbeat 2:57.2, +168.0s exact) ====================
      {
        type: 'split',
        section: '4절 (스플릿)',
        time: 176.9,
        left: {
          text: 'Spirit among us, shine like the star',
          sub: ''
        },
        right: {
          text: 'Silent night, holy night',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 184.9,
        left: {
          text: 'Your light that guides shepherds and kings from afar',
          sub: ''
        },
        right: {
          text: 'Shepherds quake at the sight',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 192.9,
        left: {
          text: 'Shimmer in the sky so empty, lonely',
          sub: ''
        },
        right: {
          text: 'Glories stream from heaven afar',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 200.9,
        left: {
          text: 'Rising in the warmth of your Son\'s love',
          sub: ''
        },
        right: {
          text: 'Heavenly hosts sing Alleluia',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 208.9,
        left: {
          text: 'Star unknowing of night and day',
          sub: ''
        },
        right: {
          text: 'Christ the Savior is born,',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 218.9,
        left: {
          text: 'Spirit we wait for your loving Son',
          sub: ''
        },
        right: {
          text: 'Christ the Savior is born.',
          sub: ''
        }
      },
      {
        type: 'cue',
        section: '후주',
        time: 224.9,
        text: '후주 (Outro) — 천천히 마무리',
        sub: '3:54.5 마지막 화음'
      }
    ]
  },
  {
    id: 'o-holy-night',
    title: 'O Holy Night',
    subtitle: 'Josh Groban (Karaoke 4:54 · 단독 가창 기준 정밀 싱크)',
    youtubeId: 'tNoV4HJQ1ZM',
    duration: 294,
    parts: {
      A: 'Bekah',
      B: 'Don',
      both: 'Vocal'
    },
    lines: [
      {
        type: 'cue',
        section: '전주',
        time: 0,
        text: '전주 (Intro) — 0:16 첫 소절 진입',
        sub: '0:12부터 4박 카운트다운'
      },
      // ==================== VERSE 1 (0:15.7 ~ 1:16.5) ====================
      {
        type: 'solo',
        section: '1절',
        part: 'both',
        time: 15.7,
        text: 'O holy night, the stars are brightly shining,',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 25.7,
        text: 'It is the night of our dear Savior\'s birth.',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 36.5,
        text: 'Long lay the world in sin and error pining,',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 45.2,
        text: '\'Til He appeared and the soul felt its worth.',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 57.2,
        text: 'A thrill of hope, the weary world rejoices,',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 66.2,
        text: 'For yonder breaks a new and glorious morn!',
        sub: ''
      },
      // ==================== CHORUS 1 (1:16.5 ~ 2:11.5) ====================
      {
        type: 'solo',
        section: '후렴 1',
        part: 'both',
        time: 76.5,
        text: 'Fall on your knees!',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 84.5,
        text: 'O hear the angel voices!',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 93.5,
        text: 'O night divine!',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 102.5,
        text: 'O night when Christ was born!',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 111.5,
        text: 'O night divine,',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 120.5,
        text: 'O night, O night divine!',
        sub: ''
      },
      // ==================== INTERLUDE (2:11.5 ~ 2:27.5) ====================
      {
        type: 'cue',
        section: '간주',
        time: 131.5,
        text: '간주 (4 Bar Break) — 2:28 진입 준비',
        sub: '2:24부터 4박 카운트다운'
      },
      // ==================== VERSE 2 (2:27.5 ~ 3:07.5) ====================
      {
        type: 'solo',
        section: '2절',
        part: 'both',
        time: 147.5,
        text: 'Chains shall He break, for the slave is our brother,',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 158.5,
        text: 'And in His name all oppression shall cease.',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 168.5,
        text: 'Sweet hymns of joy in grateful chorus raise we,',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 177.5,
        text: 'Let all within us praise His holy name.',
        sub: ''
      },
      // ==================== CLIMAX (3:07.5 ~ 4:35.0) ====================
      {
        type: 'solo',
        section: '클라이맥스',
        part: 'both',
        time: 187.5,
        text: 'Christ is the Lord!',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 195.5,
        text: 'That ever, ever praise we!',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 205.5,
        text: 'Noel, Noel,',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 214.5,
        text: 'O night, O night divine!',
        sub: ''
      },
      {
        type: 'solo',
        section: '피날레',
        part: 'both',
        time: 224.5,
        text: 'Noel, Noel,',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 232.5,
        text: 'O night, O night divine!',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 242.5,
        text: 'Noel, Noel,',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 258.5,
        text: 'O night, O night divine!',
        sub: ''
      },
      {
        type: 'cue',
        section: '후주',
        time: 275.0,
        text: '후주 (Outro) — 오케스트라 마무리',
        sub: ''
      }
    ]
  },
  {
    id: 'the-prayer',
    title: 'The Prayer',
    subtitle: 'Céline Dion & Andrea Bocelli (Original Instrumental 4:30 · Bekah EN / Don IT)',
    youtubeId: 'hJrnxepCysM',
    duration: 270,
    parts: {
      A: 'Bekah (English)',
      B: 'Don (Italian)',
      both: '함께 (Bekah & Don)'
    },
    lines: [
      {
        type: 'cue',
        section: '전주',
        time: 0,
        text: '전주 (Orchestra Intro) — Bekah 준비',
        sub: '0:21 첫 소절 진입'
      },
      // ==================== VERSE 1 — Bekah Solo (0:21.2 ~ 1:03.5) ====================
      {
        type: 'solo',
        section: '1절 (Bekah)',
        part: 'A',
        time: 21.2,
        text: 'I pray you\'ll be our eyes, and watch us where we go',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 29.8,
        text: 'And help us to be wise in times when we don\'t know',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 37.2,
        text: 'Let this be our prayer, when we lose our way',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 49.5,
        text: 'Lead us to a place, guide us with your grace',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 56.8,
        text: 'To a place where we\'ll be safe',
        sub: ''
      },
      // ==================== VERSE 2 — Don (IT) & Bekah (EN) (1:03.5 ~ 1:59.0) ====================
      {
        type: 'split',
        section: '2절 (듀엣)',
        time: 63.5,
        left: {
          text: 'I pray we\'ll find your light',
          sub: '(1:07 응답)'
        },
        right: {
          text: 'La luce che tu hai',
          sub: '(1:03.5 먼저)'
        }
      },
      {
        type: 'split',
        time: 71.0,
        left: {
          text: 'And hold it in our hearts',
          sub: '(1:15.5 응답)'
        },
        right: {
          text: 'Nel cuore resterà',
          sub: '(1:11 먼저)'
        }
      },
      {
        type: 'split',
        time: 80.5,
        left: {
          text: 'When stars go out each night',
          sub: '(1:24.5 응답)'
        },
        right: {
          text: 'A ricordarci che',
          sub: '(1:20.5 먼저)'
        }
      },
      {
        type: 'solo',
        part: 'B',
        time: 88.5,
        text: 'L\'eterna stella sei',
        sub: ''
      },
      {
        type: 'split',
        time: 94.5,
        left: {
          text: 'Let this be our prayer',
          sub: ''
        },
        right: {
          text: 'Nella mia preghiera',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 100.8,
        left: {
          text: 'When shadows fill our day',
          sub: ''
        },
        right: {
          text: 'Quanta fede c\'è',
          sub: ''
        }
      },
      {
        type: 'solo',
        part: 'both',
        time: 106.8,
        text: 'Lead us to a place, guide us with your grace',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 112.8,
        text: 'Give us faith so we\'ll be safe',
        sub: ''
      },
      // ==================== BRIDGE — Don Italian Solo (1:59.5 ~ 2:18.0) ====================
      {
        type: 'solo',
        section: '브릿지 (Don)',
        part: 'B',
        time: 119.5,
        text: 'Sogniamo un mondo senza più violenza',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 123.0,
        text: 'Un mondo di giustizia e di speranza',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 126.5,
        text: 'Ognuno dia la mano al suo vicino',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 131.5,
        text: 'Simbolo di pace, di fraternità',
        sub: ''
      },
      // ==================== VERSE 4 — Interwoven Duet (2:18.5 ~ 2:52.8) ====================
      {
        type: 'split',
        section: '3절 (스플릿)',
        time: 138.5,
        left: {
          text: 'We ask that life be kind',
          sub: '(2:22 응답)'
        },
        right: {
          text: 'La forza che ci dà',
          sub: '(2:18.5 먼저)'
        }
      },
      {
        type: 'split',
        time: 145.0,
        left: {
          text: 'And watch us from above',
          sub: '(2:28.5 응답)'
        },
        right: {
          text: 'È il desiderio che',
          sub: '(2:25 먼저)'
        }
      },
      {
        type: 'split',
        time: 151.5,
        left: {
          text: 'We hope each soul will find',
          sub: '(2:35 응답)'
        },
        right: {
          text: 'Ognuno trovi amor',
          sub: '(2:31.5 먼저)'
        }
      },
      {
        type: 'split',
        time: 159.0,
        left: {
          text: 'Another soul to love',
          sub: '(2:43 응답)'
        },
        right: {
          text: 'Intorno e dentro sé',
          sub: '(2:39 먼저)'
        }
      },
      // ==================== CLIMAX — Key Change Up to Bb Major (2:52.8 ~ 3:32.5) ====================
      {
        type: 'split',
        section: '클라이맥스 (전조)',
        time: 172.8,
        left: {
          text: 'Let this be our prayer',
          sub: '(2:53 먼저)'
        },
        right: {
          text: 'Let this be our prayer',
          sub: '(2:59.5 응답)'
        }
      },
      {
        type: 'split',
        time: 185.8,
        left: {
          text: 'Just like every child',
          sub: '(3:06 먼저)'
        },
        right: {
          text: 'Just like every child',
          sub: '(3:12.5 응답)'
        }
      },
      {
        type: 'solo',
        part: 'both',
        time: 199.5,
        text: 'Need to find a place, guide us with your grace',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 206.0,
        text: 'Give us faith so we\'ll be safe',
        sub: ''
      },
      // ==================== ORCHESTRAL INTERLUDE (3:32.5 ~ 3:46.8) ====================
      {
        type: 'cue',
        section: '간주',
        time: 212.5,
        text: '간주 (오보에 · 스트링) — 마지막 피날레 준비',
        sub: '3:47 È la fede che 강하게 진입'
      },
      // ==================== FINALE — Italian Together (3:46.8 ~ 4:30) ====================
      {
        type: 'solo',
        section: '피날레',
        part: 'both',
        time: 226.8,
        text: 'È la fede che',
        sub: ''
      },
      {
        type: 'solo',
        part: 'both',
        time: 231.5,
        text: 'Hai acceso in noi',
        sub: '3:59 짧은 브레이크(호흡)'
      },
      {
        type: 'solo',
        part: 'both',
        time: 239.5,
        text: 'Sento che ci salverà',
        sub: '4:06 오케스트라 절정 → 4:13 마무리'
      },
      {
        type: 'cue',
        section: '후주',
        time: 254.0,
        text: '후주 (Outro) — 천천히 마무리',
        sub: ''
      }
    ]
  }
];
