import flameActive from "@/assets/flames/flame-active.png";
import flameInactive from "@/assets/flames/flame-inactive.png";

type Props = {
  active?: boolean;
  className?: string;
};

export function FlameIcon({ active = true, className }: Props) {
  return (
    <img
      src={active ? flameActive : flameInactive}
      alt=""
      aria-hidden
      className={className}
      draggable={false}
    />
  );
}
