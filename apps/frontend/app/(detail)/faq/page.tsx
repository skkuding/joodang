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
      <div className="flex flex-col items-center bg-amber-100 px-5 py-[30px]">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <FormSection title={"이러이러한 경우는 어떻게 하나요?"} />
            </AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
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
