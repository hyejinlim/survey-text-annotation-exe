import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import queryString from 'query-string';
import { transBadgeColor } from '~/components/functions';
import * as styles from './styles';

const columns = (selectedValues: any) => {
  const filteredColumns = [
    { Header: 'ID', accessor: 'interviewId', width: 70 },
    {
      Header: '제목',
      accessor: 'interviewTitle',
      Cell: ({ value, row }: any) => {
        const { interviewId } = row.original;
        const queryParams = queryString.stringify(selectedValues);
        return (
          <Link
            to={{ pathname: `/interview/${interviewId}`, search: queryParams }}
          >
            <span css={styles.anchor}>{value}</span>
          </Link>
        );
      },
      width: 400,
    },
    { Header: '주제', accessor: 'interviewTopicName', width: 100 },
    { Header: '세부 주제', accessor: 'interviewTopicDetailName', width: 70 },
    { Header: '작업자', accessor: 'labelingMemberName', width: 70 },
    {
      Header: '상태',
      accessor: 'interviewStatus',
      width: 70,
      Cell: (cellProps: any) => {
        const { interviewStatus, interviewStatusName } = cellProps.row.original;
        const badgeColor = transBadgeColor(interviewStatus);
        return (
          <div className="d-flex flex-column gap-1">
            <Badge color="" className={badgeColor}>
              {interviewStatusName}
            </Badge>
          </div>
        );
      },
    },
  ].filter((column) => column !== null);

  return filteredColumns;
};

export { columns };
