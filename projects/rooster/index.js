// Maverick Protocol
const { sumTokens2 } = require("../helper/unwrapLPs");
const { getLogs2 } = require("../helper/cache/getLogs");

function maverickTVL(config) {
  const exports = {};

  Object.keys(config).forEach((chain) => {
    const { factories } = config[chain];
    exports[chain] = {
      tvl: async (api) => {
        let logs = [];
        for (let k = 0; k < factories.length; k++) {
          logs.push(
            ...(await getLogs2({
              api,
              target: factories[k].address,
              fromBlock: factories[k].startBlock,
              eventAbi:
                "event PoolCreated(address poolAddress,uint8 protocolFeeRatio,uint256 feeAIn,uint256 feeBIn,uint256 tickSpacing,uint256 lookback,int32 activeTick,address tokenA,address tokenB,uint8 kinds,address accessor)",
            }))
          );
        }

        console.log(api)
        console.log(logs.map((i) => [[i.tokenA, i.tokenB], i.poolAddress]))
        console.log(sumTokens2({
          api,
          ownerTokens: logs.map((i) => [[i.tokenA, i.tokenB], i.poolAddress]),
        }))

        return sumTokens2({
          api,
          ownerTokens: logs.map((i) => [[i.tokenA, i.tokenB], i.poolAddress]),
        });
      },
    };
  });

  return exports;
}

module.exports = maverickTVL({
  plume: {
    factories: [
      {
        address: "0x056A588AfdC0cdaa4Cab50d8a4D2940C5D04172E",
        startBlock: 91951,
      },
    ],
  },
});
