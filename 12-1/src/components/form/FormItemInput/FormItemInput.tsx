import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormFeedback } from 'reactstrap';
import TextField from '~/components/shared/TextField';

type Props = {
  label: string;
  name: string;
  invalid?: boolean;
  invalidMessage?: string;
  type?: 'number' | 'text' | 'search' | 'password' | 'email' | undefined;
  disabled?: boolean;
  readonly?: boolean;
  onClick?: () => void;
};
function FormItemInput({
  label,
  name,
  invalid,
  invalidMessage,
  type = 'text',
  disabled = false,
  readonly = false,
  onClick,
}: Props) {
  const { getValues, setValue } = useFormContext();

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    setValue(name, value, { shouldValidate: true });
  };

  return (
    <div className="d-flex py-1 align-items-center">
      <span className="card-text col-4">{label}</span>
      <span className="card-text flex-grow-1">
        <TextField
          name={name}
          value={getValues(name) ?? ''}
          onChange={handleChange}
          type={type}
          invalid={invalid}
          disabled={disabled}
          readOnly={readonly}
          onClick={onClick}
          onFocus={
            readonly ? (document.activeElement as HTMLElement).blur() : null
          }
        />
        {!!invalid && (
          <FormFeedback type="invalid">{invalidMessage}</FormFeedback>
        )}
      </span>
    </div>
  );
}
export default memo(FormItemInput);
