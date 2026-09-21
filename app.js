const countries = [
  ['europe', 'Албания', 'al'], ['europe', 'Андорра', 'ad'], ['europe', 'Австрия', 'at'], ['europe', 'Беларусь', 'by'], ['europe', 'Бельгия', 'be'], ['europe', 'Болгария', 'bg'], ['europe', 'Босния и Герцеговина', 'ba'], ['europe', 'Ватикан', 'va'], ['europe', 'Венгрия', 'hu'], ['europe', 'Германия', 'de'], ['europe', 'Греция', 'gr'], ['europe', 'Дания', 'dk'], ['europe', 'Ирландия', 'ie'], ['europe', 'Исландия', 'is'], ['europe', 'Испания', 'es'], ['europe', 'Италия', 'it'], ['europe', 'Кипр', 'cy'], ['europe', 'Латвия', 'lv'], ['europe', 'Литва', 'lt'], ['europe', 'Лихтенштейн', 'li'], ['europe', 'Люксембург', 'lu'], ['europe', 'Мальта', 'mt'], ['europe', 'Молдова', 'md'], ['europe', 'Монако', 'mc'], ['europe', 'Нидерланды', 'nl'], ['europe', 'Норвегия', 'no'], ['europe', 'Польша', 'pl'], ['europe', 'Португалия', 'pt'], ['europe', 'Россия', 'ru'], ['europe', 'Румыния', 'ro'], ['europe', 'Сан-Марино', 'sm'], ['europe', 'Северная Македония', 'mk'], ['europe', 'Сербия', 'rs'], ['europe', 'Словакия', 'sk'], ['europe', 'Словения', 'si'], ['europe', 'Украина', 'ua'], ['europe', 'Финляндия', 'fi'], ['europe', 'Франция', 'fr'], ['europe', 'Хорватия', 'hr'], ['europe', 'Черногория', 'me'], ['europe', 'Чехия', 'cz'], ['europe', 'Швейцария', 'ch'], ['europe', 'Швеция', 'se'], ['europe', 'Эстония', 'ee'],
  ['americas', 'Антигуа и Барбуда', 'ag'], ['americas', 'Аргентина', 'ar'], ['americas', 'Багамы', 'bs'], ['americas', 'Барбадос', 'bb'], ['americas', 'Белиз', 'bz'], ['americas', 'Боливия', 'bo'], ['americas', 'Бразилия', 'br'], ['americas', 'Венесуэла', 've'], ['americas', 'Гайана', 'gy'], ['americas', 'Гаити', 'ht'], ['americas', 'Гватемала', 'gt'], ['americas', 'Гондурас', 'hn'], ['americas', 'Гренада', 'gd'], ['americas', 'Доминика', 'dm'], ['americas', 'Доминиканская Республика', 'do'], ['americas', 'Канада', 'ca'], ['americas', 'Колумбия', 'co'], ['americas', 'Коста-Рика', 'cr'], ['americas', 'Куба', 'cu'], ['americas', 'Мексика', 'mx'], ['americas', 'Никарагуа', 'ni'], ['americas', 'Панама', 'pa'], ['americas', 'Парагвай', 'py'], ['americas', 'Перу', 'pe'], ['americas', 'Сальвадор', 'sv'], ['americas', 'Сент-Винсент и Гренадины', 'vc'], ['americas', 'Сент-Китс и Невис', 'kn'], ['americas', 'Сент-Люсия', 'lc'], ['americas', 'Суринам', 'sr'], ['americas', 'США', 'us'], ['americas', 'Тринидад и Тобаго', 'tt'], ['americas', 'Уругвай', 'uy'], ['americas', 'Чили', 'cl'], ['americas', 'Эквадор', 'ec'], ['americas', 'Ямайка', 'jm'],
  ['asia', 'Азербайджан', 'az'], ['asia', 'Армения', 'am'], ['asia', 'Афганистан', 'af'], ['asia', 'Бангладеш', 'bd'], ['asia', 'Бахрейн', 'bh'], ['asia', 'Бруней', 'bn'], ['asia', 'Бутан', 'bt'], ['asia', 'Вьетнам', 'vn'], ['asia', 'Грузия', 'ge'], ['asia', 'Израиль', 'il'], ['asia', 'Индия', 'in'], ['asia', 'Индонезия', 'id'], ['asia', 'Иордания', 'jo'], ['asia', 'Ирак', 'iq'], ['asia', 'Иран', 'ir'], ['asia', 'Йемен', 'ye'], ['asia', 'Казахстан', 'kz'], ['asia', 'Камбоджа', 'kh'], ['asia', 'Катар', 'qa'], ['asia', 'Киргизия', 'kg'], ['asia', 'Китай', 'cn'], ['asia', 'Кувейт', 'kw'], ['asia', 'Лаос', 'la'], ['asia', 'Ливан', 'lb'], ['asia', 'Малайзия', 'my'], ['asia', 'Мальдивы', 'mv'], ['asia', 'Монголия', 'mn'], ['asia', 'Мьянма', 'mm'], ['asia', 'Непал', 'np'], ['asia', 'ОАЭ', 'ae'], ['asia', 'Оман', 'om'], ['asia', 'Пакистан', 'pk'], ['asia', 'Саудовская Аравия', 'sa'], ['asia', 'Сингапур', 'sg'], ['asia', 'Сирия', 'sy'], ['asia', 'Таджикистан', 'tj'], ['asia', 'Таиланд', 'th'], ['asia', 'Тимор-Лесте', 'tl'], ['asia', 'Туркменистан', 'tm'], ['asia', 'Турция', 'tr'], ['asia', 'Узбекистан', 'uz'], ['asia', 'Филиппины', 'ph'], ['asia', 'Шри-Ланка', 'lk'], ['asia', 'Южная Корея', 'kr'], ['asia', 'Япония', 'jp'],
  ['africa', 'Алжир', 'dz'], ['africa', 'Ангола', 'ao'], ['africa', 'Бенин', 'bj'], ['africa', 'Ботсвана', 'bw'], ['africa', 'Буркина-Фасо', 'bf'], ['africa', 'Бурунди', 'bi'], ['africa', 'Габон', 'ga'], ['africa', 'Гамбия', 'gm'], ['africa', 'Гана', 'gh'], ['africa', 'Гвинея', 'gn'], ['africa', 'Гвинея-Бисау', 'gw'], ['africa', 'Джибути', 'dj'], ['africa', 'Египет', 'eg'], ['africa', 'Замбия', 'zm'], ['africa', 'Зимбабве', 'zw'], ['africa', 'Кабо-Верде', 'cv'], ['africa', 'Камерун', 'cm'], ['africa', 'Кения', 'ke'], ['africa', 'Коморы', 'km'], ['africa', 'Конго', 'cg'], ['africa', 'Демократическая Республика Конго', 'cd'], ['africa', 'Кот-д’Ивуар', 'ci'], ['africa', 'Лесото', 'ls'], ['africa', 'Либерия', 'lr'], ['africa', 'Ливия', 'ly'], ['africa', 'Маврикий', 'mu'], ['africa', 'Мавритания', 'mr'], ['africa', 'Мадагаскар', 'mg'], ['africa', 'Малави', 'mw'], ['africa', 'Мали', 'ml'], ['africa', 'Марокко', 'ma'], ['africa', 'Мозамбик', 'mz'], ['africa', 'Намибия', 'na'], ['africa', 'Нигер', 'ne'], ['africa', 'Нигерия', 'ng'], ['africa', 'Руанда', 'rw'], ['africa', 'Сан-Томе и Принсипи', 'st'], ['africa', 'Сейшелы', 'sc'], ['africa', 'Сенегал', 'sn'], ['africa', 'Сомали', 'so'], ['africa', 'Судан', 'sd'], ['africa', 'Сьерра-Леоне', 'sl'], ['africa', 'Танзания', 'tz'], ['africa', 'Того', 'tg'], ['africa', 'Тунис', 'tn'], ['africa', 'Уганда', 'ug'], ['africa', 'Центральноафриканская Республика', 'cf'], ['africa', 'Чад', 'td'], ['africa', 'Экваториальная Гвинея', 'gq'], ['africa', 'Эритрея', 'er'], ['africa', 'Эсватини', 'sz'], ['africa', 'Эфиопия', 'et'], ['africa', 'Южно-Африканская Республика', 'za'], ['africa', 'Южный Судан', 'ss'],
  ['oceania', 'Австралия', 'au'], ['oceania', 'Вануату', 'vu'], ['oceania', 'Кирибати', 'ki'], ['oceania', 'Маршалловы Острова', 'mh'], ['oceania', 'Микронезия', 'fm'], ['oceania', 'Науру', 'nr'], ['oceania', 'Новая Зеландия', 'nz'], ['oceania', 'Палау', 'pw'], ['oceania', 'Папуа — Новая Гвинея', 'pg'], ['oceania', 'Самоа', 'ws'], ['oceania', 'Соломоновы Острова', 'sb'], ['oceania', 'Тонга', 'to'], ['oceania', 'Тувалу', 'tv'], ['oceania', 'Фиджи', 'fj']
].map(([region, name, code]) => ({ region, name, code }));

