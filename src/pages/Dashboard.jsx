import React, {useEffect} from 'react';
import withAuth from '../utils/WithAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import DashRequest from '../components/DashRequest';
import DashHeader from '../components/DashHeader';
import Metrics from '../components/Metrics';

function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
  
    useEffect(() => {
        if (!tab) {
            navigate('/dashboard?tab=dash');
        }
    }, [tab, navigate]);
   
    return (
        <>
            <DashHeader />
            <div className='min-h-screen flex flex-col md:flex-row bg-[rgb(249,243,241)] '>
                <div className='flex h-screen '>
                    <DashSidebar />
                </div>
                {tab === 'users' && <DashUsers />}
                {tab === 'dash' && <DashboardComp />}
                {tab === 'requests' && <DashRequest />}
                {tab === 'metrics' && <Metrics />}
            </div>
        </>
    );
}
// export default withAuth(Dashboard);
export default Dashboard;