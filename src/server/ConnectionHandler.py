import threading
from src.server import Game

BUFFER_SIZE = 200


class ConnectionHandler:
    def __init__(self, tcp_socket, address):
        self.tcp_socket = tcp_socket
        self.address = address
        self.game_id = -1

    def handle(self):
        def _handle():
            while True:
                try:
                    data = self.tcp_socket.recv(BUFFER_SIZE)
                    if not data:
                        break
                    else:
                        self.game_id = Game.Game.get_instance().player_message(self.game_id, data.decode())
                except:
                    break

        handle_thread = threading.Thread(target=_handle)
        handle_thread.start()

    def send(self, msg):
        try:
            self.tcp_socket.send(msg.encode())
        except:
            return

    def kill(self):
        try:
            self.tcp_socket.close()
        except:
            pass

