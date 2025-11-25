# Server setup

# Update system packages
sudo apt-get update 
sudo apt-get upgrade -y

# Install mosquitto
sudo apt-get install mosquitto mosquitto-clients -y

# Configure mosquitto
sudo nano /etc/mosquitto/mosquitto.conf
# Add the following lines to the configuration file:
# listener 1883
# listener 9001
# protocol websockets

# Start mosquitto and enable it to start on boot
sudo systemctl start mosquitto
sudo systemctl enable mosquitto

# Install docker
sudo apt-get install docker.io -y
# docker --version

# Start docker and enable it to start on boot
sudo systemctl start docker
sudo systemctl enable docker

# Create a docker network
sudo docker network create mongodb-net

# Create the initialization script
mkdir mongodb
cd mongodb
sudo nano mongodb-init.js
# ...
sudo nano Dockerfile
# FROM mongo
# COPY mongodb-init.js /docker-entrypoint-initdb.d/
# CMD ["mongod", "--bind_ip_all"]

# Pull the official MongoDB image
sudo docker pull mongo

# Run MongoDB container with the setup script
# sudo docker run -d --name mongodb --network mongodb-net -p 27017:27017 -v ~/mongodb/mongodb-init.js:/docker-entrypoint-initdb.d/mongodb-init.js:ro -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=thAoTAseUHDsD68T mongo
sudo docker build -t custom-mongo .
sudo docker run -d --name mongodb --network mongodb-net -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=thAoTAseUHDsD68T custom-mongo


# Node.js backend
mkdir nodejs
cd nodejs
sudo nano Dockerfile

docker build -t custom-nodejs .
docker run -d --name nodejs --network mongodb-net -p 3000:3000 custom-nodejs

docker-compose up -d


# Backend using docker: mongodb + nodejs
docker-compose up --build

## Management
# List all active services
# sudo systemctl list-units --type=service
# List all enabled services
# sudo systemctl list-unit-files --type=service --state=enabled


# Open ports on the cloud server ...

# Test the broker ...

# Setup user authentication

sudo mosquitto_passwd -c /etc/mosquitto/passwd <username>
# enter password (only for test purposes): password
sudo nano /etc/mosquitto/mosquitto.conf
# Add the following lines to the configuration file:
# allow_anonymous false
# password_file /etc/mosquitto/passwd
sudo systemctl restart mosquitto

# Test the broker
# mosquitto_sub -h localhost -t test -u "gpatta" -P "password"
# mosquitto_pub -h localhost -t test -m "hello world" -u "gpatta" -P "password"


## Client certificates

# Install OpenSSL
sudo apt-get install openssl -y

# Create the certificate authority
cd /etc/mosquitto/ca_certificates
# sudo openssl genrsa -out ca.key 2048
sudo openssl genrsa -aes256 -out ca-key.pem 4096  # for a password protected key
# sudo openssl req -new -x509 -days 3650 -key ca.key -out ca.crt
sudo openssl req -new -x509 -sha256 -days 3650 -key ca-key.pem -out ca.pem
# Country Name (2 letter code) [AU]:IT
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:GPatta
# Common Name (e.g. server FQDN or YOUR name) []:gpatta-ca

# openssl x509 -in ca.crt -text -noout    # Check the certificate

# Create the server certificates
cd /etc/mosquitto/certs
sudo openssl genrsa -out server-key.pem 4096
sudo openssl req -new -sha256 -subj "/CN=gpatta" -key server-key.pem -out server.csr
echo "subjectAltName=IP:204.216.214.88" | sudo tee -a extfile.cnf
sudo openssl x509 -req -sha256 -days 3650 -in server.csr -CA /etc/mosquitto/ca_certificates/ca.pem -CAkey /etc/mosquitto/ca_certificates/ca-key.pem -out server.pem -extfile extfile.cnf -CAcreateserial 

# Fullchain certificate (opz?)
# cat server.crt > fullchain.crt
# cat ca.crt >> fullchain.crt

# Create the client certificates
openssl genrsa -out client-key.pem 4096
openssl req -new -sha256 -subj "/CN=gpatta-client" -key client-key.pem -out client.csr
openssl x509 -req -sha256 -days 3650 -in client.csr -CA /etc/mosquitto/ca_certificates/ca.pem -CAkey /etc/mosquitto/ca_certificates/ca-key.pem -out client.pem -CAcreateserial

# Edit mosquitto configuration
sudo nano /etc/mosquitto/mosquitto.conf
# Add the following lines to the configuration file:
# listener 1883
# listener 8883
# listener 8884
# cafile /home/ubuntu/certs/ca.crt
# certfile /home/ubuntu/certs/server.crt
# keyfile /home/ubuntu/certs/server.key
# require_certificate true
# listener 8080
# protocol websockets

# Restart mosquitto
sudo systemctl restart mosquitto


## Iptables configuration

# Install iptables if not already installed
# sudo apt install iptables

# Check iptables rules
# sudo iptables -L -v

# Opening ports
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 1883 -j ACCEPT

# Old rules
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 1883 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8883 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8884 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8080 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 27017 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5000 -j ACCEPT
sudo iptables -A INPUT -i lo -p tcp --dport 27017 -j ACCEPT                     # Allow localhost to connect to MongoDB
sudo iptables -A INPUT -p tcp -s 127.0.0.1 --dport 27017 -j ACCEPT              # Allow localhost to connect to MongoDB
sudo netfilter-persistent save

# Test the broker
# mosquitto_pub -h localhost -p 8883 -u "gpatta" -P "password" --cafile /etc/mosquitto/ca_certificates/ca.crt --cert ~/certs/client.crt --key ~/certs/client.key -t test -m "hello tls" -d --insecure
# mosquitto_sub -h localhost -p 8883 -u "gpatta" -P "password" --cafile /etc/mosquitto/ca_certificates/ca.crt --cert ~/certs/client.crt --key ~/certs/client.key -t test --insecure
# mosquitto_sub -h localhost -p 8883 -u "gpatta" -P "password" --cafile /etc/mosquitto/ca_certificates/ca.pem --cert ~/certs/client.pem --key ~/certs/client-key.pem -t test
# mosquitto_pub -h 204.216.214.88 -p 1883 -u "gpatta" -P "password" -t test -m "hello tls from extern"
# mosquitto_pub -h 204.216.214.88 -p 8883 -u "gpatta" -P "password"  -t test -m "hello tls" -d
# mosquitto_pub -h 204.216.214.88 -p 8883 --cafile ca.crt --cert client.crt --key client.key -u "gpatta" -P "password" -t test -m "hello tls from extern" -d --insecure

# Test con certificati da client esterno (funziona)
# mosquitto_sub -h 204.216.214.88 -p 8883 -u "gpatta" -P "password" --cafile ca.pem --cert client.pem --key client-key.pem -t test
# mosquitto_pub -h 204.216.214.88 -p 8883 --cafile ca.pem --cert client.pem --key client-key.pem -u "gpatta" -P "password" -t test -m "hello tls from extern"
