import { useLotteryInfo } from '@/providers/LotteryInfoProvider';
import { joinSignProtocolTGGroup } from '@/utils';
import { Button, Modal } from '@ethsign/ui';
import React, { useEffect, useMemo, useState } from 'react';

export const PhysicalPrizeModal: React.FC<{
  prizeId: string;
}> = (props) => {
  const { prizeId } = props;

  const [visible, setVisible] = useState(false);

  const { prizes } = useLotteryInfo();

  const prize = useMemo(() => {
    return prizes.find((item) => item.id === prizeId);
  }, [prizeId, prizes]);

  useEffect(() => {
    if (prize && !visible && prize.type === 'physical') {
      setVisible(true);
    }
  }, [prize, visible]);

  if (!prize) return null;

  return (
    <Modal
      open={visible}
      onOpenChange={setVisible}
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      footer={false}
    >
      <div className="flex justify-center">
        <img className="size-[60px] object-contain object-center" src={prize.image} alt="" />
      </div>

      <h1 className="text-center font-bold text-xl text-[#1c1c1c]">
        Congratulations! <br />
        You won a {prize.value}
      </h1>

      <p className="mx-auto w-[210px] text-center font-medium text-sm text-[#475467]">
        Please send your shipping address through Signie bot
      </p>

      <Button
        onClick={() => {
          joinSignProtocolTGGroup();
        }}
      >
        Send Address Now
      </Button>
    </Modal>
  );
};
