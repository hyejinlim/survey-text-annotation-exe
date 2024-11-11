import { memo, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import * as R from 'ramda';
import {
  fetchSurveyI1List,
  fetchSurveyI2List,
  fetchSurveyIFList,
  fetchSurveyLabelingDelete,
} from '~/api/fetches/fetchSurvey';
import { fetchCheckAuthority } from '~/api/setting/authority';
import CreateButton from '~/components/shared/CreateButton';
import TableApiPaginationContainer from '~/components/shared/TableApiPaginationContainer';
import { columns } from './constants';
import SurveyDataSelectFilter from '../SurveyDataSelectFilter';

type Props = {
  initData: any;
};

function SurveyInspectionDataList({ initData }: Props) {
  const { listType, type, ...rest } = initData;
  const searchParams = new URLSearchParams(window.location.search);
  const curPageSize = searchParams.get('pageSize');
  const curPage = searchParams.get('curPage');
  const [selectedValues, setSelectedValues] = useState(rest);
  const [page, setPage] = useState(curPage ? parseInt(curPage) : 1);
  const [limit, setLimit] = useState(curPageSize ? parseInt(curPageSize) : 10);

  const { data: authority, isLoading: authorityLoading } = useQuery({
    queryKey: ['authority', listType, curPage, limit],
    queryFn: () => fetchCheckAuthority(listType),
  });

  const fetched = (params: any) => {
    switch (type) {
      case 'I1':
        return fetchSurveyI1List(params);
      case 'I2':
        return fetchSurveyI2List(params);
      case 'F':
        return fetchSurveyIFList(params);
    }
  };

  const {
    data: inspectionData,
    refetch,
    isLoading: inspectionDataLoading,
  } = useQuery({
    queryKey: ['inspectionData', selectedValues, page, limit, type],
    queryFn: () => fetched({ ...selectedValues }),
  });

  const { downloadName, downloadUrl } = inspectionData?.response || {};

  const deleteMutation = useMutation(fetchSurveyLabelingDelete);

  const handleSelectChange = useCallback(
    (key: any, value: any) => {
      setSelectedValues((prevValues: any) => ({
        ...prevValues,
        [key]: value,
      }));

      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set(key, value);
      queryParams.delete('curPage');
      setPage(1);
      const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
      window.history.pushState({}, '', newUrl);
    },
    [setSelectedValues]
  );

  // 키워드 update
  const handleSearchKeyword = (keyword: string) => {
    setSelectedValues((prev: any) => ({ ...prev, sv: keyword }));

    // url 업데이트
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('sv', keyword);
    queryParams.delete('curPage');
    setPage(1);
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  // 필터 초기화
  const handleResetClick = () => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete('category');
    queryParams.delete('status');
    queryParams.delete('curPage');

    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;

    window.history.pushState({}, '', newUrl);
    setSelectedValues((prev: any) => ({
      ...prev,
      category: '',
      status: '',
      curPage: 1,
    }));
    setPage(1);
  };

  // 사이트 > 뒤로가기 버튼
  const handlePopState = () => {
    const prevPageSearch = window.location.search;
    const urlSearchParams = new URLSearchParams(prevPageSearch);

    const paramsToSet = [
      { key: 'category', defaultValue: '' },
      { key: 'status', defaultValue: '' },
    ];

    paramsToSet.forEach(({ key, defaultValue }) => {
      const paramValue = urlSearchParams.get(key);
      const newParamsValue = paramValue !== null ? paramValue : defaultValue;
      setSelectedValues((prev: any) => ({
        ...prev,
        [key]: newParamsValue,
      }));

      if (paramValue !== null) refetch();
    });

    const curPageParam = urlSearchParams.get('curPage');
    if (curPageParam !== null) {
      const curPage = parseInt(curPageParam, 10);
      setPage(curPage);
      setSelectedValues((prev: any) => ({ ...prev, curPage }));
    } else {
      setPage(1);
      setSelectedValues((prev: any) => ({ ...prev, curPage: 1 }));
    }

    const curPageSizeParam = urlSearchParams.get('pageSize');
    if (curPageSizeParam !== null) {
      const curPageSize = parseInt(curPageSizeParam, 10);
      setSelectedValues((prev: any) => ({ ...prev, pageSize: curPageSize }));
      setLimit(curPageSize);
      refetch();
    } else {
      setLimit(10);
      setSelectedValues((prev: any) => ({ ...prev, pageSize: 10 }));
    }
  };

  const handlePageChange = (value: any) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('curPage', value);
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({}, '', newUrl);
    setPage(value);
    setSelectedValues((pre: any) => ({ ...pre, curPage: value }));
  };

  const handlePageSizeChange = (value: any) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('pageSize', value);
    queryParams.delete('curPage');
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({}, '', newUrl);
    setPage(1);
    setLimit(value);
    setSelectedValues((pre: any) => ({ ...pre, curPage: 1, pageSize: value }));
  };

  // 선택 데이터 삭제
  const handleRowDelete = useCallback(async (rows: any) => {
    if (R.isEmpty(rows)) {
      Swal.fire({
        icon: 'error',
        title: '선택 데이터가 없습니다.',
        confirmButtonText: '확인',
      });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: '선택한 데이터를 삭제하시겠습니까?',
      text: '삭제 후 복구는 불가능합니다.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (isConfirmed) {
      try {
        const promises = rows.map(async ({ original }: any) => {
          const { surveyId, labelingId } = original;
          Swal.fire({
            title: '삭제 중입니다...',
            showConfirmButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            icon: 'info',
            didOpen: () => {
              Swal.showLoading();
            },
          });
          const { response } = await deleteMutation.mutateAsync({
            surveyId,
            labelingId,
          });
          return response;
        });

        const results = await Promise.all(promises);

        const allDeleted = results.every(({ result }) => result === 'success');

        if (allDeleted) {
          Swal.fire({
            icon: 'success',
            title: '데이터를 성공적으로 삭제하였습니다',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '일부 데이터 삭제에 실패하였습니다.',
          });
        }

        refetch();
      } catch (error) {
        console.error('Error occurred while deleting data:', error);
      }
    }
  }, []);

  // 뒤로가기
  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const isLoading = authorityLoading || inspectionDataLoading;

  return (
    <TableApiPaginationContainer
      columns={columns(selectedValues, type)} // TODO: 컬럼 메모이제이션
      data={inspectionData?.response.payload || []}
      isGlobalFilter={true} // 데이터 검색
      isListOptionVisible={true} // 컬럼 필터
      isLoading={isLoading}
      onDeleteSelectedValues={handleRowDelete}
      isDeleteButton={authority?.response?.payload?.function?.imgDelete}
      isListLeftArea // 좌상단 데이터 필터
      listLeftArea={
        <SurveyDataSelectFilter
          selectedValues={selectedValues}
          onResetClick={handleResetClick}
          onSelectChange={handleSelectChange}
          type={type}
        />
      }
      download={
        downloadUrl ? (
          <CreateButton
            isDownload={true}
            title={downloadName}
            downloadUrl={downloadUrl}
          />
        ) : null
      }
      onSearchKeyword={handleSearchKeyword}
      isSelectedButtons // 전체 선택 버튼
      totalRow={inspectionData?.response.totalRow}
      curPage={page}
      totalPage={inspectionData?.response.totalPage}
      defaultPageSize={limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
export default memo(SurveyInspectionDataList);
