import { memo } from 'react';
import { Table } from 'reactstrap';
import CollapseBox from '~/components/shared/CollapseBox';

type Props = {
  data: any;
};

function InspectionLog({ data }: Props) {
  return (
    <CollapseBox title="검수 이력" isOpen={false}>
      <Table bordered size="sm" className="text-center">
        <thead className="table-light table-nowrap shadow-sm">
          <tr>
            <th className="text-center">검수자</th>
            <th className="text-center">검수상태</th>
            <th className="text-center">메시지</th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data?.map((log: any, index: number) => {
              const { member, step, message } = log;
              return (
                <tr key={index}>
                  <td className="align-middle">{member}</td>
                  <td className="align-middle">{step}</td>
                  <td className="align-middle">{message}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="p-4">
                검수 이력이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </CollapseBox>
  );
}

export default memo(InspectionLog);
