const countries = [
  ['europe','Франция','fr','FRA','Париж','Европа'], ['europe','Германия','de','DEU','Берлин','Европа'],
  ['europe','Италия','it','ITA','Рим','Европа'], ['europe','Испания','es','ESP','Мадрид','Европа'],
  ['americas','Канада','ca','CAN','Оттава','Северная Америка'], ['americas','США','us','USA','Вашингтон','Северная Америка'],
  ['americas','Бразилия','br','BRA','Бразилиа','Южная Америка'], ['americas','Аргентина','ar','ARG','Буэнос-Айрес','Южная Америка'],
  ['asia','Япония','jp','JPN','Токио','Азия'], ['asia','Китай','cn','CHN','Пекин','Азия'],
  ['asia','Индия','in','IND','Нью-Дели','Азия'], ['asia','Южная Корея','kr','KOR','Сеул','Азия'],
  ['africa','Египет','eg','EGY','Каир','Африка'], ['africa','Марокко','ma','MAR','Рабат','Африка'],
  ['africa','Нигерия','ng','NGA','Абуджа','Африка'], ['africa','Кения','ke','KEN','Найроби','Африка']
].map(([r,n,code,iso,cap,cont]) => ({r,n,code,iso,cap,cont}));

const $    = id   => document.getElementById(id);
const norm = text => text.trim().toLowerCase().replace(/ё/g, 'е');

let region = '', pool = [], score = 0, level = 1, current, last = '';
let map, geo, selectedLayer, selectedIso = '', roundEnded = false, gameEnded = false;
let usedCodes = new Set();
let command   = '';
let activeSingleRunId = null;
let singleRewardClaimed = false;

async function startSingleGameRun() {
  singleRewardClaimed = false;
  activeSingleRunId = null;

  const { data, error } = await window.supabaseClient.rpc(
    'start_single_game'
  );

  if (error) {
    console.error(error.message);
    return;
  }

  activeSingleRunId = data;
}

async function rewardSingleGame() {
  if (singleRewardClaimed || !activeSingleRunId) {
    return;
  }

  singleRewardClaimed = true;

  const { error } = await window.supabaseClient.rpc(
    'finish_single_game',
    {
      p_run_id: activeSingleRunId,
      p_score: score
    }
  );

  if (error) {
    singleRewardClaimed = false;
    console.error(error.message);
    return;
  }

  message('Одиночный режим пройден! +2 монеты.', 'ok');
  localStorage.removeItem('activeSingleRunId');
}
const battleClient = window.supabaseClient;

let battleMode = false;
let activeBattleId = null;
let battleChannel = null;
let battleFinished = false;

async function reportBattlePoints(points) {
  if (!battleMode || !activeBattleId || battleFinished) return;

  const { data, error } = await battleClient.rpc(
    'add_battle_points',
    {
      p_battle_id: activeBattleId,
      p_points: points
    }
  );

  if (error) {
    message(`Ошибка батла: ${error.message}`, 'bad');
    return;
  }

  const battle = data?.[0];

  if (battle?.battle_status === 'finished' && battle.winner_id) {
    showBattleResult(battle.winner_id);
  }
}

