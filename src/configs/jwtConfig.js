module.exports = {
    JSONWebTokens: {
      secret: 'ZLZO7AWXUqBTlEM/7fy0Y7QHK90wmLJZwJxV56fWbfTZYkwcM2zlkejADoitO1c7F8POoRcZkWpFgHed87UlIb94e2WdCRq55RJdIQdTDvlcwHpj6nVS4c+qC6e2CSZ45zKi8r7VOUNcBGfcV2BM5dFP4a02h4zsiwt5X/nWjzx9gD2MrbKIAtURABYLTwb3C7BMI/3vsxo44QNl2AJMY5XuFGqYhjLHDuRyl7IPSlk8uI9NwHoblgYJAsj0plsXqbC2vvcAvFp06bhJ/+2ouzNO64LL5KeOXKODZBCIoNAjggzvRfGYiSObp57gjN27KXis1zL8q07phGRx9sDnRA==',
      tokens: {
        access: {
          type: 'access',
          expiresIn: '1h',
        },
        refresh: {
          type: 'refresh',
          expiresIn: '30d',
        },
      },
    },
  };
  