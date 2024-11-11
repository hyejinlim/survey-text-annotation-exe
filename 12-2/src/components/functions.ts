export const transBadgeColor = (status: string) => {
  switch (status) {
    case 'Y':
      return 'badge-soft-success';
    case 'F':
    case 'T':
      return 'badge-soft-danger';
    case 'I':
      return 'badge-soft-warning';
    case 'N':
      return 'badge-soft-info';
    case 'M':
      return 'badge-soft-orange';
    case 'C':
      return 'badge-soft-primary';
    default:
      return 'badge-soft-dark';
  }
};
