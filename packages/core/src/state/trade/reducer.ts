import { createReducer } from '@reduxjs/toolkit'
import { InputField, PositionType, OrderType } from '@symmio-client/core/types/trade'
import {
  setTradeState,
  updateOrderType,
  updateLimitPrice,
  updateMarketId,
  updateInputField,
  updateTypedValue,
  updatePositionType,
  updateLockedPercentages,
} from './actions'
import { TradeState } from './types'

export const initialState: TradeState = {
  marketId: undefined,
  inputField: InputField.PRICE,
  orderType: OrderType.LIMIT,
  positionType: PositionType.LONG,
  limitPrice: '',
  typedValue: '',
  cva: undefined,
  mm: undefined,
  lf: undefined,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setTradeState, (state, action) => {
      return action.payload
    })
    .addCase(updateMarketId, (state, { payload }) => {
      state.marketId = payload.id
    })
    .addCase(updateOrderType, (state, action) => {
      state.orderType = action.payload
    })
    .addCase(updateInputField, (state, action) => {
      state.inputField = action.payload
    })
    .addCase(updateLimitPrice, (state, action) => {
      state.limitPrice = action.payload
    })
    .addCase(updateTypedValue, (state, action) => {
      state.typedValue = action.payload
    })
    .addCase(updatePositionType, (state, action) => {
      state.positionType = action.payload
    })
    .addCase(updateLockedPercentages, (state, { payload: { cva, mm, lf } }) => {
      state.cva = cva
      state.mm = mm
      state.lf = lf
    })
)
