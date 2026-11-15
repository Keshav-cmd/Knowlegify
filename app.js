/* ================= KNOWLEGIFY // RESEARCH TERMINAL ================= */
(function(){
'use strict';

/* ---------- utils ---------- */
const $ = (s, r) => (r||document).querySelector(s);
const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad2 = n => String(n).padStart(2,'0');
const todayStr = () => { const d=new Date(); return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); };
const nowT = () => { const d=new Date(); return pad2(d.getHours())+':'+pad2(d.getMinutes())+':'+pad2(d.getSeconds()); };
function weekNum(){ const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+3-((d.getDay()+6)%7)); const w1=new Date(d.getFullYear(),0,4); return d.getFullYear()+'-W'+pad2(1+Math.round(((d-w1)/864e5-3+((w1.getDay()+6)%7))/7)); }
function timeAgo(ts){ const s=Math.max(1,Math.floor((Date.now()-ts)/1000)); if(s<60) return s+'s ago'; const m=Math.floor(s/60); if(m<60) return m+'m ago'; const h=Math.floor(m/60); if(h<24) return h+'h ago'; const d=Math.floor(h/24); if(d<30) return d+'d ago'; return new Date(ts).toLocaleDateString(); }
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const uid = p => (p||'id')+'_'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36);

/* ---------- static data ---------- */
const KGP = 'https://ndl.iitkgp.ac.in/';
const CATS = [
  {id:'all', name:'All resources', icon:'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'},
  {id:'paper', name:'Research papers', url:'https://ndl.iitkgp.ac.in/ndl_re', icon:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6'},
  {id:'article', name:'Articles', url:'https://ndl.iitkgp.ac.in/ndl_nw', icon:'M4 22h16 M4 2v20 M20 2v20 M8 6h8 M8 10h8 M8 14h5'},
  {id:'experiment', name:'Experiments & simulations', url:'https://phet.colorado.edu/en/simulations/browse', icon:'M9 3h6 M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3'},
  {id:'journal', name:'Journals', url:'https://doaj.org/', icon:'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5z'},
  {id:'dataset', name:'Datasets', url:'https://datasetsearch.research.google.com/', icon:'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.3 7L12 12l8.7-5 M12 22V12'},
  {id:'official', name:'IIT Kharagpur Digital Library', url:'https://ndl.iitkgp.ac.in/', icon:'M22 10L12 5 2 10l10 5 10-5z M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5'},
  {id:'mine', name:'My uploads', icon:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12'},
  {id:'saved', name:'Saved resources', icon:'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'}
];
const catName = id => (CATS.find(c=>c.id===id)||{name:id}).name;
const TYPE_BADGE = {paper:'paper', article:'article', experiment:'experiment', journal:'journal', dataset:'dataset', official:'official'};

const RESOURCES = [
 {id:'r1', type:'paper', title:'Attention, Revisited: What 9 Years of Transformers Taught Us', author:'Dr. Anaya Sharma', org:'IIT Kharagpur · AI Lab', date:'2026-11-08', read:14, tags:['AI','transformers','NLP'], rating:4.8, ratings:212, likes:342, url:KGP, featured:1,
  abs:'A retrospective meta-analysis of 400+ transformer papers tracing how attention mechanisms evolved from machine translation to multimodal reasoning — and where the architecture goes next.',
  findings:['Sparse attention cuts inference cost by 61% with <1% accuracy loss on long-context benchmarks.','Hybrid SSM-attention models now match pure transformers on 7 of 9 reasoning suites.','The "context wall" is economic, not architectural: retrieval still wins past 1M tokens.'],
  methods:'Systematic review of 412 peer-reviewed papers (2017–2026) plus reproduced benchmarks on 6 open model families using a fixed 2,000-prompt evaluation harness.'},
 {id:'r2', type:'paper', title:'Solid-State Batteries: The 2026 Commercial Outlook', author:'Prof. Rahul Verma', org:'IIT Bombay · Energy Storage Group', date:'2026-11-02', read:11, tags:['energy','batteries','materials'], rating:4.6, ratings:148, likes:287, url:KGP, featured:1,
  abs:'Techno-economic modelling of sulfide vs. oxide solid electrolytes, mapping which chemistries actually reach $75/kWh first — and which startups will survive the ramp.',
  findings:['Sulfide cells hit 420 Wh/kg in pilot lines but yield above 80% remains elusive.','Oxide routes are slower yet bankable: 3 GWh of capacity financed in 2026.','Sodium solid-state is the dark horse for stationary storage at $52/kWh projected.'],
  methods:'Bottom-up cost modelling across 11 pilot facilities, interviews with 34 cell engineers, and cycle-life testing of 240 pouch cells over 1,200 cycles.'},
 {id:'r3', type:'article', title:'CRISPR Diagnostics Move Out of the Lab', author:'Meera Iyer', org:'Knowlegify Science Desk', date:'2026-10-28', read:7, tags:['bio','CRISPR','health'], rating:4.5, ratings:96, likes:198, url:'https://ndl.gov.in/',
  abs:'Shelf-stable, paper-strip CRISPR tests are now detecting tuberculosis and dengue in rural clinics at $0.40 a test. Here is how the field trials actually performed.',
  findings:['Field sensitivity of 94.2% vs. PCR across 6,100 patients in 3 states.','Cold-chain-free reagents survived 45°C storage for 90 days.','Health-worker training time dropped from 3 days to 4 hours with visual guides.'],
  methods:'Reporting from 14 primary health centres; trial data shared by the diagnostics consortium under open-access terms.'},
 {id:'r4', type:'journal', title:'Quantum Error Correction Breaks Even at 1,024 Physical Qubits', author:'Dr. Ken Watanabe', org:'Quantum Systems Journal · Vol 12', date:'2026-10-20', read:18, tags:['quantum','computing'], rating:4.9, ratings:301, likes:415, url:KGP, featured:1,
  abs:'Peer-reviewed results showing a surface-code logical qubit surviving longer than any of its physical parts — the field\'s most-watched milestone, finally quantified.',
  findings:['Logical error rate of 0.8× physical baseline sustained over 10^6 cycles.','Real-time decoding latency under 900ns using on-chip neural decoders.','Overhead projections fall from 1,000:1 to ~220:1 with new lattice surgery.'],
  methods:'Surface-code distance-11 implementation on a 1,024-qubit superconducting processor; full error-budget tomography published alongside.'},
 {id:'r5', type:'experiment', title:'Low-Cost Desalination Membranes from Rice Husk Ash', author:'Arjun Nair', org:'Community Lab · Kochi', date:'2026-10-15', read:9, tags:['energy','water','materials'], rating:4.4, ratings:77, likes:176, url:'https://ndl.gov.in/',
  abs:'A reproducible community-lab protocol: silica membranes from agricultural waste that desalinate brackish water at one-tenth the cost of commercial RO.',
  findings:['Salt rejection of 96.1% at 4 bar operating pressure.','Membrane cost of ₹140/m² vs. ₹1,600/m² commercial.','Flux decline stabilises after 40 hours — full fouling curves included.'],
  methods:'Open hardware build (BOM under ₹8,000), 3 replicate membrane casts, 200-hour continuous filtration runs with daily TDS logging.'},
 {id:'r6', type:'dataset', title:'Urban Heat Islands: India Satellite Dataset 2015–2026', author:'Climate Data Collective', org:'Open Data · CC-BY-4.0', date:'2026-10-09', read:5, tags:['climate','dataset','satellite'], rating:4.7, ratings:189, likes:264, url:KGP,
  abs:'11 years of harmonised land-surface temperature for 42 Indian cities at 100m resolution, with night-time UHI intensity indices and ward-level aggregates.',
  findings:['Night-time UHI intensity rose 0.9°C on average across tier-1 cities.','Green cover above 18% correlates with 2.3°C cooler wards.','Heat-wave days doubled in 6 of the 10 largest metros since 2015.'],
  methods:'Landsat 8/9 + MODIS fusion, cloud-masked and validated against 310 ground stations; full pipeline notebooks included.'},
 {id:'r7', type:'article', title:'Edge AI Spots Crop Disease Before Farmers Can', author:'Priya Desai', org:'Knowlegify Science Desk', date:'2026-09-30', read:6, tags:['AI','agriculture','edge'], rating:4.3, ratings:64, likes:143, url:'https://ndl.gov.in/',
  abs:'A ₹2,500 phone attachment plus a 4MB neural net now flags blight and rust a week before visible symptoms — tested across 900 farms.',
  findings:['Early detection 6–9 days before human scouts at 91% precision.','Runs fully offline on 2GB-RAM phones at 12 fps.','Pesticide use fell 23% in the treatment group over one season.'],
  methods:'Randomised control trial across 900 farms in Maharashtra and Punjab; model card and training set released openly.'},
 {id:'r8', type:'paper', title:'Fusion Ignition: What the NIF Campaigns Taught Us', author:'Dr. Elena Petrova', org:'Plasma Physics Review', date:'2026-09-22', read:16, tags:['energy','fusion','physics'], rating:4.7, ratings:176, likes:298, url:KGP,
  abs:'A clear-eyed engineering review of inertial confinement ignition shots: what scaled, what surprised everyone, and what laser fusion must prove by 2030.',
  findings:['Gain above unity repeated in 9 of 14 recent shots — repeatability is the new record.','Target fabrication, not lasers, is now the binding constraint.','Hybrid inertial-magnetic concepts cut driver energy needs by ~40% in simulation.'],
  methods:'Review of published shot data 2022–2026 with independent re-analysis of neutron yields and energy-balance accounting.'},
 {id:'r9', type:'experiment', title:'Open Robotics Control Stacks, Benchmarked', author:'Team Actuator', org:'Community Lab · Bengaluru', date:'2026-09-14', read:10, tags:['robotics','open-source'], rating:4.2, ratings:58, likes:121, url:'https://ndl.gov.in/',
  abs:'Five open-source arm-control stacks tested on identical hardware: latency, jitter, sim-to-real gap, and the real cost of "free".',
  findings:['Fastest stack hit 240Hz control loops on a Raspberry Pi 5.','Sim-to-real success varied 41–83% across stacks on the same task.','Documentation quality predicted adoption better than raw performance.'],
  methods:'Standardised pick-and-place suite, 500 trials per stack, identical 6-DOF arm and camera rig; all configs versioned.'},
 {id:'r10', type:'official', title:'IIT KGP National Digital Library — Official Portal', author:'IIT Kharagpur', org:'National Digital Library of India', date:'2026-11-12', read:2, tags:['library','official','papers'], rating:5.0, ratings:1024, likes:520, url:KGP, featured:1,
  abs:'The official gateway: millions of research papers, journals, theses and academic resources from IIT Kharagpur\'s National Digital Library.',
  findings:['Single search across journals, theses, patents and coursework.','Free access to a vast open collection for learners.','Curated subject portals for engineering and science.'],
  methods:'Maintained by IIT Kharagpur as part of the National Digital Library of India initiative.'},
 {id:'r11', type:'journal', title:'mRNA Beyond COVID: Cancer, Malaria and the Next 20 Trials', author:'Dr. Sofia Almeida', org:'BioFrontiers · Vol 8', date:'2026-09-05', read:13, tags:['bio','health','mRNA'], rating:4.6, ratings:134, likes:231, url:KGP,
  abs:'A tour of the mRNA pipeline now that the platform is proven: personalised cancer vaccines, malaria, and self-amplifying second-gen shots.',
  findings:['Personalised melanoma vaccine shows 44% lower recurrence in phase 2b.','Self-amplifying shots need 1/10th the dose in early trials.','Thermostable formulations reach 6 months at 2–8°C.'],
  methods:'Trial-registry analysis of 214 active mRNA studies plus interviews with 12 principal investigators.'},
 {id:'r12', type:'dataset', title:'Neuromorphic Chips: Open Benchmark Suite v3', author:'Hardware Commons', org:'Open Data · Apache-2.0', date:'2026-08-27', read:4, tags:['hardware','AI','dataset'], rating:4.4, ratings:82, likes:157, url:'https://ndl.gov.in/',
  abs:'Energy-per-inference benchmarks for 9 neuromorphic and edge accelerators on vision, audio and spiking-network workloads.',
  findings:['Best spiking chip hits 0.4 mJ/inference on keyword spotting.','Analog in-memory compute leads on dense vision, lags on sparse.','Full raw traces included for 1.2M inference runs.'],
  methods:'Standardised harness, wall-plug power measurement, 3 runs per workload with thermal soak controls.'}
];

const SEED_COMMENTS = {
 r1:[{u:'sarah_chen',t:'The retrieval-vs-context analysis alone is worth the read. Section 4 changed how I design RAG pipelines.',ts:Date.now()-86400000*2},{u:'alex_kim',t:'Anyone reproduced the hybrid SSM benchmarks? Getting slightly different numbers on my runs.',ts:Date.now()-86400000}],
 r4:[{u:'maria_r',t:'Below-threshold logical qubit, finally. The decoder latency numbers are the real story here.',ts:Date.now()-86400000*3}],
 r2:[{u:'james_w',t:'The $75/kWh crossover chart should be required reading for every battery investor.',ts:Date.now()-86400000*4}],
 r10:[{u:'prof_iyer',t:'Pinning this for all new lab members. Start every literature review here.',ts:Date.now()-86400000*5}]
};

const QUIZZES = [
 {id:'q1', title:'ml_basics.exe', name:'Machine Learning Basics', desc:'Overfitting, gradients, evaluation — the fundamentals every researcher should have on tap.', tags:['AI'], qs:[
   {q:'Your training accuracy is 99% but validation accuracy is 71%. What is most likely happening?',o:['Underfitting','Overfitting','Vanishing gradients','Data leakage in validation'],a:1,x:'A large train/validation gap is the classic signature of overfitting — the model memorised training noise instead of learning general patterns.'},
   {q:'Which metric is most appropriate for a fraud-detection model where 99.8% of transactions are legitimate?',o:['Accuracy','Precision-Recall / F1','R² score','Mean squared error'],a:1,x:'Accuracy is misleading on imbalanced data (a "never fraud" model scores 99.8%). Precision, recall and F1 measure what actually matters.'},
   {q:'What does the learning rate control in gradient descent?',o:['Model depth','Step size of weight updates','Number of epochs','Batch normalisation'],a:1,x:'The learning rate scales each gradient step: too large diverges, too small crawls. Schedulers adjust it during training.'},
   {q:'Why do we split data into train / validation / test sets?',o:['To train faster','To tune on validation and get one unbiased test estimate','To use more memory','It is only needed for neural nets'],a:1,x:'Validation guides tuning decisions; the test set is touched once for an honest, unbiased estimate of real-world performance.'},
   {q:'Dropout regularises a network mainly by…',o:['Removing layers permanently','Randomly zeroing activations during training','Clipping gradients','Augmenting the dataset'],a:1,x:'Dropout randomly drops units per batch, forcing redundant representations — effectively training an ensemble in one network.'}]},
 {id:'q2', title:'energy_2030.exe', name:'Energy & Sustainability', desc:'Batteries, grids, and the numbers behind the energy transition.', tags:['energy'], qs:[
   {q:'A lithium-ion cell rated 5 Ah at 3.7 V stores roughly how much energy?',o:['1.35 Wh','18.5 Wh','37 Wh','185 Wh'],a:1,x:'Energy = capacity × voltage = 5 Ah × 3.7 V = 18.5 Wh. A useful rule of thumb for pack sizing.'},
   {q:'Why is solar power "intermittent" a grid problem even when it is cheap?',o:['Panels degrade in rain','Supply peaks at midday but demand peaks in the evening','Solar inverters cannot connect to AC grids','Sunlight damages transformers'],a:1,x:'The mismatch between midday solar peaks and evening demand peaks forces grids to add storage, flexible demand, or backup capacity.'},
   {q:'What does "round-trip efficiency" of storage mean?',o:['How fast it charges','Energy recovered ÷ energy stored','Cycle life in years','Charge/discharge current ratio'],a:1,x:'Round-trip efficiency = energy out / energy in. Li-ion is ~85–95%; green hydrogen is ~30–40%.'},
   {q:'Which sector is hardest to decarbonise ("hard to abate")?',o:['Residential lighting','Steel and cement','Office heating','Consumer electronics'],a:1,x:'Steel and cement need extreme heat and involve chemical CO₂ release — requiring hydrogen, CCS, or entirely new processes.'},
   {q:'A 1 kW rooftop system in India generates roughly how much per day?',o:['0.4 kWh','4 kWh','24 kWh','100 kWh'],a:1,x:'With ~4–5 peak sun hours, 1 kW yields about 4–5 kWh/day — hence the common "4 units per kW per day" estimate.'}]},
 {id:'q3', title:'research_methods.exe', name:'Research Methods', desc:'P-values, controls, and how to read a paper without fooling yourself.', tags:['methods'], qs:[
   {q:'A p-value of 0.03 means…',o:['There is a 3% chance the hypothesis is false','Such extreme data would occur 3% of the time if the null were true','The effect size is 3%','The result will replicate with 97% probability'],a:1,x:'A p-value is P(data|null), not P(null|data). It says nothing direct about effect size or replication odds.'},
   {q:'Why run a randomised control group?',o:['To double the sample size','To isolate the treatment effect from confounders','To satisfy reviewers','To reduce measurement cost'],a:1,x:'Randomisation balances known and unknown confounders across groups, so differences can be attributed to the treatment.'},
   {q:'What is "p-hacking"?',o:['Hacking journal servers','Trying many analyses until one is significant','Citing predatory journals','Using p-values in physics'],a:1,x:'P-hacking — testing many outcomes/subgroups and reporting only hits — inflates false positives. Pre-registration is the fix.'},
   {q:'A confidence interval of [2.1, 5.4] for a treatment effect tells you…',o:['95% of patients improved by 2.1–5.4','The procedure captures the true effect 95% of the time over repeats','The effect is exactly 3.75','Significance is guaranteed'],a:1,x:'A 95% CI means: over many repeats, 95% of such intervals would contain the true effect. It also shows precision.'},
   {q:'The best first step when reading an unfamiliar paper is…',o:['Memorise every equation','Read abstract → figures → conclusions, then decide','Email the authors','Check the reference count'],a:1,x:'Skim abstract, figures and conclusions first (first pass), then decide if a deep read is worth your time — the classic three-pass method.'}]}
];

const ACHS = [
 {id:'booted', n:'Hello, World', d:'Complete onboarding and boot the terminal', b:0, i:'▣'},
 {id:'first-like', n:'Signal Detected', d:'Like your first resource', b:10, i:'♥'},
 {id:'curator', n:'Curator', d:'Bookmark 3 resources', b:15, i:'◆'},
 {id:'commentator', n:'Peer Reviewer', d:'Post your first comment', b:10, i:'✎'},
 {id:'scholar', n:'Scholar', d:'Complete reading 1 resource', b:20, i:'▲'},
 {id:'bookworm', n:'Bookworm', d:'Complete reading 3 resources', b:40, i:'▤'},
 {id:'quiz-rookie', n:'Quiz Rookie', d:'Finish your first quiz', b:20, i:'?'},
 {id:'perfectionist', n:'Perfectionist', d:'Score 100% on any quiz', b:50, i:'★'},
 {id:'uploader', n:'Published', d:'Upload your own research', b:30, i:'⇪'},
 {id:'networker', n:'Networker', d:'Follow 2 authors', b:20, i:'⎇'},
 {id:'explorer', n:'Explorer', d:'Browse 4 different categories', b:20, i:'⌖'},
 {id:'focused', n:'Deep Focus', d:'Complete a focus session', b:25, i:'◉'},
 {id:'streak3', n:'On Fire', d:'Reach a 3-day streak', b:60, i:'♨'},
 {id:'thousand', n:'1K Club', d:'Reach 1,000 research points', b:100, i:'⬢'}
];

const RIVALS = [
 {name:'Sarah Chen', base:1380, total:8420},
 {name:'Alex Kim', base:1240, total:7310},
 {name:'Maria Rodriguez', base:1150, total:6890},
 {name:'James Wilson', base:1060, total:6140},
 {name:'Priya Nair', base:940, total:5210},
 {name:'Tom Becker', base:870, total:4980},
 {name:'Liu Wei', base:790, total:4460}
];
const LEVELS = ['novice','explorer','researcher','scholar','scientist','visionary','luminary','legend'];
const LEVEL_AT = [0,150,400,800,1400,2200,3200,4500];
const INTERESTS = ['AI','energy','bio','quantum','climate','robotics','space','hardware','methods'];

/* ---------- state ---------- */
const KEY = 'kgx_state_v2';
function defaults(){
  return {v:2, onboarded:false, user:{name:'guest', interests:[]},
    theme:'green', sound:false, points:0,
    streak:{count:0,last:''}, daily:{date:'',earned:0,read:0,bonus:false}, weekly:{week:'',pts:0},
    likes:{}, bookmarks:[], ratings:{}, progress:{}, completed:[], history:[],
    comments:{}, uploads:[], quizBest:{}, quizRuns:0, perfects:[],
    ach:[], follows:[], searches:[], notifs:[], pointsHist:[],
    explored:{date:'',cats:[]}, focusDone:0, read:0};
}
let S;
function load(){ try{ const raw=localStorage.getItem(KEY); if(!raw) return defaults(); const s=Object.assign(defaults(), JSON.parse(raw)); if(s.v!==2) return defaults(); return s; }catch(e){ return defaults(); } }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
S = load();

function ensureDaily(){ const t=todayStr(); if(S.daily.date!==t){ S.daily={date:t,earned:0,read:0,bonus:false}; } if(S.explored.date!==t){ S.explored={date:t,cats:[]}; } }
function ensureWeekly(){ const w=weekNum(); if(S.weekly.week!==w){ S.weekly={week:w,pts:0}; } }
function checkin(){
  ensureDaily(); ensureWeekly();
  const t=todayStr(), y=new Date(Date.now()-864e5); const ys=y.getFullYear()+'-'+pad2(y.getMonth()+1)+'-'+pad2(y.getDate());
  if(S.streak.last!==t){
    S.streak.count = (S.streak.last===ys) ? S.streak.count+1 : 1;
    S.streak.last = t;
    addPts(20,'daily check-in · streak '+S.streak.count);
    notify('<b>Daily check-in.</b> Streak: '+S.streak.count+' day'+(S.streak.count>1?'s':'')+'. +20 pts.');
    grant('streak3');
  }
}

/* ---------- audio ---------- */
let AC=null;
function beep(f,dur){ if(!S.sound) return; try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const o=AC.createOscillator(),g=AC.createGain(); o.type='square'; o.frequency.value=f||660; g.gain.value=0.03; o.connect(g); g.connect(AC.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime+(dur||0.08)); o.stop(AC.currentTime+(dur||0.08)); }catch(e){} }

/* ---------- derived data ---------- */
const allRes = () => S.uploads.concat(RESOURCES);
const getRes = id => allRes().find(r=>r.id===id);
function likeCount(r){ return (r.likes||0) + (S.likes[r.id]?1:0); }
function commentsOf(id){ return (SEED_COMMENTS[id]||[]).concat(S.comments[id]||[]); }
function ratingOf(r){
  const u=S.ratings[r.id];
  if(u!=null){ const tot=(r.rating||0)*(r.ratings||0)+u, c=(r.ratings||0)+1; return {avg:tot/c, n:c}; }
  return {avg:r.rating||0, n:r.ratings||0};
}
function levelIdx(){ let i=0; LEVEL_AT.forEach((t,k)=>{ if(S.points>=t) i=k; }); return i; }
function catCount(id){
  const all=allRes();
  if(id==='all') return all.length;
  if(id==='official') return all.filter(r=>r.type==='official').length;
  if(id==='mine') return S.uploads.length;
  if(id==='saved') return S.bookmarks.length;
  return all.filter(r=>r.type===id).length;
}
function inCat(r, cat){
  if(cat==='all') return true;
  if(cat==='mine') return !!r.mine;
  if(cat==='saved') return S.bookmarks.indexOf(r.id)>=0;
  return r.type===cat;
}
function searchScore(r, q){
  q=q.toLowerCase();
  let s=0;
  if(r.title.toLowerCase().includes(q)) s+=5;
  if(r.author.toLowerCase().includes(q)) s+=3;
  r.tags.forEach(t=>{ if(t.toLowerCase().includes(q)) s+=3; });
  if(r.abs.toLowerCase().includes(q)) s+=2;
  if((r.org||'').toLowerCase().includes(q)) s+=1;
  return s;
}
function recoScore(r){
  const likedTags={};
  Object.keys(S.likes).forEach(id=>{ const g=getRes(id); if(g&&S.likes[id]) g.tags.forEach(t=>likedTags[t.toLowerCase()]=(likedTags[t.toLowerCase()]||0)+1); });
  const ints=S.user.interests.map(i=>i.toLowerCase());
  let s=r.rating||0;
  r.tags.forEach(t=>{ const tl=t.toLowerCase(); if(ints.indexOf(tl)>=0) s+=2.5; if(likedTags[tl]) s+=2*likedTags[tl]; });
  s+=Math.min(2,(r.likes||0)/200);
  return s;
}
function recoWhy(r){
  const ints=S.user.interests.map(i=>i.toLowerCase());
  const hit=r.tags.find(t=>ints.indexOf(t.toLowerCase())>=0);
  if(hit) return 'matches your interest: '+hit;
  for(const id of Object.keys(S.likes)){ const g=getRes(id); if(g&&S.likes[id]){ const sh=g.tags.find(t=>r.tags.indexOf(t)>=0); if(sh) return 'because you liked “'+g.title.slice(0,34)+'…”'; } }
  return 'trending in the lab this week';
}

/* ---------- points / goals / achievements ---------- */
function addPts(n, reason, silent){
  if(!n) return;
  const before=levelIdx();
  S.points=Math.max(0,S.points+n);
  ensureDaily(); ensureWeekly();
  if(n>0){ S.daily.earned+=n; S.weekly.pts+=n; }
  const t=todayStr(), last=S.pointsHist[S.pointsHist.length-1];
  if(last&&last.d===t) last.p=S.points; else { S.pointsHist.push({d:t,p:S.points}); if(S.pointsHist.length>14) S.pointsHist.shift(); }
  save(); renderStats();
  if(!silent&&n>0){ toast('<b>+'+n+' pts</b> — '+esc(reason||''),'pts'); beep(740,0.07); }
  if(levelIdx()>before){ const li=levelIdx(); toast('<b>LEVEL UP</b> — you are now <b>'+LEVELS[li]+'</b> (lvl '+(li+1)+')','pts'); notify('<b>Level up!</b> Rank: '+LEVELS[li]+' (lvl '+(li+1)+').'); beep(520,0.12); setTimeout(()=>beep(780,0.12),130); }
  if(S.points>=1000) grant('thousand');
  checkGoal();
}
function checkGoal(){
  ensureDaily();
  const pe=Math.min(100,Math.round(S.daily.earned)), re=S.daily.read>=1?100:0;
  $('#goalPtsBar').style.width=pe+'%'; $('#goalPtsTxt').textContent=Math.min(S.daily.earned,100)+'/100';
  $('#goalReadBar').style.width=re+'%'; $('#goalReadTxt').textContent=Math.min(S.daily.read,1)+'/1';
  if(S.daily.earned>=100&&S.daily.read>=1&&!S.daily.bonus){
    S.daily.bonus=true; save();
    $('#goalDone').hidden=false;
    addPts(30,'daily objective complete'); notify('<b>Daily objective complete.</b> +30 bonus pts.');
  } else { $('#goalDone').hidden=!S.daily.bonus; }
}
function grant(id){
  const a=ACHS.find(x=>x.id===id);
  if(!a||S.ach.indexOf(id)>=0) return;
  S.ach.push(id); save();
  toast('<b>ACHIEVEMENT</b> '+a.i+' '+esc(a.n)+' — '+esc(a.d)+(a.b?' · +'+a.b+' pts':''),'pts');
  notify('<b>Achievement unlocked:</b> '+esc(a.n)+' — '+esc(a.d));
  beep(660,0.1); setTimeout(()=>beep(990,0.14),120);
  if(a.b) addPts(a.b,'achievement: '+a.n,true);
  if(state.view==='ranks') render();
}
function notify(html){
  S.notifs.unshift({id:uid('n'), t:html, ts:Date.now(), read:false});
  if(S.notifs.length>40) S.notifs.length=40;
  save(); renderBell(); renderNotifs();
}
function toast(html, kind){
  const d=document.createElement('div');
  d.className='toast '+(kind||''); d.innerHTML='<span class="prompt">></span> '+html;
  $('#toasts').appendChild(d);
  setTimeout(()=>{ d.classList.add('out'); setTimeout(()=>d.remove(),320); }, 3400);
}
function syslog(msg){
  const el=$('#sysLog'); if(!el) return;
  const d=document.createElement('div');
  d.innerHTML='<span class="t">['+nowT()+']</span> '+esc(msg);
  el.prepend(d);
  while(el.children.length>30) el.lastChild.remove();
}

/* ---------- header / sidebar / rail ---------- */
function renderStats(){
  $('#pointsVal').textContent=S.points.toLocaleString();
  $('#streakVal').textContent=S.streak.count;
  const pill=$('#pointsPill'); pill.classList.remove('pulse'); void pill.offsetWidth; pill.classList.add('pulse');
  const nm=(S.user.name||'guest');
  $('#avatarBtn').textContent=(nm.trim()[0]||'?');
  $('#menuName').textContent=nm;
  const li=levelIdx(); $('#menuLevel').textContent='lvl '+(li+1)+' · '+LEVELS[li];
}
function renderBell(){
  const u=S.notifs.filter(n=>!n.read).length;
  const b=$('#bellBadge'); b.hidden=u===0; b.textContent=u>9?'9+':u;
}
function renderTree(){
  $('#tree').innerHTML = CATS.map(c=>
    '<li data-act="setcat" data-cat="'+c.id+'" class="'+(state.cat===c.id?'is-active':'')+'" tabindex="0" role="button" aria-label="'+esc(c.name)+'">'+
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="'+c.icon+'"/></svg>'+
    '<span>'+esc(c.name)+'</span><span class="cnt">'+catCount(c.id)+'</span>'+(c.url?'<a class="tree-link" href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer" title="Open '+esc(c.name)+' on its official website" aria-label="Open '+esc(c.name)+' website">↗</a>':'')+'</li>'
  ).join('');
  $$('#tree .tree-link').forEach(a=>a.addEventListener('click',e=>e.stopPropagation()));
}
function weeklyBoard(){
  const seed=parseInt(weekNum().replace(/\D/g,''),10)||1;
  const rnd=mulberry32(seed);
  const rows=RIVALS.map(r=>({name:r.name, pts:r.base+Math.floor(rnd()*120), me:false, total:r.total}));
  rows.push({name:(S.user.name||'guest')+' (you)', pts:S.weekly.pts, me:true, total:S.points});
  rows.sort((a,b)=>b.pts-a.pts);
  return rows;
}
function renderMiniRanks(){
  const rows=weeklyBoard().slice(0,5);
  $('#miniRankList').innerHTML=rows.map((r,i)=>'<li class="'+(r.me?'me':'')+'"><span class="rank-pos">'+(i+1)+'</span><span>'+esc(r.name)+'</span><span class="pts">'+r.pts.toLocaleString()+' pts</span></li>').join('');
}
function renderReco(){
  const scored=allRes().map(r=>({r:r,s:recoScore(r)})).sort((a,b)=>b.s-a.s).slice(0,3);
  $('#recoList').innerHTML=scored.map((x,i)=>
    '<button class="reco" data-act="read" data-id="'+x.r.id+'" type="button"><span class="ri">0'+(i+1)+'</span><span><b>'+esc(x.r.title)+'</b><span>'+esc(recoWhy(x.r))+'</span></span></button>'
  ).join('');
}

/* ---------- view state + router ---------- */
const state={view:'feed', cat:'all', q:'', sort:'reco', tag:'', mytab:'uploads', ranktab:'weekly', listView:false};
let visibleIds=[];

function switchView(v){
  state.view=v;
  $$('.tab').forEach(t=>t.classList.toggle('is-active', t.dataset.view===v));
  render();
  $('#viewRoot').focus({preventScroll:true});
}
function setCat(c, quiet){
  state.view='explore'; state.cat=c; state.q=''; state.tag='';
  $$('.tab').forEach(t=>t.classList.toggle('is-active', t.dataset.view==='explore'));
  ensureDaily();
  if(!quiet){
    if(S.explored.cats.indexOf(c)<0){ S.explored.cats.push(c); if(S.explored.cats.length>=4) grant('explorer'); }
    addPts(5,'exploring '+catName(c));
    save();
  }
  render();
}

/* ---------- cards ---------- */
function cardHTML(r, n){
  const liked=!!S.likes[r.id], saved=S.bookmarks.indexOf(r.id)>=0;
  const rt=ratingOf(r), prog=S.progress[r.id]||0, done=S.completed.indexOf(r.id)>=0;
  return '<article class="card" data-card="'+r.id+'">'+
    '<div class="card-top"><span class="card-num">#'+pad2(n)+'</span>'+
    '<span class="type-badge '+(TYPE_BADGE[r.type]||'paper')+'">'+esc(r.type==='official'?'official':r.type)+'</span>'+
    (done?'<span class="type-badge" style="color:var(--acc)">✓ done</span>':'')+
    '<button class="icon-btn'+(saved?' on':'')+'" data-act="save" data-id="'+r.id+'" type="button" title="'+(saved?'Remove bookmark [b in reader]':'Bookmark')+'" aria-label="Bookmark">'+
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="'+(saved?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button></div>'+
    '<h3><a href="#" data-act="read" data-id="'+r.id+'">'+esc(r.title)+'</a></h3>'+
    '<div class="card-meta"><span>'+esc(r.author)+'</span><span>·</span><span>'+esc(r.date)+'</span><span>·</span><span>'+r.read+' min</span><span>·</span><span style="color:var(--amber)">★ '+rt.avg.toFixed(1)+' ('+rt.n+')</span></div>'+
    '<p class="card-abs">'+esc(r.abs)+'</p>'+
    '<div class="tags">'+r.tags.map(t=>'<button class="tag" data-act="tag" data-tag="'+esc(t)+'" type="button">#'+esc(t)+'</button>').join('')+'</div>'+
    (prog>0?'<div class="progress-wrap"><div class="bar"><i style="width:'+prog+'%"></i></div><span>'+prog+'%</span></div>':'')+
    '<div class="card-foot">'+
      '<button class="act'+(liked?' liked':'')+'" data-act="like" data-id="'+r.id+'" type="button"><svg viewBox="0 0 24 24" width="14" height="14" fill="'+(liked?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>'+likeCount(r)+'</button>'+
      '<button class="act" data-act="comments" data-id="'+r.id+'" type="button"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'+commentsOf(r.id).length+'</button>'+
      '<button class="act" data-act="open" data-id="'+r.id+'" type="button" title="Open external source (+10)"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>source</button>'+
      '<button class="btn sm open-btn" data-act="read" data-id="'+r.id+'" type="button">'+(prog>0&&!done?'continue_':'read_')+'</button>'+
    '</div></article>';
}

/* ---------- views ---------- */
function heroHTML(){
  return '<section class="hero"><div class="hero-bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="t">visitor@knowlegify: ~/feed</span></div>'+
  '<div class="hero-body"><h1><span class="prompt">></span> social_learning <span style="color:var(--acc)">for_innovators</span></h1>'+
  '<p class="hero-sub">Read papers, run experiments, quiz yourself and climb the ranks — every action earns research points.</p>'+
  '<div class="typed-line"><span class="prompt">$</span> <span id="typed"></span><span class="cursor">▊</span></div>'+
  '<div class="hero-stats"><div class="hstat"><b>'+allRes().length+'</b>resources indexed</div><div class="hstat"><b>'+QUIZZES.length+'</b>quiz modules</div><div class="hstat"><b>'+S.ach.length+'/'+ACHS.length+'</b>achievements</div><div class="hstat"><b>'+S.points.toLocaleString()+'</b>your points</div></div>'+
  '<div class="hero-cta"><button class="btn primary" data-act="goto" data-view="explore" type="button">browse_library_</button><button class="btn" data-act="goto" data-view="quizzes" type="button">run_quiz_</button><button class="btn ghost" data-act="kgp" type="button">open IIT_KGP.lib ↗</button></div>'+
  '</div></section>';
}
function secHead(t, link){ return '<div class="sec-head"><h2><span class="prompt">></span> '+t+'</h2><span class="line"></span>'+(link||'')+'</div>'; }

function feedView(){
  const rec=allRes().map(r=>({r:r,s:recoScore(r)})).sort((a,b)=>b.s-a.s).slice(0,3);
  const trend=allRes().slice().sort((a,b)=>likeCount(b)-likeCount(a)).slice(0,4);
  const fresh=allRes().slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,4);
  return heroHTML()+
    secHead('recommended_for_you','<button class="link" data-act="goto" data-view="explore" type="button">explore_all_</button>')+
    '<div class="grid">'+rec.map(x=>{const n=visibleIds.push(x.r.id); return cardHTML(x.r,n).replace('</h3>','</h3><div class="why">▸ '+esc(recoWhy(x.r))+'</div>');}).join('')+'</div>'+
    secHead('trending_now')+
    '<div class="grid">'+trend.map(r=>{const n=visibleIds.push(r.id); return cardHTML(r,n);}).join('')+'</div>'+
    secHead('new_arrivals')+
    '<div class="grid">'+fresh.map(r=>{const n=visibleIds.push(r.id); return cardHTML(r,n);}).join('')+'</div>';
}

function exploreList(){
  let list=allRes().filter(r=>inCat(r,state.cat));
  if(state.tag) list=list.filter(r=>r.tags.map(t=>t.toLowerCase()).indexOf(state.tag.toLowerCase())>=0);
  if(state.q){ list=list.map(r=>({r:r,s:searchScore(r,state.q)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).map(x=>x.r); }
  const sorters={
    reco:(a,b)=>recoScore(b)-recoScore(a),
    trend:(a,b)=>likeCount(b)-likeCount(a),
    rating:(a,b)=>ratingOf(b).avg-ratingOf(a).avg,
    newest:(a,b)=>String(b.date).localeCompare(String(a.date)),
    az:(a,b)=>a.title.localeCompare(b.title)
  };
  if(!state.q) list.sort(sorters[state.sort]||sorters.reco);
  return list;
}
function exploreView(){
  const list=exploreList();
  const chips=[['all','all'],['paper','papers'],['article','articles'],['experiment','experiments'],['journal','journals'],['dataset','datasets'],['official','official']];
  return '<section class="toolbar" aria-label="Search and filter">'+
    '<div class="search-wrap"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>'+
    '<input id="searchInput" type="text" placeholder="Search by title, author, or topic…  ( / )" value="'+esc(state.q)+'" autocomplete="off" aria-label="Search resources"><div id="suggest" class="suggest" hidden></div></div>'+
    '<select id="sortSel" aria-label="Sort by"><option value="reco">sort: recommended</option><option value="trend">sort: trending</option><option value="rating">sort: top rated</option><option value="newest">sort: newest</option><option value="az">sort: A–Z</option></select>'+
    '<div class="view-toggle" role="group" aria-label="View"><button data-act="vgrid" class="'+(state.listView?'':'is-active')+'" type="button">grid</button><button data-act="vlist" class="'+(state.listView?'is-active':'')+'" type="button">list</button></div>'+
  '</section>'+
  '<div class="chips">'+chips.map(c=>'<button class="chip'+(state.cat===c[0]?' is-active':'')+'" data-act="setcat" data-cat="'+c[0]+'" type="button">'+c[1]+'</button>').join('')+
  (state.tag?'<button class="chip is-active" data-act="cleartag" type="button">#'+esc(state.tag)+' ✕</button>':'')+'</div>'+
  '<p class="count-line"><span class="prompt">$</span> ls '+esc(catName(state.cat))+' — <b style="color:var(--tx)">'+list.length+'</b> result'+(list.length===1?'':'s')+(state.q?' for “'+esc(state.q)+'”':'')+'</p>'+
  (list.length? '<div class="grid'+(state.listView?' list':'')+'">'+list.map(r=>{const n=visibleIds.push(r.id); return cardHTML(r,n);}).join('')+'</div>'
   : '<div class="empty"><span class="big">∅</span>no matches in this directory.<br>Try another query, or <button class="link" data-act="cleartag" type="button">clear filters_</button></div>');
}

function myView(){
  const tabs=[['uploads','my uploads ('+S.uploads.length+')'],['saved','bookmarks ('+S.bookmarks.length+')'],['progress','in progress'],['history','history']];
  let body='';
  if(state.mytab==='uploads'){
    body = S.uploads.length
      ? '<div class="grid">'+S.uploads.map(r=>{const n=visibleIds.push(r.id); return cardHTML(r,n);}).join('')+'</div>'
      : '<div class="empty"><span class="big">⇪</span>nothing published yet.<br><br><button class="btn primary" data-act="upload" type="button">upload_your_first_research_</button></div>';
  } else if(state.mytab==='saved'){
    const list=S.bookmarks.map(getRes).filter(Boolean);
    body = list.length ? '<div class="grid">'+list.map(r=>{const n=visibleIds.push(r.id); return cardHTML(r,n);}).join('')+'</div>'
      : '<div class="empty"><span class="big">◇</span>no bookmarks yet. Hit the bookmark icon on any card to stash it here.</div>';
  } else if(state.mytab==='progress'){
    const list=allRes().filter(r=>(S.progress[r.id]||0)>0);
    body = list.length ? '<div class="grid">'+list.map(r=>{const n=visibleIds.push(r.id); return cardHTML(r,n);}).join('')+'</div>'
      : '<div class="empty"><span class="big">…</span>nothing in progress. Open any resource to start tracking.</div>';
  } else {
    const list=S.history.map(h=>getRes(h.id)).filter(Boolean);
    body = list.length ? '<div class="grid">'+list.map(r=>{const n=visibleIds.push(r.id); return cardHTML(r,n);}).join('')+'</div>'
      : '<div class="empty"><span class="big">↺</span>history is empty. Sources you open will appear here.</div>';
  }
  return secHead('my_lab // '+(S.user.name||'guest'))+
    '<div class="tabs-sm">'+tabs.map(t=>'<button class="'+(state.mytab===t[0]?'is-active':'')+'" data-act="mytab" data-tab="'+t[0]+'" type="button">'+t[1]+'</button>').join('')+'</div>'+body;
}

function quizzesView(){
  return secHead('quiz_modules')+
  '<p class="count-line"><span class="prompt">$</span> each correct answer = <b style="color:var(--tx)">+10 pts</b> · perfect run bonus <b style="color:var(--tx)">+25</b> · attempts so far: <b style="color:var(--tx)">'+S.quizRuns+'</b></p>'+
  '<div class="quiz-grid">'+QUIZZES.map(q=>{
    const best=S.quizBest[q.id];
    return '<div class="quiz-card"><span class="type-badge paper">'+esc(q.title)+'</span><h3>'+esc(q.name)+'</h3><p>'+esc(q.desc)+'</p>'+
    '<div class="quiz-meta"><span>'+q.qs.length+' questions</span><span>·</span><span>best: '+(best!=null?best+'/'+q.qs.length:'—')+'</span>'+(S.perfects.indexOf(q.id)>=0?'<span style="color:var(--amber)">★ perfected</span>':'')+'</div>'+
    '<button class="btn primary" data-act="quiz" data-id="'+q.id+'" type="button">run_module_</button></div>';
  }).join('')+'</div>';
}

function ranksView(){
  const weekly=weeklyBoard();
  const alltime=RIVALS.map(r=>({name:r.name,pts:r.total,me:false})).concat([{name:(S.user.name||'guest')+' (you)',pts:S.points,me:true}]).sort((a,b)=>b.pts-a.pts);
  const rows = state.ranktab==='weekly'?weekly:alltime;
  const myPos=rows.findIndex(r=>r.me)+1;
  const li=levelIdx();
  const hist=S.pointsHist.length?S.pointsHist:[{d:todayStr(),p:S.points}];
  const max=Math.max.apply(null,hist.map(h=>h.p).concat([1]));
  return secHead('ranks // leaderboard')+
  '<div class="panel"><h2><span class="prompt">></span> your_stats</h2>'+
    '<div class="hero-stats" style="margin-top:0"><div class="hstat"><b>'+S.points.toLocaleString()+'</b>points</div><div class="hstat"><b>lvl '+(li+1)+'</b>'+LEVELS[li]+'</div><div class="hstat"><b>'+S.streak.count+'</b>day streak</div><div class="hstat"><b>#'+myPos+'</b>weekly rank</div><div class="hstat"><b>'+S.completed.length+'</b>completed</div><div class="hstat"><b>'+S.quizRuns+'</b>quizzes run</div></div>'+
    '<h2 style="margin-top:14px"><span class="prompt">></span> points_history <span class="dim">(14d)</span></h2><div class="hist-bars">'+hist.map(h=>'<i style="height:'+Math.max(4,Math.round(h.p/max*100))+'%" title="'+h.d+': '+h.p+' pts"></i>').join('')+'</div></div>'+
  '<div class="panel"><h2><span class="prompt">></span> leaderboard</h2>'+
    '<div class="tabs-sm"><button class="'+(state.ranktab==='weekly'?'is-active':'')+'" data-act="ranktab" data-tab="weekly" type="button">weekly</button><button class="'+(state.ranktab==='alltime'?'is-active':'')+'" data-act="ranktab" data-tab="alltime" type="button">all-time</button></div>'+
    '<div style="overflow-x:auto"><table class="board"><thead><tr><th>#</th><th>researcher</th><th>points</th><th>status</th></tr></thead><tbody>'+
    rows.map((r,i)=>'<tr class="'+(r.me?'me':'')+'"><td>'+(i+1)+'</td><td>'+esc(r.name)+'</td><td>'+r.pts.toLocaleString()+'</td><td>'+(r.me?'◉ you':(i===0?'★ leader':'○ active'))+'</td></tr>').join('')+
    '</tbody></table></div></div>'+
  '<div class="panel"><h2><span class="prompt">></span> achievements <span class="dim">('+S.ach.length+'/'+ACHS.length+')</span></h2><div class="ach-grid">'+
    ACHS.map(a=>{const un=S.ach.indexOf(a.id)>=0; return '<div class="ach'+(un?'':' locked')+'"><span class="medal">'+(un?a.i:'?')+'</span><span><b>'+esc(a.n)+'</b><span>'+esc(a.d)+(a.b?' · +'+a.b+' pts':'')+'</span></span></div>';}).join('')+
  '</div></div>';
}

/* ---------- render root ---------- */
const TYPED_LINES=['indexing 12 research modules… OK','linking IIT_KGP.lib… OK','syncing leaderboard… OK','ready. pick a resource and earn points.'];
let typedTimer=null;
function startTyped(){
  stopTyped();
  const el=$('#typed'); if(!el) return;
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    let li=0, ci=0, del=false;
    typedTimer=setInterval(()=>{
      const line=TYPED_LINES[li];
      if(!del){ ci++; if(ci>=line.length+14) del=true; }
      else { ci--; if(ci<=0){ del=false; li=(li+1)%TYPED_LINES.length; } }
      el.textContent=line.slice(0,Math.max(0,Math.min(ci,line.length)));
    },55);
  } else { el.textContent=TYPED_LINES[3]; }
}
function stopTyped(){ if(typedTimer){ clearInterval(typedTimer); typedTimer=null; } }

function render(){
  visibleIds=[];
  const root=$('#viewRoot');
  if(state.view==='feed') root.innerHTML=feedView();
  else if(state.view==='explore') root.innerHTML=exploreView();
  else if(state.view==='my') root.innerHTML=myView();
  else if(state.view==='quizzes') root.innerHTML=quizzesView();
  else if(state.view==='ranks') root.innerHTML=ranksView();
  renderTree(); renderStats(); renderMiniRanks(); renderReco(); renderBell(); checkGoal();
  if(state.view==='feed') startTyped(); else stopTyped();
  if(state.view==='explore') wireExplore();
  syslog('rendered view: '+state.view+(state.view==='explore'?' / '+state.cat:''));
}

/* ---------- explore wiring: search + suggest ---------- */
function wireExplore(){
  const inp=$('#searchInput'), box=$('#suggest'), sort=$('#sortSel');
  if(!inp) return;
  sort.value=state.sort;
  sort.addEventListener('change',()=>{ state.sort=sort.value; render(); });
  let deb=null;
  inp.addEventListener('input',()=>{
    clearTimeout(deb);
    deb=setTimeout(()=>{ state.q=inp.value.trim(); render(); const n=$('#searchInput'); if(n){ n.focus(); n.setSelectionRange(n.value.length,n.value.length); } },350);
    showSuggest(inp.value.trim());
  });
  inp.addEventListener('focus',()=>showSuggest(inp.value.trim()));
  inp.addEventListener('keydown',e=>{
    if(e.key==='Enter'){ e.preventDefault(); commitSearch(inp.value.trim()); }
    if(e.key==='Escape'){ inp.value=''; state.q=''; render(); }
  });
  inp.addEventListener('blur',()=>setTimeout(()=>{box.hidden=true;},150));
}
function showSuggest(q){
  const box=$('#suggest'); if(!box) return;
  let items=[];
  if(!q){ items=S.searches.slice(0,5).map(s=>({t:s,tag:'recent'})); }
  else {
    const seen={};
    allRes().forEach(r=>{
      if(r.title.toLowerCase().includes(q.toLowerCase())&&!seen[r.title]){ seen[r.title]=1; items.push({t:r.title,tag:r.type}); }
    });
    allRes().forEach(r=>r.tags.forEach(t=>{ if(t.toLowerCase().includes(q.toLowerCase())&&!seen['#'+t]){ seen['#'+t]=1; items.push({t:'#'+t,tag:'tag'}); } }));
    items=items.slice(0,7);
  }
  if(!items.length){ box.hidden=true; return; }
  box.innerHTML=items.map((x,i)=>'<button data-sug="'+esc(x.t)+'" type="button"><span class="prompt">▸</span> '+esc(x.t)+'<span class="tag">'+esc(x.tag)+'</span></button>').join('');
  box.hidden=false;
  $$('button',box).forEach(b=>b.addEventListener('mousedown',e=>{ e.preventDefault(); commitSearch(b.dataset.sug); }));
}
function commitSearch(q){
  if(q[0]==='#'){ state.tag=q.slice(1); state.q=''; }
  else { state.q=q; if(q&&S.searches.indexOf(q)<0){ S.searches.unshift(q); S.searches=S.searches.slice(0,8); save(); } }
  state.view='explore';
  $$('.tab').forEach(t=>t.classList.toggle('is-active',t.dataset.view==='explore'));
  render();
  const n=$('#searchInput'); if(n&&state.q){ n.focus(); }
}

/* ---------- actions (like / save / open / tags) ---------- */
function doLike(id){
  const r=getRes(id); if(!r) return;
  if(S.likes[id]){ delete S.likes[id]; toast('unliked “'+esc(r.title.slice(0,40))+'…”'); }
  else { S.likes[id]=1; addPts(5,'liking a resource'); grant('first-like'); notify('You liked <b>'+esc(r.title)+'</b>.'); }
  save(); render();
  refreshModalActions();
}
function doSave(id){
  const r=getRes(id); if(!r) return;
  const i=S.bookmarks.indexOf(id);
  if(i>=0){ S.bookmarks.splice(i,1); toast('bookmark removed.'); }
  else { S.bookmarks.push(id); toast('saved to <b>~/bookmarks</b> — press 3 to view.'); if(S.bookmarks.length>=3) grant('curator'); }
  save(); render();
  refreshModalActions();
}
function doOpen(id){
  const r=getRes(id); if(!r) return;
  pushHistory(id);
  const p=Math.max(S.progress[id]||0,10); S.progress[id]=p; save();
  addPts(10,'opening '+(r.type==='official'?'library':'source'));
  syslog('opened external source: '+r.title.slice(0,40));
  // Community/demo entries are summaries, not claimed publisher copies. Send readers to a live scholarly search for the exact title; the official library entry goes straight to NDLI.
  const destination = r.type==='official' ? 'https://ndl.iitkgp.ac.in/' : 'https://scholar.google.com/scholar?q='+encodeURIComponent(r.title+' '+(r.author||''));
  try{ window.open(destination,'_blank','noopener,noreferrer'); }catch(e){ location.href=destination; }
  render();
}
function pushHistory(id){
  S.history=S.history.filter(h=>h.id!==id);
  S.history.unshift({id:id,ts:Date.now()});
  if(S.history.length>30) S.history.length=30;
  save();
}

/* ---------- modal system ---------- */
let modalCleanup=null, readerId=null;
function openModal(title, html, wide){
  readerId=null;
  if(modalCleanup){ modalCleanup(); modalCleanup=null; }
  $('#modalTitle').textContent=title;
  $('#modalBody').innerHTML=html;
  $('.modal').classList.toggle('wide',!!wide);
  $('#modalWrap').hidden=false;
  const f=$('#modalBody input, #modalBody button, #modalBody textarea, #modalBody select');
  if(f) f.focus();
}
function closeModal(){
  $('#modalWrap').hidden=true;
  if(modalCleanup){ modalCleanup(); modalCleanup=null; }
  readerId=null;
}
function refreshModalActions(){ /* cards re-render behind modal; nothing needed */ }

/* ----- reader ----- */
function openReader(id){
  const r=getRes(id); if(!r) return;
  readerId=id; pushHistory(id);
  if(!S.progress[id]){ S.progress[id]=5; save(); }
  render();
  const rt=ratingOf(r), prog=S.progress[id]||0;
  const liked=!!S.likes[id], saved=S.bookmarks.indexOf(id)>=0, following=S.follows.indexOf(r.author)>=0;
  const cite=r.author+' ('+r.date.slice(0,4)+'). '+r.title+'. '+r.org+'. Retrieved via Knowlegify.';
  openModal('read // '+r.type, ''+
    '<span class="type-badge '+(TYPE_BADGE[r.type]||'paper')+'">'+esc(r.type)+'</span>'+
    '<h3 style="margin-top:10px">'+esc(r.title)+'</h3>'+
    '<div class="card-meta"><span>'+esc(r.author)+' · '+esc(r.org)+'</span><span>·</span><span>'+esc(r.date)+'</span><span>·</span><span>'+r.read+' min read</span></div>'+
    '<div class="progress-wrap" style="margin-top:10px"><div class="bar"><i id="rdBar" style="width:'+prog+'%"></i></div><span id="rdPct">'+prog+'%</span></div>'+
    '<div class="reader-sec"><h4>abstract</h4><p>'+esc(r.abs)+'</p></div>'+
    '<div class="reader-sec"><h4>key_findings</h4><ul>'+r.findings.map(f=>'<li>'+esc(f)+'</li>').join('')+'</ul></div>'+
    '<div class="reader-sec"><h4>methods</h4><p>'+esc(r.methods)+'</p></div>'+
    '<div class="cite" id="citeTxt">'+esc(cite)+'</div>'+
    '<div class="tags" style="margin-top:10px">'+r.tags.map(t=>'<button class="tag" data-act="tag" data-tag="'+esc(t)+'" type="button">#'+esc(t)+'</button>').join('')+'</div>'+
    '<label class="checkline"><input type="checkbox" data-sec="0" '+(prog>=34?'checked':'')+'> I read the abstract <span class="dim">(+progress)</span></label>'+
    '<label class="checkline"><input type="checkbox" data-sec="1" '+(prog>=67?'checked':'')+'> I studied the key findings</label>'+
    '<label class="checkline"><input type="checkbox" data-sec="2" '+(prog>=100||S.completed.indexOf(id)>=0?'checked':'')+'> I reviewed methods + citation</label>'+
    '<div class="set-row" style="margin-top:8px"><span>your rating <span class="dim">(avg '+rt.avg.toFixed(1)+' · '+rt.n+')</span></span><span class="stars" id="rateStars">'+[1,2,3,4,5].map(i=>'<button data-star="'+i+'" class="'+((S.ratings[id]||0)>=i?'lit':'')+'" type="button" aria-label="'+i+' stars">★</button>').join('')+'</span></div>'+
    '<div id="rdErr" class="form-err"></div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">'+
      '<button class="btn primary" id="rdComplete" type="button">mark_complete_ +25</button>'+
      '<button class="btn" data-act="like" data-id="'+id+'" type="button">'+(liked?'♥ liked':'♡ like')+'</button>'+
      '<button class="btn" data-act="comments" data-id="'+id+'" type="button">comments ('+commentsOf(id).length+')</button>'+
      '<button class="btn" data-act="save" data-id="'+id+'" type="button">'+(saved?'★ saved':'☆ save [b]')+'</button>'+
      '<button class="btn" data-act="open" data-id="'+id+'" type="button">source ↗</button>'+
      '<button class="btn ghost" data-act="copycite" type="button">copy_citation</button>'+
      '<button class="btn ghost" data-act="follow" data-author="'+esc(r.author)+'" type="button">'+(following?'✓ following':'+ follow '+esc(r.author.split(' ')[0]||r.author))+'</button>'+
    '</div>', true);
  $$('#modalBody [data-sec]').forEach(cb=>cb.addEventListener('change',()=>{
    const boxes=$$('#modalBody [data-sec]');
    const n=boxes.filter(b=>b.checked).length;
    const p=Math.round(n/3*100);
    S.progress[id]=p; save(); render(); $('#rdBar').style.width=p+'%'; $('#rdPct').textContent=p+'%';
    syslog('reading progress '+r.id+': '+p+'%');
  }));
  $$('#rateStars button').forEach(b=>b.addEventListener('click',()=>{
    S.ratings[id]=parseInt(b.dataset.star,10); save();
    $$('#rateStars button').forEach(x=>x.classList.toggle('lit',parseInt(x.dataset.star,10)<=S.ratings[id]));
    toast('rated <b>'+S.ratings[id]+'★</b> — thanks for the signal.'); beep(880,0.07);
    render();
  }));
  $('#rdComplete').addEventListener('click',()=>{
    S.progress[id]=100;
    if(S.completed.indexOf(id)<0){
      S.completed.push(id); ensureDaily(); S.daily.read++;
      addPts(25,'completing “'+r.title.slice(0,32)+'…”');
      notify('Completed <b>'+esc(r.title)+'</b>. +25 pts.');
      grant('scholar'); if(S.completed.length>=3) grant('bookworm');
    }
    save(); closeModal(); render();
  });
}

/* ----- comments ----- */
function openComments(id){
  const r=getRes(id); if(!r) return;
  const list=commentsOf(id);
  openModal('comments // '+r.title.slice(0,42), ''+
    '<div id="cList">'+(list.length?list.map(c=>'<div class="comment"><div class="chead"><b>'+esc(c.u)+'</b><span>'+timeAgo(c.ts)+'</span></div><p>'+esc(c.t)+'</p></div>').join(''):'<div class="empty"><span class="big">…</span>no comments yet. Start the peer review.</div>')+'</div>'+
    '<form class="comment-form" id="cForm"><input id="cInput" type="text" placeholder="write a comment… ( +5 pts )" maxlength="280" aria-label="Write a comment"><button class="btn primary" type="submit">post_</button></form>');
  $('#cForm').addEventListener('submit',e=>{
    e.preventDefault();
    const v=$('#cInput').value.trim();
    if(v.length<2){ toast('comment too short.','warn'); return; }
    (S.comments[id]=S.comments[id]||[]).push({u:(S.user.name||'guest'),t:v,ts:Date.now()});
    save(); addPts(5,'posting a comment'); grant('commentator');
    openComments(id); render();
  });
}

/* ----- upload ----- */
function openUpload(){
  openModal('upload // new_research',
    '<p>Publish to the lab. Your upload appears in <b>my_lab</b> and the public library instantly. <span class="prompt">+30 pts</span></p>'+
    '<label class="lbl" for="upTitle">title *</label><input id="upTitle" class="field" type="text" maxlength="120" placeholder="e.g. Solar Still from Scrap Aluminium — Field Results">'+
    '<div class="form-row"><div><label class="lbl" for="upType">type</label><select id="upType" class="field"><option value="paper">research paper</option><option value="article">article</option><option value="experiment">experiment</option><option value="journal">journal</option><option value="dataset">dataset</option></select></div>'+
    '<div><label class="lbl" for="upTags">tags (comma separated)</label><input id="upTags" class="field" type="text" placeholder="energy, solar, diy"></div></div>'+
    '<label class="lbl" for="upAbs">abstract * <span class="dim">(min 30 chars)</span></label><textarea id="upAbs" class="field" maxlength="900" placeholder="What did you build, find or measure?"></textarea>'+
    '<label class="lbl" for="upFind">key findings <span class="dim">(one per line, optional)</span></label><textarea id="upFind" class="field" style="min-height:64px" placeholder="Result one&#10;Result two"></textarea>'+
    '<label class="lbl" for="upUrl">source URL <span class="dim">(optional)</span></label><input id="upUrl" class="field" type="url" placeholder="https://…">'+
    '<div id="upErr" class="form-err"></div>'+
    '<div style="display:flex;gap:8px;margin-top:10px"><button class="btn primary" id="upGo" type="button">publish_ +30</button><button class="btn ghost" data-close-modal type="button">cancel</button></div>');
  $('#upGo').addEventListener('click',()=>{
    const title=$('#upTitle').value.trim(), abs=$('#upAbs').value.trim();
    const err=$('#upErr');
    if(title.length<8){ err.textContent='title too short — min 8 characters.'; return; }
    if(abs.length<30){ err.textContent='abstract too short — min 30 characters.'; return; }
    let url=$('#upUrl').value.trim()||KGP;
    if(url&&!/^https?:\/\//i.test(url)) url='https://'+url;
    const tags=$('#upTags').value.split(',').map(t=>t.trim().toLowerCase()).filter(Boolean).slice(0,5);
    const r={id:uid('u'), type:$('#upType').value, title:title, author:(S.user.name||'guest'), org:'Community Lab · Knowlegify',
      date:todayStr(), read:Math.max(2,Math.round(abs.split(/\s+/).length/200)), tags:tags.length?tags:['research'],
      rating:0, ratings:0, likes:0, url:url, mine:true,
      abs:abs, findings:$('#upFind').value.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,5),
      methods:'Community-submitted research. Methods as described by the author in the abstract and linked source.'};
    if(!r.findings.length) r.findings=['See abstract and linked source for full results.'];
    S.uploads.unshift(r); save();
    addPts(30,'publishing research'); grant('uploader');
    notify('Published <b>'+esc(title)+'</b> to the library.');
    syslog('new upload: '+title.slice(0,44));
    closeModal(); state.view='my'; state.mytab='uploads';
    $$('.tab').forEach(t=>t.classList.toggle('is-active',t.dataset.view==='my'));
    render();
  });
}

/* ----- quiz engine ----- */
let quiz=null;
function openQuiz(id){
  const q=QUIZZES.find(x=>x.id===id); if(!q) return;
  const best=S.quizBest[id];
  openModal('quiz // '+q.title,
    '<h3>'+esc(q.name)+'</h3><p>'+esc(q.desc)+'</p>'+
    '<div class="quiz-meta"><span>'+q.qs.length+' questions</span><span>·</span><span>+10 pts per correct</span><span>·</span><span>+25 perfect bonus</span><span>·</span><span>best: '+(best!=null?best+'/'+q.qs.length:'—')+'</span></div>'+
    '<div style="display:flex;gap:8px;margin-top:14px"><button class="btn primary" id="qzGo" type="button">start_module_</button><button class="btn ghost" data-close-modal type="button">cancel</button></div>');
  $('#qzGo').addEventListener('click',()=>{ quiz={q:q,i:0,score:0,locked:false,results:[]}; renderQ(); });
}
function renderQ(){
  const {q,i,score}=quiz;
  const item=q.qs[i];
  openModal('quiz // '+q.title+' · Q'+(i+1)+'/'+q.qs.length,
    '<div class="q-progress">'+q.qs.map((_,k)=>'<i class="'+(quiz.results[k]===1?'done':quiz.results[k]===0?'bad':'')+'"></i>').join('')+'</div>'+
    '<p class="count-line">score: <b style="color:var(--tx)">'+score+'</b></p>'+
    '<h3 style="margin-top:6px">'+esc(item.q)+'</h3>'+
    '<div id="qOpts">'+item.o.map((o,k)=>'<button class="q-opt" data-qi="'+k+'" type="button"><span class="prompt">'+'ABCD'[k]+'.</span> '+esc(o)+'</button>').join('')+'</div>'+
    '<div id="qFeed"></div>'+
    '<div style="display:flex;gap:8px;margin-top:14px"><button class="btn primary" id="qNext" type="button" disabled>'+(i===q.qs.length-1?'finish_':'next_')+'</button><button class="btn ghost" data-act="quizquit" type="button">quit</button></div>');
  $$('#qOpts .q-opt').forEach(b=>b.addEventListener('click',()=>{
    if(quiz.locked) return; quiz.locked=true;
    const pick=parseInt(b.dataset.qi,10), ok=pick===item.a;
    $$('#qOpts .q-opt').forEach(x=>{
      x.disabled=true;
      const k=parseInt(x.dataset.qi,10);
      if(k===item.a) x.classList.add('correct');
      else if(k===pick) x.classList.add('wrong');
    });
    quiz.results[i]=ok?1:0; if(ok){ quiz.score++; beep(880,0.08); } else beep(220,0.12);
    $('#qFeed').innerHTML='<div class="q-explain"><b style="color:'+(ok?'var(--acc)':'var(--red)')+'">'+(ok?'✓ correct · +10':'✕ not quite')+'</b><br>'+esc(item.x)+'</div>';
    $('#qNext').disabled=false;
  }));
  $('#qNext').addEventListener('click',()=>{
    if(quiz.i<quiz.q.qs.length-1){ quiz.i++; quiz.locked=false; renderQ(); }
    else finishQuiz();
  });
}
function finishQuiz(){
  const q=quiz.q, score=quiz.score, total=q.qs.length, perfect=score===total;
  S.quizRuns++;
  if(S.quizBest[q.id]==null||score>S.quizBest[q.id]) S.quizBest[q.id]=score;
  if(perfect&&S.perfects.indexOf(q.id)<0) S.perfects.push(q.id);
  save();
  addPts(score*10,'quiz: '+score+'/'+total+' correct');
  if(perfect) addPts(25,'PERFECT run on '+q.title);
  grant('quiz-rookie'); if(perfect) grant('perfectionist');
  notify('Quiz <b>'+esc(q.name)+'</b> finished: '+score+'/'+total+'.');
  openModal('quiz // complete',
    '<div class="empty" style="border-style:solid"><span class="big" style="color:var(--acc)">'+(perfect?'★':score/total>=0.6?'▲':'●')+'</span>'+
    '<b style="color:var(--tx);font-size:1.1rem">'+score+' / '+total+'</b><br>'+
    (perfect?'flawless. the lab salutes you. +25 bonus.':score/total>=0.6?'solid run. review the misses and re-run.':'every expert was once a rookie. re-run to improve.')+'<br><br>'+
    '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn primary" id="qAgain" type="button">re-run_</button><button class="btn" data-act="goto" data-view="quizzes" type="button">all_modules_</button></div></div>');
  const back=$('.modal-backdrop'); if(back) back.onclick=()=>{ closeModal(); state.view='quizzes'; render(); };
  $('#qAgain').addEventListener('click',()=>openQuiz(q.id));
  quiz=null;
}

/* ----- onboarding ----- */
function openOnboarding(){
  openModal('first_boot // identity_setup',
    '<p>Welcome to the lab. Set your callsign and pick interests — the recommendation engine tunes itself to you. <span class="prompt">+50 pts</span></p>'+
    '<label class="lbl" for="obName">callsign *</label><input id="obName" class="field" type="text" maxlength="24" placeholder="e.g. curious_mind">'+
    '<label class="lbl">interests <span class="dim">(pick ≥ 1)</span></label><div class="chip-pick" id="obInts">'+INTERESTS.map(i=>'<button class="chip" data-int="'+i+'" type="button">'+i+'</button>').join('')+'</div>'+
    '<div id="obErr" class="form-err"></div>'+
    '<div style="margin-top:12px"><button class="btn primary block" id="obGo" type="button">enter_the_lab_</button></div>');
  const picked=new Set();
  $$('#obInts .chip').forEach(c=>c.addEventListener('click',()=>{
    const v=c.dataset.int;
    if(picked.has(v)){ picked.delete(v); c.classList.remove('is-active'); } else { picked.add(v); c.classList.add('is-active'); }
  }));
  $('#obGo').addEventListener('click',()=>{
    const nm=$('#obName').value.trim();
    if(nm.length<2){ $('#obErr').textContent='callsign too short — min 2 characters.'; return; }
    if(!picked.size){ $('#obErr').textContent='pick at least one interest.'; return; }
    S.user.name=nm.toLowerCase().replace(/\s+/g,'_'); S.user.interests=Array.from(picked);
    S.onboarded=true; save();
    grant('booted');
    addPts(50,'joining the lab');
    notify('Welcome, <b>'+esc(S.user.name)+'</b>. Interests locked: '+S.user.interests.map(esc).join(', ')+'.');
    notify('Tip: press <b>`</b> anywhere to drive the site from the console.');
    closeModal(); render(); cprint('whoami → '+S.user.name+' · interests: '+S.user.interests.join(', '),'mut');
  });
}

/* ----- settings ----- */
function openSettings(){
  openModal('settings // config',
    '<div class="set-row"><span>callsign</span><span style="display:flex;gap:6px"><input id="setName" type="text" value="'+esc(S.user.name)+'" maxlength="24" style="width:150px"><button class="btn sm" id="setNameGo" type="button">save</button></span></div>'+
    '<div class="set-row"><span>theme</span><span class="seg" id="setTheme"><button data-t="green" class="'+(S.theme==='green'?'is-active':'')+'" type="button">green</button><button data-t="amber" class="'+(S.theme==='amber'?'is-active':'')+'" type="button">amber</button><button data-t="cyan" class="'+(S.theme==='cyan'?'is-active':'')+'" type="button">cyan</button></span></div>'+
    '<div class="set-row"><span>terminal sounds</span><span class="seg"><button id="setSnd" class="'+(S.sound?'is-active':'')+'" type="button">'+(S.sound?'on':'off')+'</button></span></div>'+
    '<div class="set-row"><span>interests</span></div><div class="chip-pick" id="setInts" style="margin-top:0">'+INTERESTS.map(i=>'<button class="chip'+(S.user.interests.indexOf(i)>=0?' is-active':'')+'" data-int="'+i+'" type="button">'+i+'</button>').join('')+'</div>'+
    '<div class="set-row" style="margin-top:10px"><span>data</span><span style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-act="export" type="button">export</button><button class="btn sm" data-act="import" type="button">import</button><button class="btn sm danger-ghost" data-act="reset" type="button">reset</button></span></div>'+
    '<p class="dim" style="font-size:.72rem;margin-top:12px">All data lives in your browser (localStorage). Export a JSON backup any time; import it on another machine to keep your points, streaks and uploads.</p>');
  $$('#setTheme button').forEach(b=>b.addEventListener('click',()=>{ setTheme(b.dataset.t); $$('#setTheme button').forEach(x=>x.classList.toggle('is-active',x===b)); }));
  $('#setSnd').addEventListener('click',e=>{ S.sound=!S.sound; save(); e.target.textContent=S.sound?'on':'off'; e.target.classList.toggle('is-active',S.sound); beep(880,0.08); });
  $$('#setInts .chip').forEach(c=>c.addEventListener('click',()=>{
    const v=c.dataset.int, i=S.user.interests.indexOf(v);
    if(i>=0){ S.user.interests.splice(i,1); c.classList.remove('is-active'); } else { S.user.interests.push(v); c.classList.add('is-active'); }
    save(); renderReco();
  }));
  $('#setNameGo').addEventListener('click',()=>{
    const v=$('#setName').value.trim();
    if(v.length<2){ toast('callsign too short.','warn'); return; }
    S.user.name=v.toLowerCase().replace(/\s+/g,'_'); save(); renderStats(); toast('callsign updated → <b>'+esc(S.user.name)+'</b>');
  });
}
function setTheme(t){
  if(['green','amber','cyan'].indexOf(t)<0) t='green';
  S.theme=t; document.documentElement.dataset.theme=t; save();
  syslog('theme → '+t);
}

/* ----- confirm ----- */
function openConfirm(title, msg, okLabel, fn){
  openModal(title,'<p>'+msg+'</p><div style="display:flex;gap:8px;margin-top:14px"><button class="btn danger-ghost" id="cfOk" type="button">'+esc(okLabel)+'</button><button class="btn ghost" data-close-modal type="button">cancel</button></div>');
  $('#cfOk').addEventListener('click',()=>{ closeModal(); fn(); });
}

/* ---------- notifications drawer ---------- */
function renderNotifs(){
  const list=S.notifs;
  $('#notifList').innerHTML=list.length?list.map(n=>'<div class="notif'+(n.read?'':' unread')+'">'+n.t+'<div class="nt">'+timeAgo(n.ts)+'</div></div>').join('')
    :'<div class="empty"><span class="big">∅</span>no signals yet. Go earn some points.</div>';
}
function openDrawer(){ $('#drawerWrap').hidden=false; renderNotifs(); }
function closeDrawer(){ $('#drawerWrap').hidden=true; }

/* ---------- console ---------- */
function consoleOpen(){ $('#consolePanel').hidden=false; $('#cmdInput').focus(); }
function consoleToggle(){ const p=$('#consolePanel'); p.hidden=!p.hidden; if(!p.hidden) $('#cmdInput').focus(); }
function cprint(html, cls){
  const log=$('#consoleLog');
  const d=document.createElement('div'); if(cls) d.className=cls; d.innerHTML=html;
  log.appendChild(d); log.scrollTop=log.scrollHeight;
  while(log.children.length>120) log.firstChild.remove();
}
function runCmd(raw){
  const line=(raw||'').trim(); if(!line) return;
  if($('#consolePanel').hidden) $('#consolePanel').hidden=false;
  cprint('<span class="in">visitor@knowlegify:~$</span> '+esc(line));
  const parts=line.split(/\s+/), cmd=parts[0].toLowerCase(), arg=parts.slice(1).join(' ');
  const num=parseInt(parts[1],10);
  const pick=n=>visibleIds[n-1];
  const VIEWS=['feed','explore','my','quizzes','ranks'];
  switch(cmd){
    case 'help':
      cprint('commands: <b>goto</b> &lt;feed|explore|my|quizzes|ranks&gt; · <b>ls</b> · <b>search</b> &lt;q&gt; · <b>open|read|like|save</b> &lt;n&gt; · <b>cat</b> &lt;name&gt; · <b>quiz</b> &lt;1-3&gt; · <b>theme</b> &lt;green|amber|cyan&gt; · <b>stats</b> · <b>whoami</b> · <b>points</b> · <b>clear</b> · <b>exit</b><br><span class="mut">tip: every card shows its #number — e.g. `read 2`</span>');
      break;
    case 'goto': case 'go': case 'cd':
      if(VIEWS.indexOf(arg)<0){ cprint('unknown view. try: '+VIEWS.join(' | '),'err'); }
      else { closeModal(); switchView(arg); cprint('→ '+arg+' <span class="mut">OK</span>'); }
      break;
    case 'ls': case 'list':
      if(!visibleIds.length) cprint('no cards in this view.','mut');
      else visibleIds.slice(0,20).forEach((id,i)=>{ const r=getRes(id); if(r) cprint('#'+pad2(i+1)+' · ['+r.type+'] '+esc(r.title.slice(0,60))); });
      break;
    case 'cat':
      if(CATS.some(c=>c.id===arg)){ setCat(arg,true); cprint('→ '+catName(arg)+' <span class="mut">OK</span>'); }
      else cprint('unknown category. try: '+CATS.map(c=>c.id).join(' | '),'err');
      break;
    case 'search': case 'find': case 'grep':
      if(!arg){ cprint('usage: search &lt;query&gt;','err'); } else { closeModal(); commitSearch(arg); cprint(exploreList().length+' result(s) for “'+esc(arg)+'”'); }
      break;
    case 'open': case 'o':
      if(!num||!pick(num)){ cprint('usage: open &lt;n&gt; — see numbers via `ls`','err'); }
      else { const r=getRes(pick(num)); cprint('opening source: '+esc(r.title.slice(0,50))+'…'); doOpen(pick(num)); }
      break;
    case 'read': case 'r':
      if(!num||!pick(num)){ cprint('usage: read &lt;n&gt;','err'); } else openReader(pick(num));
      break;
    case 'like': case 'l':
      if(!num||!pick(num)){ cprint('usage: like &lt;n&gt;','err'); } else { const r=getRes(pick(num)); doLike(pick(num)); cprint('♥ '+esc(r.title.slice(0,50))); }
      break;
    case 'save': case 's': case 'bookmark':
      if(!num||!pick(num)){ cprint('usage: save &lt;n&gt;','err'); } else doSave(pick(num));
      break;
    case 'quiz':
      if(num>=1&&num<=QUIZZES.length) openQuiz(QUIZZES[num-1].id);
      else { cprint('usage: quiz &lt;1-3&gt; · available: '+QUIZZES.map((q,i)=>(i+1)+'='+q.title).join(', '),'mut'); }
      break;
    case 'upload': openUpload(); break;
    case 'theme':
      if(['green','amber','cyan'].indexOf(arg)<0) cprint('usage: theme &lt;green|amber|cyan&gt;','err');
      else { setTheme(arg); cprint('theme → '+arg+' <span class="mut">OK</span>'); }
      break;
    case 'stats': case 'status': {
      const li=levelIdx();
      cprint('user=<b>'+esc(S.user.name)+'</b> points=<b>'+S.points+'</b> level='+(li+1)+'/'+LEVELS.length+' ('+LEVELS[li]+') streak='+S.streak.count+'d completed='+S.completed.length+' quizzes='+S.quizRuns+' ach='+S.ach.length+'/'+ACHS.length);
      break; }
    case 'whoami': cprint('visitor → <b>'+esc(S.user.name)+'</b> · interests: '+esc(S.user.interests.join(', ')||'none')+' · member of the lab'); break;
    case 'points': cprint('balance: <b>'+S.points+' pts</b> · today +'+S.daily.earned+' · this week +'+S.weekly.pts); break;
    case 'date': cprint(new Date().toString(),'mut'); break;
    case 'sudo': cprint('nice try. this terminal believes in you anyway.','mut'); break;
    case 'clear': $('#consoleLog').innerHTML=''; break;
    case 'exit': case 'quit': $('#consolePanel').hidden=true; break;
    default: cprint('command not found: '+esc(cmd)+' — type `help`','err');
  }
}

/* ---------- focus timer ---------- */
let focus={left:1500, timer:null};
function fmtT(s){ return pad2(Math.floor(s/60))+':'+pad2(s%60); }
function focusPaint(){
  $('#focusTime').textContent=fmtT(focus.left);
  $('#focusTime').classList.toggle('running',!!focus.timer);
  $('#focusStart').textContent=focus.timer?'pause':'start';
}
function focusTick(){
  focus.left--;
  if(focus.left<=0){
    clearInterval(focus.timer); focus.timer=null;
    focus.left=parseInt($('#focusLen').value,10); focusPaint();
    S.focusDone++; save();
    addPts(50,'completing a focus session');
    notify('<b>Focus session complete.</b> +50 pts. Touch grass, then read something.');
    grant('focused'); beep(660,0.15); setTimeout(()=>beep(990,0.2),180);
    toast('<b>FOCUS COMPLETE</b> — session logged.');
    return;
  }
  focusPaint();
}

/* ---------- export / import / reset ---------- */
function doExport(){
  const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='knowlegify-backup-'+todayStr()+'.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  toast('backup exported. keep it safe.');
}
function doImport(file){
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      const s=JSON.parse(rd.result);
      if(!s||s.v!==2||typeof s.points!=='number') throw 0;
      S=Object.assign(defaults(),s); save();
      document.documentElement.dataset.theme=S.theme;
      closeModal(); render();
      toast('backup restored. welcome back, <b>'+esc(S.user.name)+'</b>.');
    }catch(e){ toast('invalid backup file.','warn'); }
  };
  rd.readAsText(file);
}

