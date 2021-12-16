export type RedirectType = {
  from: string;
  to: string;
  status: number;
  id: string;
  mergeStatus: 'UPDATED' | 'DELETED' | 'LIVE' | 'NEW';
};

export type BranchJSON = {
  redirects: RedirectType[];
};
