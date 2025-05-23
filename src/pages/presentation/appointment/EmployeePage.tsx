import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '../../../redux/api/AuthApi';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, {
  CardBody,
  CardHeader,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Avatar from '../../../components/Avatar';
import Alert from '../../../components/bootstrap/Alert';
import BackupProfile from '../../../assets/img/user6.png';
import LoadingWrapper from '../../Kindy-project/other/onLoading';
import ErrorWrapper from '../../Kindy-project/other/onError';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Profile {
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
}

const EmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetUserByIdQuery(id!);
  const userData = data?.[0];

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    fullName: '',
    email: '',
    phoneNumber: '',
    profilePicture: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userData) {
      setProfile({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        profilePicture: userData.profilePicture || '',
        dateOfBirth: userData.dateOfBirth?.split('T')[0] || '',
        gender: userData.gender || '',
        address: {
          street: userData.address?.street || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          zipCode: userData.address?.zipCode || '',
          country: userData.address?.country || '',
        },
      });
    }
  }, [userData]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser({
        id: id!,
        updatedData: profile,
      }).unwrap();
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageDataUrl = reader.result as string;
      setProfile((prev) => ({ ...prev, profilePicture: imageDataUrl }));

      try {
        await updateUser({
          id: id!,
          updatedData: { ...profile, profilePicture: imageDataUrl },
        }).unwrap();

        alert('Profile picture updated successfully!');
      } catch (err) {
        console.error('Error updating profile picture:', err);
        alert('Failed to update profile picture.');
      }
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) return <LoadingWrapper />;
  if (error) return <ErrorWrapper />;

  return (
    <PageWrapper title={userData?.fullName || 'Employee Profile'}>
      <Page>
        <div className="pt-3 pb-5 d-flex align-items-center">
          <span className="display-4 fw-bold me-3">{userData?.fullName}</span>
          <span className="border border-success border-2 text-success fw-bold px-3 py-2 rounded">
            {userData?.role}
          </span>
        </div>

        <div className="row">
          <div className="col-lg-4 position-relative">
            <Card
              className="shadow-3d-info"
              style={{ height: '350px', objectFit: 'cover', cursor: 'pointer' }}
              onClick={handleProfileImageClick}
            >
              <CardBody className="text-center p-0">
                <Avatar
                  src={profile.profilePicture || BackupProfile}
                  style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                />
                <div
                  style={{
                      position: 'absolute',
                    bottom: '70px',
                    right: 'calc(50% - 150px + 15px)', 
                    backgroundColor: '#007bff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    color: 'white',
                    fontSize: '30px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                  }}
                >
                  +
                </div>
              </CardBody>
            </Card>
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleProfileImageChange}
            />
          </div>

          <div className="col-lg-8">
            <Card className="shadow-3d-primary">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <CardTitle className="h4 mb-0">My Profile</CardTitle>
                <button
                  className="btn btn-outline-primary"
                  onClick={handleEditToggle}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </CardHeader>

              <CardBody>
                {!isEditing ? (
                  <>
                    <p>
                      <strong>Name:</strong> {profile.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {profile.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {profile.phoneNumber}
                    </p>
                    <p>
                      <strong>Gender:</strong> {profile.gender}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong> {profile.dateOfBirth}
                    </p>
                    <p>
                      <strong>Address:</strong>
                    </p>
                    <ul>
                      <li>{profile.address.street}</li>
                      <li>
                        {profile.address.city}, {profile.address.state}
                      </li>
                      <li>
                        {profile.address.zipCode}, {profile.address.country}
                      </li>
                    </ul>
                  </>
                ) : (
                  <form>
                    <div className="mb-3">
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Gender</label>
                      <select
                        className="form-control"
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dateOfBirth"
                        value={profile.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Street</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.street"
                        value={profile.address.street}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.city"
                        value={profile.address.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.state"
                        value={profile.address.state}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.zipCode"
                        value={profile.address.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.country"
                        value={profile.address.country}
                        onChange={handleChange}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-success"
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
