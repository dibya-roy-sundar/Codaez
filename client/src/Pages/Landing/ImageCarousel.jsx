import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ImageCarousel.scss';

const ImageSlider = ({ images }) => {
    const sliderRef = useRef(null);
    const intervalRef = useRef(null);

    // Using useLayoutEffect to ensure elements are rendered before animations
    useEffect(() => {
        initializeCards();
        startAutoSlide(); // Start auto sliding when component mounts

        return () => {
            clearInterval(intervalRef.current); // Cleanup interval on unmount
        };
    }, []);


    const initializeCards = () => {
        const cards = sliderRef.current.querySelectorAll('.card');
        if (cards.length > 0) {
            gsap.to(cards, {
                y: (i) => -15 + 15 * i + "%",
                z: (i) => 15 * i,
                duration: 1,
                ease: "cubic",
                stagger: -0.1
            });
        }
    };

    const handleSlide = () => {
        const cards = Array.from(sliderRef.current.querySelectorAll('.card'));
        if (cards.length === 0) return; // Check if cards exist

        const lastCard = cards.pop();
        const nextCard = cards[cards.length - 1];

        gsap.to(lastCard.querySelectorAll("h1"), {
            y: 200,
            duration: 0.75,
            ease: "cubic"
        });

        gsap.to(lastCard, {
            y: "+=150%",
            duration: 0.75,
            ease: "cubic",
            onComplete: () => {
                sliderRef.current.prepend(lastCard);
                initializeCards(); // Re-initialize the cards
                gsap.set(lastCard.querySelectorAll("h1"), { y: -200 });
            }
        });

        gsap.to(nextCard.querySelectorAll("h1"), {
            y: 0,
            duration: 1,
            ease: "cubic",
            stagger: 0.05
        });
    };

    const startAutoSlide = () => {
        intervalRef.current = setInterval(handleSlide, 3000);
    };

    const handleMouseEnter = () => {
        clearInterval(intervalRef.current); // Stop auto sliding
    };

    const handleMouseLeave = () => {
        startAutoSlide(); // Restart auto sliding
    };

    return (
        <div
            className="image-box"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="slider" ref={sliderRef}>
                {images && images.map((image, index) => (
                    <div className="card" key={index}>
                        <img src={image.src} alt={image.alt} />
                        <div className="copy">
                            <h1>{image.title}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
