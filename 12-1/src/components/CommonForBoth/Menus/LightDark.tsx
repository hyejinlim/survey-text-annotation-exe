import { memo } from 'react';
import Icon from '@ailibs/feather-react-ts';
import { layoutTheme } from '../../../constants/layout';

type LightDarkStateType = {
  layoutMode: string;
  onChangeLayoutMode: any;
};

function LightDark({ layoutMode, onChangeLayoutMode }: LightDarkStateType) {
  const mode =
    layoutMode === layoutTheme['DARKMODE']
      ? layoutTheme['LIGHTMODE']
      : layoutTheme['DARKMODE'];
  return (
    <div className="dropdown d-none d-sm-inline-block">
      <button
        onClick={() => onChangeLayoutMode(mode)}
        type="button"
        className="btn header-item"
      >
        {layoutMode === layoutTheme['DARKMODE'] ? (
          <Icon name="sun" className="icon-lg layout-mode-light" />
        ) : (
          <Icon name="moon" className="icon-lg layout-mode-dark" />
        )}
      </button>
    </div>
  );
}

export default memo(LightDark);
