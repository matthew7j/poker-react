const suits = ['spades', 'diamonds', 'clubs', 'hearts'];
const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

const createDeck = () => {
  let deck = new Array();

  suits.forEach(suit => {
    values.forEach(value => {
      deck.push({ value, suit });
    });
  });

  return shuffleDeck(deck);
};

const shuffleDeck = deck => {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomNum = Math.floor(Math.random() * i);
    const temp = deck[i];
    deck[i] = deck[randomNum];
    deck[randomNum] = temp
  }

  return deck;
};

const getShuffledDeck = players => {
  return createDeck();
};

module.exports = {
  getShuffledDeck
};