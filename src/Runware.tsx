import { useState } from 'react';
import './styles.css';
import { IImage } from '@runware/sdk-js';

const apiURL = "https://image-generator-api-xosq.onrender.com";

export const RunwareExample = () => {
  const [images, setImages] = useState<IImage[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      await fetch(`${apiURL}/generate-image`, {
        method: 'POST',
        body: JSON.stringify({
          prompt: searchInput,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('data', data);
          const { images } = data;
          setImages((prev) => [...(images ?? []), ...prev]);
        });
    } catch (e) {
      console.log('error', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='App'>
      <h1>Image generator</h1>
      <div className='input-wrapper'>
        <textarea
          value={searchInput}
          rows={4}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder='Enter search here...'
        />
      </div>
      <button className='sdk-button' onClick={fetchImages} disabled={isLoading}>
        {isLoading ? <span>Loading...</span> : 'Get Images'}
      </button>
      <div className='image-container'>
        {images.map((img) => (
          <div key={img.imageUUID}>
            <img height={640} width={640} src={img.imageURL} alt={img.imageURL} />
          </div>
        ))}
      </div>
      <p>
        <span>
          {'Powered by'}{' '}
          <a href='https://runware.ai/' target='_blank' rel='noopener noreferrer'>
            Runware.ai
          </a>
        </span>
      </p>
    </div>
  );
};
