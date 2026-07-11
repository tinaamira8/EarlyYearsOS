import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Clock, Layers, Search, Star, Users } from 'lucide-react';

type AgeRange = 'Infant' | 'Toddler' | 'Pre-Kindy' | 'All';

interface MontessoriActivity {
  id: number;
  title: string;
  area: string;
  ageRange: AgeRange;
  duration: string;
  materials: string;
  directAim: string;
  indirectAim: string;
  presentation: string;
  extensions: string;
  eylfLink: string;
}

const AREAS = [
  { key: 'practical-life', label: 'Practical Life', icon: '🧹', color: 'bg-amber-50 border-amber-200 text-amber-800', badge: 'bg-amber-100 text-amber-700', desc: 'Independence, coordination, concentration and order through real-life tasks' },
  { key: 'sensorial', label: 'Sensorial', icon: '🖐️', color: 'bg-rose-50 border-rose-200 text-rose-800', badge: 'bg-rose-100 text-rose-700', desc: 'Refining the senses to build cognitive foundations for learning' },
  { key: 'language', label: 'Language', icon: '📖', color: 'bg-blue-50 border-blue-200 text-blue-800', badge: 'bg-blue-100 text-blue-700', desc: 'Oral language, phonics, writing and reading through concrete materials' },
  { key: 'mathematics', label: 'Mathematics', icon: '🔢', color: 'bg-emerald-50 border-emerald-200 text-emerald-800', badge: 'bg-emerald-100 text-emerald-700', desc: 'Concrete-to-abstract progression for number, quantity and operations' },
  { key: 'cultural', label: 'Cultural Studies', icon: '🌏', color: 'bg-violet-50 border-violet-200 text-violet-800', badge: 'bg-violet-100 text-violet-700', desc: 'Geography, science, history, art and music — understanding our world' },
];

