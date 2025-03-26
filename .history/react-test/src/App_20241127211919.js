import React, { useState } from "react";
import * as XLSX from 'xlsx';

function App() {
  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: 'binary' });
  
      // อ่านข้อมูลจาก Sheet แรก
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      console.log(sheetData);
    };
  
    reader.readAsBinaryString(file);
  };
  
  return(<input type="file" accept=".xlsx" onChange={handleFile} />)
}

export default App;
