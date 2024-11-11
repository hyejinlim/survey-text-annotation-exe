import InterviewTextAnnotation from '~/pages/interview/InterviewTextAnnotation';

type RouteProps = {
  path: string;
  component: any;
  exact?: boolean;
  [key: string]: any;
};

const userRoutes: Array<RouteProps> = [
  { path: '/', exact: true, component: <InterviewTextAnnotation /> },
];

export { userRoutes };
