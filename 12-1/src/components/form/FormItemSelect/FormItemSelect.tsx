import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

type Props = {
  label: string;
  name: string;
  options: any;
  isMulti?: boolean;
  invalid?: boolean;
  invalidMessage?: string;
  readonly?: boolean;
  onProductChange?: (product: { value: string }) => void;
};

function FormItemSelect({
  label,
  name,
  options,
  isMulti = true,
  invalid,
  invalidMessage,
  readonly = false,
  onProductChange,
}: Props) {
  const { getValues, setValue } = useFormContext();

  const handleSelect = (value: any) => {
    setValue(name, value, { shouldValidate: true });
    onProductChange && onProductChange(value);
  };

  return (
    <div className="d-flex py-1 align-items-center">
      <span className="card-text col-4">{label}</span>
      <span className="card-text flex-grow-1">
        <Select
          name={name}
          isMulti={isMulti}
          onChange={handleSelect}
          value={getValues(name)}
          options={options}
          closeMenuOnSelect={!isMulti}
          isDisabled={readonly}
          components={{
            IndicatorSeparator: () => null,
          }}
          styles={{
            control: (styles: any, { isFocused }: { isFocused: boolean }) => {
              return {
                ...styles,
                borderColor: isFocused
                  ? '#dee2e6'
                  : invalid
                  ? '#fd625e'
                  : '#dee2e6',
                maxHeight: 160,
                overflowY: 'scroll',
                borderRadius: 4,
              };
            },
            placeholder: (styles: any) => {
              return {
                ...styles,
                color: '#111',
              };
            },
            valueContainer: (styles: any) => {
              return {
                ...styles,
                padding: '2px 10px',
              };
            },
          }}
        />
        {!!invalid && (
          <span className="text-danger d-block invalid-feedback">
            {invalidMessage}
          </span>
        )}
      </span>
    </div>
  );
}

export default memo(FormItemSelect);
