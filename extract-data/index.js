const fs = require("fs");

async function main() {
  const result = await fetch(
    "https://api.helius.xyz/v0/addresses/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/transactions?limit=100&api-key=",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent": "PostmanRuntime/7.36.3",
      },
    }
  );

  let body = await result.json();
  console.log("body", body);

  //filter mint to be only DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
  body = body.filter((x) =>
    x.tokenTransfers.filter(
      (y) => y.toUserAccount == "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
    )
  );

  // body = body.filter(x=> x.type == "TRANSFER");
  body = body.map((x) => {
    return {
      signature: x.signature,
      timestamp: x.timestamp,
      tokenTransfers: x.tokenTransfers
        .filter((y) => y.mint == "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263")
        .map((y) => {
          return {
            fromUserAccount: y.fromUserAccount,
            buyerWallet: y.toUserAccount,
            tokenAmount: y.tokenAmount,
            tokenAddress: y.mint,
            tokenStandard: y.tokenStandard,
          };
        }),
    };
  });

  body = body.filter((x) => x.tokenTransfers.length > 0);

  let transactions = [];
  body.forEach((x) => {
    x.tokenTransfers.forEach((y) => {
      transactions.push({
        timestamp: x.timestamp,
        fromUserAccount: y.fromUserAccount,
        buyerWallet: y.buyerWallet,
        tokenAmount: y.tokenAmount,
        tokenAddress: y.tokenAddress,
      });
    });
  });

  console.log(JSON.stringify(transactions));

  for (let i = 0; i < 10; i++) {
    await processWallet(transactions[i].buyerWallet);
  }
}

async function processWallet(wallet) {
  const result = await fetch(
    `https://api.helius.xyz/v0/addresses/${wallet}/transactions?limit=100&api-key=`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent": "PostmanRuntime/7.36.3",
      },
    }
  );

  let body = await result.json();
//   console.log("body", body);

//   body = body.filter((x) =>
//     x.tokenTransfers.filter((y) => y.toUserAccount == wallet)
//   );

  // body = body.filter(x=> x.type == "TRANSFER");
  body = body.map((x) => {
    return {
      signature: x.signature,
      timestamp: x.timestamp,
      type: x.type,
      tokenTransfers: x.tokenTransfers
        // .filter((y) => y.mint == wallet)
        .map((y) => {
          return {
            fromUserAccount: y.fromUserAccount,
            buyerWallet: y.toUserAccount,
            tokenAmount: y.tokenAmount,
            tokenAddress: y.mint,
            tokenStandard: y.tokenStandard,
          };
        }),
    };
  });

  body = body.filter((x) => x.tokenTransfers.length > 0);

  let transactions = [];
  body.forEach((x) => {
    x.tokenTransfers.forEach((y) => {
      transactions.push({
        signature: x.signature,
        timestamp: x.timestamp,
        fromUserAccount: y.fromUserAccount,
        buyerWallet: y.buyerWallet,
        tokenAmount: y.tokenAmount,
        tokenAddress: y.tokenAddress,
        type: x.type,
      });
    });
  });

  console.log(JSON.stringify(transactions));

  // createa a json file
  fs.writeFile(
    `./${wallet}.json
        `,
    JSON.stringify(transactions),
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
}

main().then(() => {
  console.log("Done!");
});
