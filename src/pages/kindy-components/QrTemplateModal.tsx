// import React, { FC, useRef, useState } from 'react';
// import { useReactToPrint } from 'react-to-print';
// import jsPDF from 'jspdf';
// import html2pdf from 'html2pdf.js';
// import html2canvas from 'html2canvas';
// import Modal, {
//     ModalBody,
//     ModalFooter,
//     ModalHeader,
//     ModalTitle,
// } from '../../components/bootstrap/Modal';
// import FormGroup from '../../components/bootstrap/forms/FormGroup';
// import Input from '../../components/bootstrap/forms/Input';
// import Select from '../../components/bootstrap/forms/Select';
// import Button from '../../components/bootstrap/Button';

// interface QrTemplateModalProps {
//     isOpen: boolean;
//     setIsOpen: (open: boolean) => void;
//     beadName: string;
//     qrUrl: string;
//     qrImageUrl?: string;
// }
// const getPageSizeInMM = (size: string): [number, number] => {
//     switch (size) {
//         case 'A1': return [594, 841];
//         case 'A2': return [420, 594];
//         case 'A3': return [297, 420];
//         case 'A4': return [210, 297];
//         case 'Letter': return [215.9, 279.4];
//         default: return [210, 297];
//     }
// };

// const QrTemplateModal: FC<QrTemplateModalProps> = ({
//     isOpen,
//     setIsOpen,
//     beadName,
//     qrUrl,
//     qrImageUrl,
// }) => {
//     const [quantity, setQuantity] = useState(1);
//     const [sheetSize, setSheetSize] = useState<'A1' | 'A2' | 'A3' | 'A4' | 'Letter'>('A4');
//     const [pageWidth, pageHeight] = getPageSizeInMM(sheetSize);


//     const printRef = useRef<HTMLDivElement>(null);

//     const handlePrint = useReactToPrint({
//         contentRef: printRef,
//         documentTitle: '',
//         pageStyle: `
//     @page {
//       size: ${sheetSize};
//       margin: 0;
//     }
//     html, body {
//       margin: 0 !important;
//       padding: 0 !important;
//       height: 100%;
//       width: 100%;
//       -webkit-print-color-adjust: exact !important;
//       print-color-adjust: exact !important;
//       background: white;
//     }
//     div {
//       break-after: page;
//     }
//   `,
//     });


//     const handleDownloadPdf = () => {
//         if (!printRef.current) return;
//         const opt = {
//             margin: 0,
//             filename: `${beadName}_QR_Codes.pdf`,
//             image: { type: 'jpeg', quality: 0.98 },
//             html2canvas: { scale: 2, useCORS: true },
//             jsPDF: { unit: 'mm', format: [pageWidth, pageHeight], orientation: 'portrait' },
//         };

//         html2pdf().set(opt).from(printRef.current).save();
//     };


//     if (!isOpen) return null;

//     return (
//         <>
//             <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="md" titleId="qr-template-modal">
//                 <ModalHeader setIsOpen={setIsOpen}>
//                     <ModalTitle id="qr-template-modal">Print QR Codes</ModalTitle>
//                 </ModalHeader>

//                 <ModalBody>
//                     <div className="row g-3">
//                         <FormGroup label="Sheet Size" className="col-md-6">
//                             <Select
//                                 value={sheetSize}
//                                 onChange={(e: any) => setSheetSize(e.target.value as any)}
//                                 ariaLabel="Sheet Size"
//                             >
//                                 <option value="A1">A1</option>
//                                 <option value="A2">A2</option>
//                                 <option value="A3">A3</option>
//                                 <option value="A4">A4</option>
//                                 <option value="Letter">Letter</option>
//                             </Select>

//                         </FormGroup>

//                         <FormGroup label="Quantity" className="col-md-6">
//                             <Input
//                                 type="number"
//                                 min={1}
//                                 value={quantity}
//                                 onChange={(e: any) => setQuantity(Number(e.target.value))}
//                             />
//                         </FormGroup>
//                     </div>

//                     {/* Preview a single QR */}
//                     <div className="d-flex justify-content-center mt-4">
//                         <div className="text-center">
//                             <img
//                                 src={qrImageUrl || qrUrl}
//                                 alt={`QR Code for ${beadName}`}
//                                 style={{ width: 200, height: 200 }}
//                             />
//                             <div className="mt-2 h4">{beadName}</div>
//                         </div>
//                     </div>


