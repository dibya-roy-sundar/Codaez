import React from 'react';
import './ImageCarousel.scss';

const ImageCard = ({ image }) => {
    return (
        <div className='image-card-highlights'>
            <h3 className='card-heading'>{image.title}</h3>
            <img src={image.src} alt={image.title} className='card-image' />
        </div>
    );
};

export default ImageCard;
