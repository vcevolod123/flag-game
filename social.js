const socialClient = window.supabaseClient;

const friendsButton = document.getElementById('friendsButton');
const friendsModal = document.getElementById('friendsModal');
const closeFriendsButton = document.getElementById('closeFriendsButton');
const friendNickname = document.getElementById('friendNickname');
const sendFriendRequest = document.getElementById('sendFriendRequest');
const friendsMessage = document.getElementById('friendsMessage');
const friendRequests = document.getElementById('friendRequests');
const battleRequests = document.getElementById('battleRequests');
const friendsList = document.getElementById('friendsList');

const chatPanel = document.getElementById('chatPanel');
const chatWith = document.getElementById('chatWith');
const closeChatButton = document.getElementById('closeChatButton');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

let socialUser = null;
let currentFriend = null;
let chatChannel = null;
let battleChannel = null;

function socialMessage(text, type = '') {
  friendsMessage.textContent = text;
  friendsMessage.className = type;
}

function makeButton(text, clickHandler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', clickHandler);
  return button;
}

async function getSocialUser() {
  const { data } = await socialClient.auth.getSession();
  socialUser = data.session?.user || null;
  return socialUser;
}

async function getProfiles(ids) {
  if (!ids.length) return [];

  const { data, error } = await socialClient
    .from('profiles')
    .select('id, nickname, avatar_url, victories')
    .in('id', ids);

  if (error) throw error;
  return data || [];
}

