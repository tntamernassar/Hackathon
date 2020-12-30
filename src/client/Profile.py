
WAITING = 1
CONNECTING = 2
WAITING_FOR_GAME_START = 3
GAME_STARTED = 4


class Profile:
    _profile = None

    @staticmethod
    def init_instance(network_adapter, team_name):
        Profile(network_adapter, team_name)

    @staticmethod
    def get_instance():
        return Profile._profile

    def __init__(self, network_adapter, team_name):
        self.team_name = team_name
        self.network_adapter = network_adapter
        self.mode = WAITING
        Profile._profile = self

    def set_mode(self, mode):
        self.mode = mode

    def connect_to_game(self, port, addr):
        try:
            self.network_adapter.make_tcp_connection(addr, port)
            return True
        except Exception as e:
            print(e)
            return False
