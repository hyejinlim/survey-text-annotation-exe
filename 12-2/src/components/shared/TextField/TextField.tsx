import { Fragment, useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import str from '~/utils/str';

type Props = {
  type?: 'text' | 'password' | 'number' | 'email' | 'search';
  name?: string;
  value?: any;
  maxLength?: number;
  invalid?: boolean;
  onChange?: (e: any) => void;
  [key: string]: any;
};

function TextField({
  type = 'text',
  name = str.random(),
  value = '',
  maxLength = -1,
  invalid,
  onChange,
  ...args
}: Props) {
  const [text, setText] = useState<string>(value);

  const handleTextChange = (content: string | number) => {
    content = content.toString();

    if (text !== content) {
      setText(content);
      onChange && onChange({ name, value: content });
    }
  };

  /**
   * useEffect
   */
  const update = () => {
    if (value !== undefined) setText(value);
  };
  useEffect(update, [value]);

  return (
    <Fragment>
      <Input
        type={type}
        name={name}
        value={text}
        invalid={invalid}
        {...(maxLength > -1 ? { maxLength } : {})}
        onChange={({ target }: any) =>
          handleTextChange(target.value.toString())
        }
        {...args}
      />
    </Fragment>
  );
}

export default TextField;
