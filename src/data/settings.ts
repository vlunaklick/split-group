import useSWR from 'swr'
import { getAvailableCurrency, getUserConfiguration } from './actions/settings'

export function useGetUserConfiguration ({ userId }: { userId: string }) {
  return useSWR(`/api/users/${userId}/notifications-wanted`, async () => await getUserConfiguration(userId))
}

export function useGetAlertsSizeSelected () {
  return useSWR('alert-size-setting', async () => {
    const alert = localStorage.getItem('alert-size')
    return alert
  })
}

export function useGetAvailableCurrencies () {
  return useSWR('currencies-settings', getAvailableCurrency)
}

export function useGetSelectedCurrency () {
  return useSWR('currency-setting', async () => {
    const currency = localStorage.getItem('currency')
    return currency
  })
}
