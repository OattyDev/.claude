# Nmap Timing & Performance Tuning

## Timing Templates (-T)

| Template | Name | Use Case |
|----------|------|----------|
| -T0 | Paranoid | IDS evasion, very slow, 1 probe at a time |
| -T1 | Sneaky | IDS evasion, slower |
| -T2 | Polite | Reduce network load, may be slow |
| -T3 | Normal | Default, balanced |
| -T4 | Aggressive | Fast networks, assumes reliable |
| -T5 | Insane | Fastest, may miss details |

## Timing Parameters

### Host Grouping (Parallel Scanning)
```bash
--min-hostgroup 50    # Min parallel hosts scanned
--max-hostgroup 50    # Max parallel hosts scanned
```

### Probe Parallelism
```bash
--min-parallelism 10   # Min probes per host
--max-parallelism 10   # Max probes per host
```

### RTT Timeout (Round Trip Time)
```bash
--min-rtt-timeout 100ms    # Min probe timeout
--max-rtt-timeout 300ms    # Max probe timeout
--initial-rtt-timeout 200ms # Initial timeout
```

### Retries
```bash
--max-retries 3    # Max probe retransmissions (default: 3)
--max-retries 0     # No retries (fast but unreliable)
```

### Host Timeout
```bash
--host-timeout 30m  # Give up on host after 30 min
--host-timeout 10s   # Quick timeout for fast scan
```

### Scan Delay
```bash
--scan-delay 1s      # Delay between probes
--max-scan-delay 10s # Max delay allowed
```

### Rate Limiting
```bash
--min-rate 100      # No slower than 100 packets/sec
--max-rate 1000      # No faster than 1000 packets/sec
```

## Practical Timing Examples

### Fast Discovery (Local Network)
```bash
nmap -sn -T5 192.168.1.0/24
# Uses ARP on local net, very fast
```

### Reliable General Scan
```bash
nmap -sV -T4 --max-retries 3 <target>
# Good balance of speed and accuracy
```

### Slow Stealth Scan (IDS Evasion)
```bash
nmap -sS -T0 -f --max-retries 2 --host-timeout 60s <target>
```

### UDP Scan (Very Slow by Nature)
```bash
nmap -sU -T2 --max-retries 2 --top-ports 100 <target>
# UDP is inherently slow, use slow timing
```

### Aggressive Scan with Output
```bash
nmap -A -T4 -oA scan_results <target>
# OS, version, scripts, traceroute all in one
```

## Performance Notes

1. **Local network scans** are fastest - use ARP discovery (`-sn` without `-PR` on local subnet)
2. **UDP scans** are 10-100x slower than TCP - scan only what's needed
3. **Version detection** (`-sV`) adds significant time - intensity 2-5 is usually enough
4. **NSE scripts** add variable time depending on script complexity
5. **Fragmentation** (`-f`) adds overhead and slows scans
6. **Decoys** (`-D`) multiply traffic and detection

## Bandwidth Considerations

| Scan Type | Typical Bandwidth |
|-----------|-------------------|
| Ping sweep (-sn) | Low |
| SYN scan (-sS) | Medium |
| Connect scan (-sT) | Medium |
| UDP scan (-sU) | Medium |
| Version scan (-sV) | High |
| Aggressive scan (-A) | Very High |

## Optimization Tips

1. **Scan in batches** for large networks - break into /24s
2. **Use --top-ports** instead of -p- for quick assessment
3. **Disable DNS** with `-n` for faster scanning
4. **Use --max-rate** to limit bandwidth usage
5. **Prefer SYN scan** (-sS) over TCP Connect (-sT) for speed
6. **Pre-scan with -sn** to filter dead hosts before port scan