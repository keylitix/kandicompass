import React, { useContext, useEffect } from 'react';
import { useTour } from '@reactour/tour';
import useDarkMode from '../../../hooks/useDarkMode';
import { demoPagesMenu } from '../../../menu';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import Button from '../../../components/bootstrap/Button';
import CommonAvatarTeam from '../../../common/other/CommonAvatarTeam';
import ThemeContext from '../../../contexts/themeContext';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import BarGrouped from '../../documentation/charts/chart-bar/BarGrouped';
import HeatMapMultipleColors from '../../documentation/charts/chart-heat-map/HeatMapMultipleColors';
import { useGetBeadsQuery } from '../../../redux/api/beadApi';
import { log } from 'console';
import BarBasic from '../../documentation/charts/chart-bar/BarBasic';
import BarCustomLabel from '../../documentation/charts/chart-bar/BarCustomLabel';
import BarPatterned from '../../documentation/charts/chart-bar/BarPatterned';
import BarReserved from '../../documentation/charts/chart-bar/BarReserved';
import BarStacked from '../../documentation/charts/chart-bar/BarStacked';
import BarStacked100 from '../../documentation/charts/chart-bar/BarStacked100';
import BarWithNegativeValues from '../../documentation/charts/chart-bar/BarWithNegativeValues';
import BoxWhiskerBasic from '../../documentation/charts/chart-boxWhisker/BoxWhiskerBasic';
import Bubble3D from '../../documentation/charts/chart-bubble/Bubble3D';
import BubbleBasic from '../../documentation/charts/chart-bubble/BubbleBasic';
import CandlestickBasic from '../../documentation/charts/chart-candlestick/CandlestickBasic';
import LineBasic from '../../documentation/charts/chart-line/LineBasic';
import LineBrush from '../../documentation/charts/chart-line/LineBrush';
import LineDashed from '../../documentation/charts/chart-line/LineDashed';
import LineStep from '../../documentation/charts/chart-line/LineStep';
import LineWithAnnotations from '../../documentation/charts/chart-line/LineWithAnnotations';
import LineWithLabel from '../../documentation/charts/chart-line/LineWithLabel';
import LineWithMissingData from '../../documentation/charts/chart-line/LineWithMissingData';
import LineZoomableTimeSeries from '../../documentation/charts/chart-line/LineZoomableTimeSeries';
import MixedLineColumn from '../../documentation/charts/chart-mixed/MixedLineColumn';
import RadarBasic from '../../documentation/charts/chart-radar/RadarBasic';
import TreeMapBasic from '../../documentation/charts/chart-tree-map/TreeMapBasic';
import DonutBasic from '../../documentation/charts/chart-pieDonut/DonutBasic';
import ErrorWrapper from '../other/onError';
import LoadingWrapper from '../other/onLoading';


