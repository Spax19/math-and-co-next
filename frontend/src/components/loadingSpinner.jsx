import React from "react";

function loadingSpinner() {
  return (
    <>
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4b26a]"></div>
      </div>
    </>
  );
}

export default loadingSpinner;
