document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const startGameButton = document.getElementById('start-game');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const cardsContainer = document.getElementById('cards-container');
    const goButton = document.getElementById('go-button');
    const playerBoard = document.getElementById('player-board');
    const dealerBoard = document.getElementById('dealer-board');
    const dealerHandStrength = document.getElementById('dealer-hand-strength');
    const results = document.getElementById('results');
    const resultMessage = document.getElementById('result-message');
    const playAgainButton = document.getElementById('play-again');
    const gameBoard = document.getElementById('game-board');
    const winsCounter = document.getElementById('wins-counter');
    const lossesCounter = document.getElementById('losses-counter');

    let selectedRule = [];
    let playerCards = [];
    let dealerCards = [];
    let deck = [];
    let wins = 0;
    let losses = 0;
    let gameInProgress = false;

    const allCards = generateDeck();

    startGameButton.addEventListener('click', () => {
        console.log("Start Game button clicked");
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';

        deck = generateDeck();
        
        displayCards();
    });

    goButton.addEventListener('click', async () => {
        if (gameInProgress) return;
        console.log("Go button clicked");
        gameInProgress = true;
        gameBoard.style.display = 'block';
        goButton.style.display = 'none';
        await dealCards();
        if (playerCards.length < 5 && deck.length === 0) {
            losses++;
            updateScore();
            resultMessage.innerText = 'You Lose! Deck ran out of cards.';
            results.style.display = 'block';
        }
        gameInProgress = false;
        goButton.style.display = 'block';
    });

    playAgainButton.addEventListener('click', () => {
        console.log("Play Again button clicked");
        resetGame();
    });

    function generateDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
        return deck;
    }

    function displayCards() {
        cardsContainer.innerHTML = '';
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        suits.forEach(suit => {
            const suitRow = document.createElement('div');
            suitRow.classList.add('suit-row');
            allCards.filter(card => card.suit === suit).forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card', card.suit);
                cardElement.innerHTML = `<div class="card-value">${card.value}</div>`;
                cardElement.addEventListener('click', () => {
                    toggleCardSelection(cardElement, card);
                });
                suitRow.appendChild(cardElement);
            });
            cardsContainer.appendChild(suitRow);
        });
    }

    function toggleCardSelection(cardElement, card) {
        if (!gameInProgress) {
            if (selectedRule.includes(card)) {
                selectedRule = selectedRule.filter(c => c !== card);
                cardElement.classList.remove('selected');
            } else {
                selectedRule.push(card);
                cardElement.classList.add('selected');
            }
        }
    }

    async function dealCards() {
        playerBoard.innerHTML = '';
        dealerBoard.innerHTML = '';
        while (playerCards.length < 5 && deck.length > 0) {
            let card = deck.pop();
            if (selectedRule.includes(card)) {
                playerCards.push(card);
                addCardToBoard(playerBoard, card);
                break;
            } else {
                dealerCards.push(card);
                addCardToBoard(dealerBoard, card);
                updateDealerHandStrength();
            }
            await delay(500);
        }

        while (dealerCards.length < 8 && deck.length > 0) {
            let card = deck.pop();
            if (!dealerCards.includes(card)) {
                dealerCards.push(card);
                addCardToBoard(dealerBoard, card);
                updateDealerHandStrength();
            }
            await delay(500);
        }

        if (playerCards.length === 5) {
            checkWinner();
        }
    }

    function addCardToBoard(board, card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', card.suit);
        cardElement.innerHTML = `<div class="card-value">${card.value}</div>`;
        board.appendChild(cardElement);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function checkWinner() {
        console.log("Checking winner");
        const playerHandStrength = evaluateHand(playerCards);
        const dealerHandStrength = evaluateHand(dealerCards);
        if (playerHandStrength > dealerHandStrength) {
            wins++;
            resultMessage.innerText = 'You Win!';
        } else if (playerHandStrength === dealerHandStrength) {
            losses++;
            resultMessage.innerText = 'You Lose! Dealer wins on tie.';
        } else {
            losses++;
            resultMessage.innerText = 'You Lose!';
        }
        updateScore();
        results.style.display = 'block';
    }

    function evaluateHand(cards) {
        // Implement Texas Hold'em hand evaluation logic here
        return Math.random(); // Placeholder for actual hand strength
    }

    function resetGame() {
        console.log("Resetting game");
        results.style.display = 'none';
        startScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        goButton.style.display = 'block';
        gameBoard.style.display = 'none';
        selectedRule = [];
        playerCards = [];
        dealerCards = [];
        gameInProgress = false;
        updateDealerHandStrength();
    }

    function updateScore() {
        winsCounter.innerText = wins;
        lossesCounter.innerText = losses;
    }

    function updateDealerHandStrength() {
        dealerHandStrength.innerText = evaluateDealerHand(dealerCards);
    }

    function evaluateDealerHand(cards) {
        // Placeholder: actual hand strength evaluation logic should go here
        return "Hand strength logic not implemented";
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
