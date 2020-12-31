import socket, threading
import scapy.all as Scapy

BUFFER_SIZE = 1024


def get_ip(interface=Scapy.conf.iface):
    return Scapy.get_if_addr(interface)


class NetworkAdapter:
    def __init__(self, udp_listening_port):
        self.udp_listening_port = udp_listening_port
        # Setting up UDP socket
        self.udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        self.udp_socket.bind(("", udp_listening_port))
        # Setting up TCP socket
        self.tcp_socket = None

    def udp_recover(self):
        try:
            return self.udp_socket.recvfrom(BUFFER_SIZE)
        except:
            return None, None

    def clear_udp(self):
        def _clear():
            self.udp_socket.settimeout(1.5)
            offer, addr = self.udp_recover()
            while True:
                if offer is None and addr is None:
                    break
                else:
                    offer, addr = self.udp_recover()
            self.udp_socket.settimeout(None)

        clear_thread = threading.Thread(target=_clear)
        clear_thread.start()

    def make_tcp_connection(self, port, addr):
        self.tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.tcp_socket.connect((addr, port))

    def send_tcp_message(self, message):
        self.tcp_socket.send(message.encode())

    def tcp_recover(self):
        try:
            return self.tcp_socket.recv(BUFFER_SIZE)
        except Exception as e:
            return None

    def tcp_connected(self):
        try:
            self.tcp_socket.recv(1)
            return True
        except:
            return False
