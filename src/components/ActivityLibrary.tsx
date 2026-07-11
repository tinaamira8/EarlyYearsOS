import React, { useRef, useState } from 'react';
import { Library, Loader2, Search, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getQuickActivities } from '../services/geminiService';

const seedActivities = [
  // Babies
  { id: 1, title: 'Sensory Water Play', ageGroup: 'Babies', outcomes: ['Outcome 3', 'Outcome 4'], materials: 'Water tray, cups, funnels, coloured water', description: 'Children explore properties of water through pouring, scooping and splashing.' },
  { id: 11, title: 'Treasure Basket Exploration', ageGroup: 'Babies', outcomes: ['Outcome 4'], materials: 'Basket, wooden spoon, fabric, pinecone, metal cup, brush', description: 'Babies explore a collection of natural and everyday objects using all their senses — touching, mouthing, shaking and dropping.' },
  { id: 12, title: 'Peek-a-Boo Scarves', ageGroup: 'Babies', outcomes: ['Outcome 1', 'Outcome 5'], materials: 'Sheer scarves in bright colours', description: 'Simple peek-a-boo play with scarves supports object permanence, turn-taking and joyful social interaction.' },
  { id: 13, title: 'Tummy Time Mirrors', ageGroup: 'Babies', outcomes: ['Outcome 1', 'Outcome 3'], materials: 'Safety mirror, soft mat, high-contrast cards', description: 'Babies engage with their own reflection during tummy time, building self-awareness and strengthening neck muscles.' },
  { id: 14, title: 'Messy Sensory Tray', ageGroup: 'Babies', outcomes: ['Outcome 3', 'Outcome 4'], materials: 'Cooked spaghetti, jelly, mashed banana, high-sided tray', description: 'Babies explore different textures and temperatures through safe, taste-friendly messy play.' },
  { id: 15, title: 'Musical Shakers', ageGroup: 'Babies', outcomes: ['Outcome 4', 'Outcome 5'], materials: 'Sealed containers with rice, bells, pasta; music player', description: 'Babies shake, rattle and listen to different sounds, building cause-and-effect understanding and rhythmic awareness.' },
  { id: 16, title: 'Black & White Sensory Board', ageGroup: 'Babies', outcomes: ['Outcome 4'], materials: 'High-contrast cards, textured fabrics, crinkle paper', description: 'A wall-mounted board with high-contrast patterns and textures for visual and tactile exploration.' },
  { id: 17, title: 'Bubble Play', ageGroup: 'Babies', outcomes: ['Outcome 3', 'Outcome 4'], materials: 'Bubble solution, bubble wands', description: 'Watching and reaching for bubbles supports visual tracking, hand-eye coordination and pure wonder.' },

  // Toddlers
  { id: 2, title: 'Nature Collage', ageGroup: 'Toddlers', outcomes: ['Outcome 2', 'Outcome 5'], materials: 'Leaves, bark, feathers, glue, paper', description: 'Collect natural materials outdoors and create collaborative nature collages.' },
  { id: 5, title: 'Playdough Kitchen', ageGroup: 'Toddlers', outcomes: ['Outcome 3', 'Outcome 4'], materials: 'Playdough, kitchen tools, cookie cutters', description: 'Dramatic play with playdough in a kitchen setup builds fine motor skills.' },
  { id: 7, title: 'Feelings Faces', ageGroup: 'Toddlers', outcomes: ['Outcome 1', 'Outcome 3'], materials: 'Mirror, emotion cards, playdough', description: 'Help children identify and name emotions using mirrors, cards and face-making.' },
  { id: 18, title: 'Painting with Trucks', ageGroup: 'Toddlers', outcomes: ['Outcome 4', 'Outcome 5'], materials: 'Toy trucks, paint, large paper', description: 'Dip truck wheels in paint and drive them across paper — exploring patterns, colour mixing and creative mark-making.' },
  { id: 19, title: 'Obstacle Course', ageGroup: 'Toddlers', outcomes: ['Outcome 3'], materials: 'Tunnels, stepping stones, balance beam, soft mats', description: 'A simple indoor or outdoor obstacle course builds gross motor skills, spatial awareness and confidence.' },
  { id: 20, title: 'Posting & Sorting Box', ageGroup: 'Toddlers', outcomes: ['Outcome 4'], materials: 'Cardboard box with shaped holes, wooden shapes, pom poms', description: 'Toddlers post objects through shaped holes, developing hand-eye coordination and problem-solving.' },
  { id: 21, title: 'Teddy Bears\' Picnic', ageGroup: 'Toddlers', outcomes: ['Outcome 1', 'Outcome 5'], materials: 'Stuffed toys, blanket, play food, cups, plates', description: 'Dramatic play picnic with teddies encourages language, social skills and imaginative role play.' },
  { id: 22, title: 'Sand Play Diggers', ageGroup: 'Toddlers', outcomes: ['Outcome 3', 'Outcome 4'], materials: 'Sandpit, scoops, buckets, toy diggers, moulds', description: 'Open-ended sand play with tools builds fine motor strength and supports sensory exploration.' },
  { id: 23, title: 'Rainbow Rice Sensory Bin', ageGroup: 'Toddlers', outcomes: ['Outcome 4'], materials: 'Dyed rice, containers, scoops, funnels, animals', description: 'Toddlers pour, scoop and hide objects in colourful rice — building concentration and fine motor skills.' },
  { id: 24, title: 'Finger Painting', ageGroup: 'Toddlers', outcomes: ['Outcome 4', 'Outcome 5'], materials: 'Finger paint, large paper, aprons', description: 'Free finger painting on large surfaces encourages creative expression, colour exploration and sensory engagement.' },

  // Pre-Kindy
  { id: 3, title: 'Colour Mixing Science', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 4'], materials: 'Food colouring, water, pipettes, containers', description: 'Investigate what happens when colours are mixed together.' },
  { id: 6, title: 'Bug Hotel Construction', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 2', 'Outcome 4'], materials: 'Sticks, bark, cardboard tubes, string', description: 'Collaboratively design and build a hotel for insects to foster environmental stewardship.' },
  { id: 9, title: 'Aboriginal Dot Art', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 1', 'Outcome 2'], materials: 'Cotton buds, paint, black paper', description: 'Learn about and create art inspired by Aboriginal Australian artistic traditions.' },
  { id: 10, title: 'Counting Collections', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 4', 'Outcome 5'], materials: 'Natural objects (shells, rocks), sorting trays, number cards', description: 'Children sort, count and order collections to develop early numeracy concepts.' },
  { id: 25, title: 'Shadow Drawing', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 4'], materials: 'Chalk, outdoor space, toys for shadow casting', description: 'Children trace the shadows of objects on pavement, exploring light, shape and scientific thinking.' },
  { id: 26, title: 'Letter Hunt Adventure', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 5'], materials: 'Magnetic letters, sand tray, letter cards, magnifying glasses', description: 'Children search for hidden letters in sand or around the room, matching them to their name or word cards.' },
  { id: 27, title: 'Building Bridges Challenge', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 4'], materials: 'Blocks, planks, toy cars, tape measure', description: 'Children work together to build a bridge strong enough to hold toy cars — exploring engineering, measurement and teamwork.' },
  { id: 28, title: 'Volcano Science Experiment', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 4', 'Outcome 5'], materials: 'Baking soda, vinegar, food colouring, tray, small bottle', description: 'Create a fizzing volcano and discuss why it erupts — building vocabulary and early scientific inquiry skills.' },
  { id: 29, title: 'Weather Station', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 2', 'Outcome 4'], materials: 'Thermometer, rain gauge, wind sock, weather chart', description: 'Children record daily weather observations, building data literacy and environmental awareness.' },
  { id: 30, title: 'Pattern Making with Pegs', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 4'], materials: 'Coloured pegs, peg boards, pattern cards', description: 'Copy and create colour patterns on pegboards, developing mathematical thinking and fine motor precision.' },
  { id: 31, title: 'Dinosaur Fossil Dig', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 4', 'Outcome 5'], materials: 'Sand tray, buried toy dinosaurs, brushes, magnifying glasses', description: 'Children carefully excavate toy dinosaurs from sand, role-playing as palaeontologists and building inquiry language.' },
  { id: 32, title: 'My Family Portrait', ageGroup: 'Pre-Kindy', outcomes: ['Outcome 1', 'Outcome 5'], materials: 'Paper, crayons, markers, family photos for reference', description: 'Children draw portraits of their family members, discussing who is in their family and what makes them special.' },

  // All ages
  { id: 4, title: 'Story Stones', ageGroup: 'All', outcomes: ['Outcome 1', 'Outcome 5'], materials: 'Painted rocks with characters, open space', description: 'Children use story stones to create and narrate their own stories.' },
  { id: 8, title: 'Loose Parts Design', ageGroup: 'All', outcomes: ['Outcome 4', 'Outcome 5'], materials: 'Buttons, fabric, shells, wooden blocks, tubes', description: 'Open-ended loose parts invitation for creative construction and design thinking.' },
  { id: 33, title: 'Music & Movement Circle', ageGroup: 'All', outcomes: ['Outcome 3', 'Outcome 5'], materials: 'Tambourine, scarves, music speaker, open space', description: 'Guided music and movement session with singing, dancing and instrument play — building rhythm, coordination and group belonging.' },
  { id: 34, title: 'Gardening Together', ageGroup: 'All', outcomes: ['Outcome 2', 'Outcome 3'], materials: 'Seedlings, pots, soil, watering cans, labels', description: 'Plant seeds or seedlings and care for them daily — nurturing responsibility, patience and connection to the natural world.' },
  { id: 35, title: 'Yoga & Mindfulness', ageGroup: 'All', outcomes: ['Outcome 3'], materials: 'Yoga mats, calm music, visual pose cards', description: 'Simple animal-themed yoga poses and breathing exercises to build body awareness, calm and self-regulation.' },
  { id: 36, title: 'Collaborative Mural', ageGroup: 'All', outcomes: ['Outcome 1', 'Outcome 2', 'Outcome 5'], materials: 'Large paper roll, paint, brushes, sponges, stamps', description: 'All children contribute to a large group mural on a chosen theme — building belonging, creativity and shared ownership.' },
  { id: 37, title: 'Cooking Together — Fruit Salad', ageGroup: 'All', outcomes: ['Outcome 3', 'Outcome 4'], materials: 'Seasonal fruit, child-safe knives, chopping boards, bowls', description: 'Children wash, cut and combine fruit to make a group fruit salad — practising self-help skills, maths and healthy eating.' },
  { id: 38, title: 'Bush Kinder Nature Walk', ageGroup: 'All', outcomes: ['Outcome 2', 'Outcome 4'], materials: 'Collection bags, magnifying glasses, clipboards, pencils', description: 'An outdoor walk through nearby bush or parkland to observe, collect and discuss natural finds.' },
];

const ageGroups = ['All', 'Babies', 'Toddlers', 'Pre-Kindy'];

export const ActivityLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('All');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activities, setActivities] = useState(seedActivities);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const generateActivities = async () => {
    if (!search.trim()) {
      setShowPrompt(true);
      searchRef.current?.focus();
      toast('Type a theme first, e.g. "water play" or "dinosaurs"', { icon: '✏️' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await getQuickActivities(search, ageFilter) as Array<{ title: string; objective: string; materials: string[]; instructions: string }>;
      const generated = result.map((item, index) => ({ id: Date.now() + index, title: item.title, ageGroup: ageFilter, outcomes: ['Educator review'], materials: item.materials.join(', '), description: `${item.objective} ${item.instructions}` }));
      setActivities(current => [...generated, ...current]);
      setSearch('');
      toast.success('AI activity ideas added for educator review.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filtered = activities.filter(a =>
    (ageFilter === 'All' || a.ageGroup === ageFilter || a.ageGroup === 'All') &&
    (!search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Library className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Activity Library</h1>
            <p className="text-slate-500 text-sm">Curated learning activities with EYLF links</p>
          </div>
          <button disabled={isGenerating} onClick={() => void generateActivities()} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50">{isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate ideas</button>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input ref={searchRef} className={`w-full bg-white border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${showPrompt && !search ? 'border-violet-400 ring-2 ring-violet-200' : 'border-slate-200'}`} placeholder={showPrompt && !search ? 'e.g. water play, dinosaurs, emotions...' : 'Search activities...'} value={search} onChange={e => { setSearch(e.target.value); if (e.target.value) setShowPrompt(false); }} />
          </div>
          <div className="flex gap-2">
            {ageGroups.map(g => (
              <button key={g} onClick={() => setAgeFilter(g)} className={`px-3 py-2 text-xs rounded-lg font-medium ${ageFilter === g ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{g}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-green-200 transition-colors cursor-pointer" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-800">{a.title}</h3>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">{a.ageGroup}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.description}</p>
                {expanded === a.id && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <div>
                      <span className="text-xs font-medium text-slate-600">Materials: </span>
                      <span className="text-xs text-slate-500">{a.materials}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {a.outcomes.map(o => <span key={o} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{o}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-slate-400 py-10">No activities found for your search.</p>}
      </div>
    </div>
  );
};
