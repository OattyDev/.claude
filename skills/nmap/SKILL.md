---
name: nmap
description: Use when performing network reconnaissance, port scanning, service enumeration, OS detection, or security auditing against known/authorized targets
---

# Nmap - Network Discovery & Security Scanning

## Overview

Nmap ("Network Mapper") rapidly probes networks to discover hosts, services, operating systems, and firewall configurations using raw IP packets. It is the industry-standard tool for network inventory, security assessments, and penetration testing reconnaissance.

## Core Scan Types

### Host Discovery (No Port Scan)
```bash
nmap -sn 192.168.1.0/24          # Ping scan - discover live hosts
nmap -sL 10.0.0.0/24            # List scan - enumerate targets only
nmap -Pn 10.0.0.1                # Treat host as online (skip discovery)
```

### Basic Port Scans
```bash
nmap 192.168.1.1                  # Default: SYN scan + top 1000 ports
nmap -sT 192.168.1.1              # TCP Connect scan (full handshake)
nmap -sU 192.168.1.1              # UDP scan (slow - scan common UDP ports first)
nmap -sS 192.168.1.1              # TCP SYN scan (stealthy, no full handshake)
```

### Stealth Scans (Firewall Evasion)
```bash
nmap -sN 192.168.1.1              # Null scan (no flags set)
nmap -sF 192.168.1.1              # FIN scan
nmap -sX 192.168.1.1              # Xmas scan (FIN, PSH, URG flags)
nmap -sI zombie:44444 192.168.1.1  # Idle scan (spoof source via zombie)
nmap -b ftp-server 192.168.1.1    # FTP bounce scan
```

### Version & OS Detection
```bash
nmap -sV 192.168.1.1              # Service/version detection
nmap -sV --version-intensity 5 192.168.1.1  # Intensity 0-9 (higher = more probes)
nmap -sV --version-light 192.168.1.1         # Intensity 2 (quick)
nmap -sV --version-all 192.168.1.1           # Intensity 9 (thorough)
nmap -sV --version-trace 192.168.1.1         # Debug version scan activity
nmap -O 192.168.1.1               # OS detection
nmap -O --osscan-limit 192.168.1.1           # Limit OS detection (faster)
nmap -O --osscan-guess 192.168.1.1            # Guess OS more aggressively
nmap -A 192.168.1.1                # OS + version + script + traceroute (aggressive)
```

### NSE Scripts (Lua-based security checks)
```bash
nmap -sC 192.168.1.1              # Default script scan (safeish checks)
nmap --script=http-enum 192.168.1.1      # Specific script
nmap --script=default,vuln 192.168.1.1  # Multiple categories
nmap --script-help=ssl-cert              # Get help for a script
nmap --script-args http.useragent="Mozilla" 192.168.1.1  # Pass script arguments
```

**Common Script Categories:**
- `default` - Safe scripts run with -sC
- `discovery` - Network exploration
- `auth` - Authentication checks
- `vuln` - Vulnerability scanning
- `exploit` - Exploitation scripts
- `brute` - Password brute-forcing
- `external` - External services (e.g.,whois)

### Timing & Performance
```bash
nmap -T0 192.168.1.1  # Paranoid (IDS evasion, very slow)
nmap -T1 192.168.1.1  # Sneaky
nmap -T2 192.168.1.1  # Polite (reduce network load)
nmap -T3 192.168.1.1  # Normal (default)
nmap -T4 192.168.1.1  # Aggressive (assumes fast network)
nmap -T5 192.168.1.1  # Insane (fastest, may miss details)
```

