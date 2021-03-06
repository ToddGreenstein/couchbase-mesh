'use strict';

var request = require('request');

class cluster {
    constructor(fileName, clusterName) {
        // local json object for Class properties.  ES6 does not
        //  include suport for class properties beyond setter/getters.
        //  The constructor instantiates a "config" and passes this
        //  through the provisioning process.

        // Grab a config
        var config = require('./'+ fileName);
        var locals = {};

        locals.endPoint = clusterName + config.couchbase.endPoint;
        locals.endPointQuery = clusterName + config.couchbase.n1qlService;
        locals.clusterName = clusterName;
        locals.endPointFts = config.couchbase.ftsService;
        locals.hostName = config.couchbase.hostName;
        locals.sampleBucket = config.couchbase.bucket;
        locals.sampleBucketCount = config.thresholdItemCount;
        locals.user = config.couchbase.user;
        locals.password = config.couchbase.password;
        locals.indexerStorageMode = config.couchbase.indexerStorageMode;
        locals.indexMemQuota = config.couchbase.indexMemQuota;
        locals.dataMemQuota = config.couchbase.dataMemQuota;
        locals.ftsMemQuota = config.couchbase.ftsMemoryQuota;
        locals.dataPath = config.couchbase.dataPath;
        locals.indexPath = config.couchbase.indexPath;
        locals.checkInterval = config.application.checkInterval;
        locals.ftsIndex=config.couchbase.ftsIndex;
        locals.finsihed = false;
        locals.currentCount = 0;
        locals.timerWait = "";
        locals.instanceVersion=0;
        locals.bucketType = config.couchbase.bucketType;
        locals.flushEnabled = config.couchbase.flushEnabled;
        locals.evictionPolicy = config.couchbase.evictionPolicy;
        locals.conflictResolutionType = config.couchbase.conflictResolutionType;
        locals.authType = config.couchbase.authType;
        locals.replicaIndex = config.couchbase.replicaIndex;
        locals.replicaNumber = config.couchbase.replicaNumber;
        locals.threadsNumber = config.couchbase.threadsNumber;
        locals.clusterServices = config.couchbase.clusterServices;
        this._locals = locals;
    }

    provision() {
        // Load locals to pass through provisioning sequence
        var locals = this.locals;

        // resolve path issues
        this._resolvePaths(locals);

        // Provision promise chain sequence.  Without binding "this",
        //  scope is not preserved from the caller each time a new
        //  promise is instantiated.

        this._verifyNodejsVersion(locals)
            .then(this._verifyCouchbaseVersion.bind(this))
            .then(this._init)
            .then(this._rename)
            .then(this._storageMode)
            .then(this._services.bind(this))
            .then(this._memory)
            .then(this._admin)
            .then(this._bucket)
            .then(this._bucketOnline.bind(this))
            .then(this._finish.bind(this))
            .catch((err) => {
                console.log("ERR:", err)
            });
    }

    get locals() {
        return this._locals;
    }

    set _currentCount(count){
        this.locals.currentCount=count;
    }

    set _instanceVersion(version){
        this.locals.instanceVersion=version;
    }

    set finished(currentState) {
        this._locals.finished = currrentState;
    }

    _resolvePaths(locals) {
        // Check for custom datapath, otherwise assign to platform default
        if (locals.dataPath == "") {
            if (process.platform == 'darwin') {
                locals.dataPath = "/Users/" + process.env.USER +
                    "/Library/Application Support/Couchbase/var/lib/couchbase/data";
            } else {
                locals.dataPath = "/opt/couchbase/var/lib/couchbase/data";
            }
        }
        // Check for custom indexpath, otherwise assign to platform default
        if (locals.indexPath == "") {
            if (process.platform == 'darwin') {
                locals.indexPath = "/Users/" + process.env.USER +
                    "/Library/Application Support/Couchbase/var/lib/couchbase/data";
            } else {
                locals.indexPath = "/opt/couchbase/var/lib/couchbase/data";
            }
        }
    }

