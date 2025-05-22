// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import dayjs from 'dayjs';
// import classNames from 'classnames';
// import { getUserDataWithId } from '../../../common/data/userDummyData';
// import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
// import Page from '../../../layout/Page/Page';
// import SubHeader, {
// 	SubHeaderLeft,
// 	SubHeaderRight,
// 	SubheaderSeparator,
// } from '../../../layout/SubHeader/SubHeader';
// import Button from '../../../components/bootstrap/Button';
// import Card, {
// 	CardActions,
// 	CardBody,
// 	CardHeader,
// 	CardLabel,
// 	CardTitle,
// } from '../../../components/bootstrap/Card';
// import Avatar from '../../../components/Avatar';
// import Icon from '../../../components/icon/Icon';
// import { demoPagesMenu } from '../../../menu';
// import Badge from '../../../components/bootstrap/Badge';
// import Dropdown, {
// 	DropdownItem,
// 	DropdownMenu,
// 	DropdownToggle,
// } from '../../../components/bootstrap/Dropdown';
// import Chart, { IChartOptions } from '../../../components/extras/Chart';
// import dummyEventsData from '../../../common/data/dummyEventsData';
// import { priceFormat } from '../../../helpers/helpers';
// import EVENT_STATUS from '../../../common/data/enumEventStatus';
// import Alert from '../../../components/bootstrap/Alert';
// import CommonAvatarTeam from '../../../common/other/CommonAvatarTeam';
// import COLORS from '../../../common/data/enumColors';
// import useDarkMode from '../../../hooks/useDarkMode';
// import useTourStep from '../../../hooks/useTourStep';
// import { useGetUserByIdQuery } from '../../../redux/api/AuthApi';
// import Profile from '../../../assets/img/user6.png';
// import { FeaturedPlayList } from '../../../components/icon/material-icons';

// const EmployeePage = () => {
// 	useTourStep(19);
// 	const { darkModeStatus } = useDarkMode();

// 	const { id } = useParams();
// 	// const data = getUserDataWithId(id);
// 	const { data, error, isLoading } = useGetUserByIdQuery(id);
// 	const userData = data?.[0];
// 	console.log('====data====', data?.[0]);

// 	const [dayHours] = useState<IChartOptions>({
// 		series: [
// 			{
// 				data: [8, 12, 15, 20, 15, 22, 9],
// 			},
// 		],
// 		options: {
// 			colors: [process.env.REACT_APP_SUCCESS_COLOR],
// 			chart: {
// 				type: 'radar',
// 				width: 200,
// 				height: 200,
// 				sparkline: {
// 					enabled: true,
// 				},
// 			},
// 			xaxis: {
// 				categories: [
// 					'Monday',
// 					'Tuesday',
// 					'Wednesday',
// 					'Thursday',
// 					'Friday',
// 					'Saturday',
// 					'Sunday',
// 				],
// 				// convertedCatToNumeric: false,
// 			},
// 			tooltip: {
// 				theme: 'dark',
// 				fixed: {
// 					enabled: false,
// 				},
// 				x: {
// 					show: true,
// 				},
// 				y: {
// 					title: {
// 						// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 						formatter(seriesName) {
// 							return 'Hours';
// 						},
// 					},
// 				},
// 			},
// 			stroke: {
// 				curve: 'smooth',
// 				width: 2,
// 			},
// 			plotOptions: {
// 				radar: {
// 					polygons: {
// 						strokeColors: `${COLORS.SUCCESS.code}50`,
// 						strokeWidth: '1',
// 						connectorColors: `${COLORS.SUCCESS.code}50`,
// 					},
// 				},
// 			},
// 		},
// 	});

// 	const [isEditing, setIsEditing] = useState(false);
// 	const [showChangePassword, setShowChangePassword] = useState(false);
// 	const [profile, setProfile] = useState({
// 		name: 'John Doe',
// 		email: 'john.doe@example.com',
// 		phone: '+1 123 456 7890',
// 	});

// 	const [passwordData, setPasswordData] = useState({
// 		current: '',
// 		new: '',
// 		confirm: '',
// 		showPassword: false,
// 	});

