export const escrowEngine = {
  hold: (inv: any) => ({ status: 'held', id: inv?.id || 'escrow-1' }),
  release: (id: string) => ({ status: 'released', id }),
};