    _init(locals) {
        return new Promise(
            (resolve, reject) => {
                request.post({
                    url: 'http://' + locals.endPoint + '/nodes/self/controller/settings',
                    form: {
                        path: locals.dataPath,
                        index_path: locals.indexPath
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log( "  " + locals.endPoint + " PROVISION INITIALIZE SERVICES:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _rename(locals) {
        return new Promise(
            (resolve, reject) => {
                request.post({
                    url: 'http://' + locals.endPoint + '/node/controller/rename',
                    form: {
                        hostname: locals.hostName
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  " + locals.endPoint + " PROVISION RENAMING:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _storageMode(locals) {
        return new Promise(
            (resolve, reject) => {
                request.post({
                    url: 'http://' + locals.endPoint + '/settings/indexes',
                    form: {
                        storageMode: locals.indexerStorageMode
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  " + locals.endPoint + " PROVISION INDEX STORAGE MODE:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _services(locals) {
        return new Promise(
            (resolve, reject) => {
                var data = {
                    services:locals.clusterServices
                };

                if (locals.ftsMemQuota != "0" && locals.instanceVersion>=4.5) data["services"] += ",fts";

                request.post({
                    url: 'http://' + locals.endPoint + '/node/controller/setupServices',
                    form: data
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  " + locals.endPoint + " PROVISION SERVICES:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _memory(locals) {
        return new Promise(
            (resolve, reject) => {
                var data = {
                    clusterName: locals.clusterName,
                    indexMemoryQuota: locals.indexMemQuota,
                    memoryQuota: locals.dataMemQuota
                };

                if (locals.ftsMemQuota != "0" && locals.instanceVersion>=4.5)
                    data["ftsMemoryQuota"] = locals.ftsMemQuota;

                request.post({
                    url: 'http://' + locals.endPoint + '/pools/default',
                    form: data
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  " + locals.endPoint + " PROVISION MEMORY:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _admin(locals) {
        return new Promise(
            (resolve, reject) => {
                request.post({
                    url: 'http://' + locals.endPoint + '/settings/web',
                    form: {
                        password: locals.password,
                        username: locals.user,
                        port: 'SAME'
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  " + locals.endPoint + " PROVISION ADMIN USER:", httpResponse.statusCode);
                    if(httpResponse.statusCode!=200) console.log("    WARNING:",body);
                    resolve(locals);
                });
            });
    }

    _bucket(locals) {
        return new Promise(
            (resolve, reject) => {
              var data = {
                authType:locals.authType,
                bucketType: locals.bucketType,
                conflictResolutionType: locals.conflictResolutionType,
                evictionPolicy: locals.evictionPolicy,
                flushEnabled:locals.flushEnabled,
                name:locals.sampleBucket,
                otherBucketsRamQuotaMB:0,
                ramQuotaMB:locals.dataMemQuota,
                replicaIndex:locals.replicaIndex,
                replicaNumber:locals.replicaNumber,
                saslPassword:'',
                threadsNumber: locals.threadsNumber
              }

                request.post({
                    url: 'http://' + locals.endPoint + '/pools/default/buckets',
                    form: data,
                    auth: {
                        'user': locals.user,
                        'pass': locals.password,
                        'sendImmediately': true
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("  " + locals.endPoint + " PROVISION BUCKET:", httpResponse.statusCode);
                    if (httpResponse.statusCode == 202) {
                        resolve(locals);
                    }
                    reject(httpResponse.statusCode);
                });
            });
    }

    _instanceExsists(locals) {
        return new Promise(
            (resolve, reject) => {
                request.get({
                    url: "http://" + locals.endPoint + "/pools/default/buckets/",
                    auth: {
                        'user': locals.user,
                        'pass': locals.password,
                        'sendImmediately': true
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject("COUCHBASE INSTANCE AT " + locals.endPoint + " NOT FOUND.");
                        return;
                    }
                    body = JSON.parse(body);
                    for (var i = 0; i < body.length; i++) {
                        if (body[i].name == locals.sampleBucket) {
                            reject("\n  This application cannot provision an already built cluster.\n" +
                                "    BUCKET:" + locals.sampleBucket + " on CLUSTER " +
                                locals.endPoint + " EXISTS\n  The cluster has not been modified.\n");
                        }
                    }
                    resolve(locals);
                });
            });
    }

    _itemCount() {
        return new Promise(
            (resolve, reject)=> {
                request.get({
                    url: "http://" + this.locals.endPoint + "/pools/default/buckets/" + this.locals.sampleBucket,
                    auth: {
                        'user': this.locals.user,
                        'pass': this.locals.password,
                        'sendImmediately': true
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                        resolve(false);
                        return;
                    }
                    if (parseInt(JSON.parse(body).basicStats.itemCount) > this.locals.sampleBucketCount) {
                        resolve(true);
                    }
                    else{
                        this._currentCount=parseInt(JSON.parse(body).basicStats.itemCount);
                        resolve(false);
                    }
                });
            });
    }

    _bucketResponding() {
        return new Promise(
            (resolve, reject)=> {
              if(this.locals.clusterServices=='kv'){
                resolve(true);
              }
              else{
                var data = {
                    statement:"select count(*) from default"
                };
                request.post({
                    url: "http://" + this.locals.endPointQuery + "/query/service" ,
                    auth: {
                        'user': this.locals.user,
                        'pass': this.locals.password,
                        'sendImmediately': true
                    },
                    form: data
                }, (err, httpResponse, body) => {
                    if (err) {
                        resolve(false);
                        return;
                    }
                    if (httpResponse.statusCode==200) {
                        resolve(true);
                    }
                    else{
                        resolve(false);
                    }
                });
              }
            });
    }

    _servicesPublished() {
    return new Promise(
        (resolve, reject)=> {
            request.get({
                url: "http://" + this.locals.endPoint + "/pools/default/b/" + this.locals.sampleBucket,
                auth: {
                    'user': this.locals.user,
                    'pass': this.locals.password,
                    'sendImmediately': true
                }
            }, (err, httpResponse, body) => {
                if (err) {
                    resolve(false);
                }
                if ((JSON.parse(body).nodesExt[0].services.n1ql==8093)||(this.locals.clusterServices=='kv')) {
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            });
        });
      }

    _loaded() {
        return new Promise(
            (resolve, reject)=> {
                this.locals.timerLoop = setInterval(()=> {
                    this._itemCount().then((loaded)=> {
                        if (loaded) {
                            clearInterval(this.locals.timerLoop);
                            process.stdout.write("    LOADING ITEMS:100%  of " +this.locals.sampleBucketCount + " Items");
                            console.log("\n    BUCKET:", this.locals.sampleBucket, "LOADED.");
                            resolve("DONE");
                            return;
                        }
                        process.stdout.write("    LOADING ITEMS:" +
                            Math.round(100*(this.locals.currentCount/this.locals.sampleBucketCount))+ "%  of " +
                            this.locals.sampleBucketCount + " Items\r");
                    });
                }, this.locals.checkInterval);
            }
        );
    }

    _bucketOnline() {
        return new Promise(
            (resolve, reject) => {
                this.locals.timerLoop = setInterval(() => {
                    this._bucketResponding().then((loaded) => {
                        if (loaded) {
                            this._servicesPublished().then((published) => {
                                if (published) {
                                    clearInterval(this.locals.timerLoop);
                                    console.log("   BUCKET:", this.locals.sampleBucket, "READY.");
                                    resolve("DONE");
                                    return;
                                }
                            });
                        }
                        // Waiting for bucket
                    });
                }, this.locals.checkInterval);
            }
        );
    }

    _verifyCouchbaseVersion(locals){
        return new Promise(
            (resolve, reject)=> {
              console.log("WAITING FOR INSTANCE "+this.locals.endPoint +" TO RESPOND")
              this.locals.timerLoop = setInterval(()=> {
                request.get({
                    url: "http://" + this.locals.endPoint + "/pools",
                    auth: {
                        'user': this.locals.user,
                        'pass': this.locals.password,
                        'sendImmediately': true
                    }
                }, (err, httpResponse, body) => {
                    if (err) {
                      // waiting for bucket to become responsive
                    }else{
                    clearInterval(this.locals.timerLoop);
                    console.log(this.locals.endPoint," READY");
                    var ver = (JSON.parse(body).implementationVersion).split(".",2);
                    this._instanceVersion=parseFloat(ver[0]+"."+ver[1]);
                    resolve(locals);
                    return;
                  }
                });},this.locals.checkInterval);
            });
    }

    _verifyNodejsVersion(locals) {
        return new Promise(
            (resolve, reject)=> {
                if (parseInt(((process.version).split("v"))[1].substr(0, 1)) < 4) {
                    reject("\n  The nodejs version is too low.  This application requires\n" +
                        "  ES6 features in order to provision a cluster, specifically: \n" +
                        "    --promises \n    --arrow functions \n    --classes \n" +
                        "  Please upgrade the nodejs version from:\n    --Current " +
                        process.version + "\n    --Minimum:4.0.0");
                } else resolve(locals);
            });
    }

    _finish() {
        return new Promise(
            (resolve, reject)=> {
                //var load = require('./load');
                //load.attempt();
                console.log("Cluster " + this.locals.endPoint + " provisioning complete. \n" +
                            "   To login to couchbase: open a browser " + this.locals.endPoint + "\n" );
                resolve(true);
            });
    }
}

// Export
module.exports = cluster;

// Build Clusters, iterate through loop to catch all cluster service names
//   passed into the docker file at the command line.
process.argv.forEach((val, index) => {
  if(index > 2){
    var c = new cluster(process.argv[2],val);
    c.provision();
  }
});
