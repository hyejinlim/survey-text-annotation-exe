import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import queryString from 'query-string';
import { transBadgeColor } from '~/components/functions';
import * as styles from './styles';

const columns = (selectedValues: any, type: 'I1' | 'I2' | 'F') => {
  const urlInspectionId = () => {
    switch (type) {
      case 'I1':
        return 1;
      case 'I2':
        return 2;
      case 'F':
        return 'final';
    }
  };
  const filteredColumns = [
    { Header: 'ID', accessor: 'interviewId', width: 70 },
    {
      Header: '제목',
      accessor: 'interviewTitle',
      Cell: ({ value, row }: any) => {
        const { interviewId } = row.original;
        const queryParams = queryString.stringify(selectedValues);
        const path = `/interview/inspection/${urlInspectionId()}/${interviewId}`;
        return (
          <Link to={{ pathname: path, search: queryParams }}>
            <span css={styles.anchor}>{value}</span>
          </Link>
        );
      },
      width: 400,
    },
    { Header: '주제', accessor: 'interviewTopicName', width: 100 },
    { Header: '세부 주제', accessor: 'interviewTopicDetailName', width: 70 },
    { Header: '작업자', accessor: 'labelingMemberName', width: 70 },
    { Header: '검수자', accessor: 'inspectionMemberName', width: 70 },
    {
      Header: '상태',
      accessor: 'inspectionValue',
      width: 70,
      Cell: (cellProps: any) => {
        const { inspectionValue, inspectionValueName } = cellProps.row.original;
        const badgeColor = transBadgeColor(inspectionValue);

        return (
          <div className="d-flex flex-column gap-1">
            <Badge color="" className={badgeColor}>
              {inspectionValueName}
            </Badge>
          </div>
        );
      },
    },
  ].filter((column) => column !== null);

  return filteredColumns;
};

export { columns };
