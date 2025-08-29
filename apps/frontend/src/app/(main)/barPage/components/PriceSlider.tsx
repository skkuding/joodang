import { Slider } from "@/components/ui/slider";

type SliderProps = React.ComponentProps<typeof Slider>;

export default function PriceSlider({ ...props }: SliderProps) {
  return <Slider {...props} />;
}
