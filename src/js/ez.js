// UI events -------------------------------------------------------------------
(() => {
  const menu_link_connection    = document.querySelector('#menu_link_connection');
  const menu_link_subscriptions = document.querySelector('#menu_link_subscriptions');
  const menu_link_messages      = document.querySelector('#menu_link_messages');
  const menu_link_publish       = document.querySelector('#menu_link_publish');

  const card_connection    = document.querySelector('#card_connection');
  const card_subscriptions = document.querySelector('#card_subscriptions');
  const card_messages      = document.querySelector('#card_messages');

  const cards = [card_connection, card_subscriptions, card_messages];
  let current_card = null;

  var removeAllCards = () => {
    for(let card of cards) {
      card.style.display = 'none';
    }
  };

  var setCurrentCard = (card, evt) => {
    removeAllCards();

    current_card = card;
    evt.target.classList.add('is-active');
    card.style.display = 'inherit';
  }

  var linkCardMenu = (menu, card) => {
    menu.addEventListener('click', evt => setCurrentCard(card, evt));
  };

  linkCardMenu(menu_link_connection, card_connection);
  linkCardMenu(menu_link_subscriptions, card_subscriptions);
  linkCardMenu(menu_link_messages, card_messages);
  setCurrentCard(card_connection);

  // menu_link_connection.addEventListener('click', evt => setCurrentCard(card_connection));
  // menu_link_subscriptions.addEventListener('click', evt => setCurrentCard(card_subscriptions));
  // menu_link_messages.addEventListener('click', evt => setCurrentCard(card_messages));

  // var initEvents = () => {
  // };

  // window.addEventListener('load', evt => {
    // initEvents();
  // });
})();
// end UI events ---------------------------------------------------------------

// const mqtt = require('mqtt');

// var client = mqtt.connect('wss://iot.eclipse.org');
// var client = mqtt.connect('ws://localhost');
//
// client.on('connect', function() {
//   console.log('connected');
// });
