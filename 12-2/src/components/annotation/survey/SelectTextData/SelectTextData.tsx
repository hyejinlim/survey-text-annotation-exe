import {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Input, InputGroup, Row } from 'reactstrap';
import { fetchSurveyToolList } from '~/api/fetches/fetchSurvey';
import Selectbox from '~/components/shared/Selectbox';
import { useSurveyListSelectInfoQuery } from '~/hooks';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';

const PAGE_SIZE = 10;

function SelectTextData() {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState([]); // 서베이 데이터 리스트
  // TODO: 개선
  const [lastId, setLastId] = useState(0);
  const [totalRow, setTotalRow] = useState(0);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const { setSurveyId } = useContext(SurveyTextAnnotationContext);

  const searchQuery = useMemo(
    () => ({
      ...(category && { category }),
      ...(status && { status }),
    }),
    [category, status]
  );

  const { data: selectInfo } = useSurveyListSelectInfoQuery();

  /** handler */
  const init = (params?: any) => {
    setLoading(true);
    (async () => {
      const { response } = await fetchSurveyToolList({
        paging: true,
        pagdSize: PAGE_SIZE,
        ...params,
      });

      setTotalRow(response.totalRow);
      setLastId(response.lastId);
      setDocuments(response.payload);
      setLoading(false);
    })();
  };

  const handleSearchChange = (e: any) => {
    setQuery(e.target.value);
  };

  // 검색
  const handleSearch = useCallback(() => {
    init({ ...searchQuery, ...(query && { sv: query }) });
  }, [searchQuery, query]);

  // enter 검색
  const handleKeyDown = useCallback(
    ({ key }: any) => {
      if (key === 'Enter') handleSearch();
    },
    [handleSearch]
  );

  // 더보기
  const handleClick = async () => {
    setMoreLoading(true);
    const { response, error } = await fetchSurveyToolList({
      paging: true,
      pagdSize: PAGE_SIZE,
      lastId,
      ...searchQuery,
    });

    if (error) {
      setMoreLoading(false);
      return;
    }

    if (response) {
      const { lastId, payload, totalRow } = response;
      setLastId(lastId);
      setTotalRow(totalRow);
      setDocuments((prev: any) => [...prev, ...payload] as []);
      setMoreLoading(false);
    }
  };

  // document 변경 === 이동
  const handleSelectDocument = (id: any) => {
    navigate(`/survey/labeling/${id}`);
  };

  /** useEffect */
  useEffect(init, []);
  useEffect(() => {
    if (surveyId && +surveyId > 0) setSurveyId(surveyId);
  }, [surveyId]);
  useEffect(handleSearch, [searchQuery]);

  return (
    <Fragment>
      <div css={styles.title}>목록</div>
      <div className="d-flex flex-column gap-2 p-2">
        <Row className="g-2">
          <Col xs={6}>
            <Selectbox
              name="category"
              placeholder="카테고리"
              onChange={({ value }) => setCategory(value)}
              items={selectInfo?.response.payload.selectCategory}
              value={category}
            />
          </Col>
          <Col xs={6}>
            <Selectbox
              name="status"
              placeholder="상태"
              onChange={({ value }) => setStatus(value)}
              items={selectInfo?.response.payload.selectStatus}
              value={status}
            />
          </Col>
        </Row>
        <InputGroup>
          <Input
            type="text"
            placeholder="Search ..."
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <Button color="primary" onClick={handleSearch}>
            <i className="mdi mdi-magnify" />
          </Button>
        </InputGroup>
      </div>
      <div className="text-muted">
        {documents.length > 0 ? (
          <div css={styles.container}>
            <div css={styles.dataContainer}>
              {documents.map((item: any) => {
                const { surveyId, surveyTitle } = item;
                return (
                  <div
                    key={surveyId}
                    role="button"
                    onClick={() => handleSelectDocument(surveyId)}
                  >
                    <span className="font-size-12 text-dark">
                      {surveyTitle}
                    </span>
                  </div>
                );
              })}
            </div>
            {documents.length < totalRow && (
              <Button
                className="w-100 mt-2"
                color="light"
                onClick={handleClick}
                disabled={moreLoading}
              >
                {moreLoading && (
                  <div className="spinner-border spinner-border-sm me-2" />
                )}
                더보기
              </Button>
            )}
          </div>
        ) : (
          <div className="py-3 px-4">
            <span>{loading ? 'loading...' : '데이터가 없습니다.'}</span>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default memo(SelectTextData);
