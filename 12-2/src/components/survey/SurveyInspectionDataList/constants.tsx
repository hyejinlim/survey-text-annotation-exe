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
    { Header: 'ID', accessor: 'labelingId', width: 70 },
    { Header: '설문지ID', accessor: 'surveyId', width: 70 },
    {
      Header: '제목',
      accessor: 'surveyTitle',
      Cell: ({ value, row }: any) => {
        const { surveyId, labelingId } = row.original;
        const queryParams = queryString.stringify(selectedValues);
        const path = `/survey/inspection/${urlInspectionId()}/${surveyId}/${labelingId}`;
        return (
          <Link to={{ pathname: path, search: queryParams }}>
            <span css={styles.anchor}>{value}</span>
          </Link>
        );
      },
      width: 400,
    },
    { Header: '문항번호', accessor: 'surveyQNum', width: 100 },
    { Header: '산업분야', accessor: 'surveyIndustryName', width: 70 },
    { Header: '작업자', accessor: 'labelingMemberName', width: 70 },
    { Header: '검수자', accessor: 'inspectionMemberName', width: 70 },
    {
      Header: '상태',
      accessor: 'surveyStatus',
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
