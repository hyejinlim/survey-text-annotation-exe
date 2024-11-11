import { memo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
} from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { fetchNoticeList } from '~/api/fetches/fetchBoard';
import {
  fetchSurveyStatisticsCard,
  fetchSurveyStatisticsCardDetail,
} from '~/api/fetches/fetchStatistics';
import Breadcrumb from '~/components/shared/Breadcrumb';
import Loading from '~/components/shared/Loading';
import StatisticsCard from '~/components/shared/StatisticsCard';
import StatisticsTable from '~/components/shared/StatisticsTable';
import * as styles from './styles';

function DashboardSurvey() {
  const navigate = useNavigate();
  const [statisticsId, setStatisticsId] = useState<number>(1);
  const [noticeData, setNoticeData] = useState([]);

  // 전체 통계
  const { data: statisticsCard, isLoading: statisticsCardLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => fetchSurveyStatisticsCard(),
  });

  // 개별 통계 상세
  const { data: statisticsCardDetail } = useQuery({
    queryKey: ['statisticsDetail', { type: statisticsId }],
    queryFn: () => fetchSurveyStatisticsCardDetail({ type: statisticsId }),
  });

  // 공지사항 리스트
  const { data: noticeList, isLoading: noticeListLoading } = useQuery({
    queryKey: ['noticeList'],
    queryFn: fetchNoticeList,
  });

  const handleCardClick = (id: number) => {
    setStatisticsId(id);
  };

  const handleNoticeClick = (id: number) => {
    navigate(`/board/notice/${id}`);
  };

  useEffect(() => {
    if (noticeList) {
      const selectedData = noticeList.response.payload.slice(0, 4);
      setNoticeData(selectedData);
    }
  }, [noticeList]);

  if (statisticsCardLoading || noticeListLoading) {
    return (
      <div className="page-content">
        <Loading />
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="대시보드" breadcrumbItem="12-1 대시보드" />
        <StatisticsCard
          data={statisticsCard?.response?.payload}
          onClick={handleCardClick}
          useButton={true}
        />
        <Row>
          <Col xs={8}>
            <StatisticsTable
              data={statisticsCardDetail?.response?.payload?.tabledata}
              group={statisticsCardDetail?.response?.payload?.colgroup}
            />
          </Col>
          <Col xs={4}>
            <Card>
              <CardHeader
                className="d-flex justify-content-between"
                css={styles.cardHeader}
              >
                <h5>공지사항</h5>
                <Link to="/board/notice">+ 더보기</Link>
              </CardHeader>
              <CardBody>
                {noticeData.length > 0 ? (
                  noticeData.map((notice: any) => {
                    const { id, title, createdate } = notice;
                    return (
                      <Table className="table mb-0" key={id}>
                        <colgroup>
                          <col />
                          <col width="30%" />
                        </colgroup>
                        <tbody>
                          <tr
                            css={styles.anchor}
                            onClick={() => handleNoticeClick(id)}
                          >
                            <td>{title}</td>
                            <td>{createdate}</td>
                          </tr>
                        </tbody>
                      </Table>
                    );
                  })
                ) : (
                  <div className="d-felx justify-content-center text-center">
                    <strong>데이터가 없습니다.</strong>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default memo(DashboardSurvey);
