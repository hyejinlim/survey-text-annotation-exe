import { css } from '@emotion/react';

export const title = css`
  font-weight: 600;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--bs-border-color);
  border-bottom: 1px solid var(--bs-border-color);
`;

export const selectContainer = css`
  padding: 12px 16px;
  display: grid;
  gap: 8px;
  background-color: #ffffff;
`;

export const container = css`
  background-color: #ffffff;
  padding: 12px 8px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
`;

export const dataContainer = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const tab = css`
  cursor: pointer;
`;
