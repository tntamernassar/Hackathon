import socket
import scapy.all as Scapy
import threading
import ConnectionHandler


def get_ip(interface):
    return Scapy.get_if_addr(interface)


class NetworkAdapter:
    def __init__(self, udp_dest_port, interface=Scapy.conf.iface):
        self.ip = get_ip(interface)
        # Setting up UDP socket
        self.udp_dest_port = udp_dest_port
        self.udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
        self.udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        # setting up TCP socket
        self.tcp_connections = []
        self.tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.tcp_socket.bind((self.ip, 0))
        self.tcp_running_port = self.tcp_socket.getsockname()[1]
        self.tcp_socket.listen(1)
        self.tcp_running = True
        self.tcp_thread = threading.Thread(target=self.tcp_thread)
        self.tcp_thread.start()

    def tcp_thread(self):
        self.tcp_socket.listen(1)
        print("Server started, listening on IP address", self.ip)
        while self.tcp_running:
            sock, addr = self.tcp_socket.accept()
            connection_handler = ConnectionHandler.ConnectionHandler(sock, addr)
            self.tcp_connections.append(connection_handler)
            connection_handler.handle()

    def broadcast(self, bytes_array):
        self.udp_socket.sendto(bytes(bytes_array), ('<broadcast>', self.udp_dest_port))

    def send_to_connections(self, msg):
        for connection_handler in self.tcp_connections:
            connection_handler.send(msg)

    def kill_all_connections(self):
        for connection_handler in self.tcp_connections:
            connection_handler.kill()

    def restart(self):
        self.tcp_connections = []
