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

interface WelcomeEmailProps {
  username: string
  firstName: string
}

const baseUrl = process.env.PAGE_URL
  ? `https://${process.env.PAGE_URL}`
  : 'http://localhost:3000'

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ username, firstName }) => {
  const previewText = `¡Hola ${firstName}! Gracias por registrarte en SplitGroup.`

  const hrefLogin = `${baseUrl}/login`

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
              Estamos emocionados de darte la bienvenida a SplitGroup. En nuestra plataforma podrás compartir gastos con tus amigos y familiares de forma sencilla y segura además de dividirlos y llevar un control de las deudas que hay sobre los mismos. ¡Esperamos que disfrutes de tu experiencia!
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Si tienes alguna pregunta, no dudes en ponerte en contacto con nosotros.
            </Text>

            <Button
              href={hrefLogin}
              className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
            >
              Iniciar sesión
            </Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