const DashboardPage = () => {
  const { mobileDesign } = useContext(ThemeContext);
  const { setIsOpen } = useTour();

  // Fetch beads data with proper typing
  const { data: beadsData, isLoading, isError } = useGetBeadsQuery({
    page_number: 1,
    page_size: 10
  });


  useEffect(() => {
    if (localStorage.getItem('tourModalStarted') !== 'shown' && !mobileDesign) {
      setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('tourModalStarted', 'shown');
      }, 7000);
    }
    return () => { };
  }, [mobileDesign, setIsOpen]);

  const { themeStatus } = useDarkMode();

  // Safely calculate dashboard data
  const totalBeads = beadsData?.data?.length || 0;
  const firstBead = beadsData?.data?.data?.[0];
  console.log("firstBead", beadsData);


  const dashboardData = {
    totalBeadsTracked: {
      active: totalBeads,
      inactive: 0,
      total: totalBeads,
    },
    totalInteractionsLogged: 54320,
    mostTraveledBead: {
      id: firstBead?.beadName || "N/A",
      citiesVisited: 12,
      countriesVisited: 3,
    },
    topLocations: [
      { city: "New York, USA", scans: 8240 },
      { city: "London, UK", scans: 6120 },
      { city: "Tokyo, Japan", scans: 5800 },
      { city: "Sydney, Australia", scans: 4750 },
      { city: "Berlin, Germany", scans: 3960 },
    ],
  };

  if (isLoading) return  <LoadingWrapper />;
  if (isError) return <ErrorWrapper />;

  return (
    <PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
      <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Bead Management Overview</span>
          <SubheaderSeparator />
        </SubHeaderLeft>
        <SubHeaderRight>
          {/* <CommonAvatarTeam>
            <strong>Inventory</strong> Team
          </CommonAvatarTeam> */}
          {' '}
        </SubHeaderRight>
      </SubHeader>
      <Page container='fluid'>
        <div className='row'>
          <div className='col-12'>
            {/* You can add alerts or notifications here */}
          </div>

          <div className='row'>
            <div className='row'>
              <div className='col-xl-3'>
                <Card stretch className='shadow-lg border-0 rounded-3'>
                  <CardBody className='d-flex flex-column p-4'>
                    <div className='d-flex align-items-center mb-3'>
                      <span className='bg-primary bg-opacity-15 rounded-circle p-3 me-3'>
                        <i className='bi bi-globe-americas fs-2 text-primary'></i>
                      </span>
                      <div>
                        <div className='fs-5 text-muted'>Most Traveled Bead</div>
                        <div className='fs-3 fw-semibold text-white'>{dashboardData.mostTraveledBead.id}</div>
                      </div>
                    </div>
                    <div className='mt-auto'>
                      <div className='d-flex justify-content-between'>
                        <div className='text-center'>
                          <div className='fs-3 fw-semibold text-dark'>{dashboardData.mostTraveledBead.countriesVisited}</div>
                          <div className='text-muted small'>Countries</div>
                        </div>
                        <div className='text-center'>
                          <div className='fs-3 fw-semibold text-dark'>{dashboardData.mostTraveledBead.citiesVisited}</div>
                          <div className='text-muted small'>Cities</div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Total Beads Tracked Card */}
              <div className='col-xl-3'>
                <Card stretch className='shadow-lg border-0 rounded-3'>
                  <CardBody className='d-flex flex-column p-4'>
                    <div className='d-flex align-items-center mb-3'>
                      <span className='bg-info bg-opacity-15 rounded-circle p-3 me-3'>
                        <i className='bi bi-collection fs-2 text-info'></i>
                      </span>
                      <div>
                        <div className='fs-5 text-muted'>Total Beads Tracked</div>
                        <div className='fs-3 fw-semibold'>{dashboardData.totalBeadsTracked.total}</div>
                      </div>
                    </div>
                    <div className='mt-auto'>
                      <div className='d-flex justify-content-between'>
                        <div className='text-center'>
                          <div className='fs-3 fw-semibold text-success'>{dashboardData.totalBeadsTracked.active}</div>
                          <div className='text-muted small'>Active</div>
                        </div>
                        <div className='text-center'>
                          <div className='fs-3 fw-semibold text-danger'>{dashboardData.totalBeadsTracked.inactive}</div>
                          <div className='text-muted small'>Inactive</div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Recent Bead Activity Card */}
              <div className='col-xl-3'>
                <Card stretch className='shadow-lg border-0 rounded-3'>
                  <CardBody className='d-flex flex-column p-4'>
                    <div className='d-flex align-items-center mb-3'>
                      <span className='bg-warning bg-opacity-15 rounded-circle p-3 me-3'>
                        <i className='bi bi-activity fs-2 text-warning'></i>
                      </span>
                      <div>
                        <div className='fs-5 text-muted'>Recent Activity</div>
                        <div className='fs-3 fw-semibold'>Last Updated</div>
                      </div>
                    </div>
                    {firstBead && (
                      <div className='mt-auto'>
                        <div className='d-flex flex-column'>
                          <div className='fw-semibold'>{firstBead.beadName}</div>
                          <div className='d-flex justify-content-between'>
                            <span className='badge bg-light text-dark'>{firstBead.beadType || 5}</span>
                            <span className='badge bg-light text-dark'>{firstBead.material || 10}</span>
                          </div>
                          <div className='mt-2 text-end small text-muted'>
                            Updated: {new Date(firstBead.updatedAt || firstBead.createdAt || '').toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>

              {/* Top Location Card */}
              <div className='col-xl-3'>
                <Card stretch className='shadow-lg border-0 rounded-3'>
                  <CardBody className='d-flex flex-column p-4'>
                    <div className='d-flex align-items-center mb-3'>
                      <span className='bg-danger bg-opacity-15 rounded-circle p-3 me-3'>
                        <i className='bi bi-geo-alt fs-2 text-danger'></i>
                      </span>
                      <div>
                        <div className='fs-5 text-muted'>Top Location</div>
                        <div className='fs-3 fw-semibold'>{dashboardData.topLocations[0].city}</div>
                      </div>
                    </div>
                    <div className='mt-auto'>
                      <div className='d-flex justify-content-between align-items-center'>
                        <div>
                          <div className='fs-3 fw-semibold'>{dashboardData.topLocations[0].scans}</div>
                          <div className='text-muted small'>Total Scans</div>
                        </div>
                        <div className='progress flex-grow-1 ms-3' style={{ height: '6px' }}>
                          <div
                            className='progress-bar bg-danger'
                            role='progressbar'
                            style={{ width: '75%' }}
                            aria-valuenow={75}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

            </div>
          </div>

          {/* Charts */}
          <div className=''>
            <Card stretch>
              <CardBody >
                <div className='fs-5 fw-bold mb-3'>Bead Inventory Overview</div>
                {/* <LineWithAnnotations /> */}
                <div className='d-flex gap-3 '>
                  <LineZoomableTimeSeries />
                    <DonutBasic />
                </div>
              
                   {/* <LineWithAnnotations /> */}

              </CardBody>
            </Card>
          </div>
          {/* <div className='col-xxl-6'>
            <Card stretch>
              <CardBody>
                <div className='fs-5 fw-bold mb-3'>Bead Activity Heatmap</div>
                <HeatMapMultipleColors />
              </CardBody>
            </Card>
          </div> */}
        </div>
      </Page>
    </PageWrapper>
  );
};

export default DashboardPage;