import { useQuery } from "react-query"
import { useGlobalState } from "../AppStateHolder"
import { getStakedPerp } from "../views/report/Report"

const CONTRACT_ADDRESS = "0x0f346e19F01471C02485DF1758cfd3d624E399B4"

export default function useStaking() {
    const { canAccessApp, account } = useGlobalState()

    const { isLoading, data } = useQuery(["staked_perp", { account }], () => getStakedPerp(account), {
        enabled: canAccessApp,
    })

    return {
        isLoading,
        data,
    }
}
