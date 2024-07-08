import math
import random
def game():
    cardindex = ['2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', 'Jh', 'Qh', 'Kh', 'Ah', 
                '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', '10c', 'Jc', 'Qc', 'Kc', 'Ac', 
                '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '10d', 'Jd', 'Qd', 'Kd', 'Ad', 
                '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s', 'Js', 'Qs', 'Ks', 'As']
    
    def convert_list(list):
        '''
        convert indices to cards
        '''
        result = []
        for i in range(len(list)):
            result.append(cardindex[list[i]])
        return result
    
    def subgame():
        deck = []
        for i in range(52):
            deck.append(i)
        
        player = []
        dealer = []
        while(True):
            
            rand = random.randrange(0,len(deck))
            card = deck[rand]
            deck.remove(card)
            print(cardindex[card]) 
            while(True):
                val = input("Action: ")
                if val == 'y':
                    player.append(card)
                    player.sort()
                    break
                    
                elif val == 'n':
                    dealer.append(card)
                    dealer.sort()
                    break
                elif val == 'w':
                    return 1
                elif val == 'l':
                    return 0
                else:
                    print('invalid input')

            print("player: ", convert_list(player), "  dealer: ", convert_list(dealer))
            if val == 'y':
                input("make new rule: ")

    wins = 0
    losses = 0
    while(True):
        val = input("Play?: ")
        if val == 'y':
            result = subgame()
            if result == 1:
                wins+=1
            elif result == 0:
                losses+=1
            print('wins: ', wins, '  losses: ', losses, '  winratio: ', wins/(wins+losses))
        elif val == 'n':
            break
        else:
            print('invalid input')
game()