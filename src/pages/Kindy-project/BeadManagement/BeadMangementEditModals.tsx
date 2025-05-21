import React, { FC, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '../../../components/bootstrap/Modal';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import { useUpdateBeadMutation } from '../../../redux/api/beadApi';

interface IBeadEditModalProps {
  id: string;
  isOpen: boolean;
  editItem?: any;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

const BeadEditModal: FC<IBeadEditModalProps> = ({ id, isOpen, setIsOpen, editItem, onSuccess }) => {
  const [updateBead, { isLoading }] = useUpdateBeadMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [localImage, setLocalImage] = useState('');

  const formik = useFormik({
    initialValues: {
      beadName: editItem?.beadName || '',
      beadType: editItem?.beadType || '',
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
      image: editItem?.imageUrl || '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const beadData = {
          ...values,
          size: Number(values.size),
          weight: Number(values.weight),
          quantity: Number(values.quantity),
          pricePerUnit: Number(values.pricePerUnit),
          image: localImage || values.image,
        };

        const updatedBead = await updateBead({
          id: editItem._id,
          body: beadData
        }).unwrap();

        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='CheckCircle' size='lg' className='me-1' />
            <span>Bead Updated</span>
          </span>,
          `${values.beadName} has been updated successfully.`,
        );

        setLocalImage('');
        setIsOpen(false);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Error updating bead:', error);
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Error' size='lg' className='me-1' />
            <span>Error</span>
          </span>,
          'Failed to update bead. Please try again.',
        );
      }
    },
  });

  useEffect(() => {
    if (editItem) {
      formik.resetForm({
        values: {
          beadName: editItem?.beadName || '',
          beadType: editItem?.beadType || '',
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
          image: editItem?.imageUrl || '',
        }
      });
      setLocalImage('');
    }
  }, [editItem]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Error' size='lg' className='me-1' />
            <span>File Too Large</span>
          </span>,
          'Maximum file size is 5MB. Please choose a smaller image.',
        );
        setIsUploading(false);
        return;
      }

      try {
        const base64Image = await convertToBase64(file);
        setLocalImage(base64Image);
        
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='CheckCircle' size='lg' className='me-1' />
            <span>Image Ready</span>
          </span>,
          'Image will be saved with the bead.',
        );
      } catch (error) {
        console.error('Error converting image:', error);
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Error' size='lg' className='me-1' />
            <span>Upload Failed</span>
          </span>,
          'Failed to process image. Please try again.',
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = () => {
    setLocalImage('');
    formik.setFieldValue('image', '');
  };

  const displayImage = localImage || formik.values.image;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id} isStaticBackdrop>
      <ModalHeader setIsOpen={setIsOpen} className='p-4'>
        <ModalTitle id={id}>Edit Bead</ModalTitle>
      </ModalHeader>
      <ModalBody className='px-4'>
        <div className='row g-4'>
          <FormGroup id='beadName' label='Bead Name' className='col-md-12'>
            <Input 
              name='beadName'
              onChange={formik.handleChange}
              value={formik.values.beadName}
              required
            />
          </FormGroup>

          <FormGroup label='Bead Image' className='col-12'>
            <div className='upload-container d-flex justify-content-center align-items-center p-4' style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              minHeight: '200px',
              backgroundColor: displayImage ? 'transparent' : '#f8f9fa',
              position: 'relative'
            }}>
              {isUploading ? (
                <div className="text-center">
                  <Icon icon="Loop" size="3x" className="spinning" />
                  <p>Processing image...</p>
                </div>
              ) : displayImage ? (
                <div className="text-center">
                  <img 
                    src={displayImage} 
                    alt="Bead preview" 
                    style={{ 
                      maxHeight: '150px', 
                      maxWidth: '100%', 
                      marginBottom: '1rem',
                      borderRadius: '4px'
                    }}
                  />
                  <div className="d-flex gap-2 justify-content-center">
                    <Button 
                      color="info"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      icon="Image"
                      isDisable={isLoading}
                    >
                      Change Image
                    </Button>
                    <Button 
                      color="danger"
                      onClick={removeImage}
                      icon="Delete"
                      isDisable={isLoading}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='text-center'>
                  <div className='cloud-icon mb-3'>
                    <Icon icon='CloudUpload' size='3x' />
                  </div>
                  <p><span style={{ color: '#0d6efd' }}>CLICK TO BROWSE</span> OR DRAG IT HERE</p>
                  <p className='text-muted'>JPG, PNG (Max 5MB)</p>
                  <Button 
                    color='info' 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    icon="Upload"
                    isDisable={isLoading}
                  >
                    Select Image
                  </Button>
                </div>
              )}
              <input 
                type='file' 
                id='file-upload' 
                className='d-none' 
                onChange={handleFileUpload}
                accept='image/*'
                disabled={isUploading || isLoading}
              />
            </div>
          </FormGroup>

          <FormGroup id='beadType' label='Bead Type' className='col-md-4'>
            <Input 
              name='beadType'
              onChange={formik.handleChange}
              value={formik.values.beadType}
              required
            />
          </FormGroup>
          
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
              required
            />
          </FormGroup>
          
          <FormGroup id='size' label='Size (mm)' className='col-md-4'>
            <Input 
              name='size'
              type='number'
              onChange={formik.handleChange}
              value={formik.values.size}
              required
            />
          </FormGroup>
          
          <FormGroup id='shape' label='Shape' className='col-md-4'>
            <Input 
              name='shape'
              onChange={formik.handleChange}
              value={formik.values.shape}
              required
            />
          </FormGroup>
          
          <FormGroup id='weight' label='Weight (g)' className='col-md-4'>
            <Input 
              name='weight'
              type='number'
              onChange={formik.handleChange}
              value={formik.values.weight}
              required
            />
          </FormGroup>
          
          <FormGroup id='finish' label='Finish' className='col-md-4'>
            <Input 
              name='finish'
              onChange={formik.handleChange}
              value={formik.values.finish}
            />
          </FormGroup>
          
          <FormGroup id='quantity' label='Quantity' className='col-md-4'>
            <Input 
              name='quantity'
              type='number'
              onChange={formik.handleChange}
              value={formik.values.quantity}
              required
            />
          </FormGroup>
          
          <FormGroup id='pricePerUnit' label='Price Per Unit ($)' className='col-md-4'>
            <Input 
              name='pricePerUnit'
              type='number'
              onChange={formik.handleChange}
              value={formik.values.pricePerUnit}
              required
            />
          </FormGroup>
          
          <FormGroup id='supplier' label='Supplier' className='col-md-4'>
            <Input 
              name='supplier'
              onChange={formik.handleChange}
              value={formik.values.supplier}
            />
          </FormGroup>
          
          <FormGroup id='productCode' label='Product Code' className='col-md-4'>
            <Input 
              name='productCode'
              onChange={formik.handleChange}
              value={formik.values.productCode}
            />
          </FormGroup>
          
          <FormGroup id='description' label='Description' className='col-md-12'>
            <Textarea 
              name='description'
              rows={3}
              onChange={formik.handleChange}
              value={formik.values.description}
            />
          </FormGroup>
        </div>
      </ModalBody>
      <ModalFooter className='px-4 pb-4'>
        <Button 
          color='secondary' 
          onClick={() => setIsOpen(false)}
          className='me-2'
          isDisable={isLoading}
        >
          Cancel
        </Button>
        <Button 
          color='primary' 
          onClick={() => formik.handleSubmit()}
          isDisable={isLoading || isUploading}
         
        >
          {isLoading ? 'Updating...' : 'Update Bead'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BeadEditModal;