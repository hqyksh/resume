"use client"
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';

const HackerBtn = ({ label }: { label: string }) => {
  const [displayText, setDisplayText] = useState(label);
  const [isScrambling, setIsScrambling] = useState(false);
  const charset = "abcdefghijklmnopqrstuvwxyz";

  const randomChars = (length: number) => {
    return Array.from(
      { length },
      () => charset[Math.floor(Math.random() * charset.length)]
    ).join("");
  };

  const scramble = async (input: string) => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let prefix = "";
    for (let index = 0; index < input.length; index++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      prefix += input.charAt(index);
      setDisplayText(prefix + randomChars(input.length - prefix.length));
    }
    setIsScrambling(false);
  };

  const startScrambling = () => {
    scramble(label);
  };

  useEffect(() => {
    setDisplayText(label);
    setIsScrambling(false);
  }, [label]);

  return (
    <Button size={'lg'} className='text-base px-5 py-6'       onMouseEnter={startScrambling}
    >   <Download className="mx-1" />
        {displayText}
    </Button>
  );
};

export default HackerBtn;
