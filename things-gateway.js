module.exports = RED => {
  RED.nodes.registerType(
    'things-gateway',
    function ThingsGateway(config) {
      RED.nodes.createNode(this, config);
      this.url = config.url;
      this.token = this.credentials.token;
    },
    {
      credentials: {
        token: { type: 'password' },
      },
    },
  );
};
