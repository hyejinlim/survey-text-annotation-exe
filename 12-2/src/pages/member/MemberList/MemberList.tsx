import { memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
} from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { fetchMemberListStatus } from '~/api/fetches/fetchMember';
import Breadcrumb from '~/components/shared/Breadcrumb';
import TableContainer from '~/components/shared/TableContainer';
import { MENU0201 } from '~/constants/menu';
import { MEMBER_NAV_ITEMS } from '~/constants/nav';
import { useCheckAuthorityQuery } from '~/hooks';
import { columns } from './constants';
import * as styles from './styles';

function MemberList() {
  const navigate = useNavigate();
  const [activeTab, setactiveTab] = useState<string>('');
  const { data: authority, isLoading } = useCheckAuthorityQuery(MENU0201);

  const { data: statusMemberData, isLoading: statusMemberDataLoading } =
    useQuery({
      queryKey: ['statusMemberList', activeTab],
      queryFn: () => fetchMemberListStatus(activeTab),
    });

  const handleTab = (tab: string) => {
    if (activeTab !== tab) setactiveTab(tab);
  };

  const handleCreate = () => {
    navigate('/member/create');
  };

  const handleDetail = (id: any) => {
    navigate(`/member/${id}/detail`);
  };

  const memoizedColumns = useMemo(
    () => columns(authority, handleDetail),
    [isLoading]
  );

  if (isLoading) return null;
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="회원" breadcrumbItem="회원리스트" />
        <Card css={styles.card}>
          <CardBody className="bg-light-subtle">
            <Row className="gx-0">
              <Col lg={5}>
                <Nav pills className="navtab-bg nav-justified">
                  {MEMBER_NAV_ITEMS.map((item) => {
                    const { value, label } = item;
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
              </Col>
              <Col className="d-flex justify-content-end">
                {authority?.response.payload.menu.menuC && (
                  <Button color="danger" onClick={handleCreate}>
                    신규 회원 생성
                  </Button>
                )}
              </Col>
            </Row>
          </CardBody>

          <TabContent activeTab={activeTab} className="pt-3 text-muted">
            <TableContainer
              columns={memoizedColumns}
              data={statusMemberData?.response.payload || []}
              isGlobalFilter={true}
              isListOptionVisible
              isCheckbox={false}
              isLoading={statusMemberDataLoading}
            />
          </TabContent>
        </Card>
      </Container>
    </div>
  );
}

export default memo(MemberList);
