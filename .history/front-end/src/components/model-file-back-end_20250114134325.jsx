import React, { useEffect, useState } from "react";
import * as docx from "docx-preview";
import ModelImg from "./model-img";
import {OutTable,ExcelRenderer} from 'react-excel-renderer'
import { FaArrowDown } from "react-icons/fa";

const ModelFileBackEnd = ({ open, onClose, file, type }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [cols,setCols] = useState([])
  const [header,setHeader] = useState([])
  const [textContent, setTextContent] = useState(""); 
//   for (const key in fileUrl) {
//         console.log(`Key: ${key}, Value: ${file[key]}`);
// }
console.log(fileUrl)
  // Ref function to manage the rendering of docx content
  const panelSectionRef = (node) => {
    if (node) {
      console.log("panelSectionRef node is set:", node);
      if (file && type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          docx.renderAsync(arrayBuffer, node)
            .then(() => {
              console.log("docx: finished rendering");
            })
            .catch((error) => {
              console.error("Error rendering docx:", error);
            });
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };
  console.log("file type ",type)

  // Clean up file URL when file or type changes
  // useEffect(() => {
  //   if (file) {
  //     const newFileUrl = URL.createObjectURL(file);
  //     setFileUrl(newFileUrl);

  //     return () => {
  //       if (fileUrl) {
  //         URL.revokeObjectURL(fileUrl); // Clean up the URL
  //       }
  //     };
  //   }
  // }, [file]);
  useEffect(() => {
    if (file) {
      const newFileUrl = URL.createObjectURL(file);
      setFileUrl(newFileUrl);

      // Handle .txt files
      if (type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTextContent(e.target.result); // Set content for .txt file
        };
        reader.readAsText(file); // อ่านไฟล์ .txt เป็นข้อความ
      }

      return () => {
        if (fileUrl) {
          URL.revokeObjectURL(fileUrl); // Clean up the URL
        }
      };
    }
  }, [file, type]);

  // Clean up Excel or docx related states
  useEffect(() => {
    if (file && type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      ExcelRenderer(file, (err, resp) => {
        if (err) {
          console.error("Error rendering Excel:", err);
        } else {
          setCols(resp.rows);
          setHeader(resp.rows[0]);
        }
      });
    }
  }, [file, type])  // Add fileUrl to the dependency array
  

  // Function to handle closing and clearing the docx content
  const handleClose = () => {
    setHeader([]);
    setCols([]);
    setFileUrl(null); // Reset fileUrl
    onClose(); // Call the parent onClose function
  };

  return (
    <>
      {open && type !== "image/png" && type !== "image/jpeg" ? (
        <div
          className={`fixed inset-0 flex flex-col overflow-y-auto ${
            open ? "visible bg-black z-50" : "invisible"
          }`}
        >
          <div className="flex-grow flex justify-center my-1">
            <div className="p-2 border-2 bg-white">
              {type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                <div ref={panelSectionRef} />
              ) : type === "application/pdf" ? (
                <object
                  className="w-[700px] h-screen"
                  data={file}
                  type="application/pdf"
                />
              ) : type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
                <>
                  <table className="m-3 border-2 w-[700px]">
                    <thead >
                      <tr className="">
                        {header.map((col, index) => (
                          <th className="border-2 py-2 px-4 bg-teal-700 text-white" key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cols.slice(1).map((row, index) => (
                        <tr key={index} className={`${index % 2 == 0 ? 'bg-cyan-200': 'bg-cyan-300'}`}>
                          {row.map((col, index) => (
                            <td className={`border-2 `} key={index}>{col}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : type === "text/plain" ? ( // เพิ่มส่วนแสดง .txt
                <div className="p-4 bg-gray-100 text-black w-[700px]  overflow-auto border">
                  <pre className="whitespace-pre-wrap">{textContent}</pre>
                </div>
              ) : 
              (
                <p>ไม่รองรับไฟล์ประเภทนี้</p>
              )}
            </div>
          </div>
          <div className="fixed right-3 mx-2 top-2 flex items-center">
            <a
              href={fileUrl}
              download={file?.name}
              className="bg-black text-white mr-1 hover:border-2 p-1 rounded-full"
            >
              <FaArrowDown className="w-6 h-6" />
            </a>
            <button
              onClick={handleClose}
              className="hover:bg-gray-300 border-2 bg-black rounded-md py-2 px-5 text-base text-white ml-1"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <ModelImg open={open} OnClose={onClose} name={fileUrl} fileName={file?.name} />
      )}
    </>
  );
};

export default ModelFileBackEnd;
