import { css } from '@emotion/react';

export const table = css`
  border-collapse: collapse;
  table,
  th,
  td {
    font-size: 16px;
    text-align: center;
  }
`;

export const tbody = css`
  & td[rowspan] {
    vertical-align: middle;
    text-align: center;
  }
`;

export const check = css`
  border: 1px solid gray;
  font-size: 20px;
`;
