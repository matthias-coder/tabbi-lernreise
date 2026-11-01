// Modular Avatar configuration catalog: heads, torsos, legs, skin/hair/cloth palettes, accessories & starter archetypes

export const AVATAR_CATALOG = {
  // Backwards compatibility for existing tests & legacy profiles
  bodyTypes: [
    { id: 'monster', label: 'Monster', icon: '👾', assetId: 'avatar-body-monster' },
    { id: 'boy', label: 'Junge', icon: '👦', assetId: 'avatar-body-boy' },
    { id: 'girl', label: 'Mädchen', icon: '👧', assetId: 'avatar-body-girl' }
  ],

  // 1. ZONEN-KATALOG: 7 Köpfe
  heads: [
    { id: 'head-child-smile', label: 'Lachend', icon: '😊', category: 'human' },
    { id: 'head-child-freckles', label: 'Sommersprossen', icon: '🧒', category: 'human' },
    { id: 'head-child-glasses', label: 'Schlaue Brille', icon: '🤓', category: 'human' },
    { id: 'head-monster-horns', label: 'Kuschelhörner', icon: '👾', category: 'monster' },
    { id: 'head-monster-oneeye', label: 'Zyklop-Auge', icon: '👁️', category: 'monster' },
    { id: 'head-robot-screen', label: 'Robo-Monitor', icon: '🤖', category: 'robot' },
    { id: 'head-bear', label: 'Bärchen', icon: '🐻', category: 'animal' }
  ],

  // 2. ZONEN-KATALOG: 6 Torsos
  torsos: [
    { id: 'torso-shirt-stripes', label: 'Streifenshirt', icon: '👕' },
    { id: 'torso-hoodie', label: 'Kuschel-Hoodie', icon: '🧥' },
    { id: 'torso-monster-belly', label: 'Flauschbauch', icon: '🟣' },
    { id: 'torso-robot-chassis', label: 'Robo-Chassis', icon: '🦾' },
    { id: 'torso-vest-adventurer', label: 'Entdecker-Weste', icon: '🦺' },
    { id: 'torso-dungarees', label: 'Latzhose', icon: '👖' }
  ],

  // 3. ZONEN-KATALOG: 6 Beine & Fahrwerke
  legs: [
    { id: 'legs-sneaker', label: 'Turnschuhe', icon: '👟' },
    { id: 'legs-boots-rain', label: 'Gummistiefel', icon: '🥾' },
    { id: 'legs-paws', label: 'Tatzen', icon: '🐾' },
    { id: 'legs-spring', label: 'Sprungfeder', icon: '🌀' },
    { id: 'legs-wheels', label: 'Rollen', icon: '🛼' },
    { id: 'legs-tracks', label: 'Raupenkette', icon: '🚜' }
  ],

  // 4. FARBPALETTEN
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

  clothColors: [
    { id: 'sky', label: 'Himmelblau', hex: '#38bdf8' },
    { id: 'navy', label: 'Marineblau', hex: '#1e3a8a' },
    { id: 'red', label: 'Signalrot', hex: '#dc2626' },
    { id: 'emerald', label: 'Smaragdgrün', hex: '#059669' },
    { id: 'yellow', label: 'Sonnengelb', hex: '#eab308' },
    { id: 'purple', label: 'Zauberlila', hex: '#9333ea' },
    { id: 'orange', label: 'Leuchtorange', hex: '#ea580c' },
    { id: 'pink', label: 'Knallpink', hex: '#ec4899' },
    { id: 'slate', label: 'Schiefergrau', hex: '#334155' }
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
  ],

  // 5. STARTER-ARCHETYPEN FÜR NEUE PROFILE
  starterArchetypes: [
    {
      id: 'archetype-child',
      label: 'Schulkind',
      icon: '🎒',
      preset: {
        headId: 'head-child-smile',
        torsoId: 'torso-shirt-stripes',
        legsId: 'legs-sneaker',
        skinColorId: 'fair',
        clothColorId: 'sky',
        hairStyleId: 'tuft',
        hairColorId: 'brown'
      }
    },
    {
      id: 'archetype-monster',
      label: 'Monster',
      icon: '👾',
      preset: {
        headId: 'head-monster-horns',
        torsoId: 'torso-monster-belly',
        legsId: 'legs-paws',
        skinColorId: 'mint',
        clothColorId: 'emerald',
        hairStyleId: 'spikes',
        hairColorId: 'purple'
      }
    },
    {
      id: 'archetype-robot',
      label: 'Robo',
      icon: '🤖',
      preset: {
        headId: 'head-robot-screen',
        torsoId: 'torso-robot-chassis',
        legsId: 'legs-spring',
        skinColorId: 'sky',
        clothColorId: 'yellow',
        hairStyleId: 'tuft',
        hairColorId: 'black'
      }
    },
    {
      id: 'archetype-bear',
      label: 'Tierchen',
      icon: '🐻',
      preset: {
        headId: 'head-bear',
        torsoId: 'torso-vest-adventurer',
        legsId: 'legs-boots-rain',
        skinColorId: 'medium',
        clothColorId: 'orange',
        hairStyleId: 'tuft',
        hairColorId: 'brown'
      }
    }
  ]
};
