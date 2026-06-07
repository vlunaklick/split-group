import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import { WeeklyDigestData } from '@/data/apis/digest'

const baseUrl = process.env.PAGE_URL
  ? `https://${process.env.PAGE_URL}`
  : 'http://localhost:3000'

function formatMoney (value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(value)
}

export const WeeklyDigestEmail = ({
  userName,
  netBalance,
  totalDebt,
  totalRevenue,
  weeklySpent,
  groupCount,
  pending,
  recentSpendings
}: WeeklyDigestData) => {
  const previewText = `Tu semana en Split Group: ${formatMoney(netBalance)} de balance neto`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[520px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Text className="text-[14px] leading-[24px] text-black">
              Hola {userName},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Este es tu resumen semanal en Split Group.
            </Text>

            <Section className="my-[16px] rounded border border-solid border-[#eaeaea] p-[12px]">
              <Text className="m-0 text-[12px] uppercase text-[#807d72]">Balance neto</Text>
              <Text className="m-0 text-[20px] font-semibold text-black">{formatMoney(netBalance)}</Text>
              <Text className="mb-0 mt-[8px] text-[13px] text-[#5a5852]">
                Te deben {formatMoney(totalRevenue)} · Debés {formatMoney(totalDebt)}
              </Text>
              <Text className="mb-0 mt-[4px] text-[13px] text-[#5a5852]">
                Tu parte esta semana: {formatMoney(weeklySpent)} · {groupCount} grupos activos
              </Text>
            </Section>

            {pending.length > 0 && (
              <Section className="my-[16px]">
                <Text className="text-[13px] font-semibold text-black">Por saldar</Text>
                {pending.map((item, index) => (
                  <Text key={index} className="mb-[4px] text-[13px] text-[#5a5852]">
                    {item.personName} · {item.groupName}: {formatMoney(item.amount)}
                  </Text>
                ))}
              </Section>
            )}

            {recentSpendings.length > 0 && (
              <Section className="my-[16px]">
                <Text className="text-[13px] font-semibold text-black">Gastos recientes</Text>
                {recentSpendings.map((spending, index) => (
                  <Text key={index} className="mb-[4px] text-[13px] text-[#5a5852]">
                    {spending.name} ({spending.groupName}): {formatMoney(spending.value)}
                  </Text>
                ))}
              </Section>
            )}

            <Section className="mt-[24px] text-center">
              <Button
                className="rounded bg-[#f54e00] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`${baseUrl}/dashboard`}
              >
                Ver mi inicio
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
