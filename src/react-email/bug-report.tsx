import { Body, Container, Head, Heading, Html, Text, Link } from '@react-email/components'
import * as React from 'react'
import { SITE_DOMAIN } from '@/constants'

interface BugReportEmailProps {
  name?: string
  email?: string
  description: string
  screenshotUrl?: string
}

export const BugReportEmail = ({
  name = 'N/A',
  email = 'N/A',
  description,
  screenshotUrl,
}: BugReportEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={preheader}>Új hibajelentés</Heading>
          <Text style={paragraph}>Név: {name}</Text>
          <Text style={paragraph}>Email: {email}</Text>
          <Text style={paragraph}>Leírás:</Text>
          <Text style={paragraph}>{description}</Text>
          {screenshotUrl && (
            <Text style={paragraph}>
              Kép: <Link href={screenshotUrl}>{screenshotUrl}</Link>
            </Text>
          )}
        </Container>
        <Text style={footer}>
          Ez egy automatikus üzenet a {SITE_DOMAIN} rendszertől.
        </Text>
      </Body>
    </Html>
  )
}

BugReportEmail.PreviewProps = {
  name: 'Felhasználó',
  email: 'user@example.com',
  description: 'Valami hiba történt...',
  screenshotUrl: 'https://example.com/screenshot.png',
} as BugReportEmailProps

export default BugReportEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  marginTop: '30px',
}
const container = {
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  margin: '0 auto',
  padding: '20px',
  width: '480px',
}
const preheader = { color: '#333333', fontSize: '20px', fontWeight: 'bold' }
const paragraph = { color: '#333333', fontSize: '16px', lineHeight: '24px' }
const footer: React.CSSProperties = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '20px',
  textAlign: 'center',
}
