import { memo, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import * as R from 'ramda';
import { fetchInspectionStatusModify } from '~/api/fetches/fetchInspection';
import {
  fetchSurveyComplete,
  fetchSurveyInspectionSelectInfo,
} from '~/api/fetches/fetchSurvey';
import Selectbox from '~/components/shared/Selectbox';
import TextArea from '~/components/shared/TextArea';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';

type Props = {
  type: 'I1' | 'I2' | 'F';
  inspectionCheck?: any;
};

function SurveyInspectionCheckModify({ type, inspectionCheck = [] }: Props) {
  const navigate = useNavigate();

  const { document } = useContext(SurveyTextAnnotationContext);
  const { label, inspection, inspectionChange } = document || {};
  const { labelingId } = label || {};

  const { data: selectInfo } = useQuery({
    queryKey: ['surveyInspectionSelectInfo'],
    queryFn: () => fetchSurveyInspectionSelectInfo({ type }),
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
          if (isConfirmed && selectValue === 'surveyinsF001') {
            navigate('/survey/inspection/final', { replace: true });
          }
        });
      }
    },
  });

  const surveyCompleteMutation = useMutation(fetchSurveyComplete, {
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

    const allCheckedId = R.pipe(
      R.filter(({ checked }) => checked),
      R.map(({ id }) => id)
    )(linearCheckList);

    const { message, type: inspectionType, value } = values;
    const params = {
      inspectionMessage: message ?? '',
      inspectionType,
      inspectionValue: value,
      inspectionDataId: labelingId,
      ...(type === 'F' && { inspectionChkList: allCheckedId }),
    };
    updateStatusMutation.mutateAsync(params);
  };

  const handleChange = ({ name, value }: any) => {
    methods.setValue(name, value, { shouldValidate: true });
  };

  const handleComplete = () => {
    const params = { type, labelingId };
    surveyCompleteMutation.mutateAsync(params);
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
            items={selectInfo?.response?.payload?.surveyinspection}
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

export default memo(SurveyInspectionCheckModify);
