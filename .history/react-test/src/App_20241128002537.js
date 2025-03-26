import React, { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [sheetData, setSheetData] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูล

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result); // แปลง ArrayBuffer เป็น Uint8Array
      const workbook = XLSX.read(data, { type: "array" }); // ใช้ `type: "array"`

      // อ่านข้อมูลจาก Sheet แรก
      const sheetName = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      setSheetData(jsonData); // อัปเดต state
    };

    reader.readAsArrayBuffer(file); // อ่านไฟล์เป็น ArrayBuffer
  };

  return (
    <div>
      <h1>Upload XLSX File</h1>
      <input type="file" accept=".xlsx" onChange={handleFile} />
      {sheetData && sheetData.length > 0 && ( // ตรวจสอบว่า sheetData มีข้อมูล
        <table border="1">
          <thead>
            <tr>
              {Object.keys(sheetData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheetData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
