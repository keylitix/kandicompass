import React, { FC } from 'react';
import classNames from 'classnames';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import { getFirstLetter, priceFormat } from '../../../helpers/helpers';
import useDarkMode from '../../../hooks/useDarkMode';
import { demoPagesMenu } from '../../../menu';
import { useGetBeadsQuery } from '../../../redux/api/beadApi';

interface IBeadItemProps {
 
  beadName: string;
  beadType: string;
  pricePerUnit: number;
  quantity: number;
  avatar?: string;
}

const BeadItem: FC<IBeadItemProps> = ({ beadName, beadType, pricePerUnit, quantity, avatar }) => {
  const { darkModeStatus } = useDarkMode();

  return (
    <div className='col-12'>
      <div className='row'>
        <div className='col d-flex align-items-center'>
          <div className='flex-shrink-0'>
            <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>
              {avatar ? (
                <img
                  src={`https://kandi-backend.cradle.services/${avatar}`}
                  alt={beadName}
                  className='rounded-2 object-cover w-full h-full'
                />
              ) : (
                <div
                  className={classNames(
                    'rounded-2',
                    'd-flex align-items-center justify-content-center',
                    {
                      'bg-l10-dark': !darkModeStatus,
                      'bg-l90-dark': darkModeStatus,
                    },
                  )}>
                  <span className='fw-bold'>{getFirstLetter(beadName)}</span>
                </div>
              )}
            </div>
          </div>
          <div className='flex-grow-1'>
            <div className='fs-6'>{beadName}</div>
            <div className='text-muted'>
              <small>{beadType}</small>
            </div>
          </div>
        </div>
        <div className='col-auto text-end'>
          <div>
            <strong>{priceFormat(pricePerUnit)}</strong>
          </div>
          <div className='text-muted'>
            <small>Qty: {quantity}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommonTopSales = () => {
  // Fetch bead data using the API
  const { data: beadsResponse, isLoading, isError } = useGetBeadsQuery({
    page_number: 1,
    page_size: 10
  });

  // Safely get the beads array or default to empty array
  const beads = beadsResponse?.data || [];

  if (isLoading) return <div>Loading beads...</div>;
  if (isError) return <div>Error loading beads</div>;

  return (
    <Card stretch>
      <CardHeader>
        <CardLabel>
          <CardTitle tag='div' className='h5'>
            Top Beads
          </CardTitle>
        </CardLabel>
        
      </CardHeader>
      <CardBody isScrollable>
        <div className='row g-3'>
          {beads.map((bead : any) => (
            <BeadItem
              key={bead._id}
             
              beadName={bead.beadName}
              beadType={bead.beadType}
              pricePerUnit={bead.pricePerUnit}
              quantity={bead.quantity}
             
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default CommonTopSales;