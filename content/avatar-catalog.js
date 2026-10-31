// Avatar configuration catalog: bodies, skin/hair palettes, hairstyles, unlockable accessories

export const AVATAR_CATALOG = {
  bodyTypes: [
    { id: 'monster', label: 'Monster', icon: '👾', assetId: 'avatar-body-monster' },
    { id: 'boy', label: 'Junge', icon: '👦', assetId: 'avatar-body-boy' },
    { id: 'girl', label: 'Mädchen', icon: '👧', assetId: 'avatar-body-girl' }
  ],
  skinColors: [
    { id: 'mint', label: 'Minzgrün', hex: '#34d399' },
    { id: 'lavender', label: 'Flieder', hex: '#c084fc' },
    { id: 'peach', label: 'Pfirsich', hex: '#fbcfe8' },
    { id: 'sunny', label: 'Sonnengelb', hex: '#fde047' },
    { id: 'coral', label: 'Koralle', hex: '#fb7185' },
    { id: 'sky', label: 'Himmelblau', hex: '#38bdf8' },
    { id: 'fair', label: 'Hell', hex: '#fcd34d' },
    { id: 'medium', label: 'Mittel', hex: '#d97706' },
    { id: 'deep', label: 'Dunkel', hex: '#78350f' }
  ],
  hairColors: [
    { id: 'brown', label: 'Braun', hex: '#78350f' },
    { id: 'black', label: 'Schwarz', hex: '#1f2937' },
    { id: 'blonde', label: 'Blond', hex: '#facc15' },
    { id: 'red', label: 'Kupferrot', hex: '#ea580c' },
    { id: 'purple', label: 'Lila', hex: '#9333ea' },
    { id: 'blue', label: 'Blau', hex: '#2563eb' }
  ],
  baseHairStyles: [
    { id: 'tuft', label: 'Wuschelkopf', assetId: 'hair-tuft' },
    { id: 'spikes', label: 'Stachel', assetId: 'hair-spikes' },
    { id: 'curls', label: 'Locken', assetId: 'hair-curls' },
    { id: 'braids', label: 'Zöpfe', assetId: 'hair-braids' },
    { id: 'bob', label: 'Bob-Pony', assetId: 'hair-bob' }
  ],
  unlockableAccessories: [
    { id: 'acc-krone', label: 'Goldene Krone', icon: '👑', assetId: 'acc-krone' },
    { id: 'acc-brille', label: 'Coole Brille', icon: '🕶️', assetId: 'acc-brille' },
    { id: 'acc-zauberhut', label: 'Zauberhut', icon: '🧙', assetId: 'acc-zauberhut' },
    { id: 'acc-cape', label: 'Super-Umhang', icon: '🦸', assetId: 'acc-cape' },
    { id: 'acc-fluegel', label: 'Feenflügel', icon: '🧚', assetId: 'acc-fluegel' },
    { id: 'acc-hoerner', label: 'Monster-Hörner', icon: '🦄', assetId: 'acc-hoerner' },
    { id: 'acc-kopfhoerer', label: 'Kopfhörer', icon: '🎧', assetId: 'acc-kopfhoerer' },
    { id: 'acc-schal', label: 'Kuschelschal', icon: '🧣', assetId: 'acc-schal' },
    { id: 'acc-sternstab', label: 'Sternenstab', icon: '🪄', assetId: 'acc-sternstab' },
    { id: 'acc-piratenhut', label: 'Piratenhut', icon: '🏴‍☠️', assetId: 'acc-piratenhut' },
    { id: 'acc-blume', label: 'Blumenspange', icon: '🌸', assetId: 'acc-blume' },
    { id: 'acc-drache', label: 'Schulter-Drache', icon: '🐉', assetId: 'acc-drache' }
  ]
};
