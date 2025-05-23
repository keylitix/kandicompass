import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import { demoPagesMenu } from '../../../menu';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import { getFirstLetter, priceFormat } from '../../../helpers/helpers';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import PAYMENTS from '../../../common/data/enumPaymentMethod';
import useSortableData from '../../../hooks/useSortableData';
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup';
import Popovers from '../../../components/bootstrap/Popovers';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import useDarkMode from '../../../hooks/useDarkMode';
import UserManagementAdd from './UserManagementAdd';

import { fetchUsers, deleteUser, addUser } from '../../../redux/api/userApi';
import showNotification from '../../../components/extras/showNotification';
import dayjs from 'dayjs';
import UserManagementEdit from './UserMangementEdit';

const UserManagement = () => {
  const { darkModeStatus } = useDarkMode();

  // State management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<any>(null);
  const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
  const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Formik for search/filter
  const formik = useFormik({
    initialValues: {
      searchInput: '',
      payment: Object.keys(PAYMENTS).map((i) => PAYMENTS[i].name),
      minPrice: '',
      maxPrice: '',
    },
    onSubmit: (values) => {
      // Filter logic can be added here
    },
  });

  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUsers(currentPage, perPage);
        setUsersData(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        showNotification(
          <span className="d-flex align-items-center">
            <Icon icon="Error" size="lg" className="me-1" />
            <span>Failed to load users</span>
          </span>,
          'Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, perPage]);

  // Sorting functionality
  const { items, requestSort, getClassNamesFor } = useSortableData(usersData);

  // Delete user handler
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await deleteUser(userId);
        if (response) {
          setUsersData((prevData) => prevData.filter((user) => user._id !== userId));
          showNotification(
            <span className="d-flex align-items-center">
              <Icon icon="CheckCircle" size="lg" className="me-1" />
              <span>User Deleted Successfully</span>
            </span>,
            'The user has been removed from the system.'
          );
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        showNotification(
          <span className="d-flex align-items-center">
            <Icon icon="Error" size="lg" className="me-1" />
            <span>Error Deleting User</span>
          </span>,
          'An error occurred while deleting the user.'
        );
      }
    }
  };

  // Refresh user list
  const refreshUserList = async () => {
    try {
      const data = await fetchUsers(currentPage, perPage);
      setUsersData(data);
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  return (
    <PageWrapper title={demoPagesMenu.crm.subMenu.customersList.text}>
      <SubHeader>
        <SubHeaderLeft>
          <label htmlFor="searchInput" className="border-0 bg-transparent cursor-pointer me-0">
            <Icon icon="Search" size="2x" color="primary" />
          </label>
          <Input
            id="searchInput"
            type="search"
            className="border-0 shadow-none bg-transparent"
            placeholder="Search user..."
            onChange={formik.handleChange}
            value={formik.values.searchInput}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          <Dropdown>
            <DropdownToggle hasIcon={false}>
              <Button
                icon="FilterAlt"
                color="dark"
                isLight
                className="btn-only-icon position-relative"
                aria-label="Filter"
              />
            </DropdownToggle>
            <DropdownMenu isAlignmentEnd size="lg">
              <div className="container py-2">
                <div className="row g-3">
                  <FormGroup label="Balance" className="col-12">
                    <InputGroup>
                      <Input
                        id="minPrice"
                        ariaLabel="Minimum price"
                        placeholder="Min."
                        onChange={formik.handleChange}
                        value={formik.values.minPrice}
                      />
                      <InputGroupText>to</InputGroupText>
                      <Input
                        id="maxPrice"
                        ariaLabel="Maximum price"
                        placeholder="Max."
                        onChange={formik.handleChange}
                        value={formik.values.maxPrice}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup label="Payments" className="col-12">
                    <ChecksGroup>
                      {Object.keys(PAYMENTS).map((payment) => (
                        <Checks
                          key={PAYMENTS[payment].name}
                          id={PAYMENTS[payment].name}
                          label={PAYMENTS[payment].name}
                          name="payment"
                          value={PAYMENTS[payment].name}
                          onChange={formik.handleChange}
                          checked={formik.values.payment.includes(PAYMENTS[payment].name)}
                        />
                      ))}
                    </ChecksGroup>
                  </FormGroup>
                </div>
              </div>
            </DropdownMenu>
          </Dropdown>
          <SubheaderSeparator />
          <Button
            icon="PersonAdd"
            color="primary"
            isLight
            onClick={() => setAddModalStatus(true)}
          >
            New User
          </Button>
        </SubHeaderRight>
      </SubHeader>
      
      <Page>
        <div className="row h-100">
          <div className="col-12">
            <Card stretch>
              <CardBody isScrollable className="table-responsive">
                {isLoading ? (
                  <div className="text-center py-5">
                    <Icon icon="Loop" size="3x"  />
                    <p>Loading users...</p>
                  </div>
                ) : (
                  <table className="table table-modern table-hover">
                    <thead>
                      <tr>
                        <th onClick={() => requestSort('fullName')} className="cursor-pointer">
                          User <Icon size="lg" className={getClassNamesFor('fullName')} icon="FilterList" />
                        </th>
                        <th>Email</th>
                        <th onClick={() => requestSort('membership.startDate')} className="cursor-pointer">
                          Membership <Icon size="lg" className={getClassNamesFor('membership.startDate')} icon="FilterList" />
                        </th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-5">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        dataPagination(items, currentPage, perPage).map((user) => (
                          <tr key={user._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                  <div className="ratio ratio-1x1 me-3" style={{ width: 48 }}>
                                    <div
                                      className={`bg-l${
                                        darkModeStatus ? 'o25' : '25'
                                      }-${getColorNameWithIndex(user.id || 0)} text-${getColorNameWithIndex(
                                        user.id || 0
                                      )} rounded-2 d-flex align-items-center justify-content-center`}
                                    >
                                      <span className="fw-bold">{getFirstLetter(user.fullName || 'N/A')}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="fs-6 fw-bold">{user.fullName || 'No Name'}</div>
                                  <div className="text-muted">
                                    <small>@{user.fullName || 'No username'}</small>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <Button
                                isLink
                                color="light"
                                icon="Email"
                                className="text-lowercase"
                                tag="a"
                                href={`mailto:${user.email}`}
                              >
                                {user.email || 'No Email'}
                              </Button>
                            </td>
                            <td>
                              {user.membership?.startDate
                                ? dayjs(user.membership.startDate).format('MMM D, YYYY')
                                : 'N/A'}
                            </td>
                            <td>
                              <span
                                className={`badge bg-${
                                  user.accountStatus === 'Active'
                                    ? 'success'
                                    : user.accountStatus === 'Suspended'
                                    ? 'warning'
                                    : 'danger'
                                }`}
                              >
                                {user.accountStatus || 'Inactive'}
                              </span>
                            </td>
                            <td>{user.role || 'N/A'}</td>
                            <td>
                              {user.updatedAt
                                ? dayjs(user.updatedAt).format('MMM D, YYYY')
                                : 'N/A'}
                            </td>
                            <td>
                              <Dropdown>
                                <DropdownToggle hasIcon={false}>
                                  <Button
                                    icon="MoreHoriz"
                                    color="dark"
                                    isLight
                                    shadow="sm"
                                    aria-label="More actions"
                                  />
                                </DropdownToggle>
                                <DropdownMenu isAlignmentEnd>
                                  <DropdownItem>
                                    <Button
                                      icon="Edit"
                                      tag="a"
                                      onClick={() => {
                                        setEditItem(user);
                                        setEditModalStatus(true);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </DropdownItem>
                                  <DropdownItem>
                                    <Button
                                      icon="Delete"
                                      color="danger"
                                      isLight
                                      tag="a"
                                      onClick={() => handleDeleteUser(user._id)}
                                    >
                                      Delete
                                    </Button>
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </CardBody>
              <PaginationButtons
                data={usersData}
                label="users"
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </Card>
          </div>
        </div>
      </Page>

      {/* Edit User Modal */}
      {editItem && (
        <UserManagementEdit
          setIsOpen={setEditModalStatus}
          isOpen={editModalStatus}
          id={editItem._id}
          editItem={editItem}
          onUserUpdated={refreshUserList}
        />
      )}

      {/* Add User Modal */}
      <UserManagementAdd
        setIsOpen={setAddModalStatus}
        isOpen={addModalStatus}
        id="add-user-modal"
        onUserAdded={refreshUserList}
      />
    </PageWrapper>
  );
};

export default UserManagement;