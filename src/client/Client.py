import NetworkAdapter, Profile
from pynput.keyboard import Listener
import threading


def game_mode(network_adapter):
    welcome_msg = network_adapter.tcp_recover()
    if welcome_msg is None:
        return
    print(welcome_msg.decode())
    Profile.Profile.get_instance().set_mode(Profile.GAME_STARTED)

    # create a thread for keyboard events listener
    # on each keyboard click send msg over tcp
    # if the msg is failed to send, then the connection is closed and the game is over
    # create socket close listener to close the keyboard listener
    def on_press(listener):
        def _(key):
            try:
                network_adapter.send_tcp_message(str(key))
            except:
                listener.stop()
        return _
    with Listener() as keyboard_listener:
        keyboard_listener.on_press = on_press(keyboard_listener)

        def socket_close_listener():
            while True:
                if not network_adapter.tcp_connected():
                    keyboard_listener.stop()
                    break

        socket_close_thread = threading.Thread(target=socket_close_listener)
        socket_close_thread.start()  # start socket close listener
        keyboard_listener.join()  # Join the listener thread to the main thread to keep waiting for keys


def connecting_to_server(offer, addr):
    def get_port(offer):
        port_bytes = [offer[5], offer[6]]
        return int.from_bytes(port_bytes, 'little')
    Profile.Profile.get_instance().set_mode(Profile.CONNECTING)
    return Profile.Profile.get_instance().connect_to_game(get_port(offer), addr)


def looking_for_server(network_adapter):
    def is_offer(offer):
        return True if offer is not None and len(offer) == 7 and offer[0] == 254 and offer[1] == 237 and offer[2] == 190 and offer[3] == 239 else False
    offer, addr = network_adapter.udp_recover()
    while not is_offer(offer):
        offer, addr = network_adapter.udp_recover()

    network_adapter.clear_udp()
    return offer, addr


def run(udp_listening_port, team_name):
    # initialize network adapter
    network_adapter = NetworkAdapter.NetworkAdapter(udp_listening_port)

    # initialize profile
    Profile.Profile.init_instance(network_adapter, team_name)

    print("Client started, listening for offer requests...")
    while True:
        searching_for_game = True
        while searching_for_game:
            # start offer sniffing
            offer, addr = looking_for_server(network_adapter)
            print("Received offer from", addr[0], ", attempting to connect...")
            # attempt to connect
            connected = connecting_to_server(offer, addr[0])
            if connected:
                Profile.Profile.get_instance().set_mode(Profile.WAITING_FOR_GAME_START)
                network_adapter.send_tcp_message(team_name + "\n")
                searching_for_game = False

        # entering game mode
        game_mode(network_adapter)
        print("\nServer disconnected, listening for offer requests...\n")

run(2020, 'makaveli')
