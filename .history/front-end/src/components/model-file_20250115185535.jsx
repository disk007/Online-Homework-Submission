import React, { useEffect, useState } from "react";
import * as docx from "docx-preview";
import ModelImg from "./model-img";
import {OutTable,ExcelRenderer} from 'react-excel-renderer'
import { FaArrowDown } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import { LuZoomIn,LuZoomOut } from "react-icons/lu";
import {
    TransformWrapper,
    TransformComponent,
    useControls,
  } from "react-zoom-pan-pinch";
const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
      <>
      <div className="p-2 cursor-pointer mx-2" onClick={() => resetTransform()}><MdOutlineRefresh className="text-slate-400 hover:text-white w-5 h-5" /></div>
      <div className="p-2 cursor-pointer mx-2" onClick={() => zoomOut()}><LuZoomOut className="text-slate-400 hover:text-white w-5 h-5" /></div>
      <div className="p-2 cursor-pointer mx-2" onClick={() => zoomIn()}><LuZoomIn className="text-slate-400 hover:text-white w-5 h-5" /></div>
      </>
  )
}

const ModelFile = ({ open, onClose, file, type,download }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [cols,setCols] = useState([])
  const [header,setHeader] = useState([])
  const [textContent, setTextContent] = useState("");
   
//   for (const key in fileUrl) {
//         console.log(`Key: ${key}, Value: ${file[key]}`);
// }
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
      if (type === "text/plain" || 'text/plain; charset=UTF-8') {
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
    setHeader([]); // Clear header for Excel files
    setCols([]); // Clear columns for Excel files
    if (panelSectionRef.current) {
      panelSectionRef.current.innerHTML = ""; // ล้างเนื้อหา docx ถ้ามี
    }
    setTextContent(""); // Clear text content for .txt files
    setFileUrl(null); // Reset fileUrl
    onClose();
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
                <div ref={panelSectionRef} 
                />
              ) : type === "application/pdf" || type === 'text/plain; charset=UTF-8' ? (
                <object
                  className="w-[700px] h-screen"
                  data={fileUrl}
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
              ) : type === "text/plain" || 'text/plain; charset=UTF-8' ? ( // เพิ่มส่วนแสดง .txt
                <div className="p-4 bg-gray-100 text-black w-[700px]  overflow-auto border">
                  <pre className="whitespace-pre-wrap bg-red-100">{textContent}</pre>
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
              download={download !== undefined ? download : file?.name}
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
        <div className={`fixed inset-0 flex flex-col ${open ? "visible bg-black/90 z-50" : "invisible"}`}>
          <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
              <div className="flex justify-end p-5 items-center">
                  <Controls />
                  <a
                      href={fileUrl}
                      download={download !== undefined ? download : file?.name}
                      className="bg-black text-white mr-1 hover:border-2 p-1 rounded-full"
                  >
                      <FaArrowDown className="text-slate-400 hover:text-white" />
                  </a>
                  <button onClick={()=>{handleClose()}} className="mx-2 text-white border-2 border-slate-400 hover:border-white py-2 px-5 rounded-md ">Close</button>
              </div>
              <div className="flex-grow flex items-center justify-center">
                <div className="overflow-hidden">
                  <TransformComponent>
                    <img
                      src={fileUrl}
                      alt="test"
                      className="max-w-[400px] max-h-[600px] object-contain"
                    />
                  </TransformComponent>
                </div>
              </div>

              </>
          )}
          </TransformWrapper>
          </div>
      )}
    </>
  );
};

export default ModelFile;
