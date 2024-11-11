import { Fragment } from 'react';

type Props = {
  children: React.ReactNode;
};
function NonAuthLayout({ children }: Props) {
  return <Fragment>{children}</Fragment>;
}

export default NonAuthLayout;
