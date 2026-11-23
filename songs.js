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
      // ==================== VERSE 1 — Bekah (Downbeat 0:09.2, -0.3s eye-lead) ====================
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
        time: 12.9,
        text: 'We tremble in shadows this cold endless night',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 16.9,
        text: 'Frozen in the snow lie roses sleeping',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 24.9,
        text: 'Flowers that will echo the sunrise',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 32.9,
        text: 'Fire of hope is our only warmth',
        sub: ''
      },
      {
        type: 'solo',
        part: 'A',
        time: 40.9,
        text: 'Weary, its flame will be dying soon',
        sub: ''
      },
      {
        type: 'cue',
        time: 50.9,
        text: '간주 — 피아노 마무리',
        sub: ''
      },
      {
        type: 'cue',
        time: 56.9,
        text: '전주 4마디 — Don 준비 (1:05 진입)',
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
        time: 68.9,
        text: 'On wind you enfold us, you speak of the light',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 72.9,
        text: 'Gentle on the ear you whisper softly',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 80.9,
        text: 'Rumors of a dawn so embracing',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 88.9,
        text: 'Breathless love awaits darkened souls',
        sub: ''
      },
      {
        type: 'solo',
        part: 'B',
        time: 96.9,
        text: 'Soon will we know of the morning',
        sub: ''
      },
      {
        type: 'cue',
        time: 106.9,
        text: '간주 — 피아노 마무리',
        sub: ''
      },
      {
        type: 'cue',
        time: 112.9,
        text: '전주 4마디 — 3절 스플릿 준비 (2:01 진입)',
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
          text: 'Silent night,',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 124.9,
        left: {
          text: 'Your light that guides shepherds and kings from afar',
          sub: ''
        },
        right: {
          text: 'Holy night,',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 128.9,
        left: {
          text: 'Shimmer in the sky so empty, lonely',
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
          text: 'Rising in the warmth of your Son\'s love',
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
          text: 'Star unknowing of night and day',
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
          text: 'Spirit we wait for your loving Son',
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
          text: '—',
          sub: '(여운 · 호흡)'
        },
        right: {
          text: 'Sleep in heavenly peace.',
          sub: ''
        }
      },
      {
        type: 'cue',
        time: 168.9,
        text: '전주 4마디 — 4절 스플릿 준비 (2:57 진입)',
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
          text: 'Silent night,',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 180.9,
        left: {
          text: 'Your light that guides shepherds and kings from afar',
          sub: ''
        },
        right: {
          text: 'Holy night,',
          sub: ''
        }
      },
      {
        type: 'split',
        time: 184.9,
        left: {
          text: 'Shimmer in the sky so empty, lonely',
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
          text: 'Rising in the warmth of your Son\'s love',
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
          text: 'Star unknowing of night and day',
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
          text: 'Spirit we wait for your loving Son',
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
          text: '—',
          sub: '(여운 · 호흡)'
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
    id: 'song-2',
    title: '2번 곡 (준비 중)',
    subtitle: '상단 [✎ 편집]에서 제목·유튜브 링크·가사를 입력하거나 채팅으로 알려주세요',
    youtubeId: '',
    duration: 180,
    parts: {
      A: 'Part A',
      B: 'Part B',
      both: '함께'
    },
    lines: [
      {
        type: 'cue',
        section: '전주',
        time: 0,
        text: '두 번째 듀엣 곡을 추가해 주세요',
        sub: '상단 [✎ 편집] 버튼에서 바로 수정할 수 있습니다'
      },
      {
        type: 'solo',
        section: '1절',
        part: 'A',
        time: 10,
        text: 'Part A 가사 예시입니다',
        sub: '노란색으로 표시됩니다'
      },
      {
        type: 'solo',
        part: 'B',
        time: 18,
        text: 'Part B 가사 예시입니다',
        sub: '하늘색으로 표시됩니다'
      },
      {
        type: 'split',
        section: '동시가창',
        time: 26,
        left: {
          text: 'Part A 동시 가창 가사',
          sub: '왼쪽 컬럼'
        },
        right: {
          text: 'Part B 동시 가창 가사',
          sub: '오른쪽 컬럼'
        }
      },
      {
        type: 'solo',
        part: 'both',
        time: 36,
        text: '함께 부르는 파트 가사 예시',
        sub: '에메랄드 색으로 표시됩니다'
      }
    ]
  },
  {
    id: 'song-3',
    title: '3번 곡 (준비 중)',
    subtitle: '상단 [✎ 편집]에서 제목·유튜브 링크·가사를 입력하거나 채팅으로 알려주세요',
    youtubeId: '',
    duration: 180,
    parts: {
      A: 'Part A',
      B: 'Part B',
      both: '함께'
    },
    lines: [
      {
        type: 'cue',
        section: '전주',
        time: 0,
        text: '세 번째 듀엣 곡을 추가해 주세요',
        sub: '상단 [✎ 편집] 버튼에서 바로 수정할 수 있습니다'
      }
    ]
  }
];