async function showBattleResult(winnerId) {
  if (battleFinished) return;

  battleFinished = true;
  gameEnded = true;

  const { data: sessionData } = await battleClient.auth.getSession();
  const myId = sessionData.session?.user?.id;

  const { data: winner } = await battleClient
    .from('profiles')
    .select('nickname')
    .eq('id', winnerId)
    .single();

  const winnerName = winner?.nickname || 'Игрок';
  const isWinner = winnerId === myId;

  if (!isWinner) {
    const defeatScreen = document.createElement('div');

    defeatScreen.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: grid;
      place-items: center;
      padding: 20px;
      color: white;
      background: #7f1d1d;
      font-size: clamp(32px, 8vw, 90px);
      font-weight: 900;
      text-align: center;
    `;

    defeatScreen.textContent = 'Поражение. Соперник оказался быстрее!';
    document.body.append(defeatScreen);

    await new Promise(resolve => setTimeout(resolve, 2000));

    defeatScreen.remove();
  }

  const resultScreen = document.createElement('div');

  resultScreen.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: grid;
    place-items: center;
    padding: 20px;
    background: rgba(2, 6, 23, 0.92);
  `;

  resultScreen.innerHTML = `
    <div style="
      width: min(100%, 480px);
      padding: 32px;
      border-radius: 20px;
      color: white;
      text-align: center;
      background: #0f172a;
      box-shadow: 0 20px 60px #000a;
    ">
      <h1>${isWinner ? 'Победа!' : 'Батл завершён'}</h1>
      <p style="font-size: 24px; margin: 24px 0;">
        1 место — ${winnerName}
      </p>
      <p>${isWinner ? '+1 победа в профиль' : 'Попробуй взять реванш!'}</p>
      <button id="battleResultButton" type="button">
        В меню
      </button>
    </div>
  `;

  document.body.append(resultScreen);

  document
    .getElementById('battleResultButton')
    .addEventListener('click', () => {
      localStorage.removeItem('activeBattleId');
      location.reload();
    });
}

function subscribeToBattle() {
  if (!activeBattleId || battleChannel) return;

  battleChannel = battleClient
    .channel(`battle-game-${activeBattleId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'battles',
        filter: `id=eq.${activeBattleId}`
      },
      payload => {
        if (
          payload.new.status === 'finished' &&
          payload.new.winner_id
        ) {
          showBattleResult(payload.new.winner_id);
        }
      }
    )
    .subscribe();
}

async function startBattleMode(battleId) {
  activeBattleId = battleId;
  battleMode = true;
  battleFinished = false;
  region = 'world';

  $('menuScreen').hidden = true;
  $('gameScreen').hidden = false;

  start();
  subscribeToBattle();
}

window.addEventListener('battleStarted', event => {
  startBattleMode(event.detail.battleId);
});

battleClient.auth.getSession().then(async ({ data }) => {
  const user = data.session?.user;

  if (!user) return;

  const { data: battles } = await battleClient
    .from('battles')
    .select('id')
    .eq('status', 'active')
    .or(
      `challenger_id.eq.${user.id},opponent_id.eq.${user.id}`
    )
    .limit(1);

  if (battles?.length) {
    startBattleMode(battles[0].id);
  }
});

$('nickname').value      = localStorage.getItem('nick') || '';
$('saveNickname').onclick = () => localStorage.setItem('nick', $('nickname').value);
$('backButton').onclick   = () => location.reload();
$('confirmCountry').type  = 'button';

document.querySelectorAll('[data-region]').forEach(b => {
  b.onclick = () => {
    region = b.dataset.region;

    document.querySelectorAll('[data-region]').forEach(x =>
      x.classList.toggle('selected', x === b)
    );

    $('playButton').disabled = false;
  };
});

$('playButton').onclick = async () => {
  battleMode = false;
  activeBattleId = null;

  await startSingleGameRun();
  start();
};

function message(text, type = '') {
  $('message').textContent = text;
  $('message').className   = type;
}

function randomCountry() {
  let available = pool.filter(country => !usedCodes.has(country.code));
  if (available.length === 0) {
    usedCodes.clear();
    available = [...pool];
  }
  const item = available[Math.floor(Math.random() * available.length)];
  usedCodes.add(item.code);
  last = item.code;
  return item;
}

function start() {
  pool  = region === 'world' ? countries : countries.filter(x => x.r === region);
  score = 0;
  level = 1;
  last  = '';
  usedCodes.clear();
  gameEnded = false;

  $('score').textContent   = score;
  $('score').parentElement.hidden = battleMode;
  $('menuScreen').hidden   = true;
  $('gameScreen').hidden   = false;
  $('player').textContent  = 'Игрок: ' + ($('nickname').value || 'Гость');
  $('flagRound').hidden    = false;
  $('mapRound').hidden     = true;
  $('capitalInput').hidden = true;
  $('capitalInput').required = false;

  nextFlagRound();
}

function nextFlagRound() {
  if (level === 1 && score >= 5) {
    level = 2;
    $('capitalInput').hidden   = false;
    $('capitalInput').required = true;
  }
  if (level === 2 && score >= 15) {
    level = 3;
    $('flagRound').hidden = true;
    $('mapRound').hidden  = false;
    startMapRound();
    return;
  }

  current = randomCountry();
  $('level').textContent = 'Уровень ' + level;
  $('rule').textContent  =
    level === 1
      ? 'Угадайте страну по флагу: +1 очко.'
      : 'Страна и столица: каждое поле +1 или −1.';

  $('flagImage').src = 'https://flagcdn.com/w640/' + current.code + '.png';
  $('countryInput').value               = '';
  $('capitalInput').value               = '';
  $('countryInput').disabled            = false;
  $('capitalInput').disabled            = false;
  $('answerForm').querySelector('button').disabled = false;
  message('');
}

$('answerForm').onsubmit = event => {
  event.preventDefault();

  const countryOK = norm($('countryInput').value) === norm(current.n);
  let points      = countryOK ? 1 : 0;

  if (level === 2)
    points += norm($('capitalInput').value) === norm(current.cap) ? 1 : -1;

  score = Math.max(0, score + points);
  $('score').textContent = score;
  reportBattlePoints(points);

  message(
    countryOK ? 'Правильно!' : 'Неправильно. Это ' + current.n + '.',
    countryOK ? 'ok' : 'bad'
  );

  $('countryInput').disabled = true;
  $('capitalInput').disabled = true;
  $('answerForm').querySelector('button').disabled = true;

  setTimeout(nextFlagRound, 1400);
};

function startMapRound() {
  if (gameEnded) return;

  current      = randomCountry();
  selectedIso  = '';
  selectedLayer = null;
  roundEnded    = false;

  $('level').textContent    = 'Уровень 3';
  $('rule').textContent     = 'Страна +5, правильный континент +2, иначе 0.';
  $('mapTask').textContent  = 'Найдите на карте: ' + current.n;
  $('chosenCountry').textContent  = 'Страна не выбрана';
  $('confirmCountry').textContent = 'Выбрать страну';
  $('confirmCountry').disabled    = true;
  
  message('');

  if (!map) createMap();
  else {
    map.invalidateSize();
    if (geo) geo.eachLayer(layer => geo.resetStyle(layer));
  }
}

function createMap() {
  map = L.map('map', {minZoom: 2, maxZoom: 7}).setView([20, 0], 2);

  fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(response => {
      if (!response.ok) throw new Error('Не удалось загрузить карту');
      return response.json();
    })
    .then(data => {
      geo = L.geoJSON(data, {
        style: {color: '#64748b', weight: 1, fillColor: '#fff', fillOpacity: 0.9},
        onEachFeature: (feature, layer) => {
          const nameMap = {
            France: 'FRA',
            Germany: 'DEU',
            Italy: 'ITA',
            Spain: 'ESP',
            Canada: 'CAN',
            'United States of America': 'USA',
            Brazil: 'BRA',
            Argentina: 'ARG',
            Japan: 'JPN',
            China: 'CHN',
            India: 'IND',
            'South Korea': 'KOR',
            Egypt: 'EGY',
            Morocco: 'MAR',
            Nigeria: 'NGA',
            Kenya: 'KEN'
          };

          layer.on({
            mouseover: e => {
  if (e.target !== selectedLayer) {
    e.target.bringToFront();

    e.target.setStyle({
      color: '#60a5fa',
      weight: 4,
      fillColor: '#dbeafe',
      fillOpacity: 1
    });

    const path = e.target.getElement();

    if (path) {
      path.style.filter =
        'drop-shadow(0 5px 4px rgba(15, 23, 42, 0.45))';
    }
  }
},

mouseout: e => {
  if (e.target !== selectedLayer) {
    const path = e.target.getElement();

    if (path) {
      path.style.filter = '';
    }

    geo.resetStyle(e.target);}
  },

  click: e => {
  const iso = nameMap[feature.properties.name];

  if (iso) {
    selectCountry(e.target, iso);
  }

},
          });
        }
      }).addTo(map);
    })
    .catch(() => message('Карта не загрузилась. Проверьте интернет.', 'bad'));
}

function selectCountry(layer, iso) {
  if (roundEnded) return;
  if (selectedLayer) geo.resetStyle(selectedLayer);

  selectedLayer = layer;
  selectedIso   = iso;

  layer.setStyle({color: '#1d4ed8', weight: 4, fillColor: '#60a5fa'});
  $('chosenCountry').textContent = 'Страна выбрана.';
  $('confirmCountry').disabled   = false;
}

function confirmMapAnswer() {
  if (roundEnded) {
    startMapRound();
    return;
  }
  if (!selectedIso || !current) return;

  const picked = countries.find(x => x.iso === selectedIso);

 let points = 0;

if (selectedIso === current.iso) {
  points = 5;
  score += points;
  message('Правильно! +5 очков.', 'ok');
} else if (picked && picked.cont === current.cont) {
  points = 2;
  score += points;
  message('Страна неверна, но континент угадан. +2 очка.', 'mid');
} else {
  message('Неверно. 0 очков.', 'bad');
}

reportBattlePoints(points);

  $('score').textContent = score;
  roundEnded = true;

  const targetScore = battleMode ? 55 : 35;
  $('confirmCountry').textContent =
    score >= targetScore ? 'Игра завершена' : 'Следующий раунд';

 if (score >= targetScore) {
  gameEnded = true;
  $('confirmCountry').disabled = true;

  message(
    'Третий уровень пройден. Итог: ' + score + ' очков.',
    'ok'
  );

  if (!battleMode) {
    rewardSingleGame();
  }
}
}

$('confirmCountry').onclick = event => {
  event.preventDefault();
  confirmMapAnswer();
};

document.addEventListener('keydown', event => {
  if (event.key.length !== 1) return;

  command = (command + event.key.toLowerCase()).slice(-4);

  if (!/^set[123]$/.test(command)) return;

  if (!region) {
    region = 'world';
    pool   = countries;
    $('menuScreen').hidden = true;
    $('gameScreen').hidden = false;
    $('player').textContent = 'Игрок: ' + ($('nickname').value || 'Гость');
  }

  if (command === 'set1') {
    score = 0;
    level = 1;
    $('flagRound').hidden    = false;
    $('mapRound').hidden     = true;
    $('capitalInput').hidden = true;
    $('capitalInput').required = false;
    nextFlagRound();
  }

  if (command === 'set2') {
    score = 5;
    level = 2;
    $('flagRound').hidden    = false;
    $('mapRound').hidden     = true;
    $('capitalInput').hidden = false;
    $('capitalInput').required = true;
    nextFlagRound();
  }

  if (command === 'set3') {
    score = 15;
    level = 3;
    $('flagRound').hidden    = true;
    $('mapRound').hidden     = false;
    startMapRound();
  }

  $('score').textContent = score;
  command = '';
}); 

const themeToggle = document.getElementById('themeToggle');
const themePanel = document.getElementById('themePanel');
const themeChoices = document.querySelectorAll('.theme-choice');

function setTheme(theme) {
  document.body.classList.remove(
    'theme-white',
    'theme-black',
    'theme-blue'
  );

  document.body.classList.add(`theme-${theme}`);

  localStorage.setItem('gameTheme', theme);

  themeChoices.forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.theme === theme
    );
  });
}

const savedTheme = localStorage.getItem('gameTheme') || 'blue';

setTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  if (!themePanel) return;

  themePanel.hidden = !themePanel.hidden;
});

themeChoices.forEach(button => {
  button.addEventListener('click', () => {
    setTheme(button.dataset.theme);

    if (themePanel) {
      themePanel.hidden = true;
    }
  });
});

const settingsButton = document.getElementById('settingsButton');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsButton = document.getElementById('closeSettingsButton');
const leaveBattleButton = document.getElementById('leaveBattleButton');

function updateLeaveBattleButton() {
  const battleId = localStorage.getItem('activeBattleId');

  if (leaveBattleButton) {
    leaveBattleButton.hidden = !battleId;
  }
}

settingsButton?.addEventListener('click', () => {
  updateLeaveBattleButton();
  settingsPanel.hidden = false;
});

closeSettingsButton?.addEventListener('click', () => {
  settingsPanel.hidden = true;
});

leaveBattleButton?.addEventListener('click', async () => {
  const battleId = localStorage.getItem('activeBattleId');

  if (!battleId) {
    return;
  }

  const confirmed = confirm(
    'Выйти из батла? Батл будет отменён, победитель не определится.'
  );

  if (!confirmed) {
    return;
  }

  const { error } = await window.supabaseClient.rpc(
    'leave_battle',
    {
      p_battle_id: battleId
    }
  );

  if (error) {
    alert(`Не удалось выйти из батла: ${error.message}`);
    return;
  }

  localStorage.removeItem('activeBattleId');
  alert('Вы вышли из батла.');
  location.reload();
});
