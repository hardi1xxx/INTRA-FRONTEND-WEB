export const parseStatus = (statusParam?: any): any => {
  const status = statusParam?.toString().toLowerCase();
  if (status == "all") return undefined;
  if (status == "active") return 1;
  if (status == "inactive") return 0;
  return statusParam;
};
