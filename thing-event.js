const WebSocket = require('reconnecting-websocket');

module.exports = RED => {
  RED.nodes.registerType('thing-event', function(config) {
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
      ws.send(
        JSON.stringify({
          messageType: 'addEventSubscription',
          data: { [config.event]: {} },
        }),
      );
    });

    ws.addEventListener('close', event => {
      this.status({ fill: 'red', shape: 'ring', text: 'disconnected' });
    });

    ws.addEventListener('message', event => {
      const { messageType, data } = JSON.parse(event.data);
      if (messageType !== 'event') {
        return;
      }
      this.send({
        thing: config.deviceId,
        event: config.event,
        payload: data[config.event],
      });
    });

    this.on('close', () => {
      ws.close();
    });
  });
};
