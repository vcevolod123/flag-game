const authClient = window.supabaseClient;

const authScreen = document.getElementById('authScreen');
const appRoot = document.getElementById('appRoot');
const authForm = document.getElementById('authForm');
const authNickname = document.getElementById('authNickname');
const authLogin = document.getElementById('authLogin');
const authPassword = document.getElementById('authPassword');
const authSubmit = document.getElementById('authSubmit');
const authModeToggle = document.getElementById('authModeToggle');
const authTitle = document.getElementById('authTitle');
const authMessage = document.getElementById('authMessage');
const logoutButton = document.getElementById('logoutButton');

let loginMode = false;

function showAuthMessage(text, type = '') {
  authMessage.textContent = text;
  authMessage.className = type;
}

function setAuthMode() {
  authNickname.hidden = loginMode;
  authNickname.required = !loginMode;

  authSubmit.textContent = loginMode
    ? 'Войти'
    : 'Создать аккаунт';

  authModeToggle.textContent = loginMode
    ? 'Нет аккаунта? Зарегистрироваться'
    : 'Уже есть аккаунт? Войти';

  authTitle.textContent = loginMode
    ? 'Войдите в свой аккаунт.'
    : 'Создайте аккаунт, чтобы играть, добавлять друзей и общаться.';

  showAuthMessage('');
}

function makeTechnicalEmail(login) {
  return `${login}@players.example.com`;
}

function validLogin(login) {
  return /^[a-z0-9_]{3,20}$/.test(login);
}

async function openGame(user) {
  const { data } = await authClient
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .single();

  const nickname =
    data?.nickname ||
    user.user_metadata?.nickname ||
    'Игрок';

  localStorage.setItem('nick', nickname);

  const gameNickname = document.getElementById('nickname');

  if (gameNickname) {
    gameNickname.value = nickname;
  }

  authScreen.hidden = true;
  appRoot.hidden = false;
}

authModeToggle.addEventListener('click', () => {
  loginMode = !loginMode;
  setAuthMode();
});

authForm.addEventListener('submit', async event => {
  event.preventDefault();

  const login = authLogin.value.trim().toLowerCase();
  const password = authPassword.value;
  const nickname = authNickname.value.trim();

  if (!validLogin(login)) {
    showAuthMessage(
      'Логин должен содержать от 3 до 20 символов: латинские буквы, цифры или _',
      'bad'
    );
    return;
  }

  if (!loginMode && nickname.length < 2) {
    showAuthMessage('Введите никнейм от 2 символов.', 'bad');
    return;
  }

  if (password.length < 6) {
    showAuthMessage('Пароль должен содержать минимум 6 символов.', 'bad');
    return;
  }

  const email = makeTechnicalEmail(login);

  authSubmit.disabled = true;
  showAuthMessage('Подождите...');

  let result;

  if (loginMode) {
    result = await authClient.auth.signInWithPassword({
      email,
      password
    });
  } else {
    result = await authClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname
        }
      }
    });
  }

  authSubmit.disabled = false;

  if (result.error) {
    showAuthMessage(result.error.message, 'bad');
    return;
  }

  if (!loginMode && !result.data.session) {
    showAuthMessage(
      'Аккаунт создан, но вход не выполнен. Проверьте, что Confirm email выключен в Supabase.',
      'bad'
    );
    return;
  }

  if (result.data.user) {
    await openGame(result.data.user);
  }
});

authClient.auth.getSession().then(({ data }) => {
  if (data.session?.user) {
    openGame(data.session.user);
  }
});

logoutButton?.addEventListener('click', async () => {
  const confirmed = confirm('Выйти из аккаунта?');

  if (!confirmed) return;

  const { error } = await authClient.auth.signOut();

  if (error) {
    alert(`Не удалось выйти: ${error.message}`);
    return;
  }

  window.location.reload();
});

setAuthMode();