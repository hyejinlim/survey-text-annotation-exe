import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { Container } from 'reactstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import { useQuery } from '@tanstack/react-query';
import { fetchStatisticsCalendar } from '~/api/fetches/fetchStatistics';
import Breadcrumb from '~/components/shared/Breadcrumb';
import Loading from '~/components/shared/Loading';
import StatisticsCard from '~/components/shared/StatisticsCard';

const Dates = new Date();
const yeardate = Dates.getFullYear();
const monthdate = Dates.getMonth();

function MemberCalendar() {
  const navigate = useNavigate();
  const { mid } = useParams();

  const queryParams = new URLSearchParams(window.location.search);
  const year = queryParams.get('year') ?? yeardate.toString();
  const month = queryParams.get('month') ?? monthdate.toString();

  const { data: statisticsCalendarData, isLoading: statisticsCalendarLoading } =
    useQuery({
      queryKey: ['statisticsCalendar', month],
      queryFn: () => fetchStatisticsCalendar({ mid, date: { year, month } }),
    });

  const calendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: statisticsCalendarData?.response.payload.cal || [],
    initialDate: new Date(parseInt(year), parseInt(month), 1),
    headerToolbar: {
      left: 'today',
      center: 'title',
      right: 'prev,next',
    },
    datesSet: (info: any) => {
      const currentYear = info.view.currentStart.getFullYear();
      const currentMonth = info.view.currentStart.getMonth();
      queryParams.set('year', currentYear);
      queryParams.set('month', currentMonth);
      const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
      navigate(newUrl, { replace: true });
    },
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="회원 상세" breadcrumbItem="월별 통계" />
        <StatisticsCard data={statisticsCalendarData?.response?.payload?.sum} />
        {!statisticsCalendarLoading ? (
          <FullCalendar {...calendarOptions} />
        ) : (
          <Loading />
        )}
      </Container>
    </div>
  );
}

export default MemberCalendar;