/* ---------- global click delegation ---------- */
document.addEventListener('click',e=>{
  const closer=e.target.closest('[data-close-modal]');
  if(closer){ closeModal(); if(state.view==='quizzes'&&quiz===null&&$('#modalWrap').hidden){} return; }
  if(e.target.closest('[data-close-drawer]')){ closeDrawer(); return; }
  const t=e.target.closest('[data-act]');
  if(!t) return;
  const act=t.dataset.act, id=t.dataset.id;
  if(t.tagName==='A') e.preventDefault();
  switch(act){
    case 'goto': closeModal(); switchView(t.dataset.view); break;
    case 'setcat': setCat(t.dataset.cat); break;
    case 'read': openReader(id); break;
    case 'open': doOpen(id); break;
    case 'like': doLike(id); break;
    case 'save': doSave(id); break;
    case 'comments': openComments(id); break;
    case 'tag': closeModal(); state.tag=t.dataset.tag; state.q=''; state.view='explore'; $$('.tab').forEach(x=>x.classList.toggle('is-active',x.dataset.view==='explore')); render(); break;
    case 'cleartag': state.tag=''; state.q=''; setCat('all',true); break;
    case 'quiz': openQuiz(id); break;
    case 'quizquit': quiz=null; closeModal(); break;
    case 'upload': openUpload(); break;
    case 'kgp': try{ window.open(KGP,'_blank','noopener'); }catch(err){} toast('opening <b>IIT_KGP.lib</b>…'); addPts(5,'visiting IIT KGP library',true); break;
    case 'mytab': state.mytab=t.dataset.tab; render(); break;
    case 'ranktab': state.ranktab=t.dataset.tab; render(); break;
    case 'vgrid': state.listView=false; render(); break;
    case 'vlist': state.listView=true; render(); break;
    case 'copycite': {
      const txt=($('#citeTxt')||{}).textContent||'';
      const done=()=>toast('citation copied to clipboard.');
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done,()=>toast('copy failed — select the text manually.','warn'));
      else toast('clipboard unavailable in this browser.','warn');
      break; }
    case 'follow': {
      const a=t.dataset.author, i=S.follows.indexOf(a);
      if(i>=0){ S.follows.splice(i,1); toast('unfollowed '+esc(a)+'.'); }
      else { S.follows.push(a); toast('following <b>'+esc(a)+'</b> — new work will ping you.'); if(S.follows.length>=2) grant('networker'); }
      save();
      if(readerId) openReader(readerId);
      break; }
    case 'export': doExport(); break;
    case 'import': $('#importFile').click(); break;
    case 'reset': openConfirm('reset // confirm','Wipe all points, streaks, uploads and settings on this machine? This cannot be undone — <b>export first</b> if you care.','wipe_everything',()=>{ localStorage.removeItem(KEY); location.reload(); }); break;
  }
});
document.addEventListener('keydown',e=>{
  const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement&&document.activeElement.tagName||'');
  if(e.key==='Escape'){
    if(!$('#modalWrap').hidden){ if(quiz){ quiz=null; } closeModal(); }
    else if(!$('#drawerWrap').hidden) closeDrawer();
    else if(!$('#avatarMenu').hidden) $('#avatarMenu').hidden=true;
    else if(!$('#consolePanel').hidden) $('#consolePanel').hidden=true;
    return;
  }
  if(typing) return;
  if(e.key==='/'){ e.preventDefault(); if(state.view!=='explore'){ state.view='explore'; $$('.tab').forEach(x=>x.classList.toggle('is-active',x.dataset.view==='explore')); render(); } const s=$('#searchInput'); if(s) s.focus(); }
  else if(e.key==='`'){ e.preventDefault(); consoleToggle(); }
  else if(e.key>='1'&&e.key<='5'&&!e.metaKey&&!e.ctrlKey){ switchView(['feed','explore','my','quizzes','ranks'][+e.key-1]); }
  else if((e.key==='b'||e.key==='B')&&readerId){ doSave(readerId); openReader(readerId); }
});

