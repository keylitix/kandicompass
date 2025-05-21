import React from 'react';
import Spinner from '../../../components/bootstrap/Spinner';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';


interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  currentImage?: string;
  onRemoveImage: () => void;
  isUploading: boolean;
  isDisabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelect,
  currentImage,
  onRemoveImage,
  isUploading,
  isDisabled,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className='upload-container d-flex justify-content-center align-items-center p-4' 
      style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        minHeight: '200px',
        backgroundColor: currentImage ? 'transparent' : '#f8f9fa',
        position: 'relative'
      }}>
      <input 
        type='file' 
        id='file-upload' 
        className='d-none' 
        onChange={handleFileChange}
        accept='image/*'
        disabled={isUploading || isDisabled}
      />
      
      {isUploading ? (
        <div className="text-center">
          <Spinner size={48} color="primary" />
          <p className="mt-2">Uploading image...</p>
        </div>
      ) : currentImage ? (
        <div className="text-center">
          <img 
            src={currentImage} 
            alt="Preview" 
            className="img-fluid rounded"
            style={{ 
              maxHeight: '150px',
              marginBottom: '1rem',
            }}
          />
          <div className="d-flex gap-2 justify-content-center">
            <Button
              color="info"
              onClick={() => document.getElementById('file-upload')?.click()}
              icon="Image"
              isDisable={isDisabled}
            >
              Change
            </Button>
            <Button 
              color="danger"
              onClick={onRemoveImage}
              icon="Delete"
              isDisable={isDisabled}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className='text-center'>
          <div className='mb-3'>
            <Icon icon='CloudUpload' size='3x' color='primary' />
          </div>
          <p className='mb-1'>
            <span className='text-primary fw-bold'>CLICK TO BROWSE</span> OR DRAG IT HERE
          </p>
          <p className='text-muted small'>JPG, PNG (Max 5MB)</p>
          <Button 
            color='primary' 
            onClick={() => document.getElementById('file-upload')?.click()}
            icon="Upload"
            isDisable={isDisabled}
            isLight
          >
            Select Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;