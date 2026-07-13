#!/usr/bin/env python3
"""Price Tracker Checker — run periodically to check tracked prices.

Usage:
  python3 scripts/check_prices.py           # Check and output status
  python3 scripts/check_prices.py --alert   # Only show items at/below target
"""

import json, os, sys
from pathlib import Path

STORAGE_FILE = Path.home() / ".hermes" / "price-tracker.json"

SAMPLE_PRICES = {
    "airpods-pro": 249, "macbook-air": 1099, "ipad-air": 599,
    "ps5": 499, "xbox-x": 499, "switch-oled": 349,
    "sony-wh": 399, "samsung-s25": 1299, "pixel-9": 999,
    "ipad-pro": 999, "airpods-4": 179, "apple-watch": 399,
    "dyson-v15": 749, "ninja-creami": 199, "instant-pot": 99,
    "kindle-pw": 159, "echo-dot": 49, "roomba-j9": 899,
    "lg-c4": 1799, "sony-bravia": 2799, "bose-qc": 429,
    "nintendo-games": 99, "airtag-4": 99, "meta-quest": 299,
    "ring-doorbell": 229,
}

PRODUCT_NAMES = {
    "airpods-pro": "Apple AirPods Pro 2", "macbook-air": "MacBook Air M3",
    "ipad-air": "iPad Air M2", "ps5": "PlayStation 5 Slim",
    "xbox-x": "Xbox Series X", "switch-oled": "Nintendo Switch OLED",
    "sony-wh": "Sony WH-1000XM5", "samsung-s25": "Galaxy S25 Ultra",
    "pixel-9": "Pixel 9 Pro", "ipad-pro": "iPad Pro M4 11\"",
    "airpods-4": "AirPods 4", "apple-watch": "Apple Watch Series 10",
    "dyson-v15": "Dyson V15 Detect", "ninja-creami": "Ninja CREAMi",
    "instant-pot": "Instant Pot Duo Plus", "kindle-pw": "Kindle Paperwhite",
    "echo-dot": "Echo Dot 5th Gen", "roomba-j9": "Roomba j9+",
    "lg-c4": "LG C4 65\" OLED", "sony-bravia": "Sony Bravia A95L 65\"",
    "bose-qc": "Bose QC Ultra", "nintendo-games": "Switch Game Voucher",
    "airtag-4": "AirTag 4-Pack", "meta-quest": "Meta Quest 3S",
    "ring-doorbell": "Ring Doorbell Pro 2",
}

PRICE_VARIATION = {
    "airpods-pro": 15, "macbook-air": 100, "ipad-air": 50,
    "ps5": 30, "xbox-x": 30, "switch-oled": 20,
    "sony-wh": 30, "samsung-s25": 100, "pixel-9": 80,
    "ipad-pro": 80, "airpods-4": 10, "apple-watch": 30,
    "dyson-v15": 50, "ninja-creami": 15, "instant-pot": 10,
    "kindle-pw": 10, "echo-dot": 5, "roomba-j9": 60,
    "lg-c4": 150, "sony-bravia": 200, "bose-qc": 30,
    "nintendo-games": 5, "airtag-4": 10, "meta-quest": 30,
    "ring-doorbell": 20,
}

def load_tracked():
    if not STORAGE_FILE.exists():
        return []
    try:
        with open(STORAGE_FILE) as f:
            return json.load(f)
    except:
        return []

def save_tracked(items):
    STORAGE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STORAGE_FILE, "w") as f:
        json.dump(items, f, indent=2)

def check_prices(items):
    import random
    alerts = []
    for item in items:
        pid = item.get("id")
        base = SAMPLE_PRICES.get(pid)
        variation = PRICE_VARIATION.get(pid, 20)
        if base:
            new_price = round(base + random.uniform(-variation * 0.5, variation * 0.3), 0)
            item["latestPrice"] = new_price
            item["lastChecked"] = __import__("datetime").datetime.now().isoformat()
            target = item.get("targetPrice")
            if target and new_price <= target:
                alerts.append(item)
    return items, alerts

def main():
    items = load_tracked()
    if not items:
        print("📉 No items being tracked.")
        print("Track products from the Price Tracker page, then sync data here.")
        return

    items, alerts = check_prices(items)
    save_tracked(items)

    only_alerts = "--alert" in sys.argv

    if only_alerts:
        if not alerts:
            return  # silent — nothing to alert
        print(f"🎯 PRICE ALERT{'S' if len(alerts) > 1 else ''}")
        for a in alerts:
            name = PRODUCT_NAMES.get(a["id"], a["id"])
            print(f"✅ {name} — ${a['latestPrice']} (target: ${a['targetPrice']})")
        return

    print(f"📉 Price Check — {len(items)} item{'s' if len(items) > 1 else ''}")
    print("─" * 40)
    for item in items:
        name = PRODUCT_NAMES.get(item["id"], item["id"])
        price = item.get("latestPrice", "?")
        target = item.get("targetPrice")
        if target and price != "?" and price <= target:
            status = "🎯 HIT TARGET"
        elif target:
            status = f"${price} (target: ${target})"
        else:
            status = f"${price} (no target set)"
        print(f"  {name:<30} {status}")
    print("─" * 40)
    if alerts:
        print(f"🎯 {len(alerts)} alert{'s' if len(alerts) > 1 else ''}!")
    print("✅ Done")

if __name__ == "__main__":
    main()
