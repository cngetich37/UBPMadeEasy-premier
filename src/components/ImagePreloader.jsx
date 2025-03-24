import React, { useEffect, useState } from "react";

const ImagePreloader = ({ src }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoaded(true);
    };
    return () => {
      img.onload = null;
    };
  }, [src]);

  return loaded ? null : <div>Welcome to UBPJiji...</div>; // You can customize the loading indicator
};

export default ImagePreloader;
