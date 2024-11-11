import { memo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, Nav, NavItem, NavLink } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { fetchMemberInfo } from '~/api/fetches/fetchMember';
import {
  fetchInterviewStatisticsCard,
  fetchInterviewStatisticsCardDetail,
  fetchSurveyStatisticsCard,
  fetchSurveyStatisticsCardDetail,
} from '~/api/fetches/fetchStatistics';
import Breadcrumb from '~/components/shared/Breadcrumb';
import Loading from '~/components/shared/Loading';
import StatisticsCard from '~/components/shared/StatisticsCard';
import StatisticsTable from '~/components/shared/StatisticsTable';
import { MENU0201 } from '~/constants/menu';
import { MEMBER_DETAIL_NAV_ITEMS } from '~/constants/nav';
import { useCheckAuthorityQuery } from '~/hooks';
import * as styles from './styles';

function MemberDetail() {
  const { mid } = useParams();
  const [statisticsData, setStatisticsData] = useState(1);
  const [activeTab, setactiveTab] = useState<'SURVEY' | 'INTERVIEW'>('SURVEY');
  const { data: authority } = useCheckAuthorityQuery(MENU0201);

  const { data: memberInfo, isLoading: memberInfoLoading } = useQuery({
    queryKey: ['memberInfo', mid],
    queryFn: () => fetchMemberInfo(mid),
    enabled: !!mid,
  });

  const fetchedCard = (params: any) => {
    switch (activeTab) {
      case 'SURVEY':
        return fetchSurveyStatisticsCard(params);
      case 'INTERVIEW':
        return fetchInterviewStatisticsCard(params);
    }
  };

  const fetchedCardDetail = (params: any) => {
    switch (activeTab) {
      case 'SURVEY':
        return fetchSurveyStatisticsCardDetail(params);
      case 'INTERVIEW':
        return fetchInterviewStatisticsCardDetail(params);
    }
  };

  // 개인 통계
  const { data: statisticsCard, isLoading: statisticsLoading } = useQuery({
    queryKey: ['statistics', mid, activeTab],
    queryFn: () => fetchedCard(mid),
    enabled: !!mid,
  });

  // 개인 통계 디테일
  const { data: statisticsCardDetail, isLoading: statisticsDetailLoading } =
    useQuery({
      queryKey: ['statisticsDetail', { type: statisticsData, mid }, activeTab],
      queryFn: () => fetchedCardDetail({ type: statisticsData, mid }),
      enabled: !!mid,
    });

  const handleCardClick = (wid: number) => {
    setStatisticsData(wid);
  };

  const handleTab = (tab: 'SURVEY' | 'INTERVIEW') => {
    if (activeTab !== tab) setactiveTab(tab);
  };

  if (memberInfoLoading || statisticsLoading) {
    return (
      <div className="page-content">
        <Loading />
      </div>
    );
  }

  const { name, memberName, largeGroup, middleGroup, groupCode } =
    memberInfo?.response.payload;

  return (
    <div className="page-content">
      <Breadcrumb title="회원" breadcrumbItem="회원 상세" />
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <h4 className="mb-0">{name}</h4>
              <span>{memberName}</span>
            </div>
            <div className="d-flex gap-3">
              <Link to={`/member/${mid}/calendar`} className="btn btn-success">
                월별통계
              </Link>
              {authority?.response?.payload?.menu.menuU && (
                <Link to={`/member/${mid}`} className="btn btn-primary">
                  회원정보수정
                </Link>
              )}
            </div>
          </div>
          <div>{`${largeGroup.label} ${middleGroup.label} ${groupCode.label}`}</div>
        </CardBody>
      </Card>
      <Nav pills className="mb-3">
        {MEMBER_DETAIL_NAV_ITEMS.map((item) => {
          const { value, label } = item as {
            value: 'SURVEY' | 'INTERVIEW';
            label: string;
          };
          return (
            <NavItem key={value}>
              <NavLink
                css={styles.anchor}
                className={clsx({ active: activeTab === value })}
                onClick={() => handleTab(value)}
              >
                {label}
              </NavLink>
            </NavItem>
          );
        })}
      </Nav>
      <StatisticsCard
        data={statisticsCard?.response?.payload}
        onClick={handleCardClick}
        useButton={true}
      />
      {!statisticsDetailLoading ? (
        <StatisticsTable
          data={statisticsCardDetail?.response?.payload?.tabledata}
          group={statisticsCardDetail?.response?.payload?.colgroup}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default memo(MemberDetail);
