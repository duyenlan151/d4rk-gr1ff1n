import { useSignal } from "@preact/signals-react";
import "./background.component.scss";

interface IBackground {
  backdrop?: boolean;
  background: string;
  backgroundSmall: string;
}

function Background({ background, backgroundSmall, backdrop }: IBackground) {
  const isBackgroundLoaded = useSignal(false);

  return (
    <div
      id="background"
      className={`background-wrapper absolute w-screen h-screen top-0 left-0 z-0 pointer-events-none ${backdrop ? "backdrop" : "clean"}`}
    >
      <div
        id="image-container"
        className="w-full h-full relative bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundSmall})` }}
      >
        <img
          src={background}
          alt="background-image"
          className="w-full h-full transition-opacity duration-300 ease-in"
          style={{ opacity: isBackgroundLoaded.value ? 1 : 0 }}
          onLoad={() => (isBackgroundLoaded.value = true)}
        />
      </div>
    </div>
  );
}

export default Background;
