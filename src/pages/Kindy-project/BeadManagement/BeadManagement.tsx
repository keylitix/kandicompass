import React, { useState } from 'react';
import { useFormik } from 'formik';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import { demoPagesMenu } from '../../../menu';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import { getFirstLetter } from '../../../helpers/helpers';
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
import BeadEditModal from './BeadMangementEditModals';
import BeadAddModal from './BeadManagementAdd';
import { useGetBeadsQuery, useDeleteBeadMutation } from '../../../redux/api/beadApi';
import showNotification from '../../../components/extras/showNotification';
import Modal, { ModalBody, ModalHeader } from '../../../components/bootstrap/Modal';
import QrTemplateModal from '../../kindy-components/QrTemplateModal';

const safeGetColorNameWithIndex = (index?: string | number) => {
  if (index === undefined || index === null) return 'primary';

  try {
    const num = typeof index === 'string'
      ? parseInt(index, 10) || 0
      : index;
    return getColorNameWithIndex(Math.abs(num) % 20);
  } catch {
    return 'primary';
  }
};

const BeadManagement = () => {
  const { darkModeStatus } = useDarkMode();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);
  const [editItem, setEditItem] = useState<any>(null);
  const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
  const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
  const [deleteBead] = useDeleteBeadMutation();
  const [qrModal, setQrModal] = useState({ isOpen: false, src: '', name: '' });

  const {
    data: beadsResponse,
    isLoading,
    isError,
    refetch
  } = useGetBeadsQuery({
    page_number: currentPage,
    page_size: perPage,
  });

  // const beadsData = beadsResponse?.data || [];
    const beadsData = Array.isArray(beadsResponse?.data?.data)
  ? beadsResponse.data?.data
  : [];

  const formik = useFormik({
    initialValues: {
      searchInput: '',
      payment: Object.keys(PAYMENTS).map((i) => PAYMENTS[i].name),
      minPrice: '',
      maxPrice: '',
      beadType: '',
    },
    onSubmit: (values) => {
      // Filter logic is handled in the filteredData calculation
    },
  });

  const filteredData = beadsData.filter((f  :any) => {
    if (!f) return false;

    return (
      (f.beadName?.toLowerCase().includes(formik.values.searchInput.toLowerCase()) || '') &&
      (formik.values.beadType === '' || f.beadType?.toLowerCase() === formik.values.beadType.toLowerCase()) &&
      (formik.values.minPrice === '' || (f.pricePerUnit || 0) >= Number(formik.values.minPrice)) &&
      (formik.values.maxPrice === '' || (f.pricePerUnit || 0) <= Number(formik.values.maxPrice))
    );
  });

  const { items, requestSort, getClassNamesFor } = useSortableData(filteredData);

  const handleSuccess = () => {
    refetch();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this bead?')) {
      try {
        await deleteBead(id).unwrap();
        handleSuccess();
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='CheckCircle' size='lg' className='me-1' />
            <span>Bead Deleted</span>
          </span>,
          'Bead has been deleted successfully.',
        );
      } catch (error) {
        console.error('Failed to delete bead:', error);
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Error' size='lg' className='me-1' />
            <span>Error</span>
          </span>,
          'Failed to delete bead. Please try again.',
        );
      }
    }
  };

  if (isLoading) return <div className='text-center py-5'>Loading beads...</div>;
  if (isError) return <div className='text-center py-5'>Error loading beads data</div>;

  return (
    <PageWrapper title={demoPagesMenu.crm.subMenu.customersList.text}>
      <SubHeader>
        <SubHeaderLeft>
          <label className='border-0 bg-transparent cursor-pointer me-0' htmlFor='searchInput'>
            <Icon icon='Search' size='2x' color='primary' />
          </label>
          <Input
            id='searchInput'
            type='search'
            className='border-0 shadow-none bg-transparent'
            placeholder='Search beads...'
            onChange={formik.handleChange}
            value={formik.values.searchInput}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          <Dropdown>
            <DropdownToggle hasIcon={false}>
              <Button
                icon='FilterAlt'
                color='dark'
                isLight
                className='btn-only-icon position-relative'
                aria-label='Filter'
              >
                {beadsData.length !== filteredData.length && (
                  <Popovers desc='Filtering applied' trigger='hover'>
                    <span className='position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2'>
                      <span className='visually-hidden'>there is filtering</span>
                    </span>
                  </Popovers>
                )}
              </Button>
            </DropdownToggle>
            <DropdownMenu isAlignmentEnd size='lg'>
              <div className='container py-2'>
                <div className='row g-3'>
                  <FormGroup label='Price Range' className='col-12'>
                    <InputGroup>
                      <Input
                        id='minPrice'
                        ariaLabel='Minimum price'
                        placeholder='Min.'
                        onChange={formik.handleChange}
                        value={formik.values.minPrice}
                        type='number'
                      />
                      <InputGroupText>to</InputGroupText>
                      <Input
                        id='maxPrice'
                        ariaLabel='Maximum price'
                        placeholder='Max.'
                        onChange={formik.handleChange}
                        value={formik.values.maxPrice}
                        type='number'
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup label='Bead Type' className='col-12'>
                    <Input
                      id='beadType'
                      ariaLabel='Bead Type'
                      placeholder='Filter by type'
                      onChange={formik.handleChange}
                      value={formik.values.beadType}
                    />
                  </FormGroup>
                </div>
              </div>
            </DropdownMenu>
          </Dropdown>
          <SubheaderSeparator />
          <Button
            icon='PersonAdd'
            color='primary'
            isLight
            onClick={() => {
              setAddModalStatus(true);
              setEditItem(null);
            }}
          >
            New Bead
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page>
        <div className='row h-100'>
          <div className='col-12'>
            <Card stretch>
              <CardBody isScrollable className='table-responsive'>
                <table className='table table-modern table-hover'>
                  <thead>
                    <tr>
                      <th onClick={() => requestSort('_id')} className='cursor-pointer'>
                        Bead ID{' '}
                        <Icon size='lg' className={getClassNamesFor('_id')} icon='FilterList' />
                      </th>
                      <th>Bead Name</th>
                      <th>Bead Type</th>
                      <th>Color</th>
                      <th>Size</th>
                      <th>Shape</th>
                      <th onClick={() => requestSort('pricePerUnit')} className='cursor-pointer'>
                        Price{' '}
                        <Icon size='lg' className={getClassNamesFor('pricePerUnit')} icon='FilterList' />
                      </th>
                      <th>Quantity</th>
                      <th>QR Code</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPagination(items, currentPage, perPage).map((i) => (
                      <tr key={i?._id || Math.random()}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='flex-shrink-0'>
                              <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>
                                <div
                                  className={`bg-l${darkModeStatus ? 'o25' : '25'}-${safeGetColorNameWithIndex(i?._id)} text-${safeGetColorNameWithIndex(i?._id)} rounded-2 d-flex align-items-center justify-content-center`}
                                >
                                  <span className='fw-bold'>{getFirstLetter(i?.beadName || '')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='fs-6 fw-bold'>{i?.beadName || 'N/A'}</div>
                        </td>
                        <td>
                          <div className='fs-6 fw-bold'>{i?.beadType || 'N/A'}</div>
                        </td>
                        <td>
                          <div className='fs-6 fw-bold'>
                            <span
                              className='badge p-2'
                              style={{ backgroundColor: i?.color?.toLowerCase() || 'transparent' }}
                            >
                              {i?.color || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className='fs-6 fw-bold'>{i?.size ? `${i.size}mm` : 'N/A'}</div>
                        </td>
                        <td>
                          <div className='fs-6 fw-bold'>{i?.shape || 'N/A'}</div>
                        </td>
                        <td> 
                          <div className='fs-6 fw-bold'>
                            ${i?.pricePerUnit?.toFixed(2) || '0.00'}
                          </div>
                        </td>
                        <td>
                          <div className='fs-6 fw-bold'>{i?.quantity || '0'}</div>
                        </td>
                        <td>
                          {i?.qrCode ? (
                            <div 
                              className="d-flex justify-content-center"
                              onClick={() => setQrModal({ isOpen: true, src: `${process.env.REACT_APP_API_URL}/${i.qrCode}`, name: i?.beadName })}
                            >
                              <div
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer',
                                }}
                                className="hover-scale"
                              >
                                <img
                                  src={`${process.env.REACT_APP_API_URL}/${i.qrCode}`}
                                  alt="QR Code"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    transition: 'all 0.3s ease',
                                  }}
                                  className="hover-transform-scale"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className='fs-6 text-muted text-center'>No QR</div>
                          )}
                        </td>
                        <td>
                          <Dropdown>
                            <DropdownToggle hasIcon={false}>
                              <Button
                                icon='MoreHoriz'
                                color='dark'
                                isLight
                                shadow='sm'
                                aria-label='More actions'
                              />
                            </DropdownToggle>
                            <DropdownMenu isAlignmentEnd>
                              <DropdownItem>
                                <Button
                                  icon='Edit'
                                  tag='a'
                                  onClick={() => {
                                    setEditModalStatus(true);
                                    setEditItem(i);
                                  }}
                                >
                                  Edit
                                </Button>
                              </DropdownItem>
                              <DropdownItem>
                                <Button
                                  icon='Delete'
                                  color='danger'
                                  isLight
                                  tag='a'
                                  onClick={() => handleDelete(i?._id)}
                                >
                                  Delete
                                </Button>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
              <PaginationButtons
                data={filteredData}
                label='beads'
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </Card>
          </div>
        </div>
      </Page>

      {/* QR Code Modal */}
      <Modal
        isOpen={false}
        setIsOpen={() => setQrModal({ isOpen: false, src: '', name: '' })}
        titleId='qr-modal'
        isCentered
        isScrollable
        size='sm'
      >
        <ModalHeader setIsOpen={() => setQrModal({ isOpen: false, src: '', name: '' })}>
          QR Code
        </ModalHeader>
        <ModalBody>
          <div className='text-center'>
            <img
              src={qrModal.src}
              alt="Full Size QR Code"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </ModalBody>
      </Modal>

      <QrTemplateModal 
        isOpen={qrModal.isOpen} 
        setIsOpen={() => setQrModal({...qrModal, isOpen: false, src: '', name: ''})} 
        beadName={qrModal.name} 
        qrUrl={qrModal.src} 
      />

      <BeadEditModal
        setIsOpen={setEditModalStatus}
        isOpen={editModalStatus}
        id={editItem?._id || ''}
        editItem={editItem}
        onSuccess={handleSuccess}
      />
      <BeadAddModal
        setIsOpen={setAddModalStatus}
        isOpen={addModalStatus}
        onSuccess={handleSuccess} 
        id={''} 
      />
    </PageWrapper>
  );
};

export default BeadManagement;