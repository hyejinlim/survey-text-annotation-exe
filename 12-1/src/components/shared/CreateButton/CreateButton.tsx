import { memo } from 'react';
import { Button } from 'reactstrap';
import * as styles from './styles';

type Props = {
  title: string;
  color?: string;
  isDownload?: boolean;
  onClick?: () => void;
  downloadUrl?: string;
};
function CreateButton({
  title,
  color,
  isDownload,
  onClick,
  downloadUrl,
}: Props) {
  if (isDownload) {
    return (
      <a css={styles.download} href={downloadUrl} download>
        {title}
      </a>
    );
  }

  return (
    <Button color={color} onClick={onClick}>
      {title}
    </Button>
  );
}

export default memo(CreateButton);