//                 </ModalBody>

//                 <ModalFooter>
//                     <Button icon='Print' color="info" isLight onClick={handlePrint}>
//                         Print
//                     </Button>
//                     <Button icon='PictureAsPdf' color="danger" isLight onClick={handleDownloadPdf}>
//                         PDF
//                     </Button>
//                 </ModalFooter>
//             </Modal>

//             <div style={{ display: 'none' }}>
//                 <div ref={printRef}>
//                     {[...Array(quantity)].map((_, index) => (
//                         <div
//                             key={index}
//                             className='qr-pdf-page'
//                             style={{
//                                 height: `${pageHeight}mm`,
//                                 width: `${pageWidth}mm`,
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                             }}
//                         >
//                             <img
//                                 src={qrImageUrl || qrUrl}
//                                 alt={`QR Code Page ${index + 1}`}
//                                 style={{ width: '80%', height: '80%', objectFit: 'contain', marginTop: -200 }}
//                             />

//                             <div
//                                 style={{
//                                     // marginTop: '-100px',
//                                     fontSize: '24px',
//                                     fontWeight: 'bold',
//                                 }}
//                             >
//                                 {beadName}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default QrTemplateModal;




import React, { FC, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '../../components/bootstrap/Modal';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Select from '../../components/bootstrap/forms/Select';
import Button from '../../components/bootstrap/Button';

interface QrTemplateModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  beadName: string;
  qrUrl: string;
  qrImageUrl?: string;
}

const getPageSizeInMM = (size: string): [number, number] => {
  switch (size) {
    case 'A1': return [594, 841];
    case 'A2': return [420, 594];
    case 'A3': return [297, 420];
    case 'A4': return [210, 297];
    case 'Letter': return [215.9, 279.4];
    default: return [210, 297];
  }
};

const QrTemplateModal: FC<QrTemplateModalProps> = ({
  isOpen,
  setIsOpen,
  beadName,
  qrUrl,
  qrImageUrl,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [sheetSize, setSheetSize] = useState<'A1' | 'A2' | 'A3' | 'A4' | 'Letter'>('A4');
  const [pageWidth, pageHeight] = getPageSizeInMM(sheetSize);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: '',
    pageStyle: `
      @page {
        size: ${sheetSize};
        margin: 0;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: 100%;
        width: 100%;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        background: white;
      }
      div {
        break-after: page;
      }
    `,
  });

  const handleDownloadImage = async (name: string) => {
    try {
      const imageUrl = qrImageUrl || qrUrl;
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="md" titleId="qr-template-modal">
        <ModalHeader setIsOpen={setIsOpen}>
          <ModalTitle id="qr-template-modal">Print QR Codes</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="row g-3">
            <FormGroup label="Sheet Size" className="col-md-6">
              <Select
                value={sheetSize}
                onChange={(e: any) => setSheetSize(e.target.value as any)}
                ariaLabel="Sheet Size"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="A3">A3</option>
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
              </Select>
            </FormGroup>

            <FormGroup label="Quantity" className="col-md-6">
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e: any) => setQuantity(Number(e.target.value))}
              />
            </FormGroup>
          </div>

          {/* Preview a single QR */}
          <div className="d-flex justify-content-center mt-4">
            <div className="text-center">
              <img
                src={qrImageUrl || qrUrl}
                alt={`QR Code for ${beadName}`}
                style={{ width: 200, height: 200 }}
              />
              <div className="mt-2 h4">{beadName}</div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button icon="Print" color="info" isLight onClick={handlePrint}>
            Print
          </Button>
          <Button
            icon="PictureAsPdf"
            color="danger"
            isLight
            onClick={() => handleDownloadImage(beadName)}
          >
            Download
          </Button>
        </ModalFooter>
      </Modal>

      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          {[...Array(quantity)].map((_, index) => (
            <div
              key={index}
              className="qr-pdf-page"
              style={{
                height: `${pageHeight}mm`,
                width: `${pageWidth}mm`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={qrImageUrl || qrUrl}
                alt={`QR Code Page ${index + 1}`}
                style={{
                  width: '80%',
                  height: '80%',
                  objectFit: 'contain',
                  marginTop: -200,
                }}
              />
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{beadName}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QrTemplateModal;
