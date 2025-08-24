'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import BlackBeer from '@/icons/blackBeer.png';
import BlackHouse from '@/icons/blackHouse.png';
import GrayBeer from '@/icons/grayBeer.png';
import GrayHouse from '@/icons/grayHouse.png';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useState } from 'react';
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosRefresh,
} from 'react-icons/io';

export default function Home() {
  const [page, setPage] = useState('home');

  function renderHeader() {
    return (
      <div className="flex flex-col gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-1 items-center">
            <span className="text-xl font-semibold">성균관대학교</span>
            <IoIosArrowDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>성균관대학교</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="px-5 py-4 flex flex-col bg-color-neutral-20 rounded-md">
          <span className="text-primary-normal text-xs font-normal">
            2025. 01. 01
          </span>
          <span className="text-lg font-medium text-color-common-100">
            성균관대학교 대동제
          </span>
          <span className="text-color-neutral-80 text-sm font-normal">
            오늘은 대동제가 열려요! 함께 축제를 즐겨볼까요?
          </span>
        </div>
      </div>
    );
  }

  function renderRecommendation() {
    return (
      <Section title="오늘의 주점" route="/recommendation">
        <div className="flex flex-col">
          <div className="text-sm font-normal text-color-neutral-60 flex items-center gap-1">
            <span>2025. 01. 01 (목)</span>
            <IoIosRefresh className="w-3.5 h-3.5" />
          </div>
          <Carousel>
            <CarouselContent className="-ml-4">
              <CarouselItem className="pl-4">...</CarouselItem>
              <CarouselItem className="pl-4">...</CarouselItem>
              <CarouselItem className="pl-4">...</CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </Section>
    );
  }

  interface SectionProps {
    title: string;
    route: string;
    children: React.ReactNode;
  }
  function Section({ title, route, children }: SectionProps) {
    return (
      <div>
        <div className="flex justify-between">
          <h2 className="text-xl font-medium">{title}</h2>
          <Link href={route} className="flex items-center gap-[2px]">
            <span className=" text-xs font-normal text-color-neutral-40">
              더보기
            </span>
            <IoIosArrowForward className="w-[13px] h-[13px] text-color-neutral-40" />
          </Link>
        </div>
        {children}
      </div>
    );
  }

  function renderFooter() {
    return (
      <>
        <div
          className="bg-white h-20 flex items-center justify-center "
          style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.1)' }}
        >
          <div className="flex flex-row justify-center gap-[60px] -mt-2">
            <div
              onClick={() => setPage('home')}
              className="w-[60px] h-[54px] flex flex-col items-center"
            >
              {page === 'home' ? (
                <>
                  <Image
                    src={BlackHouse}
                    alt="검은 집"
                    width={32}
                    height={32}
                  />
                  <p className="text-black ">홈</p>
                </>
              ) : (
                <>
                  <Image src={GrayHouse} alt="회색 집" width={32} height={32} />
                  <p className="text-[#9B9B9B]">홈</p>
                </>
              )}
            </div>
            <div
              onClick={() => setPage('beer')}
              className="w-[60px] h-[54px] flex flex-col items-center"
            >
              {page === 'beer' ? (
                <>
                  <Image
                    src={BlackBeer}
                    alt="검은 맥주"
                    width={32}
                    height={32}
                  />
                  <p className="text-black ">주점 찾기</p>
                </>
              ) : (
                <>
                  <Image
                    src={GrayBeer}
                    alt="회색 맥주"
                    width={32}
                    height={32}
                  />
                  <p className="text-[#9B9B9B]">주점 찾기</p>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
  // const NaverMap = dynamic(() => import('./components/NaverMap'), {
  //   ssr: false,
  // });

  return (
    <div className="flex flex-col px-5 py-10 gap-10">
      {renderHeader()}
      {renderRecommendation()}
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_ID}`}
      />
      {renderFooter()}
    </div>
  );
}
