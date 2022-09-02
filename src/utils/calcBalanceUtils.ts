export async function calcBalance(recharges: any[], payments: any[]) {
  const rechargesTotal = calcAmount(recharges);
  const paymentsTotal = calcAmount(payments);

  function calcAmount(transactions: any[]) {
    const transactionsAmount = transactions.map(
      (transaction) => transaction.amount
    );
    return transactionsAmount.reduce((previous, current) => previous + current);
  }

  return rechargesTotal - paymentsTotal;
}
