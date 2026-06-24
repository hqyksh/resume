'use client';

import React from "react";
import { usePathname, useSearchParams } from 'next/navigation';

export default function ModalWrapper({
  modal,
}: {
  modal: React.ReactNode;
}) {

  const sp = useSearchParams();
  const showModal = sp.get('modal') === 'true';

  // useEffect(() => {
  //   setIsModal(window.location.hash === '#modal');
  // }, []);

  // const pathname = usePathname();
  // const showModal = pathname?.includes('/experience');
  return (
    <>
      {showModal && modal}
    </>
  );
}