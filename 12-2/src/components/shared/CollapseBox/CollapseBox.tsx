import { ReactNode, memo, useState } from 'react';
import { Collapse } from 'reactstrap';
import clsx from 'clsx';
import * as styles from './styles';

type Props = {
  title: string | React.ReactNode;
  children: ReactNode;
  isOpen: boolean;
};
function CollapseBox({ title, children, isOpen = false }: Props) {
  const [open, setOpen] = useState<boolean>(isOpen);
  const handleCollapse = () => {
    setOpen(!open);
  };

  return (
    <div className="accordion" id="accordion">
      <div className="accordion-item border-0">
        <h2 className="accordion-header">
          <div
            role="button"
            className={clsx('accordion-button', {
              collapsed: !isOpen,
            })}
            onClick={handleCollapse}
            css={styles.title}
          >
            {title}
          </div>
        </h2>
        <Collapse isOpen={open} className="accordion-collapse">
          {children}
        </Collapse>
      </div>
    </div>
  );
}

export default memo(CollapseBox);
