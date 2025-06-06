import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type TPrice = {
    type: string,
    price: number,
    discountPrice: number
  }
export interface PriceState {
  prices: TPrice[]
}

const initialState: PriceState = {
  prices: []
}

export const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    setPrices: (state, action: PayloadAction<TPrice[]>) => {
      state.prices = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPrices } = priceSlice.actions

export default priceSlice.reducer