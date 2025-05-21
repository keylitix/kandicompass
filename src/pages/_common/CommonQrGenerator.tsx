import React, { FC, useState } from 'react';
import Card, {
    CardActions,
    CardBody,
    CardHeader,
    CardLabel,
    CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Input from '../../components/bootstrap/forms/Input';

// Custom QR Code Generator (Batch Version)
const generateQRCode = (text: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 150;
    canvas.width = size;
    canvas.height = size;

    if (ctx) {
        const cols = 21;
        const cellSize = size / cols;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < cols; j++) {
                const fill = (i + j) % 2 === 0;
                ctx.fillStyle = fill ? 'black' : 'white';
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
    return canvas.toDataURL();
};

const generateBatchQRs = (count: number) => {
    const qrCodes = [];
    for (let i = 0; i < count; i++) {
        const uniqueID = `bead_${Date.now()}_${i + 1}`;
        qrCodes.push({
            id: uniqueID,
            qrCode: generateQRCode(`QR code for ${uniqueID}`),
            metadata: { id: uniqueID, createdAt: new Date().toISOString() },
        });
    }
    return qrCodes;
};

// Main Component
interface ICommonUpcomingEventsProps {
    isFluid?: boolean;
}

const CommonQrGenerator: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {

    const [batchCount, setBatchCount] = useState<number>(10);
    const [qrCodes, setQrCodes] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleBatchGenerate = () => {
        const generatedCodes = generateBatchQRs(batchCount);
        setQrCodes(generatedCodes);
    };

    // Export QR codes as PNG (using the canvas to download as image)
    const exportToPNG = (qrCodeDataURL: string) => {
        const link = document.createElement('a');
        link.href = qrCodeDataURL;
        link.download = 'qr_code.png';
        link.click();
    };

    // Printable View
    const printQRCode = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        const content = document.createElement('div');
        content.classList.add('print-container');
        qrCodes.forEach(qr => {
            const qrContainer = document.createElement('div');
            qrContainer.classList.add('qr-item');
            qrContainer.innerHTML = `<img src="${qr.qrCode}" alt="QR Code" /><p>${qr.id}</p>`;
            content.appendChild(qrContainer);
        });
        printWindow?.document.write(content.outerHTML);
        printWindow?.document.close();
        printWindow?.print();
    };

    return (
        <>
            <Card stretch={isFluid}>
                <CardHeader borderSize={1}>
                    <CardLabel icon="Alarm" iconColor="info">
                        <CardTitle tag="div" className="h5">
                            Batch QR Code Generator
                        </CardTitle>
                    </CardLabel>
                    <CardActions>
                        <Button
                            color="info"
                            icon="CloudDownload"
                            isLight
                            tag="a"
                            to="/somefile.txt"
                            target="_blank"
                            download
                        >
                            Export
                        </Button>
                    </CardActions>
                </CardHeader>

                <CardBody className="table-responsive" isScrollable={isFluid}>
                    {/* Batch Generation Inputs */}
                    <div className="d-flex mb-3 align-items-center">
                        <Input
                            type="number"
                            placeholder="Enter number of QR codes"
                            value={batchCount}
                            onChange={(e:any) => setBatchCount(Number(e.target.value))}
                            className="form-control-lg py-2"
                            style={{ flex: 1, marginRight: '15px', borderRadius: '8px' }}
                        />
                        <Button
                            color="primary"
                            onClick={handleBatchGenerate}
                            className="px-4 py-2"
                            style={{ borderRadius: '8px' }}
                        >
                            Generate QR Codes
                        </Button>
                    </div>

                    {/* Display Generated QR Codes */}
                    <div className="mb-4">
                        {qrCodes.length > 0 && (
                            <div className="row">
                                {qrCodes.map((qr, index) => (
                                    <div key={index} className="col-md-4 mb-3 text-center">
                                        <img
                                            src={qr.qrCode}
                                            alt={`QR ${qr.id}`}
                                            className="rounded"
                                            onClick={() => exportToPNG(qr.qrCode)} // Export to PNG on click
                                        />
                                        <p>{qr.id}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Print QR Codes */}
                    {qrCodes.length > 0 && (
                        <Button
                            color="success"
                            onClick={printQRCode}
                            className="px-4 py-2"
                        >
                            Print QR Codes
                        </Button>
                    )}
                </CardBody>
            </Card>

            {/* Printable View Styling */}
            <style>{`
                @media print {
                    body {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 0;
                    }
                    .print-container {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-around;
                    }
                    .qr-item {
                        margin: 10px;
                        page-break-inside: avoid;
                    }
                }
            `}</style>
        </>
    );
};

export default CommonQrGenerator;
