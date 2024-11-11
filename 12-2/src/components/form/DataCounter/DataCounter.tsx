import { memo } from 'react';
import { Button } from 'reactstrap';

type Props = {
  name: string;
  value: number;
  onMinusCount: (name: string) => void;
  onPlusCount: (name: string) => void;
  disabled?: boolean;
};

function DataCounter({
  name,
  value,
  onMinusCount,
  onPlusCount,
  disabled = false,
}: Props) {
  const handleMinusCount = () => {
    onMinusCount && onMinusCount(name);
  };
  const handlePlusCount = () => {
    onPlusCount && onPlusCount(name);
  };
  return (
    <div className="d-flex align-items-center">
      <Button
        color="light"
        size="sm"
        onClick={handleMinusCount}
        disabled={value < 1 || disabled}
      >
        <i className="fas fa-minus" />
      </Button>
      <span className="px-4">{value}</span>
      <Button
        color="light"
        size="sm"
        onClick={handlePlusCount}
        disabled={disabled}
      >
        <i className="fas fa-plus" />
      </Button>
    </div>
  );
}

export default memo(DataCounter);
