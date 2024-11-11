import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  UncontrolledAlert,
  FormFeedback,
} from 'reactstrap';
import { getEditeFormSchema } from '~/validations/setting/editeFormValidations';
import * as styles from './styles';
import TextField from '../TextField/TextField';

type ContentsType = {
  id: string;
  label: string;
  used: boolean;
  child: boolean;
};
type EditeType = {
  id: string;
  label: string;
  used: boolean;
  title: string;
};

type Props = {
  title: string;
  data?: ContentsType[];
  selectedId?: any;
  onSelectedLargeGroup?: any;
  onSelectedMiddleGroup?: any;
  onSelectedSmallGroup?: any;
  onUsed: (title: string, data: any) => void;
  onNotUsed: (title: string, data: any) => void;
  onAdd: (title: string) => void;
  onSelectedCategory?: any;
  onSelectedList?: any;
  onSelectedTag?: any;
  setEditeValue?: any;
  editeValue: EditeType;
  onEdite: (value: any) => void;
  onShowWarning: boolean;
};

enum TagEnum {
  CATEGORY = '대분류',
  MIDDLE = '중분류',
  SMALL = '소분류',
  OPTION = '옵션',
}

enum Group {
  LARGEGROUP = '소속',
  MIDDLEGROUP = '그룹',
  SMALLGROUP = '역할',
}

interface EventHandlers {
  [key: string]: (id: number) => void | undefined;
}
const CatManager = ({
  title,
  data,
  selectedId,
  onShowWarning,
  onSelectedLargeGroup,
  onSelectedMiddleGroup,
  onSelectedSmallGroup,
  onNotUsed,
  onAdd,
  onUsed,
  onSelectedCategory,
  onSelectedList,
  onSelectedTag,
  setEditeValue,
  onEdite,
  editeValue,
}: Props) => {
  const [editeButton, setEditeButton] = useState(false);

  const {
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: getEditeFormSchema(true) });

  /**업데이트할 이름 */
  const handleEditeSetting = useCallback(
    (content: any, title: any) => {
      setEditeButton((pre) => !pre);
      setEditeValue((prev: any) => ({ ...prev, ...content, title: title }));
      setValue('id', content.id);
      setValue('name', content.label);
      setValue('used', content.used);
    },
    [editeValue]
  );

  const handleChange = ({ name, value }: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  const handleEditeSubmit = (value: any) => {
    onEdite(value);
    setEditeButton(false);
  };

  const handleClick: EventHandlers = {
    [TagEnum.CATEGORY]: onSelectedCategory,
    [TagEnum.MIDDLE]: onSelectedList,
    [TagEnum.SMALL]: onSelectedTag,
    [Group.LARGEGROUP]: onSelectedLargeGroup,
    [Group.MIDDLEGROUP]: onSelectedMiddleGroup,
    [Group.SMALLGROUP]: onSelectedSmallGroup,
  };
  const handleItemClick = (id: any) => {
    const handler = handleClick[title];
    handler && handler(id);
  };

  return (
    <div css={styles.CardContainer}>
      <Card css={styles.CustomCard}>
        <div css={styles.CardHeader} className="bg-light-subtle">
          <h5 css={styles.Title}>{title}</h5>
          <Form css={styles.Form}>
            <Button
              onClick={() => {
                onAdd(title);
              }}
              css={styles.CustomButton}
              size="sm"
              color="info"
            >
              추가
            </Button>
          </Form>
        </div>

        <CardBody css={styles.inner}>
          {data && data.length > 0 ? (
            data?.map((d) => {
              return (
                <FormGroup
                  check
                  key={d.id}
                  css={
                    selectedId === d.id
                      ? styles.SelectedLabel
                      : styles.RadioWrapper
                  }
                >
                  {editeButton && editeValue.id === d.id ? (
                    <>
                      <Form
                        css={styles.EditInput}
                        onSubmit={handleSubmit(handleEditeSubmit)}
                      >
                        <FormGroup css={styles.FormGroup}>
                          <TextField
                            css={styles.Input}
                            id={d.id}
                            name="name"
                            invalid={!!errors?.name}
                            value={getValues('name')}
                            onChange={handleChange}
                          />
                          {!!errors?.name && (
                            <FormFeedback type="invalid">
                              {errors?.name?.message}
                            </FormFeedback>
                          )}
                          <Button type="submit" style={{ display: 'none' }}>
                            {/* 이름 수정하기 */}
                          </Button>
                        </FormGroup>
                      </Form>
                    </>
                  ) : (
                    <Label
                      check
                      css={styles.LabelStyle}
                      onChange={() => {
                        const { id } = d;
                        handleItemClick(id);
                      }}
                    >
                      {d.child && (
                        <Input
                          css={styles.Radio}
                          type="radio"
                          name={d.id}
                          value={d.id}
                          checked={selectedId === d.id}
                          onChange={() => d.id === selectedId}
                        />
                      )}
                      {/* {title === '태그명' && <i className="fas fa-hashtag" />} */}

                      <div
                        onClick={() => {
                          const { id } = d;
                          handleItemClick(id);
                        }}
                      >
                        {title === TagEnum.MIDDLE ||
                        title === TagEnum.SMALL ||
                        title === TagEnum.OPTION ? (
                          <div className="d-flex justify-content-start align-items-center gap-2">
                            {d.label}
                          </div>
                        ) : (
                          <div>{d.label}</div>
                        )}
                      </div>
                    </Label>
                  )}

                  <div
                    className="btn-group"
                    role="group"
                    css={styles.ButtonWrapper}
                  >
                    {d.used ? (
                      <>
                        {editeButton && editeValue.id === d.id ? (
                          <Button onClick={() => setEditeButton(false)}>
                            <i className="mdi mdi-close-thick"></i>
                            {/* 수정취소 */}
                          </Button>
                        ) : (
                          <Button
                            id={d.id}
                            color="soft-info"
                            onClick={() => {
                              if (!editeButton) {
                                handleEditeSetting(d, title);
                              }
                            }}
                          >
                            <i className="fas fa-edit"></i>
                            {/* 수정 */}
                          </Button>
                        )}
                      </>
                    ) : null}

                    {d.used ? (
                      <Button
                        color="soft-danger"
                        onClick={() => onNotUsed(title, d)}
                      >
                        <i className="fas fa-ban" />
                        {/* 미사용 */}
                      </Button>
                    ) : (
                      <Button
                        className="btn btn-light waves-effect"
                        onClick={() => onUsed(title, d)}
                      >
                        <i className="bx bx-revision" />
                        {/* 복구 */}
                      </Button>
                    )}
                  </div>
                </FormGroup>
              );
            })
          ) : (
            <UncontrolledAlert
              css={styles.alert}
              color={onShowWarning ? 'warning' : 'secondary-subtle'}
              className="px-4 mb-0 text-center h-100"
            >
              <i
                className={
                  onShowWarning
                    ? 'mdi mdi-alert-outline d-block display-4 mt-2 mb-3 text-warning'
                    : 'mdi mdi-alert-outline d-block display-4 mt-2 mb-3 text-secondary'
                }
              ></i>
              <h5 className={onShowWarning ? 'text-warning' : 'text-secondary'}>
                Warning
              </h5>
              {onShowWarning ? (
                <p>상위그룹 선택 후 추가버튼을 눌러주세요</p>
              ) : (
                <p>상위그룹을 선택해주세요</p>
              )}
            </UncontrolledAlert>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default CatManager;
