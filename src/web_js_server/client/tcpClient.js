const net = require('net');

/**
 * TCP Client Adapter (Singleton).
 * Manages a single, continuous TCP connection to the recommendation server.
 * Implements a request queue to safely handle concurrent HTTP requests
 * over a single TCP socket without data overlap.
 */
class TcpClientAdapter {
    /**
     * Initializes the client state and the request queue.
     * @param {string} host_ip - The target recommendation server IP.
     * @param {number} port - The target recommendation server port.
     */     
    constructor(host_ip, port) {
        this.host = host_ip;
        this.port = port;
        this.client = null;
        
        // Queue to manage concurrent requests from multiple users
        this.requestQueue = [];
        this.isProcessing = false;
    }

    /**
     * Establishes the continuous TCP connection.
     * @returns {Promise} Resolves when successfully connected.
     */
    connect() {
        return new Promise((resolve, reject) => {
            if (this.client) {
                return resolve(); // Already connected
            }

            this.client = new net.Socket();

            this.client.connect(this.port, this.host, () => {
                console.log(`[TCP] Connected globally to ${this.host}:${this.port}`);
                resolve();
            });

            this.client.on('error', (err) => {
                console.error('[TCP] Global Error:', err.message);
                reject(err);
            });
        });
    }

    /**
     * Public method used by Services to send data.
     * Adds the request to the queue and returns a Promise that will resolve
     * when this specific request reaches the front of the queue and completes.
     * @param {string} payload - The message to send.
     * @returns {Promise<string>} The isolated response for this specific payload.
     */
    send(payload) {
        return new Promise((resolve, reject) => {
            // Push the request along with its Promise controllers into the queue
            this.requestQueue.push({ payload, resolve, reject });
            
            // Trigger the queue processor
            this.processNextRequest();
        });
    }

    /**
     * Internal method that processes the queue sequentially.
     * Ensures only one active read/write cycle happens at a time over the socket.
     */
    processNextRequest() {
        // If we are currently waiting for a response, or the queue is empty, do nothing
        if (this.isProcessing || this.requestQueue.length === 0) {
            return;
        }
        // Case where the connection is lost while we have pending requests
        if (!this.client || this.client.destroyed) {
            // Flush the queue with errors if the connection is dead
            while (this.requestQueue.length > 0) {
                const req = this.requestQueue.shift();
                req.reject(new Error('TCP Client is not connected.'));
            }
            return;
        }
        // Mark that we are now processing a request and
        this.isProcessing = true;
        const currentRequest = this.requestQueue.shift();
        let responseData = '';

        const onData = (chunk) => {
            responseData += chunk.toString();
            // For making sure we get all the data.
            const isMessageComplete = (data) => {
                // For GET requests, we expect a "200 OK" followed by 2 \n, and then
                // the actual response data, which also ends with a \n. 
                if (data.toLowerCase().includes('200 ok')) {
                    const parts = data.split('\n\n');
                    // we split the data into a array of 2 parts, and our data should be in the second part. 
                    if (parts.length > 1 && parts[1].endsWith('\n')) {
                        return true;
                    }
                    // Case where we haven't received the full response yet.
                    return false; 
                }
                // For all other requests, we just check if the data ends with a newline character,
                // which indicates the end of the response.
                return data.endsWith('\n');
            }

            if (isMessageComplete(responseData)) {
                cleanup();
                this.isProcessing = false;
                
                // Resolve the specific Promise for this specific request
                currentRequest.resolve(responseData.trim());
                
                // Immediately process the next request in line
                this.processNextRequest();
            }
        };
        // Case where the connection is lost while waiting for a response
        const onError = (err) => {
            cleanup();
            this.isProcessing = false;
            currentRequest.reject(err);
            this.processNextRequest(); // Try to move on to the next one
        };
        // Helper function to clean up listeners after this request is done (success or error)
        const cleanup = () => {
            this.client.removeListener('data', onData);
            this.client.removeListener('error', onError);
        };

        // Attach temporary listeners for this specific request
        this.client.on('data', onData);
        this.client.on('error', onError);

        // Dispatch the payload to the C++ server
        this.client.write(currentRequest.payload);
    }
}

// Pull the host and port from the Docker environment
const host = process.env.CPP_SERVER_HOST || '127.0.0.1';
const port = process.env.CPP_SERVER_PORT || 8080;

// Instantiate exactly ONE instance of the adapter (Singleton pattern)
const globalTcpClient = new TcpClientAdapter(host, port);

// Export the single instance, NOT the class
module.exports = globalTcpClient;