// Minimal flashcards logic + persistence. Expand with TODOs 
const DEFAULTS = {decks: [
  {id:'deck1', title:'Spanish Basics', cards:[
    {id:'c1', front:'Hola', back:'Hello', box:1, nextReview: Date.now()},
    {id:'c2', front:'Gracias', back:'Thank you', box:1, nextReview: Date.now()}
  ]}
]};

function loadData(){ return JSON.parse(localStorage.getItem('flash-data') || JSON.stringify(DEFAULTS)); }
function saveData(d){ localStorage.setItem('flash-data', JSON.stringify(d)); }

let data = loadData();
const deckList = document.getElementById('deckList');
const cardView = document.getElementById('cardView');
const deckTitle = document.getElementById('deckTitle');
const flashcardEl = document.getElementById('flashcard');

function renderDecks(){
  deckList.innerHTML = '';
  data.decks.forEach(d=>{
    const el = document.createElement('div'); el.className='deck'; el.textContent = `${d.title} (${d.cards.length})`;
    el.onclick = ()=> openDeck(d.id);
    deckList.appendChild(el);
  });
}
let currentDeck = null, currentCardIndex = 0, showingFront = true;

// Variables to track progress
let totalCards = 1;

// Update progress bar and text
function updateProgress() {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  progressBar.value = currentCardIndex + 1;
  progressBar.max = totalCards;
  progressText.textContent = `Card ${currentCardIndex + 1} of ${totalCards}`;
}

function openDeck(id){
  currentDeck = data.decks.find(x=>x.id===id);
  deckTitle.textContent = currentDeck.title;
  cardView.style.display = '';
  deckList.parentElement.style.display = 'none';
  currentCardIndex = 0; showingFront = true;
  totalCards = currentDeck.cards.length;
  renderCard();
  updateProgress();
}

function renderCard(){
  if(!currentDeck) return;
  const card = currentDeck.cards[currentCardIndex];
  flashcardEl.textContent = card ? (showingFront ? card.front : card.back) : 'No more cards in this session';
}

flashcardEl.onclick = ()=>{ showingFront = !showingFront; renderCard(); }

document.getElementById('knownBtn').onclick = ()=>{
  const card = currentDeck.cards[currentCardIndex];
  if(card){ card.box = Math.min((card.box||1)+1, 5); card.nextReview = Date.now() + (card.box * 86400000); saveData(data); }
  nextCard();
};

document.getElementById('unknownBtn').onclick = ()=>{
  const card = currentDeck.cards[currentCardIndex];
  if(card){ card.box = 1; card.nextReview = Date.now() + 3600000; saveData(data); }
  nextCard();
};

document.getElementById('backToDecks').onclick = ()=>{
  cardView.style.display = 'none'; deckList.parentElement.style.display = ''; currentDeck = null;
};

document.getElementById('createDeckBtn').onclick = ()=>{
  const title = prompt('Deck title:'); if(!title) return;
  const id = 'deck' + Date.now();
  data.decks.push({id, title, cards:[]});
  saveData(data); renderDecks();
};

renderDecks();

// Demo data: Add a sample deck and flashcard if none exist
document.addEventListener('DOMContentLoaded', () => {
  let decks = JSON.parse(localStorage.getItem('flashcardDecks')) || [];
  if (decks.length === 0) {
    decks = [
      {
        name: "Demo Deck",
        cards: [
          {
            question: "What is the capital of France?",
            answer: "Paris"
          }
        ]
      }
    ];
    localStorage.setItem('flashcardDecks', JSON.stringify(decks));
  }
  renderDecks();
});

// TODOs for participants:
// - Create UI to add/edit/delete cards within a deck.
// - Implement "Due today" filter using card.nextReview.
// - Implement SM-2 scheduling and session scoring.
// - Add import/export (JSON) and card tags/search.

// - Improve UI/UX with better styles and animations.
// - Add error handling and edge case management (e.g., empty decks).