/* ---------- wiring: chrome ---------- */
function wireChrome(){
  $$('.tab').forEach(t=>t.addEventListener('click',()=>switchView(t.dataset.view)));
  $('#searchBtn').addEventListener('click',()=>{ state.view='explore'; $$('.tab').forEach(x=>x.classList.toggle('is-active',x.dataset.view==='explore')); render(); const s=$('#searchInput'); if(s) s.focus(); });
  $('#kgpBtn').addEventListener('click',()=>{ try{ window.open(KGP,'_blank','noopener'); }catch(e){} toast('opening <b>IIT_KGP.lib</b>…'); });
  $('#uploadBtn').addEventListener('click',openUpload);
  $('#bellBtn').addEventListener('click',e=>{ e.stopPropagation(); const w=$('#drawerWrap'); w.hidden?openDrawer():closeDrawer(); });
  $('#markRead').addEventListener('click',()=>{ S.notifs.forEach(n=>n.read=true); save(); renderBell(); renderNotifs(); });
  $('#avatarBtn').addEventListener('click',e=>{ e.stopPropagation(); $('#avatarMenu').hidden=!$('#avatarMenu').hidden; });
  document.addEventListener('click',e=>{ if(!e.target.closest('.avatar-wrap')) $('#avatarMenu').hidden=true; });
  $$('#avatarMenu button').forEach(b=>b.addEventListener('click',()=>{
    $('#avatarMenu').hidden=true;
    const a=b.dataset.act;
    if(a==='profile') switchView('ranks');
    else if(a==='settings') openSettings();
    else if(a==='export') doExport();
    else if(a==='reset') openConfirm('reset // confirm','Wipe all points, streaks, uploads and settings on this machine? <b>Export first</b> if you care.','wipe_everything',()=>{ localStorage.removeItem(KEY); location.reload(); });
  }));
  $('#consoleToggle').addEventListener('click',consoleToggle);
  $('#consoleClose').addEventListener('click',()=>{ $('#consolePanel').hidden=true; });
  $('#cmdInput').addEventListener('keydown',e=>{ if(e.key==='Enter'){ runCmd(e.target.value); e.target.value=''; } });
  $('#focusLen').addEventListener('change',e=>{ if(!focus.timer){ focus.left=parseInt(e.target.value,10); focusPaint(); } });
  $('#focusStart').addEventListener('click',()=>{
    if(focus.timer){ clearInterval(focus.timer); focus.timer=null; }
    else { focus.timer=setInterval(focusTick,1000); toast('focus session started. no distractions.'); }
    focusPaint();
  });
  $('#focusReset').addEventListener('click',()=>{ if(focus.timer){ clearInterval(focus.timer); focus.timer=null; } focus.left=parseInt($('#focusLen').value,10); focusPaint(); });
  $('#importFile').addEventListener('change',e=>{ if(e.target.files[0]) doImport(e.target.files[0]); e.target.value=''; });
  $('#tree')&&$('#tree').addEventListener('keydown',e=>{ if(e.key==='Enter'){ const li=e.target.closest('li[data-cat]'); if(li) setCat(li.dataset.cat); } });
}

