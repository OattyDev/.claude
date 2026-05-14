#!/bin/bash
# Nmap Network Audit Script Template
# Usage: ./network-scan.sh <target> [options]
#
# Customize this template for your specific scanning needs.
# This script demonstrates common nmap patterns for security auditing.
#
# LEGAL: Only use on networks you own or have written authorization for.

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
TARGET=""
OUTPUT_DIR="nmap_scan_$(date +%Y%m%d_%H%M%S)"
SCAN_TYPE="quick"
VERBOSE=false

usage() {
    cat << EOF
Usage: $0 <target> [options]

Targets:
  IP, CIDR, hostname, or file (use -iL)

Scan Types:
  quick       - Top 100 ports, fast discovery
  full        - All ports, comprehensive
  stealth     - Slow, evasion techniques
  vuln        - Vulnerability assessment
  web         - Web-focused enumeration

Options:
  -o, --output DIR   Output directory (default: $OUTPUT_DIR)
  -t, --type TYPE    Scan type (see above)
  -v, --verbose      Verbose output
  -h, --help         Show this help

Examples:
  $0 192.168.1.0/24
  $0 10.0.0.1 -t full -o /tmp/scan_results
  $0 -iL targets.txt -t vuln

EOF
    exit 1
}

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -o|--output)
                OUTPUT_DIR="$2"
                shift 2
                ;;
            -t|--type)
                SCAN_TYPE="$2"
                shift 2
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                usage
                ;;
            *)
                TARGET="$1"
                shift
                ;;
        esac
    done
}

# Run nmap with common options
run_nmap() {
    local args="$@"
    if [[ "$VERBOSE" == true ]]; then
        log_info "Running: nmap $args"
    fi
    nmap $args
}

# Quick scan - fast discovery
scan_quick() {
    log_info "Running quick scan on $TARGET"
    mkdir -p "$OUTPUT_DIR"

    run_nmap -sn -T5 "$TARGET" -oA "$OUTPUT_DIR/hosts_discovered"

    # Quick port scan on discovered hosts
    run_nmap -F -sV -T4 "$TARGET" \
        -oA "$OUTPUT_DIR/ports_quick" \
        --open
}

# Full comprehensive scan
scan_full() {
    log_info "Running full scan on $TARGET"
    mkdir -p "$OUTPUT_DIR"

    run_nmap -p- -sV -sS -A -T4 "$TARGET" \
        -oA "$OUTPUT_DIR/scan_full" \
        --open \
        --reason
}

# Stealth scan - slow with evasion
scan_stealth() {
    log_info "Running stealth scan on $TARGET"
    mkdir -p "$OUTPUT_DIR"

    run_nmap -p- -sS -f --mtu 8 -T0 \
        --max-retries 2 \
        --host-timeout 30m \
        "$TARGET" \
        -oA "$OUTPUT_DIR/scan_stealth" \
        --open
}

# Vulnerability scan
scan_vuln() {
    log_info "Running vulnerability scan on $TARGET"
    mkdir -p "$OUTPUT_DIR"

    run_nmap -sV --script vuln,exploit,discovery \
        -T3 "$TARGET" \
        -oA "$OUTPUT_DIR/scan_vuln"
}

# Web-focused scan
scan_web() {
    log_info "Running web-focused scan on $TARGET"
    mkdir -p "$OUTPUT_DIR"

    run_nmap -p 80,443,8080,8443,3000,5000 \
        -sV --script http-enum,http-title,http-headers,ssl-cert,ssl-heartbleed \
        -T4 "$TARGET" \
        -oA "$OUTPUT_DIR/scan_web"
}

main() {
    parse_args "$@"

    if [[ -z "$TARGET" ]]; then
        log_error "Target is required"
        usage
    fi

    log_info "Output directory: $OUTPUT_DIR"
    log_info "Scan type: $SCAN_TYPE"

    case "$SCAN_TYPE" in
        quick)
            scan_quick
            ;;
        full)
            scan_full
            ;;
        stealth)
            scan_stealth
            ;;
        vuln)
            scan_vuln
            ;;
        web)
            scan_web
            ;;
        *)
            log_error "Unknown scan type: $SCAN_TYPE"
            usage
            ;;
    esac

    log_info "Scan complete! Results in: $OUTPUT_DIR"
}

main "$@"