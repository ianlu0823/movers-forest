import React, { useState, useEffect, useRef, useMemo } from "react";

/* ================== 本機儲存（localStorage 包裝，保留原本的 async 介面） ================== */
const appStorage = {
  async get(key) {
    const v = localStorage.getItem(key);
    return v == null ? null : { value: v };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
  },
};


/* ================== 劍橋英檢 A1 Movers 單字庫（含 Starters 累積內容詞） ================== */
const VOCAB = {
  "動物": [
    ["animal","動物"],["bat","蝙蝠"],["bear","熊"],["bee","蜜蜂"],
    ["bird","鳥"],["cage","籠子"],["cat","貓"],["chicken","雞"],
    ["cow","乳牛"],["crocodile","鱷魚"],["dog","狗"],["dolphin","海豚"],
    ["donkey","驢子"],["duck","鴨子"],["elephant","大象"],["fish","魚"],
    ["frog","青蛙"],["giraffe","長頸鹿"],["goat","山羊"],["hippo","河馬"],
    ["horse","馬"],["jellyfish","水母"],["kangaroo","袋鼠"],["kitten","小貓"],
    ["lion","獅子"],["lizard","蜥蜴"],["monkey","猴子"],["mouse","老鼠／滑鼠"],
    ["panda","貓熊"],["parrot","鸚鵡"],["penguin","企鵝"],["pet","寵物"],
    ["polar bear","北極熊"],["puppy","小狗"],["rabbit","兔子"],["shark","鯊魚"],
    ["sheep","綿羊"],["snail","蝸牛"],["snake","蛇"],["spider","蜘蛛"],
    ["tail","尾巴"],["tiger","老虎"],["whale","鯨魚"],["zebra","斑馬"],
  ],
  "食物與飲料": [
    ["apple","蘋果"],["banana","香蕉"],["bean","豆子"],["biscuit","餅乾"],
    ["bottle","瓶子"],["bowl","碗"],["bread","麵包"],["breakfast","早餐"],
    ["burger","漢堡"],["cake","蛋糕"],["candy","糖果"],["carrot","紅蘿蔔"],
    ["cheese","起司"],["chips","薯條"],["chocolate","巧克力"],["coconut","椰子"],
    ["coffee","咖啡"],["cup","杯子"],["dinner","晚餐"],["egg","蛋"],
    ["food","食物"],["fruit","水果"],["glass","玻璃杯"],["grape","葡萄"],
    ["ice cream","冰淇淋"],["juice","果汁"],["kiwi","奇異果"],["lemon","檸檬"],
    ["lemonade","檸檬汽水"],["lime","萊姆"],["lunch","午餐"],["mango","芒果"],
    ["meat","肉"],["meatballs","肉丸"],["milk","牛奶"],["milkshake","奶昔"],
    ["noodles","麵條"],["onion","洋蔥"],["orange","柳橙／橘色"],["pancake","鬆餅"],
    ["pasta","義大利麵"],["pea","豌豆"],["pear","梨子"],["picnic","野餐"],
    ["pie","派"],["pineapple","鳳梨"],["plate","盤子"],["potato","馬鈴薯"],
    ["rice","米飯"],["salad","沙拉"],["sandwich","三明治"],["sauce","醬汁"],
    ["sausage","香腸"],["soup","湯"],["tea","茶"],["tomato","番茄"],
    ["vegetable","蔬菜"],["water","水"],["watermelon","西瓜"],
  ],
  "身體與外表": [
    ["arm","手臂"],["back","背部"],["beard","鬍子"],["body","身體"],
    ["ear","耳朵"],["eye","眼睛"],["face","臉"],["foot","腳"],
    ["hair","頭髮"],["hand","手"],["head","頭"],["leg","腿"],
    ["mouth","嘴巴"],["moustache","八字鬍"],["neck","脖子"],["nose","鼻子"],
    ["shoulder","肩膀"],["smile","微笑"],["stomach","肚子"],["tooth","牙齒"],
  ],
  "衣物與配件": [
    ["bag","包包"],["baseball cap","棒球帽"],["boots","靴子"],["clothes","衣服"],
    ["coat","外套"],["dress","洋裝"],["glasses","眼鏡"],["handbag","手提包"],
    ["hat","帽子"],["helmet","安全帽"],["jacket","夾克"],["jeans","牛仔褲"],
    ["scarf","圍巾"],["shirt","襯衫"],["shoe","鞋子"],["shorts","短褲"],
    ["skirt","裙子"],["sock","襪子"],["sweater","毛衣"],["swimsuit","泳衣"],
    ["trousers","長褲"],["T-shirt","T恤"],
  ],
  "居家": [
    ["address","地址"],["apartment","公寓"],["armchair","扶手椅"],["balcony","陽台"],
    ["basement","地下室"],["bath","浴缸"],["bathroom","浴室"],["bed","床"],
    ["bedroom","臥室"],["blanket","毯子"],["bookcase","書櫃"],["box","箱子"],
    ["chair","椅子"],["clock","時鐘"],["cupboard","櫥櫃"],["desk","書桌"],
    ["dining room","飯廳"],["door","門"],["downstairs","樓下"],["elevator","電梯"],
    ["floor","地板"],["fridge","冰箱"],["garden","花園"],["hall","走廊"],
    ["home","家"],["house","房子"],["key","鑰匙"],["kitchen","廚房"],
    ["lamp","檯燈"],["living room","客廳"],["mat","墊子"],["mirror","鏡子"],
    ["picture","圖畫"],["roof","屋頂"],["room","房間"],["rug","小地毯"],
    ["seat","座位"],["shelf","架子"],["shower","淋浴"],["sofa","沙發"],
    ["stairs","樓梯"],["toothbrush","牙刷"],["toothpaste","牙膏"],["towel","毛巾"],
    ["upstairs","樓上"],["wall","牆壁"],["washing machine","洗衣機"],["window","窗戶"],
  ],
  "學校與文具": [
    ["alphabet","字母表"],["answer","答案"],["board","白板／黑板"],["book","書"],
    ["class","班級"],["classroom","教室"],["crayon","蠟筆"],["dictionary","字典"],
    ["English","英文"],["eraser","橡皮擦"],["homework","功課"],["lesson","課程"],
    ["letter","字母／信件"],["mistake","錯誤"],["music","音樂"],["page","頁"],
    ["paper","紙"],["pen","原子筆"],["pencil","鉛筆"],["question","問題"],
    ["ruler","尺"],["school","學校"],["sentence","句子"],["story","故事"],
    ["student","學生"],["test","考試"],["word","單字"],
  ],
  "3C與科技": [
    ["app","應用程式"],["camera","相機"],["computer","電腦"],["e-book","電子書"],
    ["email","電子郵件"],["internet","網路"],["keyboard","鍵盤"],["laptop","筆記型電腦"],
    ["phone","電話／手機"],["radio","收音機"],["screen","螢幕"],["tablet","平板電腦"],
    ["TV","電視"],["video","影片"],["website","網站"],
  ],
  "地點與建築": [
    ["bank","銀行"],["beach","海灘"],["bookshop","書店"],["bus station","公車站"],
    ["café","咖啡廳"],["car park","停車場"],["castle","城堡"],["cinema","電影院"],
    ["circus","馬戲團"],["city","城市"],["farm","農場"],["funfair","遊樂園"],
    ["hospital","醫院"],["library","圖書館"],["market","市場"],["park","公園"],
    ["place","地方"],["playground","遊樂場"],["shop","商店"],["shopping centre","購物中心"],
    ["sports centre","運動中心"],["square","廣場"],["station","車站"],["street","街道"],
    ["supermarket","超級市場"],["swimming pool","游泳池"],["town","城鎮"],["village","村莊"],
    ["zoo","動物園"],
  ],
  "大自然": [
    ["cave","洞穴"],["cloud","雲"],["countryside","鄉村"],["field","田野"],
    ["flower","花"],["forest","森林"],["grass","草地"],["ground","地面"],
    ["island","島嶼"],["lake","湖泊"],["leaf","葉子"],["moon","月亮"],
    ["mountain","高山"],["plant","植物"],["rainbow","彩虹"],["river","河流"],
    ["road","馬路"],["rock","岩石"],["sand","沙子"],["sea","海洋"],
    ["shell","貝殼"],["sky","天空"],["star","星星"],["sun","太陽"],
    ["tree","樹"],["waterfall","瀑布"],["world","世界"],
  ],
  "天氣": [
    ["cloudy","多雲的"],["cold","寒冷的／感冒"],["hot","炎熱的"],["ice","冰"],
    ["rain","下雨"],["snow","下雪"],["sunny","晴朗的"],["warm","溫暖的"],
    ["weather","天氣"],["wet","濕的"],["wind","風"],["windy","有風的"],
  ],
  "運動休閒與玩具": [
    ["badminton","羽毛球"],["ball","球"],["balloon","氣球"],["baseball","棒球"],
    ["basketball","籃球"],["bike","腳踏車"],["board game","桌遊"],["comic","漫畫"],
    ["dance","跳舞"],["doll","娃娃"],["film","電影"],["fishing","釣魚"],
    ["football","足球"],["game","遊戲"],["guitar","吉他"],["hobby","嗜好"],
    ["hockey","曲棍球"],["holiday","假期"],["ice skates","溜冰鞋"],["kick","踢"],
    ["kite","風箏"],["money","錢"],["monster","怪獸"],["party","派對"],
    ["piano","鋼琴"],["present","禮物"],["ride","騎"],["robot","機器人"],
    ["sail","航行"],["skate","溜冰"],["skateboard","滑板"],["skip","跳繩"],
    ["song","歌曲"],["sport","運動"],["swim","游泳"],["table tennis","桌球"],
    ["teddy bear","泰迪熊"],["tennis","網球"],["toy","玩具"],["umbrella","雨傘"],
  ],
  "交通": [
    ["boat","小船"],["bus","公車"],["bus stop","公車站牌"],["car","汽車"],
    ["helicopter","直升機"],["motorcycle","摩托車"],["plane","飛機"],["ship","大船"],
    ["taxi","計程車"],["ticket","車票"],["train","火車"],["trip","旅行"],
    ["truck","卡車"],
  ],
  "時間與日期": [
    ["afternoon","下午"],["birthday","生日"],["date","日期"],["day","一天／白天"],
    ["evening","傍晚"],["morning","早上"],["night","晚上"],["o'clock","…點鐘"],
    ["today","今天"],["tomorrow","明天"],["week","星期"],["weekend","週末"],
    ["year","年"],["yesterday","昨天"],["Monday","星期一"],["Tuesday","星期二"],
    ["Wednesday","星期三"],["Thursday","星期四"],["Friday","星期五"],["Saturday","星期六"],
    ["Sunday","星期日"],
  ],
  "家人與朋友": [
    ["aunt","阿姨"],["baby","嬰兒"],["boy","男孩"],["brother","兄弟"],
    ["child","小孩"],["cousin","表兄弟姊妹"],["dad","爸爸"],["daughter","女兒"],
    ["family","家庭"],["father","父親"],["friend","朋友"],["girl","女孩"],
    ["granddaughter","孫女"],["grandfather","爺爺"],["grandmother","奶奶"],["grandparent","祖父母"],
    ["grandson","孫子"],["man","男人"],["mother","母親"],["mum","媽媽"],
    ["parent","父母"],["people","人們"],["person","人"],["sister","姊妹"],
    ["son","兒子"],["uncle","叔叔"],["woman","女人"],
  ],
  "健康": [
    ["cough","咳嗽"],["headache","頭痛"],["hurt","受傷／弄痛"],["ill","生病的"],
    ["medicine","藥"],["stomach-ache","肚子痛"],["temperature","體溫"],["toothache","牙痛"],
  ],
  "職業": [
    ["clown","小丑"],["cook","廚師／煮飯"],["dentist","牙醫"],["doctor","醫生"],
    ["driver","司機"],["farmer","農夫"],["film star","電影明星"],["nurse","護理師"],
    ["pirate","海盜"],["police officer","警察"],["pop star","流行歌手"],["teacher","老師"],
    ["work","工作"],
  ],
  "動作動詞": [
    ["ask","問"],["bounce","拍（球）"],["bring","帶來"],["brush","刷"],
    ["buy","買"],["call","打電話"],["carry","搬運"],["catch","接住"],
    ["clap","拍手"],["climb","爬"],["close","關上"],["come","來"],
    ["count","數數"],["cry","哭"],["draw","畫畫"],["drink","喝／飲料"],
    ["drive","開車"],["drop","掉落"],["eat","吃"],["fall","跌倒"],
    ["find","找到"],["fly","飛／蒼蠅"],["get","得到"],["give","給"],
    ["go","去"],["grow","生長"],["have","擁有"],["help","幫助"],
    ["hit","打"],["hold","拿著"],["hop","單腳跳"],["jump","跳躍"],
    ["laugh","大笑"],["learn","學習"],["like","喜歡"],["listen","聽"],
    ["live","住"],["look","看"],["love","愛"],["make","製作"],
    ["move","移動"],["need","需要"],["open","打開"],["paint","塗顏料／油漆"],
    ["pick up","撿起來"],["point","指"],["put","放"],["read","閱讀"],
    ["run","跑"],["say","說"],["sell","賣"],["shout","大叫"],
    ["sing","唱歌"],["sit","坐"],["sleep","睡覺"],["spell","拼字"],
    ["stand","站"],["start","開始"],["stop","停止"],["take","拿走"],
    ["talk","說話"],["teach","教"],["tell","告訴"],["think","思考"],
    ["throw","丟"],["wake up","醒來"],["walk","走路"],["want","想要"],
    ["wash","洗"],["watch","觀看／手錶"],["wear","穿戴"],["write","寫"],
  ],
  "形容詞": [
    ["afraid","害怕的"],["angry","生氣的"],["bad","壞的"],["beautiful","美麗的"],
    ["big","大的"],["blond","金髮的"],["boring","無聊的"],["busy","忙碌的"],
    ["careful","小心的"],["clean","乾淨的／打掃"],["clever","聰明的"],["curly","捲捲的"],
    ["difficult","困難的"],["dirty","髒的"],["dry","乾的"],["easy","簡單的"],
    ["exciting","刺激的"],["famous","有名的"],["fast","很快的"],["fat","胖的"],
    ["favourite","最喜歡的"],["fine","不錯的"],["funny","好笑的"],["good","好的"],
    ["great","很棒的"],["happy","快樂的"],["hungry","餓的"],["little","小小的"],
    ["long","長的"],["loud","大聲的"],["lovely","可愛的"],["naughty","頑皮的"],
    ["new","新的"],["nice","親切的"],["old","舊的／老的"],["pretty","漂亮的"],
    ["quick","快的"],["quiet","安靜的"],["right","正確的"],["sad","難過的"],
    ["short","短的／矮的"],["slow","慢的"],["small","小的"],["straight","直的"],
    ["strong","強壯的"],["tall","高的"],["terrible","糟糕的"],["thin","瘦的"],
    ["thirsty","口渴的"],["tired","累的"],["ugly","醜的"],["well","健康的"],
    ["wrong","錯誤的"],["young","年輕的"],
  ],
  "顏色": [
    ["black","黑色"],["blue","藍色"],["brown","棕色"],["colour","顏色"],
    ["green","綠色"],["grey","灰色"],["pink","粉紅色"],["purple","紫色"],
    ["red","紅色"],["white","白色"],["yellow","黃色"],
  ],
  "數字": [
    ["one","一"],["two","二"],["three","三"],["four","四"],
    ["five","五"],["six","六"],["seven","七"],["eight","八"],
    ["nine","九"],["ten","十"],["eleven","十一"],["twelve","十二"],
    ["thirteen","十三"],["fourteen","十四"],["fifteen","十五"],["sixteen","十六"],
    ["seventeen","十七"],["eighteen","十八"],["nineteen","十九"],["twenty","二十"],
    ["thirty","三十"],["forty","四十"],["fifty","五十"],["hundred","一百"],
  ],
  "方位詞": [
    ["above","在…上方"],["behind","在…後面"],["between","在…中間"],["down","向下"],
    ["here","這裡"],["in front of","在…前面"],["inside","在…裡面"],["near","在…附近"],
    ["next to","在…旁邊"],["outside","在…外面"],["there","那裡"],["under","在…下面"],
    ["up","向上"],
  ],
  "疑問詞": [
    ["what","什麼"],["where","哪裡"],["who","誰"],["whose","誰的"],
    ["when","什麼時候"],["why","為什麼"],["how","怎麼／如何"],["how many","多少個"],
    ["how much","多少錢"],["how old","幾歲"],
  ],
};
const CATEGORIES = Object.keys(VOCAB);
const ALL_WORDS = CATEGORIES.flatMap(c => VOCAB[c].map(([en, zh]) => ({ en, zh, cat: c })));

