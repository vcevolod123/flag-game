const profileClient = window.supabaseClient;

const avatarInput = document.getElementById('avatarInput');
const changeAvatarButton = document.getElementById('changeAvatarButton');
const profileAvatarPreview = document.getElementById('profileAvatarPreview');
const settingsCard = document.querySelector('.settings-card');

let selectedAvatarFile = null;
let temporaryAvatarUrl = null;

function profileStatus(text, type = '') {
  let status = document.getElementById('profileStatus');

  if (!status && settingsCard) {
    status = document.createElement('p');
    status.id = 'profileStatus';
    settingsCard.append(status);
  }

  if (!status) return;

  status.textContent = text;
  status.className = type;
}

function showAvatar(url) {
  if (!profileAvatarPreview) return;

  if (url) {
    profileAvatarPreview.src = url;
    profileAvatarPreview.hidden = false;
  } else {
    profileAvatarPreview.removeAttribute('src');
    profileAvatarPreview.hidden = true;
  }
}

async function loadMyAvatar() {
  const { data: sessionData } = await profileClient.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) return;

  const { data, error } = await profileClient
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single();

  if (!error) showAvatar(data?.avatar_url || '');
}

avatarInput?.addEventListener('change', () => {
  const file = avatarInput.files?.[0];

  if (!file) return;

  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    avatarInput.value = '';
    profileStatus('Выберите PNG, JPG или WEBP.', 'bad');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    avatarInput.value = '';
    profileStatus('Размер аватарки не должен превышать 2 МБ.', 'bad');
    return;
  }

  selectedAvatarFile = file;

  if (temporaryAvatarUrl) URL.revokeObjectURL(temporaryAvatarUrl);

  temporaryAvatarUrl = URL.createObjectURL(file);
  showAvatar(temporaryAvatarUrl);
  profileStatus('Аватарка выбрана. Нажмите «Сменить аватарку».', 'ok');
});

changeAvatarButton?.addEventListener('click', async () => {
  if (!selectedAvatarFile) {
    profileStatus('Сначала выберите изображение.', 'bad');
    return;
  }

  const { data: sessionData } = await profileClient.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) {
    profileStatus('Сначала войдите в аккаунт.', 'bad');
    return;
  }

  const extension = selectedAvatarFile.name.split('.').pop().toLowerCase();
  const filePath = `${user.id}/avatar.${extension}`;

  changeAvatarButton.disabled = true;
  profileStatus('Загрузка аватарки...');

  const { error: uploadError } = await profileClient.storage
    .from('avatars')
    .upload(filePath, selectedAvatarFile, {
      cacheControl: '3600',
      contentType: selectedAvatarFile.type,
      upsert: true
    });

  if (uploadError) {
    changeAvatarButton.disabled = false;
    profileStatus(uploadError.message, 'bad');
    return;
  }

  const { data: urlData } = profileClient.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const avatarUrl = `${urlData.publicUrl}?v=${Date.now()}`;

  const { error: profileError } = await profileClient.rpc(
    'update_my_avatar',
    { p_avatar_url: avatarUrl }
  );

  changeAvatarButton.disabled = false;

  if (profileError) {
    profileStatus(profileError.message, 'bad');
    return;
  }

  selectedAvatarFile = null;
  avatarInput.value = '';
  showAvatar(avatarUrl);
  profileStatus('Аватарка сохранена.', 'ok');
});

loadMyAvatar();
