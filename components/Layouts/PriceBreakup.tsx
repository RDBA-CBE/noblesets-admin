import React, { useState, useEffect } from "react";

export default function PriceBreakup({ data }) {
  const [breakupData, setBreakupData] = useState([]);

  useEffect(() => {
    if (!data) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const headers = Array.from(doc.querySelectorAll("thead th")).map((th) =>
      th.textContent.trim()
    );

    const values = Array.from(doc.querySelectorAll("tbody td")).map((td) =>
      td.textContent.trim()
    );

    const pairedData = headers.map((property, index) => ({
      property,
      price: values[index] || "",
    }));

    setBreakupData(pairedData);
  }, [data]);

  return (
    <div className="p-4">
      {breakupData?.map((item, idx) => (
        <div
          key={idx}
          className={`rounded px-4 py-2 mb-2 text-sm ${
            idx === breakupData.length - 1
              ? "bg-[#b4633a30] text-black font-semibold text-center"
              : "bg-[#fff]"
          }`}
        >
          <div className="flex justify-between">
            <span>{item.property}</span>
            <span>₹ {item.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
