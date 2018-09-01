angular.module('eth-sussex-iot')

.service('connectionsService', function($filter){

    var connections = [
        {
            id: 1,
            name: 'Bedroom Lamp',
            host: 'm11.cloudmqtt.com',
            port: 36886,
            username: 'dyzbuxni',
            password: 'm6ssLTmJrOG4',
            publish_topic: 'cmnd/house/lamp/POWER',
            subscribe_topic: 'stat/house/lamp/POWER'
        },

        {
            id: 2,
            name: 'Living Room Fan',
            host: 'm11.cloudmqtt.com',
            port: 36886,
            username: 'dyzbuxni',
            password: 'm6ssLTmJrOG4',
            publish_topic: 'cmnd/house/temp/POWER',
            subscribe_topic: 'stat/house/temp/POWER'
        }
    ];

    this.getConnections = function(){
        return connections;
    }

    this.getConnectionById = function(_id){
        return $filter('filter')(connections, {
            'id': _id
          })
    }

});