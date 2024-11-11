import Group from './Group';

type Props = {
  onChange?: (value: string) => void;
  name?: string;
  value?: string | number;
  checked?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  defaulted?: boolean;
  className?: string;
};

function Radio({ onChange, name = 'radio', value, checked, children }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <label className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
      />
      {children}
    </label>
  );
}
Radio.Group = Group;
export default Radio;
