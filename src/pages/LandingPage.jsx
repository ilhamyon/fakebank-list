import React from "react";
import { DateRangePicker } from "react-date-range";
import { useDispatch, useSelector } from "react-redux";
import { CalendarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEffect } from "react";
import { fetchData } from "../redux/slice";
import Sort from "../assets/sort.svg";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";

function LandingPage() {
  const { data } = useSelector((state) => state.reducer);
  const [cloneData, setCloneData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  const [popupDate, setPopupDate] = useState(false);
  const [sortStatus, setSortStatus] = useState(false);
  const [selection, setSelection] = useState([
    {
      startDate: new Date("2015-01-01"),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  const [currentFilteredLength, setCurrentFilteredLength] = useState(0);

  const navigate = useNavigate();

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    let newOffset;
    if (currentFilteredLength !== 0) {
      newOffset = (event.selected * 10) % Number(currentFilteredLength);
    } else {
      newOffset = (event.selected * 10) % data.accounts.length;
    }
    setItemOffset(newOffset);
    const endOffset = newOffset + 10;
    setFilteredData(cloneData.slice(newOffset, endOffset));
  };

  useEffect(() => {
    const getData = async () => {
      await axios
        .get("https://fakebankk.herokuapp.com/")
        .then(({ data }) => {
          dispatch(fetchData(data));
          setCloneData(data.data.accounts);
          setFilteredData(data.data.accounts.slice(0, 10));
          setPageCount(Math.ceil(data.data.accounts.length / 10));
        })
        .catch((error) => console.log(error));
    };
    getData();
  }, []);

  const searchHandler = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);
  };

  const sortDate = () => {
    let array = [...cloneData];
    if (!sortStatus) {
      array.sort(
        (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
      );
    } else {
      array.sort(
        (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate)
      );
    }
    setSortStatus(!sortStatus);
    setCloneData(array);
    setFilteredData(array.slice(0, 10));
  };

  const rangeHandler = (e) => {
    setSelection([e.selection]);
  };

  const buttonSearchHandler = (e) => {
    const newData = data.accounts.filter(
      (x) =>
        x.description.toLowerCase().includes(inputValue) &&
        new Date(x.transactionDate) >= selection[0].startDate &&
        new Date(x.transactionDate) <= selection[0].endDate
    );
    setCloneData(newData);
    setFilteredData(newData.slice(0, 10));
    setPageCount(Math.ceil(newData.length / 10));
    const currentLength = newData.length;
    setCurrentFilteredLength(currentLength);
  };

  return (
    <div className="p-5 bg-[#0F172A] w-full h-screen max-h-screen overflow-y-auto">
      <div className="text-center text-[2rem] text-white">Fake Bank</div>
      <div className="text-center text-[2rem] text-white font-light">
        Just a random set of fake bank data.
      </div>
      <div className="lg:w-[90%] mx-auto">
        <div className="flex flex-col md:flex-row items-center md:space-x-2 mt-5">
          <div className="flex items-center p-2 h-[3rem] border w-full">
            <input
              onChange={(e) => searchHandler(e)}
              className="flex-1 outline-none bg-transparent text-white"
              placeholder="Search by description"
            />
            <MagnifyingGlassIcon className="h-[1rem] w-auto text-gray-500" />
          </div>
          <div className="relative w-full mt-5 md:mt-0">
            <div
              onClick={() => setPopupDate(!popupDate)}
              className="flex items-center space-x-2 border p-2 h-[3rem] cursor-pointer text-white"
            >
              <CalendarIcon className="h-[1rem] w-auto" />
              <div>{selection[0].startDate.toDateString()}</div>
              <div>-</div>
              <div>{selection[0].endDate.toDateString()}</div>
            </div>
            <div
              className={`${
                popupDate ? "" : "hidden"
              } absolute top-[120%] right-[0%] md:right-0 lg:right-auto lg:left-0`}
            >
              <DateRangePicker
                ranges={selection}
                onChange={(e) => rangeHandler(e)}
              />
            </div>
          </div>
          <button
            onClick={() => buttonSearchHandler()}
            className="px-5 py-2 bg-blue-500 text-white h-[3rem] w-full md:w-auto mt-5 md:mt-0"
          >
            Search
          </button>
        </div>
        {/* Render Table  */}
        <div className="w-full max-w-full overflow-x-auto mt-5 whitespace-nowrap text-white">
          <table className="w-full">
            <tr>
              <td>ID</td>
              <td className="cursor-pointer" onClick={() => sortDate()}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Transaction Date</span>
                  <img src={Sort} alt="" />
                </div>
              </td>
              <td>Description</td>
              <td>Category</td>
              <td>Debit</td>
              <td>Credit</td>
              <td>Detail</td>
            </tr>
            {filteredData?.map((x) => {
              return (
                <tr key={x.id}>
                  <td>{x.id}</td>
                  <td>{x.transactionDate}</td>
                  <td>{x.description}</td>
                  <td>{x.category}</td>
                  <td>${x.debit || 0}</td>
                  <td>${x.credit || 0}</td>
                  <td onClick={() => navigate(`/detail/${x.id}`)}>
                    <div className="flex justify-center">
                      <button className="rounded-md px-5 py-1 bg-blue-500 text-white">
                        Rincian
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
        <div className="flex justify-end mt-5">
          <ReactPaginate
            className="flex items-center space-x-5 bg-blue-500 p-2 text-white"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            activeClassName="text-[#0F172A]"
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
