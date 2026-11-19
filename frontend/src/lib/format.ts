const dateFmt = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const timeFmt = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' })

const moneyFmt = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso))
}

export function formatTime(iso: string) {
  return timeFmt.format(new Date(iso))
}

export function formatMoney(value: number) {
  return value === 0 ? 'Ücretsiz' : moneyFmt.format(value)
}

export function isPast(iso: string) {
  return new Date(iso).getTime() < Date.now()
}
