const WebSocket = require('reconnecting-websocket');

module.exports = RED => {
  RED.nodes.registerType('thing-property-in', function(config) {
    RED.nodes.createNode(this, config);

    const gateway = RED.nodes.getNode(config.gateway);

    if (!gateway) {
      return;
    }

    const ws = new WebSocket(
      `${gateway.url}/${config.deviceId}?jwt=${gateway.token}`,
      'webthing',
    );

    ws.addEventListener('open', () => {
      this.status({ fill: 'green', shape: 'dot', text: 'connected' });
    });

    ws.addEventListener('close', event => {
      this.status({ fill: 'red', shape: 'ring', text: 'disconnected' });
    });

    ws.addEventListener('message', event => {
      const { messageType, data } = JSON.parse(event.data);
      if (messageType !== 'propertyStatus') {
        return;
      }
      if (!(config.property in data)) {
        return;
      }
      this.send({
        thing: config.deviceId,
        property: config.property,
        payload: data[config.property],
      });
    });

    this.on('close', () => {
      ws.close();
    });
  });
};
