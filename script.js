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
        const suits = ['h', 'd', 'c', 's'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({value, suit});
            }
        }
        return deck;
    }

    function displayCards() {
        cardsContainer.innerHTML = '';
        const suits = ['h', 'd', 'c', 's'];
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
        shuffle(deck);

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
            await delay(timedelay);
        }

        // while (dealerCards.length < 8 && deck.length > 0) {
        //     let card = deck.pop();
        //     if (!dealerCards.includes(card)) {
        //         dealerCards.push(card);
        //         addCardToBoard(dealerBoard, card);
        //         updateDealerHandStrength();
        //     }
        //     await delay(500);
        // }

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

        let player_cards_str = [];
        for (let card of playerCards){
            console.log(card)
            player_cards_str.push(card.value+card.suit)
            console.log(card.value+card.suit)
        }
        var playerHand = Hand.solve(player_cards_str);
        console.log(playerHand.descr);
        console.log(playerHand.rank)

        let dealer_cards_str = [];
        for (let card of dealerCards){
            console.log(card)
            dealer_cards_str.push(card.value+card.suit)
            console.log(card.value+card.suit)
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
        
        if ( Object.keys(winner).length == 2){
            losses++;
            resultMessage.innerText = 'You Lose! Dealer wins on tie.';
        }
        else{
            let win = 0;
            for (let card of playerCards){
                if(winner[0].cards[0].value==card.value && winner[0].cards[0].suit==card.suit){
                    wins++;
                    resultMessage.innerText = 'You Win!';
                    win = 1;
                    break;
                }
            }
            if (win == 0){
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
        // dealerHandStrength.innerText = "not implemented";
        // dealerHandStrength.innerText = evaluateDealerHand(dealerCards);
    }

    function evaluateDealerHand(cards) {
        // Placeholder: actual hand strength evaluation logic should go here
        return "Hand strength logic not implemented";
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
