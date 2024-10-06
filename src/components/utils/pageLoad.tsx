import Load from "./Load";

const pageLoad = () => {
  return (
    <div className="flex justify-center items-center min-h-[70vh] text-h-color text-xl font-semibold">
      Loading&nbsp;
      <Load className="fill-black w-8 h-8" />
    </div>
  );
};

export default pageLoad;
