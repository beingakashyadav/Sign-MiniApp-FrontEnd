import { Events, eventBus } from '@/eventbus';
import { useUserInfo } from '@/providers/UserInfoProvider';
import { getRewardsInfo } from '@/services';
import { MiniRewardStatus, RewardInfo } from '@/types';
import { Edit02, InfoCircle } from '@ethsign/icons';
import { Button, Modal } from '@ethsign/ui';
import { shortenWalletAddress } from '@ethsign/utils-web';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ClaimAddressEditModal } from './components/ClaimAddressEditModal';
import { ClaimAddressTipModal } from './components/ClaimAddressTipModal';
import { HowToClaimModal } from './components/HowToClaimModal';
import { RewardItem } from './components/RewardItem';
import { useNavigate } from 'react-router-dom';

export const NewRewardIssuedModal: React.FC<{ open: boolean; onOpenChange: (visible: boolean) => void }> = (props) => {
  const { open, onOpenChange } = props;

  const navigate = useNavigate();

  return (
    <Modal
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      header={<h2 className="text-center font-bold text-xl">Your rewards has been issued</h2>}
      footer={false}
      open={open}
      hiddenCloseIcon
      onOpenChange={onOpenChange}
    >
      <p className="text-center text-sm text-gray-900">Please check 'Rewards' page.</p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            onOpenChange?.(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => {
            navigate('/rewards');
            onOpenChange?.(false);
          }}
        >
          Check Now
        </Button>
      </div>
    </Modal>
  );
};

export const Rewards: React.FC = () => {
  const { user } = useUserInfo();

  const [rewards, setRewards] = useState<RewardInfo[]>([]);

  const [loading, setLoading] = useState(false);

  const [claimTipModalVisible, setClaimTipModalVisible] = useState(false);
  const [claimAddressEditModalVisible, setClaimAddressEditModalVisible] = useState(false);
  const [claimAddressTipModalVisible, setClaimAddressTipModalVisible] = useState(false);
  const [newRewardIssuedModalVisible, setNewRewardIssuedModalVisible] = useState(false);

  useEffect(() => {
    const refreshRewards = async () => {
      try {
        setLoading(true);
        const response = await getRewardsInfo();

        // 检查是否有已经发放的奖品
        const notNotifiedRewards = response.rows.filter((reward) => {
          return reward.status === MiniRewardStatus.Claimed && !checkNewRewardModalShown(reward.id);
        });

        console.log(notNotifiedRewards);

        if (notNotifiedRewards.length) {
          setNewRewardIssuedModalVisible(true);
          setNewRewardsModalShownFlag(notNotifiedRewards.map((reward) => reward.id));
        }

        setRewards(response.rows);
      } catch (error) {
        console.error(error);
        setRewards([]);
      } finally {
        setLoading(false);
      }
    };

    refreshRewards();

    eventBus.on(Events.mysteryDropGrabbed, refreshRewards);

    return () => {
      eventBus.off(Events.mysteryDropGrabbed, refreshRewards);
    };
  }, []);

  return (
    <div className="relative">
      <div className="mb-2 flex min-h-20 items-center justify-between overflow-hidden rounded-[8px] bg-[url(https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/Card_240626034540.webp)] bg-cover bg-center bg-no-repeat p-4">
        <div>
          <div className="flex items-center gap-1 font-medium text-sm text-white">
            <span>My wallet address</span>
            <InfoCircle
              size={18}
              color="white"
              onClick={() => {
                setClaimAddressTipModalVisible(true);
              }}
            />
          </div>

          <div className="mt-1">
            <span className="text-sm font-semibold text-white">
              {user?.claimWalletAddress ? shortenWalletAddress(user.claimWalletAddress, 'normal') : 'No Wallet Address'}
            </span>
          </div>
        </div>

        <Button
          className="bg-white text-xs hover:bg-white focus:bg-white active:bg-white"
          onClick={() => {
            setClaimAddressEditModalVisible(true);
          }}
        >
          <span className="mr-2 text-sm text-[#0052FF]">Edit</span>
          <Edit02 size={16} color="#0052FF" />
        </Button>
      </div>

      <h2 className="flex items-center justify-between font-bold text-xl text-white">
        <span>My Rewards</span>

        <span
          className="text-xs text-primary-foreground underline"
          onClick={() => {
            setClaimTipModalVisible(true);
          }}
        >
          How to claim?
        </span>
      </h2>

      {loading && (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

      {!loading && rewards.length > 0 && (
        <div className="mt-2 space-y-2">
          {rewards.map((reward) => (
            <RewardItem key={reward.id} reward={reward} />
          ))}
        </div>
      )}

      {!loading && !rewards.length && (
        <div className="mt-2 rounded-[8px] border bg-white px-8 py-[22px]">
          <div className="flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#ECF2FF]">
              <img
                className="size-[30px]"
                src="https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/rewards-empty_240619025114.webp"
                alt=""
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="font-medium text-sm text-black">No Reward</span>
          </div>

          <p className="mt-1 text-center font-normal text-xs text-[#667085]">
            There is no reward yet. Spin the wheel and get rewards.
          </p>
        </div>
      )}

      <HowToClaimModal open={claimTipModalVisible} onOpenChange={setClaimTipModalVisible} />

      <ClaimAddressEditModal open={claimAddressEditModalVisible} onOpenChange={setClaimAddressEditModalVisible} />

      <ClaimAddressTipModal open={claimAddressTipModalVisible} onOpenChange={setClaimAddressTipModalVisible} />

      <NewRewardIssuedModal open={newRewardIssuedModalVisible} onOpenChange={setNewRewardIssuedModalVisible} />
    </div>
  );
};

const NEW_REWARDS_MODAL_SHOWN_FLAG = 'newRewardsShown';

function setNewRewardsModalShownFlag(rewardIds: string[]) {
  try {
    const currentIds: string[] = JSON.parse(localStorage.getItem(NEW_REWARDS_MODAL_SHOWN_FLAG) ?? '[]') ?? [];

    localStorage.setItem(NEW_REWARDS_MODAL_SHOWN_FLAG, JSON.stringify([...currentIds, ...rewardIds]));
  } catch (error) {
    localStorage.setItem(NEW_REWARDS_MODAL_SHOWN_FLAG, JSON.stringify(rewardIds));
    console.error(error);
  }
}

function checkNewRewardModalShown(rewardId: string) {
  try {
    const rewardIds: string[] = JSON.parse(localStorage.getItem(NEW_REWARDS_MODAL_SHOWN_FLAG) ?? '[]') ?? [];
    return rewardIds.includes(rewardId);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default Rewards;
