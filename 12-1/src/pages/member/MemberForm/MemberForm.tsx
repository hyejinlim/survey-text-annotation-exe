import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormFeedback,
  Label,
  Row,
} from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import L from 'lodash';
import { fetchGroupList } from '~/api/setting/group';
import Selectbox from '~/components/shared/Selectbox';
import TextArea from '~/components/shared/TextArea';
import TextField from '~/components/shared/TextField';
import { getMemberFormSchema } from '~/validations/member/memberFormValidation';
import { MEMBER_STATE } from './constants';
import { getInitialFormValues } from './functions';

type Props = {
  item?: any;
  submitText?: string;
  isLoading?: boolean;
  onBack: () => void;
  onSubmit: (values: any) => void;
};
function MemberForm({
  item,
  submitText,
  isLoading = false,
  onBack,
  onSubmit,
}: Props) {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: getMemberFormSchema(item === undefined) });
  const { mid } = useParams();
  const [largeGroup, setLargeGroup] = useState([]);
  const [middleGroup, setMiddleGroup] = useState([]);
  const [smallGroup, setSmallGroup] = useState([]);
  const [largeGroupId, setLargeGroupId] = useState('');
  const [middleGroupId, setMiddleGroupId] = useState('');

  const { data: largeGroupData } = useQuery({
    queryKey: ['largeGroup'],
    queryFn: () => fetchGroupList(),
  });

  const { data: middleGroupData } = useQuery({
    queryKey: ['childGroup', largeGroupId],
    queryFn: () => fetchGroupList(largeGroupId),
    enabled: !!largeGroupId,
  });

  const { data: smallGroupData } = useQuery({
    queryKey: ['childGroup', middleGroupId],
    queryFn: () => fetchGroupList(middleGroupId),
    enabled: !!middleGroupId,
  });

  const handleClick = (values: any) => {
    onSubmit(values);
  };

  const handleBack = () => onBack();

  const handleChange = ({ name, value }: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  /**
   * useEffect
   */
  const registerForm = () => {
    const initialFormValues = getInitialFormValues(item);

    L.flow([
      L.toPairs,
      (data) => {
        L.forEach(data, ([name, value]) => {
          if (L.isEmpty(item)) {
            register(name);
          }
          setValue(name, value);
        });
      },
    ])(initialFormValues);
  };

  useEffect(registerForm, [item, register, setValue]);

  useEffect(() => {
    if (largeGroupData) setLargeGroup(largeGroupData.response.payload);
    if (middleGroupData) setMiddleGroup(middleGroupData.response.payload);
    if (smallGroupData) setSmallGroup(smallGroupData.response.payload);
  }, [largeGroupData, middleGroupData, smallGroupData]);

  useEffect(() => {
    if (item) {
      setLargeGroupId(item.largeGroup.value);
      setMiddleGroupId(item.middleGroup.value);
      setValue('group', item.groupCode.value);

      setLargeGroup(item.groupCode1List);
      setMiddleGroup(item.groupCode2List);
      setSmallGroup(item.groupCodeList);
    } else {
      setLargeGroupId('');
      setMiddleGroupId('');
    }
  }, [item]);

  const isCreatePage = L.isEmpty(item);

  return (
    <div className="mt-5">
      <Row className="d-flex justify-content-center">
        <Col lg={8}>
          <Card>
            {mid && (
              <CardHeader className="d-flex justify-content-end">
                <Link
                  className="btn btn-primary "
                  to={`/member/${mid}/authority`}
                >
                  회원 개별 권한 설정
                </Link>
              </CardHeader>
            )}
            <CardBody className="p-4">
              <Row>
                <Col lg={6}>
                  <Row className="mb-5">
                    <div className="mb-3">
                      <Label className="form-Label">아이디</Label>
                      <TextField
                        name="id"
                        type="email"
                        value={getValues('id')}
                        onChange={handleChange}
                        placeholder="아이디를 입력해주세요."
                        invalid={!!errors?.id}
                      />
                      {!!errors?.id && (
                        <FormFeedback type="invalid">
                          {errors?.id?.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div className="mb-3">
                      <Label className="form-Label">이름</Label>
                      <TextField
                        name="name"
                        value={getValues('name')}
                        onChange={handleChange}
                        placeholder="이름를 입력해주세요."
                        invalid={!!errors?.name}
                      />
                      {!!errors?.name && (
                        <FormFeedback type="invalid">
                          {errors?.name?.message}
                        </FormFeedback>
                      )}
                    </div>
                  </Row>
                  <Row className="mb-5">
                    <div className="mb-3">
                      <Label className="form-Label">소속</Label>
                      <Selectbox
                        name="largeGroup"
                        value={largeGroupId}
                        placeholder="소속을 선택해주세요."
                        onChange={({ value }) => setLargeGroupId(value)}
                        items={largeGroup}
                      />
                    </div>
                    <div className="mb-3">
                      <Label className="form-Label">역할</Label>
                      <Selectbox
                        name="group"
                        value={getValues('group')}
                        placeholder={'역할을 선택해주세요.'}
                        onChange={handleChange}
                        items={smallGroup}
                        invalid={!!errors?.group}
                      />
                      {!!errors?.group && (
                        <FormFeedback type="invalid">
                          {errors?.group.message}
                        </FormFeedback>
                      )}
                    </div>
                  </Row>
                  {!isCreatePage && (
                    <Row className="mb-5">
                      <div className="mb-3 d-flex justify-content-between">
                        <Label className="form-Label">최근 접속일</Label>
                        <span>{item.memberLastLoginDatetime}</span>
                      </div>
                      <div className="mb-3 d-flex justify-content-between">
                        <Label className="form-Label">등록일</Label>
                        <span>{item.createDatetime}</span>
                      </div>
                    </Row>
                  )}
                </Col>
                <div className="col-lg-6">
                  <div className="mt-3 mt-lg-0">
                    <Row className="mb-5">
                      <div className="mb-3">
                        <Label className="form-Label">비밀번호</Label>
                        <TextField
                          name="password"
                          type="password"
                          value={getValues('password')}
                          onChange={handleChange}
                          placeholder={item ? '' : '비밀번호를 입력해주세요.'}
                          invalid={!!errors?.password}
                        />
                        {!!errors?.password && (
                          <FormFeedback type="invalid">
                            {errors?.password.message}
                          </FormFeedback>
                        )}
                      </div>
                      <div className="mb-3">
                        <Label className="form-Label">상태</Label>
                        <Selectbox
                          name="state"
                          value={getValues('state')}
                          placeholder="상태를 선택해주세요."
                          onChange={handleChange}
                          items={MEMBER_STATE}
                          invalid={!!errors?.state}
                        />
                        {!!errors?.state && (
                          <FormFeedback type="invalid">
                            {errors?.state.message}
                          </FormFeedback>
                        )}
                      </div>
                    </Row>

                    <div className="mb-3">
                      <Label className="form-Label">그룹</Label>
                      <Selectbox
                        name="middleGroup"
                        value={middleGroupId}
                        placeholder="그룹을 선택해주세요."
                        onChange={({ value }) => setMiddleGroupId(value)}
                        items={middleGroup}
                      />
                    </div>
                  </div>
                </div>
              </Row>
              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <Label className="form-Label">관리자 메모</Label>
                    <TextArea
                      name="memo"
                      placeholder="관리자 메모를 작성해주세요."
                      value={getValues('memo')}
                      rows={5}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
              </Row>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <Button type="reset" color="secondary" onClick={handleBack}>
                  뒤로
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  onClick={handleSubmit(handleClick)}
                >
                  {isLoading && (
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                  )}
                  {submitText ?? '적용'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default memo(MemberForm);
