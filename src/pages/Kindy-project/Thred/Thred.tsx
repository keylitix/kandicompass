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
import useSortableData from '../../../hooks/useSortableData';
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup';
import Popovers from '../../../components/bootstrap/Popovers';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import useDarkMode from '../../../hooks/useDarkMode';
import ThreadAddModal from './ThredAdd';
import { useGetThreadsQuery, useDeleteThreadMutation } from '../../../redux/api/thredApi';
import showNotification from '../../../components/extras/showNotification';
import Modal, { ModalBody, ModalHeader } from '../../../components/bootstrap/Modal';
import { error } from 'console';
import ErrorWrapper from '../other/onError';
import LoadingWrapper from '../other/onLoading';
import QrTemplateModal from '../../kindy-components/QrTemplateModal';

const safeGetColorNameWithIndex = (index?: string | number) => {
  if (index === undefined || index === null) return 'primary';
  try {
    const num = typeof index === 'string' ? parseInt(index, 10) || 0 : index;
    return getColorNameWithIndex(Math.abs(num) % 20);
  } catch {
    return 'primary';
  }
};

const ThreadManagement = () => {
  const { darkModeStatus } = useDarkMode();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);
  const [deleteThread] = useDeleteThreadMutation();
  // const [qrModal, setQrModal] = useState({ isOpen: false, src: '', threadName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(undefined);
  const [qrModal, setQrModal] = useState({ isOpen: false, src: '', name: '' });

  const {
    data: threadsResponse,
    isLoading,
    isError,
    refetch
  } = useGetThreadsQuery({
    page_number: currentPage,
    page_size: perPage,
  });

  // const threadsData = threadsResponse?.data || [];