async function loadFriendRequests() {
  const { data: requests, error } = await socialClient
    .from('friend_requests')
    .select('id, sender_id')
    .eq('receiver_id', socialUser.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;

  friendRequests.replaceChildren();

  if (!requests?.length) {
    friendRequests.textContent = 'Новых заявок нет.';
    return;
  }

  const profiles = await getProfiles(
    requests.map(request => request.sender_id)
  );

  const names = new Map(
    profiles.map(profile => [profile.id, profile.nickname])
  );

  requests.forEach(request => {
    const row = document.createElement('div');
    row.className = 'friend-row';

    const name = document.createElement('span');
    name.textContent = names.get(request.sender_id) || 'Пользователь';

    const accept = makeButton('Принять', async () => {
      const { error } = await socialClient.rpc(
        'respond_to_friend_request',
        {
          request_id: request.id,
          accept_request: true
        }
      );

      if (error) {
        socialMessage(error.message, 'bad');
        return;
      }

      socialMessage('Заявка в друзья принята.', 'ok');
      await refreshFriends();
    });

    const decline = makeButton('Отклонить', async () => {
      const { error } = await socialClient.rpc(
        'respond_to_friend_request',
        {
          request_id: request.id,
          accept_request: false
        }
      );

      if (error) {
        socialMessage(error.message, 'bad');
        return;
      }

      socialMessage('Заявка отклонена.');
      await refreshFriends();
    });

    row.append(name, accept, decline);
    friendRequests.append(row);
  });
}

async function loadBattleRequests() {
  const { data: battles, error } = await socialClient
    .from('battles')
    .select('id, challenger_id')
    .eq('opponent_id', socialUser.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;

  battleRequests.replaceChildren();

  if (!battles?.length) {
    battleRequests.textContent = 'Новых вызовов нет.';
    return;
  }

  const profiles = await getProfiles(
    battles.map(battle => battle.challenger_id)
  );

  const names = new Map(
    profiles.map(profile => [profile.id, profile.nickname])
  );

  battles.forEach(battle => {
    const row = document.createElement('div');
    row.className = 'friend-row';

    const name = document.createElement('span');
    name.textContent =
      `${names.get(battle.challenger_id) || 'Игрок'} вызывает вас на батл`;

    const accept = makeButton('Принять', async () => {
      const { error } = await socialClient.rpc(
        'respond_battle_invite',
        {
          p_battle_id: battle.id,
          p_accept: true
        }
      );

      if (error) {
        socialMessage(error.message, 'bad');
        return;
      }

      localStorage.setItem('activeBattleId', battle.id);
      socialMessage('Батл принят. Игра запускается...', 'ok');

      window.dispatchEvent(
        new CustomEvent('battleStarted', {
          detail: { battleId: battle.id }
        })
      );

      await refreshFriends();
    });

    const decline = makeButton('Отклонить', async () => {
      const { error } = await socialClient.rpc(
        'respond_battle_invite',
        {
          p_battle_id: battle.id,
          p_accept: false
        }
      );

      if (error) {
        socialMessage(error.message, 'bad');
        return;
      }

      socialMessage('Вызов в батл отклонён.');
      await refreshFriends();
    });

    row.append(name, accept, decline);
    battleRequests.append(row);
  });
}

async function sendBattleInvite(friend) {
  const { error } = await socialClient.rpc(
    'create_battle_invite',
    {
      p_opponent_id: friend.id
    }
  );

  if (error) {
    socialMessage(error.message, 'bad');
    return;
  }

  socialMessage(`Вызов в батл отправлен игроку ${friend.nickname}.`, 'ok');
}

async function loadFriends() {
  const { data: rows, error } = await socialClient
    .from('friendships')
    .select('friend_id')
    .eq('user_id', socialUser.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  friendsList.replaceChildren();

  if (!rows?.length) {
    friendsList.textContent = 'Друзей пока нет.';
    return;
  }

  const profiles = await getProfiles(
    rows.map(row => row.friend_id)
  );

  profiles.forEach(friend => {
    const row = document.createElement('div');
    row.className = 'friend-row';

    const name = document.createElement('span');
    name.textContent = friend.nickname;

    const openChat = makeButton('Чат', () => {
      openChatWith(friend);
    });

    const inviteBattle = makeButton('Батл', () => {
      sendBattleInvite(friend);
    });

    const avatar = document.createElement('div');
avatar.className = 'friend-avatar';

if (friend.avatar_url) {
  const image = document.createElement('img');
  image.src = friend.avatar_url;
  image.alt = `Аватар ${friend.nickname}`;
  avatar.append(image);
} else {
  avatar.textContent = friend.nickname.slice(0, 1).toUpperCase();
}

row.append(avatar, name, openChat, inviteBattle);
    friendsList.append(row);
  });
}

function subscribeToBattles() {
  if (battleChannel || !socialUser) return;

  battleChannel = socialClient
    .channel(`battles-${socialUser.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'battles'
      },
      async payload => {
        const battle = payload.new || payload.old;

        if (
          battle?.challenger_id === socialUser.id ||
          battle?.opponent_id === socialUser.id
        ) {
          await loadBattleRequests();

          if (
            payload.new?.status === 'active' &&
            payload.new?.challenger_id === socialUser.id
          ) {
            localStorage.setItem('activeBattleId', payload.new.id);

            window.dispatchEvent(
              new CustomEvent('battleStarted', {
                detail: { battleId: payload.new.id }
              })
            );
          }
        }
      }
    )
    .subscribe();
}

async function refreshFriends() {
  try {
    await getSocialUser();

    if (!socialUser) {
      socialMessage('Сначала войдите в аккаунт.', 'bad');
      return;
    }

    subscribeToBattles();

    await loadFriendRequests();
    await loadBattleRequests();
    await loadFriends();
  } catch (error) {
    socialMessage(error.message, 'bad');
  }
}

async function loadMessages() {
  if (!socialUser || !currentFriend) return;

  const { data, error } = await socialClient
    .from('messages')
    .select('id, sender_id, receiver_id, text, created_at')
    .or(
      `and(sender_id.eq.${socialUser.id},receiver_id.eq.${currentFriend.id}),and(sender_id.eq.${currentFriend.id},receiver_id.eq.${socialUser.id})`
    )
    .order('created_at', { ascending: true });

  if (error) {
    socialMessage(error.message, 'bad');
    return;
  }

  chatMessages.replaceChildren();

  data.forEach(message => {
    const item = document.createElement('div');

    item.className = message.sender_id === socialUser.id
      ? 'chat-message mine'
      : 'chat-message';

    item.textContent = message.text;
    chatMessages.append(item);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function openChatWith(friend) {
  currentFriend = friend;
  chatWith.textContent = `Чат: ${friend.nickname}`;
  chatPanel.hidden = false;

  if (chatChannel) {
    socialClient.removeChannel(chatChannel);
  }

  chatChannel = socialClient
    .channel(`chat-${socialUser.id}-${friend.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      payload => {
        const message = payload.new;

        const belongsToChat =
          (message.sender_id === socialUser.id &&
            message.receiver_id === friend.id) ||
          (message.sender_id === friend.id &&
            message.receiver_id === socialUser.id);

        if (belongsToChat) {
          loadMessages();
        }
      }
    )
    .subscribe();

  await loadMessages();
}

friendsButton.addEventListener('click', async () => {
  friendsModal.hidden = false;
  chatPanel.hidden = true;
  socialMessage('');
  await refreshFriends();
});

closeFriendsButton.addEventListener('click', () => {
  friendsModal.hidden = true;
});

closeChatButton.addEventListener('click', () => {
  chatPanel.hidden = true;
  currentFriend = null;

  if (chatChannel) {
    socialClient.removeChannel(chatChannel);
    chatChannel = null;
  }
});

sendFriendRequest.addEventListener('click', async () => {
  const nickname = friendNickname.value.trim();

  if (!nickname) {
    socialMessage('Введите никнейм пользователя.', 'bad');
    return;
  }

  const { error } = await socialClient.rpc(
    'send_friend_request',
    {
      target_nickname: nickname
    }
  );

  if (error) {
    socialMessage(error.message, 'bad');
    return;
  }

  friendNickname.value = '';
  socialMessage('Заявка в друзья отправлена.', 'ok');
});

chatForm.addEventListener('submit', async event => {
  event.preventDefault();

  const text = chatInput.value.trim();

  if (!text || !currentFriend) return;

  const { error } = await socialClient
    .from('messages')
    .insert({
      sender_id: socialUser.id,
      receiver_id: currentFriend.id,
      text
    });

  if (error) {
    socialMessage(error.message, 'bad');
    return;
  }

  chatInput.value = '';
});