const activities: MontessoriActivity[] = [
  // Practical Life
  { id: 1, title: 'Pouring — Jug to Jug', area: 'practical-life', ageRange: 'Toddler', duration: '10–15 min', materials: 'Two small jugs, tray, sponge for spills', directAim: 'Pour water from one jug to another without spilling', indirectAim: 'Fine motor control, concentration, independence at mealtimes', presentation: 'Carry tray to table. Lift jug with dominant hand, steady with other. Pour slowly. Wipe any spills with sponge. Return materials.', extensions: 'Pouring rice or lentils, pouring into multiple cups, using a funnel', eylfLink: 'Outcome 3 — Wellbeing' },
  { id: 2, title: 'Spooning & Transferring', area: 'practical-life', ageRange: 'Toddler', duration: '10 min', materials: 'Two bowls, spoon, dry beans or pom poms, tray', directAim: 'Transfer objects from one bowl to another using a spoon', indirectAim: 'Hand-eye coordination, pincer grip preparation, self-feeding skills', presentation: 'Place bowls side by side on tray. Scoop from left bowl, transfer to right. Continue until all moved. Reverse.', extensions: 'Using tongs, tweezers, chopsticks; transferring smaller items like beads', eylfLink: 'Outcome 3 — Wellbeing' },
  { id: 3, title: 'Table Washing', area: 'practical-life', ageRange: 'Pre-Kindy', duration: '20 min', materials: 'Basin, soap, brush, sponge, apron, towel, small table', directAim: 'Wash and dry a table following a logical sequence', indirectAim: 'Left-to-right progression (pre-reading), sequencing, care of environment', presentation: 'Put on apron. Wet sponge, apply soap. Scrub in circular motions left-to-right, top-to-bottom. Rinse. Dry. Return materials.', extensions: 'Chair washing, window washing, dish washing', eylfLink: 'Outcome 2 — Connected to world' },
  { id: 4, title: 'Dressing Frames — Buttons', area: 'practical-life', ageRange: 'Pre-Kindy', duration: '10 min', materials: 'Wooden button dressing frame', directAim: 'Unbutton and rebutton a dressing frame independently', indirectAim: 'Fine motor skills, self-dressing independence, bilateral coordination', presentation: 'Open frame from top button down. Pull fabric apart. Close from top down, aligning holes with buttons.', extensions: 'Zip frame, buckle frame, bow-tying frame, snap frame', eylfLink: 'Outcome 3 — Wellbeing' },
  { id: 5, title: 'Food Preparation — Banana Slicing', area: 'practical-life', ageRange: 'Toddler', duration: '15 min', materials: 'Banana, child-safe knife, chopping board, plate, apron', directAim: 'Peel and slice a banana into pieces for snack', indirectAim: 'Sequencing, self-help skills, healthy eating awareness', presentation: 'Wash hands. Put on apron. Peel banana. Hold steady, slice with gentle downward motion. Place pieces on plate. Clean up.', extensions: 'Spreading butter on bread, cutting soft fruit, making a fruit salad', eylfLink: 'Outcome 3 — Wellbeing' },
  { id: 6, title: 'Flower Arranging', area: 'practical-life', ageRange: 'Pre-Kindy', duration: '15 min', materials: 'Small vase, flowers, scissors, mat, water jug, funnel', directAim: 'Arrange flowers in a vase with water', indirectAim: 'Aesthetic awareness, care of environment, fine motor precision', presentation: 'Place mat on table. Fill vase with water using jug. Trim stems with scissors. Place flowers one at a time. Display in room.', extensions: 'Arranging by colour or size, pressing flowers, drawing the arrangement', eylfLink: 'Outcome 2 — Connected to world' },
  { id: 7, title: 'Hand Washing', area: 'practical-life', ageRange: 'Infant', duration: '5 min', materials: 'Low basin, soap, towel, warm water', directAim: 'Wash and dry hands independently', indirectAim: 'Hygiene habits, sequencing, self-care independence', presentation: 'Wet hands in basin. Apply soap. Rub palms, backs, between fingers. Rinse. Dry with towel.', extensions: 'Face washing, teeth brushing routine', eylfLink: 'Outcome 3 — Wellbeing' },

  // Sensorial
  { id: 8, title: 'Pink Tower', area: 'sensorial', ageRange: 'Pre-Kindy', duration: '15 min', materials: '10 pink wooden cubes graduating in size (1cm³ to 10cm³)', directAim: 'Build a tower from largest to smallest cube', indirectAim: 'Visual discrimination of size, preparation for decimal system, concentration', presentation: 'Carry cubes one at a time to mat. Find largest, place centrally. Stack next largest on top. Continue to smallest.', extensions: 'Building horizontally, pairing with Brown Stair, distance grading', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 9, title: 'Brown Stair (Broad Stair)', area: 'sensorial', ageRange: 'Pre-Kindy', duration: '15 min', materials: '10 brown wooden prisms varying in width', directAim: 'Grade prisms from thickest to thinnest', indirectAim: 'Visual discrimination of width, vocabulary (thick/thin), mathematical thinking', presentation: 'Carry prisms to mat one at a time. Find thickest, place at left. Continue grading to thinnest at right.', extensions: 'Combining with Pink Tower, vertical stacking, blindfold grading', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 10, title: 'Colour Tablets — Box 2', area: 'sensorial', ageRange: 'Pre-Kindy', duration: '10 min', materials: 'Box of 11 pairs of colour tablets', directAim: 'Match pairs of identical colours', indirectAim: 'Visual discrimination of colour, vocabulary building, classification', presentation: 'Lay out one set. Pick a tablet from second set, compare and match. Name colours as pairing.', extensions: 'Box 3 grading (light to dark), colour mixing experiments, colour hunt in environment', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 11, title: 'Sound Cylinders', area: 'sensorial', ageRange: 'Pre-Kindy', duration: '10 min', materials: 'Two boxes of 6 cylinders each (red lids, blue lids) with varying fills', directAim: 'Match cylinders that produce the same sound', indirectAim: 'Auditory discrimination, concentration, grading skills', presentation: 'Shake a red cylinder. Listen carefully. Try each blue cylinder to find match. Place matched pair together.', extensions: 'Grading from loudest to softest, creating music patterns', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 12, title: 'Mystery Bag (Stereognostic)', area: 'sensorial', ageRange: 'Toddler', duration: '10 min', materials: 'Fabric bag, 5–6 familiar objects (ball, block, spoon, shell, key)', directAim: 'Identify objects by touch alone without looking', indirectAim: 'Tactile discrimination, vocabulary, cognitive association', presentation: 'Place objects on mat. Child explores each. Put all in bag. Child reaches in, feels one, names it before removing.', extensions: 'Paired objects to match by touch, geometric solids in bag, nature items', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 13, title: 'Fabric Matching', area: 'sensorial', ageRange: 'Toddler', duration: '10 min', materials: 'Pairs of fabric swatches (silk, cotton, wool, felt, velvet, hessian)', directAim: 'Match pairs of fabrics by texture with eyes open, then closed', indirectAim: 'Tactile refinement, vocabulary (rough, smooth, soft), concentration', presentation: 'Lay out one set. Feel each swatch. Pick from second set and find its match by texture. Name the texture.', extensions: 'Blindfold matching, grading rough to smooth, fabric collage art', eylfLink: 'Outcome 4 — Confident learners' },

  // Language
  { id: 14, title: 'Sandpaper Letters', area: 'language', ageRange: 'Pre-Kindy', duration: '10 min', materials: 'Sandpaper letter cards (consonants on pink, vowels on blue)', directAim: 'Trace the letter shape while saying its phonetic sound', indirectAim: 'Muscle memory for writing, phonemic awareness, letter recognition', presentation: 'Present three letters. Trace with index and middle finger while saying sound. Child traces and repeats. Three-period lesson.', extensions: 'Eyes-closed tracing, sand tray writing, matching to objects beginning with that sound', eylfLink: 'Outcome 5 — Communicators' },
  { id: 15, title: 'I Spy (Phonics Game)', area: 'language', ageRange: 'Pre-Kindy', duration: '10 min', materials: 'Small objects or miniatures on a tray (3–5 items)', directAim: 'Identify the beginning sound of each object\'s name', indirectAim: 'Phonemic awareness, auditory discrimination, vocabulary expansion', presentation: '"I spy with my little eye something beginning with /s/." Child identifies the object. Progress to ending sounds, then middle sounds.', extensions: 'Sound sorting baskets, rhyming I Spy, blending sounds to make words', eylfLink: 'Outcome 5 — Communicators' },
  { id: 16, title: 'Moveable Alphabet', area: 'language', ageRange: 'Pre-Kindy', duration: '15 min', materials: 'Box of wooden/plastic letters (blue consonants, red vowels), picture cards or objects', directAim: 'Build words using individual letter tiles', indirectAim: 'Encoding (spelling), word construction, reading preparation', presentation: 'Choose an object (e.g. "cat"). Say each sound slowly: /c/ /a/ /t/. Find each letter. Place in order left to right.', extensions: 'Building CVC words, phonogram words, labelling objects in the room, sentence building', eylfLink: 'Outcome 5 — Communicators' },
  { id: 17, title: 'Classified Cards (3-Part Cards)', area: 'language', ageRange: 'Toddler', duration: '10 min', materials: 'Sets of 3-part cards: picture+label, picture only, label only (e.g. fruits, animals)', directAim: 'Match picture cards to labelled control cards and read the labels', indirectAim: 'Vocabulary enrichment, classification, early reading', presentation: 'Lay out control cards. Match picture cards below. For readers, match label cards. Name each item.', extensions: 'Creating own card sets, sorting by category, using real objects first', eylfLink: 'Outcome 5 — Communicators' },
  { id: 18, title: 'Story Basket Retelling', area: 'language', ageRange: 'Toddler', duration: '15 min', materials: 'Familiar picture book, basket with props/figures matching the story', directAim: 'Retell a story sequence using physical props', indirectAim: 'Narrative skills, sequencing, expressive language, comprehension', presentation: 'Read story together. Introduce basket props. Child uses props to retell story in sequence. Encourage dialogue.', extensions: 'Creating new endings, acting out with peers, drawing the story sequence', eylfLink: 'Outcome 5 — Communicators' },

  // Mathematics
  { id: 19, title: 'Number Rods', area: 'mathematics', ageRange: 'Pre-Kindy', duration: '15 min', materials: '10 alternating red-and-blue wooden rods (10cm to 100cm)', directAim: 'Grade rods by length and associate each with its quantity name', indirectAim: 'Concrete understanding of quantity 1–10, number sequence, linear counting', presentation: 'Carry rods to mat. Grade shortest to longest. Count segments: "One", "One-two", etc. Three-period lesson for names.', extensions: 'Addition with rods, subtraction, number card matching, making 10 combinations', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 20, title: 'Spindle Boxes', area: 'mathematics', ageRange: 'Pre-Kindy', duration: '10 min', materials: 'Two boxes with compartments labelled 0–9, 45 wooden spindles, elastic bands', directAim: 'Place the correct number of spindles into each compartment', indirectAim: 'Understanding of zero, one-to-one correspondence, grouping concept', presentation: 'Point to "0" — "This is zero, it means nothing goes here." Count 1 spindle into 1, bundle with band. Continue to 9.', extensions: 'Cards and counters, odd/even sorting, memory game with quantities', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 21, title: 'Sandpaper Numerals', area: 'mathematics', ageRange: 'Pre-Kindy', duration: '10 min', materials: 'Sandpaper numeral boards 0–9', directAim: 'Trace each numeral while saying its name', indirectAim: 'Muscle memory for numeral writing, numeral recognition, number sequence', presentation: 'Present three numerals. Trace with two fingers while saying the name. Three-period lesson. Child traces and repeats.', extensions: 'Sand tray writing, numeral matching with quantity, numeral rubbings', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 22, title: 'Golden Bead Material — Units', area: 'mathematics', ageRange: 'Pre-Kindy', duration: '15 min', materials: 'Golden beads: unit beads, ten bars, hundred squares, thousand cubes; number cards', directAim: 'Associate unit bead with numeral card, understand place value concretely', indirectAim: 'Decimal system foundation, quantity-symbol association, preparation for operations', presentation: 'Introduce unit bead: "This is one unit." Show ten bar: "This is one ten." Fetch game: "Bring me 3 units." Match with numeral card.', extensions: 'Building numbers to 9999, addition with golden beads, stamp game transition', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 23, title: 'Teen Board', area: 'mathematics', ageRange: 'Pre-Kindy', duration: '10 min', materials: 'Wooden board with printed 10s, numeral cards 1–9, ten bars and unit beads', directAim: 'Build and name teen numbers 11–19', indirectAim: 'Understanding teens as "ten and ___", place value reinforcement', presentation: 'Place "10" on board. Slide "1" over the zero: "Eleven — that is ten and one." Build with one ten bar and one unit bead. Continue to 19.', extensions: 'Ten board (20–99), hundred board, number writing practice', eylfLink: 'Outcome 4 — Confident learners' },

  // Cultural Studies
  { id: 24, title: 'Land, Water, Air Sorting', area: 'cultural', ageRange: 'Toddler', duration: '15 min', materials: 'Globe, classified cards or miniatures of land/water/air animals and vehicles, sorting mat', directAim: 'Sort objects or pictures into land, water, or air categories', indirectAim: 'Classification skills, geography awareness, vocabulary (continent, ocean)', presentation: 'Explore globe — feel rough land, smooth water. Introduce categories. Sort objects: "A fish lives in water." Place on mat.', extensions: 'Continent globe, puzzle maps, habitat dioramas, transport sorting', eylfLink: 'Outcome 2 — Connected to world' },
  { id: 25, title: 'Puzzle Map — Australia', area: 'cultural', ageRange: 'Pre-Kindy', duration: '15 min', materials: 'Wooden puzzle map of Australia with removable state pieces, control map, labels', directAim: 'Remove, name, and replace each state/territory piece', indirectAim: 'Geography knowledge, spatial awareness, fine motor control, Australian identity', presentation: 'Remove pieces one at a time. Name state. Trace shape. Replace. Match labels for readers. Locate on control map.', extensions: 'World puzzle map, continent folders, flag matching, Aboriginal Country map comparison', eylfLink: 'Outcome 2 — Connected to world' },
  { id: 26, title: 'Parts of a Plant', area: 'cultural', ageRange: 'Pre-Kindy', duration: '15 min', materials: 'Real plant with roots, botany puzzle, 3-part cards (root, stem, leaf, flower, fruit)', directAim: 'Identify and name the parts of a plant', indirectAim: 'Botanical vocabulary, scientific observation, care for living things', presentation: 'Examine real plant together. Name each part. Match to puzzle pieces. Use 3-part cards for reinforcement.', extensions: 'Parts of a flower, leaf shapes, seed germination experiment, plant journal', eylfLink: 'Outcome 2 — Connected to world' },
  { id: 27, title: 'Aboriginal Seasons Calendar', area: 'cultural', ageRange: 'All', duration: '20 min', materials: 'Local Aboriginal seasons chart, nature items, clipboards, coloured pencils', directAim: 'Explore the local Aboriginal seasonal calendar and observe current season signs', indirectAim: 'Respect for First Nations knowledge, environmental awareness, cultural competence', presentation: 'Introduce the local Aboriginal seasons (e.g. Noongar six seasons). Walk outdoors to observe signs of the current season. Collect items. Record observations.', extensions: 'Creating a class seasons wheel, Elder or community visit, seasonal cooking', eylfLink: 'Outcome 2 — Connected to world' },
  { id: 28, title: 'Sink or Float Experiment', area: 'cultural', ageRange: 'Toddler', duration: '15 min', materials: 'Basin of water, collection of objects (cork, stone, leaf, coin, feather, block), prediction chart', directAim: 'Predict and test whether objects sink or float', indirectAim: 'Scientific method (predict, test, observe), vocabulary (sink, float, heavy, light)', presentation: 'Hold up each object. "Do you think this will sink or float?" Record prediction. Place in water. Observe result. Discuss why.', extensions: 'Making boats from foil, exploring density with liquids, recording results in science journal', eylfLink: 'Outcome 4 — Confident learners' },
  { id: 29, title: 'Music Bells — Grading', area: 'cultural', ageRange: 'Pre-Kindy', duration: '15 min', materials: 'Set of 8 Montessori bells (or tone bars), mallet, mat', directAim: 'Grade bells from lowest pitch to highest pitch', indirectAim: 'Auditory discrimination, musical appreciation, concentration, vocabulary (high, low, pitch)', presentation: 'Strike first bell. Listen. Strike second. Compare: higher or lower? Find the lowest. Place at left. Continue grading.', extensions: 'Pairing bells by pitch, playing simple melodies, composing patterns', eylfLink: 'Outcome 5 — Communicators' },
  { id: 30, title: 'Caring for Animals', area: 'cultural', ageRange: 'All', duration: '15 min', materials: 'Class pet or visiting animal, feeding supplies, observation journal', directAim: 'Feed, water, and observe the class animal following a care routine', indirectAim: 'Responsibility, empathy, life science knowledge, routine and sequencing', presentation: 'Check water bowl — refill if low. Measure food. Place in bowl. Observe animal behaviour. Record in journal with drawing and words.', extensions: 'Life cycle study, habitat comparison, animal classification cards', eylfLink: 'Outcome 2 — Connected to world' },
];

