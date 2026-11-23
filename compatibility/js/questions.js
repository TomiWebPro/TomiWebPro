// Question bank — English (neutral, friendly, no desired answers exposed).
// To translate: move these strings into locales/<lang>.json later; renderer uses q.title/q.desc as-is.
// Full country list shared by origin + location questions. `region` is INTERNAL (scoring tier) — never shown.
const COUNTRIES = [
["afghanistan","Afghanistan","other"],["albania","Albania","europe"],["algeria","Algeria","africa"],
["andorra","Andorra","europe"],["angola","Angola","africa"],["antigua_barbuda","Antigua and Barbuda","other"],
["argentina","Argentina","other"],["armenia","Armenia","other"],["australia","Australia","australia"],
["austria","Austria","eu"],["azerbaijan","Azerbaijan","other"],["bahamas","Bahamas","other"],
["bahrain","Bahrain","other"],["bangladesh","Bangladesh","other"],["barbados","Barbados","other"],
["belarus","Belarus","europe"],["belgium","Belgium","eu"],["belize","Belize","other"],
["benin","Benin","africa"],["bhutan","Bhutan","other"],["bolivia","Bolivia","other"],
["bosnia","Bosnia and Herzegovina","europe"],["botswana","Botswana","africa"],["brazil","Brazil","other"],
["brunei","Brunei","other"],["bulgaria","Bulgaria","eu"],["burkina_faso","Burkina Faso","africa"],
["burundi","Burundi","africa"],["cabo_verde","Cabo Verde","africa"],["cambodia","Cambodia","other"],
["cameroon","Cameroon","africa"],["canada","Canada","other"],["car","Central African Republic","africa"],
["chad","Chad","africa"],["chile","Chile","other"],["china","China","china"],
["colombia","Colombia","other"],["comoros","Comoros","africa"],["congo_dr","Congo (DR)","africa"],
["congo_rep","Congo (Republic)","africa"],["costa_rica","Costa Rica","other"],["croatia","Croatia","eu"],
["cuba","Cuba","other"],["cyprus","Cyprus","eu"],["czechia","Czechia","eu"],
["denmark","Denmark","eu"],["djibouti","Djibouti","africa"],["dominica","Dominica","other"],
["dominican_rep","Dominican Republic","other"],["ecuador","Ecuador","other"],["egypt","Egypt","africa"],
["el_salvador","El Salvador","other"],["eq_guinea","Equatorial Guinea","africa"],["eritrea","Eritrea","africa"],
["estonia","Estonia","eu"],["eswatini","Eswatini","africa"],["ethiopia","Ethiopia","africa"],
["fiji","Fiji","other"],["finland","Finland","eu"],["france","France","eu"],
["gabon","Gabon","africa"],["gambia","Gambia","africa"],["georgia","Georgia","other"],
["germany","Germany","eu"],["ghana","Ghana","africa"],["greece","Greece","eu"],
["grenada","Grenada","other"],["guatemala","Guatemala","other"],["guinea","Guinea","africa"],
["guinea_bissau","Guinea-Bissau","africa"],["guyana","Guyana","other"],["haiti","Haiti","other"],
["honduras","Honduras","other"],["hong_kong","Hong Kong","other"],["hungary","Hungary","eu"],
["iceland","Iceland","europe"],["india","India","india"],["indonesia","Indonesia","other"],
["iran","Iran","other"],["iraq","Iraq","other"],["ireland","Ireland","eu"],
["israel","Israel","other"],["italy","Italy","eu"],["ivory_coast","Ivory Coast","africa"],
["jamaica","Jamaica","other"],["japan","Japan","other"],["jordan","Jordan","other"],
["kazakhstan","Kazakhstan","other"],["kenya","Kenya","africa"],["kosovo","Kosovo","europe"],
["kuwait","Kuwait","other"],["kyrgyzstan","Kyrgyzstan","other"],["laos","Laos","other"],
["latvia","Latvia","eu"],["lebanon","Lebanon","other"],["lesotho","Lesotho","africa"],
["liberia","Liberia","africa"],["libya","Libya","africa"],["liechtenstein","Liechtenstein","europe"],
["lithuania","Lithuania","eu"],["luxembourg","Luxembourg","eu"],["macau","Macau","other"],
["madagascar","Madagascar","africa"],["malawi","Malawi","africa"],["malaysia","Malaysia","other"],
["maldives","Maldives","other"],["mali","Mali","africa"],["malta","Malta","eu"],
["mauritania","Mauritania","africa"],["mauritius","Mauritius","africa"],["mexico","Mexico","other"],
["moldova","Moldova","europe"],["monaco","Monaco","europe"],["mongolia","Mongolia","other"],
["montenegro","Montenegro","europe"],["morocco","Morocco","africa"],["mozambique","Mozambique","africa"],
["myanmar","Myanmar","other"],["namibia","Namibia","africa"],["nepal","Nepal","other"],
["netherlands","Netherlands","eu"],["new_zealand","New Zealand","other"],["nicaragua","Nicaragua","other"],
["niger","Niger","africa"],["nigeria","Nigeria","africa"],["north_korea","North Korea","other"],
["north_macedonia","North Macedonia","europe"],["norway","Norway","europe"],["oman","Oman","other"],
["pakistan","Pakistan","pakistan"],["palestine","Palestine","other"],["panama","Panama","other"],
["papua_new_guinea","Papua New Guinea","other"],["paraguay","Paraguay","other"],["peru","Peru","other"],
["philippines","Philippines","other"],["poland","Poland","eu"],["portugal","Portugal","eu"],
["qatar","Qatar","other"],["romania","Romania","eu"],["russia","Russia","russia"],
["rwanda","Rwanda","africa"],["saint_kitts","Saint Kitts and Nevis","other"],["saint_lucia","Saint Lucia","other"],
["saint_vincent","Saint Vincent and the Grenadines","other"],["samoa","Samoa","other"],["san_marino","San Marino","europe"],
["sao_tome","São Tomé and Príncipe","africa"],["saudi_arabia","Saudi Arabia","other"],["senegal","Senegal","africa"],
["serbia","Serbia","europe"],["seychelles","Seychelles","africa"],["sierra_leone","Sierra Leone","africa"],
["singapore","Singapore","other"],["slovakia","Slovakia","eu"],["slovenia","Slovenia","eu"],
["solomon","Solomon Islands","other"],["somalia","Somalia","africa"],["south_africa","South Africa","africa"],
["south_korea","South Korea","other"],["south_sudan","South Sudan","africa"],["spain","Spain","eu"],
["sri_lanka","Sri Lanka","other"],["sudan","Sudan","africa"],["suriname","Suriname","other"],
["sweden","Sweden","eu"],["switzerland","Switzerland","europe"],["syria","Syria","other"],
["taiwan","Taiwan","other"],["tajikistan","Tajikistan","other"],["tanzania","Tanzania","africa"],
["thailand","Thailand","other"],["timor_leste","Timor-Leste","other"],["togo","Togo","africa"],
["tonga","Tonga","other"],["trinidad_tobago","Trinidad and Tobago","other"],["tunisia","Tunisia","africa"],
["turkey","Turkey","other"],["turkmenistan","Turkmenistan","other"],["uganda","Uganda","africa"],
["ukraine","Ukraine","europe"],["uae","United Arab Emirates","other"],["uk","United Kingdom","europe"],
["usa","United States","usa"],["uruguay","Uruguay","other"],["uzbekistan","Uzbekistan","other"],
["vanuatu","Vanuatu","other"],["vatican","Vatican City","europe"],["venezuela","Venezuela","other"],
["vietnam","Vietnam","other"],["yemen","Yemen","other"],["zambia","Zambia","africa"],
["zimbabwe","Zimbabwe","africa"]
].map(([value, label, region]) => ({ value, label, region }));
// Language menu for the add-a-row picker (alphabetical — no ranking implied).
const LANGUAGES = ["Afrikaans","Albanian","Amharic","Arabic","Armenian","Azerbaijani","Basque","Belarusian","Bengali","Bosnian","Bulgarian","Burmese","Catalan","Chinese (Cantonese)","Chinese (Mandarin)","Croatian","Czech","Danish","Dutch","English","Esperanto","Estonian","Finnish","French","Galician","Georgian","German","Greek","Gujarati","Hausa","Hebrew","Hindi","Hungarian","Icelandic","Igbo","Indonesian","Irish","Italian","Japanese","Kazakh","Khmer","Korean","Lao","Latin","Latvian","Lithuanian","Macedonian","Malay","Marathi","Mongolian","Nepali","Norwegian","Persian (Farsi)","Polish","Portuguese","Punjabi","Romanian","Russian","Serbian","Sign language","Sinhala","Slovak","Slovenian","Spanish","Swahili","Swedish","Tagalog (Filipino)","Tamil","Telugu","Thai","Turkish","Ukrainian","Urdu","Uzbek","Vietnamese","Welsh","Yiddish","Yoruba","Zulu"]
.map(l => ({ value: l.toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, ''), label: l }));
const SECTIONS = [
  {
    id: 'basic', emoji: '🌷', title: 'Getting to know you',
    intro: 'A few basics to start — just be yourself! 💛',
    questions: [
      { id: 'b1', emoji: '💕', svg: 'hearts', title: 'What are you hoping to find here?', desc: `Everyone's on a different journey, and that's totally okay! Pick what feels closest right now. 💫`, type: 'single', options: [
        { value: 'casual', label: 'Casual dating / fun, spontaneous connections 😊' },
        { value: 'dating_to_marry', label: 'Dating with marriage in mind in the next few years 💍' },
        { value: 'marriage_now', label: 'Ready for marriage now / very soon 💒' },
        { value: 'friends_first', label: 'Friends first, see where it goes 🌱' },
        { value: 'situationship', label: 'Something low-pressure / go-with-the-flow ☁️' },
        { value: 'friends_only', label: 'Just friends for now — platonic only 🤝' } ] },
      { id: 'b2', emoji: '🎂', svg: 'cake', title: `When's your birthday?`, desc: 'Just to make sure everyone here is an adult! 🔞 Must be 18+ to continue. Enter month, day, and year separately. 💛', type: 'group', fields: [
        { key: 'month', label: 'Month', kind: 'select', options: [{value:'1',label:'January'},{value:'2',label:'February'},{value:'3',label:'March'},{value:'4',label:'April'},{value:'5',label:'May'},{value:'6',label:'June'},{value:'7',label:'July'},{value:'8',label:'August'},{value:'9',label:'September'},{value:'10',label:'October'},{value:'11',label:'November'},{value:'12',label:'December'}] },
        { key: 'day', label: 'Day', kind: 'number', placeholder: 'Day' },
        { key: 'year', label: 'Year', kind: 'number', placeholder: 'Year' } ] },
      { id: 'b3', emoji: '🌷', svg: 'flower', title: 'A little about gender & pronouns?', desc: 'Help get introductions right! ✨ Just pick — only write if nothing fits. 🤍', type: 'group', fields: [
        { key: 'birth_sex', label: 'Sex recorded at birth', kind: 'single', options: [{value:'Female',label:'Female ♀'},{value:'Male',label:'Male ♂'},{value:'Intersex / X',label:'Intersex / X ⚧'}] },
        { key: 'gender_journey', label: 'Has your gender identity changed since birth?', kind: 'single', options: [{value:'No change',label:'No change — same as birth ✅'},{value:'Yes',label:'Yes — it changed 🔄'},{value:'other',label:'None fits — I’ll write it ✍️'}] },
        { key: 'gender_journey_detail', label: 'If none fits, describe here (optional):', kind: 'text', placeholder: 'Write here…', showIf: { key: 'gender_journey', value: 'other' } },
        { key: 'pronouns', label: 'What pronouns should we use for you?', kind: 'single', options: [{value:'she/her',label:'she/her 🌷'},{value:'he/him',label:'he/him 🌿'},{value:'they/them',label:'they/them 🌈'},{value:'other',label:'None fits — I’ll write it ✍️'}] },
        { key: 'pronouns_detail', label: 'If none fits, write your pronouns (optional):', kind: 'text', placeholder: 'Write here…', showIf: { key: 'pronouns', value: 'other' } } ] },
      { id: 'b4', emoji: '🌈', svg: 'rainbow', title: 'How would you describe your attraction & dating history?', desc: 'We all have our own story! 💛 How do you identify today, and has that changed over time?', type: 'group', fields: [
        { key: 'identity', label: 'I identify as…', kind: 'single', options: [{value:'straight',label:'Straight / heterosexual'},{value:'gay_lesbian',label:'Gay / Lesbian'},{value:'bisexual',label:'Bisexual'},{value:'pansexual',label:'Pansexual'},{value:'asexual_demi',label:'Asexual / Demisexual'},{value:'queer_questioning',label:'Queer / Questioning'},{value:'self_describe',label:'Prefer to self-describe ✍️'}] },
        { key: 'identity_detail', label: 'Describe in your own words (only if you picked self-describe):', kind: 'text', placeholder: 'Write here…', showIf: { key: 'identity', value: 'self_describe' } },
        { key: 'history', label: 'Has that changed over time?', kind: 'single', options: [{value:'same',label:'Always the same ✅'},{value:'changed',label:'Yes — it changed over time 🔄'},{value:'other',label:'None fits — I’ll write it ✍️'}] },
        { key: 'history_detail', label: 'If none fits, describe here (optional):', kind: 'text', placeholder: 'Write here…', showIf: { key: 'history', value: 'other' } } ] },
      { id: 'b5', emoji: '📏', svg: 'ruler', title: 'How tall are you?', desc: 'Just for fun stats & matching vibes! 📊 Pick a unit, then enter height. ✨', type: 'group', fields: [
        { key: 'unit', label: 'Unit', kind: 'single', options: [{value:'cm',label:'Centimeters (cm) 📏'},{value:'ft',label:'Feet & inches (ft/in) 👟'}] },
        { key: 'cm', label: 'Height in centimeters', kind: 'number', placeholder: 'Centimeters', showIf: { key: 'unit', value: 'cm' } },
        { key: 'feet', label: 'Feet', kind: 'number', placeholder: 'Feet', showIf: { key: 'unit', value: 'ft' } },
        { key: 'inches', label: 'Inches', kind: 'number', placeholder: 'Inches', showIf: { key: 'unit', value: 'ft' } } ] },
      { id: 'b6', emoji: '⚖️', svg: 'scale', title: 'What is your BMI?', desc: 'No judgment at all! 💛 Enter your BMI number below. Need it? Calculate here in seconds 👉 https://www.calculator.net/bmi-calculator.html', type: 'number', placeholder: 'Enter your BMI here' },
      { id: 'b7', emoji: '🗣️', svg: 'chat', title: 'Which languages can you hold a conversation in?', desc: 'Add one row per language, with its level! 🌍 Add as many as you like. ✨', type: 'group', fields: [
        { key: 'rows', label: 'Languages + level', kind: 'langrows', languages: LANGUAGES, max: 8 } ] },
      { id: 'b8', emoji: '🎨', svg: 'palette', title: 'Pick the closest shades', desc: `Everyone's beautiful in a unique way! ✨ Just tap the closest color. 🎨`, type: 'group', fields: [
        { key: 'skin_tone', label: 'Skin tone — tap closest', kind: 'palette', options: [{value:'very_light',label:'Very light',color:'#FDEFE3'},{value:'light',label:'Light',color:'#F6DDBE'},{value:'olive',label:'Olive',color:'#D9B48F'},{value:'yellow',label:'Yellow',color:'#EDC67F'},{value:'tan',label:'Tan',color:'#C68863'},{value:'brown',label:'Brown',color:'#8D5524'},{value:'deep',label:'Deep',color:'#3B2417'}] },
        { key: 'natural_hair', label: 'Natural hair color', kind: 'palette', options: [{value:'black',label:'Black',color:'#1B1B1B'},{value:'dark_brown',label:'Dark brown',color:'#3B2A20'},{value:'brown',label:'Brown',color:'#6B4423'},{value:'blonde',label:'Blonde',color:'#E3C57B'},{value:'red',label:'Red / ginger',color:'#B5522B'},{value:'grey',label:'Grey / white',color:'#C9C9C9'}] },
        { key: 'current_hair', label: 'Current hair color', kind: 'palette', options: [{value:'same',label:'Same as natural'},{value:'dyed_dark',label:'Dyed dark',color:'#2B2B3A'},{value:'dyed_light',label:'Dyed light',color:'#F2E6C9'},{value:'dyed_red',label:'Dyed red',color:'#C0392B'},{value:'dyed_fashion',label:'Fashion color',color:'#B16CEA'},{value:'buzz',label:'Buzz / very short'}] },
        { key: 'eye_color', label: 'Eye color (just for fun — no judgment 💛)', kind: 'palette', options: [{value:'brown',label:'Brown',color:'#5B3A1E'},{value:'hazel',label:'Hazel',color:'#8A6D3B'},{value:'green',label:'Green',color:'#4E7A3A'},{value:'blue',label:'Blue',color:'#4A90D9'},{value:'grey',label:'Grey',color:'#9AA0A6'},{value:'black',label:'Black',color:'#1B1B1B'}] } ] },
      { id: 'b9', emoji: '🧠', svg: 'brain', title: 'Have you ever had a diagnosed mental health issue?', desc: 'Direct question: have you ever been diagnosed with a mental health issue since birth — past or present, active or resolved? Just pick one. 💛', type: 'single', options: [
        { value: 'no_diagnosis', label: 'No — never 🌼' },
        { value: 'past_resolved', label: 'Yes, in the past — now resolved 🌱' },
        { value: 'currently_managing', label: 'Yes, currently 💪' }] },
      { id: 'b10', emoji: '🩺', svg: 'access', title: 'Quick physical health check', desc: 'Direct checklist — answer each row. Missing limb, finger, or body part? Blindness or serious vision loss? (Normal glasses don’t count.) Deafness or hearing aid? Being muted or a speech disorder? 💛', type: 'group', fields: [
        { key: 'limb', label: 'Missing limb, finger, or body part?', kind: 'single', options: [{value:'no',label:'No — none'},{value:'yes',label:'Yes — applies to me'}] },
        { key: 'vision', label: 'Blind or serious vision loss? (glasses don’t count)', kind: 'single', options: [{value:'no',label:'No — none'},{value:'yes',label:'Yes — applies to me'}] },
        { key: 'hearing', label: 'Deaf or using a hearing aid?', kind: 'single', options: [{value:'no',label:'No — none'},{value:'yes',label:'Yes — applies to me'}] },
        { key: 'speech', label: 'Muted or a speech disorder?', kind: 'single', options: [{value:'no',label:'No — none'},{value:'yes',label:'Yes — applies to me'}] } ] },
      { id: 'b11', emoji: '👓', svg: 'glasses', title: 'Do you wear glasses?', desc: 'Cute glasses squad unite! 😎 Pick one — a prescription box appears if lenses are worn. ✨', type: 'group', fields: [
        { key: 'wears', label: 'Glasses / lenses?', kind: 'single', options: [{value:'yes_daily',label:'Yes, daily 🤓'},{value:'sometimes',label:'Sometimes — reading / screens 👀'},{value:'contacts',label:'Mostly contact lenses 👁️'},{value:'no',label:'Nope, no glasses ✨'}] },
        { key: 'diopters', label: 'Eye prescription in diopters, stronger eye (from glasses prescription)', kind: 'number', placeholder: '- / + diopters', showIf: { key: 'wears', value: 'yes_daily' } },
        { key: 'diopters2', label: 'Eye prescription in diopters, stronger eye (from glasses prescription)', kind: 'number', placeholder: '- / + diopters', showIf: { key: 'wears', value: 'sometimes' } },
        { key: 'diopters3', label: 'Eye prescription in diopters, stronger eye (from glasses prescription)', kind: 'number', placeholder: '- / + diopters', showIf: { key: 'wears', value: 'contacts' } } ] },
      { id: 'b12', emoji: '🌍', svg: 'globe', title: 'Where are you originally from?', desc: `Where's home-home? 🏡 Pick the country from the full list. ✨`, type: 'group', fields: [
        { key: 'country', label: 'Country of origin', kind: 'select', options: COUNTRIES } ] },
      { id: 'b13', emoji: '📍', svg: 'pin', title: 'Where do you live now?', desc: 'And where is the base these days? 🏙️ Pick the country from the full list. ✈️', type: 'group', fields: [
        { key: 'country', label: 'Current country', kind: 'select', options: COUNTRIES } ] },
    ]
  },
  {
    id: 'wealth', emoji: '💼', title: 'Lifestyle & independence',
    intro: 'A little about daily life & independence — honest answers help most! 🌱',
    questions: [
      { id: 'w1', emoji: '💼', svg: 'briefcase', title: 'What do you currently do?', desc: 'Work / study situation — no right or wrong answer! 😊 How many years in this status / field?', type: 'group', fields: [
        { key: 'status', label: 'Status', kind: 'single', options: [{value:'student',label:'Student 📚'},{value:'selfemployed',label:'Self-employed / Freelancer 🚀'},{value:'employed',label:'Employed 💼'},{value:'other',label:'Other ✍️'}] },
        { key: 'status_detail', label: 'Describe (only if you picked “other”):', kind: 'text', placeholder: 'Write here…', showIf: { key: 'status', value: 'other' } },
        { key: 'years', label: 'Years in this status (0–50)', kind: 'number', placeholder: 'Years' } ] },
      { id: 'w2', emoji: '📊', svg: 'chart', title: 'Your Income Independence Index', desc: 'A fun number! ✨ Independence Index = income YOU earned ÷ total spending, as monthly averages. Family money, gifts, and aid don’t count. 💡 Just enter the result below — or pick an option if you don’t track. 🤷', type: 'group', fields: [
        { key: 'ratio', label: 'Your Independence Index (earned ÷ spending)', kind: 'number', placeholder: 'Enter your index here' },
        { key: 'track', label: `Don't track? Lately you are…`, kind: 'single', optional: true, options: [{value:'',label:'I entered my index above ✅'},{value:'gaining',label:'Gaining wealth 🌱'},{value:'same',label:'About the same ➖'},{value:'losing',label:'Losing wealth 📉'},{value:'unsure',label:'Not sure 🤷'}] } ] },
      { id: 'w3', emoji: '📱', svg: 'phone', title: 'Where do you get your daily info?', desc: 'Everyone stays informed differently! Where do you MAINLY get news & daily info? Pick one favorite! 📰✨', type: 'single', options: [
        { value: 'browser', label: 'Computer browser 🖥️' }, { value: 'ai', label: 'ChatGPT / AI 🤖' },
        { value: 'phone', label: 'Phone 📱' }, { value: 'newspaper', label: 'Newspaper 🗞️' },
        { value: 'social', label: 'Social media 💬' }, { value: 'youtube', label: 'YouTube ▶️' },
        { value: 'instagram', label: 'Instagram 📸' }, { value: 'tiktok', label: 'TikTok / Shorts 🎵' }] },
      { id: 'w4', emoji: '🕊️', svg: 'bird', title: 'Your Financial Freedom Ratio', desc: 'One more fun number! 💫 Financial Freedom Ratio = (take-home pay − essentials) ÷ take-home pay × 100, as 3-month averages. Just enter the percentage below — or pick an option if you don’t know. 🤷', type: 'group', fields: [
        { key: 'ratio', label: 'Your ratio (%)', kind: 'number', placeholder: 'Percentage' },
        { key: 'track', label: `Don't know? Lately you are…`, kind: 'single', optional: true, options: [{value:'',label:'I entered my percentage above ✅'},{value:'gaining',label:'Gaining wealth 🌱'},{value:'same',label:'About the same ➖'},{value:'losing',label:'Losing wealth 📉'},{value:'unsure',label:'Not sure 🤷'}] } ] },
    ]
  },
  {
    id: 'life', emoji: '🌈', title: 'Everyday life & vibes',
    intro: 'Sports, food, sleep, pets & more — the fun part! 🍳🐾',
    questions: [
      { id: 'l1', emoji: '🧠', svg: 'brain', title: 'Your personality style?', desc: 'No good or bad types — just self-awareness! 🌟 MBTI plus a few quick ratings, or describe yourself.', type: 'group', fields: [
        { key: 'mbti', label: 'MBTI type', kind: 'select', options: [{value:'INTJ',label:'INTJ'},{value:'INTP',label:'INTP'},{value:'ENTJ',label:'ENTJ'},{value:'ENTP',label:'ENTP'},{value:'INFJ',label:'INFJ'},{value:'INFP',label:'INFP'},{value:'ENFJ',label:'ENFJ'},{value:'ENFP',label:'ENFP'},{value:'ISTJ',label:'ISTJ'},{value:'ISFJ',label:'ISFJ'},{value:'ESTJ',label:'ESTJ'},{value:'ESFJ',label:'ESFJ'},{value:'ISTP',label:'ISTP'},{value:'ISFP',label:'ISFP'},{value:'ESTP',label:'ESTP'},{value:'ESFP',label:'ESFP'}] },
        { key: 'bigfive', label: 'Big Five in your words (openness, conscientiousness, extraversion, agreeableness, sensitivity)', kind: 'text', placeholder: 'Optional…' } ] },
      { id: 'l2', emoji: '🔋', svg: 'battery', title: 'Where do you get your energy?', desc: 'Team cozy-night-in or team let’s-go-out? Both are great. 💛', type: 'single', options: [
        { value: 'def_intro', label: 'Definitely introvert — recharge alone 🌙' }, { value: 'rather_intro', label: 'Rather introvert 🍵' },
        { value: 'ambivert', label: 'Ambivert — both, varies by day ⚖️' }, { value: 'rather_extro', label: 'Rather extrovert 🎉' },
        { value: 'def_extro', label: 'Definitely extrovert — recharge with people ☀️' }] },
      { id: 'l3', emoji: '🏸', svg: 'sport', title: 'Sports and active hobbies?', desc: 'Add one row per sport, with how often! 💪 As many as you like. ✨', type: 'group', fields: [
        { key: 'sports', label: 'Sports + frequency', kind: 'sportrows', max: 8, sports: [
          { value: 'archery', label: 'Archery' }, { value: 'badminton', label: 'Badminton' },
          { value: 'ballet', label: 'Ballet' }, { value: 'baseball', label: 'Baseball' },
          { value: 'basketball', label: 'Basketball' }, { value: 'bouldering', label: 'Bouldering' },
          { value: 'bowling', label: 'Bowling' }, { value: 'boxing', label: 'Boxing' },
          { value: 'climbing', label: 'Climbing' }, { value: 'cricket', label: 'Cricket' },
          { value: 'crossfit', label: 'CrossFit' }, { value: 'cycling', label: 'Cycling' },
          { value: 'dance', label: 'Dance' }, { value: 'diving', label: 'Scuba diving' },
          { value: 'fencing', label: 'Fencing' }, { value: 'football', label: 'Football / soccer' },
          { value: 'golf', label: 'Golf' }, { value: 'gym', label: 'Gym / fitness' },
          { value: 'handball', label: 'Handball' }, { value: 'hiking', label: 'Hiking' },
          { value: 'horseriding', label: 'Horse riding' }, { value: 'iceskating', label: 'Ice skating' },
          { value: 'judo', label: 'Judo' }, { value: 'karate', label: 'Karate' },
          { value: 'kayaking', label: 'Kayaking' }, { value: 'martialarts', label: 'Martial arts' },
          { value: 'orienteering', label: 'Orienteering' }, { value: 'padel', label: 'Padel' },
          { value: 'paragliding', label: 'Paragliding' }, { value: 'parkour', label: 'Parkour' },
          { value: 'pickleball', label: 'Pickleball' }, { value: 'pilates', label: 'Pilates' },
          { value: 'roller', label: 'Roller-skating' }, { value: 'rowing', label: 'Rowing' },
          { value: 'rugby', label: 'Rugby' }, { value: 'running', label: 'Running' },
          { value: 'sailing', label: 'Sailing' }, { value: 'skateboarding', label: 'Skateboarding' },
          { value: 'skiing', label: 'Skiing' }, { value: 'skydiving', label: 'Skydiving' },
          { value: 'snorkeling', label: 'Snorkeling' }, { value: 'snowboarding', label: 'Snowboarding' },
          { value: 'softball', label: 'Softball' }, { value: 'squash', label: 'Squash' },
          { value: 'surfing', label: 'Surfing' }, { value: 'swimming', label: 'Swimming' },
          { value: 'table_tennis', label: 'Table tennis' }, { value: 'tennis', label: 'Tennis' },
          { value: 'triathlon', label: 'Triathlon' }, { value: 'frisbee', label: 'Ultimate frisbee' },
          { value: 'volleyball', label: 'Volleyball' }, { value: 'waterpolo', label: 'Water polo' },
          { value: 'yoga', label: 'Yoga' } ] } ] },
      { id: 'l4', emoji: '👋', svg: 'wave', title: 'How many new friends do you make each year?', desc: 'Roughly — how many new friends per year? Just pick the closest. 💛', type: 'single', options: [
        { value: '0', label: '0 new close friends / year is fine' }, { value: '1-2', label: '1–2 per year 🌱' },
        { value: '3-5', label: '3–5 per year 🌷' }, { value: '6-10', label: '6–10 per year 🎉' },
        { value: '10+', label: '10+ — love expanding! 🚀' }] },
      { id: 'l5', emoji: '🏊', svg: 'waves', title: 'Can you swim?', desc: 'Do you know how to swim? Just pick one. 🌊', type: 'single', options: [
        { value: 'confident', label: 'Yes, confident swimmer 🏅' }, { value: 'basics', label: 'Basics are okay 🙂' },
        { value: 'learning', label: 'Currently learning 🌱' }, { value: 'want_learn', label: 'No, but I’d like to learn 💪' },
        { value: 'comfortable_no', label: 'No, comfortable with that 😌' }] },
      { id: 'l6', emoji: '🐾', svg: 'paw', title: 'Furry friends?', desc: 'Pets are family! Pick what fits now & in the future. 🐶🐱', type: 'group', fields: [
        { key: 'have', label: 'Have now?', kind: 'multi', options: [{value:'dog',label:'🐶 Dog'},{value:'cat',label:'🐱 Cat'},{value:'other_pet',label:'🐾 Other pet'},{value:'none',label:'No pets now'},{value:'allergic',label:'🤧 Allergic'}] },
        { key: 'want', label: 'Want in future?', kind: 'single', options: [{value:'cat',label:'Cat person 🐱'},{value:'can_have',label:'Can have one, or not have one'},{value:'no_opinion',label:'No opinion 🤷'},{value:'dog',label:'Dog person 🐶'},{value:'other_pet',label:'Want other pet 🐾'},{value:'none',label:'Prefer no pets 🚫'},{value:'must_have',label:'Must have a pet ❤️'}] } ] },
      { id: 'l7', emoji: '🍳', svg: 'pan', title: 'How are you in the kitchen?', desc: 'From chef-mode to take-out-mode, all welcome! 🍜', type: 'group', fields: [
        { key: 'ability', label: 'Ability', kind: 'single', options: [{value:'love_good',label:'Love cooking, good at it 👩‍🍳'},{value:'basics',label:'Can cook basics 🍳'},{value:'learning',label:'Learning 🌱'},{value:'dont',label:'Don’t really cook 🥡'}] },
        { key: 'willing', label: 'Willingness', kind: 'single', options: [{value:'enjoy',label:'Enjoy cooking together ❤️'},{value:'share',label:'Happy to share / take turns ⚖️'},{value:'learn',label:'Willing to learn together 🌱'},{value:'eatout',label:'Prefer eating out / ordering 🛵'},{value:'takeover',label:'Super willing to take on all cooking 🔥'}] } ] },
      { id: 'l8', emoji: '🥗', svg: 'salad', title: 'How do you eat?', desc: 'Daily life matching — diets, beliefs & health. 🍽️', type: 'group', fields: [
        { key: 'diet', label: 'Diet', kind: 'single', options: [{value:'omnivore',label:'Omnivore — eat everything 🍖🥦'},{value:'flexi',label:'Flexitarian 🌱'},{value:'vegetarian',label:'Vegetarian 🥬'},{value:'vegan',label:'Vegan 🌿'},{value:'halal',label:'Halal only ☪️'},{value:'kosher',label:'Kosher only ✡️'},{value:'meatonly',label:'Mostly meat / carnivore 🥩'},{value:'other',label:'Other ✍️'}] },
        { key: 'diet_detail', label: 'Describe (only if you picked “other”):', kind: 'text', placeholder: 'Write here…', showIf: { key: 'diet', value: 'other' } },
        { key: 'allergy', label: 'Food allergies / intolerances?', kind: 'single', options: [{value:'none',label:'None ✅'},{value:'yes',label:'Yes — have some ⚠️'}] },
        { key: 'allergy_detail', label: 'List them (only if you picked “yes”):', kind: 'text', placeholder: 'Write here…', showIf: { key: 'allergy', value: 'yes' } } ] },
      { id: 'l9', emoji: '🌶️', svg: 'chili', title: 'Spice and food adventures?', desc: 'How brave are your taste buds? 🐉', type: 'group', fields: [
        { key: 'spice', label: 'Spicy food?', kind: 'single', options: [{value:'none',label:'No spice please 🥛'},{value:'mild',label:'Mild is ok 🙂'},{value:'medium',label:'Medium — enjoy some heat 🔥'},{value:'hot',label:'Hot lover 🌶️'},{value:'extreme',label:'Extreme! 🐲'}] },
        { key: 'adventure', label: 'Adventurous foods (rabbit, game, offal, insects, fermented)?', kind: 'single', options: [{value:'love',label:'Love trying anything 🚀'},{value:'open',label:'Open to most 🌱'},{value:'hesitant',label:'Hesitant but curious 🤔'},{value:'familiar',label:'Prefer familiar foods 🍞'},{value:'averse',label:'Strong aversions ✍️'}] },
        { key: 'adventure_detail', label: 'List them (only if you picked “aversions”):', kind: 'text', placeholder: 'Write here…', showIf: { key: 'adventure', value: 'averse' } } ] },
      { id: 'l10', emoji: '😴', svg: 'moon', title: 'Sleep habits?', desc: 'Sleep matters for living together. Be honest, no judgment! 🌙', type: 'group', fields: [
        { key: 'rhythm', label: 'Rhythm?', kind: 'single', options: [{value:'early',label:'Early bird ☀️'},{value:'rather_morning',label:'Rather morning 🌅'},{value:'flexible',label:'Flexible ⚖️'},{value:'rather_night',label:'Rather night 🌆'},{value:'nightowl',label:'Night owl 🦉'},{value:'messed',label:'Messed-up sleep clock ⏰'}] },
        { key: 'snore', label: 'Snoring?', kind: 'single', options: [{value:'regular',label:'Yes, regularly 😴'},{value:'sometimes',label:'Sometimes / when tired 😪'},{value:'no',label:'No 🙂'},{value:'dontknow',label:'Don’t know 🤷'}] },
        { key: 'share', label: 'Sharing bed / room?', kind: 'single', options: [{value:'same_bed',label:'Love same bed + same room ❤️'},{value:'same_room',label:'Same room, separate beds 🛏️'},{value:'own_room',label:'Need my own room 🚪'},{value:'no_share',label:'Don’t want to share a bed at all 🙅'}] } ] },
      { id: 'l11', emoji: '💌', svg: 'letter', title: 'Relationship history?', desc: 'Optional & judgment-free. List them briefly if you like — details only if wanted. 🤍', type: 'group', fields: [
        { key: 'count', label: 'Past serious relationships?', kind: 'single', options: [{value:'0',label:'0 🌱'},{value:'1',label:'1 💛'},{value:'2',label:'2 🌷'},{value:'3+',label:'3 or more 🌸'}] },
        { key: 'learned', label: 'Want to add what you learned? (optional)', kind: 'text', placeholder: 'Optional…' } ] },
      { id: 'l12', emoji: '🤍', svg: 'heart', title: 'Anything a future partner should know?', desc: 'Totally optional — kindness first. Just pick per row. 🤍', type: 'group', fields: [
        { key: 'partners', label: 'Past sexual partners?', kind: 'single', options: [{value:'0',label:'0 🤍'},{value:'1-2',label:'1–2'},{value:'3-5',label:'3–5'},{value:'6-8',label:'6–8'},{value:'9+',label:'9 or more'}] },
        { key: 'kids', label: 'Biological children?', kind: 'single', options: [{value:'no',label:'No ✅'},{value:'yes',label:'Yes 👶'}] },
        { key: 'pregnancy', label: 'Pregnancy history involving abortion?', kind: 'single', options: [{value:'none',label:'No such history ✅'},{value:'miscarriage',label:'Miscarriage only 🕊️'},{value:'abortion',label:'Abortion history'}] } ] },
      { id: 'l13', emoji: '🚭', svg: 'nosmoke', title: 'Smoking or vaping?', desc: 'No lectures, just matching expectations. 💨', type: 'group', fields: [
        { key: 'history', label: 'History?', kind: 'single', options: [{value:'never',label:'Never 🌿'},{value:'tried',label:'Tried occasionally'},{value:'former',label:'Former regular, now quit'},{value:'social',label:'Occasional / social now'},{value:'regular',label:'Regular now'}] },
        { key: 'future', label: 'Future intent?', kind: 'single', options: [{value:'stay_free',label:'Stay smoke/vape-free ✅'},{value:'quit',label:'Trying / want to quit 🌱'},{value:'social_ok',label:'Okay with occasional social'},{value:'continue',label:'Plan to continue'}] } ] },
      { id: 'l14', emoji: '🎲', svg: 'dice', title: 'Habits you are working on?', desc: 'We all have struggles. Private & matching supportively. 🤍 Optional. Please give your max single-session casino/betting stake in euros (0 if never).', type: 'group', fields: [
        { key: 'gamble', label: 'Casino / betting?', kind: 'single', options: [{value:'never',label:'Never gamble 🍀'},{value:'rare',label:'Rare fun, within budget'},{value:'past',label:'Past issue, now managed'},{value:'sometimes',label:'Sometimes more than I want'}] },
        { key: 'max_stake', label: 'Max stake in one session, in euros (0 if never)', kind: 'number', placeholder: '0' },
        { key: 'sexhabit', label: 'Porn / masturbation / sex — any concern?', kind: 'single', options: [{value:'fine',label:'No concern — balanced and comfortable 🌿'},{value:'private',label:'No concern, but prefer to keep details private 🤍'},{value:'past',label:'Had an issue in the past, now resolved 🌱'},{value:'struggle',label:'Sometimes feels hard to control 💪'}] },
        { key: 'drugs', label: 'Drugs (incl. recreational / misused meds)?', kind: 'single', options: [{value:'never',label:'Never ✅'},{value:'past',label:'Past experimental, stopped'},{value:'occasional',label:'Occasional now'},{value:'regular',label:'Regular / feel dependent'},{value:'recovery',label:'In recovery 🌱'}] } ] },
      { id: 'l15', emoji: '🥂', svg: 'cheers', title: 'Alcohol?', desc: 'Cheers or no cheers — both normal! 🥂', type: 'group', fields: [
        { key: 'freq', label: 'Frequency?', kind: 'single', options: [{value:'never',label:'Never 🚫'},{value:'sober',label:'Sober by choice / recovery 💪'},{value:'rare',label:'Rarely — special occasions ✨ (≤ once/year)'},{value:'monthly',label:'1–2× a month 🍷'},{value:'weekly',label:'Weekly moderately'},{value:'multiweek',label:'Several times a week 🍺'},{value:'daily',label:'Daily'}] },
        { key: 'partner', label: `Partner's drinking is…`, kind: 'single', options: [{value:'fine',label:'Totally fine 🙂'},{value:'moderate',label:'Okay if moderate'},{value:'prefer_sober',label:'Prefer sober partner'},{value:'need_free',label:'Need alcohol-free home 🏠'}] } ] },
      { id: 'l16', emoji: '👶', svg: 'baby', title: 'Thoughts on kids?', desc: 'Dream big or kid-free — ideal & limit. 💛', type: 'group', fields: [
        { key: 'ideal', label: 'Ideal number?', kind: 'single', options: [{value:'0',label:'0'},{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4+',label:'4+'},{value:'undecided',label:'Undecided / open 🤍'}] },
        { key: 'max', label: 'Max you’d be happy with?', kind: 'single', options: [{value:'0',label:'0'},{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4+',label:'4+'}] } ] },
      { id: 'l17', emoji: '📸', svg: 'camera', title: 'Private or public couple?', desc: 'Cute posts or low-key? 📸', type: 'single', options: [
        { value: 'private', label: 'Keep things totally private — no posts 🔒' }, { value: 'close_only', label: 'Share with close family / friends only 👨‍👩‍👧' },
        { value: 'casual', label: 'Okay with casual posts occasionally 🙂' }, { value: 'open', label: 'Love sharing openly 📣' },
        { value: 'spotlight', label: 'Comfortable with spotlight / creator-style 🌟' }] },
      { id: 'l18', emoji: '🌱', svg: 'sprout', title: 'Different paths to family?', desc: 'Everyone sees this differently. Choose what reflects you now. 💛', type: 'group', fields: [
        { key: 'abortion', label: 'Views on abortion?', kind: 'single', options: [{value:'choice',label:'Supportive of personal choice'},{value:'certain',label:'Acceptable in certain situations'},{value:'avoid',label:'Prefer to avoid if possible'},{value:'opposed',label:'Opposed — would always give birth'},{value:'undecided',label:'Undecided 🤍'}] },
        { key: 'infertility', label: 'If facing infertility?', kind: 'single', options: [{value:'open_med',label:'Open to treatment / IVF'},{value:'hesitant',label:'Hesitant, need to discuss'},{value:'no_treat',label:'Would not pursue treatment'},{value:'undecided',label:'Undecided 🤍'}] },
        { key: 'childfree', label: 'Childfree life?', kind: 'single', options: [{value:'happy',label:'Could happily choose childfree'},{value:'respect_want',label:'Respect others, but want kids myself'},{value:'hesitant',label:'Hesitant'},{value:'notforme',label:'Not for me'},{value:'undecided',label:'Undecided 🤍'}] },
        { key: 'adoption', label: 'Adoption?', kind: 'single', options: [{value:'enthusiastic',label:'Enthusiastically open ❤️'},{value:'consider',label:'Open to consider'},{value:'hesitant',label:'Hesitant'},{value:'notforme',label:'Not for me'},{value:'undecided',label:'Undecided 🤍'}] } ] },
      { id: 'l19', emoji: '⚖️', svg: 'scales', title: 'Anything legal to be transparent about?', desc: 'Optional. Honesty builds trust — minor things are common. 🤍', type: 'single', options: [
        { value: 'none', label: 'No record ✅' }, { value: 'traffic', label: 'Minor traffic only 🚗' },
        { value: 'minor_resolved', label: 'Past minor offense, resolved' }, { value: 'serious_resolved', label: 'Past serious offense, resolved — can discuss privately' },
        { value: 'current', label: 'Current proceedings — can discuss privately' }, { value: 'private', label: 'Prefer to discuss privately if we match 🤫' }] },
      { id: 'l20', emoji: '📱', svg: 'phone', title: 'Team phone?', desc: 'Just for fun + practical — chargers & photos! 📱', type: 'single', options: [
        { value: 'iphone', label: 'iPhone / Apple 🍎' }, { value: 'samsung', label: 'Samsung' }, { value: 'pixel', label: 'Google Pixel' },
        { value: 'xiaomi', label: 'Xiaomi / Redmi / Poco' }, { value: 'huawei', label: 'Huawei' }, { value: 'oneplus', label: 'OnePlus / Oppo / Vivo' },
        { value: 'other_android', label: 'Other Android 🤖' }, { value: 'graphene', label: 'GrapheneOS / de-Googled 🔒' }, { value: 'simple', label: 'Simple phone / no smartphone 📞' }] },
      { id: 'l21', emoji: '💻', svg: 'laptop', title: 'Computers?', desc: 'Last one of this section! What do you use & how geeky? 💻', type: 'group', fields: [
        { key: 'os', label: 'OS you use most?', kind: 'single', options: [{value:'windows',label:'Windows 🪟'},{value:'macos',label:'macOS 🍎'},{value:'linux',label:'Linux 🐧'},{value:'chromeos',label:'ChromeOS 🌐'},{value:'multi',label:'Multiple / flexible 🔀'},{value:'barely',label:'I barely use a computer 😌'}] },
        { key: 'level', label: 'Experience?', kind: 'single', options: [{value:'beginner',label:'Beginner 🌱'},{value:'everyday',label:'Comfortable everyday user 🙂'},{value:'advanced',label:'Advanced / power user ⚡'},{value:'pro',label:'IT pro / developer 👩‍💻'},{value:'want_learn',label:'Want to learn more! 📚'}] } ] },
    ]
  },
  {
    id: 'beliefs', emoji: '🌟', title: 'Beliefs & education',
    intro: 'Worldview, studies & values — almost done! 🎓',
    questions: [
      { id: 'e1', emoji: '🌱', svg: 'sprout', title: 'Your beliefs and background', desc: 'Different journeys — no right or wrong! ✨ Beliefs now vs. growing up, family traditions, and science. 🧬', type: 'group', fields: [
        { key: 'present', label: 'Your beliefs right now?', kind: 'single', options: [{value:'atheist',label:'No religious belief / Atheist'},{value:'agnostic',label:'Agnostic / exploring'},{value:'spiritual',label:'Spiritual, not tied to religion'},{value:'science',label:'Science-based worldview 🧬'},{value:'christian',label:'Christian ✝️'},{value:'muslim',label:'Muslim ☪️'},{value:'jewish',label:'Jewish ✡️'},{value:'hindu',label:'Hindu 🕉️'},{value:'buddhist',label:'Buddhist ☸️'},{value:'other',label:'Other ✍️'}] },
        { key: 'present_detail', label: 'Describe (only if you picked “other”):', kind: 'text', placeholder: 'Write here…', showIf: { key: 'present', value: 'other' } },
        { key: 'past', label: 'Growing up / in the past?', kind: 'single', options: [{value:'same',label:'Same as now'},{value:'more',label:'More religious than now'},{value:'less',label:'Less religious than now'},{value:'different',label:'Different religion than now'},{value:'none',label:'No religious upbringing'}] },
        { key: 'practice', label: 'Practice today?', kind: 'single', options: [{value:'regular',label:'Services / gatherings regularly 🛕'},{value:'holidays',label:'Only holidays / special occasions 🎉'},{value:'cultural',label:'Cultural holidays only 🏮'},{value:'none',label:'Not practicing 🌿'}] },
        { key: 'parents', label: 'Parents’ practice growing up?', kind: 'single', options: [{value:'very',label:'Very observant / active'},{value:'somewhat',label:'Somewhat / occasional'},{value:'cultural',label:'Cultural / holidays only'},{value:'not',label:'Not observant 🌿'},{value:'mixed',label:'Mixed — parents differed'},{value:'dontknow',label:'Don’t know 🤷'}] },
        { key: 'grandparents', label: 'Grandparents’ practice?', kind: 'single', options: [{value:'very',label:'Very observant / active'},{value:'somewhat',label:'Somewhat / occasional'},{value:'cultural',label:'Cultural / holidays only'},{value:'not',label:'Not observant 🌿'},{value:'mixed',label:'Mixed across family'},{value:'dontknow',label:'Don’t know 🤷'}] } ] },
      { id: 'e2', emoji: '🎓', svg: 'cap', title: 'Your education journey', desc: 'All paths valued — vocational, self-taught & academic! 💛', type: 'group', fields: [
        { key: 'highest', label: 'Highest completed?', kind: 'single', options: [{value:'highschool_some',label:'Some high school'},{value:'highschool',label:'High school 📜'},{value:'vocational',label:'Vocational / trade 🛠️'},{value:'associate',label:'Some college / associate'},{value:'bachelor',label:'Bachelor’s 🎓'},{value:'master',label:'Master’s 📚'},{value:'phd',label:'Doctorate / PhD / MD / JD 👩‍⚕️'},{value:'selftaught',label:'Self-taught / alternative 🌱'}] },
        { key: 'major', label: 'Major / field / trade?', kind: 'text', placeholder: 'Field of study…' } ] },
      { id: 'e3', emoji: '🧭', svg: 'compass', title: 'Your values snapshot', desc: 'Curious about your political values style? Take this fun 5-min quiz 👉 https://8values.github.io — then paste the results link AND the 4 scores below (required: link or all 4 scores). Screenshot is optional here — you can attach the PDF screenshot in the contact step at the end! No judgment. 💬', type: 'group', fields: [
        { key: 'link', label: 'Results link (optional)', kind: 'text', placeholder: 'https://…' },
        { key: 'equality', label: 'Equality ↔ Markets (0–100)', kind: 'number', placeholder: '0–100' },
        { key: 'nation', label: 'Nation ↔ Globe (0–100)', kind: 'number', placeholder: '0–100' },
        { key: 'liberty', label: 'Liberty ↔ Authority (0–100)', kind: 'number', placeholder: '0–100' },
        { key: 'tradition', label: 'Tradition ↔ Progress (0–100)', kind: 'number', placeholder: '0–100' },
        { key: 'upload', label: 'Screenshot upload (optional — use contact file step later if needed)', kind: 'text', placeholder: 'Optional note…' } ] },
      { id: 'e4', emoji: '🗳️', svg: 'ballot', title: 'Voting & civic life', desc: 'Not who you vote for — just whether you like to take part! 😊', type: 'single', options: [
        { value: 'always', label: 'Always — every time 🗳️' }, { value: 'usually', label: 'Usually — most elections' },
        { value: 'sometimes', label: 'Sometimes ⏰' }, { value: 'rarely', label: 'I don’t usually vote' },
        { value: 'ineligible', label: 'Not eligible where I live' }, { value: 'future', label: 'Future voter — plan to start 🌱' }] },
      { id: 'e5', emoji: '💛', svg: 'heart', title: 'Anything you want to tell Tomi about yourself?', desc: 'Last one! Anything at all — in your own words, up to 100 words. ✏️✨', type: 'textarea', placeholder: 'Write here…', maxWords: 100 },
    ]
  }
];
const TOTAL_QS = SECTIONS.reduce((n, s) => n + s.questions.length, 0);
