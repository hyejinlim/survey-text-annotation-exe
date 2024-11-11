import { Fragment, memo } from 'react';
import SidebarContent from './SidebarContent';

function Sidebar(props: any) {
  return (
    <Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          {props.type !== 'condensed' ? <SidebarContent /> : <SidebarContent />}
        </div>
      </div>
    </Fragment>
  );
}

export default memo(Sidebar);