const threadsData = Array.isArray(threadsResponse?.data?.data)
  ? threadsResponse.data?.data : [];


  const formik = useFormik({
    initialValues: {
      searchInput: '',
      threadIdFilter: '',
    },
    onSubmit: () => {
      // Filter logic is handled in the filteredData calculation
    },
  });

  const filteredData = threadsData?.filter((f: any) => {
    if (!f) return false;
    return (
      (f.threadName?.toLowerCase().includes(formik.values.searchInput.toLowerCase()) || '')
    );
  });
  console.log('filteredDatafilteredData', filteredData)
  const { items, requestSort, getClassNamesFor } = useSortableData(filteredData);
  console.log('itemsitems', items)
  const handleSuccess = () => {
    refetch();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this thread?')) {
      try {
        await deleteThread(id).unwrap();
        handleSuccess();
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='CheckCircle' size='lg' className='me-1' />
            <span>Thread Deleted</span>
          </span>,
          'Thread has been deleted successfully.',
        );
      } catch (error) {
        console.error('Failed to delete thread:', error);
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Error' size='lg' className='me-1' />
            <span>Error</span>
          </span>,
          'Failed to delete thread. Please try again.',
        );
      }
    }
  };

  const handleDownloadQR = (src: string, threadName: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `QR_${threadName || 'Thread'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintQR = (src: string, threadName: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${threadName}</title>
            <style>
              body { text-align: center; padding: 20px; }
              img { max-width: 100%; height: auto; margin: 20px 0; }
              h1 { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>${threadName}</h1>
            <img src="${src}" alt="QR Code" />
            <p>Scan this QR code to access the thread</p>
            <script>
              setTimeout(function() { window.print(); window.close(); }, 100);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };


  return (
    <PageWrapper title={demoPagesMenu.crm.subMenu.customersList.text} className='mt-3'>
      <SubHeader>
        <SubHeaderLeft>
          <label className='border-0 bg-transparent cursor-pointer me-0' htmlFor='searchInput'>
            <Icon icon='Search' size='2x' color='primary' />
          </label>
          <Input
            id='searchInput'
            type='search'
            className='border-0 shadow-none bg-transparent'
            placeholder='Search threads...'
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
                {threadsData.length !== filteredData.length && (
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
                  <FormGroup label='Thread ID' className='col-12'>
                    <Input
                      id='threadIdFilter'
                      ariaLabel='Thread ID'
                      placeholder='Filter by Thread ID'
                      onChange={formik.handleChange}
                      value={formik.values.threadIdFilter}
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
              setIsModalOpen(true);
              setSelectedThread(undefined);
            }}
          >
            New Thread
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page>
        <div className='row h-100'>
          <div className='col-12'>
            {isError ? <ErrorWrapper /> : isLoading ? <LoadingWrapper /> : (
              <Card stretch>
                <CardBody isScrollable className='table-responsive'>
                  <table className='table table-modern table-hover'>
                    <thead>
                      <tr>
                        <th className='text-center cursor-pointer' onClick={() => requestSort('_id')}>
                          Thread{' '}
                          <Icon size='lg' className={getClassNamesFor('_id')} icon='FilterList' />
                        </th>
                        <th className='text-center'>Thread Name</th>
                        <th className='text-center'>Visibility</th>
                        <th className='text-center'>Total Members</th>
                        <th className='text-center'>QR Code</th>
                        <th className='text-center'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataPagination(items, currentPage, perPage).map((i) => (
                        <tr key={i?._id || Math.random()}>
                          <td className='text-center'>
                            <div className='d-flex align-items-center justify-content-center'>
                              <div className='flex-shrink-0'>
                                <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>
                                  <div
                                    className={`bg-l${darkModeStatus ? 'o25' : '25'}-${safeGetColorNameWithIndex(i?._id)} text-${safeGetColorNameWithIndex(i?._id)} rounded-2 d-flex align-items-center justify-content-center`}
                                  >
                                    <span className='fw-bold'>{getFirstLetter(i?.threadName || '')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='text-center'>
                            <div className='fs-6 fw-bold'>{i?.threadName || 'N/A'}</div>
                          </td>
                          <td className='text-center'>
                            <div className='fs-6 fw-bold'>{i?.visibility || 'N/A'}</div>
                          </td>
                          <td className='text-center'>
                            <div className='fs-6 fw-bold'>{i?.members ? i.members.length : 'N/A'}</div>
                          </td>
                          <td className='text-center'>
                            {i?.qrCode ? (
                              <div
                                className="d-flex justify-content-center"
                              // onClick={() => setQrModal({
                              //   isOpen: true,
                              //   src: `${process.env.REACT_APP_API_URL}/${i.qrCode}`,
                              //   threadName: i.threadName
                              // })}
                               onClick={() => setQrModal({ isOpen: true, src: `${process.env.REACT_APP_API_URL}/${i.qrCode}`, name: i?.threadName })}
                              >
                                <div
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <img
                                    src={`${process.env.REACT_APP_API_URL}/${i.qrCode}`}
                                    alt="QR Code"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'contain',
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className='fs-6 text-muted'>No QR</div>
                            )}
                          </td>
                          <td className='text-center'>
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
                                    icon='Print'
                                    onClick={() => setQrModal({ isOpen: true, src: `${process.env.REACT_APP_API_URL}/${i.qrCode}`, name: i?.threadName })}
                                  >
                                    Print QR
                                  </Button>
                                </DropdownItem>
                                <DropdownItem>
                                  <Button
                                    icon='Edit'
                                    onClick={() => {
                                      setSelectedThread(i);
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </DropdownItem>
                                <DropdownItem>
                                  <Button
                                    icon='Delete'
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
                  label='threads'
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  perPage={perPage}
                  setPerPage={setPerPage}
                />
              </Card>

            )}
          </div>
        </div>
      </Page>

      {/* QR Code Modal */}
      {/* <Modal
        isOpen={qrModal.isOpen}
        setIsOpen={() => setQrModal({ isOpen: false, src: '', threadName: '' })}
        titleId='qr-modal'
        isCentered
        isScrollable
        size='md'
      >
        <ModalHeader setIsOpen={() => setQrModal({ isOpen: false, src: '', threadName: '' })}>
          QR Code - {qrModal.threadName}
        </ModalHeader>
        <ModalBody>
          <div className='text-center mb-3'>
            <img
              src={qrModal.src}
              alt="Full Size QR Code"
              style={{ width: '100%', height: 'auto', maxWidth: '300px' }}
            />
          </div>
          <div className='d-flex justify-content-center gap-3'>
           
            <Button
              className='w-full'
              color='info'
              icon='Print'
              onClick={() => handlePrintQR(qrModal.src, qrModal.threadName)}
            >
              Print
            </Button>
          </div>
        </ModalBody>
      </Modal> */}

      <QrTemplateModal
        isOpen={qrModal.isOpen}
        setIsOpen={() => setQrModal({ ...qrModal, isOpen: false, src: '', name: '' })}
        beadName={qrModal.name}
        qrUrl={qrModal.src}
      />

      <ThreadAddModal
        id="thread-modal"
        isOpen={isModalOpen}
        setIsOpen={() => {
          setIsModalOpen(false)
          setSelectedThread(undefined);
        }}
        editItem={selectedThread}
        onSuccess={handleSuccess}
      />
    </PageWrapper>
  );
};

export default ThreadManagement;