import useSWR from 'swr'

export function useGetUserConfiguration () {
  return useSWR('user-config', async () => {
    return await fetch('/api/users/settings?userConfig=true').then(res => res.json())
  })
}

export function useGetAlertsSizeSelected () {
  return useSWR('alert-size-setting', async () => {
    const alert = localStorage.getItem('alert-size')
    return alert
  })
}

export function useGetAvailableCurrencies () {
  return useSWR('currencies-settings', async () => {
    return await fetch('/api/users/settings?availableCurrency=true').then(res => res.json())
  })
}

export function useGetSelectedCurrency () {
  return useSWR('currency-setting', async () => {
    const currency = localStorage.getItem('currency')
    return currency
  })
}

export function useGetCategories () {
  return useSWR('categories-settings', async () => {
    return await fetch('/api/users/settings?categories=true').then(res => res.json())
  })
}
