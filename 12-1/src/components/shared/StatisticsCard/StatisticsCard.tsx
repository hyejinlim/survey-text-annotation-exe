import { memo } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import * as styles from './styles';

type Props = {
  data: any;
  useButton?: boolean;
  onClick?: (id: number) => void;
};

function StatisticsCard({ data, useButton = false, onClick }: Props) {
  return (
    <Row>
      {data?.map((item: any) => {
        const { id, title, value, postFix } = item;
        return (
          <Col xl={3} md={6} key={id}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <span className="text-muted mb-2 lh-1 d-block text-truncate">
                      {title}
                    </span>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="mb-0">
                        {value ?? 0}
                        {postFix}
                      </h4>
                      {useButton && (
                        <Button
                          color="primary"
                          css={styles.button}
                          onClick={() => onClick?.(id)}
                        >
                          <i className="mdi mdi-arrow-right-thin" />
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default memo(StatisticsCard);
