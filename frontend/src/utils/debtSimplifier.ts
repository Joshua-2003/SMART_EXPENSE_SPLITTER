import { SimplifiedDebt, GroupMember } from '../types';

/**
 * Debt Simplification Algorithm
 * Matches net debtors to net creditors to minimize total payment transactions needed.
 */
export function calculateSimplifiedDebts(members: GroupMember[]): SimplifiedDebt[] {
  // Separate into debtors (balance > 0.01) and creditors (balance < -0.01)
  const debtors: { id: string; name: string; amount: number }[] = [];
  const creditors: { id: string; name: string; amount: number }[] = [];

  members.forEach((m) => {
    if (m.balance > 0.01) {
      debtors.push({ id: m.userId, name: m.name, amount: m.balance });
    } else if (m.balance < -0.01) {
      creditors.push({ id: m.userId, name: m.name, amount: Math.abs(m.balance) });
    }
  });

  const results: SimplifiedDebt[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settledAmount = Math.min(debtor.amount, creditor.amount);
    if (settledAmount > 0.01) {
      results.push({
        fromUserId: debtor.id,
        fromUserName: debtor.name,
        toUserId: creditor.id,
        toUserName: creditor.name,
        amount: Math.round(settledAmount * 100) / 100,
      });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount <= 0.01) dIdx++;
    if (creditor.amount <= 0.01) cIdx++;
  }

  return results;
}