/* ================== 遊戲設定 ================== */
const ROUND_SIZE = 10;     // 每回合題數
const GROW_COST = 3;       // 樹木成長一階所需能量
const MAX_STAGE = 3;       // 種子 → 幼苗 → 小樹 → 大樹
const STORAGE_KEY = "movers-forest-v1";

// 12 塊土地的位置（x, y, 縮放）
const PLOTS_POS = [
  [55,148,0.62],[135,140,0.6],[215,138,0.58],[295,143,0.6],[358,150,0.62],
  [92,180,0.8],[308,182,0.8],
  [48,214,1.0],[125,222,1.05],[200,216,1.0],[275,224,1.05],[348,215,1.0],
];

/* ================== 小工具 ================== */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const lerpColor = (c1, c2, t) => {
  const p = (c) => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)];
  const [r1,g1,b1] = p(c1), [r2,g2,b2] = p(c2);
  const f = (a,b) => Math.round(a + (b-a) * t);
  return `rgb(${f(r1,r2)},${f(g1,g2)},${f(b1,b2)})`;
};

/* ================== 音效（Web Audio） ================== */
let audioCtx = null;
const playTone = (freqs, dur = 0.12, type = "sine", gain = 0.15) => {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(gain, audioCtx.currentTime + i * dur);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (i + 1) * dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(audioCtx.currentTime + i * dur);
      o.stop(audioCtx.currentTime + (i + 1) * dur + 0.02);
    });
  } catch (e) {}
};
const sfxCorrect = () => playTone([523, 659, 784], 0.1);
const sfxWrong   = () => playTone([196, 165], 0.16, "square", 0.08);
const sfxGrow    = () => playTone([392, 523, 659, 1047], 0.09, "triangle", 0.14);

