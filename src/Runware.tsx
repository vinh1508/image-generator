import { useState, useCallback, useRef, useEffect } from 'react';
import './styles.css';
import { IImage } from '@runware/sdk-js';

const API_URL = 'https://image-generator-api-xosq.onrender.com';

export const RunwareComponent = () => {
  const [images, setImages] = useState<IImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchImages = useCallback(async () => {
    if (!searchInput.trim()) return;

    setIsLoading(true);
    setLoadedImages(0);
    try {
      const response = await fetch(`${API_URL}/generate-image`, {
        method: 'POST',
        body: JSON.stringify({ prompt: searchInput }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setImages((prev) => [...(data.images ?? []), ...prev]);
      
    } catch (error) {
      console.error('Error fetching images:', error);
      setIsLoading(false);
    } finally {
      textareaRef.current?.focus()
    }
  }, [searchInput]);

  useEffect(() => {
    if (loadedImages === images.length && images.length > 0) {
      setIsLoading(false);
    }
  }, [loadedImages, images]);

  const handleImageLoad = () => {
    setIsLoading(false);
    
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      fetchImages();
    }
  };

  return (
    <div className='App'>
      <h1>Image generator</h1>
      <div className='input-wrapper'>
        <textarea
          ref={textareaRef}
          value={searchInput}
          rows={3}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Prompt here...'
          disabled={isLoading}
        />
      </div>
      <button className='sdk-button' onClick={fetchImages} disabled={isLoading || !searchInput.trim()}>
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
      <div className='image-container'>
        {images.length > 0 && (
          <div className='large-image'>
            <img 
              src={images[0].imageURL} 
              alt={images[0].imageURL} 
              width={512} 
              height={512} 
              loading='lazy' 
              onLoad={handleImageLoad}
            />
          </div>
        )}
        <div className='small-images-grid'>
          {images.slice(1).map((img) => (
            <div key={img.imageUUID} className='small-image'>
              <img 
                src={img.imageURL} 
                alt={img.imageURL} 
                width={100} 
                height={100} 
              />
            </div>
          ))}
        </div>
      </div>
      <p>
        <span>
          Powered by{' '}
          <a href='https://runware.ai/' target='_blank' rel='noopener noreferrer'>
            Runware.ai
          </a>
        </span>
      </p>
    </div>
  );
};