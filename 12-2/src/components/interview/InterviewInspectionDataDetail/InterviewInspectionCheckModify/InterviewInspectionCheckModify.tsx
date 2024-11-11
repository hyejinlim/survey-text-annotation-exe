import { memo, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import * as R from 'ramda';
import { fetchInspectionStatusModify } from '~/api/fetches/fetchInspection';
import {
  fetchInterviewComplete,
  fetchInterviewInspectionSelectInfo,
} from '~/api/fetches/fetchInterview';
import Selectbox from '~/components/shared/Selectbox';
import TextArea from '~/components/shared/TextArea';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';

type Props = {
  type: 'I1' | 'I2' | 'F';
  inspectionCheck?: any;
};

function InterviewInspectionCheckModify({ type, inspectionCheck }: Props) {
  const navigate = useNavigate();

  const { document, labelCheckList } = useContext(
    InterviewTextAnnotationContext
  );
  const { info, inspection, inspectionChange } = document || {};
  const { interviewId } = info || {};

  const { data: selectInfo } = useQuery({
    queryKey: ['interviewInspectionSelectInfo'],
    queryFn: () => fetchInterviewInspectionSelectInfo({ type }),
  });

  const updateStatusMutation = useMutation(fetchInspectionStatusModify, {
    onSuccess: (data: any) => {
      const { result, message } = data.response.payload;
      if (result === 'error') {
        Swal.fire({
          icon: 'error',
          title: `${message ?? 'API 오류'}`,
          confirmButtonText: '확인',
        });
      } else {
        const selectValue = methods.getValues('value');

        Swal.fire({
          icon: 'success',
          title: '검수가 완료되었습니다.',
          confirmButtonText: '확인',
        }).then((result) => {
          const { isConfirmed } = result;
          if (isConfirmed && selectValue === 'interviewinsF001') {
            navigate('/interview/inspection/final', { replace: true });
          }
        });
      }
    },
  });

  const interviewCompleteMutation = useMutation(fetchInterviewComplete, {
    onSuccess: (data: any) => {
      const { result, message } = data.response.payload;
      if (result === 'error') {
        Swal.fire({
          icon: 'error',
          title: `${message ?? 'API 오류'}`,
          confirmButtonText: '확인',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '수정이 완료되었습니다.',
          confirmButtonText: '확인',
        });
      }
    },
  });

  const methods = useForm();
  methods.watch();

  const handleCheck = (values: any) => {
    const linearCheckList = R.pipe(
      R.map(({ list }) => list),
      R.flatten
    )(inspectionCheck);

    const linearLabelCheckList = R.pipe(
      R.map(({ list }) => list),
      R.flatten
    )(labelCheckList || []);

    const list = [...linearCheckList, ...linearLabelCheckList];

    const allCheckedId = R.pipe(
      R.filter(({ checked }) => checked),
      R.map(({ id }) => id)
    )(list);

    const { message, type: inspectionType, value } = values;
    const params = {
      inspectionMessage: message ?? '',
      inspectionType,
      inspectionValue: value,
      inspectionDataId: interviewId,
      ...(type === 'F' && { inspectionChkList: allCheckedId }),
    };

    updateStatusMutation.mutateAsync(params);
  };

  const handleChange = ({ name, value }: any) => {
    methods.setValue(name, value, { shouldValidate: true });
  };

  const handleComplete = () => {
    const params = { type, interviewId };
    interviewCompleteMutation.mutateAsync(params);
  };

  useEffect(() => {
    if (!R.isNil(inspection)) {
      Object.keys(inspection).forEach((key: any) => {
        const value =
          key === 'value' ? inspection[key]?.value : inspection[key];
        methods.register(key);
        methods.setValue(key, value);
      });
    }
  }, [inspection]);

  return (
    <div className="px-2 py-3">
      <Row className="gx-2 pb-2">
        <Col>
          <Selectbox
            name="value"
            placeholder="Select..."
            onChange={handleChange}
            items={selectInfo?.response?.payload?.interwiewinspection}
            value={methods.getValues('value') ?? ''}
            disabled={!inspectionChange}
          />
        </Col>
        <Col xs={5}>
          <div className="d-flex gap-2">
            <Button
              color="danger"
              onClick={methods.handleSubmit(handleCheck)}
              disabled={!inspectionChange}
            >
              검수 완료
            </Button>
            {type !== 'F' && (
              <Button color="success" onClick={handleComplete}>
                수정 완료
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Label className="form-label">검수메시지</Label>
      <TextArea
        name="message"
        placeholder="검수메시지를 작성해주세요."
        value={methods.getValues('message') ?? ''}
        rows={5}
        onChange={handleChange}
        readOnly={!inspectionChange}
      />
    </div>
  );
}

export default memo(InterviewInspectionCheckModify);