const ROUND_COUNT = 20;
const STORAGE = {
  nickname: 'flags-world-nickname',
  bestScore: 'flags-world-best-score',
  sound: 'flags-world-sound'
};

const regionNames = {
  europe: 'Европа',
  americas: 'Америка',
  asia: 'Азия',
  africa: 'Африка',
  oceania: 'Океания',
  world: 'Весь мир'
};

const $ = id => document.getElementById(id);

const ui = {
  menuScreen: $('menuScreen'),
  gameScreen: $('gameScreen'),
  resultScreen: $('resultScreen'),
  settingsScreen: $('settingsScreen'),
  nicknameInput: $('nicknameInput'),
  saveNicknameButton: $('saveNicknameButton'),
  regionButtons: $('regionButtons'),
  playButton: $('playButton'),
  bestScoreMenu: $('bestScoreMenu'),
  settingsButton: $('settingsButton'),
  closeSettingsButton: $('closeSettingsButton'),
  settingsBackdrop: $('settingsBackdrop'),
  soundToggle: $('soundToggle'),
  resetProgressButton: $('resetProgressButton'),
  backToMenuButton: $('backToMenuButton'),
  roundValue: $('roundValue'),
  totalRoundsValue: $('totalRoundsValue'),
  scoreValue: $('scoreValue'),
  streakValue: $('streakValue'),
  progressBar: $('progressBar'),
  regionName: $('regionName'),
  flagImage: $('flagImage'),
  answerButtons: $('answerButtons'),
  answerMessage: $('answerMessage'),
  nextButton: $('nextButton'),
  finalScore: $('finalScore'),
  resultText: $('resultText'),
  correctValue: $('correctValue'),
  bestScoreResult: $('bestScoreResult'),
  playAgainButton: $('playAgainButton'),
  resultToMenuButton: $('resultToMenuButton')
};

