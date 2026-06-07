import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'

interface DebtReminderEmailProps {
  username: string
  creditorName: string
  groupName: string
  groupId: string
  amount: number
}

const baseUrl = process.env.PAGE_URL
  ? `https://${process.env.PAGE_URL}`
  : 'http://localhost:3000'

export const DebtReminderEmail = ({
  username,
  creditorName,
  groupName,
  groupId,
  amount
}: DebtReminderEmailProps) => {
  const previewText = `${creditorName} te recuerda una deuda de ${amount.toFixed(2)} en ${groupName}`
  const groupUrl = `${baseUrl}/groups/${groupId}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/split-group.png`}
                width="40"
                height="37"
                alt="SplitGroup"
                className="mx-auto my-0"
              />
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              Hola {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              {creditorName} te recuerda que tenés una deuda pendiente de{' '}
              <strong>{amount.toFixed(2)}</strong> en el grupo {groupName}.
            </Text>
            <Section className="mt-[24px] mb-[16px] text-center">
              <Button
                className="rounded bg-[#f54e00] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={groupUrl}
              >
                Ver balance del grupo
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
