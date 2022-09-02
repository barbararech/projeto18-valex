export async function calcBalance(recharges: any[], payments: any[]) {
  const rechargesTotal = calcAmount(recharges);
  const paymentsTotal = calcAmount(payments);

  return rechargesTotal - paymentsTotal;
}

function calcAmount(transactions: any[]) {
  const transactionsAmount = transactions.map(
    (transaction) => transaction.amount
  );

  if (transactionsAmount.length === 0) {
    return 0;
  }
  return transactionsAmount.reduce((previous, current) => previous + current);
}
