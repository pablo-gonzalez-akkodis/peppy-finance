import { createAction } from '@reduxjs/toolkit'

import { ConnectionStatus, MarketDataMap, MarketDepthMap, MarketDepthData } from './types'

export const updateWebSocketStatus = createAction<{ status: ConnectionStatus }>('hedger/updateWebSocketStatus')
export const updateHedgerId = createAction<{ id: string }>('hedger/updateHedgerId')
export const updatePrices = createAction<{ prices: MarketDataMap }>('hedger/updatePrices')
export const updateDepths = createAction<{ depths: MarketDepthMap }>('hedger/updateDepths')
export const updateDepth = createAction<{ name: string; depth: MarketDepthData }>('hedger/updateDepth')
