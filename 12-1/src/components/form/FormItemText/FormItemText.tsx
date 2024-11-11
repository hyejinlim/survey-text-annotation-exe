import { memo } from 'react';

type Props = {
  label: string;
  value: string | number;
};

function FormItemText({ label, value }: Props) {
  return (
    <div className="d-flex py-1 align-items-center">
      <span className="card-text col-4">{label}</span>
      <span className="card-text">{value}</span>
    </div>
  );
}

export default memo(FormItemText);
