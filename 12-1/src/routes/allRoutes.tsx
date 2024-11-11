import SurveyTextAnnotation from '~/pages/survey/SurveyTextAnnotation';

type RouteProps = {
  path: string;
  component: any;
  exact?: boolean;
  [key: string]: any;
};

const userRoutes: Array<RouteProps> = [
  { path: '/', exact: true, component: <SurveyTextAnnotation /> },
];

export { userRoutes };