/* ================== 英文發音（Web Speech API） ================== */
let PREFERRED_VOICE_NAME = "";

const getEnglishVoices = () => {
  try {
    return (window.speechSynthesis?.getVoices() || [])
      .filter(v => v.lang && v.lang.toLowerCase().startsWith("en"));
  } catch (e) { return []; }
};

// 自動挑選最自然、最不嚇人的聲音
const scoreVoice = (v) => {
  const n = v.name.toLowerCase();
  let sc = 0;
  if (n.includes("google")) sc += 50;                       // Chrome 的 Google 語音通常最自然
  if (n.includes("natural") || n.includes("online")) sc += 45; // Windows 的 Natural 系列
  if (["samantha","karen","daniel","moira","tessa","aria","jenny",
       "ana","zira","allison","ava","susan","emma","libby","sonia"]
      .some(k => n.includes(k))) sc += 30;                  // 各平台高品質人聲
  if (v.lang.toLowerCase() === "en-us") sc += 15;
  else if (v.lang.toLowerCase() === "en-gb") sc += 10;
  if (n.includes("compact")) sc -= 40;                      // compact 版音質差
  // macOS 的特效／機器音（會嚇到小朋友），大幅扣分
  if (["eloquence","fred","albert","zarvox","bad news","good news","whisper",
       "trinoids","cellos","boing","bells","bubbles","deranged","hysterical",
       "jester","organ","superstar","wobble","grandma","grandpa","rocko","shelley"]
      .some(k => n.includes(k))) sc -= 200;
  return sc;
};

