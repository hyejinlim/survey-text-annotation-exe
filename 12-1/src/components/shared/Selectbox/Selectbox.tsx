import { memo, useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import str from '~/utils/str';

export type SelectionType = {
  label: string;
  value: any;
  disabled?: boolean;
};

export type ChangeEventType = {
  name: string;
  value: any;
};

export type Props = {
  children?: React.ReactNode;
  name?: string;
  value?: any;
  items: SelectionType[];
  placeholder?: string;
  onChange?: (items: ChangeEventType) => void;
  [key: string]: any;
};

function Selectbox({
  children,
  items = [],
  name = str.random(),
  value,
  placeholder,
  item,
  onChange = () => {},
  ...args
}: Props) {
  const [selected, setSelected] = useState(value);
  const handleSelect = (e: any) => {
    onChange && onChange({ name, value: e.target.value });
  };

  /**
   * useEffect
   */
  const update = () => {
    if (value !== undefined) setSelected(value);
  };
  useEffect(update, [value]);

  return (
    <Input type="select" value={selected} onChange={handleSelect} {...args}>
      {placeholder && <option value="">{placeholder}</option>}
      {items.map((option: SelectionType) => {
        const { label, value, disabled } = option;
        return (
          <option key={value} value={value} disabled={disabled}>
            {label}
          </option>
        );
      })}
      {item && <option value="">{placeholder}</option>}
    </Input>
  );
}

export default memo(Selectbox);
