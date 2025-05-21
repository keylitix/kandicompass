import React, { FC } from 'react';
import Card, {
  CardHeader,
  CardBody,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Badge from '../../../components/bootstrap/Badge';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';

interface IPopularLocationItemProps {
  location: string;
  country: string;
  beadCount: number;
  percentage: number;
  flagEmoji?: string;
}

const PopularLocationItem: FC<IPopularLocationItemProps> = ({
  location,
  country,
  beadCount,
  percentage,
  flagEmoji
}) => {
  return (
    <div className="col-12 mb-3">
      <div className="d-flex align-items-center">
        <div className="flex-shrink-0 me-3">
          <Badge color="info" className="fs-5 p-3">
            {flagEmoji || '🌎'}
          </Badge>
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between">
            <div>
              <span className="fw-bold fs-6">{location}</span>
              <span className="text-muted ms-2">{country}</span>
            </div>
            <div className="fw-bold">{beadCount.toLocaleString()}</div>
          </div>
          <Progress 
            height={10}
            value={percentage}
            color={percentage > 75 ? 'success' : percentage > 50 ? 'info' : 'warning'}
            className="mt-2"
          />
          <div className="d-flex justify-content-between small text-muted mt-1">
            <span>Market share</span>
            <span>{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MostPopularLocations = () => {
  // Custom static data with percentage values
  const popularLocations = [
    {
      id: '1',
      location: 'Jaipur',
      country: 'India',
      beadCount: 12500,
      percentage: 85,
      flagEmoji: '🇮🇳',
      description: 'Gemstone capital'
    },
    {
      id: '2',
      location: 'Bangkok',
      country: 'Thailand',
      beadCount: 9800,
      percentage: 72,
      flagEmoji: '🇹🇭',
      description: 'Synthetic bead hub'
    },
    {
      id: '3',
      location: 'Nairobi',
      country: 'Kenya',
      beadCount: 8700,
      percentage: 65,
      flagEmoji: '🇰🇪',
      description: 'African trade center'
    },
    {
      id: '4',
      location: 'Istanbul',
      country: 'Turkey',
      beadCount: 7600,
      percentage: 58,
      flagEmoji: '🇹🇷',
      description: 'Glass bead specialist'
    },
    {
      id: '5',
      location: 'Lima',
      country: 'Peru',
      beadCount: 6800,
      percentage: 45,
      flagEmoji: '🇵🇪',
      description: 'Traditional craftsmanship'
    },
  ];

  return (
    <Card 
      stretch
      className="shadow-sm"
      style={{
        minHeight: '500px',
        border: 'none',
        borderRadius: '12px'
      }}
    >
      <CardHeader 
        className="bg-transparent"
        style={{
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          padding: '1.25rem 1.5rem'
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle tag="h5" className="m-0 fw-bold">
            <Icon icon="Public" className="me-2" />
            Bead Origins
          </CardTitle>
          <Badge color="primary" className="px-3 py-2">
            Global
          </Badge>
        </div>
      </CardHeader>
      <CardBody 
        style={{
          padding: '1.5rem',
          background: 'rgba(248, 249, 250, 0.5)'
        }}
      >
        <div className="row">
          {popularLocations.map((location) => (
            <PopularLocationItem
              key={location.id}
              location={location.location}
              country={location.country}
              beadCount={location.beadCount}
              percentage={location.percentage}
              flagEmoji={location.flagEmoji}
            />
          ))}
        </div>
      </CardBody>
      <div 
        className="card-footer bg-transparent text-end"
        style={{
          borderTop: '1px solid rgba(0,0,0,0.1)',
          padding: '1rem 1.5rem'
        }}
      >
        <small className="text-muted">
          Updated: {new Date().toLocaleDateString()}
        </small>
      </div>
    </Card>
  );
};

export default MostPopularLocations;