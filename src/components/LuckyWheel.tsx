import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

async function getWheelResult() {
  // TODO: get result from server
  return Math.ceil(Math.random() * 10) % 6;
}

export const LuckyWheel: React.FC = () => {
  const [isSpining, setIsSpining] = useState(false);

  const [disabled, setDisabled] = useState(true);

  const [degree, setDegree] = useState(0);

  const onSpinButtonClick = async () => {
    if (disabled || isSpining) return;

    const level = await getWheelResult();

    setDegree(level * 60 + 3600);

    setIsSpining(true);
  };

  useEffect(() => {
    // TODO: determine whether the user has drawn a prize today
    const hasSpinedToDay = false;

    if (!hasSpinedToDay) setDisabled(false);
  }, []);

  return (
    <div className="relative rounded-[6px] border border-[#272B40] bg-[#101828] py-6">
      <div className="">
        <div className="text-center font-bold text-2xl text-white">
          <span>Lucky Wheel</span>
        </div>

        <div className="flex items-center justify-center text-sm">
          <span>You won</span>
          <div className=""></div>
          <span>points</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center overflow-hidden">
        <div className="relative flex aspect-square w-[420px] shrink-0 items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/wheel-bg.svg" className="object-cover" alt="" />
          </div>

          <div className="absolute inset-[40px]">
            <img
              src="/wheel.svg"
              style={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                '--tw-rotate': degree + 'deg'
              }}
              className={classNames('rotate-0 object-contain [transition-timing-function:cubic-bezier(0.5,0,0,1)]', {
                '[transition-duration:5s] transition-all': isSpining
              })}
              onTransitionEnd={() => {
                setIsSpining(false);
                setDegree(degree - 3600);
              }}
            />
          </div>

          <img src="/wheel-pointer.svg" className="absolute left-1/2 top-0 w-[18px] -translate-x-1/2" alt="" />

          <div className="z-10 flex size-[49px] items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(225deg,#FEDC31_4.15%,#FDC347_13.8%,#FC8682_33.1%,#FA2CD7_59.91%,#987CDB_85.64%,#33D0E0_111.37%)]">
            <div
              className="relative z-10 flex size-[44px] items-center justify-center rounded-full bg-black font-bold text-[16px]"
              onClick={onSpinButtonClick}
            >
              Spin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
