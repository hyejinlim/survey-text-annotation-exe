import { css } from '@emotion/react';

export const modal = css`
  width: auto !important;
  @keyframes fadeInRight {
    0% {
      opacity: 0;
      transform: translate3d(100%, 0, 0);
    }
    to {
      opacity: 1;
      transform: translateZ(0);
    }
  }

  right: 0 !important;
  position: fixed !important;
  top: 0 !important;
  animation: fadeInRight 0.5s !important;
  margin: 0 !important;

  .modal-content {
    height: 100vh !important;
    width: 20vw;
  }

  .modal-body {
    overflow-y: scroll;
  }

  // 부모 요소 width 변경
  div.modal:has(&) {
    width: auto !important;
  }
`;

export const modalHeader = css`
  .modal-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 16px;
  }
`;
