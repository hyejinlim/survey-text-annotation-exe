export const transInspectionType = (inspectionId: string | undefined) => {
  switch (inspectionId) {
    case '1':
      return 'I1';
    case '2':
      return 'I2';
    case 'final':
      return 'F';
    default:
      return 'I1';
  }
};
