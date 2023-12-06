import React, { useEffect, useState } from "react";

import * as animationData from "constants/lottie/cloverfield-loading.json";

export default function LottieCloverfield({ height = 175, width = 135 }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      {isLoaded && (
        <Lottie options={defaultOptions} height={height} width={width} />
      )}
    </div>
  );
}
