import { memo } from 'react';
import { Table } from 'reactstrap';
import * as styles from './styles';

type Props = {
  data: any;
  group?: any;
};

function StatisticsTable({ data, group }: Props) {
  return (
    <div className="table-responsive">
      <Table className="table table-bordered mb-0">
        {group?.length > 0 && (
          <colgroup>
            {group?.map((width: any, index: number) => {
              return <col key={index} width={width} />;
            })}
          </colgroup>
        )}
        <tbody css={styles.tbody}>
          {data?.map((data: any, index: number) => {
            return (
              <tr key={index}>
                {data?.map((td: any, index: number) => {
                  const {
                    rowspan,
                    text,
                    colspan,
                    backgroundcolor,
                    color,
                    fontsize,
                    fontwidget,
                  } = td;
                  return (
                    <td
                      key={index}
                      rowSpan={rowspan}
                      colSpan={colspan}
                      style={{
                        backgroundColor: backgroundcolor,
                        color,
                        fontSize: fontsize,
                        fontWeight: fontwidget,
                      }}
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default memo(StatisticsTable);
