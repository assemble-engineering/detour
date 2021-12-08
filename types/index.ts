export type RedirectType = {
  from: string;
  to: string;
  status: string;
};

export type BranchJSON = {
  redirects: RedirectType[];
};
