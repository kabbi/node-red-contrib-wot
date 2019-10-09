const fetch = require('node-fetch');

module.exports = RED => {
  RED.nodes.registerType('thing-property-out', function(config) {
    RED.nodes.createNode(this, config);

    const gateway = RED.nodes.getNode(config.gateway);

    if (!gateway) {
      return;
    }

    this.on('input', async msg => {
      const response = await fetch(
        `${gateway.url}/${config.deviceId}/properties/${config.property}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${gateway.token}`,
          },
          body: JSON.stringify({
            [config.property]: msg.payload,
          }),
        },
      );
      if (!response.ok) {
        this.warn(`Failed to make request: ${response.status}`);
      }
    });
  });
};
