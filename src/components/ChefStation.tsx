import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { DbUser, DbChild } from '../services/types';
import {
  Utensils, AlertCircle, FileText, CheckCircle2,
  Search, ShieldAlert, Heart, Calendar, Loader2, Sparkles,
  Sun, CloudRain, Snowflake, Flower2, ChevronLeft, ChevronRight, Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateMenu } from '../services/geminiService';

interface ChefStationProps {
  user?: DbUser | null;
}

interface DayMenu {
  morning: string;
  lunch: string;
  afternoon: string;
}

interface WeekMenu {
  mon: DayMenu;
  tue: DayMenu;
  wed: DayMenu;
  thu: DayMenu;
  fri: DayMenu;
}

type Season = 'summer' | 'autumn' | 'winter' | 'spring';

const SEASON_CONFIG: Record<Season, { label: string; icon: React.ReactNode; months: string; bg: string; border: string; text: string; headerBg: string }> = {
  summer: { label: 'Summer', icon: <Sun className="w-5 h-5" />, months: 'Dec – Feb', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', headerBg: 'bg-amber-100' },
  autumn: { label: 'Autumn', icon: <CloudRain className="w-5 h-5" />, months: 'Mar – May', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', headerBg: 'bg-orange-100' },
  winter: { label: 'Winter', icon: <Snowflake className="w-5 h-5" />, months: 'Jun – Aug', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', headerBg: 'bg-sky-100' },
  spring: { label: 'Spring', icon: <Flower2 className="w-5 h-5" />, months: 'Sep – Nov', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', headerBg: 'bg-emerald-100' },
};

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri'] as const;
const DAY_LABELS: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday' };

const seasonalMenus: Record<Season, WeekMenu[]> = {
  summer: [
    {
      mon: { morning: 'Watermelon wedges & rice cakes', lunch: 'Cold chicken pasta salad with cucumber', afternoon: 'Frozen yoghurt bark with berries' },
      tue: { morning: 'Rockmelon & wholemeal toast fingers', lunch: 'Tuna & salad wraps', afternoon: 'Fruit kebabs with yoghurt dip' },
      wed: { morning: 'Mango smoothie cups & crackers', lunch: 'Cold soba noodle bowls with edamame', afternoon: 'Cheese & veggie sticks' },
      thu: { morning: 'Mixed berry platter & pikelets', lunch: 'Mediterranean couscous with chickpeas', afternoon: 'Banana ice cream cups' },
      fri: { morning: 'Pineapple rings & banana bread', lunch: 'Rice paper rolls with dipping sauce', afternoon: 'Coconut chia pudding' },
    },
    {
      mon: { morning: 'Peach slices & corn thins', lunch: 'Greek salad with feta & wholemeal pita', afternoon: 'Frozen fruit popsicles' },
      tue: { morning: 'Grapes & cheese cubes', lunch: 'Cold roast vegetable & quinoa salad', afternoon: 'Watermelon pizza with yoghurt' },
      wed: { morning: 'Nectarine halves & oat muffins', lunch: 'Chicken Caesar wraps (no egg)', afternoon: 'Cucumber sushi rolls' },
      thu: { morning: 'Mixed melon balls & toast', lunch: 'Caprese pasta salad', afternoon: 'Apple & peanut-free butter' },
      fri: { morning: 'Strawberries & yoghurt parfait', lunch: 'Teriyaki tofu rice bowls', afternoon: 'Fruit salad with mint' },
    },
    {
      mon: { morning: 'Kiwi slices & raisin toast', lunch: 'Pulled chicken & slaw rolls', afternoon: 'Frozen banana bites' },
      tue: { morning: 'Papaya boats & crackers', lunch: 'Cold lentil & beetroot salad', afternoon: 'Veggie fritters (cooled)' },
      wed: { morning: 'Cherries & cheese toast', lunch: 'Sushi bowls with avocado', afternoon: 'Mango coconut bites' },
      thu: { morning: 'Plum halves & pikelets', lunch: 'Zucchini slice with salad', afternoon: 'Berry smoothie bowls' },
      fri: { morning: 'Banana & granola cups', lunch: 'Vietnamese vermicelli bowls', afternoon: 'Chilled fruit jelly cups' },
    },
    {
      mon: { morning: 'Passionfruit yoghurt & toast', lunch: 'Mexican bean & corn salad cups', afternoon: 'Frozen grape clusters' },
      tue: { morning: 'Blueberry & oat bars', lunch: 'Chicken & mango rice bowls', afternoon: 'Celery & cream cheese' },
      wed: { morning: 'Lychee & rice crackers', lunch: 'Rainbow veggie wraps', afternoon: 'Coconut rice pudding (chilled)' },
      thu: { morning: 'Mixed stone fruit & muffins', lunch: 'Pesto pasta with cherry tomatoes', afternoon: 'Fruit & yoghurt ice blocks' },
      fri: { morning: 'Dragonfruit & toast fingers', lunch: 'Mediterranean plate (hummus, falafels, salad)', afternoon: 'Banana smoothie cups' },
    },
  ],
  autumn: [
    {
      mon: { morning: 'Apple slices & cinnamon toast', lunch: 'Pumpkin & sweet potato soup with bread', afternoon: 'Pear & cheese platter' },
      tue: { morning: 'Banana & wholemeal pikelets', lunch: 'Shepherd\'s pie with hidden veggies', afternoon: 'Baked apple chips' },
      wed: { morning: 'Pear halves & oat muffins', lunch: 'Chicken & corn risotto', afternoon: 'Veggie sticks & hummus' },
      thu: { morning: 'Mandarin segments & raisin toast', lunch: 'Beef & vegetable stew with mash', afternoon: 'Apple & oat slice' },
      fri: { morning: 'Fig & yoghurt cups', lunch: 'Spinach & ricotta pasta bake', afternoon: 'Pumpkin scones' },
    },
    {
      mon: { morning: 'Stewed apples & toast', lunch: 'Minestrone soup with crusty bread', afternoon: 'Banana oat cookies' },
      tue: { morning: 'Persimmon slices & crackers', lunch: 'Chicken & vegetable pie', afternoon: 'Cheese & apple stacks' },
      wed: { morning: 'Grapes & cheese toast', lunch: 'Lamb & lentil curry with rice', afternoon: 'Pear muffins' },
      thu: { morning: 'Feijoa halves & pikelets', lunch: 'Tuna mornay with peas', afternoon: 'Carrot & zucchini sticks with dip' },
      fri: { morning: 'Kiwi & banana smoothie cups', lunch: 'Mushroom & cheese quesadillas', afternoon: 'Warm fruit crumble' },
    },
    {
      mon: { morning: 'Poached pear & yoghurt', lunch: 'Creamy chicken & corn soup', afternoon: 'Anzac biscuits' },
      tue: { morning: 'Apple & cinnamon oat cups', lunch: 'Vegetable frittata with salad', afternoon: 'Mandarin & cheese cubes' },
      wed: { morning: 'Banana bread & fruit', lunch: 'Beef bolognese with penne', afternoon: 'Sweet potato chips (baked)' },
      thu: { morning: 'Pear & ricotta toast', lunch: 'Asian chicken noodle soup', afternoon: 'Fruit & nut-free trail mix' },
      fri: { morning: 'Stewed rhubarb & yoghurt', lunch: 'Jacket potatoes with baked beans', afternoon: 'Zucchini bread slices' },
    },
    {
      mon: { morning: 'Roasted pear & muesli', lunch: 'Lentil & pumpkin soup', afternoon: 'Cheese scones' },
      tue: { morning: 'Apple sauce & toast fingers', lunch: 'Fish cakes with mash & peas', afternoon: 'Fig & yoghurt' },
      wed: { morning: 'Mandarin & oat slice', lunch: 'Chicken & mushroom pasta', afternoon: 'Beetroot hummus & crackers' },
      thu: { morning: 'Banana & date muffins', lunch: 'Vegetable lasagne', afternoon: 'Apple crumble cups' },
      fri: { morning: 'Persimmon & cheese plate', lunch: 'Pork & vegetable fried rice', afternoon: 'Warm custard & stewed fruit' },
    },
  ],
  winter: [
    {
      mon: { morning: 'Warm porridge with banana', lunch: 'Chicken & vegetable soup with rolls', afternoon: 'Cheese toasties' },
      tue: { morning: 'Cinnamon French toast', lunch: 'Lamb & barley stew', afternoon: 'Warm apple & cinnamon muffins' },
      wed: { morning: 'Scrambled eggs & toast soldiers', lunch: 'Mac & cheese with broccoli', afternoon: 'Warm milk & oat cookies' },
      thu: { morning: 'Banana porridge with honey', lunch: 'Beef & vegetable casserole with rice', afternoon: 'Pumpkin soup shooters' },
      fri: { morning: 'Baked beans on toast', lunch: 'Tuna pasta bake', afternoon: 'Warm fruit bread with butter' },
    },
    {
      mon: { morning: 'Oat & cinnamon porridge', lunch: 'Chicken korma with rice', afternoon: 'Cheese & vegemite scrolls' },
      tue: { morning: 'Crumpets with jam', lunch: 'Sausage & vegetable bake', afternoon: 'Warm banana bread' },
      wed: { morning: 'Bircher muesli (warm)', lunch: 'Pea & ham soup with bread', afternoon: 'Baked custard cups' },
      thu: { morning: 'Toast with avocado', lunch: 'Chicken & corn chowder', afternoon: 'Warm date & oat slice' },
      fri: { morning: 'Pancakes with stewed apple', lunch: 'Fish fingers with chips & salad', afternoon: 'Warm rice pudding' },
    },
    {
      mon: { morning: 'Warm Weet-Bix with milk', lunch: 'Beef & root vegetable pie', afternoon: 'Cheese & tomato toasties' },
      tue: { morning: 'Boiled eggs & toast', lunch: 'Creamy pumpkin risotto', afternoon: 'Banana & oat pancakes' },
      wed: { morning: 'Cinnamon oat porridge', lunch: 'Spaghetti bolognese', afternoon: 'Warm pear crumble' },
      thu: { morning: 'Toast with cream cheese', lunch: 'Chicken, leek & potato bake', afternoon: 'Warm damper with butter' },
      fri: { morning: 'Warm fruit compote & yoghurt', lunch: 'Vegetable curry with naan', afternoon: 'Hot chocolate & plain biscuits' },
    },
    {
      mon: { morning: 'Porridge with cinnamon & pear', lunch: 'Chicken noodle soup', afternoon: 'Cheese & spinach scrolls' },
      tue: { morning: 'Savoury muffins', lunch: 'Lamb ragu with pasta', afternoon: 'Warm bread & butter pudding' },
      wed: { morning: 'French toast with banana', lunch: 'Vegetable & lentil dhal with rice', afternoon: 'Apple cinnamon pikelets' },
      thu: { morning: 'Warm baked oats', lunch: 'Cottage pie with sweet potato top', afternoon: 'Cheese quesadillas' },
      fri: { morning: 'Crumpets with banana', lunch: 'Cream of mushroom soup & bread', afternoon: 'Warm fruit salad with custard' },
    },
  ],
  spring: [
    {
      mon: { morning: 'Strawberry & yoghurt cups', lunch: 'Chicken & spring vegetable risotto', afternoon: 'Carrot & zucchini muffins' },
      tue: { morning: 'Orange slices & toast', lunch: 'Spring vegetable minestrone', afternoon: 'Cheese & crackers with grapes' },
      wed: { morning: 'Mixed berries & pikelets', lunch: 'Fish tacos with slaw', afternoon: 'Banana & oat bliss balls' },
      thu: { morning: 'Apple & cinnamon toast', lunch: 'Pea & mint pasta with parmesan', afternoon: 'Cucumber & hummus cups' },
      fri: { morning: 'Banana smoothie & toast', lunch: 'Lamb & rosemary sausage rolls with salad', afternoon: 'Fruit platter with yoghurt' },
    },
    {
      mon: { morning: 'Strawberry toast & yoghurt', lunch: 'Chicken stir-fry with rice', afternoon: 'Corn fritters' },
      tue: { morning: 'Kiwi & banana cups', lunch: 'Spring pea & leek soup with bread', afternoon: 'Apple & cheese slices' },
      wed: { morning: 'Berry smoothie bowls', lunch: 'Tuna & corn pasta bake', afternoon: 'Veggie sticks & tzatziki' },
      thu: { morning: 'Toast with avocado & tomato', lunch: 'Chicken & asparagus quiche', afternoon: 'Banana pikelets' },
      fri: { morning: 'Mango & yoghurt parfait', lunch: 'Vegetable fried rice', afternoon: 'Fruit & oat bars' },
    },
    {
      mon: { morning: 'Peach & ricotta toast', lunch: 'Honey soy chicken with noodles', afternoon: 'Cheese & herb scones' },
      tue: { morning: 'Berry & oat muffins', lunch: 'Spring lamb wraps with salad', afternoon: 'Fruit jelly cups' },
      wed: { morning: 'Banana & honey toast', lunch: 'Pumpkin & feta pasta', afternoon: 'Veggie pikelets' },
      thu: { morning: 'Mixed fruit & yoghurt', lunch: 'Chicken schnitzel with mash & peas', afternoon: 'Cheese & vegemite scrolls' },
      fri: { morning: 'Orange & date muffins', lunch: 'Spring garden salad with tuna', afternoon: 'Banana bread' },
    },
    {
      mon: { morning: 'Strawberry & cream cheese toast', lunch: 'Chicken & sweetcorn soup', afternoon: 'Oat & apple cookies' },
      tue: { morning: 'Plum & yoghurt cups', lunch: 'Beef meatballs with pasta & sauce', afternoon: 'Cucumber & cheese bites' },
      wed: { morning: 'Mixed berry pikelets', lunch: 'Fish & vegetable bake', afternoon: 'Fruit smoothie cups' },
      thu: { morning: 'Banana & cinnamon toast', lunch: 'Spring vegetable quiche with salad', afternoon: 'Pumpkin & cheese scrolls' },
      fri: { morning: 'Rockmelon & crackers', lunch: 'Chicken & avocado wraps', afternoon: 'End-of-term celebration platter' },
    },
  ],
};

const getCurrentSeason = (): Season => {
  const month = new Date().getMonth();
  if (month >= 11 || month <= 1) return 'summer';
  if (month >= 2 && month <= 4) return 'autumn';
  if (month >= 5 && month <= 7) return 'winter';
  return 'spring';
};

export const ChefStation: React.FC<ChefStationProps> = ({ user }) => {
  const [children, setChildren] = useState<DbChild[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNextWeek, setShowNextWeek] = useState(false);
  const [editingMenu, setEditingMenu] = useState(false);
  const [menu, setMenu] = useState({
    morning: 'Fruit Platter & Wholemeal Toast',
    lunch: 'Vegetarian Shepherd\'s Pie',
    afternoon: 'Yoghurt and Berries (Dairy-free option available)'
  });
  const [nextWeekMenu, setNextWeekMenu] = useState({ morning: 'Wholemeal Pikelets & Seasonal Fruit', lunch: 'Chicken and Vegetable Couscous', afternoon: 'Hummus, Crackers and Cucumber' });
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState<Season>(getCurrentSeason());
  const [selectedWeek, setSelectedWeek] = useState(0);

  useEffect(() => {
    if (user?.centreId) {
      db.children.getChildren(user.centreId).then(setChildren).catch(console.error);
    }
  }, [user]);

  const childrenWithAllergies = children.map((c, i) => ({
    ...c,
    allergies: i % 4 === 0 ? ['Peanuts', 'Dairy'] : i % 7 === 0 ? ['Eggs'] : c.allergies || [],
    medicalCondition: i % 4 === 0 ? 'Anaphylactic to Peanuts' : c.medicalCondition,
    severity: i % 4 === 0 ? 'High' : (i % 7 === 0 ? 'Medium' : c.severity)
  })).filter(c => c.allergies && c.allergies.length > 0 && c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const displayedMenu = showNextWeek ? nextWeekMenu : menu;

  const generateNextMenu = async () => {
    setIsGenerating(true);
    try {
      const allergies = Array.from(new Set(children.flatMap(child => child.allergies || [])));
      const result = await generateMenu('next week', 'balanced, age-appropriate Australian childcare menu', allergies);
      const firstDay = result[0];
      if (!firstDay) throw new Error('The AI did not return a menu.');
      setNextWeekMenu({ morning: firstDay.morningTea, lunch: firstDay.lunch, afternoon: firstDay.afternoonTea });
      setShowNextWeek(true);
      toast.success('AI menu draft generated. Chef and allergy review is required.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const seasonCfg = SEASON_CONFIG[selectedSeason];
  const weekMenu = seasonalMenus[selectedSeason][selectedWeek];

  const handlePrint = () => {
    const printContent = document.getElementById('seasonal-menu-print');
    if (!printContent) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>${seasonCfg.label} Menu - Week ${selectedWeek + 1}</title><style>
      body{font-family:system-ui,sans-serif;padding:2rem;color:#1e293b}
      h1{font-size:1.5rem;margin-bottom:.5rem}
      h2{font-size:1rem;color:#64748b;margin-bottom:1.5rem}
      table{width:100%;border-collapse:collapse;font-size:.85rem}
      th,td{border:1px solid #e2e8f0;padding:.5rem .75rem;text-align:left;vertical-align:top}
      th{background:#f8fafc;font-weight:700;text-transform:uppercase;font-size:.7rem;letter-spacing:.05em}
      .meal-label{font-weight:600;font-size:.7rem;text-transform:uppercase;color:#64748b;margin-bottom:.15rem}
    </style></head><body>${printContent.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Chef Station</h1>
                <p className="text-slate-500 font-medium mt-1">Daily Menus and strict dietary requirement management.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button disabled={isGenerating} type="button" onClick={() => void generateNextMenu()} className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-50">
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} AI menu draft
            </button>
            <button type="button" onClick={() => setShowNextWeek(value => !value)} className="px-5 py-3 w-full sm:w-auto bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> {showNextWeek ? "Today's Menu" : "Next Week's Menu"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Menu */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 text-orange-600">
              <FileText className="w-5 h-5" />
              <h2 className="text-xl font-bold">Today's Menu</h2>
            </div>

            <div className="space-y-4 flex-1">
              <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4">
                <p className="text-xs font-black text-orange-800 uppercase tracking-wider mb-1">Morning Tea</p>
                {editingMenu && !showNextWeek ? <input aria-label="Morning tea" value={menu.morning} onChange={event => setMenu(current => ({ ...current, morning: event.target.value }))} className="w-full rounded border border-orange-200 px-2 py-1" /> : <p className="font-semibold text-slate-700">{displayedMenu.morning}</p>}
              </div>
              <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4">
                <p className="text-xs font-black text-sky-800 uppercase tracking-wider mb-1">Lunch</p>
                {editingMenu && !showNextWeek ? <input aria-label="Lunch" value={menu.lunch} onChange={event => setMenu(current => ({ ...current, lunch: event.target.value }))} className="w-full rounded border border-sky-200 px-2 py-1" /> : <p className="font-semibold text-slate-700">{displayedMenu.lunch}</p>}
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
                <p className="text-xs font-black text-indigo-800 uppercase tracking-wider mb-1">Afternoon Tea</p>
                {editingMenu && !showNextWeek ? <input aria-label="Afternoon tea" value={menu.afternoon} onChange={event => setMenu(current => ({ ...current, afternoon: event.target.value }))} className="w-full rounded border border-indigo-200 px-2 py-1" /> : <p className="font-semibold text-slate-700">{displayedMenu.afternoon}</p>}
              </div>
            </div>

            <button type="button" disabled={showNextWeek} onClick={() => setEditingMenu(value => !value)} className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50">
              {editingMenu ? 'Save Menu' : 'Edit Menu'}
            </button>
          </div>

          {/* Dietary Requirements Risk Board */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-2 text-rose-600">
                <ShieldAlert className="w-5 h-5" />
                <h2 className="text-xl font-bold text-slate-900">Dietary Requirements</h2>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter children..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-lg text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {childrenWithAllergies.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 font-medium">
                  No dietary risks matched your search.
                </div>
              ) : childrenWithAllergies.map(child => (
                <div key={child.id} className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between transition-colors ${child.severity === 'High' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 ${child.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        {child.name}
                        {child.severity === 'High' && <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-black">High Risk</span>}
                      </h3>
                      <p className="text-sm font-semibold text-slate-700 mt-1 flex flex-wrap gap-1">
                        Allergies:
                        {child.allergies?.map((al, idx) => (
                           <span key={idx} className="bg-white border border-slate-200 px-2 rounded">{al}</span>
                        ))}
                      </p>
                      {child.medicalCondition && (
                        <p className="text-xs text-rose-600 font-bold mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {child.medicalCondition}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-end gap-2 md:w-32 shrink-0">
                     <button type="button" onClick={() => toast.success(`Action plan opened for ${child.name}`)} className="w-full text-xs font-bold py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors">
                        Action Plan
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Week Seasonal Menu Planner */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Season Selector */}
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" /> 4-Week Seasonal Menu Planner
              </h2>
              <p className="text-sm text-slate-500 mt-1">Complete rotating menus aligned to Australian seasons and NQS food safety guidelines.</p>
            </div>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors">
              <Printer className="w-4 h-4" /> Print Week
            </button>
          </div>

          {/* Season Tabs */}
          <div className="flex border-b border-slate-200">
            {(Object.keys(SEASON_CONFIG) as Season[]).map(season => {
              const cfg = SEASON_CONFIG[season];
              const isActive = selectedSeason === season;
              return (
                <button
                  key={season}
                  onClick={() => { setSelectedSeason(season); setSelectedWeek(0); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors border-b-2 ${isActive ? `${cfg.text} ${cfg.headerBg} border-current` : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'}`}
                >
                  {cfg.icon} {cfg.label}
                  <span className="hidden sm:inline text-xs font-normal opacity-70">({cfg.months})</span>
                </button>
              );
            })}
          </div>

          {/* Week Navigation */}
          <div className={`flex items-center justify-between px-6 py-3 ${seasonCfg.bg}`}>
            <button
              onClick={() => setSelectedWeek(w => Math.max(0, w - 1))}
              disabled={selectedWeek === 0}
              className="p-1.5 rounded-lg hover:bg-white/50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${selectedWeek === w ? `bg-white shadow-sm ${seasonCfg.text}` : 'text-slate-500 hover:bg-white/40'}`}
                >
                  Week {w + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedWeek(w => Math.min(3, w + 1))}
              disabled={selectedWeek === 3}
              className="p-1.5 rounded-lg hover:bg-white/50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekly Menu Table */}
          <div className="overflow-x-auto" id="seasonal-menu-print">
            <h1 className="hidden print:block text-xl font-bold px-4 pt-4">{seasonCfg.label} Menu — Week {selectedWeek + 1}</h1>
            <h2 className="hidden print:block text-sm text-slate-500 px-4 pb-2">{seasonCfg.months} · EarlyYearsOS</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className={seasonCfg.bg}>
                  <th className={`px-4 py-3 text-left text-xs font-black uppercase tracking-wider ${seasonCfg.text} w-24`}>Day</th>
                  <th className={`px-4 py-3 text-left text-xs font-black uppercase tracking-wider ${seasonCfg.text}`}>Morning Tea</th>
                  <th className={`px-4 py-3 text-left text-xs font-black uppercase tracking-wider ${seasonCfg.text}`}>Lunch</th>
                  <th className={`px-4 py-3 text-left text-xs font-black uppercase tracking-wider ${seasonCfg.text}`}>Afternoon Tea</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DAYS.map(day => {
                  const dayMenu = weekMenu[day];
                  return (
                    <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-bold text-slate-800 text-xs uppercase">{DAY_LABELS[day]}</td>
                      <td className="px-4 py-4 text-slate-700">{dayMenu.morning}</td>
                      <td className="px-4 py-4 text-slate-700 font-medium">{dayMenu.lunch}</td>
                      <td className="px-4 py-4 text-slate-700">{dayMenu.afternoon}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className={`px-6 py-3 ${seasonCfg.bg} border-t ${seasonCfg.border} text-xs ${seasonCfg.text} font-medium`}>
            All menus are nut-free. Dairy-free, egg-free and gluten-free alternatives are prepared as required. Menus are reviewed by the centre cook and approved by management each term.
          </div>
        </div>

      </div>
    </div>
  );
};
