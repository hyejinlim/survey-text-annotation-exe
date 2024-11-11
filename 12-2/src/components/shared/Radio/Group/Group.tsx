import { useEffect, useState } from 'react';
import * as styles from './styles';
import Radio from '../Radio';

type Props = {
  onChange?: (value: string) => void;
  name?: string;
  value?: string;
  checked?: boolean;
  items: { value: string | number; label: string }[];
  textBackground?: Record<string, string>;
};

function Group({
  onChange,
  value: propsValue,
  name = 'radio-group',
  items,
  textBackground,
}: Props) {
  const [value, setValue] = useState(propsValue);

  const handleChange = (value: string) => {
    setValue(() => value);
    onChange?.(value);
  };

  /**
   * useEffect
   */
  const update = () => {
    if (propsValue !== undefined) setValue(propsValue);
  };
  useEffect(update, [propsValue]);

  return (
    <div className="d-flex gap-3">
      {items.map(({ label, value: itemValue }) => {
        const isChecked = itemValue === value;
        const backgroundColor = textBackground?.[itemValue] || '';
        return (
          <div className="pl-4 pr-4" key={itemValue}>
            <Radio
              value={itemValue}
              name={name}
              onChange={handleChange}
              checked={isChecked}
            >
              <span css={styles.text(backgroundColor)}>{label}</span>
            </Radio>
          </div>
        );
      })}
    </div>
  );
}

export default Group;