const AGE_FILTERS: { label: string; value: AgeRange | 'All' }[] = [
  { label: 'All Ages', value: 'All' },
  { label: 'Infant (0–1)', value: 'Infant' },
  { label: 'Toddler (1–3)', value: 'Toddler' },
  { label: 'Pre-Kindy (3–5)', value: 'Pre-Kindy' },
];

export const MontessoriCurriculum: React.FC = () => {
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState<AgeRange | 'All'>('All');
  const [areaFilter, setAreaFilter] = useState<string | 'all'>('all');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = activities.filter(a => {
    if (ageFilter !== 'All' && a.ageRange !== ageFilter && a.ageRange !== 'All') return false;
    if (areaFilter !== 'all' && a.area !== areaFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.directAim.toLowerCase().includes(q) || a.materials.toLowerCase().includes(q);
    }
    return true;
  });

  const groupedByArea = AREAS.map(area => ({
    ...area,
    activities: filtered.filter(a => a.area === area.key),
  })).filter(g => g.activities.length > 0);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Montessori Curriculum</h1>
            <p className="text-slate-500 text-sm">Activities across all five Montessori curriculum areas</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BookOpen className="w-4 h-4" />
            <span className="font-semibold text-teal-700">{activities.length}</span> activities
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Search activities, materials..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {AGE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setAgeFilter(f.value)}
                className={`px-3 py-2 text-xs rounded-lg font-medium transition-colors ${ageFilter === f.value ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Area Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setAreaFilter('all')}
            className={`px-4 py-2 text-xs rounded-lg font-semibold whitespace-nowrap transition-colors ${areaFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            All Areas
          </button>
          {AREAS.map(area => (
            <button
              key={area.key}
              onClick={() => setAreaFilter(area.key)}
              className={`px-4 py-2 text-xs rounded-lg font-semibold whitespace-nowrap transition-colors ${areaFilter === area.key ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {area.icon} {area.label}
            </button>
          ))}
        </div>

        {/* Activity Groups */}
        {groupedByArea.map(group => (
          <div key={group.key} className="space-y-3">
            <div className={`rounded-xl border p-4 ${group.color}`}>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="text-xl">{group.icon}</span> {group.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${group.badge}`}>{group.activities.length} activities</span>
              </h2>
              <p className="text-xs mt-1 opacity-75">{group.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.activities.map(activity => {
                const isExpanded = expanded === activity.id;
                return (
                  <div
                    key={activity.id}
                    className={`bg-white rounded-xl border transition-all cursor-pointer ${isExpanded ? 'border-teal-200 shadow-md col-span-1 md:col-span-2' : 'border-slate-100 hover:border-slate-200'}`}
                    onClick={() => setExpanded(isExpanded ? null : activity.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 text-sm">{activity.title}</h3>
                          <p className="text-xs text-slate-500 mt-1">{activity.directAim}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">{activity.ageRange}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {activity.duration}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> Direct Aim</h4>
                              <p className="text-xs text-slate-600 leading-relaxed">{activity.directAim}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><Star className="w-3 h-3 text-violet-500" /> Indirect Aim</h4>
                              <p className="text-xs text-slate-600 leading-relaxed">{activity.indirectAim}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-700 mb-1">Materials</h4>
                            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{activity.materials}</p>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-700 mb-1">Presentation</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{activity.presentation}</p>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-700 mb-1">Extensions</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{activity.extensions}</p>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-medium">{activity.eylfLink}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">No activities match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