/* ---------- boot ---------- */
function boot(){
  wireChrome();
  document.documentElement.dataset.theme=S.theme||'green';
  focus.left=parseInt($('#focusLen').value,10); focusPaint();
  checkin(); render(); cprint('knowlegify shell ready. type <b>help</b> to begin.','mut');
  syslog('session started · user='+(S.user.name||'guest'));
  const lines=[
    ['> mounting ~/library …','ok'],['> linking IIT_KGP.lib …','ok'],
    ['> verifying '+allRes().length+' research modules …','ok'],['> restoring session for '+(S.user.name||'guest')+' …','ok'],
    ['> points balance: '+S.points+' · streak: '+S.streak.count+'d','ok'],['> <b>ready.</b> welcome back to the lab.','ok']
  ];
  const log=$('#bootLog'), bootEl=$('#boot');
  let i=0, done=false;
  const finish=()=>{ if(done) return; done=true; bootEl.classList.add('done'); if(!S.onboarded) setTimeout(openOnboarding,350); };
  $('#bootSkip').addEventListener('click',finish);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){ log.innerHTML=lines.map(l=>'<div class="'+l[1]+'">'+l[0]+'</div>').join(''); setTimeout(finish,400); return; }
  const step=()=>{
    if(done) return;
    if(i<lines.length){ const d=document.createElement('div'); d.className=lines[i][1]; d.innerHTML=lines[i][0]; log.appendChild(d); i++; setTimeout(step,180); }
    else setTimeout(finish,350);
  };
  step();
  setInterval(()=>{ if(!document.hidden) addPts(2,'background sync',true); },10000);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();

})();
