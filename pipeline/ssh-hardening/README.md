# Evansh Services — SSH Hardening Guide & Deployment Protocol

## Target Environments
- **Ubuntu 22.04 LTS (Jammy Jellyfish)**
- **Ubuntu 24.04 LTS (Noble Numbat)**

---

## 1. Files in this Package
1. `99-evansh-hardening.conf`: OpenSSH modular drop-in configuration (`/etc/ssh/sshd_config.d/99-evansh-hardening.conf`).
2. `jail.local`: Fail2Ban jail configuration (`/etc/fail2ban/jail.local`).
3. `harden-ssh.sh`: Automated, non-destructive audit, backup, patch, and verification script.

---

## 2. One-Step Execution (Target Server)

Copy the files to the target server or run directly via `sudo`:

```bash
# Upload and run
scp -r pipeline/ssh-hardening user@server-ip:~/
ssh user@server-ip "sudo bash ~/ssh-hardening/harden-ssh.sh"
```

Or execute line-by-line using the surgical commands below.

---

## 3. Surgical Implementation & Hardening Controls

### A. Authentication Controls
```ini
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PermitEmptyPasswords no
KbdInteractiveAuthentication no
UsePAM yes
MaxAuthTries 3
LoginGraceTime 30
```

### B. Modern Cryptographic Ciphers, MACs, & KEX
```ini
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,ecdh-sha2-nistp521,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
HostKeyAlgorithms ssh-ed25519,rsa-sha2-512,rsa-sha2-256
```

### C. Session & Connection Limits
```ini
ClientAliveInterval 300
ClientAliveCountMax 2
MaxSessions 3
MaxStartups 10:30:60
TCPKeepAlive no
```

### D. Access Restriction & Forwarding
```ini
X11Forwarding no
AllowTcpForwarding no
AllowAgentForwarding no
PermitTunnel no
```

### E. Logging & Audit
```ini
LogLevel VERBOSE
SyslogFacility AUTH
```

---

## 4. Verification & Break-Detection Commands

```bash
# 1. Test syntax prior to reload
sudo sshd -t

# 2. Check active running parameters
sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication|maxauthtries|ciphers'

# 3. Reload SSH safely
sudo systemctl reload ssh

# 4. Fail2Ban SSH jail verification
sudo fail2ban-client status sshd
```
