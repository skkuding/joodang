import { Separator } from "@/app/(main)/components/Separator";
import { FormSection } from "@/app/components/FormSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Page() {
  function FAQHeader() {
    return (
      <div className="p-5">
        <p className="text-xl font-medium">FAQ</p>
        <p className="text-color-neutral-40 text-sm font-normal">
          자주 묻는 질문을 모아봤어요
        </p>
        <Button className="mt-4 w-full">
          <a href="mailto:ask@joodang.com" className="w-full">
            1:1 문의 바로가기
          </a>
        </Button>
      </div>
    );
  }

  function FAQList() {
    return (
      <div className="flex flex-col items-center px-5 py-[30px]">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <FormSection
                title={"푸시 알림을 받으려면 어떻게 하나요? (PWA)"}
              />
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-color-neutral-99 rounded p-4 text-sm font-normal">
                <b>아이폰 (iOS)</b>
                <br />
                아이폰은 푸시알림을 받기 위해 PWA 설치가 요구됩니다.
                <br />
                <i>공유하기 -&gt; 홈 화면에 추가 -&gt; 추가</i>
                <br />
                이후 홈 화면에 추가된 어플로 접속하여 홈 화면 우측 상단의 알림
                버튼을 클릭해주세요.
                <br />
                <br />
                <b>갤럭시 (Android)</b>
                <br />
                갤럭시는 홈 화면 우측 상단의 알림 버튼을 누르면 바로 알림을
                허용할 수 있습니다.
                <br />
                안정적인 푸시 알림을 위해 PWA 설치를 권장드립니다.
                <br />
                <br />
                (크롬 브라우저 기준)
                <br />
                <i>화면 상단 최우측 버튼 -&gt; 홈 화면에 추가 -&gt; 설치</i>
                <br />
                이후 홈 화면에 추가된 어플로 접속하여 홈 화면 우측 상단의 알림
                버튼을 클릭해주세요.
                <br />
                <br />
                <i>
                  <a
                    href="https://www.installpwa.com/from/joodang.com"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    자세한 설명은 이곳을 참고해주세요
                  </a>
                </i>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <FormSection
                title={"비회원 예약 내역을 다른 브라우저로 옮기고 싶어요."}
              />
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-color-neutral-99 rounded p-4 text-sm font-normal">
                비회원 예약 내역은 브라우저에 저장되어 시크릿 모드, 개인정보
                보호 모드일 경우 <b>자동 삭제</b>됩니다.
                <br />
                <b>카카오톡 로그인</b> 이후 <i>예약 내역</i> &nbsp;탭에
                접속하시면 로그인 계정에 저장됩니다.
                <br />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <FormSection title={"다른 문제가 생겼어요..."} />
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-color-neutral-99 rounded p-4 text-sm font-normal">
                상단의 <b>1:1 문의 바로가기</b> 기능이 비록 메일로 연결되지만,
                저희는 항상 컴퓨터 앞에 있습니다.
                <br />
                <a
                  href="mailto:ask@joodang.com"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  메일
                </a>
                &nbsp;보내주시면 빠른 답변 도와드리겠습니다.
                <br />
                <br />
                버그 제보도 언제나 환영합니다!
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <FAQHeader />
      <Separator />
      <FAQList />
    </div>
  );
}
