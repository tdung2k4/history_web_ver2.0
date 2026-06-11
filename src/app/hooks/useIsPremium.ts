import { useApp } from "../store";

/** Simple hook — trả về true nếu user có premium hoặc trial còn hiệu lực */
export function useIsPremium(): boolean {
  const { user } = useApp();
  if (!user.isPremium) return false;
  if (user.planType === "trial" && user.trialEndDate) {
    return new Date(user.trialEndDate) > new Date();
  }
  return user.isPremium;
}

/** Trả về số ngày còn lại của trial (null nếu không phải trial) */
export function useTrialDaysLeft(): number | null {
  const { user } = useApp();
  if (user.planType !== "trial" || !user.trialEndDate) return null;
  const diff = new Date(user.trialEndDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
