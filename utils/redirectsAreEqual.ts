type Redirect = { to: string; from: string; status: number };

const redirectsAreEqual = (redirect1: Redirect, redirect2: Redirect): boolean => {
  if (redirect1.to === redirect2.to && redirect1.from === redirect2.from && redirect1.status === redirect2.status) {
    return true;
  }
  return false;
};

export default redirectsAreEqual;
