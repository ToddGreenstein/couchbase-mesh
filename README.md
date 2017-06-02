# couchbase-mesh
Couchbase fully meshed XDCR 5 cluster environment using docker-compose.  Includes a
- **nodejs utility** for provisioning
- **go application: setrack** for load generation (precompiled for linux)

## REQUIREMENTS
- **Clone this repo**   
- **docker-compose version 1.11 (support for version 3 yml) or greater**   
- **To run and build in one command**   
docker-compose up --build -d   
- **To fully mesh the XDCR Network**   
./mesh.sh   
- **To add some user profile data (this will execute against cbdb5)**   
curl -X POST http://localhost:8000/api/users/gen   
- **To add 1000 activities (this will execute against cbdb5)**   
curl -X POST http://localhost:8000/api/activity/gen/5/10000

## TOPOLOGY
Refer to docker-compose.yml for cluster (service) names and host ports
