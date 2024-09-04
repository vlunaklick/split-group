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
import * as React from 'react'

interface GroupInviteEmailProps {
  username: string
  groupName: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const GroupInviteEmail: React.FC<GroupInviteEmailProps> = ({ username, groupName }) => {
  const previewText = `¡Hola ${username}! Has sido invitado a unirte al grupo ${groupName}.`
  const hrefJoinGroup = `${baseUrl}/notifications`

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
              Has sido invitado a unirte al grupo {groupName}. Si no deseas unirte, ignora este mensaje.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Para unirte al grupo, haz clic en el siguiente botón.
            </Text>

            <Button
              href={hrefJoinGroup}
              className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
            >
              Unirme al grupo
            </Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
