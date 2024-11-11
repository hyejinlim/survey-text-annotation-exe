import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import queryString from 'query-string';
import { transBadgeColor } from '~/components/functions';
import * as styles from './styles';

const columns = (selectedValues: any) => {
  const filteredColumns = [
    { Header: 'ID', accessor: 'surveyId', width: 70 },
    {
      Header: '제목',
      accessor: 'surveyTitle',
      Cell: ({ value, row }: any) => {
        const { surveyId } = row.original;
        const queryParams = queryString.stringify(selectedValues);
        return (
          <Link to={{ pathname: `/survey/${surveyId}`, search: queryParams }}>
            <span css={styles.anchor}>{value}</span>
          </Link>
        );
      },
      width: 400,
    },
    { Header: '주제', accessor: 'surveyTopicDetailName', width: 100 },
    { Header: '산업분야', accessor: 'surveyIndustryName', width: 70 },
    { Header: '작업자', accessor: 'labelingMemberName', width: 70 },
    {
      Header: '상태',
      accessor: 'surveyStatus',
      width: 70,
      Cell: (cellProps: any) => {
        const { surveyStatus, surveyStatusName } = cellProps.row.original;
        const badgeColor = transBadgeColor(surveyStatus);
        return (
          <div className="d-flex flex-column gap-1">
            <Badge color="" className={badgeColor}>
              {surveyStatusName}
            </Badge>
          </div>
        );
      },
    },
  ].filter((column) => column !== null);

  return filteredColumns;
};

export { columns };