let ysdk = null;
let selectedRegion = '';
let currentQuestions = [];
let roundIndex = 0;
let score = 0;
let streak = 0;
let correctAnswers = 0;
let answerLocked = false;
let currentCountry = null;
let soundEnabled = localStorage.getItem(STORAGE.sound) !== 'off';

function safeGet(key, fallback = '') {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Local storage may be unavailable in privacy modes; the game remains playable.
  }
}

function getBestScore() {
  return Math.max(0, Number(safeGet(STORAGE.bestScore, '0')) || 0);
}

function updateBestScore(value) {
  const best = Math.max(getBestScore(), value);
  safeSet(STORAGE.bestScore, best);
  return best;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeNickname(value) {
  return value.replace(/\s+/g, ' ').trim().slice(0, 18);
}

function getNickname() {
  return normalizeNickname(ui.nicknameInput.value) || 'Игрок';
}

function showScreen(screen) {
  [ui.menuScreen, ui.gameScreen, ui.resultScreen].forEach(item => {
    const active = item === screen;
    item.hidden = !active;
    item.classList.toggle('active', active);
  });
}

function setMessage(text = '', type = '') {
  ui.answerMessage.textContent = text;
  ui.answerMessage.className = `answer-message ${type}`.trim();
}

function playTone(kind) {
  if (!soundEnabled || !window.AudioContext) return;

  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = kind === 'correct' ? 660 : 180;
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  } catch {
    // Sound is optional and must never block the game.
  }
}

