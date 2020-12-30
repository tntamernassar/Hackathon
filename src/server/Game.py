import random, threading

REGISTERING_PLAYERS = 1
PLAYING = 2
RESTARTING = 3


def synchronized(func):
    func.__lock__ = threading.Lock()

    def synced_func(*args, **kws):
        with func.__lock__:
            return func(*args, **kws)

    return synced_func


class Game:
    _game = None

    @staticmethod
    def get_instance():
        if Game._game is None:
            Game()
        return Game._game

    def __init__(self):
        self.mode = REGISTERING_PLAYERS
        self.groups = {}

        self.players_id = 0
        self.players = {}

        self.score = {1: {}, 2: {}}

        Game._game = self

    def set_mode(self, mode):
        self.mode = mode

    def keyboard_press(self, connection_handler_id, key):
        player_name = self.players[connection_handler_id]
        player_group = self.groups[player_name]
        self.score[player_group][player_name] += 1

    @synchronized
    def register_player(self, player_name):
        player_id = self.players_id
        self.players[player_id] = player_name
        self.players_id += 1

        r = int(random.random() * 10)
        if r % 2 == 0:
            self.groups[player_name] = 1
            self.score[1][player_name] = 0
        else:
            self.groups[player_name] = 2
            self.score[2][player_name] = 0

        return player_id

    def player_message(self, connection_handler_id, message):
        if self.mode == REGISTERING_PLAYERS:
            return self.register_player(message.replace("\n", ""))
        elif self.mode == PLAYING:
            if connection_handler_id != -1:
                self.keyboard_press(connection_handler_id, message)
            return connection_handler_id
        else:
            return connection_handler_id

    def restart(self):
        self.set_mode(REGISTERING_PLAYERS)
        self.groups = {}
        self.players_id = 0
        self.players = {}
        self.score = {1: {}, 2: {}}
