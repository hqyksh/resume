"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { Container, Row } from "react-bootstrap";

const Sample = dynamic(() => import('./viewer'), { ssr: false });

export default function Resume({content}: {content: any}) {
  return (
    <div>
      <Container fluid className="resume-section pt-10">
      <Row style={{ justifyContent: "center", position: "relative" }}>
        <a
          href="/icons/Evanzhou-fullstack-developer.pdf"
          target="_blank"
          download
          style={{ maxWidth: "250px" }}
          className="flex justify-center items-center mx-auto mb-5 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <ArrowDownToLine />&nbsp;{content.buttons.secondary}
        </a>
      </Row>
      <Suspense>
        <div className='min-h-screen'>
          <Sample content={content}/>
        </div>
      </Suspense>
      <Row style={{ justifyContent: "center", position: "relative" }}>
        <a
          href="/icons/Evanzhou-fullstack-developer.pdf"
          target="_blank"
          download
          style={{ maxWidth: "250px" }}
          className="flex mx-auto justify-center items-center my-5 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <ArrowDownToLine />&nbsp;{content.buttons.secondary}
        </a>
      </Row>
      </Container>
    </div>
  );
}