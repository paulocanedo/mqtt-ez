const subscription = (() => {
  let $ = query => document.querySelector(query);

  const menu_link_subscriptions = $('#menu_link_subscriptions');
  const card_subscriptions = $('#card_subscriptions');
  const subscriptions_form = $('#subscriptions_form');
  const subscribe_button = subscriptions_form.subscribe_button;
  const topics_table = $('#topics_table');
  // card_subscriptions.link_card = menu_link_subscriptions;

  return {
    add(sub) {

    },
    remove(sub) {

    }
  };
})();

module.exports = subscription;
