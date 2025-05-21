import React from 'react'

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  className?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
  width = 400, 
  height = 300, 
  className = '' 
}) => {
  const style: React.CSSProperties = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9e9e9e',
    fontSize: '16px',
    fontWeight: 'bold'
  }

  return (
    <div style={style} className={className}>
      {width}×{height} Image
    </div>
  )
}

export default PlaceholderImage