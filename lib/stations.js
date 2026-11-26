// Every station is taken from Soniaa S.'s LinkedIn profile PDF. Nothing here is invented.
// f = the number shown on the dial. AM uses year + month/12, so the dial reads as a timeline.

export const BANDS = [
  { id: 'fm', label: 'FM', name: 'Philosophy', story: 'Who she is', unit: 'MHz', min: 87.5, max: 108, digits: 1 },
  { id: 'am', label: 'AM', name: 'Archive', story: 'Her journey', unit: '', min: 2001.5, max: 2026, year: true },
  { id: 'lw', label: 'LW', name: 'Honours', story: 'Recognition', unit: 'kHz', min: 144, max: 270, digits: 0 },
  { id: 'sw', label: 'SW', name: 'World', story: 'Her reach', unit: 'MHz', min: 5.5, max: 16.5, digits: 1 },
];
// Story order = array order: chapter 1 → 4. Inside a band, stations play left to right (by f).

export const STATIONS = [
  // FM · Philosophy (her summary, headline and skills)
  { band: 'fm', f: 95.1, id: 'simplicity', name: 'Simplicity', quote: 'I don’t believe in complicating things.',
    body: ['I focus on simplicity, and what steps will genuinely move things forward.'] },
  { band: 'fm', f: 104.1, id: 'skills', name: 'Top skills', title: 'Email · Market Research · Email Strategy' },
  { band: 'fm', f: 92.9, id: 'root', name: 'From the root', quote: '…and fix them from the root.',
    body: ['That’s how I approach brand, demand, communication, and team leadership too.'] },
  { band: 'fm', f: 97.0, id: 'picture', name: 'The whole picture', quote: 'Seeing the whole picture.',
    body: ['Understanding how brand affects revenue,', 'how messaging affects conversion,', 'how operations affect execution,', 'and how people affect everything.'] },
  { band: 'fm', f: 90.7, id: 'structure', name: 'Structure without chaos', quote: 'I bring structure without chaos.',
    body: ['I help teams feel more confident and connected in what they’re building.'] },
  { band: 'fm', f: 99.3, id: 'steady', name: 'Steady mind', quote: 'I work with a steady mind.' },
  { band: 'fm', f: 101.6, id: 'everywhere', name: 'Everywhere', quote: 'My role has naturally been the same everywhere.',
    body: ['Across global companies, early-stage teams, and growing startups.'] },
  { band: 'fm', f: 88.6, id: 'id', name: 'Station ID', title: 'Soniaa S.',
    meta: ['Fractional CMO', 'Human Messaging, Clear Strategy & Meaningful Growth', 'Gurugram, Haryana, India'] },

  // AM · Archive (education and experience, in date order)
  { band: 'am', f: 2002.0, id: 'mdu', name: 'Maharshi Dayanand University', title: 'B.E., Electronics & Telecommunication', meta: ['2002 – 2006'] },
  { band: 'am', f: 2006.33, id: 'bosch', name: 'Bosch', title: 'Marketing Management Trainee → Marketing Specialist',
    meta: ['May 2006 – May 2008', 'Bengaluru · India and Hong Kong'],
    body: ['Involved in new product launches, from idea generation to effective implementation.', 'Worked with Carnegie Mellon University on a competitive SWOT analysis and positioning.', 'Online advertising through Google AdWords PPC; analysed daily trends through Eloqua and Google Analytics.'] },
  { band: 'am', f: 2007.0, id: 'iimb', name: 'IIM Bangalore', title: 'Executive MBA, Marketing', meta: ['Indian Institute of Management, Bangalore', '2007 – 2008'] },
  { band: 'am', f: 2007.5, id: 'symbiosis', name: 'Symbiosis', title: 'PGDBM, Marketing & Sales', meta: ['Symbiosis Institute of Management Studies', '2007 – 2009'] },
  { band: 'am', f: 2008.33, id: 'faro', name: 'FARO Technologies', title: 'Marketing and Communication Manager · India → Asia',
    meta: ['May 2008 – Aug 2010'],
    body: ['Led corporate marketing strategy, program and plan development, execution, and measurement.', 'Developed and maintained the Sales Toolkit. Owned all website and knowledge base content.'] },
  { band: 'am', f: 2010.67, id: 'creaform', name: 'Creaform Inc.', title: 'Head of Marketing and Sales',
    meta: ['Sep 2010 – Jun 2013', 'United States'],
    body: ['Created and drove lead nurturing strategies to convert existing prospects into sales qualified leads.', 'Managed integrated campaigns, database and email marketing, SEO and paid keyword marketing.'] },
  { band: 'am', f: 2013.0, id: 'tadkaa', name: 'Brand Tadkaa', title: 'Founder | CEO → Advisory Board Member',
    meta: ['Jan 2013 – Dec 2019', 'India · San Diego, California'],
    body: ['Helped build pipeline and revenue for the company.'] },
  { band: 'am', f: 2013.58, id: 'showmeleads', name: 'ShowMeLeads Inc', title: 'Manager → Senior Manager, Demand Generation & Marketing Automation',
    meta: ['Aug 2013 – Jul 2014', 'United States · San Francisco Bay Area'],
    stats: [['1,200', 'new opportunities in 2014'], ['100', 'closed deals in 2014'], ['80%', 'delivery rate, Marketo & Salesforce']],
    body: ['Developed lead scoring models, compelling offers and lead nurturing campaigns.'] },
  { band: 'am', f: 2013.75, id: 'specialist', name: 'Sonia Specialist', title: 'Digital Consultant → Consulting Specialist',
    meta: ['Oct 2013 – Present', 'Gurugram, Haryana, India'],
    body: ['Recognised as “SONIA SPECIALIST” in the market.', 'Helps startups and organisations become “MODERN MARKETERS” with free consultancy.'] },
  { band: 'am', f: 2014.5, id: 'appirio', name: 'Appirio', title: 'Sr. Demand Generation Manager → Director, Demand Gen, Marketing & Sales Operations',
    meta: ['Jul 2014 – Dec 2015', 'India · United States'],
    stats: [['6 mo', 'to promotion'], ['15', 'member division built (JMC)'], ['$X → $5X', 'company value in 18 months']],
    body: ['Built the Jaipur Marketing Center and oversaw hiring and training for new joiners.'] },
  { band: 'am', f: 2016.0, id: 'lasersec1', name: 'Lasersec Technologies', title: 'Director, Demand Generation & Sales → VP Global Sales Marketing',
    meta: ['Jan 2016 – Jul 2018', 'Asia'],
    stats: [['20+', 'marketing professionals led']],
    body: ['Owned demand generation for the fast-growing packaging industry.'] },
  { band: 'am', f: 2018.33, id: 'roundglass', name: 'RoundGlass', title: 'Leader, Digital Marketing → Digital Marketing Director',
    meta: ['May 2018 – Apr 2020', 'Gurgaon · United States'],
    body: ['Directed marketing efforts with a focus on clarity, purpose, and measurable outcomes.', 'Ensured campaigns were aligned with long-term business goals.'] },
  { band: 'am', f: 2020.17, id: 'ismokestack', name: 'i-SmokeStack', title: 'Chief Marketing Officer',
    meta: ['Mar 2020 – Present', 'United States'],
    body: ['Led marketing strategy and brand initiatives for early-stage startups and global teams.', 'Built frameworks that transformed fragmented teams into aligned, confident growth engines.'] },
  { band: 'am', f: 2020.25, id: 'datt', name: 'Datt Mediproducts', title: 'Fractional CMO',
    meta: ['Apr 2020 – Present', 'New Delhi, India'],
    body: ['Translated market and product insights into strategies that drove engagement, visibility, and customer acquisition.'] },
  { band: 'am', f: 2021.08, id: 'lasersec2', name: 'Lasersec Technologies', title: 'Vice President, Product Marketing',
    meta: ['Feb 2021 – Present', 'Remote'],
    body: ['Guides product and marketing teams to see the bigger picture across global markets.'] },
  { band: 'am', f: 2023.0, id: 'ayuinc', name: 'AYU Inc USA', title: 'Chief Marketing & Operations Advisor',
    meta: ['Jan 2023 – Present', 'Boston, Massachusetts'],
    body: ['Developed frameworks that aligned brand, marketing, and operational goals.'] },
  { band: 'am', f: 2025.25, id: 'ayulife', name: 'AYU Lifescience', title: 'Fractional Marketing Lead',
    meta: ['Apr 2025 – Present', 'Dubai, United Arab Emirates'],
    body: ['Building a clean, TGA-aligned brand experience for UAE’s medical buyers.'] },
  { band: 'am', f: 2025.33, id: 'celestial', name: 'Celestial AI', title: 'Chief Marketing & Operations Advisor',
    meta: ['May 2025 – Present', 'Noida, Uttar Pradesh'],
    body: ['Led end-to-end marketing and operational strategy for a new startup, building structures and processes from the ground up.'] },

  // SW · World
  { band: 'sw', f: 6.1, id: 'hindi', name: 'Hindi', title: 'Hindi', greet: 'नमस्ते' },
  { band: 'sw', f: 7.9, id: 'english', name: 'English', title: 'English', greet: 'Hello' },
  { band: 'sw', f: 9.7, id: 'punjabi', name: 'Punjabi', title: 'Punjabi', greet: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ' },
  { band: 'sw', f: 11.6, id: 'french', name: 'French', title: 'French', greet: 'Bonjour' },
  { band: 'sw', f: 13.7, id: 'german', name: 'German', title: 'German', greet: 'Hallo' },
  { band: 'sw', f: 15.4, id: 'base', name: 'Base', title: 'Gurugram, Haryana, India', meta: ['Home station'] },

  // LW · Honours & certifications
  { band: 'lw', f: 153, id: 'presenter', name: 'Best Presenter', title: 'Best Presenter Award', meta: ['2007'] },
  { band: 'lw', f: 171, id: 'employer', name: 'Best Employer', title: 'Best Employer', meta: ['2008'] },
  { band: 'lw', f: 189, id: 'leadership', name: 'Marketing Leadership', title: 'MARKETING LEADERSHIP', meta: ['2011'] },
  { band: 'lw', f: 207, id: 'salesops', name: 'Sales Ops of the Year', title: 'Sales Operations Professional of the Year', meta: ['2012'] },
  { band: 'lw', f: 225, id: 'rank13', name: 'Ranked #13', title: 'Ranked #13 in Top Demand Generation Experts', meta: ['2014'] },
  { band: 'lw', f: 243, id: 'marketo', name: 'Marketo Expert', title: 'Marketo Certified Expert', meta: ['Certification'] },
  { band: 'lw', f: 261, id: 'digital', name: 'Digital Marketing', title: 'Fundamentals of Digital Marketing', meta: ['Certification'] },
];

export const LINKEDIN = 'https://www.linkedin.com/in/soniaspecialist';

// What Soniaa says on each station, in first person. Every fact comes from her LinkedIn profile PDF;
// the only connective tissue is dates that line up (e.g. "the same year").
export const STORY = {
  // FM · Philosophy
  simplicity: 'I don’t believe in complicating things. I focus on simplicity, and on the steps that will genuinely move things forward. Keep turning the dial.',
  skills: 'My top skills? Email, market research, and email strategy. On the AM band, you’ll find the email nurturing campaigns I ran on Marketo and Salesforce, with an eighty percent delivery rate.',
  root: 'My way of working is to fix things from the root. That’s how I approach brand, demand, communication, and team leadership too.',
  picture: 'For me, it comes down to seeing the whole picture. How brand affects revenue. How messaging affects conversion. How operations affect execution. And how people affect everything.',
  structure: 'I bring structure without chaos. I help teams feel more confident and connected in what they’re building. Tune to 2014 on the AM band, and you’ll find the fifteen-member division I built at Appirio.',
  steady: 'I work with a steady mind.',
  everywhere: 'Global companies, early-stage teams, growing startups. My role has naturally been the same everywhere. Switch to the AM band, and you can follow it, from Bosch in 2006 all the way to Celestial AI in 2025.',
  id: 'Hello, I’m Soniaa. I’m a Fractional CMO, based in Gurugram, Haryana. My work is about human messaging, clear strategy, and meaningful growth. Turn the dial. Every station on this radio is a piece of my story.',

  // AM · Archive
  mdu: 'Let’s start at the beginning. From 2002 to 2006, I studied Electronics and Telecommunication at Maharshi Dayanand University. Turn forward, and see where that degree took me.',
  bosch: '2006. The same year I finished engineering, I joined Bosch in Bengaluru, as a Marketing Management Trainee. Six months later, I was a Marketing Specialist, working across India and Hong Kong. I was part of new product launches, from idea generation to implementation. I worked with Carnegie Mellon University on a competitive SWOT analysis. And I ran online advertising on Google AdWords, tracking daily trends in Eloqua and Google Analytics.',
  iimb: '2007. While I was still at Bosch, I began an Executive MBA in Marketing at IIM Bangalore, and completed it in 2008. That same year, 2007, I also won the Best Presenter Award.',
  symbiosis: 'And alongside that, from 2007 to 2009, I did a PGDBM in Marketing and Sales at Symbiosis Institute of Management Studies. So, two management programmes, both alongside my work.',
  faro: '2008. I moved to FARO Technologies, as Marketing and Communication Manager for India. By April 2009, my role covered all of Asia. I led corporate marketing strategy end to end: planning, execution, and measurement. I built the sales toolkit, and owned all of the website and knowledge base content. 2008 was also the year of my Best Employer award.',
  creaform: 'September 2010. I became Head of Marketing and Sales at Creaform, in the United States. Here, I built lead nurturing strategies to turn prospects already in the database into sales qualified leads. I ran integrated campaigns, email and drip marketing, SEO, and paid search. In these years came two honours: Marketing Leadership in 2011, and Sales Operations Professional of the Year in 2012.',
  tadkaa: 'January 2013. I founded my own company, Brand Tadkaa, in India, and led it as Founder and CEO until April 2014. After that, I stayed on as an Advisory Board Member, in San Diego, helping the company build pipeline and revenue.',
  showmeleads: 'August 2013. ShowMeLeads, in the United States. First as Manager, then as Senior Manager of Demand Generation and Marketing Automation, in the San Francisco Bay Area. In 2014, I drove twelve hundred new opportunities, and one hundred closed deals. My email nurturing campaigns on Marketo and Salesforce reached an eighty percent delivery rate.',
  specialist: 'October 2013. In Gurugram, I started consulting. First as a Digital Consultant, and from 2016, as a Consulting Specialist, which I continue today. The market came to know me as “Sonia Specialist”. And I offer free consultancy, to help startups and organisations become modern marketers.',
  appirio: 'July 2014. I joined Appirio as Senior Demand Generation Manager. Within six months, I was promoted to Director of Demand Generation, Marketing and Sales Operations. I built an entirely new division, the Jaipur Marketing Center, with fifteen team members, handling everything from hiring to training. And my demand generation work helped grow the company’s value five times over, in eighteen months. That same year, I was ranked number thirteen among the top demand generation experts.',
  lasersec1: '2016. Lasersec Technologies, in Asia. I came in as Director of Demand Generation and Sales, and by December, I was Vice President of Global Sales and Marketing. I owned demand generation for the fast-growing packaging industry, and led a team of more than twenty marketing professionals, across digital, demand, marketing operations, web, account development, and sales development.',
  roundglass: 'May 2018. RoundGlass, in Gurgaon. I started as Leader of Digital Marketing, and in April 2019, I became Digital Marketing Director, based in the United States. My focus: clarity, purpose, and measurable outcomes, with every campaign aligned to long-term business goals.',
  ismokestack: 'March 2020. I became Chief Marketing Officer at i-SmokeStack, in the United States, a role I still hold. I lead marketing strategy and brand for early-stage startups and global teams. And I build frameworks that turn fragmented teams into aligned, confident growth engines.',
  datt: 'April 2020. Just one month later, I also took on the role of Fractional CMO at Datt Mediproducts, in New Delhi. There, I turn market and product insights into strategies that drive engagement, visibility, and customer acquisition.',
  lasersec2: 'February 2021. I returned to Lasersec Technologies, this time as Vice President of Product Marketing, working remotely. My job: helping product and marketing teams see the bigger picture across global markets, and turning complex strategies into simple, actionable plans.',
  ayuinc: 'January 2023. AYU Inc, in Boston, Massachusetts. As Chief Marketing and Operations Advisor, I built the marketing and operational strategy for a new startup from the ground up, with frameworks that align brand, marketing, and operations.',
  ayulife: 'April 2025. AYU Lifescience, in Dubai. As Fractional Marketing Lead, I’m building a clean, T G A aligned brand experience for medical buyers in the UAE, looking after product communication, the website, and coordination across content, UI, and CRM tracking.',
  celestial: 'May 2025. The latest station on this band. I joined Celestial AI, in Noida, as Chief Marketing and Operations Advisor, leading marketing and operations for a new startup, and building its structures and processes from the ground up. From an engineering degree in 2002, to advising an AI startup today. That’s my AM band. Switch to FM, to hear how I think.',

  // SW · World
  hindi: 'Namaste! Hindi is one of the five languages on my profile.',
  english: 'Hello! English. My work has taken me to teams in India, Hong Kong, the United States, and Dubai.',
  punjabi: 'Sat Sri Akal! Punjabi is on my list too.',
  french: 'Bonjour! Yes, French as well.',
  german: 'Hallo! And German makes five. Hindi, English, Punjabi, French, and German.',
  base: 'Home station: Gurugram, Haryana, India. This is where my consulting practice runs from. Boston, Dubai, Noida. Wherever the work goes, this is where the signal comes from.',

  // LW · Honours
  presenter: '2007. The Best Presenter Award. That was the year I was at Bosch, and starting my MBA at IIM Bangalore.',
  employer: '2008. Best Employer. The same year I moved from Bosch to FARO Technologies.',
  leadership: '2011. Marketing Leadership. At the time, I was Head of Marketing and Sales at Creaform.',
  salesops: '2012. Sales Operations Professional of the Year. I was still at Creaform, running marketing and sales.',
  rank13: '2014. Ranked number thirteen among the top demand generation experts. That was the year of twelve hundred new opportunities at ShowMeLeads, and my move to Appirio.',
  marketo: 'Marketo Certified Expert. Marketo is the platform behind my email nurturing campaigns at ShowMeLeads.',
  digital: 'And Fundamentals of Digital Marketing. A certification to go with nearly two decades of digital work, from Google AdWords at Bosch in 2006, to my roles today.',
};