### Evasion & Spoofing
```bash
nmap -f 192.168.1.1                      # Fragment packets (bypass firewalls)
nmap --mtu 8 192.168.1.1                  # Custom MTU fragment size
nmap -D decoy1,decoy2,ME 192.168.1.1     # Decoy scan (hide real IP)
nmap -S 1.2.3.4 192.168.1.1               # Spoof source IP
nmap -e eth0 192.168.1.1                  # Use specific interface
nmap -g 53 192.168.1.1                    # Source port (firewall bypass)
nmap --source-port 53 192.168.1.1          # Alternate source port flag
nmap --data-length 50 192.168.1.1         # Append random data to packets
nmap --spoof-mac Cisco 192.168.1.1        # Spoof MAC address
nmap --proxies http://proxy:8080 192.168.1.1  # Route through proxies
nmap --max-rate 100 192.168.1.1            # Limit send rate (packets/sec)
nmap --min-rate 50 192.168.1.1             # Minimum send rate
nmap --max-scan-delay 100ms 192.168.1.1   # Max delay between probes
```

## Port Specification

```bash
nmap -p 22 192.168.1.1                    # Single port
nmap -p 22,80,443 192.168.1.1             # Multiple ports
nmap -p 1-1000 192.168.1.1                # Port range
nmap -p U:53,111,137 192.168.1.1         # UDP ports
nmap -p T:80,443 192.168.1.1              # TCP ports
nmap -p- 192.168.1.1                      # All 65535 ports
nmap -F 192.168.1.1                       # Fast scan (top 100 ports)
nmap -r 192.168.1.1                       # Scan ports sequentially (no random)
nmap --top-ports 100 192.168.1.1          # Top N most common ports
nmap --port-ratio 0.001 192.168.1.1       # Ports more common than ratio
nmap --exclude-ports 9000-9100 192.168.1.1 # Exclude port range
nmap --excludefile /path/to/excludes.txt 192.168.1.1  # Exclude from file
```

## Target Specification

```bash
nmap 192.168.1.1                          # Single IP
nmap 192.168.1.1-10                       # IP range
nmap 192.168.1.0/24                       # CIDR notation
nmap scanme.nmap.org                      # Hostname
nmap -iL hosts.txt                        # Input from file
nmap -iR 10                              # Random targets (10 hosts)
nmap --exclude 192.168.1.5 192.168.1.0/24 # Exclude host(s)
```

## Output Formats

```bash
nmap -oN scan.txt 192.168.1.1             # Normal text
nmap -oX scan.xml 192.168.1.1             # XML (for tools/diff)
nmap -oG scan.gnmap 192.168.1.1           # Grepable (easy parsing)
nmap -oS scan.txt 192.168.1.1             # Script kiddie format
nmap -oA scan 192.168.1.1                 # All formats at once

# Verbosity
nmap -v 192.168.1.1                       # Verbose
nmap -vv 192.168.1.1                      # Very verbose
nmap -d 192.168.1.1                       # Debugging (more detail)
nmap -dd 192.168.1.1                      # Very verbose debugging
```

### Other Output Options
```bash
nmap --open 192.168.1.1                  # Show only open ports
nmap --reason 192.168.1.1                # Show why port is in that state
nmap --packet-trace 192.168.1.1          # Show all packets sent/received
nmap --append-output 192.168.1.1          # Append to file (don't overwrite)
nmap --resume scan.gnmap                  # Resume aborted scan
```

## DNS & Resolution
```bash
nmap -n 192.168.1.1                       # Never resolve DNS
nmap -R 192.168.1.1                       # Always resolve DNS
nmap --dns-servers 8.8.8.8,1.1.1.1 192.168.1.1  # Custom DNS
nmap --system-dns 192.168.1.1            # Use OS DNS resolver
```

## Traceroute
```bash
nmap --traceroute 192.168.1.1             # Trace path to target
nmap -A 192.168.1.1                       # Includes traceroute with aggressive scan
```

## IPv6
```bash
nmap -6 2001:db8::1                       # IPv6 scanning
nmap -6 -sT 2001:db8::1                   # IPv6 TCP connect scan
nmap -6 -sU 2001:db8::1                   # IPv6 UDP scan
nmap -6 -sC 2001:db8::1                   # IPv6 script scan
```

