import { Fragment, memo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, Col, Row } from 'reactstrap';
import * as styles from './styles';

type CategoryProps = {
  color: string;
  data: number;
  percent: number;
  title: string;
};
type Props = {
  data: {
    category: CategoryProps[];
    colors: string;
    datas: number[];
    labels: string[];
    title: string;
  };
};

function WalletBalance({ data }: Props) {
  const { labels, colors, title, datas, category } = data || {};
  const options: Object = {
    chart: {
      width: 227,
      height: 227,
      type: 'pie',
    },
    labels,
    colors,
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  if (!data) return null;
  return (
    <Fragment>
      <Col lg="6">
        <Card className="card-h-100">
          <CardBody>
            <div className="d-flex flex-wrap align-items-center mb-4">
              <h5 className="card-title me-2">{title}</h5>
            </div>
            <Row className="align-items-center">
              {datas.length !== 0 && (
                <div className="col-sm">
                  <div id="wallet-balance" className="apex-charts">
                    <ReactApexChart
                      options={options}
                      series={datas || []}
                      type="pie"
                      height="227"
                    />
                  </div>
                </div>
              )}
              <div
                className={
                  datas.length === 0
                    ? 'd-flex align-items-center justify-content-center'
                    : 'col-sm align-self-center '
                }
              >
                <div className="mt-4 mt-sm-0">
                  {category.map((item: CategoryProps) => {
                    const { title, color, data, percent } = item;
                    return (
                      <div key={title} className="mb-3">
                        <h5 className="mb-2">
                          <i
                            className="mdi mdi-circle align-middle font-size-10 me-2"
                            css={styles.icon(color)}
                          />
                          {title} <span>{data}</span>
                          <span className="text-muted fw-normal">
                            ({percent}%)
                          </span>
                        </h5>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Fragment>
  );
}

export default memo(WalletBalance);
