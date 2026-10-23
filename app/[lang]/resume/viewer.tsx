"use client";

import React, { useState, useEffect, useRef } from "react";
import { Row } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const maxWidth = 800;

function Resume({content}: {content: any}) {
  const [file] = useState("/icons/Evanzhou-fullstack-developer.pdf");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(maxWidth);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(Math.min(containerRef.current.offsetWidth, maxWidth));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <Row ref={containerRef} className="resume min-h-screen mx-auto text-center border box-content" style={{ maxWidth: `${maxWidth}px` }}>
      <Document file={file}
      loading={<div className="col-span-full text-center py-16">
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner loading-md text-gray-800 dark:text-gray-200"></span>
              <span className="ml-3 text-gray-800 dark:text-gray-200">加载中...</span>
            </div>
          </div>}>
        {Array.from(new Array(2), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={containerWidth}
          />
        ))}
      </Document>
    </Row>
  );
}

export default Resume;