function flagUrl(code) {
  return new URL(`flags/${code}.svg`, document.baseURI).href;
}

function updateMenu() {
  ui.bestScoreMenu.textContent = getBestScore();
  ui.soundToggle.checked = soundEnabled;
  const hasRegion = Boolean(selectedRegion);
  ui.playButton.disabled = !hasRegion;

  [...ui.regionButtons.querySelectorAll('.region-button')].forEach(button => {
    const selected = button.dataset.region === selectedRegion;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function saveNickname() {
  const name = normalizeNickname(ui.nicknameInput.value);
  ui.nicknameInput.value = name;
  safeSet(STORAGE.nickname, name);
}

function chooseQuestions() {
  const pool = selectedRegion === 'world'
    ? countries
    : countries.filter(country => country.region === selectedRegion);

  if (pool.length < 4) return [];

  const desiredCount = Math.min(ROUND_COUNT, pool.length);
  return shuffle(pool).slice(0, desiredCount);
}

function startGame() {
  saveNickname();
  if (!selectedRegion) return;

  currentQuestions = chooseQuestions();
  if (!currentQuestions.length) return;

  roundIndex = 0;
  score = 0;
  streak = 0;
  correctAnswers = 0;
  ui.totalRoundsValue.textContent = currentQuestions.length;
  showScreen(ui.gameScreen);
  renderRound();
}

function renderRound() {
  answerLocked = false;
  currentCountry = currentQuestions[roundIndex];
  const pool = selectedRegion === 'world'
    ? countries
    : countries.filter(country => country.region === selectedRegion);

  const wrongAnswers = shuffle(pool.filter(country => country.code !== currentCountry.code)).slice(0, 3);
  const answers = shuffle([currentCountry, ...wrongAnswers]);

  ui.roundValue.textContent = roundIndex + 1;
  ui.scoreValue.textContent = score;
  ui.streakValue.textContent = streak;
  ui.regionName.textContent = regionNames[selectedRegion] || 'Весь мир';
  ui.progressBar.style.width = `${(roundIndex / currentQuestions.length) * 100}%`;
  ui.flagImage.src = flagUrl(currentCountry.code);
  ui.flagImage.alt = 'Флаг страны. Выберите правильный вариант ответа.';
  ui.flagImage.onerror = () => {
    ui.flagImage.alt = 'Не удалось загрузить флаг. Перейдите к следующему вопросу.';
  };

  ui.answerButtons.replaceChildren();
  answers.forEach(answer => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-button';
    button.textContent = answer.name;
    button.dataset.code = answer.code;
    button.addEventListener('click', () => checkAnswer(answer, button));
    ui.answerButtons.append(button);
  });

  ui.nextButton.hidden = true;
  setMessage('');
}

function checkAnswer(answer, button) {
  if (answerLocked) return;
  answerLocked = true;

  const correct = answer.code === currentCountry.code;
  const buttons = [...ui.answerButtons.querySelectorAll('.answer-button')];
  buttons.forEach(item => {
    item.disabled = true;
    if (item.dataset.code === currentCountry.code) item.classList.add('correct');
  });

  if (correct) {
    streak += 1;
    correctAnswers += 1;
    const earned = 10 + Math.min(streak - 1, 5) * 2;
    score += earned;
    button.classList.add('correct');
    setMessage(`Верно! +${earned} очков`, 'correct');
    playTone('correct');
  } else {
    streak = 0;
    button.classList.add('wrong');
    setMessage(`Неверно. Это ${currentCountry.name}.`, 'wrong');
    playTone('wrong');
  }

  ui.scoreValue.textContent = score;
  ui.streakValue.textContent = streak;
  ui.nextButton.hidden = false;
  ui.nextButton.textContent = roundIndex + 1 >= currentQuestions.length ? 'Показать результат' : 'Следующий флаг';
}

function nextRound() {
  if (!answerLocked) return;
  roundIndex += 1;

  if (roundIndex >= currentQuestions.length) {
    finishGame();
    return;
  }

  renderRound();
}

function finishGame() {
  const best = updateBestScore(score);
  ui.progressBar.style.width = '100%';
  ui.finalScore.textContent = score;
  ui.correctValue.textContent = correctAnswers;
  ui.bestScoreResult.textContent = best;

  const nickname = getNickname();
  if (score === best && score > 0) {
    ui.resultText.textContent = `${nickname}, это новый личный рекорд!`;
  } else if (correctAnswers >= Math.ceil(currentQuestions.length * 0.8)) {
    ui.resultText.textContent = `${nickname}, отличный результат! Вы хорошо знаете флаги мира.`;
  } else {
    ui.resultText.textContent = `${nickname}, попробуйте ещё раз и улучшите свой результат.`;
  }

  updateMenu();
  showScreen(ui.resultScreen);
}

function openSettings() {
  ui.settingsScreen.hidden = false;
  ui.settingsScreen.classList.add('active');
  ui.soundToggle.checked = soundEnabled;
  ui.closeSettingsButton.focus();
}

function closeSettings() {
  ui.settingsScreen.hidden = true;
  ui.settingsScreen.classList.remove('active');
  ui.settingsButton.focus();
}

function resetProgress() {
  const confirmed = window.confirm('Сбросить лучший результат на этом устройстве?');
  if (!confirmed) return;
  safeSet(STORAGE.bestScore, '0');
  updateMenu();
  ui.bestScoreResult.textContent = '0';
}

function setLanguageFromSDK() {
  const lang = ysdk?.environment?.i18n?.lang;
  document.documentElement.lang = lang === 'ru' ? 'ru' : 'ru';
}

async function initYandexGames() {
  try {
    if (typeof YaGames === 'undefined') {
      console.info('Yandex Games SDK is unavailable outside the Yandex Games environment.');
      return;
    }

    ysdk = await YaGames.init();
    window.ysdk = ysdk;
    setLanguageFromSDK();

    if (ysdk.features?.LoadingAPI?.ready) {
      ysdk.features.LoadingAPI.ready();
    }
  } catch (error) {
    console.error('Yandex Games SDK initialization failed:', error);
  }
}

function bindEvents() {
  ui.saveNicknameButton.addEventListener('click', saveNickname);
  ui.nicknameInput.addEventListener('blur', saveNickname);
  ui.nicknameInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveNickname();
    }
  });

  ui.regionButtons.addEventListener('click', event => {
    const button = event.target.closest('.region-button');
    if (!button) return;
    selectedRegion = button.dataset.region;
    updateMenu();
  });

  ui.playButton.addEventListener('click', startGame);
  ui.nextButton.addEventListener('click', nextRound);
  ui.backToMenuButton.addEventListener('click', () => {
    updateMenu();
    showScreen(ui.menuScreen);
  });
  ui.playAgainButton.addEventListener('click', startGame);
  ui.resultToMenuButton.addEventListener('click', () => {
    updateMenu();
    showScreen(ui.menuScreen);
  });

  ui.settingsButton.addEventListener('click', openSettings);
  ui.closeSettingsButton.addEventListener('click', closeSettings);
  ui.settingsBackdrop.addEventListener('click', closeSettings);
  ui.soundToggle.addEventListener('change', () => {
    soundEnabled = ui.soundToggle.checked;
    safeSet(STORAGE.sound, soundEnabled ? 'on' : 'off');
  });
  ui.resetProgressButton.addEventListener('click', resetProgress);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !ui.settingsScreen.hidden) closeSettings();
  });
}

function initApp() {
  ui.nicknameInput.value = safeGet(STORAGE.nickname, '');
  bindEvents();
  updateMenu();
  initYandexGames();
}

initApp();
