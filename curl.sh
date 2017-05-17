#!/bin/bash
##################################################
##  Curl Script to fully mesh an XDCR network
##   Requires docker environment to run
##   Fully meshes 5 cluster xdcr environment
##   UNSECURE PASSWORDS LISTED
##################################################

###############
## Setup Cluster References
###############

## cbdb1 8091
curl -u Administrator:password -X POST 'http://localhost:8091/pools/default/remoteClusters'  -d 'hostname=cbdb2:8091&name=cbdb2&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:8091/pools/default/remoteClusters'  -d 'hostname=cbdb3:8091&name=cbdb3&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:8091/pools/default/remoteClusters'  -d 'hostname=cbdb4:8091&name=cbdb4&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:8091/pools/default/remoteClusters'  -d 'hostname=cbdb5:8091&name=cbdb5&password=password&username=Administrator'

## cbdb2 9091
curl -u Administrator:password -X POST 'http://localhost:9091/pools/default/remoteClusters'  -d 'hostname=cbdb1:8091&name=cbdb1&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:9091/pools/default/remoteClusters'  -d 'hostname=cbdb3:8091&name=cbdb3&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:9091/pools/default/remoteClusters'  -d 'hostname=cbdb4:8091&name=cbdb4&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:9091/pools/default/remoteClusters'  -d 'hostname=cbdb5:8091&name=cbdb5&password=password&username=Administrator'

## cbdb3 10091
curl -u Administrator:password -X POST 'http://localhost:10091/pools/default/remoteClusters'  -d 'hostname=cbdb1:8091&name=cbdb1&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:10091/pools/default/remoteClusters'  -d 'hostname=cbdb2:8091&name=cbdb2&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:10091/pools/default/remoteClusters'  -d 'hostname=cbdb4:8091&name=cbdb4&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:10091/pools/default/remoteClusters'  -d 'hostname=cbdb5:8091&name=cbdb5&password=password&username=Administrator'

## cbdb4 11091
curl -u Administrator:password -X POST 'http://localhost:11091/pools/default/remoteClusters'  -d 'hostname=cbdb1:8091&name=cbdb1&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:11091/pools/default/remoteClusters'  -d 'hostname=cbdb2:8091&name=cbdb2&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:11091/pools/default/remoteClusters'  -d 'hostname=cbdb3:8091&name=cbdb3&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:11091/pools/default/remoteClusters'  -d 'hostname=cbdb5:8091&name=cbdb5&password=password&username=Administrator'

## cbdb5 12091
curl -u Administrator:password -X POST 'http://localhost:12091/pools/default/remoteClusters'  -d 'hostname=cbdb1:8091&name=cbdb1&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:12091/pools/default/remoteClusters'  -d 'hostname=cbdb2:8091&name=cbdb2&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:12091/pools/default/remoteClusters'  -d 'hostname=cbdb3:8091&name=cbdb3&password=password&username=Administrator'

curl -u Administrator:password -X POST 'http://localhost:12091/pools/default/remoteClusters'  -d 'hostname=cbdb4:8091&name=cbdb4&password=password&username=Administrator'


###############
## Start Replications
###############

## cbdb1 8091
curl -u Administrator:password -X POST 'http://localhost:8091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb2&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:8091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb3&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:8091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb4&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:8091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb5&type=xmem&workerBatchSize=500'

## cbdb2 9091
curl -u Administrator:password -X POST 'http://localhost:9091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb1&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:9091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb3&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:9091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb4&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:9091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb5&type=xmem&workerBatchSize=500'

## cbdb3 10091
curl -u Administrator:password -X POST 'http://localhost:10091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb1&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:10091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb2&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:10091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb4&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:10091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb5&type=xmem&workerBatchSize=500'

## cbdb4 11091
curl -u Administrator:password -X POST 'http://localhost:11091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb1&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:11091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb2&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:11091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb3&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:11091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb5&type=xmem&workerBatchSize=500'

## cbdb5 12091
curl -u Administrator:password -X POST 'http://localhost:12091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb1&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:12091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb2&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:12091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb3&type=xmem&workerBatchSize=500'

curl -u Administrator:password -X POST 'http://localhost:12091/controller/createReplication'  -d 'checkpointInterval=1800&docBatchSizeKb=2048&failureRestartInterval=10&fromBucket=default&logLevel=Info&optimisticReplicationThreshold=256&replicationType=continuous&sourceNozzlePerNode=2&statsInterval=1000&targetNozzlePerNode=2&toBucket=default&toCluster=cbdb4&type=xmem&workerBatchSize=500'