## Advanced Options
```bash
nmap --datadir /custom/nmap/data 192.168.1.1   # Custom data directory
nmap --send-eth 192.168.1.1                    # Send raw ethernet frames
nmap --send-ip 192.168.1.1                      # Send raw IP packets
nmap --privileged 192.168.1.1                    # Assume full privileges
nmap --unprivileged 192.168.1.1                  # Assume no raw privileges
nmap --packet-trace 192.168.1.1                  # Show all sent/received packets
nmap --iflist 192.168.1.1                       # List interfaces and routes
nmap --no-stylesheet 192.168.1.1                 # Don't attach XSL stylesheet to XML
nmap --stylesheet /path/to/style.xsl 192.168.1.1 # Custom XSL stylesheet for XML
nmap --webxml 192.168.1.1                        # Use Nmap.org stylesheet for XML
nmap --noninteractive 192.168.1.1                 # Disable runtime keyboard interaction
nmap --ip-options "\x01\x02\x03" 192.168.1.1    # Send packets with IP options
nmap --ttl 64 192.168.1.1                        # Set IP time-to-live field
nmap --badsum 192.168.1.1                        # Send bogus TCP/UDP/SCTP checksums
nmap --data 00112233 192.168.1.1                 # Append hex payload to packets
nmap --data-string "custom data" 192.168.1.1     # Append ASCII string to packets
nmap --data-length 50 192.168.1.1                # Append random data to packets
nmap -h                                         # Show help summary
nmap -V                                         # Print version number
```

## Protocol Scan (sO)
```bash
nmap -sO 192.168.1.1              # IP protocol scan (which protocols respond)
nmap -sO -p 1,6,17 192.168.1.1    # Scan specific protocols only
```

## SCTP Scans
```bash
nmap -sY 192.168.1.1              # SCTP INIT scan (stealthy)
nmap -sZ 192.168.1.1              # SCTP COOKIE-ECHO scan
```

## Custom Scan Flags
```bash
nmap --scanflags URG,ACK 192.168.1.1    # Custom TCP flags
nmap --scanflags SYN,RST 192.168.1.1     # Another custom flag combo
```

## Host Timeout & Grouping
```bash
nmap --host-timeout 10m 192.168.1.1       # Give up after 10 minutes
nmap --host-timeout 5s 192.168.1.1        # Short timeout (fast scan)
nmap --min-hostgroup 100 192.168.1.1     # Parallel host group size
nmap --max-hostgroup 100 192.168.1.1      # Max parallel hosts
```

## Useful One-Liners

```bash
# Quick local network inventory
nmap -sn 192.168.1.0/24

# Scan for common web servers
nmap -p 80,443,8080,8443 -sV 192.168.1.0/24

# Find machines with specific OS
nmap -O --osscan-limit 192.168.1.0/24

# Full aggressive scan with output
nmap -A -T4 -oA scan_results 192.168.1.0/24

# UDP scan (top 100 ports)
nmap -sU --top-ports 100 -T4 192.168.1.1

# Check if host is up (ping sweep without port scan)
nmap -sn -PR 192.168.1.0/24  # ARP discovery (local network only)

# Scan for specific vulnerability
nmap --script smb-vuln-* 192.168.1.1

# SSL/TLS inspection
nmap --script ssl-cert,ssl-enum-ciphers -p 443 192.168.1.1

# HTTP methods / enumerations
nmap --script http-methods,http-enum,http-robots.txt 192.168.1.1

# DNS enumeration
nmap -p 53 --script dns-zone-transfer,dns-recursion 192.168.1.1

# Anonymous FTP check
nmap --script ftp-anon,ftp-bounce 192.168.1.1

# Wordlist scan for web dirs (with gobuster/nikto, not nmap)
# Note: nmap http scripts are for info, not directory brute-force

# Detect firewall (check for filtered ports)
nmap -sA 192.168.1.1              # ACK scan - maps firewall rules

# Scan from list file
nmap -iL target-list.txt -sV -p-

# Random target scanning (for research)
nmap -iR 20 -sT -p 22,80,443     # Scan 20 random targets for SSH/HTTP/HTTPS

# Grab banners quickly
nmap -sV -p 22,80,443 --script=banner 192.168.1.1

# SMB enumeration
nmap --script smb-enum-shares,smb-enum-users 192.168.1.1

# MySQL enumeration
nmap -p 3306 --script mysql-info,mysql-brute 192.168.1.1

# PostgreSQL enumeration
nmap -p 5432 --script pgsql-info,postgres-brute 192.168.1.1

# Redis enumeration
nmap -p 6379 --script redis-info,redis-brute 192.168.1.1

# Check for Heartbleed on SSL
nmap -p 443 --script tls-heartbleed 192.168.1.1

# Verbose OS detection with fallbacks
nmap -O --osscan-guess --max-retries 3 192.168.1.1

# Fast comprehensive scan (compromise)
nmap -sS -sV -sC -T4 -p- -oA quick_scan 192.168.1.1

# Ping sweep + port scan on discovered hosts
nmap -sn -PS22,80,443 192.168.1.0/24 -oA hosts && nmap -sV -p- -iL live_hosts.txt
```

