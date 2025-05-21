export interface IBead {
    updatedAt: any;
    createdAt: any;
    data: any;
    _id?: string;
    beadName: string;
    beadType: string;
    threadId:string;
    material: string;
    color: string;
    size: number;
    shape: string;
    weight: number;
    finish: string;
    quantity: number;
    pricePerUnit: number;
    supplier: string;
    productCode: string;
    description: string;
    imageUrl: string;
    unitOfMeasure?: string;
    inventoryLocation?: string;
    minimumStockLevel?: number;
    maximumStockLevel?: number;
    reorderPoint?: number;
    leadTimeDays?: number;
    isActive?: boolean;
    tags?: string[];
    notes?: string;
}

export interface IUploadImageResponse {
    success: boolean;
    imageUrl: string;
    message?: string;
}