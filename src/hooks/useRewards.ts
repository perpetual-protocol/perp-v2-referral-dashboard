import { useQuery } from "react-query"
import { getReferrerRewards } from "../views/report/Report"
import useStaking from "./useStaking"
import useTrading from "./useTrading"

export const refereeTiers = {
    1: {
        staked: 0,
        usd_cap: 200,
        rebate: 0.2,
        tier: 1,
    },
    2: {
        staked: 1000,
        usd_cap: 500,
        rebate: 0.2,
        tier: 2,
    },
    3: {
        staked: 2000,
        usd_cap: 800,
        rebate: 0.2,
        tier: 3,
    },
    4: {
        staked: 10000,
        usd_cap: 1200,
        rebate: 0.2,
        tier: 4,
    },
}

export const referrerTiers = {
    1: {
        staked: 0,
        usd_cap: 100,
        rebate: 0.2,
        tier: 1,
        minFees: 0,
    },
    2: {
        staked: 1000,
        usd_cap: 1000,
        rebate: 0.3,
        tier: 2,
        minFees: 0,
    },
    3: {
        staked: 2000,
        usd_cap: 3000,
        rebate: 0.4,
        tier: 3,
        minFees: 10000,
    },
    4: {
        staked: 10000,
        usd_cap: 3500,
        rebate: 0.55,
        tier: 4,
        minFees: 50000,
    },
}

export function calculateRefereeRewards(fees: number, stakedPerp: number) {
    const tier = Object.values(refereeTiers)
        .reverse()
        .find(t => stakedPerp >= t.staked)
    if (tier) {
        const rebate = fees * tier.rebate
        const cappedRebate = rebate > tier.usd_cap ? tier.usd_cap : rebate
        return { tier, rebateUSD: cappedRebate }
    }
    return { tier, rebateUSD: 0 }
}

export function calculateReferrerRewards(stakedPerp: number, feesPaid: number, vipTier?: number) {
    let tier = Object.values(referrerTiers)
        .reverse()
        .find(t => stakedPerp >= t.staked && t.minFees === 0)

    if (vipTier) tier = referrerTiers[vipTier]
    if (tier) {
        const rebate = feesPaid * tier.rebate
        const cappedRebate = rebate > tier.usd_cap ? tier.usd_cap : rebate
        return { tier, rebateUSD: cappedRebate }
    }
    return { tier, rebateUSD: 0 }
}

export default function useRewards(referralCode?: string, vipTier?: number) {
    const { weeklyTradingFee } = useTrading()
    const { data: stakedPerp, isLoading: isLoadingStakingData } = useStaking()

    const { data: referrerRewards, isLoading } = useQuery(
        ["referrerRebate"],
        () =>
            getReferrerRewards(
                [
                    {
                        owner: "unknown",
                        id: referralCode,
                        vipTier: String(vipTier),
                    },
                ],
                1,
            ),
        {
            enabled: !isLoadingStakingData && referralCode != null,
        },
    )

    const refereeRewards = calculateRefereeRewards(weeklyTradingFee, Number(stakedPerp))
    const nextRefereeTier = refereeTiers[refereeRewards?.tier?.tier + 1]
    const nextReferrerTier = referrerTiers[referrerRewards?.rebates[0]?.tier + 1]

    return {
        refereeRewards,
        referrerRewards,
        nextRefereeTier,
        nextReferrerTier,
        isLoading,
    }
}
