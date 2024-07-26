import React from "react";

const FactGPT = ({ fact }) => {
  return (
    <div className="">
      <div className="w-[35rem] md:w-[35rem] h-auto md:h-[12rem] max-h-[12rem] overflow-y-auto border border-gray-300 p-2 box-border">
        <h3 className="text-3xl font-semibold">Fact of the Day!</h3>
        <p className="text-xl">{fact}</p>
      </div>

      {/* <div className="group inline-block">
        <div className="p-4 bg-blue-500 text-white cursor-pointer">
          Hover over me
        </div>
        <div className="absolute hidden group-hover:block bg-gray-800 text-white p-2 mt-2 rounded-lg shadow-lg">
          This is the pop-up content!
        </div>
      </div> */}
    </div>
  );
};

export default FactGPT;
