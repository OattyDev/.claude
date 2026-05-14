# Nmap NSE Scripts Reference

## What is NSE?

Nmap Scripting Engine (NSE) uses Lua to run scripts for advanced discovery, vulnerability detection, exploitation, and more.

## Script Locations

```
/usr/share/nmap/scripts/     # Kali Linux scripts
~/.nmap/scripts/             # User scripts
```

## Update Script Database
```bash
nmap --script-updatedb
```

## Script Arguments

```bash
# Pass key=value arguments
nmap --script http-title --script-args http.useragent="Mozilla 5.0" <target>

# Pass from file
nmap --script-args-file args.txt <target>

# Trace script activity
nmap --script-trace <target>
```

## Common Scripts by Category

### default (run with -sC)
```
dns-zone-transfer     # Try AXFR zone transfer
http-ls               # List FTP directory listings
http-title            # Get page title
http-headers          # Get HTTP headers
imap-ntlm-info        # Extract NTLM info from IMAP
smb-os-discovery     # SMB OS and version info
smb-security-mode     # SMB security level
ssh-run              # Run arbitrary commands
```

### discovery
```
dns-brute            # DNS subdomain brute-force
dns-recursion        # Check if DNS recurses
snmp-info            # Extract SNMP info
snmp-sysdescr        # Get SNMP sysDescr
broadcast-upnp-info  # UPnP info via broadcast
msrpc-enum          # MSRPC endpoint enumeration
```

### vuln
```
smb-vuln-ms17-010    # EternalBlue (MS17-010)
smb-vuln-ms08-067    # MS08-067
smb-vuln-conficker   # Conficker detection
smb-vuln-cve2009-0508
smb-vuln-cve2017-0143
http-csrf           # Check for CSRF vulnerabilities
http-sql-injection  # SQL injection tests
http-enum           # Enumerate common web dirs
http-backup-finder  # Find backup files
http-iis-short-dir-brute  # IIS short filename enum
ssl-cert            # Retrieve SSL certificate
ssl-heartbleed      # Heartbleed check
ssl-v2              # Check for SSLv2
tls-heartbleed      # TLS Heartbleed
```

### exploit
```
smb-vuln-ms17-010    # Exploit EternalBlue (CAREFUL!)
http-shellshock      # Shellshock CVE-2014-6271
```

### auth
```
ftp-anon             # Check if FTP allows anonymous
smb-brute            # SMB password brute-force
smb-loggedin-users   # List logged-in users
ssh-auth-methods     # Get SSH auth methods
mysql-brute          # MySQL password brute-force
postgresql-brute     # PostgreSQL brute-force
```

### brute
```
http-brute           # HTTP basic/digest auth brute
http-form-brute      # Form-based brute-force
smb-brute            # SMB brute-force
mysql-brute          # MySQL brute
redis-brute          # Redis brute
```

### external
```
whois                # WHOIS lookup
dns-blacklist        # Check IP against DNSBL
```

### safe
```
dns-zone-transfer     # Zone transfer (informational)
http-favicon         # Get favicon
http-generator       # Get generator meta tag
http-robots.txt      # Parse robots.txt
ssl-cert            # SSL certificate info
targets-axfr         # Zone transfer from nameservers
```

## Useful Script Commands

```bash
# List all available scripts
ls /usr/share/nmap/scripts/

# Get help on specific script
nmap --script-help=<script-name>

# Scan with multiple categories
nmap --script="discovery,safe" <target>

# Exclude problematic scripts
nmap --script="default" --script-exclude="ssh-run" <target>

# Scan with vulnerability scripts
nmap --script=vuln <target>

# Scan with specific script + arguments
nmap --script ssh-hostkey --script-args verify=true <target>

# Wildcard script matching
nmap --script "http-*" <target>                 # All http scripts
nmap --script "smb-vuln-*" <target>             # All SMB vuln scripts
nmap --script "ssl-*" <target>                   # All SSL scripts

# Script categories with negation
nmap --script "not exploit" <target>             # All except exploit
nmap --script "default or vuln" <target>        # Default + vuln combined

# Scan specific script file
nmap --script /path/to/custom-script.nse <target>
```

## Script Output Example

```
PORT    STATE SERVICE
22/tcp  open  ssh
| ssh-hostkey:
|   2048 79:.... (RSA)
|_  1024 8d:.... (DSA)

80/tcp  open  http
| http-title: Go ahead and ScanMe!
|_http-headers: Server: Apache/2.2.14
```

## Important Notes

1. **Many scripts require root/Administrator privileges**
2. **exploit scripts can be destructive - use with care**
3. **vuln scripts are read-only checks for vulnerabilities**
4. **Some scripts may crash buggy services**
5. **Always check script help before running unfamiliar scripts**
6. **Script database needs updating: `nmap --script-updatedb`**

## Script Meta Fields

Scripts have metadata fields:
- `categories` - What categories they belong to
- `action` - What the script does
- `args` - Arguments the script accepts
- `output` - Output format

```lua
-- Example script header
description = [[
Checks for CVE-2014-6271 (Shellshock) vulnerability
]]
categories = {"exploit", "vuln", "auth"}
author = "Nmap"
license = "Same as Nmap"
```