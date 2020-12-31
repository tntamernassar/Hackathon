from src.server import NetworkAdapter, Game, Utils
import time


def waiting_for_clients(network_adapter):
    offer_requests = 10
    while offer_requests != 0:
        network_adapter.broadcast(Utils.make_offer_request(network_adapter))
        offer_requests -= 1
        time.sleep(1)


def game_mode(network_adapter):
    if Game.Game.get_instance().players_id == 0:
        print("No players have been registered, sending requests again ...")
    else:
        Game.Game.get_instance().set_mode(Game.PLAYING)
        network_adapter.send_to_connections(Utils.make_welcome_message())
        time.sleep(10)
        Game.Game.get_instance().set_mode(Game.RESTARTING)
        network_adapter.send_to_connections(Utils.game_over())
        network_adapter.kill_all_connections()


def run(udp_dest_port):
    # initialize network adapter
    network_adapter = NetworkAdapter.NetworkAdapter(udp_dest_port)

    while True:
        # waiting for clients mode
        waiting_for_clients(network_adapter)
        # game mode
        game_mode(network_adapter)
        # restart network adapter
        network_adapter.restart()
        # restart game instance
        Game.Game.get_instance().restart()

run(13117)