const pickDefaultVoice = (voices) =>
  [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;

const speak = (text) => {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.8;      // 講慢一點
    u.pitch = 1.05;    // 音調微高，比較親切
    u.volume = 1;
    const voices = getEnglishVoices();
    const chosen = voices.find(v => v.name === PREFERRED_VOICE_NAME) || pickDefaultVoice(voices);
    if (chosen) { u.voice = chosen; u.lang = chosen.lang; }
    else u.lang = "en-US";
    window.speechSynthesis.speak(u);
  } catch (e) {}
};

/* 發音按鈕 */
function SpeakButton({ word, size = "md" }) {
  const [playing, setPlaying] = useState(false);
  const cls = size === "lg"
    ? "w-11 h-11 text-xl"
    : "w-8 h-8 text-sm";
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        speak(word);
        setPlaying(true);
        setTimeout(() => setPlaying(false), 700);
      }}
      className={`${cls} rounded-full inline-flex items-center justify-center align-middle active:scale-90 transition-transform`}
      style={{
        background: playing ? "#FFE9A8" : "#FFF3CC",
        border: "2px solid #F0C64A",
      }}
      aria-label={`播放 ${word} 的發音`}>
      🔊
    </button>
  );
}

/* ================== 樹木繪製 ================== */
function Tree({ stage, type, scale, justGrew }) {
  const style = justGrew ? {
    animation: "treePop 0.5s ease-out",
    transformBox: "fill-box",
    transformOrigin: "50% 100%",
  } : {};
  const trunk = "#8B5E3C";
  const greens = ["#4E9B47", "#3E8E5A", "#5CA648"];
  const g = greens[type];

  if (stage === 0) return (
    <g style={style}>
      <ellipse cx="0" cy="0" rx={10*scale} ry={4*scale} fill="#9C7A50" />
      <ellipse cx="0" cy={-1.5*scale} rx={6*scale} ry={2.5*scale} fill="#B08D5F" />
    </g>
  );
  if (stage === 1) return (
    <g style={style}>
      <ellipse cx="0" cy="0" rx={9*scale} ry={3.5*scale} fill="#8F7048" />
      <path d={`M0 0 L0 ${-12*scale}`} stroke="#6FA84F" strokeWidth={2.4*scale} strokeLinecap="round" />
      <ellipse cx={-4.5*scale} cy={-13*scale} rx={5*scale} ry={3*scale} fill={g} transform={`rotate(-30 ${-4.5*scale} ${-13*scale})`} />
      <ellipse cx={4.5*scale} cy={-13*scale} rx={5*scale} ry={3*scale} fill={g} transform={`rotate(30 ${4.5*scale} ${-13*scale})`} />
    </g>
  );
  if (stage === 2) return (
    <g style={style}>
      <rect x={-2*scale} y={-18*scale} width={4*scale} height={18*scale} rx={2*scale} fill={trunk} />
      {type === 1 ? (
        <path d={`M0 ${-42*scale} L${13*scale} ${-14*scale} L${-13*scale} ${-14*scale} Z`} fill={g} />
      ) : (
        <circle cx="0" cy={-27*scale} r={13*scale} fill={g} />
      )}
    </g>
  );
  // stage 3：大樹
  return (
    <g style={style}>
      <rect x={-3.2*scale} y={-26*scale} width={6.4*scale} height={26*scale} rx={3*scale} fill={trunk} />
      {type === 0 && (<>
        <circle cx={-11*scale} cy={-32*scale} r={13*scale} fill={g} />
        <circle cx={11*scale} cy={-32*scale} r={13*scale} fill={g} />
        <circle cx="0" cy={-44*scale} r={15*scale} fill="#57A84F" />
        <circle cx={-6*scale} cy={-48*scale} r={2.4*scale} fill="#C9F2A6" opacity="0.85" />
      </>)}
      {type === 1 && (<>
        <path d={`M0 ${-62*scale} L${15*scale} ${-36*scale} L${-15*scale} ${-36*scale} Z`} fill="#357B50" />
        <path d={`M0 ${-50*scale} L${19*scale} ${-20*scale} L${-19*scale} ${-20*scale} Z`} fill={g} />
      </>)}
      {type === 2 && (<>
        <circle cx="0" cy={-40*scale} r={17*scale} fill={g} />
        <circle cx={-6*scale} cy={-36*scale} r={3*scale} fill="#E85D5D" />
        <circle cx={7*scale} cy={-45*scale} r={3*scale} fill="#E85D5D" />
        <circle cx={2*scale} cy={-32*scale} r={3*scale} fill="#E85D5D" />
      </>)}
    </g>
  );
}

