import "./loader.component.css";

function Loader() {
  return (
    <div id="loader-container" className="absolute w-full h-full top-0 left-0 flex items-center justify-center">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
