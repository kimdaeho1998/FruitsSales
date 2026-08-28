export type PaymentConfirmation = { paymentKey: string; orderId: string; amount: number };
export async function confirmPayment(_input: PaymentConfirmation): Promise<never> { throw new Error("Toss Payments is not configured in this scaffold."); }
export async function cancelPayment(_paymentKey: string, _reason: string): Promise<never> { throw new Error("Toss Payments is not configured in this scaffold."); }
