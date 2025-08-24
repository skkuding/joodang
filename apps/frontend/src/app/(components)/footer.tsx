'use client';

import BlackBeer from '@/icons/blackBeer.png';
import BlackHouse from '@/icons/blackHouse.png';
import GrayBeer from '@/icons/grayBeer.png';
import GrayHouse from '@/icons/grayHouse.png';
import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [page, setPage] = useState('home');

  return (
    <>
      <div className="flex flex-row justify-center bg-white h-20">
        <div>
          {page === 'home' ? (
            <>
              <Image src={BlackHouse} alt="검은 집" width={32} height={32} />
              <p className="text-black">홈</p>
            </>
          ) : (
            <>
              <Image src={GrayHouse} alt="회색 집" width={32} height={32} />
              <p className="gray">주점 찾기</p>
            </>
          )}
        </div>
        <div>
          {page === 'beer' ? (
            <>
              <Image src={BlackBeer} alt="검은 맥주" width={32} height={32} />
              <p>주점 찾기</p>
            </>
          ) : (
            <>
              <Image src={GrayBeer} alt="회색 맥주" width={32} height={32} />
              <p className="text-[#9B9B9B]">주점 찾기</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