// 	const handleEditToggle = () => setIsEditing(!isEditing);
// 	const handlePasswordToggle = () => setShowChangePassword(!showChangePassword);

// 	const handleChange = (e: any) => {
// 		setProfile({ ...profile, [e.target.name]: e.target.value });
// 	};

// 	const handlePasswordChange = (e: any) => {
// 		setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
// 	};

// 	const toggleShowPassword = () => {
// 		setPasswordData((prev) => ({
// 			...prev,
// 			showPassword: !prev.showPassword,
// 		}));
// 	};

// 	return (
// 		<PageWrapper title={`${userData?.fullName}`}>
// 			<Page>
// 				<div className='pt-3 pb-5 d-flex align-items-center'>
// 					<span className='display-4 fw-bold me-3'>{`${`${userData?.fullName}`}`}</span>
// 					<span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
// 						{userData?.role}
// 					</span>
// 				</div>
// 				<div className='row'>
// 					<div className='col-lg-4'>
// 						<Card className='shadow-3d-info'>
// 							<CardBody>
// 								<div className='row g-5'>
// 									<div className='col-12 d-flex justify-content-center'>
// 										<Avatar
// 											src={Profile}
// 											srcSet={Profile}
// 											style={{ width: '500px', height: '250px' }}
// 										/>
// 									</div>
// 								</div>
// 							</CardBody>
// 						</Card>
// 					</div>
// 					<div className='col-lg-8'>
// 						<Card className='shadow-3d-primary'>
// 							<CardHeader className='d-flex justify-content-between align-items-center'>
// 								<CardTitle className='h4 mb-0'>My Profile</CardTitle>
// 								<button
// 									className='btn btn-outline-primary'
// 									onClick={handleEditToggle}>
// 										Edit
// 								</button>
// 							</CardHeader>
// 							<CardBody>
// 								{!isEditing ? (
// 									<div>
// 										<p>
// 											<strong>Name:</strong> {profile.name}
// 										</p>
// 										<p>
// 											<strong>Email:</strong> {profile.email}
// 										</p>
// 										<p>
// 											<strong>Phone:</strong> {profile.phone}
// 										</p>
// 									</div>
// 								) : (
// 									<form>
// 										<div className='mb-3'>
// 											<label>Name</label>
// 											<input
// 												type='text'
// 												className='form-control'
// 												name='name'
// 												value={profile.name}
// 												onChange={handleChange}
// 											/>
// 										</div>
// 										<div className='mb-3'>
// 											<label>Email</label>
// 											<input
// 												type='email'
// 												className='form-control'
// 												name='email'
// 												value={profile.email}
// 												onChange={handleChange}
// 											/>
// 										</div>
// 										<div className='mb-3'>
// 											<label>Phone</label>
// 											<input
// 												type='text'
// 												className='form-control'
// 												name='phone'
// 												value={profile.phone}
// 												onChange={handleChange}
// 											/>
// 										</div>
// 									</form>
// 								)}


								
// 							</CardBody>
// 						</Card>
// 						<Card className='shadow-3d-primary'>
// 							<CardHeader>
// 								<CardLabel icon='Task' iconColor='danger'>
// 									<CardTitle>
// 										<CardLabel tag='div' className='h5'>
// 											Password Manager
// 										</CardLabel>
// 									</CardTitle>
// 								</CardLabel>
// 							</CardHeader>
// 							<CardBody>
// 								<button
// 									className='btn btn-outline-primary'
// 									onClick={handlePasswordToggle}>
// 									{showChangePassword ? 'Cancel' : 'Change Password'}
// 								</button>

