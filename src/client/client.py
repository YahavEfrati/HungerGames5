import sys
import socket 

def main():
    if (len(sys.argv) != 3):
        sys.exit(1)
    
    server_ip = sys.argv[1]

    try:
        server_port = int(sys.argv[2])
    except:
        sys.exit(1)
    

    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        client_socket.connect((server_ip, server_port))

        # Now we start sending commands to the server
        while True:
            try:
                # Read the user input
                user_input = input() + "\n"

                client_socket.sendall(user_input.encode('utf-8'))

                response = client_socket.recv(4096)

                if not response:
                    break

                print(response.decode('utf-8'), end="")
                    

            except KeyboardInterrupt:
                break
            except Exception as e:
                break


    except ConnectionRefusedError:
        sys.exit(1)
    except Exception as e:
        sys.exit(1)       
    finally:
        client_socket.close()

        

if __name__ == "__main__":
    main()
    
