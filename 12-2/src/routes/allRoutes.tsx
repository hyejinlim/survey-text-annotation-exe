import { Navigate } from 'react-router-dom';
import Login from 'src/pages/Authentication/Login';
import Logout from 'src/pages/Authentication/Logout';
import Register from 'src/pages/Authentication/Register';
import NoticeCreate from '~/pages/board/notice/NoticeCreate/NoticeCreate';
import NoticeList from '~/pages/board/notice/NoticeList/NoticeList';
import NoticeModify from '~/pages/board/notice/NoticeModify/NoticeModify';
import QnaCreate from '~/pages/board/qna/QnaCreate';
import QnaDetail from '~/pages/board/qna/QnaDetail';
import QnaList from '~/pages/board/qna/QnaList';
import DashboardInterview from '~/pages/DashboardInterview';
import DashboardSurvey from '~/pages/DashboardSurvey';
import InterviewDetail from '~/pages/interview/InterviewDetail';
import InterviewInspectionDetail from '~/pages/interview/InterviewInspectionDetail';
import InterviewInspectionI1List from '~/pages/interview/InterviewInspectionI1List';
import InterviewInspectionI2List from '~/pages/interview/InterviewInspectionI2List';
import InterviewInspectionIFList from '~/pages/interview/InterviewInspectionIFList';
import InterviewList from '~/pages/interview/InterviewList';
import InterviewTextAnnotation from '~/pages/interview/InterviewTextAnnotation';
import InterviewUpload from '~/pages/interview/InterviewUpload';
import MemberAuthority from '~/pages/member/MemberAuthority/MemberAuthority';
import MemberCalendar from '~/pages/member/MemberCalendar/MemberCalendar';
import MemberCreate from '~/pages/member/MemberCreate';
import MemberDetail from '~/pages/member/MemberDetail';
import MemberList from '~/pages/member/MemberList';
import MemberModify from '~/pages/member/MemberModify';
import AuthoritySetting from '~/pages/setting/AuthoritySetting';
import CodeDetailList from '~/pages/setting/CodeDetailList';
import CodeList from '~/pages/setting/CodeList/';
import GroupSetting from '~/pages/setting/GroupSetting/';
import WorkBoard from '~/pages/setting/WorkBoard/WorkBoard';
import SurveyDetail from '~/pages/survey/SurveyDetail';
import SurveyInspectionDetail from '~/pages/survey/SurveyInspectionDetail';
import SurveyInspectionI1List from '~/pages/survey/SurveyInspectionI1List';
import SurveyInspectionI2List from '~/pages/survey/SurveyInspectionI2List';
import SurveyInspectionIFList from '~/pages/survey/SurveyInspectionIFList';
import SurveyList from '~/pages/survey/SurveyList';
import SurveyTextAnnotation from '~/pages/survey/SurveyTextAnnotation';
import SurveyUpload from '~/pages/survey/SurveyUpload';

type RouteProps = {
  path: string;
  component: any;
  exact?: boolean;
  [key: string]: any;
};

const userRoutes: Array<RouteProps> = [
  // 대시보드
  { path: '/', exact: true, component: <Navigate to="/dashboard/survey" /> },
  { path: '/dashboard/survey', component: <DashboardSurvey /> },
  { path: '/dashboard/interview', component: <DashboardInterview /> },

  // 회원
  { path: '/member', component: <MemberList /> },
  { path: '/member/create', component: <MemberCreate /> },
  { path: '/member/:mid', component: <MemberModify /> },
  { path: '/member/:mid/detail', component: <MemberDetail /> },
  { path: '/member/:mid/authority', component: <MemberAuthority /> },
  { path: '/member/:mid/calendar', component: <MemberCalendar /> },

  // 12-1 서베이 데이터
  { path: '/survey/upload', component: <SurveyUpload /> },
  { path: '/survey/list', component: <SurveyList /> },
  { path: '/survey/:surveyId', component: <SurveyDetail /> },
  { path: '/survey/inspection/1', component: <SurveyInspectionI1List /> },
  { path: '/survey/inspection/2', component: <SurveyInspectionI2List /> },
  { path: '/survey/inspection/final', component: <SurveyInspectionIFList /> },
  {
    path: '/survey/inspection/:inspectionId/:surveyId/:labelingId',
    component: <SurveyInspectionDetail />,
  },

  // 12-2 인터뷰 데이터
  { path: '/interview/upload', component: <InterviewUpload /> },
  { path: '/interview/list', component: <InterviewList /> },
  { path: '/interview/:interviewId', component: <InterviewDetail /> },
  { path: '/interview/inspection/1', component: <InterviewInspectionI1List /> },
  { path: '/interview/inspection/2', component: <InterviewInspectionI2List /> },
  {
    path: '/interview/inspection/final',
    component: <InterviewInspectionIFList />,
  },
  {
    path: '/interview/inspection/:inspectionId/:interviewId',
    component: <InterviewInspectionDetail />,
  },

  // 게시판
  { path: '/board/notice', component: <NoticeList /> },
  { path: '/board/notice/form', component: <NoticeCreate /> },
  { path: '/board/notice/:nid', component: <NoticeModify /> },
  { path: '/board/qna', component: <QnaList /> },
  { path: '/board/qna/form', component: <QnaCreate /> },
  { path: '/board/qna/:iid', component: <QnaDetail /> },

  // 세팅
  { path: '/setting/group', component: <GroupSetting /> },
  { path: '/setting/authority', component: <AuthoritySetting /> },
  { path: '/setting/code', component: <CodeList /> },
  { path: '/setting/code/:codeId', component: <CodeDetailList /> },
  { path: '/setting/workboard', component: <WorkBoard /> },
];

const authRoutes: Array<RouteProps> = [
  { path: '/login', component: <Login /> },
  { path: '/logout', component: <Logout /> },
  { path: '/register', component: <Register /> },
  { path: '/survey/labeling/:surveyId', component: <SurveyTextAnnotation /> },
  {
    path: '/interview/labeling/:interviewId',
    component: <InterviewTextAnnotation />,
  },
];

export { userRoutes, authRoutes };
