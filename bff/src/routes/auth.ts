import { Router } from "express";
import { Client, Account, ID } from "node-appwrite";
import { config } from "../config/env";

const router = Router();

// Server-level admin account client
const serverClient = new Client()
  .setEndpoint(config.appwrite.endpoint)
  .setProject(config.appwrite.projectId)
  .setKey(config.appwrite.apiKey);

const serverAccount = new Account(serverClient);

function buildSessionClient(sessionSecret: string) {
  return new Client()
    .setEndpoint(config.appwrite.endpoint)
    .setProject(config.appwrite.projectId)
    .setSession(sessionSecret);
}

// GET /auth/me
router.get("/me", async (req, res) => {
  try {
    const sessionToken = req.cookies?.["appwrite-session"];
    if (!sessionToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const sessionClient = buildSessionClient(sessionToken);
    const user = await new Account(sessionClient).get();
    res.json(user);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const session = await serverAccount.createEmailPasswordSession(email, password);
    res.cookie("appwrite-session", session.secret, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ success: true });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
});

// POST /auth/logout
router.post("/logout", async (req, res) => {
  try {
    const sessionToken = req.cookies?.["appwrite-session"];
    if (sessionToken) {
      const sessionClient = buildSessionClient(sessionToken);
      await new Account(sessionClient).deleteSession("current");
    }
    res.clearCookie("appwrite-session");
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// POST /auth/register
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    await serverAccount.create(ID.unique(), email, password, name);
    const session = await serverAccount.createEmailPasswordSession(email, password);
    res.cookie("appwrite-session", session.secret, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// GET /auth/oauth/:provider
router.get("/oauth/:provider", async (req, res) => {
  const { provider } = req.params;
  const successUrl = process.env.OAUTH_SUCCESS_URL || "http://localhost:3000/auth/oauth-callback";
  const failureUrl = process.env.OAUTH_FAILURE_URL || "http://localhost:3000/login?error=true";
  const redirectUrl = `${config.appwrite.endpoint}/account/sessions/oauth2/${provider}?project=${config.appwrite.projectId}&success=${encodeURIComponent(successUrl)}&failure=${encodeURIComponent(failureUrl)}`;
  res.redirect(redirectUrl);
});

// POST /auth/callback
router.post("/callback", async (req, res) => {
  const { userId, secret } = req.body;
  try {
    const sessionClient = new Client()
      .setEndpoint(config.appwrite.endpoint)
      .setProject(config.appwrite.projectId);
    const session = await new Account(sessionClient).createSession(userId, secret);
    res.cookie("appwrite-session", session.secret, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// POST /auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const recoveryUrl = process.env.PASSWORD_RECOVERY_URL || "http://localhost:3000/reset-password";
    await serverAccount.createRecovery(email, recoveryUrl);
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// POST /auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { userId, secret, password } = req.body;
  try {
    await serverAccount.updateRecovery(userId, secret, password);
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
