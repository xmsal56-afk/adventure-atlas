#!/usr/bin/env python3
"""Fetch real destination images from Wikipedia for Adventure Atlas."""
import re, json, urllib.request, urllib.parse, time, sys

def wiki_image(title):
    """Get the best image URL for a Wikipedia article."""
    params = urllib.parse.urlencode({
        'action': 'query',
        'titles': title,
        'prop': 'pageimages|extracts',
        'format': 'json',
        'pithumbsize': 800,
        'exintro': 1,
        'explaintext': 1,
    })
    url = f"https://en.wikipedia.org/w/api.php?{params}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'AdventureAtlas/1.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        pages = data.get('query', {}).get('pages', {})
        for pid, page in pages.items():
            if 'thumbnail' in page:
                return page['thumbnail']['source']
            # Try commons
            if 'pageimage' in page:
                # Construct commons URL
                img = page['pageimage']
                img_url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{urllib.parse.quote(img)}"
                return img_url
    except Exception as e:
        print(f"  Error for '{title}': {e}")
    return None

with open('src/data/destinations.js', 'r') as f:
    content = f.read()

names = re.findall(r'name:\s*"([^"]+)"', content)
images = re.findall(r'image:\s*"([^"]+)"', content)

print(f"Fetching real images for {len(names)} destinations...\n")

updates = 0
errors = 0
for i, name in enumerate(names):
    city = name.split(',')[0].strip()
    country = name.split(',')[-1].strip() if ',' in name else ''
    
    # Try city + country first, then just city
    searches = [f"{city}, {country}", city]
    
    img_url = None
    for search in searches:
        img_url = wiki_image(search)
        if img_url:
            break
    
    if img_url:
        old = images[i]
        content = content.replace(f'image: "{old}"', f'image: "{img_url}"', 1)
        updates += 1
        print(f"  ✓ {i+1}/{len(names)}: {name}")
    else:
        errors += 1
        print(f"  ✗ {i+1}/{len(names)}: {name} — no image found, keeping current")
    
    # Be nice to Wikipedia API
    time.sleep(0.3)

print(f"\nDone! Updated: {updates}, Failed: {errors}")

with open('src/data/destinations.js', 'w') as f:
    f.write(content)
