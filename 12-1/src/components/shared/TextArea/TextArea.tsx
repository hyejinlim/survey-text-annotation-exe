import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'react';
import { memo } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import clsx from 'clsx';
import str from '~/utils/str';

type ChangeEventType = {
  name: string;
  value: string;
};
export type Props = {
  children?: React.ReactNode;
  name?: string;
  value?: any;
  placeholder?: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  minLength?: number;
  autoFocus?: boolean;
  onChange?: (item: ChangeEventType) => void;
  [key: string]: any;
  disabled?: any;
};

function TextArea({
  children,
  name = str.random(),
  value = '',
  minLength = -1,
  error,
  autoFocus = false,
  onChange,
  disabled,
  ...args
}: Props) {
  const ref = useRef<any>(null);
  const [text, setText] = useState<string>(value);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setText(value);

    onChange && onChange({ name, value });
  };
  const updateTextAreaHeight = () => {
    if (ref.current) {
      ref.current.style.height = 'auto'; // 초기화
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  /**
   * useEffect
   */
  const update = () => {
    if (value !== undefined) setText(value);
  };
  useEffect(update, [value]);
  useEffect(() => {
    if (ref.current && autoFocus) {
      ref.current.focus();
    }
  }, [autoFocus]);

  return (
    <Fragment>
      <textarea
        ref={ref}
        className={clsx('form-control ', {
          'border border-danger':
            !!error || (!!text?.length && text?.length < minLength),
        })}
        value={text}
        onChange={handleTextChange}
        disabled={disabled}
        name={name}
        {...(minLength > -1 ? { minLength } : {})}
        {...args}
        onInput={updateTextAreaHeight}
      />
      {!!text?.length && text?.length < minLength && (
        <span className="text-danger d-block invalid-feedback">
          {minLength}자 이상 작성해주세요.
        </span>
      )}
    </Fragment>
  );
}

export default memo(TextArea);
