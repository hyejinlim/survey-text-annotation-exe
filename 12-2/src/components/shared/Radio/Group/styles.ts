import { css } from '@emotion/react';

export const text = (backgroundColor?: string) => {
  return css`
    ${backgroundColor
      ? css`
          background: ${backgroundColor};
          border-radius: 8px;
          padding: 2px 8px;
        `
      : ''}
  `;
};
