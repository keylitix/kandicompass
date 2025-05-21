import React, { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Option from '../../../components/bootstrap/Option';
import { addUser, fetchUsers } from '../../../redux/api/userApi';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Membership {
  subscriptionPlan: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  billingAddress: Address;
}

interface IUserFormValues {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture?: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  role: string;
  accountStatus: string;
  emailVerified: boolean;
  twoFactorAuthEnabled: boolean;
  membership: Membership;
}

interface ICustomerEditModalProps {
  id: string;
  isOpen: boolean;
  editItem?: Partial<IUserFormValues>;
  setIsOpen: (isOpen: boolean) => void;
  onUserAdded?: () => void;
}

const UserManagementAdd: FC<ICustomerEditModalProps> = ({ 
  id, 
  isOpen, 
  setIsOpen, 
  editItem,
  onUserAdded 
}) => {
  const initialMembership: Membership = {
    subscriptionPlan: 'Free',
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
    paymentMethod: 'Credit Card',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
  };

  const formik = useFormik<IUserFormValues>({
    initialValues: {
      fullName: editItem?.fullName || '',
      username: editItem?.username || '',
      email: editItem?.email || '',
      password: 'Default@Password123',
      phoneNumber: editItem?.phoneNumber || '+1234567890',
      profilePicture: editItem?.profilePicture || '',
      dateOfBirth: editItem?.dateOfBirth || dayjs().subtract(18, 'years').format('YYYY-MM-DD'),
      gender: editItem?.gender || "male",
      address: {
        street: editItem?.address?.street || '',
        city: editItem?.address?.city || '',
        state: editItem?.address?.state || '',
        zipCode: editItem?.address?.zipCode || '',
        country: editItem?.address?.country || 'US',
      },
      role: editItem?.role || 'Customer',
      accountStatus: editItem?.accountStatus || 'Active',
      emailVerified: editItem?.emailVerified || false,
      twoFactorAuthEnabled: editItem?.twoFactorAuthEnabled || false,
      membership: editItem?.membership || initialMembership,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const userData = {
          ...values,
          dateOfBirth: new Date(values.dateOfBirth).toISOString(),
          membership: {
            ...values.membership,
            startDate: new Date(values.membership.startDate).toISOString(),
            endDate: new Date(values.membership.endDate).toISOString(),
          },
        };

        const response = await addUser(userData);

        if (response) {
          showNotification(
            <span className="d-flex align-items-center">
              <Icon icon="Info" size="lg" className="me-1" />
              <span>User Added Successfully</span>
            </span>,
            `User ${values.fullName} has been created successfully.`
          );

          // Call the callback to refresh user list
          if (onUserAdded) {
            onUserAdded();
          }

          setIsOpen(false);
        }
      } catch (error) {
        console.error('Error adding user:', error);
        showNotification(
          <span className="d-flex align-items-center">
            <Icon icon="Error" size="lg" className="me-1" />
            <span>Error Creating User</span>
          </span>,
          'An error occurred while creating the user. Please try again.'
        );
      }
    },
  });

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl" titleId={id}>
      <ModalHeader setIsOpen={setIsOpen} className="p-4">
        <ModalTitle id={id}>{editItem?.fullName ? `Edit ${editItem.fullName}` : 'Add New User'}</ModalTitle>
      </ModalHeader>
      <ModalBody className="px-4">
        <div className="row g-4">
          <FormGroup id="fullName" label="Full Name" className="col-md-6">
            <Input
              onChange={formik.handleChange}
              value={formik.values.fullName}
              autoFocus
            />
          </FormGroup>
          <FormGroup id="username" label="Username" className="col-md-6">
            <Input
              onChange={formik.handleChange}
              value={formik.values.username}
            />
          </FormGroup>
          <FormGroup id="email" label="Email" className="col-md-6">
            <Input
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              required
            />
          </FormGroup>
          <FormGroup id="password" label="Password" className="col-md-6">
            <Input
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              required
            />
          </FormGroup>
          <FormGroup id="phoneNumber" label="Phone Number" className="col-md-6">
            <Input
              type="tel"
              onChange={formik.handleChange}
              value={formik.values.phoneNumber}
            />
          </FormGroup>
          <FormGroup id="dateOfBirth" label="Date of Birth" className="col-md-6">
            <Input
              type="date"
              onChange={formik.handleChange}
              value={formik.values.dateOfBirth}
            />
          </FormGroup>
          <FormGroup id="gender" label="Gender" className="col-md-6">
            <Select
              id="gender"
              name="gender"
              ariaLabel="Select gender"
              onChange={formik.handleChange}
              value={formik.values.gender}
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
              <Option value="Prefer not to say">Prefer not to say</Option>
            </Select>
          </FormGroup>
          <FormGroup id="role" label="Role" className="col-md-6">
            <Select
              id="role"
              name="role"
              ariaLabel="Select role"
              onChange={formik.handleChange}
              value={formik.values.role}
            >
              <Option value="Customer">Customer</Option>
              <Option value="Admin">Admin</Option>
              <Option value="Moderator">Moderator</Option>
            </Select>
          </FormGroup>
          <FormGroup id="accountStatus" label="Account Status" className="col-md-6">
            <Select
              id="accountStatus"
              name="accountStatus"
              ariaLabel="Select account status"
              onChange={formik.handleChange}
              value={formik.values.accountStatus}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              <Option value="Suspended">Suspended</Option>
            </Select>
          </FormGroup>

          {/* Address Fields */}
          <div className="col-md-12">
            <Card className="rounded-1 mb-0">
              <CardHeader>
                <CardLabel icon="LocationOn">
                  <CardTitle>Address Information</CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className="row g-3">
                  <FormGroup id="address.street" label="Street" className="col-12">
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.address.street}
                    />
                  </FormGroup>
                  <FormGroup id="address.city" label="City" className="col-md-4">
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.address.city}
                    />
                  </FormGroup>
                  <FormGroup id="address.state" label="State" className="col-md-4">
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.address.state}
                    />
                  </FormGroup>
                  <FormGroup id="address.zipCode" label="Zip Code" className="col-md-4">
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.address.zipCode}
                    />
                  </FormGroup>
                  <FormGroup id="address.country" label="Country" className="col-md-4">
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.address.country}
                    />
                  </FormGroup>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Membership Fields */}
          <div className="col-md-12">
            <Card className="rounded-1 mb-0">
              <CardHeader>
                <CardLabel icon="CardMembership">
                  <CardTitle>Membership Information</CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className="row g-3">
                  <FormGroup id="membership.subscriptionPlan" label="Subscription Plan" className="col-md-6">
                    <Select
                      id="membership.subscriptionPlan"
                      name="membership.subscriptionPlan"
                      ariaLabel="Select subscription plan"
                      onChange={formik.handleChange}
                      value={formik.values.membership.subscriptionPlan}
                    >
                      <Option value="Free">Free</Option>
                      <Option value="Basic">Basic</Option>
                      <Option value="Premium">Premium</Option>
                    </Select>
                  </FormGroup>
                  <FormGroup id="membership.paymentMethod" label="Payment Method" className="col-md-6">
                    <Select
                      id="membership.paymentMethod"
                      name="membership.paymentMethod"
                      ariaLabel="Select payment method"
                      onChange={formik.handleChange}
                      value={formik.values.membership.paymentMethod}
                    >
                      <Option value="Credit Card">Credit Card</Option>
                      <Option value="PayPal">PayPal</Option>
                      <Option value="Bank Transfer">Bank Transfer</Option>
                    </Select>
                  </FormGroup>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="px-4 pb-4">
        <Button color="secondary" onClick={() => setIsOpen(false)} className="me-2">
          Cancel
        </Button>
        <Button color="primary" onClick={() => formik.handleSubmit()}>
          {editItem ? 'Update User' : 'Add User'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UserManagementAdd;