// 								{showChangePassword && (
// 									<div className='mt-4'>
// 										<div className='mb-3'>
// 											<label>Current Password</label>
// 											<input
// 												type={
// 													passwordData.showPassword ? 'text' : 'password'
// 												}
// 												className='form-control'
// 												name='current'
// 												value={passwordData.current}
// 												onChange={handlePasswordChange}
// 											/>
// 										</div>
// 										<div className='mb-3'>
// 											<label>New Password</label>
// 											<input
// 												type={
// 													passwordData.showPassword ? 'text' : 'password'
// 												}
// 												className='form-control'
// 												name='new'
// 												value={passwordData.new}
// 												onChange={handlePasswordChange}
// 											/>
// 										</div>
// 										<div className='mb-3'>
// 											<label>Confirm New Password</label>
// 											<input
// 												type={
// 													passwordData.showPassword ? 'text' : 'password'
// 												}
// 												className='form-control'
// 												name='confirm'
// 												value={passwordData.confirm}
// 												onChange={handlePasswordChange}
// 											/>
// 										</div>
// 										<div className='mb-3 form-check'>
// 											<input
// 												type='checkbox'
// 												className='form-check-input'
// 												id='showPassToggle'
// 												onChange={toggleShowPassword}
// 											/>
// 											<label
// 												className='form-check-label'
// 												htmlFor='showPassToggle'>
// 												Show Passwords
// 											</label>
// 										</div>
// 										<button className='btn btn-primary'>Update Password</button>
// 									</div>
// 								)}
// 							</CardBody>
// 						</Card>
// 						{/* <Card>
// 							<CardHeader>
// 								<CardLabel icon='Task' iconColor='danger'>
// 									<CardTitle>
// 										<CardLabel tag='div' className='h5'>
// 											created Thred
// 										</CardLabel>
// 									</CardTitle>
// 								</CardLabel>
// 							</CardHeader>
// 							<CardBody>
// 								<div className='table-responsive'>
// 									<table className='table table-modern mb-0'>
// 										<thead>
// 											<tr>
// 												<th>Thread  ID</th>
// 												<th>Thread  Name</th>
// 												<th>Visibility</th>
// 												<th>Total Members</th>
// 												<th>QR Code</th>
// 											</tr>
// 										</thead>
// 										<tbody>
// 											{ data && data.map((item : any) => (
// 												<tr key={item.id}>
// 													<td>
// 														<div className='d-flex align-items-center'>
// 															<span
// 																className={classNames(
// 																	'badge',
// 																	'border border-2 border-light',
// 																	'rounded-circle',
// 																	'bg-success',
// 																	'p-2 me-2',
// 																	`bg-${item?.status?.color}`,
// 																)}>
// 																<span className='visually-hidden'>
// 																	{item.status?.fullName}
// 																</span>
// 															</span>
// 															<span className='text-nowrap'>
// 																{dayjs(
// 																	`${item.date} ${item.time}`,
// 																).format('MMM Do YYYY, h:mm a')}
// 															</span>
// 														</div>
// 													</td>
// 													<td>
// 														<div>
// 															<div>{item?.customer?.name}</div>
// 															<div className='small text-muted'>
// 																{item?.customer?.email}
// 															</div>
// 														</div>
// 													</td>
// 													<td>{item?.service?.name}</td>
// 													<td>{item?.duration}</td>
// 													<td>
// 														{item?.payment && priceFormat(item?.payment)}
// 													</td>
// 													<td>
// 														<Dropdown>
// 															<DropdownToggle hasIcon={false}>
// 																<Button
// 																	isLink
// 																	color={item?.status?.color}
// 																	icon='Circle'
// 																	className='text-nowrap'>
// 																	{item?.status?.name}
// 																</Button>
// 															</DropdownToggle>
// 															<DropdownMenu>
// 																{Object.keys(EVENT_STATUS).map(
// 																	(key) => (
// 																		<DropdownItem key={key}>
// 																			<div>
// 																				<Icon
// 																					icon='Circle'
// 																					color={
// 																						EVENT_STATUS[
// 																							key
// 																						].color
// 																					}
// 																				/>
// 																				{
// 																					EVENT_STATUS[
// 																						key
// 																					].name
// 																				}
// 																			</div>
// 																		</DropdownItem>
// 																	),
// 																)}
// 															</DropdownMenu>
// 														</Dropdown>
// 													</td>
// 												</tr>
// 											))}
// 										</tbody>
// 									</table>
// 								</div>
// 								{!data?.length && (
// 									<Alert color='warning' isLight icon='Report' className='mt-3'>
// 										There is no scheduled and assigned task.
// 									</Alert>
// 								)}
// 							</CardBody>
// 						</Card> */}
// 					</div>
// 				</div>
// 			</Page>
// 		</PageWrapper>
// 	);
// };

