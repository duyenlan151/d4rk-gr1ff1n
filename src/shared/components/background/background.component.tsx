import "./background.component.scss"

import { useState } from "react";

interface IBackground {
  background: string;
  backgroundSmall: string;
}

function Background({ background, backgroundSmall }: IBackground) {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  function onBackgroundLoaded(): void {
    setBackgroundLoaded(true);
  }

  return (
    <div id="background" className="absolute w-full h-full top-0 left-0 z-0 pointer-events-none">
      <div id="image-container" className="w-full h-full relative bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${backgroundSmall})` }}>
        <img src={background} alt="background-image" className="w-full h-full transition-opacity duration-300 ease-in" style={{ opacity: backgroundLoaded ? 1 : 0 }} onLoad={onBackgroundLoaded} />
      </div>
    </div>
  );
}

export default Background;
