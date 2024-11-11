import { memo } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  UncontrolledDropdown,
} from 'reactstrap';
import * as styles from './styles';

type Props = {
  columns?: any;
  onFilterItem?: (id: string) => void;
};
function TableToolbar({ columns, onFilterItem }: Props) {
  const handleFilterItem = (id: string) => {
    onFilterItem && onFilterItem(id);
  };

  return (
    <div className="btn-group">
      <div className="btn-group" role="group">
        {/* column filter */}
        <UncontrolledDropdown>
          <DropdownToggle type="button" color="secondary">
            <i className="bx bx-filter-alt" />
          </DropdownToggle>
          <DropdownMenu css={styles.dropdownMenu}>
            {columns.map((column: any) => {
              const { id, Header: header, isHidden } = column;
              if (id === 'selection') return null;
              return (
                <div key={id}>
                  <DropdownItem
                    toggle={false}
                    onClick={handleFilterItem.bind(null, id)}
                  >
                    <Input
                      css={styles.checkbox}
                      value={header}
                      type="checkbox"
                      checked={!isHidden}
                      {...column.getToggleHiddenProps()}
                    />
                    <Label>{header}</Label>
                  </DropdownItem>
                </div>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  );
}
export default memo(TableToolbar);