/* ================== 森林場景 ================== */
function ForestScene({ plots, energy, progress, onGrow, grewIdx }) {
  const sky = lerpColor("#DCC9A8", "#A5DEF5", progress);
  const hillBack = lerpColor("#C6A87C", "#8FCC7A", progress);
  const hillFront = lerpColor("#AB8354", "#63B04E", progress);
  const sunColor = lerpColor("#E8C98A", "#FFD24D", progress);

  const flowers = useMemo(() => (
    [[75,235],[160,242],[240,238],[315,244],[110,196],[290,198],[30,230],[370,238]]
  ), []);

  return (
    <svg viewBox="0 0 400 260" className="w-full block select-none" style={{ borderRadius: "20px" }}>
      <defs>
        <clipPath id="scene"><rect x="0" y="0" width="400" height="260" rx="20" /></clipPath>
      </defs>
      <g clipPath="url(#scene)">
        {/* 天空 */}
        <rect width="400" height="260" fill={sky} />
        {/* 太陽 */}
        <circle cx="340" cy="42" r="20" fill={sunColor} />
        <circle cx="340" cy="42" r="27" fill={sunColor} opacity="0.25" />
        {/* 雲 */}
        <g fill="#FFFFFF" opacity={0.5 + progress * 0.4}>
          <ellipse cx="80" cy="45" rx="26" ry="10" />
          <ellipse cx="100" cy="40" rx="18" ry="8" />
          <ellipse cx="210" cy="65" rx="22" ry="8" />
        </g>
        {/* 彩虹（85% 出現） */}
        {progress > 0.85 && (
          <g opacity="0.6" fill="none" strokeWidth="5">
            <path d="M110 130 A 95 95 0 0 1 300 130" stroke="#FF8A8A" />
            <path d="M118 130 A 87 87 0 0 1 292 130" stroke="#FFD37F" />
            <path d="M126 130 A 79 79 0 0 1 284 130" stroke="#9BE38B" />
            <path d="M134 130 A 71 71 0 0 1 276 130" stroke="#8FC7F5" />
          </g>
        )}
        {/* 山丘 */}
        <path d="M0 160 Q 100 118 200 148 T 400 150 L400 260 L0 260 Z" fill={hillBack} />
        <path d="M0 205 Q 120 168 230 196 T 400 198 L400 260 L0 260 Z" fill={hillFront} />
        {/* 龜裂的土地（隨進度淡出） */}
        <g stroke="#7A5636" strokeWidth="1.4" opacity={Math.max(0, 0.55 - progress)} fill="none" strokeLinecap="round">
          <path d="M40 235 l14 -8 l12 9 M54 227 l3 -12" />
          <path d="M150 246 l16 -7 l10 8 M166 239 l5 -11" />
          <path d="M255 240 l13 -9 l14 7 M268 231 l2 -10" />
          <path d="M340 248 l12 -8 l11 6" />
          <path d="M100 200 l10 -6 l9 7" />
          <path d="M300 205 l11 -7 l8 6" />
        </g>
        {/* 小花（30% 出現） */}
        {progress > 0.3 && flowers.map(([fx, fy], i) => (
          <g key={i} transform={`translate(${fx} ${fy})`} opacity={Math.min(1, (progress - 0.3) * 3)}>
            <line x1="0" y1="0" x2="0" y2="-5" stroke="#4E8F3E" strokeWidth="1.2" />
            <circle cx="0" cy="-7" r="2.6" fill={i % 2 ? "#FF9DBB" : "#FFD24D"} />
            <circle cx="0" cy="-7" r="1" fill="#FFF6E0" />
          </g>
        ))}
        {/* 小鳥（60% 出現） */}
        {progress > 0.6 && (
          <g stroke="#5A4632" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8">
            <path d="M120 78 q5 -6 10 0 q5 -6 10 0" />
            <path d="M165 60 q4 -5 8 0 q4 -5 8 0" />
            <path d="M60 95 q4 -5 8 0 q4 -5 8 0" />
          </g>
        )}
        {/* 樹木土地 */}
        {plots.map((p, i) => {
          const [x, y, s] = PLOTS_POS[i];
          const canGrow = p.stage < MAX_STAGE && energy >= GROW_COST;
          return (
            <g key={i} transform={`translate(${x} ${y})`}
               onClick={() => onGrow(i)}
               style={{ cursor: p.stage < MAX_STAGE ? "pointer" : "default" }}>
              {/* 點擊範圍 */}
              <rect x={-22*s} y={-70*s} width={44*s} height={80*s} fill="transparent" />
              <Tree stage={p.stage} type={p.type} scale={s} justGrew={grewIdx === i} />
              {/* 可成長提示 */}
              {canGrow && (
                <g transform={`translate(0 ${-(p.stage === 0 ? 14 : p.stage * 24 + 14) * s})`}>
                  <circle r={7*s} fill="#FFD24D" stroke="#B8860B" strokeWidth="1">
                    <animate attributeName="r" values={`${6.4*s};${7.6*s};${6.4*s}`} dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <text textAnchor="middle" dy={2.6*s} fontSize={7.5*s} fontWeight="700" fill="#6B4E00">⚡</text>
                </g>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ================== 出題 ================== */
/* 加權抽樣：答錯過的單字有更高機率再出現 */
function weightedPick(pool, n, wrongBook) {
  const items = pool.map(w => ({ w, wt: 1 + (wrongBook[w.en] || 0) * 4 }));
  const out = [];
  while (out.length < n && items.length) {
    const total = items.reduce((a, it) => a + it.wt, 0);
    let r = Math.random() * total, idx = 0;
    for (; idx < items.length - 1; idx++) { r -= items[idx].wt; if (r <= 0) break; }
    out.push(items[idx].w);
    items.splice(idx, 1);
  }
  return out;
}

function makeRound(category, wrongBook = {}) {
  const pool = category === "全部" ? ALL_WORDS
    : VOCAB[category].map(([en, zh]) => ({ en, zh, cat: category }));
  const picked = shuffle(weightedPick(pool, ROUND_SIZE, wrongBook));
  return picked.map((w) => {
    const dir = Math.random() < 0.5 ? "en2zh" : "zh2en";
    const sameCat = shuffle(ALL_WORDS.filter(o => o.cat === w.cat && o.en !== w.en));
    const others = shuffle(ALL_WORDS.filter(o => o.cat !== w.cat));
    const distractors = [];
    for (const o of [...sameCat, ...others]) {
      if (distractors.length === 3) break;
      if (o.en === w.en || o.zh === w.zh) continue;
      if (distractors.some(d => d.en === o.en || d.zh === o.zh)) continue;
      distractors.push(o);
    }
    const options = shuffle([w, ...distractors]);
    return {
      prompt: dir === "en2zh" ? w.en : w.zh,
      sub: dir === "en2zh" ? "這個英文單字是什麼意思？" : "這個詞的英文是什麼？",
      options: options.map(o => dir === "en2zh" ? o.zh : o.en),
      answer: options.findIndex(o => o.en === w.en),
      word: w, dir,
    };
  });
}

/* ================== 主程式 ================== */
export default function MoversForest() {
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("forest"); // forest | quiz | result
  const [energy, setEnergy] = useState(0);
  const [plots, setPlots] = useState(PLOTS_POS.map((_, i) => ({ stage: 0, type: i % 3 })));
  const [stats, setStats] = useState({ correct: 0, answered: 0 });
  const [wrongBook, setWrongBook] = useState({});   // { 單字: 複習權重 }
  const [category, setCategory] = useState("全部");
  const [voices, setVoices] = useState([]);
  const [voiceName, setVoiceName] = useState("");
  const [grewIdx, setGrewIdx] = useState(-1);
  const [resetStep, setResetStep] = useState(0);

  // 回合狀態
  const [round, setRound] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState(-1);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bonus, setBonus] = useState(0);
  const lockRef = useRef(false);

  /* ---- 讀取 / 儲存進度 ---- */
  useEffect(() => {
    (async () => {
      try {
        const r = await appStorage.get(STORAGE_KEY);
        if (r?.value) {
          const d = JSON.parse(r.value);
          if (d.plots?.length === PLOTS_POS.length) setPlots(d.plots);
          setEnergy(d.energy ?? 0);
          setStats(d.stats ?? { correct: 0, answered: 0 });
          setWrongBook(d.wrong ?? {});
        }
      } catch (e) { /* 尚無存檔 */ }
      try {
        const v = await appStorage.get(STORAGE_KEY + "-voice");
        if (v?.value) { setVoiceName(v.value); PREFERRED_VOICE_NAME = v.value; }
      } catch (e) { /* 尚未挑選聲音 */ }
      setLoaded(true);
    })();
  }, []);

  /* ---- 載入裝置上的英文語音清單 ---- */
  useEffect(() => {
    const load = () => {
      const all = getEnglishVoices();
      if (!all.length) return;
      // 只保留推薦聲音：有品質標記（Google／Natural／高品質人聲）優先，
      // 若裝置上沒有，退而求其次列出一般正常聲音（怪聲已被扣分排除）
      const good = all.filter(v => scoreVoice(v) >= 25);
      const list = (good.length ? good : all.filter(v => scoreVoice(v) > 0))
        .sort((a, b) => scoreVoice(b) - scoreVoice(a))
        .slice(0, 8);
      setVoices(list);
    };
    load();
    window.speechSynthesis?.addEventListener?.("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", load);
  }, []);

  const handleVoiceChange = (name) => {
    setVoiceName(name);
    PREFERRED_VOICE_NAME = name;
    try { appStorage.set(STORAGE_KEY + "-voice", name); } catch (e) {}
    setTimeout(() => speak("Hello! Apple. Tiger. Rainbow."), 100);
  };

  const save = (e, p, s, w) => {
    try {
      appStorage.set(STORAGE_KEY, JSON.stringify({ energy: e, plots: p, stats: s, wrong: w }));
    } catch (err) {}
  };

  const totalStages = PLOTS_POS.length * MAX_STAGE;
  const doneStages = plots.reduce((a, p) => a + p.stage, 0);
  const progress = doneStages / totalStages;
  const landTitle = progress >= 1 ? "🌈 茂密森林" : progress >= 0.6 ? "🌳 小樹林"
    : progress >= 0.25 ? "🌱 綠芽初現" : "🏜️ 荒涼大地";

  /* ---- 種樹 ---- */
  const handleGrow = (i) => {
    const p = plots[i];
    if (p.stage >= MAX_STAGE) return;
    if (energy < GROW_COST) return;
    const newPlots = plots.map((pl, j) => j === i ? { ...pl, stage: pl.stage + 1 } : pl);
    const newEnergy = energy - GROW_COST;
    setPlots(newPlots); setEnergy(newEnergy);
    setGrewIdx(i); setTimeout(() => setGrewIdx(-1), 550);
    sfxGrow();
    save(newEnergy, newPlots, stats, wrongBook);
  };

  /* ---- 開始回合 ---- */
  const startRound = () => {
    setRound(makeRound(category, wrongBook));
    setQIdx(0); setPicked(-1); setRoundCorrect(0); setStreak(0); setBonus(0);
    lockRef.current = false;
    setScreen("quiz");
  };

  /* ---- 答題 ---- */
  const handlePick = (i) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setPicked(i);
    const q = round[qIdx];
    const isCorrect = i === q.answer;
    let newEnergy = energy, newBonus = bonus, newStreak;
    if (isCorrect) {
      sfxCorrect();
      newStreak = streak + 1;
      newEnergy = energy + 1;
      if (newStreak % 3 === 0) { newEnergy += 1; newBonus = bonus + 1; }
      setRoundCorrect(c => c + 1);
    } else {
      sfxWrong();
      newStreak = 0;
    }
    setStreak(newStreak); setEnergy(newEnergy); setBonus(newBonus);
    const newStats = { correct: stats.correct + (isCorrect ? 1 : 0), answered: stats.answered + 1 };
    setStats(newStats);
    const newWrong = { ...wrongBook };
    if (isCorrect) {
      if (newWrong[q.word.en]) {
        newWrong[q.word.en] -= 1;
        if (newWrong[q.word.en] <= 0) delete newWrong[q.word.en];
      }
    } else {
      newWrong[q.word.en] = Math.min(3, (newWrong[q.word.en] || 0) + 2);
    }
    setWrongBook(newWrong);
    save(newEnergy, plots, newStats, newWrong);

    if (isCorrect) {
      // 答對：短暫停留後自動進下一題
      setTimeout(() => nextQuestion(), 900);
    }
    // 答錯：停留在畫面上，等小朋友按「下一題」
  };

  const nextQuestion = () => {
    if (qIdx + 1 >= round.length) setScreen("result");
    else { setQIdx(qIdx + 1); setPicked(-1); lockRef.current = false; }
  };

  /* ---- 英翻中題目出現時自動唸出單字 ---- */
  useEffect(() => {
    if (screen === "quiz" && round[qIdx]?.dir === "en2zh" && picked === -1) {
      const t = setTimeout(() => speak(round[qIdx].prompt), 350);
      return () => clearTimeout(t);
    }
  }, [screen, qIdx, round]);

  /* ---- 重新開始 ---- */
  const handleReset = () => {
    if (resetStep === 0) { setResetStep(1); setTimeout(() => setResetStep(0), 3000); return; }
    const freshPlots = PLOTS_POS.map((_, i) => ({ stage: 0, type: i % 3 }));
    const freshStats = { correct: 0, answered: 0 };
    setPlots(freshPlots); setEnergy(0); setStats(freshStats); setWrongBook({}); setResetStep(0);
    save(0, freshPlots, freshStats, {});
  };

  if (!loaded) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F3EBDD" }}>
      <div className="text-2xl" style={{ color: "#7A5A3A" }}>🌱 森林載入中…</div>
    </div>
  );

  const q = round[qIdx];

  return (
    <div className="min-h-screen flex justify-center" style={{
      background: "linear-gradient(#F6EFDF, #EDE3CC)",
      fontFamily: "'Baloo 2', 'jf-openhuninn', 'Yuanti TC', 'Microsoft JhengHei', sans-serif",
      color: "#4A3728",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap');
        @keyframes treePop { 0% { transform: scale(0.5); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .fadeUp { animation: fadeUp 0.35s ease-out; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="w-full max-w-xl px-4 py-5">

        {/* ===== 標題列 ===== */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">單字小森林</h1>
            <p className="text-xs opacity-70">劍橋英檢 A1 Movers・背單字，讓森林長大！</p>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-lg shadow-sm"
               style={{ background: "#FFF3CC", border: "2px solid #F0C64A", color: "#8A6400" }}>
            ⚡ {energy}
          </div>
        </div>

        {/* ===== 森林畫面 ===== */}
        {screen === "forest" && (
          <div className="fadeUp">
            <div className="rounded-3xl overflow-hidden shadow-md" style={{ border: "3px solid #C9B89A" }}>
              <ForestScene plots={plots} energy={energy} progress={progress} onGrow={handleGrow} grewIdx={grewIdx} />
            </div>

            {/* 進度 */}
            <div className="mt-3 px-1">
              <div className="flex justify-between items-center text-sm font-bold mb-1">
                <span>{landTitle}</span>
                <span>{doneStages} / {totalStages}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "#E3D6BC" }}>
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg,#8CC63F,#4C9F50)" }} />
              </div>
              <p className="text-xs mt-1.5 opacity-70">
                點一下有 ⚡ 標記的土地，花 {GROW_COST} 能量讓樹木長大一階。答對題目就能賺能量！
              </p>
            </div>

            {/* 主題選擇 */}
            <div className="mt-4">
              <p className="text-sm font-bold mb-1.5">選擇單字主題</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
                {["全部", ...CATEGORIES].map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className="px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors"
                    style={category === c
                      ? { background: "#4C9F50", color: "#fff", border: "2px solid #3B7E3F" }
                      : { background: "#FFFDF6", color: "#6B573D", border: "2px solid #DCCCAC" }}>
                    {c} {c === "全部" ? ALL_WORDS.length : VOCAB[c].length}
                  </button>
                ))}
              </div>
            </div>

            {/* 發音聲音選擇 */}
            {voices.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-bold mb-1.5">發音聲音</p>
                <div className="flex gap-2 items-center">
                  <select value={voiceName}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm font-bold"
                    style={{ background: "#FFFDF6", border: "2px solid #DCCCAC", color: "#6B573D" }}>
                    <option value="">自動挑選（推薦）</option>
                    {voices.map(v => (
                      <option key={v.name} value={v.name}>{v.name}（{v.lang}）</option>
                    ))}
                  </select>
                  <button onClick={() => speak("Hello! Apple. Tiger. Rainbow.")}
                    className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap active:scale-95 transition-transform"
                    style={{ background: "#FFF3CC", border: "2px solid #F0C64A", color: "#8A6400" }}>
                    試聽 🔊
                  </button>
                </div>
                <p className="text-xs mt-1 opacity-60">每台裝置內建的聲音不同，聽起來怪怪的話，換一個小朋友喜歡的吧！</p>
              </div>
            )}

            {/* 開始按鈕 */}
            <button onClick={startRound}
              className="w-full mt-4 py-4 rounded-2xl text-xl font-extrabold text-white shadow-md active:scale-95 transition-transform"
              style={{ background: "linear-gradient(#5BB35F,#41904A)", border: "3px solid #35773D" }}>
              🌟 開始挑戰（{ROUND_SIZE} 題）
            </button>

            {/* 統計與重設 */}
            <div className="flex justify-between items-center mt-3 text-xs opacity-75 px-1">
              <span>
                累計答對 {stats.correct} / {stats.answered} 題
                {Object.keys(wrongBook).length > 0 && `・待複習 ${Object.keys(wrongBook).length} 字 📖`}
              </span>
              <button onClick={handleReset} className="underline">
                {resetStep === 0 ? "重新開始" : "再按一次確認清除！"}
              </button>
            </div>
          </div>
        )}

        {/* ===== 答題畫面 ===== */}
        {screen === "quiz" && q && (
          <div className="fadeUp">
            {/* 進度點 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1.5">
                {round.map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full"
                       style={{ background: i < qIdx ? "#4C9F50" : i === qIdx ? "#F0C64A" : "#DCCCAC" }} />
                ))}
              </div>
              {streak >= 2 && <span className="text-sm font-bold" style={{ color: "#E07B2A" }}>🔥 連對 {streak}</span>}
            </div>

            {/* 題目卡 */}
            <div className="rounded-3xl p-6 text-center shadow-md mb-4"
                 style={{ background: "#FFFDF6", border: "3px solid #DCCCAC" }}>
              <p className="text-xs font-bold opacity-60 mb-1">{q.sub}</p>
              <div className="flex items-center justify-center gap-3">
                <p className="font-extrabold" style={{ fontSize: q.prompt.length > 8 ? "1.7rem" : "2.4rem" }}>
                  {q.prompt}
                </p>
                {q.dir === "en2zh" && <SpeakButton word={q.prompt} size="lg" />}
              </div>
              <p className="text-xs mt-1 opacity-50">主題：{q.word.cat}</p>
            </div>

            {/* 選項 */}
            <div className="grid grid-cols-1 gap-2.5">
              {q.options.map((opt, i) => {
                let bg = "#FFFDF6", border = "#DCCCAC", color = "#4A3728";
                if (picked !== -1) {
                  if (i === q.answer) { bg = "#DDF3D6"; border = "#4C9F50"; color = "#2C6B31"; }
                  else if (i === picked) { bg = "#FBDAD6"; border = "#D9534F"; color = "#A33632"; }
                  else { bg = "#F4EEDF"; border = "#E3D8C0"; color = "#B0A488"; }
                }
                return (
                  <button key={i} onClick={() => handlePick(i)} disabled={picked !== -1}
                    className="py-3.5 px-4 rounded-2xl text-lg font-bold text-left transition-all active:scale-95"
                    style={{ background: bg, border: `3px solid ${border}`, color }}>
                    <span className="inline-block w-7 h-7 rounded-full text-center text-sm mr-2"
                          style={{ background: "#EFE5CE", lineHeight: "1.75rem" }}>
                      {["A","B","C","D"][i]}
                    </span>
                    {opt}
                    {picked !== -1 && i === q.answer && " ✔"}
                    {picked !== -1 && i === picked && i !== q.answer && " ✘"}
                  </button>
                );
              })}
            </div>

            {/* 答錯：停留學習卡，小朋友按「下一題」才繼續 */}
            {picked !== -1 && picked !== q.answer && (
              <div className="mt-4 rounded-2xl p-4 text-center fadeUp"
                   style={{ background: "#FFF6EE", border: "3px solid #F0B58A" }}>
                <p className="text-xs font-bold opacity-60 mb-1">記住這個單字再往前走 💡</p>
                <div className="flex items-center justify-center gap-2.5 mb-1">
                  <span className="text-2xl font-extrabold" style={{ color: "#C05621" }}>{q.word.en}</span>
                  <SpeakButton word={q.word.en} />
                </div>
                <p className="text-lg font-bold mb-3">{q.word.zh}</p>
                <button onClick={nextQuestion}
                  className="w-full py-3 rounded-2xl text-lg font-extrabold text-white active:scale-95 transition-transform"
                  style={{ background: "linear-gradient(#F0A048,#DD8830)", border: "3px solid #C4741F" }}>
                  {qIdx + 1 >= round.length ? "我學會了，看成績 🏁" : "我學會了，下一題 →"}
                </button>
              </div>
            )}
            {picked !== -1 && picked === q.answer && (
              <div className="text-center mt-3 fadeUp flex items-center justify-center gap-2 text-sm font-bold"
                   style={{ color: "#2C6B31" }}>
                <span>答對了！{q.word.en}</span>
                <SpeakButton word={q.word.en} />
                <span>+1 ⚡{streak % 3 === 0 && streak > 0 ? "（連對加碼 +1 ⚡）" : ""}</span>
              </div>
            )}
          </div>
        )}

        {/* ===== 結算畫面 ===== */}
        {screen === "result" && (
          <div className="fadeUp text-center">
            <div className="rounded-3xl p-8 shadow-md" style={{ background: "#FFFDF6", border: "3px solid #DCCCAC" }}>
              <p className="text-5xl mb-2">
                {roundCorrect === ROUND_SIZE ? "🏆" : roundCorrect >= ROUND_SIZE * 0.6 ? "🎉" : "💪"}
              </p>
              <h2 className="text-2xl font-extrabold mb-1">
                {roundCorrect === ROUND_SIZE ? "全部答對，太厲害了！"
                  : roundCorrect >= ROUND_SIZE * 0.6 ? "表現很棒！" : "繼續加油！"}
              </h2>
              <p className="text-lg font-bold mb-4">答對 {roundCorrect} / {ROUND_SIZE} 題</p>
              <div className="inline-block px-5 py-2.5 rounded-2xl text-xl font-extrabold mb-5"
                   style={{ background: "#FFF3CC", border: "2px solid #F0C64A", color: "#8A6400" }}>
                賺到 ⚡ {roundCorrect + bonus} 能量{bonus > 0 && <span className="text-sm">（含連對加碼 {bonus}）</span>}
              </div>
              <div className="grid gap-2.5">
                <button onClick={() => setScreen("forest")}
                  className="py-3.5 rounded-2xl text-lg font-extrabold text-white active:scale-95 transition-transform"
                  style={{ background: "linear-gradient(#5BB35F,#41904A)", border: "3px solid #35773D" }}>
                  🌳 回森林種樹
                </button>
                <button onClick={startRound}
                  className="py-3.5 rounded-2xl text-lg font-extrabold active:scale-95 transition-transform"
                  style={{ background: "#FFFDF6", border: "3px solid #DCCCAC", color: "#6B573D" }}>
                  🔁 再挑戰一回合
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
