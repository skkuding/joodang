'use client';
import foodIcon from '@/assets/graphic_food.svg';
import animalIcon from '@/assets/icon_aninal.svg';
import heartIcon from '@/assets/icon_heart.svg';

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
import { useState } from 'react';
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosRefresh,
} from 'react-icons/io';
import NaverMap from './components/NaverMap';
import { dateFormatter } from './libs/utils';

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
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4">
                <StoreCard
                  id={0}
                  clubName={'KUSA'}
                  storeName={'놀러와요 동물의 숲'}
                  startTime={new Date('2025-01-01T18:00:00')}
                  endTime={new Date('2025-01-02T23:00:00')}
                />
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4">
                <StoreCard
                  id={1}
                  clubName={'SKKUDING'}
                  storeName={'모태솔로지만 연애는 하고싶어'}
                  startTime={new Date('2025-01-01T18:00:00')}
                  endTime={new Date('2025-01-02T23:00:00')}
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </Section>
    );
  }

  function renderStaticNotice() {
    return (
      <div className="relative px-5 py-3 bg-primary-normal h-[108px]">
        <span className="px-1.5 py-0.5 text-white bg-black text-[10px] rounded-sm font-medium">
          Commit
        </span>
        <p className="text-white text-lg font-medium">
          이세계 음식점에 놀러오세요!
        </p>
        <p className="text-sm font-normal text-white/70">
          이곳에서만 맛볼 수 있는 특별한 메뉴
        </p>
        <Image
          src={foodIcon}
          alt="food"
          className="absolute right-5 top-1/2 -translate-y-1/2 w-[84px] h-[84px]"
        />
      </div>
    );
  }

  interface StoreCardProps {
    id: number;
    clubName: string;
    storeName: string;
    startTime: Date;
    endTime: Date;
  }

  function StoreCard({
    id,
    clubName,
    storeName,
    startTime,
    endTime,
  }: StoreCardProps) {
    return (
      <div className="flex justify-between flex-col w-[170px] h-[180px] p-[14px] rounded-md shadow-[0px_0px_20px_0px_rgba(0,0,0,0.12)]">
        <div className="flex justify-end">
          <Image
            src={id % 2 === 0 ? animalIcon : heartIcon}
            alt={`index-${id}`}
            className="w-[48.60px] h-[40.50px]"
          />
        </div>

        <div>
          <h3 className="text-[13px] font-medium text-primary-normal">
            {clubName}
          </h3>
          <h3 className="text-sm font-normal mb-1 text-color-neutral-50 overflow-hidden text-ellipsis whitespace-nowrap">
            {storeName}
          </h3>
          <p>
            {dateFormatter(startTime, 'YYYY.MM.DD')} -{' '}
            {dateFormatter(endTime, 'DD')}
          </p>
        </div>
      </div>
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

  return (
    <div className="flex flex-col px-5 py-10 gap-10">
      {renderHeader()}
      {renderRecommendation()}
      {renderStaticNotice()}
      <NaverMap />
      {renderFooter()}
    </div>
  );
}