## Quick Reference Table

| Goal | Command |
|------|---------|
| Is host alive? | `nmap -sn -PR <target>` (local) or `nmap -sn <target>` |
| Top 100 ports | `nmap -F <target>` |
| All ports | `nmap -p- <target>` |
| Service versions | `nmap -sV <target>` |
| OS detection | `nmap -O <target>` |
| Full aggressive | `nmap -A <target>` |
| UDP scan | `nmap -sU <target>` |
| Firewall stealth | `nmap -sS -f <target>` |
| Script scan | `nmap -sC <target>` |
| Specific scripts | `nmap --script=<name> <target>` |
| Evasion (decoys) | `nmap -D ME,decoy1,decoy2 <target>` |
| Output all formats | `nmap -oA <basename> <target>` |
| IP protocol scan | `nmap -sO <target>` |
| SCTP INIT scan | `nmap -sY <target>` |
| Idle scan (zombie) | `nmap -sI zombie:port <target>` |
| FTP bounce scan | `nmap -b ftp-server <target>` |
| IPv6 scan | `nmap -6 <ipv6-target>` |
| Custom TCP flags | `nmap --scanflags <flags> <target>` |
| Packet fragmentation | `nmap -f <target>` |
| MAC spoofing | `nmap --spoof-mac Cisco <target>` |
| Source port spoof | `nmap -g 53 <target>` |
| Traceroute | `nmap --traceroute <target>` |
| Resume scan | `nmap --resume <file>` |

## Common Mistakes

1. **Running UDP scans without patience** - UDP scans are 10-100x slower than TCP. Expect 30+ minutes for full UDP scans.

2. **Using -T5 on unreliable networks** - May miss ports due to dropped packets. Use -T3 or -T4.

3. **Not using -p- when you need all ports** - Default scan only checks ~1000 common ports. Many services run on non-standard ports.

4. **Forgetting -sV for version detection** - Version info is critical for vulnerability mapping. Always include -sV in comprehensive scans.

5. **NSE scripts running unintended exploits** - Script category `exploit` can be destructive. Use `vuln` instead for safe vulnerability checking.

6. **Ignoring filtered ports** - "Filtered" means a firewall is blocking the port. This is useful intel about network topology.

7. **MAC spoofing without --send-eth** - Spoofing MAC requires raw ethernet frames. Use `--send-eth` if not running as root.

## Port States Explained

| State | Meaning |
|-------|---------|
| `open` | Application listening, connection accepted |
| `closed` | No application listening (but accessible) |
| `filtered` | Firewall/filter blocking Nmap's probes |
| `unfiltered` | Responsive but Nmap can't determine open/closed |
| `open\|filtered` | Nmap can't determine between open and filtered |
| `closed\|filtered` | Nmap can't determine between closed and filtered |

## Legal Notice

**Only scan networks you own or have explicit written authorization for.** Unauthorized scanning is illegal in most jurisdictions. Nmap ships with a warning about this.

## See Also

- `references/nmap-scripts.md` - Full NSE script reference
- `references/nmap-timing.md` - Timing and performance tuning guide
- `templates/network-scan.sh` - Reusable network audit script template