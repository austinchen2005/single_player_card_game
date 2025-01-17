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
    const selectButtons = document.getElementById('select-buttons');
    const rowSelectButtons = document.getElementById('row-select-buttons');
 
    const suits = ['h', 'd', 'c', 's'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

    let selectedRule = [];
    let playerCards = [];
    let dealerCards = [];
    let deck = [];
    let wins = 0;
    let losses = 0;
    let gameInProgress = false;
    let gameFinished = false;

    let timedelay = 100;

    const allCards = generateDeck();

    startGameButton.addEventListener('click', () => {
        console.log("Start Game button clicked");
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';

        playerBoard.innerHTML = '';
        dealerBoard.innerHTML = '';
        deck = [...allCards];

        displayCards();
    });

    goButton.addEventListener('click', async () => {
        if (gameInProgress || gameFinished) return;
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

        // Add column select buttons
        selectButtons.innerHTML = '';
        values.forEach((value, colIndex) => {
            const selectButton = document.createElement('button');
            selectButton.innerText = 'Select';
            selectButton.addEventListener('click', () => {
                toggleColumnSelection(value, colIndex);
            });
            selectButtons.appendChild(selectButton);
        });

        // Add row select buttons
        rowSelectButtons.innerHTML = '';
        suits.forEach((suit, rowIndex) => {
            const rowButton = document.createElement('button');
            rowButton.innerText = 'Select';
            rowButton.addEventListener('click', () => {
                toggleRowSelection(suit, rowIndex);
            });
            rowSelectButtons.appendChild(rowButton);
        });

        // Display cards
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

        updateButtonLabels();
    }

    function toggleCardSelection(cardElement, card) {
        if (!gameInProgress && !cardElement.classList.contains('invalid')) {
            if (selectedRule.includes(card)) {
                selectedRule = selectedRule.filter(c => c !== card);
                cardElement.classList.remove('selected');
            } else {
                selectedRule.push(card);
                cardElement.classList.add('selected');
            }

            updateButtonLabels();
        }
    }

    function toggleColumnSelection(value, colIndex) {
        const columnCards = Array.from(cardsContainer.querySelectorAll(`.card-value`))
            .filter(cardValue => cardValue.innerText === value)
            .map(cardValue => cardValue.parentElement);

        const allSelected = columnCards.every(cardElement => cardElement.classList.contains('selected'));

        columnCards.forEach(cardElement => {
            const card = allCards.find(card => card.value === value && card.suit === cardElement.classList[1]);
            if (!allSelected) {
                if (!cardElement.classList.contains('selected')) {
                    cardElement.classList.add('selected');
                    selectedRule.push(card);
                }
            } else {
                cardElement.classList.remove('selected');
                selectedRule = selectedRule.filter(c => c !== card);
            }
        });

        updateButtonLabels();
        // selectButtons.children[colIndex].innerText = allSelected ? 'Select' : 'Deselect';
    }

    function toggleRowSelection(suit, rowIndex) {
        const rowCards = Array.from(cardsContainer.querySelectorAll(`.card.${suit}`));

        const allSelected = rowCards.every(cardElement => cardElement.classList.contains('selected'));

        rowCards.forEach(cardElement => {
            const card = allCards.find(card => card.value === cardElement.querySelector('.card-value').innerText && card.suit === suit);
            if (!allSelected) {
                if (!cardElement.classList.contains('selected')) {
                    cardElement.classList.add('selected');
                    selectedRule.push(card);
                }
            } else {
                cardElement.classList.remove('selected');
                selectedRule = selectedRule.filter(c => c !== card);
            }
        });

        updateButtonLabels();
        // rowSelectButtons.children[rowIndex].innerText = allSelected ? 'Select' : 'Deselect';
    }

    function updateButtonLabels() {
        values.forEach((value, colIndex) => {
            const columnCards = Array.from(cardsContainer.querySelectorAll(`.card-value`))
                .filter(cardValue => cardValue.innerText === value)
                .map(cardValue => cardValue.parentElement);

            const allSelected = columnCards.every(cardElement => cardElement.classList.contains('selected'));
            selectButtons.children[colIndex].innerText = allSelected ? 'Deselect' : 'Select';
        });

        suits.forEach((suit, rowIndex) => {
            const rowCards = Array.from(cardsContainer.querySelectorAll(`.card.${suit}`));
            const allSelected = rowCards.every(cardElement => cardElement.classList.contains('selected'));
            rowSelectButtons.children[rowIndex].innerText = allSelected ? 'Deselect' : 'Select';
        });
    }

    function inactivateCard(cardElement) {
        cardElement.classList.add('invalid');
    }

    async function dealCards() {
        shuffle(deck);

        while (playerCards.length < 5 && deck.length > 0) {
            let card = deck.pop(); 
            const cardElement = Array.from(cardsContainer.querySelectorAll('.card'))
                .find(cardElem => cardElem.querySelector('.card-value').innerText === card.value && cardElem.classList.contains(card.suit));
            if (cardElement) inactivateCard(cardElement, card);
            if (selectedRule.includes(card)) {
                playerCards.push(card);
                addCardToBoard(playerBoard, card);
                break;
            } else {
                dealerCards.push(card);
                addCardToBoard(dealerBoard, card);
                updateDealerHandStrength();
            }
            await delay(timedelay);
        }

        if (playerCards.length === 5) {
            while (dealerCards.length < 8) {
                let card = deck.pop();
                dealerCards.push(card);
                addCardToBoard(dealerBoard, card);
                updateDealerHandStrength();
                await delay(timedelay);
            }
            checkWinner();
        }
    }

    function addCardToBoard(board, card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', card.suit);
        cardElement.innerHTML = `<div class="card-value">${card.value}</div>`;
        board.appendChild(cardElement);
        sortBoard(board);
    }

    function sortBoard(board) {
        const cards = Array.from(board.querySelectorAll('.card')).map(cardElem => {
            const value = cardElem.querySelector('.card-value').innerText;
            const suit = cardElem.classList[1];
            return { value, suit, element: cardElem };
        });

        cards.sort((a, b) => {
            const valueOrder = '23456789TJQKA';
            if (valueOrder.indexOf(a.value) !== valueOrder.indexOf(b.value)) {
                return valueOrder.indexOf(b.value) - valueOrder.indexOf(a.value);
            } else {
                const suitOrder = 'cdhs';
                return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
            }
        });

        board.innerHTML = '';
        cards.forEach(card => board.appendChild(card.element));
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function checkWinner() {
        console.log("Checking winner");
        gameFinished = true;

        let player_cards_str = [];
        for (let card of playerCards) {
            console.log(card)
            player_cards_str.push(card.value + card.suit)
            console.log(card.value + card.suit)
        }
        var playerHand = Hand.solve(player_cards_str);
        console.log(playerHand.descr);
        console.log(playerHand.rank)

        let dealer_cards_str = [];
        for (let card of dealerCards) {
            console.log(card)
            dealer_cards_str.push(card.value + card.suit)
            console.log(card.value + card.suit)
        }
        var dealerHand = Hand.solve(dealer_cards_str);
        console.log(dealerHand.descr);
        var winner = Hand.winners([playerHand, dealerHand])
        console.log('hello')
        console.log(winner)
        console.log(winner[0].descr)
        console.log(typeof winner)
        console.log(winner[0].cards[0])
        console.log(winner[0].cards[0] in dealerCards)
        console.log(winner[0].cards[0].value)
        console.log(dealerCards[0].value)
        console.log(Object.keys(winner).length)

        if (Object.keys(winner).length == 2) {
            losses++;
            resultMessage.innerText = 'You Lose! Dealer wins on tie.';
        }
        else {
            let win = 0;
            for (let card of playerCards) {
                if (winner[0].cards[0].value == card.value && winner[0].cards[0].suit == card.suit) {
                    wins++;
                    resultMessage.innerText = 'You Win!';
                    win = 1;
                    break;
                }
            }
            if (win == 0) {
                losses++;
                resultMessage.innerText = 'You Lose!';
            }
        }

        console.log(resultMessage)
        updateScore();
        results.style.display = 'block';
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
        console.log(wins.toString())
        winsCounter.innerText = wins.toString();
        lossesCounter.innerText = losses.toString();
    }

    function updateDealerHandStrength() { 
        let dealer_cards_str = [];
        for (let card of dealerCards) {
            dealer_cards_str.push(card.value + card.suit)
        }
        var dealerHand = Hand.solve(dealer_cards_str);
        dealerHandStrength.innerText = dealerHand.descr;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
