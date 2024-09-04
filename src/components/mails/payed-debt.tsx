import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import * as React from 'react'

interface PayedDebtEmailProps {
  username: string
  payer: string
  groupName: string
  amount?: number
  allDebt: boolean
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const PayedDebtEmail: React.FC<PayedDebtEmailProps> = ({ username, groupName, amount, payer, allDebt }) => {
  const previewText = allDebt
    ? `¡Hola ${username}! ${payer} te ha pagado todas tus deudas en el grupo ${groupName}.`
    : `¡Hola ${username}! ${payer} te ha pagado la deuda de ${amount?.toFixed(2)} en el grupo ${groupName}.`

  const hrefGroup = `${baseUrl}/groups/${groupName}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/split-group.png`}
                width="40"
                height="37"
                alt="SplitGroup"
                className="my-0 mx-auto"
              />
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Hola {username},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {payer} te ha pagado {allDebt ? 'todas tus deudas' : `la deuda de ${amount?.toFixed(2)}`} en el grupo{' '}
              <Link href={hrefGroup} className="underline">{groupName}</Link>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
