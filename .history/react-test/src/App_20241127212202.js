import React from "react";
import * as XLSX from "xlsx";

function App() {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result); // แปลง ArrayBuffer เป็น Uint8Array
      const workbook = XLSX.read(data, { type: "array" }); // ใช้ `type: "array"`

      // อ่านข้อมูลจาก Sheet แรก
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      console.log(sheetData); // ดูผลลัพธ์ใน Console
    };

    reader.readAsArrayBuffer(file); // อ่านไฟล์เป็น ArrayBuffer
  };

  return (
    <div>
      <h1>Upload XLSX File</h1>
      <input type="file" accept=".xlsx" onChange={handleFile} />
    </div>
  );
}

export default App;
