import "server-only";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { lazyImport } from "./lazy-import";
const webauthn = {
  generateRegistrationOptions: async (...args: any[]) => {
    const mod: any = await lazyImport("@simplewebauthn/" + "server");
    return mod.generateRegistrationOptions(...(args as any));
  },
  generateAuthenticationOptions: async (...args: any[]) => {
    const mod: any = await lazyImport("@simplewebauthn/" + "server");
    return mod.generateAuthenticationOptions(...(args as any));
  },
  verifyRegistrationResponse: async (...args: any[]) => {
    const mod: any = await lazyImport("@simplewebauthn/" + "server");
    return mod.verifyRegistrationResponse(...(args as any));
  },
  verifyAuthenticationResponse: async (...args: any[]) => {
    const mod: any = await lazyImport("@simplewebauthn/" + "server");
    return mod.verifyAuthenticationResponse(...(args as any));
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */
import type {
  AuthenticationResponseJSON,
  AuthenticatorTransport,
  RegistrationResponseJSON,
} from "@simplewebauthn/types";
import { getDB } from "@/db";
import { passKeyCredentialTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import isProd from "./is-prod";
import { SITE_NAME, SITE_DOMAIN, SITE_URL } from "@/constants";

const rpName = SITE_NAME;
const rpID = isProd ? SITE_DOMAIN : "localhost";
const origin = SITE_URL;

export async function generatePasskeyRegistrationOptions(userId: string, email: string) {
  const db = getDB();
  const existingCredentials = await db.query.passKeyCredentialTable.findMany({
    where: eq(passKeyCredentialTable.userId, userId),
  });

  const options = await webauthn.generateRegistrationOptions({
    rpName,
    rpID,
    userID: Buffer.from(userId),
    userName: email,
    attestationType: "none",
    excludeCredentials: existingCredentials.map(cred => ({
      id: cred.credentialId,
      type: "public-key",
      transports: cred.transports ? JSON.parse(cred.transports) as AuthenticatorTransport[] : undefined,
    })),
  });

  return options;
}

export async function verifyPasskeyRegistration({
  userId,
  response,
  challenge,
  userAgent,
  ipAddress,
}: {
  userId: string;
  response: RegistrationResponseJSON;
  challenge: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}) {
  const verification = await webauthn.verifyRegistrationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error("Passkey registration failed");
  }

  const { credential, aaguid } = verification.registrationInfo;

  const db = getDB();
  await db.insert(passKeyCredentialTable).values({
    userId,
    credentialId: credential.id,
    credentialPublicKey: Buffer.from(credential.publicKey).toString("base64url"),
    counter: 0, // Initial counter value for new registrations
    transports: response.response.transports ? JSON.stringify(response.response.transports) : null,
    aaguid: aaguid || null,
    userAgent,
    ipAddress,
  });

  return verification;
}

export async function generatePasskeyAuthenticationOptions() {
  const db = getDB();
  const credentials = await db.query.passKeyCredentialTable.findMany();

  const options = await webauthn.generateAuthenticationOptions({
    rpID,
    allowCredentials: credentials.map(cred => ({
      id: cred.credentialId,
      type: "public-key",
      transports: cred.transports ? JSON.parse(cred.transports) as AuthenticatorTransport[] : undefined,
    })),
  });

  return options;
}

export async function verifyPasskeyAuthentication(
  response: AuthenticationResponseJSON,
  challenge: string
) {
  const credentialId = response.id;

  const db = getDB();
  const credential = await db.query.passKeyCredentialTable.findFirst({
    where: eq(passKeyCredentialTable.credentialId, credentialId),
  });

  if (!credential) {
    throw new Error("Passkey not found");
  }

  const verification = await webauthn.verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
    credential: {
      id: credential.credentialId,
      publicKey: Buffer.from(credential.credentialPublicKey, "base64url"),
      counter: credential.counter,
      transports: credential.transports ? JSON.parse(credential.transports) : undefined,
    },
  });

  if (!verification.verified) {
    throw new Error("Passkey authentication failed");
  }

  // Update the counter
  await db
    .update(passKeyCredentialTable)
    .set({ counter: verification.authenticationInfo.newCounter })
    .where(eq(passKeyCredentialTable.credentialId, credential.credentialId));

  return {
    verification,
    credential,
  };
}
