import { css } from '@emotion/react';

export const CustomCard = css`
  width: 100%;
  min-height: 90%;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const CardContainer = css`
  width: 100%;
  min-height: 90%;
  max-height: 90%;
  border-radius: 1rem;
`;
export const FormGroup = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  & > div {
    color: red;
  }
`;
export const Input = css`
  background-color: white;
  display: flex;
  min-width: 60%;
  margin-right: 0.5rem;
  height: 100%;
  text-align: start;
  align-items: center;
  margin: 3px 10px 3px 0;
`;
export const EditInput = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: start;
  display: green;
`;

export const CardHeader = css`
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const SwitchStyle = css`
  border: 1px solid gray;
  margin: 0;
`;
export const deleteButton = css`
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CustomHeader = css`
  background-color: var(--bs-border-color);

  font-size: 1.2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  text-align: start;
  align-items: center;
`;
export const Title = css`
  height: 100%;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Form = css`
  width: 70%;
  height: 2.5rem;
  display: flex;
  justify-content: end;
  gap: 0.5rem;
  margin-right: 0.5rem;
`;
export const CardBody = css`
  width: 100%;
  height: 90%;
`;

export const TagDiv = css`
  width: 62%;
  height: 100%;
  display: flex;
  text-align: center;
  justify-content: start;
  align-items: center;
`;

export const TopWrapper = css`
  width: 100%;
  height: 10%;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  padding: 0 1rem;

  & h3 {
    display: flex;
    justify-content: start;

    align-items: center;
    width: 30%;
    height: 3rem;
  }
  & form {
    width: 70%;
    height: 3rem;
    display: flex;
    justify-content: end;
    gap: 1rem;
  }
`;

export const ButtonWrapper = css`
  margin-right: 0.5rem;
`;
export const RadioWrapper = css`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 0.5rem;
  text-align: start;
  justify-content: space-between;
`;
export const SelectedLabel = css`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;

  justify-content: space-between;
  margin-bottom: 0.5rem;
  background-color: whitesmoke;
  font-weight: bold;
`;

export const CustomButton = css`
  width: 4rem;
`;

export const LabelStyle = css`
  width: 50%;
  padding: 0.3rem;
  font-size: 16px;
`;
export const Radio = css`
  border: 1px solid gray;
`;

export const inner = css`
  min-height: 500px;
`;
export const alert = css`
  .btn-close {
    display: none;
  }
`;
export const colorBox = (backgroundColor: string) => css`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${backgroundColor};
`;