// export default EmployeePage;



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../../redux/api/AuthApi';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardTitle,
	CardLabel,
} from '../../../components/bootstrap/Card';
import Avatar from '../../../components/Avatar';
import Alert from '../../../components/bootstrap/Alert';
import Profile from '../../../assets/img/user6.png';

const EmployeePage = () => {
	const { id } = useParams();

	// Fetch user data by ID
	const { data, error, isLoading } = useGetUserByIdQuery(id);
	const userData = data?.[0];

	// Update user mutation
	const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

	// State for editing
	const [isEditing, setIsEditing] = useState(false);

	// Profile state
	const [profile, setProfile] = useState({
		name: '',
		email: '',
		phone: '',
	});

	// Sync user data into profile form
	useEffect(() => {
		if (userData) {
			setProfile({
				name: userData.fullName || '',
				email: userData.email || '',
				phone: userData.phone || '',
			});
		}
	}, [userData]);

	// Toggle edit mode
	const handleEditToggle = () => setIsEditing(!isEditing);

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProfile({ ...profile, [e.target.name]: e.target.value });
	};

	// Handle save and API call
	const handleSaveProfile = async () => {
		try {
			await updateUser({
				id,
				updatedData: {
					fullName: profile.name,
					email: profile.email,
					phone: profile.phone,
				},
			}).unwrap();
			alert('Profile updated successfully!');
			setIsEditing(false);
		} catch (err) {
			console.error('Error updating profile:', err);
			alert('Failed to update profile.');
		}
	};

	if (isLoading) return <Alert color='info'>Loading profile...</Alert>;
	if (error) return <Alert color='danger'>Failed to load user data.</Alert>;

	return (
		<PageWrapper title={`${userData?.fullName || 'Employee Profile'}`}>
			<Page>
				<div className='pt-3 pb-5 d-flex align-items-center'>
					<span className='display-4 fw-bold me-3'>{userData?.fullName}</span>
					<span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
						{userData?.role}
					</span>
				</div>

				<div className='row'>
					<div className='col-lg-4'>
						<Card className='shadow-3d-info'>
							<CardBody className='text-center'>
								<Avatar
									src={Profile}
									style={{ width: '300px', height: '200px', objectFit: 'cover' }}
								/>
							</CardBody>
						</Card>
					</div>

					<div className='col-lg-8'>
						<Card className='shadow-3d-primary'>
							<CardHeader className='d-flex justify-content-between align-items-center'>
								<CardTitle className='h4 mb-0'>My Profile</CardTitle>
								<button
									className='btn btn-outline-primary'
									onClick={handleEditToggle}
								>
									{isEditing ? 'Cancel' : 'Edit'}
								</button>
							</CardHeader>

							<CardBody>
								{!isEditing ? (
									<>
										<p><strong>Name:</strong> {profile.name }</p>
										<p><strong>Email:</strong> {profile.email}</p>
										<p><strong>Phone:</strong> {profile.phone}</p>
									</>
								) : (
									<form>
										<div className='mb-3'>
											<label>Name</label>
											<input
												type='text'
												className='form-control'
												name='name'
												value={profile.name}
												onChange={handleChange}
											/>
										</div>
										<div className='mb-3'>
											<label>Email</label>
											<input
												type='email'
												className='form-control'
												name='email'
												value={profile.email}
												onChange={handleChange}
											/>
										</div>
										<div className='mb-3'>
											<label>Phone</label>
											<input
												type='text'
												className='form-control'
												name='phone'
												value={profile.phone}
												onChange={handleChange}
											/>
										</div>
										<button
											type='button'
											className='btn btn-success'
											onClick={handleSaveProfile}
											disabled={isUpdating}
										>
											{isUpdating ? 'Saving...' : 'Save'}
										</button>
									</form>
								)}
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default EmployeePage;

