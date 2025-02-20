import React, { useState } from "react";
import ExcelJS from "exceljs";

function App() {
  const [sheetData, setSheetData] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(arrayBuffer); // โหลดข้อมูลไฟล์ Excel

      // อ่านข้อมูลจาก Sheet แรก
      const worksheet = workbook.worksheets[0];
      const jsonData = [];

      // อ่านค่าจากแต่ละแถวใน Worksheet
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return; // ข้าม Header
        const rowData = {};
        row.eachCell((cell, colIndex) => {
          let cellValue = cell.value;

          // ตรวจสอบว่า cellValue เป็น object หรือไม่
          if (cellValue && typeof cellValue === "object") {
            if (cellValue.formula) {
              // ถ้ามีสูตร ให้ดึงค่าผลลัพธ์ (result) ออกมา
              cellValue = cellValue.result || `Formula: ${cellValue.formula}`;
            } else {
              // แปลง object อื่นๆ เป็น string
              cellValue = JSON.stringify(cellValue);
            }
          }

          // ตรวจสอบและแปลงค่า Date
          if (cellValue instanceof Date) {
            cellValue = cellValue.toLocaleDateString();
          }

          rowData[`Column ${colIndex}`] = cellValue;
        });
        jsonData.push(rowData);
      });

      setSheetData(jsonData); // อัปเดต state
    };

    reader.readAsArrayBuffer(file); // อ่านไฟล์เป็น ArrayBuffer
  };

  return (
    <div>
      <h1>Upload XLSX File (ExcelJS)</h1>
      <input type="file" accept=".xlsx" onChange={handleFile} />
      {sheetData && sheetData.length > 0 && (
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
