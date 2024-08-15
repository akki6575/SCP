// frontend/src/components/DetectionPage/DetectionPage.js
import React, { useState } from 'react';
import Loader from '../Loader/Loader';
import './DetectionPage.css';

const DetectionPage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState('');

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);

    // Prepare FormData
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/detect-damage', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResultImage(data.imagePath);
    } catch (error) {
      setResultImage('Error processing image');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="detection-page">
      <h2>Package Damage Detection</h2>
      <form onSubmit={handleImageUpload} encType="multipart/form-data">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Upload Image</button>
      </form>
      {resultImage && <img src={`http://localhost:5000/${resultImage}`} alt="Detection Result" />}
    </div>
  );
};

export default DetectionPage;
