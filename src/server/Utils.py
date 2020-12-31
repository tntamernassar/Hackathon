from src.server import Game


def make_offer_request(network_adapter):
    magic_cookie = "feedbeef"
    tcp_socket = network_adapter.tcp_running_port
    msg_type = 2
    arr = []
    arr.extend(bytes.fromhex(magic_cookie))
    arr.extend([msg_type])
    arr.extend(tcp_socket.to_bytes(2, 'little'))
    return arr


def make_welcome_message():
    groups = Game.Game.get_instance().groups
    welcome = "Welcome to Keyboard Spamming Battle Royale.\n"
    welcome += "Group 1:\n==\n"
    for player in groups:
        if groups[player] == 1:
            welcome += " " + player + "\n"
    welcome += "\nGroup 2:\n==\n"
    for player in groups:
        if groups[player] == 2:
            welcome += " " + player + "\n"
    welcome += "\nStart pressing keys on your keyboard as fast as you can!!\n"
    return welcome


def game_over():
    score = Game.Game.get_instance().score
    result = "\nGame Over !\n"
    g1_score = g2_score = 0
    for s in score[1]:
        g1_score += score[1][s]
    for s in score[2]:
        g2_score += score[2][s]

    result += "Group 1 typed in" + " " + str(g1_score) + " " + "characters. Group 2 typed in" + " " + str(g2_score) + " " + "characters.\n"
    if g1_score == g2_score:
        result += "TEKO !\n"
    else:
        winner = 1 if g1_score > g2_score else 2
        result += "Group" + " " + str(winner) + " " + "wins !\n"
        result += "Congratulations to the winners:\n==\n"
        for player in score[winner]:
            result += "  " + player

    result += "\n"
    print(result)
    return result
