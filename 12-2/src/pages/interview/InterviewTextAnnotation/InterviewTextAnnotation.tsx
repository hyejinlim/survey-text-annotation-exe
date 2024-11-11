import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Col, Row } from 'reactstrap';
import L from 'lodash';
import InterviewTextAnnotationTool from '~/components/annotation/interview/InterviewTextAnnotationTool';
import SelectTextData from '~/components/annotation/interview/SelectTextData';
import ToolHeader from '~/components/annotation/interview/ToolHeader';
import InterviewTextAnnotationContext from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';

function InterviewTextAnnotation() {
  const methods = useForm();
  methods.watch();

  const defaultValues = useMemo(() => {
    return {
      interviewTitle: '',
      interviewPurpose: '',
      interviewTopic: null,
      interviewTopicDetail: null,
      interviewSource: null,
      interviewStyle: null,
      interviewType: null,
      intervieweeGender: null,
      intervieweeAge: null,
      intervieweeList: [],
      interviewKeyword: '',
    };
  }, []);

  const init = () => {
    L.flow(L.toPairs, (data) => {
      L.forEach(data, ([name, value]: any) => {
        methods.register(name);
        methods.setValue(name, value);
      });
    })(defaultValues);
  };

  useEffect(() => {
    if (defaultValues) init();
  }, [defaultValues]);

  return (
    <div css={styles.container} className="h-100">
      <Row className="gx-0">
        <Col xs={2}>
          <SelectTextData />
        </Col>
        <Col xs={10}>
          <FormProvider {...methods}>
            <ToolHeader />
            <InterviewTextAnnotationTool />
          </FormProvider>
        </Col>
      </Row>
    </div>
  );
}

export default function AnnotationPage() {
  return (
    <InterviewTextAnnotationContext>
      <InterviewTextAnnotation />
    </InterviewTextAnnotationContext>
  );
}
