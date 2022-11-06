import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function DataDetail() {
  const [detailData, setDetailData] = useState([]);
  const { data } = useSelector((state) => state.reducer);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setDetailData(data.accounts.filter((x) => Number(x.id) === Number(id)));
  }, [id]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-[#0F172A] text-white">
      <ChevronLeftIcon
        onClick={() => navigate(-1)}
        className="h-[2rem] w-auto absolute left-[1%] top-[3%] cursor-pointer z-[9999]"
      />
      <div className="w-full h-full md:h-auto md:w-auto drop-shadow-lg border p-5 rounded-md flex flex-col space-y-5 text-[1.25rem]">
        <div className="text-center text-[1.5rem]">Detail Data</div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-[200px]">Transaction Date :</div>
          {detailData[0]?.transactionDate}
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-[200px]">Category :</div>
          {detailData[0]?.category}
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-[200px]">Description :</div>
          {detailData[0]?.description}
        </div>

        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-[200px]">Debit :</div>${detailData[0]?.debit || 0}
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-[200px]">Credit :</div>${detailData[0]?.credit || 0}
        </div>
      </div>
    </div>
  );
}

export default DataDetail;
