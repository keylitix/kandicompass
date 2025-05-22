import React, { FC, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Select from '../../../components/bootstrap/forms/Select';
import { useAddBeadMutation, useDeleteBeadMutation, useUpdateBeadMutation, useUploadBeadImageMutation, useUploadBeadImagesMutation } from '../../../redux/api/beadApi';
import { IBead } from '../../../types/bead';
import { useGetThreadsQuery } from '../../../redux/api/thredApi';


interface IBeadAddModalProps {
  id: string;
  isOpen: boolean;
  editItem?: IBead;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

const BeadAddModal: FC<IBeadAddModalProps> = ({ id, isOpen, setIsOpen, editItem, onSuccess }) => {
  const [addBead] = useAddBeadMutation();
  const [updateBead] = useUpdateBeadMutation();
  const [uploadBeadImages] = useUploadBeadImagesMutation();
  const [deleteBead] = useDeleteBeadMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch threads data
  const { data: threadsResponse, isLoading: isThreadsLoading } = useGetThreadsQuery({
    page_number: 1,
    page_size: 100 
  });

  const threads = threadsResponse?.data?.data || [];
  



  const shapeOptions = ['Round', 'Oval', 'Cube', 'Cylinder', 'Heart', 'Star', 'Bicone', 'Drop', 'Petal', 'Donut'];
  const finishOptions = ['Matte', 'Glossy', 'Metallic', 'Pearl', 'Transparent', 'Opaque', 'Iridescent'];
  const unitOptions = ['pieces', 'grams', 'ounces', 'pounds', 'kilograms'];

  useEffect(() => {
    if (!isOpen) {
      imagePreviews.forEach(URL.revokeObjectURL);
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [isOpen]);

  const formik = useFormik<Omit<IBead, '_id'>>({
    initialValues: {
      beadName: editItem?.beadName || '',
      beadType: editItem?.beadType || '',
      threadId: editItem?._id || '',
      material: editItem?.material || '',
      color: editItem?.color || '',
      size: editItem?.size || 0,
      shape: editItem?.shape || '',
      weight: editItem?.weight || 0,
      finish: editItem?.finish || '',
      quantity: editItem?.quantity || 0,
      pricePerUnit: editItem?.pricePerUnit || 0,
      supplier: editItem?.supplier || '',
      productCode: editItem?.productCode || '',
      description: editItem?.description || '',
      imageUrl: editItem?.imageUrl || '',
      unitOfMeasure: editItem?.unitOfMeasure || 'pieces',
      inventoryLocation: editItem?.inventoryLocation || '',
      minimumStockLevel: editItem?.minimumStockLevel || 0,
      maximumStockLevel: editItem?.maximumStockLevel || 0,
      reorderPoint: editItem?.reorderPoint || 0,
      leadTimeDays: editItem?.leadTimeDays || 0,
      isActive: editItem?.isActive ?? true,
      tags: editItem?.tags || [],
      notes: editItem?.notes || '',
      data: undefined,
      updatedAt: undefined,
      createdAt: undefined
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let beadId = editItem?._id;
        let uploadedImageUrls: string[] = [];

        if (beadId) {
          if (imageFiles.length > 0) {
            setIsUploading(true);
            const formData = new FormData();
            imageFiles.forEach(file => formData.append('files', file));

            const uploadResponse = await uploadBeadImages({ beadId, formData }).unwrap();

            if (!uploadResponse?.images || uploadResponse.images.length === 0) {
              throw new Error('Image upload failed.');
            }

            uploadedImageUrls = uploadResponse.images;
          }

          await updateBead({
            id: beadId,
            body: {
              ...values,
              imageUrl: uploadedImageUrls[0] || values.imageUrl,
            },
          }).unwrap();
        } else {
          const createResponse = await addBead(values).unwrap();
          beadId = createResponse.data._doc._id;
          if (!beadId) throw new Error('Bead creation failed.');

          if (imageFiles.length > 0) {
            setIsUploading(true);
            const formData = new FormData();
            imageFiles.forEach(file => formData.append('files', file));
            const uploadResponse = await uploadBeadImages({ beadId, formData }).unwrap();
            if (!uploadResponse?.images || uploadResponse.images.length === 0) {
              await deleteBead(beadId).unwrap();
              throw new Error('Image upload failed. Bead has been deleted.');
            }
            uploadedImageUrls = uploadResponse.images;
          }
        }

        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='CheckCircle' size='lg' className='me-1' />
            <span>{editItem ? 'Bead Updated' : 'Bead Added'}</span>
          </span>,
          `${values.beadName} has been ${editItem ? 'updated' : 'added'} successfully.`,
        );

        formik.resetForm();
        setIsOpen(false);
        onSuccess?.();
      } catch (error: any) {
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Error' size='lg' className='me-1' />
            <span>Error</span>
          </span>,
          `Failed to ${editItem ? 'update' : 'add'} bead. ${error?.message || 'Please try again.'}`,
        );
      } finally {
        setIsSubmitting(false);
        setIsUploading(false);
      }
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let files: File[] = [];

    if ('dataTransfer' in e) {
      e.preventDefault();
      files = Array.from(e.dataTransfer.files);
    } else if (e.target.files) {
      files = Array.from(e.target.files);
    }

    const validImages: File[] = [];
    const previews: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024 || !file.type.startsWith('image/')) {
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Error' size='lg' className='me-1' />
            <span>Invalid File</span>
          </span>,
          `${file.name} is too large or not an image.`,
        );
        continue;
      }

      validImages.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setImageFiles((prev) => [...prev, ...validImages]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImageAtIndex = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Modal
        isOpen={isOpen} setIsOpen={setIsOpen} size='lg' titleId={id} isStaticBackdrop
      >
        <ModalHeader setIsOpen={setIsOpen} className='p-4'>
          <ModalTitle id={id}>{editItem ? 'Edit Bead' : 'Add New Bead'}</ModalTitle>
        </ModalHeader>
        <ModalBody className='px-4'>
          <div className='row g-4'>
            <div className='col-md-12'>
              <h5 className='mb-3'>Basic Information</h5>
              <div className='row g-3'>
                <FormGroup id='beadName' label='Bead Name' className='col-md-6'>
                  <Input name='beadName' onChange={formik.handleChange} value={formik.values.beadName} required />
                </FormGroup>
                <FormGroup id='beadType' label='Bead Type' className='col-md-6'>
                  <Input name='beadType' onChange={formik.handleChange} value={formik.values.beadType} required />
                </FormGroup>

                <FormGroup id='threadId' label='ThreadID' className='col-md-6'>
                  <Select
                    name='threadId'
                    onChange={formik.handleChange}
                    value={formik.values.threadId}
                    ariaLabel='Select ThreadId'
                  >
                    <option value=''>Select a thread</option>
                    { threads.map((thread: any) => (
                      <option key={thread._id} value={thread._id}>
                        {thread.threadName}
                      </option>
                    ))}
                    {!isThreadsLoading && Array.isArray(threads) && threads.map((thread: any) => (
                      <option key={thread._id} value={thread._id}>
                        {thread.threadName}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </div>
            </div>

            <div className='col-md-12'>
              <h5 className='mb-3'>Bead Image</h5>
              <div
                className='upload-container d-flex justify-content-center align-items-center p-4'
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  minHeight: '200px',
                  backgroundColor: formik.values.imageUrl ? 'transparent' : '#f8f9fa',
                  position: 'relative',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {isDragging && (
                  <div
                    className="position-absolute w-100 h-100"
                    style={{
                      top: 0,
                      left: 0,
                      backgroundColor: 'rgba(173, 216, 230, 0.5)',
                      zIndex: 10,
                      borderRadius: '8px',
                    }}
                  ></div>
                )}
                {isUploading ? (
                  <div className="text-center">
                    <Icon icon="Loop" size="3x" className="spinning" />
                    <p>Uploading image...</p>
                  </div>
                ) : (
                  <div className='text-center'>
                    <Icon icon='CloudUpload' size='3x' />
                    <p>Drag and drop image here or click to select</p>
                    <input type='file' accept='image/*' multiple onChange={handleFileChange} className='d-none' id='imageUpload' />
                    <label htmlFor='imageUpload' className='btn btn-sm btn-outline-primary mt-2'>Select Image</label>

                    {imagePreviews.length > 0 ? (
                      <div className="row g-5 mt-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="col-auto">
                            <div className="position-relative" style={{ width: '100px', height: '120px' }}>
                              <img
                                src={preview}
                                alt={`Preview ${index}`}
                                className="img-fluid rounded"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute d-flex justify-content-center align-items-center"
                                style={{
                                  top: '-6px',
                                  right: '-6px',
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  padding: 0,
                                  fontSize: '16px',
                                  lineHeight: '1',
                                }}
                                onClick={() => removeImageAtIndex(index)}
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <div className='col-md-12'>
              <h5 className='mb-3'>Physical Properties</h5>
              <div className='row g-3'>
                <FormGroup id='material' label='Material' className='col-md-4'>
                  <Input
                    name='material'
                    onChange={formik.handleChange}
                    value={formik.values.material}
                    required
                  />
                </FormGroup>

                <FormGroup id='color' label='Color' className='col-md-4'>
                  <Input
                    name='color'
                    onChange={formik.handleChange}
                    value={formik.values.color}
                  />
                </FormGroup>

                <FormGroup id='size' label='Size (mm)' className='col-md-4'>
                  <Input
                    name='size'
                    type='number'
                    onChange={formik.handleChange}
                    value={formik.values.size}
                    min={0}
                    step={0.1}
                  />
                </FormGroup>

                <FormGroup id='shape' label='Shape' className='col-md-4'>
                  <Select
                    name='shape'
                    onChange={formik.handleChange}
                    value={formik.values.shape}
                    ariaLabel='Select shape'
                  >
                    <option value=''>Select shape</option>
                    {shapeOptions.map(shape => (
                      <option key={shape} value={shape}>{shape}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup id='weight' label='Weight (g)' className='col-md-4'>
                  <Input
                    name='weight'
                    type='number'
                    onChange={formik.handleChange}
                    value={formik.values.weight}
                    min={0}
                    step={0.01}
                  />
                </FormGroup>

                <FormGroup id='finish' label='Finish' className='col-md-4'>
                  <Select
                    name='finish'
                    onChange={formik.handleChange}
                    value={formik.values.finish}
                    ariaLabel='Select finish'
                  >
                    <option value=''>Select finish</option>
                    {finishOptions.map(finish => (
                      <option key={finish} value={finish}>{finish}</option>
                    ))}
                  </Select>
                </FormGroup>
              </div>
            </div>

            <div className='col-md-12'>
              <h5 className='mb-3'>Inventory Information</h5>
              <div className='row g-3'>
                <FormGroup id='quantity' label='Quantity' className='col-md-3'>
                  <Input
                    name='quantity'
                    type='number'
                    onChange={formik.handleChange}
                    value={formik.values.quantity}
                    min={0}
                  />
                </FormGroup>

                <FormGroup id='pricePerUnit' label='Price Per Unit' className='col-md-3'>
                  <Input
                    name='pricePerUnit'
                    type='number'
                    onChange={formik.handleChange}
                    value={formik.values.pricePerUnit}
                    min={0}
                    step={0.01}
                  />
                </FormGroup>

                <FormGroup id='unitOfMeasure' label='Unit of Measure' className='col-md-3'>
                  <Select
                    name='unitOfMeasure'
                    onChange={formik.handleChange}
                    value={formik.values.unitOfMeasure}
                    ariaLabel='Select unit'
                  >
                    {unitOptions.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup id='supplier' label='Supplier' className='col-md-3'>
                  <Input
                    name='supplier'
                    onChange={formik.handleChange}
                    value={formik.values.supplier}
                  />
                </FormGroup>

                <FormGroup id='productCode' label='Product Code' className='col-md-3'>
                  <Input
                    name='productCode'
                    onChange={formik.handleChange}
                    value={formik.values.productCode}
                  />
                </FormGroup>
              </div>
            </div>

            <div className='col-md-12'>
              {/* <h5 className='mb-3'>Additional Information</h5> */}
              <div className='row g-3'>
                {/* <FormGroup id='isActive' label='Status' className='col-md-3'>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      name="isActive"
                      checked={formik.values.isActive}
                      onChange={formik.handleChange}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      {formik.values.isActive ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </FormGroup> */}

                <FormGroup id='description' label='Description' className='col-md-12'>
                  <Textarea
                    name='description'
                    rows={3}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className='p-4'>
          <Button color='secondary' onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button color='primary' type='button' onClick={() => formik.handleSubmit()} isDisable={isSubmitting}>
            {isSubmitting ? 'Processing...' : editItem ? 'Update Bead' : 'Add Bead'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default BeadAddModal;