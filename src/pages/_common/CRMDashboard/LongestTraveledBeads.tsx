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

interface ITraveledBeadItemProps {
  beadName: string;
  origin: string;
  distance: number; // in kilometers
  destinations: string[];
  avatar?: string;
}

const TraveledBeadItem: FC<ITraveledBeadItemProps> = ({ 
  beadName, 
  origin, 
  distance, 
  destinations, 
  avatar 
}) => {
  const { darkModeStatus } = useDarkMode();

  return (
    <div className='col-12'>
      <div className='row'>
        <div className='col d-flex align-items-center'>
          <div className='flex-shrink-0'>
            <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>
              {avatar ? (
                <img
                  src={avatar}
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
              <small>From: {origin}</small>
            </div>
            <div className='text-muted'>
              <small>To: {destinations.join(' → ')}</small>
            </div>
          </div>
        </div>
        <div className='col-auto text-end'>
          <div>
            <strong>{distance.toLocaleString()} km</strong>
          </div>
          <div className='text-muted'>
            <small>{destinations.length} stops</small>
          </div>
        </div>
      </div>
    </div>
  );
};

const LongestTraveledBeads = () => {
  const traveledBeads = [
    {
      id: '1',
      beadName: 'Blue Sapphire',
      origin: 'Colombia',
      distance: 12500,
      destinations: ['India', 'Thailand', 'Japan', 'USA'],
      avatar: '/path/to/sapphire-image.jpg'
    },
    {
      id: '2',
      beadName: 'Red Coral',
      origin: 'Mediterranean',
      distance: 9800,
      destinations: ['Italy', 'Egypt', 'China'],
      avatar: '/path/to/coral-image.jpg'
    },
    {
      id: '3',
      beadName: 'Tiger Eye',
      origin: 'South Africa',
      distance: 8700,
      destinations: ['UK', 'Canada'],
      avatar: '/path/to/tigereye-image.jpg'
    },
    {
      id: '4',
      beadName: 'Moonstone',
      origin: 'Sri Lanka',
      distance: 7600,
      destinations: ['France', 'Germany', 'Russia'],
      avatar: '/path/to/moonstone-image.jpg'
    },
    {
      id: '5',
      beadName: 'Lapis Lazuli',
      origin: 'Afghanistan',
      distance: 6800,
      destinations: ['Turkey', 'Greece'],
      avatar: '/path/to/lapis-image.jpg'
    },
  ];

  return (
    <Card 
    stretch 
    style={{ 
      minHeight: '500px',
      height: '100%'
    }}
    >
      <CardHeader>
        <CardLabel>
          <CardTitle tag='div' className='h5'>
            Longest-Traveled Beads
          </CardTitle>
        </CardLabel>
       
      </CardHeader>
      <CardBody isScrollable>
        <div className='row g-3'>
          {traveledBeads.map((bead) => (
            <TraveledBeadItem
              key={bead.id}
              beadName={bead.beadName}
              origin={bead.origin}
              distance={bead.distance}
              destinations={bead.destinations}
             
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default LongestTraveledBeads;