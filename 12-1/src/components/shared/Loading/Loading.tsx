import { memo } from 'react';

function Loading() {
  return (
    <div className="text-center">
      <div className="spinner-border spinner-border-lg" role="status">
        <span className="visually-hidden">로딩 중...</span>
      </div>
      <p className="mt-2">데이터를 불러오는 중입니다.</p>
    </div>
  );
}

export default memo(Loading);
