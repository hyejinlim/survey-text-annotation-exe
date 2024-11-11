import { memo } from 'react';
import { Alert } from 'reactstrap';

type Props = {
  children: React.ReactNode;
  color: string;
};

function GuideAlert({ children, color }: Props) {
  return (
    <Alert color={color} className="font-size-16">
      {children}
    </Alert>
  );
}

export default memo(GuideAlert);
