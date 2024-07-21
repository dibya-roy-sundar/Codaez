import React from 'react';
import './ImageCarousel.scss';
import { motion } from 'framer-motion';

const ImageCard = ({ image, index }) => {
    return (
        <motion.div className='image-card-highlights'
            initial={
                index === 0 ? { x: -20, y: 0, opacity: 0 } :
                    index === 1 ? { x: 0, y: -20, opacity: 0 } :
                        index === 2 ? { x: 0, y: 20, opacity: 0 } :
                            index === 3 ? { x: 20, y: 0, opacity: 0 } : null
            }
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <h3 className='card-heading'>{image.title}</h3>
            <img src={image.src} alt={image.title} className='card-image' />
        </motion.div>
    );
};

export default ImageCard;
